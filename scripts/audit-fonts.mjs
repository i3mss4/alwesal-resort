import fs from 'node:fs';
import path from 'node:path';
const root='Thmanyah-Font-Family';
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.name==='__MACOSX'?[]:e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
const results=walk(root).filter(p=>p.endsWith('.otf')).map(file=>{
 const b=fs.readFileSync(file), tables={};
 for(let i=0;i<b.readUInt16BE(4);i++){const o=12+i*16;tables[b.toString('ascii',o,o+4)]=b.readUInt32BE(o+8);}
 const n=tables.name,names={};
 for(let i=0;i<b.readUInt16BE(n+2);i++){const o=n+6+i*12,id=b.readUInt16BE(o+6),len=b.readUInt16BE(o+8),start=n+b.readUInt16BE(n+4)+b.readUInt16BE(o+10);if(b.readUInt16BE(o)===3&&[1,2,16,17].includes(id)){names[id]=new TextDecoder('utf-16be').decode(b.subarray(start,start+len));}}
 const features={};for(const tag of ['GSUB','GPOS']){if(!tables[tag])continue;const f=tables[tag]+b.readUInt16BE(tables[tag]+6);features[tag]=Array.from({length:b.readUInt16BE(f)},(_,i)=>b.toString('ascii',f+2+i*6,f+6+i*6)).filter((x,i,a)=>a.indexOf(x)===i);}
 return {file,names,weight:b.readUInt16BE(tables['OS/2']+4),features};
});
console.log(JSON.stringify(results,null,2));
