import {protectDOMCode} from './protect-dom.js';
import {equal,show,createMemoryStorage} from './shared.js';
export function frameDocument(payload,token){
  payload={...payload,code:protectDOMCode(payload.code||'')};
  const data=JSON.stringify({payload,token}).replaceAll('<','\\u003c');
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><style>body{font-family:system-ui,sans-serif;color:#17253b;margin:16px;line-height:1.65}button,input,select{font:inherit;padding:8px 12px;margin:4px;border:1px solid #bcc9d7;border-radius:6px}button{cursor:pointer;background:#e9f0ff}input{max-width:95%;box-sizing:border-box}output{display:inline-block;padding:8px}ul{padding-left:24px}.panel{padding:16px;background:#eaf3ff;border:1px solid #cad9ee}.active{color:#1559b8;background:#e7f0ff}.loading{opacity:.5}form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}</style></head><body><div id="lab-root"></div><script>
const {payload,token}=${data};
const equal=${equal.toString()};
const show=${show.toString()};
const createMemoryStorage=${createMemoryStorage.toString()};
const local=createMemoryStorage(payload.storage||{}),session=createMemoryStorage();
const logs=[],errors=[];
let guardActive=false,guardStart=0,guardSteps=0;
function checkpoint(){
 if(!guardActive){guardActive=true;guardStart=performance.now();guardSteps=0;setTimeout(()=>{guardActive=false;},0);}
 if(++guardSteps>100000||performance.now()-guardStart>150)throw new Error('โค้ด DOM รันนานเกินไป · ตรวจลูปหรือการเรียกฟังก์ชันซ้ำ');
}
const send=(kind,value)=>parent.postMessage({token,kind,...value},'*');
const logger=Object.fromEntries(['log','info','warn','error'].map(level=>[level,(...args)=>{const log={level,text:args.map(show).join(' ')};logs.push(log);send('log',{log});}]));
window.addEventListener('error',event=>{errors.push(event.message);send('log',{log:{level:'error',text:event.message}});});
window.addEventListener('unhandledrejection',event=>{errors.push(String(event.reason));send('log',{log:{level:'error',text:String(event.reason)}});});
(async()=>{
 const results=[];let error=null;
 try{
  document.querySelector('#lab-root').innerHTML=payload.html||'';
  await new Function('document','console','localStorage','sessionStorage','__int151Checkpoint',payload.code)(document,logger,local,session,checkpoint);
  for(const t of payload.tests||[]){
   try{const actual=new Function('document','localStorage','sessionStorage',(t.action||'')+'\\nreturn ('+t.read+');')(document,local,session);results.push({name:t.name,actual,expected:t.expected,passed:equal(actual,t.expected)});}
   catch(e){results.push({name:t.name,actual:e.name+': '+e.message,expected:t.expected,passed:false});}
  }
  if(errors.length)error=errors.join('\\n');
 }catch(e){error=e.name+': '+e.message;}
 try{send('result',{result:{logs,results,error,storage:local.snapshot()}});}catch(e){send('result',{result:{logs,results:[],error:'ผลลัพธ์ส่งกลับไม่ได้ กรุณาคืนค่าแบบ JSON'}});}
})();
</script></body></html>`;
}
