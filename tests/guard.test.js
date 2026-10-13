import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('DOM loop guard preserves nested unbraced loops and checks every iteration',async()=>{
 assert.ok(fs.existsSync(new URL('../engine/protect-dom.js',import.meta.url)),'DOM guard must exist');
 const {protectDOMCode}=await import('../engine/protect-dom.js');
 let checks=0;
 const result=new Function('__int151Checkpoint',protectDOMCode('let sum=0; for(let i=0;i<3;i++) for(let j=0;j<2;j++) sum++; return sum;'))(()=>checks++);
 assert.equal(result,6);assert.ok(checks>=9);
});
test('DOM function guards preserve return values and directive prologues',async()=>{
 assert.ok(fs.existsSync(new URL('../engine/protect-dom.js',import.meta.url)),'DOM guard must exist');
 const {protectDOMCode}=await import('../engine/protect-dom.js');
 let checks=0;
 const result=new Function('__int151Checkpoint',protectDOMCode('function fact(n){"use strict";return n<2?1:n*fact(n-1)} const f=x=>({value:x}); return f(fact(4));'))(()=>checks++);
 assert.deepEqual(result,{value:24});assert.ok(checks>=5);
});
