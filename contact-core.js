/* Contact transport only. The local guide never calls this automatically. */
(function(root){
  const endpoint='https://formsubmit.co/ajax/ptr.obrtal@gmail.com';
  function payload(form){
    const email=String(form.email||'').trim(),message=String(form.message||'').trim();
    if(form.website)return null;
    if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('email');
    if(message.length<10||message.length>3000)throw Error('message');
    return {email,message,_subject:'Portfolio · Ask Khonsu',_template:'table'};
  }
  async function send(form,fetcher=fetch){
    const body=payload(form);if(!body)throw Error('blocked');
    const response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    const result=await response.json();
    if(result.success!==true&&result.success!=='true'&&/needs Activation/i.test(result.message||''))throw Error('activation');
    if(!response.ok||!(result.success===true||result.success==='true'))throw Error('delivery');
    return true;
  }
  const api={payload,send};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KhonsuContact=api;
})(typeof window!=='undefined'?window:globalThis);
