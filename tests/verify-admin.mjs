import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {test} from 'node:test';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('admin page uses only same-origin scripts and browser encryption',()=>{
 const html=read('admin/index.html'),code=read('admin/admin.js');
 assert.match(html,/script-src 'self'/);
 assert.match(html,/connect-src https:\/\/api\.github\.com/);
 assert.match(html,/admin\.js/);
 assert.match(code,/PBKDF2/);
 assert.match(code,/AES-GCM/);
 assert.match(code,/600000/);
 assert.match(code,/localStorage\.setItem\(vaultName,JSON\.stringify\(ciphertext\)\)/);
 assert.doesNotMatch(code,/localStorage\.setItem\(vaultName,\s*token\)/);
 assert.match(code,/sha:state\.sha/);
 assert.match(code,/confirm\(/);
});

test('existing BMC calendar retains valid dates, no duplicate times and explicit closures',()=>{
 const data=JSON.parse(read('shows.json'));
 assert.ok(Array.isArray(data.shows)&&data.shows.length>0);
 const found=new Set();
 const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
 for(const day of data.shows){
   assert.ok(typeof day.date==='string');
   let iso=day.isoDate;
   if(!iso){
     const m=day.date.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/);
     assert.ok(m);
     const y=(data.month||'').match(/20\d{2}/);
     assert.ok(y);
     iso=y[0]+'-'+String(months.indexOf(m[1].toLowerCase())+1).padStart(2,'0')+'-'+m[2].padStart(2,'0');
   }
   assert.match(iso,/^\d{4}-\d{2}-\d{2}$/);
   assert.ok(!found.has(iso),'duplicate day '+iso);
   found.add(iso);
   assert.ok(Array.isArray(day.shows));
   if(day.closed) assert.equal(day.shows.length,0);
   const times=new Set();
   for(const event of day.shows){
     assert.ok(typeof event.artist==='string'&&event.artist.trim());
     assert.match(event.time,/^\d{1,2}:\d{2} (AM|PM) – \d{1,2}:\d{2} (AM|PM)$/);
     const start=event.time.split(' – ')[0];
     assert.ok(!times.has(start),'duplicate slot on '+iso+': '+start);
     times.add(start);
   }
 }
});
