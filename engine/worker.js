import {runJavaScript} from './javascript.js';
self.onmessage=async({data})=>{
  const result=await runJavaScript(data.payload);
  try{self.postMessage({token:data.token,result});}
  catch{self.postMessage({token:data.token,result:{logs:[],results:[],error:'ผลลัพธ์มีค่าที่ส่งกลับไม่ได้ เช่น function หรือ DOM node'}});}
};
