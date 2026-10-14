import test from 'node:test';
import assert from 'node:assert/strict';
import {units} from '../content/course.js';
test('each module connects an explained example, optional practice and an experiment',()=>{
 for(const unit of units){
  const activity=unit.activities.find(a=>a.teaching);
  assert.ok(activity,unit.id+' needs an explained lesson');
  const g=activity.teaching;
  assert.ok(g.question.code&&g.steps.length>=3&&g.takeaway);
  assert.ok(g.question.options.filter(o=>o.correct).length>1);
  const experiment=unit.activities.find(a=>a.id===g.experiment);
  assert.equal(experiment.type,'experiment');
  assert.ok(experiment.experimentGuide.change&&experiment.experimentGuide.predict);
 }
});
