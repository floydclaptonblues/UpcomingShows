(() => {
'use strict';
const c = window.ADMIN_CONFIG;
if (!c || !['bmc', 'sierra'].includes(c.mode)) throw Error('Missing admin configuration.');
const $ = (id) => document.getElementById(id);
const field = (form, name) => form.elements.namedItem(name);
const vaultName = 'encrypted-github-token-v1:' + c.owner + '/' + c.repository;
const endpoint = 'https://api.github.com/repos/' + encodeURIComponent(c.owner) + '/' + encodeURIComponent(c.repository) + '/contents/';
const state = { token: null, document: null, sha: null, editing: null, lastPhoto: null };
const te = new TextEncoder();
const td = new TextDecoder();
const MAX_PHOTO = 2 * 1024 * 1024;
const SLOT_RE = /^(\d{1,2}):(\d{2}) (AM|PM) – (\d{1,2}):(\d{2}) (AM|PM)$/;
const BMC_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const showForm = $('show-form');
const statusNode = $('status');
function msg(value, error = false) { statusNode.textContent = value; statusNode.className = error ? 'error' : ''; }
function node(tag, content, className = '') {
  const x = document.createElement(tag);
  if (content !== undefined && content !== null) x.textContent = String(content);
  if (className) x.className = className;
  return x;
}
function addButton(text, fn, secondary = true) {
  const b = node('button', text, secondary ? 'secondary' : '');
  b.type = 'button'; b.addEventListener('click', fn); return b;
}
function bytesToBase64(bytes) {
  let output = '';
  for (let i=0;i<bytes.length;i+=8192) output += String.fromCharCode(...bytes.subarray(i,i+8192));
  return btoa(output);
}
function base64ToBytes(b64) {
  const bin = atob(b64.replace(/\s/g,''));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}
async function keyFor(passphrase, salt) {
  const material = await crypto.subtle.importKey('raw', te.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({
    name:'PBKDF2', salt, iterations:600000, hash:'SHA-256'
  }, material, {name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
}
async function encryptToken(token, passphrase) {
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await keyFor(passphrase,salt);
  const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,te.encode(token));
  return {version:1,salt:bytesToBase64(salt),iv:bytesToBase64(iv),ciphertext:bytesToBase64(new Uint8Array(encrypted))};
}
async function decryptToken(stored,passphrase) {
  if(stored.version!==1) throw Error('Unsupported saved credential format.');
  const key=await keyFor(passphrase,base64ToBytes(stored.salt));
  const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(stored.iv)},key,base64ToBytes(stored.ciphertext));
  return td.decode(decrypted);
}
function makePath(path) {return path.split('/').map(encodeURIComponent).join('/');}
async function github(path,options={}) {
  if(!state.token) throw Error('Unlock the editor first.');
  const url=endpoint+makePath(path)+(options.method==='PUT'?'':'?ref='+encodeURIComponent(c.branch));
  const res=await fetch(url,{
    method:options.method||'GET',
    headers:{
      'Authorization':'Bearer '+state.token,
      'Accept':'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28',
      ...(options.body?{'Content-Type':'application/json'}:{})
    },
    body:options.body?JSON.stringify(options.body):undefined,
    cache:'no-store'
  });
  if(!res.ok){
    if(res.status===401||res.status===403) throw Error('GitHub rejected the token or its permissions (HTTP '+res.status+'). Check that Contents has write access to '+c.repository+'.');
    if(res.status===409||res.status===422) throw Error('GitHub rejected the update (HTTP '+res.status+'). The file may have changed. Reload before publishing.');
    throw Error('GitHub request failed (HTTP '+res.status+').');
  }
  return res.json();
}
async function readDocument() {
  const file=await github(c.dataPath);
  if(!file.content || !file.sha) throw Error('GitHub did not return a content file.');
  const data=JSON.parse(td.decode(base64ToBytes(file.content)));
  if(c.mode==='bmc' && !Array.isArray(data.shows)) throw Error('Unexpected BMC schedule format.');
  if(c.mode==='sierra' && !Array.isArray(data.shows)) throw Error('Unexpected Sierra schedule format.');
  state.document=data;state.sha=file.sha;
  state.editing=null;
  $('repo-state').textContent='Editing '+c.repository+'/'+c.dataPath;
  field($('notice-form'),'announcement').value=data.announcement||'';
  draw();
}
async function writeDocument(data,message) {
  const body={
    message:'Admin: '+message,
    branch:c.branch,
    content:bytesToBase64(te.encode(JSON.stringify(data,null,2)+'\n')),
    sha:state.sha
  };
  const result=await github(c.dataPath,{method:'PUT',body});
  if(!result.content?.sha) throw Error('GitHub did not confirm the new file version.');
  state.document=data;state.sha=result.content.sha;
  msg('Published to GitHub. Other sites may take a short time to refresh.');
  draw();
}
function dateISO(value) {
  if(typeof value!=='string'||! /^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error('Choose a valid date.');
  const d=new Date(value+'T12:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==value) throw Error('Choose a valid calendar date.');
  return value;
}
function dateLabel(iso) {
  const date=new Date(iso+'T12:00:00Z');
  return date.toLocaleDateString('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'}).replace(', ',' • ');
}
function isoForDay(day,data) {
  if(day.isoDate) return dateISO(day.isoDate);
  const match=String(day.date).match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/);
  const yr=String(data.month||data.subtitle||'').match(/(20\d{2})/);
  if(!match||!yr) throw Error('Cannot determine the date of an existing show.');
  return dateISO(yr[1]+'-'+String(BMC_MONTHS.indexOf(match[1])+1).padStart(2,'0')+'-'+String(+match[2]).padStart(2,'0'));
}
function clockTo24(value) {
  const m=String(value).match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if(!m) throw Error('Unexpected saved time. Fix the source before editing this row.');
  return String((+m[1]%12)+(m[3]==='PM'?12:0)).padStart(2,'0')+':'+m[2];
}
function clockTo12(value){
  if(!/^\d{2}:\d{2}$/.test(value)) throw Error('Select a start/end time.');
  const hour=Number(value.slice(0,2)), min=value.slice(3);
  return String(hour%12||12)+':'+min+' '+(hour>=12?'PM':'AM');
}
function parseTime(display) {
  const m=String(display).match(SLOT_RE);
  if(!m) throw Error('This legacy time is not editable through the time picker; check the source.');
  return [clockTo24(m[1]+':'+m[2]+' '+m[3]),clockTo24(m[4]+':'+m[5]+' '+m[6])];
}
function entries(){
  if(c.mode==='bmc'){
    const list=[];
    for(const day of state.document.shows){
      const iso=isoForDay(day,state.document);
      (day.shows||[]).forEach((show,index)=>list.push({iso,show,index,day,closure:false}));
      if(day.closed) list.push({iso,day,closure:true});
    }
    return list.sort((a,b)=>a.iso.localeCompare(b.iso)||(a.show?.time||'').localeCompare(b.show?.time||''));
  }
  return state.document.shows.map((show,index)=>({iso:dateISO(show.date),show,index})).sort((a,b)=>a.iso.localeCompare(b.iso));
}
function clearForm(date = '') {
  showForm.reset();
  state.editing=null;state.lastPhoto=null;
  $('form-heading').textContent='Add performance';
  $('save-show').textContent='Save and publish show';
  field(showForm,'date').value=date;
  field(showForm,'photo').value='';
  field(showForm,'alt').value='';
  $('preview').replaceChildren();
}
function editEntry(entry,copy=false){
  clearForm(copy?'':entry.iso);
  state.editing=copy?null:{mode:c.mode,iso:entry.iso,index:entry.index};
  const show=entry.show;
  field(showForm,'artist').value=c.mode==='bmc'?show.artist:show.project;
  field(showForm,'photo').value=show.photo||'';
  field(showForm,'alt').value=show.alt||'';
  if(c.mode==='bmc'){
    const [start,end]=parseTime(show.time);
    field(showForm,'start').value=start;field(showForm,'end').value=end;
    field(showForm,'headliner').checked=!!show.headliner;
  } else {
    field(showForm,'venue').value=show.venue||'';
    field(showForm,'location').value=show.location||'';
    field(showForm,'timeText').value=show.time||'';
    // Start is used as a safe sorting hint, but Sierra's original display remains authoritative.
    field(showForm,'start').value=show.start||'18:00';
  }
  $('form-heading').textContent=copy?'Copy performance':'Edit performance';
  $('save-show').textContent=copy?'Publish new copy':'Publish changes';
  if(copy)field(showForm,'date').value='';
  showForm.scrollIntoView({behavior:'smooth',block:'start'});
}
function cloneData(){return structuredClone(state.document);}
function normalizeMonth(data){
  if(c.mode!=='bmc') return;
  const dates=data.shows.map(day=>isoForDay(day,data)).sort();
  if(!dates.length)return;
  const short=iso=>BMC_MONTHS[Number(iso.slice(5,7))-1]+' '+iso.slice(0,4);
  data.month=short(dates[0])===short(dates.at(-1))?short(dates[0]):short(dates[0])+'–'+short(dates.at(-1));
  data.subtitle=data.month+' • Balcony Music Club';
  data.last_updated=new Date().toISOString().slice(0,10);
}
function validateNoCollision(data,iso,start,editing){
  if(c.mode!=='bmc')return;
  for(const day of data.shows) {
    if(isoForDay(day,data)!==iso)continue;
    if(day.closed)throw Error('This date is marked CLOSED. Remove the closure before adding performances.');
    if((day.shows||[]).some(s=>parseTime(s.time)[0]===start))throw Error('Another show already starts at '+start+' on this date.');
  }
}
async function saveShow(event){
  event.preventDefault();
  const f=showForm;
  const iso=dateISO(field(f,'date').value);
  const artist=field(f,'artist').value.trim();
  if(!artist||artist.length>160)throw Error('Enter an artist or event name (160 characters maximum).');
  const photo=field(f,'photo').value.trim();
  const alt=field(f,'alt').value.trim();
  const next=cloneData();
  let show;
  if(c.mode==='bmc'){
    const start=field(f,'start').value,end=field(f,'end').value;
    if(!start||!end||end<=start)throw Error('Start/end times must be valid and on the same date.');
    show={time:clockTo12(start)+' – '+clockTo12(end),artist,photo,alt,headliner:field(f,'headliner').checked};
    if(state.editing){
      const {iso:old,index}=state.editing;
      const oldDay=next.shows.find(d=>isoForDay(d,next)===old);
      if(!oldDay?.shows?.[index])throw Error('Show changed; reload before publishing.');
      oldDay.shows.splice(index,1);
      if(!oldDay.shows.length&&!oldDay.closed)next.shows.splice(next.shows.indexOf(oldDay),1);
    }
    validateNoCollision(next,iso,start,state.editing);
    let day=next.shows.find(d=>isoForDay(d,next)===iso);
    if(!day){day={date:dateLabel(iso),isoDate:iso,shows:[]};next.shows.push(day);}
    day.shows.push(show);
    day.shows.sort((a,b)=>parseTime(a.time)[0].localeCompare(parseTime(b.time)[0]));
    next.shows.sort((a,b)=>isoForDay(a,next).localeCompare(isoForDay(b,next)));
    normalizeMonth(next);
  } else {
    const timeText=field(f,'timeText').value.trim();
    if(!timeText)throw Error('Enter a displayed performance time.');
    show={date:iso,dateLabel:new Date(iso+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'}),project:artist,venue:field(f,'venue').value.trim(),location:field(f,'location').value.trim(),time:timeText,start:field(f,'start').value,photo,alt};
    if(state.editing){
      const oldIndex=state.editing.index;
      if(!next.shows[oldIndex])throw Error('Show changed; reload before publishing.');
      next.shows.splice(oldIndex,1);
    }
    next.shows.push(show);
    next.shows.sort((a,b)=>a.date.localeCompare(b.date)||(a.start||'').localeCompare(b.start||''));
    next.last_updated=new Date().toISOString().slice(0,10);
  }
  await writeDocument(next,(state.editing?'update ':'add ')+artist+' '+iso);
  clearForm();
}
async function removeEntry(entry) {
  if(!confirm('Remove '+(c.mode==='bmc'?entry.show.artist:entry.show.project)+' on '+entry.iso+' from the public calendar? Git history will preserve the old version.'))return;
  const next=cloneData();
  if(c.mode==='bmc'){
    const day=next.shows.find(d=>isoForDay(d,next)===entry.iso);
    day.shows.splice(entry.index,1);
    if(!day.shows.length&&!day.closed)next.shows.splice(next.shows.indexOf(day),1);
    normalizeMonth(next);
  } else {
    next.shows.splice(entry.index,1);
    next.last_updated=new Date().toISOString().slice(0,10);
  }
  await writeDocument(next,'remove show on '+entry.iso);
}
function updateFilters(rows){
  const select=$('month-filter');const selected=select.value;
  const months=[...new Set(rows.map(x=>x.iso.slice(0,7)))].sort().reverse();
  select.replaceChildren();
  select.appendChild(new Option('All dates','all'));
  for(const month of months)select.appendChild(new Option(new Date(month+'-15T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',year:'numeric',month:'long'}),month));
  select.value=months.includes(selected)?selected:selected==='all'?'all':months[0]||'all';
}
function draw(){
  if(!state.document)return;
  const list=$('schedule-list');list.replaceChildren();
  const rows=entries();
  updateFilters(rows);
  const f=$('month-filter').value;
  const filtered=rows.filter(r=>f==='all'||r.iso.startsWith(f));
  const groups=new Map();
  for(const row of filtered){if(!groups.has(row.iso))groups.set(row.iso,[]);groups.get(row.iso).push(row);}
  for(const [date,group] of groups){
    const day=node('article',null,'day');
    const heading=node('h3',dateLabel(date));day.appendChild(heading);
    for(const row of group){
      const line=node('div',null,'event');
      const detail=node('div');
      if(row.closure){detail.appendChild(node('strong',row.day.notice||'Closed','closure'));}
      else {
        detail.appendChild(node('strong',c.mode==='bmc'?row.show.artist:row.show.project));
        detail.appendChild(node('small',c.mode==='bmc'?row.show.time:((row.show.venue||'')+' · '+row.show.time)));
      }
      line.appendChild(detail);
      const actions=node('div',null,'actions');
      if(row.closure){
        actions.appendChild(addButton('Reopen',()=>run(async()=>{
          const next=cloneData();
          const d=next.shows.find(x=>isoForDay(x,next)===row.iso);
          if(d){delete d.closed;delete d.notice;if(!d.shows.length)next.shows.splice(next.shows.indexOf(d),1);}
          normalizeMonth(next);await writeDocument(next,'remove closure '+row.iso);
        })));
      } else {
        actions.appendChild(addButton('Edit',()=>editEntry(row)));
        actions.appendChild(addButton('Copy',()=>editEntry(row,true)));
        actions.appendChild(addButton('Remove',()=>run(()=>removeEntry(row))));
      }
      line.appendChild(actions);day.appendChild(line);
    }
    list.appendChild(day);
  }
  if(!groups.size)list.appendChild(node('p','No dates in this month.'));
  const artists=new Set(rows.filter(x=>!x.closure).map(r=>c.mode==='bmc'?r.show.artist:r.show.project));
  const datalist=$('existing-artists');datalist.replaceChildren();
  for(const name of [...artists].sort()) datalist.appendChild(new Option(name));
}
async function saveClosure(event) {
  event.preventDefault();
  if(c.mode!=='bmc')return;
  const form=$('closure-form'),iso=dateISO(field(form,'date').value),notice=field(form,'notice').value.trim();
  if(!notice)throw Error('Enter a reason for closure.');
  const next=cloneData();
  let day=next.shows.find(d=>isoForDay(d,next)===iso);
  if(day?.shows?.length)throw Error('This date still has performers. Remove or reschedule them before marking the venue closed.');
  if(!day){day={date:dateLabel(iso),isoDate:iso,shows:[]};next.shows.push(day);}
  day.closed=true;day.notice=notice;
  next.shows.sort((a,b)=>isoForDay(a,next).localeCompare(isoForDay(b,next)));
  normalizeMonth(next);
  await writeDocument(next,'close venue '+iso);
  form.reset();
}
async function removeClosure(){
  if(c.mode!=='bmc')return;
  const iso=dateISO(field($('closure-form'),'date').value);
  const next=cloneData();const day=next.shows.find(x=>isoForDay(x,next)===iso&&x.closed);
  if(!day)throw Error('That date is not marked closed.');
  delete day.closed;delete day.notice;
  if(!day.shows.length)next.shows.splice(next.shows.indexOf(day),1);
  normalizeMonth(next);
  await writeDocument(next,'reopen venue '+iso);
}
async function uploadPhoto(event){
  event.preventDefault();
  const file=field($('photo-form'),'image').files?.[0];
  if(!file||!file.size||file.size>MAX_PHOTO)throw Error('Choose a photo smaller than 2 MB.');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const jpeg=bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  const png=bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
  const webp=bytes.length>=12&&td.decode(bytes.slice(0,4))==='RIFF'&&td.decode(bytes.slice(8,12))==='WEBP';
  if(!jpeg&&!png&&!webp)throw Error('Only valid JPEG, PNG and WebP images are supported.');
  const ext=jpeg?'jpg':png?'png':'webp';
  const artist=field(showForm,'artist').value.trim()||'band';
  const slug=artist.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'band';
  const dest=c.photoDirectory+'/'+slug+'-'+crypto.randomUUID().slice(0,8)+'.'+ext;
  await github(dest,{method:'PUT',body:{message:'Admin: upload band photo '+slug,content:bytesToBase64(bytes),branch:c.branch}});
  field(showForm,'photo').value=dest;
  field(showForm,'alt').value=artist+' promotional photo';
  const preview=$('preview');preview.replaceChildren();
  const img=node('img');img.src=URL.createObjectURL(file);
  img.alt='Photo upload preview';img.onload=()=>URL.revokeObjectURL(img.src);
  preview.appendChild(img);
  field($('photo-form'),'image').value='';
  msg('Photo uploaded. Now click Save and publish show to attach it to the calendar.');
}
async function run(fn){
  const buttons=[...document.querySelectorAll('button')];
  buttons.forEach(b=>b.disabled=true);
  try {await fn();}
  catch(error){msg(error.message||'Operation failed.',true);}
  finally{buttons.forEach(b=>b.disabled=false);}
}
async function openEditor() {
  $('setup').hidden=true;$('unlock').hidden=true;$('workspace').hidden=false;$('lock').hidden=false;
  $('session-label').textContent='Unlocked locally · '+c.repository;
  if(c.mode==='sierra'){
    $('bmc-fields').hidden=true;$('closure-panel').hidden=true;$('sierra-fields').hidden=false;
    field(showForm,'end').required=false;
    $('start-label').firstChild.textContent='Sort time (24-hour)';
  }
  clearForm();
  await readDocument();
}
async function setup(e){
  e.preventDefault();
  const f=$('setup-form');
  const token=field(f,'token').value.trim();
  const pw=field(f,'passphrase').value;
  if(pw.length<14||pw!==field(f,'confirm').value)throw Error('Passphrases must match and be at least 14 characters.');
  if(!token)throw Error('Enter your fine-grained token.');
  state.token=token;
  try {await readDocument();}catch(error){state.token=null;throw error;}
  const ciphertext=await encryptToken(token,pw);
  localStorage.setItem(vaultName,JSON.stringify(ciphertext));
  f.reset();await openEditor();
}
async function unlock(e){
  e.preventDefault();
  const f=$('unlock-form');
  const saved=localStorage.getItem(vaultName);
  if(!saved)throw Error('No encrypted token saved on this device.');
  let token;
  try {token=await decryptToken(JSON.parse(saved),field(f,'passphrase').value);}
  catch{throw Error('Incorrect passphrase or damaged local credential.');}
  state.token=token;
  try {await openEditor();}catch(error){state.token=null;throw error;}
  f.reset();
}
function lock(){
  state.token=null;state.document=null;state.sha=null;state.editing=null;
  $('workspace').hidden=true;$('lock').hidden=true;
  $('unlock').hidden=!localStorage.getItem(vaultName);
  $('setup').hidden=!!localStorage.getItem(vaultName);
  msg('Editor locked. The decrypted token has been cleared from this tab.');
}
$('brand').textContent=c.title+' Admin';
$('public-site').href=c.publicPath;
$('repo-label').textContent='Allowed repository: '+c.owner+'/'+c.repository;
$('setup-form').addEventListener('submit',e=>run(()=>setup(e)));
$('unlock-form').addEventListener('submit',e=>run(()=>unlock(e)));
showForm.addEventListener('submit',e=>run(()=>saveShow(e)));
$('photo-form').addEventListener('submit',e=>run(()=>uploadPhoto(e)));
$('notice-form').addEventListener('submit',e=>run(async()=>{
  e.preventDefault();
  const next=cloneData();
  next.announcement=field($('notice-form'),'announcement').value.trim();
  await writeDocument(next,'change calendar announcement');
}));
$('closure-form').addEventListener('submit',e=>run(()=>saveClosure(e)));
$('remove-closure').addEventListener('click',()=>run(removeClosure));
$('clear-show').addEventListener('click',()=>clearForm());
$('cancel-edit').addEventListener('click',()=>clearForm());
$('refresh').addEventListener('click',()=>run(readDocument));
$('month-filter').addEventListener('change',draw);
$('lock').addEventListener('click',lock);
$('reset-vault').addEventListener('click',()=>{
  if(confirm('Forget the encrypted publishing token on this device? No GitHub content will be deleted.')){
    localStorage.removeItem(vaultName);lock();
  }
});
$('setup').hidden=!!localStorage.getItem(vaultName);
$('unlock').hidden=!localStorage.getItem(vaultName);
})();
