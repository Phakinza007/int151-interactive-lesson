import {frameDocument} from './frame.js';
export function createSandbox({frame,onLog=()=>{},timeoutMs=3000}={}){
  let worker=null,listener=null,timer=null,rejectPending=null;
  function dispose(reason=new Error('หยุดการรันแล้ว')){
    if(worker)worker.terminate();worker=null;
    if(listener)window.removeEventListener('message',listener);listener=null;
    clearTimeout(timer);
    if(rejectPending)rejectPending(reason);
    rejectPending=null;
    if(frame){frame.srcdoc='';frame.hidden=true;}
  }
  function run(payload){
    dispose();
    const token=crypto.randomUUID();
    return new Promise((resolve,reject)=>{
      rejectPending=reject;
      const finish=result=>{clearTimeout(timer);rejectPending=null;resolve(result);};
      timer=setTimeout(()=>dispose(new Error('รันนานเกินเวลาที่กำหนด · ตรวจว่ามีลูปไม่จบหรือไม่')),timeoutMs);
      if(payload.mode==='dom'){
        frame.hidden=false;
        listener=event=>{
          if(event.source!==frame.contentWindow||event.data?.token!==token)return;
          if(event.data.kind==='log')onLog(event.data.log);
          if(event.data.kind==='result')finish(event.data.result);
        };
        window.addEventListener('message',listener);
        frame.srcdoc=frameDocument(payload,token);
      }else{
        worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});
        worker.onmessage=({data})=>{if(data.token===token){worker?.terminate();worker=null;finish(data.result);}};
        worker.onerror=event=>dispose(new Error(event.message||'โหลด worker ไม่สำเร็จ'));
        worker.postMessage({token,payload});
      }
    });
  }
  return {run,dispose};
}
