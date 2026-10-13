import {h} from './dom.js';
import {createEditor} from './editor.js';
import {createSandbox} from '../engine/sandbox.js';
import {show} from '../engine/shared.js';
export function createPanel(activity,unitId,store,onPassed){
 const saved=store.getCode(unitId,activity.id)||{};
 const initial={html:saved.html??activity.html??'',js:saved.js??activity.code??''};
 const host=h('div',{class:'workspace'});
 const status=h('p',{class:'run-status',role:'status'},'พร้อมทดลอง · แก้โค้ดแล้วกด Run');
 const output=h('pre',{class:'console-output','aria-live':'polite'},'Console พร้อมรับผล');
 const results=h('div',{class:'test-results','aria-live':'polite'});
 const frame=h('iframe',{title:'Live Preview ของแบบฝึก',sandbox:'allow-scripts',hidden:true});
 let revision=0,busy=false,logs=[],disposed=false;
 const paintLogs=()=>{output.textContent=logs.length?logs.map(l=>`${l.level==='error'?'✗ ':''}${l.text}`).join('\n'):'(ไม่มี console output)';};
 const sandbox=createSandbox({frame,onLog:log=>{logs.push(log);paintLogs();}});
 const jsHost=h('div',{class:'editor-host'}),htmlHost=h('div',{class:'editor-host',hidden:true});
 let jsEditor,htmlEditor;
 function save(){revision++;store.setCode(unitId,activity.id,{js:jsEditor?.getValue()??initial.js,html:htmlEditor?.getValue()??initial.html});results.replaceChildren();status.textContent='โค้ดเปลี่ยนแล้ว · Run ใหม่เพื่ออัปเดตผลและ Preview';}
 jsEditor=createEditor(jsHost,{value:initial.js,onChange:save,onRun:()=>run(false)});
 if(activity.mode==='dom')htmlEditor=createEditor(htmlHost,{value:initial.html,language:'html',onChange:save,onRun:()=>run(false)});
 const tabs=h('div',{class:'editor-tabs',role:'tablist','aria-label':'ไฟล์ของกิจกรรม'});
 for(const [language,label] of (activity.mode==='dom'?[['js','JavaScript'],['html','HTML']]:[['js','JavaScript']])){
  const button=h('button',{class:'file-tab',role:'tab','aria-selected':language==='js'?'true':'false',onclick:()=>{
   jsHost.hidden=language!=='js';htmlHost.hidden=language!=='html';
   for(const b of tabs.children)b.setAttribute('aria-selected',b===button?'true':'false');
  }},label);tabs.append(button);
 }
 const actions=h('div',{class:'run-actions'});
 const runButton=h('button',{class:'button primary',onclick:()=>run(false)},'▶ Run');
 const checkButton=activity.type==='exercise'?h('button',{class:'button',onclick:()=>run(true)},'ตรวจคำตอบ'):null;
 const resetButton=h('button',{class:'button quiet',onclick:()=>{
  sandbox.dispose();jsEditor.setValue(activity.code);htmlEditor?.setValue(activity.html||'');
  logs=[];output.textContent='รีเซ็ตโค้ดแล้ว';results.replaceChildren();status.textContent='พร้อมเริ่มใหม่';
 }},'Reset โค้ด');
 actions.append(...[runButton,checkButton,resetButton].filter(Boolean));
 async function run(check){
  if(busy||disposed)return;
  busy=true;for(const button of actions.children)button.disabled=true;
  const started=revision;logs=[];results.replaceChildren();output.textContent='กำลังรัน…';status.textContent=check?'กำลังตรวจคำตอบ…':'กำลังรัน…';
  try{
   const result=await sandbox.run({mode:activity.mode,code:jsEditor.getValue(),html:htmlEditor?.getValue()||'',fn:activity.fn,tests:check?activity.tests||[]:[],storage:activity.storage?store.getLab(unitId,activity.id):{}});
   if(disposed)return;
   logs=result.logs||[];paintLogs();
   if(result.error){output.textContent+='\n✗ '+result.error;status.textContent='ยังรันไม่สำเร็จ · อ่านข้อผิดพลาดใน Console';return;}
   if(activity.storage)store.setLab(unitId,activity.id,result.storage||{});
   if(started!==revision){status.textContent='โค้ดเปลี่ยนระหว่างรัน · Run หรือตรวจใหม่อีกครั้ง';return;}
   status.textContent=activity.mode==='dom'?'Preview พร้อมแล้ว · ลองคลิกหรือพิมพ์ในหน้าตัวอย่าง':'รันเสร็จแล้ว · อ่านผลใน Console';
   if(check){
    const all=result.results?.length>0&&result.results.every(t=>t.passed);
    results.append(h('h3',{},all?'✓ ผ่านทุกกรณีทดสอบ':'ยังไม่ผ่านครบ · ดูค่าที่ต่างกัน'),...(result.results||[]).map(t=>h('section',{class:'test-row '+(t.passed?'pass':'fail')},h('strong',{},`${t.passed?'✓':'✗'} ${t.name}`),h('div',{class:'comparison'},h('pre',{},'Expected: '+show(t.expected)),h('pre',{},'Actual: '+show(t.actual))))));
    if(all)onPassed();
   }else if(activity.type==='experiment')onPassed();
  }catch(error){if(!disposed){output.textContent='✗ '+error.message;status.textContent='หยุดการรัน · แก้โค้ดแล้วลองใหม่';}}
  finally{busy=false;if(!disposed)for(const button of actions.children)button.disabled=false;}
 }
 host.append(h('div',{class:'editor-bar'},tabs,h('span',{class:'shortcut'},'Ctrl+Space แนะนำ · Ctrl/⌘+Enter Run')),jsHost,htmlHost,actions,status);
 if(activity.storage)host.append(h('p',{class:'note'},'Storage จำลองของกิจกรรมนี้ · แยกจากข้อมูลความคืบหน้าจริง'),h('button',{class:'button quiet',onclick:()=>{store.clearLab(unitId,activity.id);status.textContent='ล้างข้อมูลทดลองแล้ว';}},'ล้างข้อมูลทดลอง'));
 const previewBox=h('section',{class:'preview-panel'},h('div',{class:'panel-heading'},'Live Preview',h('span',{class:'muted'},'HTML + DOM จริงในพื้นที่ทดลอง')),frame);
 host.append(h('div',{class:'result-layout '+(activity.mode==='dom'?'has-preview':'')},activity.mode==='dom'?previewBox:null,h('section',{class:'console-panel'},h('div',{class:'panel-heading'},'Console'),output)),results);
 if(activity.hints?.length){
  let index=0;const hints=h('div',{class:'hint-content'});
  const reveal=h('button',{class:'button quiet',onclick:()=>{
   hints.append(h('p',{},h('strong',{},`ขั้น ${index+1} · `),activity.hints[index++]));
   reveal.textContent=index===activity.hints.length?'เปิดคำใบ้ครบแล้ว':`ขอคำใบ้ขั้น ${index+1}`;reveal.disabled=index===activity.hints.length;
  }},'ขอคำใบ้ขั้น 1');
  host.append(h('details',{class:'help'},h('summary',{},'คำใบ้ · เปิดทีละขั้น'),hints,reveal));
 }
 if(activity.solution)host.append(h('details',{class:'help'},h('summary',{},'ดูแนวทางเฉลย'),h('p',{class:'muted'},'ลองแก้ก่อน แล้วอธิบายได้ว่าแต่ละส่วนทำอะไร'),h('pre',{class:'solution-code'},activity.solution)));
 return {element:host,destroy(){disposed=true;sandbox.dispose();jsEditor.destroy();htmlEditor?.destroy();}};
}
