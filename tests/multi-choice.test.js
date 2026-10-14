import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesAnswers} from '../js/multi-choice.js';
import {codeQuestions} from '../content/code-questions.js';

test('multiple choice requires the complete set, independent of selection order',()=>{
 assert.equal(matchesAnswers([2,0],[0,2]),true);
 assert.equal(matchesAnswers([0],[0,2]),false);
 assert.equal(matchesAnswers([0,1,2],[0,2]),false);
 assert.equal(matchesAnswers([],[0,2]),false);
});
test('code practice questions have several correct options and explanatory feedback for each option',()=>{
 assert.equal(codeQuestions.length,12);
 assert.equal(new Set(codeQuestions.map(q=>q.id)).size,12);
 for(const q of codeQuestions){
  assert.ok(q.code&&q.prompt&&q.assumption);
  assert.ok(q.options.every(o=>o.text&&o.explanation&&typeof o.correct==='boolean'));
  const answers=q.options.flatMap((o,i)=>o.correct?[i]:[]);
  assert.ok(answers.length>1&&answers.length<q.options.length);
  assert.equal(matchesAnswers(answers,answers),true);
 }
});
