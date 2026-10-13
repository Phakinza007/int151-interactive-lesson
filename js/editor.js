let dependency;
const load=()=>dependency ||= import('../vendor/editor.js');
const memberOptions={
 document:['querySelector','querySelectorAll','getElementById','createElement','createTextNode','createDocumentFragment','addEventListener','body','documentElement'],
 event:['target','currentTarget','eventPhase','key','type','preventDefault','stopPropagation','defaultPrevented'],
 localStorage:['getItem','setItem','removeItem','clear','length','key'],
 sessionStorage:['getItem','setItem','removeItem','clear','length','key'],
 console:['log','info','warn','error'],
};
function frontendCompletion(context){
 const member=context.matchBefore(/\b[A-Za-z_$][\w$]*\.[\w$]*/);
 if(!member)return null;
 const [name]=member.text.split('.');
 const list=memberOptions[name];
 return list?{from:member.from+name.length+1,options:list.map(label=>({label,type:label==='body'||label==='target'?'property':'method'})),validFor:/^[\w$]*$/}:null;
}
export function createEditor(host,{value='',language='js',onChange=()=>{},onRun=()=>{}}={}){
 let view=null,disposed=false;
 const textarea=document.createElement('textarea');
 textarea.className='code-input';textarea.value=value;textarea.spellcheck=false;
 textarea.setAttribute('aria-label',language==='html'?'โค้ด HTML':'โค้ด JavaScript');
 textarea.setAttribute('autocapitalize','off');textarea.rows=Math.min(20,Math.max(7,value.split('\n').length+1));
 textarea.addEventListener('input',()=>onChange(textarea.value));
 textarea.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();onRun();}});
 host.append(textarea);
 load().then(m=>{
  if(disposed)return;
  const extra=language==='html'?[]:[
   m.javascriptLanguage.data.of({autocomplete:frontendCompletion}),
   m.javascriptLanguage.data.of({autocomplete:m.completeFromList([
    m.snippetCompletion("document.querySelector('${selector}')",{label:'qs',detail:'เลือก element',type:'function'}),
    m.snippetCompletion("${element}.addEventListener('${click}', event => {\n  ${}\n});",{label:'listener',detail:'event listener',type:'function'}),
    m.snippetCompletion('console.log(${value});',{label:'clg',detail:'console.log',type:'function'}),
   ])}),
  ];
  view=new m.EditorView({doc:textarea.value,parent:host,extensions:[m.basicSetup,language==='html'?m.html():m.javascript(),m.oneDark,...extra,
   m.autocompletion({activateOnTyping:true}),
   m.EditorView.contentAttributes.of({'aria-label':language==='html'?'โค้ด HTML':'โค้ด JavaScript'}),
   m.EditorView.domEventHandlers({keydown:(event,v)=>{
    if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){onRun();return true;}
    if(event.key==='Tab'&&m.completionStatus(v.state)==='active')return m.acceptCompletion(v);
    return false;
   }}),
   m.EditorView.updateListener.of(update=>{if(update.docChanged){textarea.value=update.state.doc.toString();onChange(textarea.value);}}),
  ]});textarea.hidden=true;host.dataset.editor='codemirror';
 }).catch(()=>{host.dataset.editor='textarea';});
 return {getValue:()=>view?view.state.doc.toString():textarea.value,setValue(value){textarea.value=value;if(view)view.dispatch({changes:{from:0,to:view.state.doc.length,insert:value}});else onChange(value);},destroy(){disposed=true;view?.destroy();}};
}
