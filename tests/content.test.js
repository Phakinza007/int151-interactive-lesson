import test from 'node:test';
import assert from 'node:assert/strict';
import {units} from '../content/course.js';
import {runJavaScript} from '../engine/javascript.js';
import {createMemoryStorage} from '../engine/shared.js';
for(const unit of units){
 for(const activity of unit.activities.filter(a=>a.mode==='js'&&a.type!=='concept')){
  test(`${unit.id}/${activity.id}: ${activity.type==='exercise'?'solution passes and starter fails':'experiment runs'}`,async()=>{
   const result=await runJavaScript({code:activity.solution||activity.code,fn:activity.fn,tests:activity.tests||[]});
   assert.equal(result.error,null);
   if(activity.type==='exercise'){
    assert.ok(result.results.length>0&&result.results.every(t=>t.passed),JSON.stringify(result.results));
    const starter=await runJavaScript({code:activity.code,fn:activity.fn,tests:activity.tests});
    assert.ok(starter.error||starter.results.some(t=>!t.passed),'starter must fail');
   }
  });
 }
}
test('Storage follows string conversion, missing key, removal and safe special keys',()=>{
 const store=createMemoryStorage();store.setItem('n',3);assert.equal(store.getItem('n'),'3');
 store.setItem('__proto__','safe');assert.equal(store.getItem('__proto__'),'safe');
 assert.equal(store.length,2);store.removeItem('n');assert.equal(store.getItem('n'),null);
 store.clear();assert.equal(store.length,0);
});
