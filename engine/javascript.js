import {equal,show,createMemoryStorage} from './shared.js';
export async function runJavaScript({code='',fn,tests=[],storage={}}={}){
  const logs=[];const results=[];const localStorage=createMemoryStorage(storage);const sessionStorage=createMemoryStorage();
  const console=Object.fromEntries(['log','info','warn','error'].map(level=>[level,(...args)=>logs.push({level,text:args.map(show).join(' ')})]));
  let error=null;
  try{
    if(fn&&!/^[A-Za-z_$][\w$]*$/.test(fn))throw new Error('Invalid function name');
    const api=new Function('console','localStorage','sessionStorage',code+`\n;return ${fn?`typeof ${fn} === 'function' ? ${fn} : null`:'null'};`)(console,localStorage,sessionStorage);
    if(tests.length&&!api)throw new Error(`ยังไม่พบฟังก์ชัน ${fn}`);
    for(const t of tests){
      try{const actual=await api(...structuredClone(t.args||[]));results.push({name:t.name,actual,expected:t.expected,passed:equal(actual,t.expected)});
       if(t.storageExpected)for(const [key,expected] of Object.entries(t.storageExpected)){const actual=localStorage.getItem(key);results.push({name:t.name+' · localStorage.'+key,actual,expected,passed:equal(actual,expected)});}}
      catch(e){results.push({name:t.name,actual:`${e.name}: ${e.message}`,expected:t.expected,passed:false});}
    }
  }catch(e){error=`${e.name}: ${e.message}`;}
  return {logs,results,storage:localStorage.snapshot(),error};
}
