import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('curriculum covers the eight available topics with runnable exercises and sources', async () => {
  assert.ok(fs.existsSync(new URL('../content/course.js', import.meta.url)), 'course content must exist');
  const { units } = await import('../content/course.js');
  assert.equal(units.length, 8);
  for (const unit of units) {
    assert.ok(unit.sources.length && unit.goal);
    assert.ok(unit.activities.some(a => a.type === 'concept'));
    assert.ok(unit.activities.some(a => a.type === 'experiment'));
    assert.ok(unit.activities.some(a => a.type === 'exercise'));
    assert.equal(new Set(unit.activities.map(a => a.id)).size, unit.activities.length);
    for (const a of unit.activities) {
      assert.ok(a.title && a.body && a.source);
      if (a.type === 'exercise') assert.ok(a.solution && a.tests.length && a.hints.length >= 2);
      if (a.prediction) assert.ok(a.prediction.answer >= 0 && a.prediction.answer < a.prediction.choices.length);
    }
  }
});

test('saved code and completed activities survive navigation without sharing INT161 keys', async () => {
  assert.ok(fs.existsSync(new URL('../js/store.js', import.meta.url)), 'progress store must exist');
  const { createStore, KEY } = await import('../js/store.js');
  const values = new Map();
  const storage = {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  const store = createStore(storage);
  store.setCode('dom','create',{html:'<ul></ul>',js:'console.log(1)'});
  store.markDone('dom','create'); store.setLast('dom','create');
  const again=createStore(storage);
  assert.equal(again.getCode('dom','create').js,'console.log(1)');
  assert.equal(again.isDone('dom','create'),true);
  assert.deepEqual(again.getLast(),{unit:'dom',activity:'create'});
  assert.notEqual(KEY,'int161-progress-v1');
  assert.equal(values.has('int161-progress-v1'),false);
});

test('JavaScript grader compares objects by value and reports syntax failures', async () => {
  assert.ok(fs.existsSync(new URL('../engine/javascript.js', import.meta.url)), 'worker grader must exist');
  const { runJavaScript }=await import('../engine/javascript.js');
  const result=await runJavaScript({code:'function summary(){return {b:2,a:1}}',fn:'summary',tests:[{name:'object',args:[],expected:{a:1,b:2}}]});
  assert.equal(result.results[0].passed,true);
  const broken=await runJavaScript({code:'function {',tests:[]});
  assert.match(broken.error,/SyntaxError/);
});

test('storage exercise cannot pass by only returning the input without saving', async()=>{
 const {runJavaScript}=await import('../engine/javascript.js');
 const result=await runJavaScript({code:'function save(x){return x}',fn:'save',tests:[{name:'saves',args:[{theme:'dark'}],expected:{theme:'dark'},storageExpected:{prefs:'{"theme":"dark"}'}}]});
 assert.ok(result.results.some(t=>!t.passed));
});

test('malformed saved records recover with usable defaults',async()=>{
 const {createStore}=await import('../js/store.js');
 const store=createStore({getItem:()=>'{"done":null,"code":null,"lab":null}',setItem(){}});
 assert.equal(store.isDone('js','cart'),false);
 assert.equal(store.getCode('js','cart'),null);
});
