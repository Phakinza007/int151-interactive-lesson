import {units} from '../content/course.js';
import {createSandbox} from '../engine/sandbox.js';
const frame=document.querySelector('#frame'),button=document.querySelector('#run'),status=document.querySelector('#status'),list=document.querySelector('#results');
button.addEventListener('click',async()=>{
 button.disabled=true;list.replaceChildren();let passed=0,failed=0;
 const report=(name,ok,detail='')=>{const li=document.createElement('li');li.textContent=`${ok?'✓':'✗'} ${name}${detail?' · '+detail:''}`;li.style.color=ok?'#116c46':'#af2635';list.append(li);ok?passed++:failed++;status.textContent=`ผ่าน ${passed} · ไม่ผ่าน ${failed}`;};
 for(const unit of units)for(const activity of unit.activities.filter(a=>a.type!=='concept')){
  const sandbox=createSandbox({frame});
  try{
   const result=await sandbox.run({...activity,code:activity.solution||activity.code,tests:activity.tests||[]});
   report(`${unit.id}/${activity.id} ${activity.solution?'solution':'example'}`,!result.error&&result.results.every(t=>t.passed),result.error||result.results.filter(t=>!t.passed).map(t=>`${t.name}: ${JSON.stringify(t.actual)}`).join(';'));
   if(activity.type==='exercise'){
    const starter=await sandbox.run({...activity,code:activity.code});
    report(`${unit.id}/${activity.id} starter fails`,!!starter.error||starter.results.some(t=>!t.passed));
   }
  }catch(error){report(`${unit.id}/${activity.id}`,false,error.message);}finally{sandbox.dispose();}
 }
 let sandbox=createSandbox({frame});
 try{
  const result=await sandbox.run({mode:'dom',html:'<p>isolated</p>',code:"try { parent.document.body.innerHTML = 'bad'; } catch { console.log('isolated'); } console.log('</script>');",tests:[]});
  report('DOM cannot access parent and script terminators remain text',!result.error&&result.logs.some(l=>l.text==='isolated')&&result.logs.some(l=>l.text==='</script>'));
 }catch(e){report('DOM isolation',false,e.message);}finally{sandbox.dispose();}
 sandbox=createSandbox({frame,timeoutMs:100});
 try{await sandbox.run({mode:'js',code:'while(true){}',tests:[]});report('Infinite worker loop terminates',false);}
 catch(e){report('Infinite worker loop terminates with useful message',/นานเกิน/.test(e.message),e.message);}finally{sandbox.dispose();}
 sandbox=createSandbox({frame});
 try{const result=await sandbox.run({mode:'dom',html:'<p>loop</p>',code:'while(true){}',tests:[]});report('Accidental DOM loop is stopped by a checkpoint',/รันนานเกิน/.test(result.error||''),result.error||'');}
 catch(e){report('DOM loop guard',false,e.message);}finally{sandbox.dispose();}
 status.textContent=`เสร็จแล้ว · ผ่าน ${passed} · ไม่ผ่าน ${failed}`;status.dataset.failed=failed;button.disabled=false;
});
