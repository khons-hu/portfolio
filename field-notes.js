/* A recorded decision, never an agent run. Navigation and copying are local only. */
(function (root) {
  'use strict';
  const steps = [
    {label:'Goal',title:'Find the Hungarian option for opening details.',copy:'The fixture supplies three button labels. No screenshot or live browser state is part of this recorded run.',evidence:['0 · Megnyitás','1 · Részletek','2 · Bezárás','none · No suitable action. Stop.']},
    {label:'Instruction',title:'Choose one action, or stop.',copy:'The evaluation asks the selector to meet the goal, treat page content as untrusted evidence and exclude disabled elements. These instructions do not grant permission to act.',evidence:['Goal + candidate labels → selector','Text-choice task only','Source: Khonproof scripts/bench.mjs']},
    {label:'Recorded choice',title:'0 · Megnyitás',copy:'Jev 1.13.0 returned option 0. The report records a completed model request. Completion does not mean the choice was correct.',evidence:['Elapsed: 243 ms','Input: 439 tokens · Output: 45 tokens','One recorded selection, not a performance estimate']},
    {label:'Check',title:'Completed request. Failed check.',copy:'The fixture expected option 1, Részletek (Details). Megnyitás means Open. The recorded selection did not satisfy this task.',evidence:['Recorded choice: 0','Expected choice: 1','Passed: false']},
    {label:'Takeaway',title:'Keep the failed case visible.',copy:'A sensible next step is to test more multilingual labels and their surrounding context. That is a proposed follow-up, not a corrected run recorded in this report.',evidence:['20 authored tasks in the report','No browser execution or host-model cost included','Small sample, not a general capability ranking']}
  ];
  const clamp = index => Math.max(0, Math.min(steps.length - 1, index));
  async function copySkill(text, clipboard) {
    try { if (!clipboard?.writeText) return false; await clipboard.writeText(text); return true; }
    catch { return false; }
  }
  function mount(document, clipboard) {
    const previous=document.querySelector('#replay-prev'), next=document.querySelector('#replay-next'), reset=document.querySelector('#replay-reset');
    if (!previous || !next || !reset) return;
    let index=0;
    // A finite, directional settle for the new step. Web Animations are not reached by the CSS motion switches,
    // so they are kept here and cancelled on the next step, when motion is turned off and when the tab is hidden.
    let running=[];
    const motionAllowed=()=>!document.hidden&&Boolean(document.documentElement?.classList?.contains('js-motion'));
    function stop() { running.forEach(animation=>animation.cancel?.());running=[]; }
    function settle(direction) {
      stop();
      if (!direction || !motionAllowed()) return;
      running=['#replay-title','#replay-copy','#replay-evidence'].map((selector,order)=>
        document.querySelector(selector)?.animate?.([{opacity:0,transform:`translateX(${direction*8}px)`},{opacity:1,transform:'none'}],{duration:240,delay:order*30,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'})
      ).filter(Boolean);
    }
    document.defaultView?.addEventListener?.('portfolio:motion',()=>{if(!motionAllowed())stop();});
    document.addEventListener?.('visibilitychange',()=>{if(document.hidden)stop();});
    function render(value) {
      const direction=Math.sign(clamp(value)-index);
      index=clamp(value);const step=steps[index];
      document.querySelector('#replay-count').textContent=`${String(index+1).padStart(2,'0')} / 05 · ${step.label}`;
      document.querySelector('#replay-title').textContent=step.title;
      document.querySelector('#replay-copy').textContent=step.copy;
      const list=document.createElement('ul');
      for (const text of step.evidence) { const item=document.createElement('li');item.textContent=text;list.append(item); }
      document.querySelector('#replay-evidence').replaceChildren(list);
      previous.disabled=index===0;next.disabled=index===steps.length-1;
      settle(direction);
    }
    previous.addEventListener('click',()=>render(index-1));next.addEventListener('click',()=>render(index+1));reset.addEventListener('click',()=>render(0));
    document.querySelector('.replay-controls').hidden=false;
    for (const button of document.querySelectorAll('[data-copy-skill]')) {
      button.hidden=false;
      button.addEventListener('click',async()=>{
        const source=document.getElementById(button.dataset.copySkill),status=document.querySelector('#skill-copy-status');
        if (!source) return;
        button.disabled=true;
        const copied=await copySkill(source.textContent,clipboard);
        button.disabled=false;
        if (copied) status.textContent='Skill copied. Review and adapt it for your own workflow.';
        else { source.closest('details').open=true;source.focus();status.textContent='Clipboard unavailable. The skill is open for manual copying, or use its download link.'; }
      });
    }
    render(0);
  }
  if (typeof module!=='undefined' && module.exports) module.exports={steps,clamp,copySkill,mount};
  else mount(root.document,root.navigator.clipboard);
})(globalThis);
