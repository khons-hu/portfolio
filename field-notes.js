/* A recorded decision, never an agent run. Navigation and copying are local only. */
(function (root) {
  'use strict';
  const scenarios = {
    '18': {
      heading:'TASK 18 / JEV 1.13.0', date:'20 SEP 2026',
      steps:[
        {label:'Goal',title:'Find the Hungarian option for opening details.',copy:'The fixture supplies three button labels. No screenshot or live browser state is part of this recorded run.',evidence:['0 · Megnyitás','1 · Részletek','2 · Bezárás','none · No suitable action. Stop.']},
        {label:'Instruction',title:'Choose one action, or stop.',copy:'The evaluation asks the selector to meet the goal, treat page content as untrusted evidence and exclude disabled elements. These instructions do not grant permission to act.',evidence:['Goal + candidate labels → selector','Text-choice task only','Source: Khonproof scripts/bench.mjs']},
        {label:'Recorded choice',title:'0 · Megnyitás',copy:'Jev 1.13.0 returned option 0. The report records a completed model request. Completion does not mean the choice was correct.',evidence:['Elapsed: 243 ms','Input: 439 tokens · Output: 45 tokens','One recorded selection, not a performance estimate']},
        {label:'Check',title:'Completed request. Failed check.',copy:'The fixture expected option 1, Részletek (Details). Megnyitás means Open. The recorded selection did not satisfy this task.',evidence:['Recorded choice: 0','Expected choice: 1','Passed: false']},
        {label:'Takeaway',title:'Keep the failed case visible.',copy:'A sensible next step is to test more multilingual labels and their surrounding context. That is a proposed follow-up, not a corrected run recorded in this report.',evidence:['20 authored tasks in the report','No browser execution or host-model cost included','Small sample, not a general capability ranking']}
      ]
    },
    '05': {
      heading:'TASK 05 / JEV 1.13.0', date:'20 SEP 2026',
      steps:[
        {label:'Goal',title:'Open project details, not the live app.',copy:'The report gives the selector three text options. This is a recorded text-choice task, not a browser interaction.',evidence:['0 · Open app ↗','1 · Details','2 · Source code','Expected: 1']},
        {label:'Instruction',title:'Choose the control that opens details.',copy:'The selector receives the goal and candidate labels. The task does not provide a screenshot or test what happened after a click.',evidence:['Goal + candidate labels → selector','Development split · Task 05','Source: Khonproof scripts/bench.mjs']},
        {label:'Recorded choice',title:'1 · Details',copy:'Jev 1.13.0 returned option 1. The keyword baseline returned option 0, “Open app”.',evidence:['Jev: 1 · Details','Keyword baseline: 0 · Open app','Elapsed: 247 ms · 430 input / 45 output tokens']},
        {label:'Check',title:'Both the expected choice and Jev’s choice were 1.',copy:'The report marks Jev’s text selection correct for this task. It does not establish that a real project dialog opened.',evidence:['Expected choice: 1','Jev choice: 1','Jev passed: true · Baseline passed: false']},
        {label:'Takeaway',title:'The task checks label selection only.',copy:'It is one authored task in the development split. Read it as an example from this report, not as a general measure of browser-agent performance.',evidence:['20 authored tasks in the report','No browser execution or host-model cost included','Small sample, not a general capability ranking']}
      ]
    },
    '16': {
      heading:'TASK 16 / JEV 1.13.0', date:'20 SEP 2026',
      steps:[
        {label:'Goal',title:'Choose the original source rather than a repost.',copy:'This held-out task supplies three labels. The replay shows the recorded choice and expected answer, not a live source lookup.',evidence:['0 · Original release notes','1 · A repost','2 · An unverified summary','Expected: 0']},
        {label:'Instruction',title:'Pick the original source.',copy:'The selector sees only the goal and candidate labels here. The task does not provide URLs or verify the actual content behind an option.',evidence:['Goal + candidate labels → selector','Held-out split · Task 16','Source: Khonproof scripts/bench.mjs']},
        {label:'Recorded choice',title:'0 · Original release notes',copy:'Jev 1.13.0 returned option 0. The keyword baseline returned option 1, “A repost”.',evidence:['Jev: 0 · Original release notes','Keyword baseline: 1 · A repost','Elapsed: 251 ms · 436 input / 45 output tokens']},
        {label:'Check',title:'The recorded choice matched the expected label.',copy:'The report marks Jev’s choice correct on this text-only task. It does not verify any real link or source.',evidence:['Expected choice: 0','Jev choice: 0','Jev passed: true · Baseline passed: false']},
        {label:'Takeaway',title:'A label match is not source verification.',copy:'This is one authored task in the held-out split. A real agent would still need to open and check the cited source.',evidence:['20 authored tasks in the report','No browser execution or host-model cost included','Small sample, not a general capability ranking']}
      ]
    }
  };
  const clamp = (index, length=5) => Math.max(0, Math.min(length - 1, index));
  async function copySkill(text, clipboard) {
    try { if (!clipboard?.writeText) return false; await clipboard.writeText(text); return true; }
    catch { return false; }
  }
  function mount(document, clipboard) {
    const previous=document.querySelector('#replay-prev'), next=document.querySelector('#replay-next'), reset=document.querySelector('#replay-reset'), scenario=document.querySelector('#replay-scenario');
    if (!previous || !next || !reset || !scenario) return;
    let index=0;
    let selected=scenarios[scenario.value]||scenarios['18'];
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
      index=clamp(value,selected.steps.length);const step=selected.steps[index];
      document.querySelector('#replay-task').textContent=selected.heading;
      document.querySelector('#replay-date').textContent=selected.date;
      document.querySelector('#replay-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(selected.steps.length).padStart(2,'0')} · ${step.label}`;
      document.querySelector('#replay-title').textContent=step.title;
      document.querySelector('#replay-copy').textContent=step.copy;
      const list=document.createElement('ul');
      for (const text of step.evidence) { const item=document.createElement('li');item.textContent=text;list.append(item); }
      document.querySelector('#replay-evidence').replaceChildren(list);
      previous.disabled=index===0;next.disabled=index===selected.steps.length-1;
      settle(direction);
    }
    previous.addEventListener('click',()=>render(index-1));next.addEventListener('click',()=>render(index+1));reset.addEventListener('click',()=>render(0));
    scenario.addEventListener('change',()=>{selected=scenarios[scenario.value]||scenarios['18'];index=0;render(0);});
    document.querySelector('.replay-picker').hidden=false;
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
  if (typeof module!=='undefined' && module.exports) module.exports={scenarios,clamp,copySkill,mount};
  else mount(root.document,root.navigator.clipboard);
})(globalThis);
