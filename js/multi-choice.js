import {h} from './dom.js';

export function matchesAnswers(selected, answers){
 const chosen=new Set(selected),correct=new Set(answers);
 return chosen.size===correct.size&&[...correct].every(i=>chosen.has(i));
}

export function createMultiChoice(questions){
 const summary=h('p',{role:'status',class:'quiz-score'},'เลือกได้หลายข้อ · ต้องเลือกครบทุกข้อที่ถูกและไม่เลือกข้อผิด ข้อละ 1 คะแนน');
 const host=h('section',{'aria-label':'แบบฝึก code choice หลายคำตอบ'},summary);
 const records=[];
 const update=()=>{
  const checked=records.filter(r=>r.checked);
  summary.textContent=`ตรวจแล้ว ${checked.length}/${questions.length} ข้อ · ถูก ${checked.filter(r=>r.passed).length} ข้อ · เลือกขาดหรือเกินไม่นับคะแนน`;
 };
 for(const [index,q] of questions.entries()){
  const feedback=h('div',{class:'quiz-feedback','aria-live':'polite'});
  const inputs=[];
  const record={checked:false,passed:false};records.push(record);
  const choices=q.options.map((option,i)=>{
   const input=h('input',{type:'checkbox',id:`${q.id}-${i}`,onchange:()=>{
    if(record.checked){record.checked=false;record.passed=false;feedback.replaceChildren(h('p',{},'เปลี่ยนตัวเลือกแล้ว · กดตรวจคำตอบอีกครั้ง'));update();}
   }});inputs.push(input);
   return h('label',{class:'code-choice',for:`${q.id}-${i}`},input,h('span',{class:'choice-letter'},String.fromCharCode(65+i)),h('pre',{},h('code',{},option.text)));
  });
  const check=h('button',{class:'button primary',type:'button',onclick:()=>{
   const selected=inputs.flatMap((input,i)=>input.checked?[i]:[]);
   if(!selected.length){feedback.replaceChildren(h('p',{},'เลือกอย่างน้อยหนึ่งตัวเลือกก่อนตรวจ'));return;}
   const answers=q.options.flatMap((option,i)=>option.correct?[i]:[]);
   record.checked=true;record.passed=matchesAnswers(selected,answers);
   feedback.replaceChildren(h('p',{},h('strong',{},record.passed?'✓ ถูกครบทุกตัวเลือก':`ยังไม่ครบ · คำตอบที่ถูกคือ ${answers.map(i=>String.fromCharCode(65+i)).join(', ')}`)),
    h('ul',{},q.options.map((option,i)=>h('li',{},h('strong',{},`${String.fromCharCode(65+i)} · ${option.correct?'ถูก':'ผิด'}${inputs[i].checked?' (คุณเลือก)':''}: `),option.explanation))));
   update();
  }},'ตรวจคำตอบ');
  host.append(h('fieldset',{class:'prediction code-question'},h('legend',{},`${index+1}. ${q.title}`),h('p',{class:'muted'},q.assumption),h('p',{},q.prompt),h('pre',{class:'question-code'},h('code',{},q.code)),h('div',{class:'code-choices'},choices),check,feedback));
 }
 host.append(h('button',{class:'button quiet',type:'button',onclick:()=>{
  for(const input of host.querySelectorAll('input'))input.checked=false;
  for(const record of records){record.checked=false;record.passed=false;}
  for(const node of host.querySelectorAll('.quiz-feedback'))node.replaceChildren();
  summary.textContent='เริ่มใหม่แล้ว · เลือกได้หลายข้อ ต้องเลือกให้ครบและไม่เกิน';
 }},'เริ่มชุดซ้อมใหม่'));
 return host;
}
