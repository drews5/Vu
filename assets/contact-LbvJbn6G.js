import{c as i}from"./main-DdafuLMp.js";import{a as o}from"./network-BaEiGJ1S.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],m=i("mail",a),c="vocalu@umn.edu";async function u(t){const e=await o(`https://formsubmit.co/ajax/${c}`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:t.name.trim(),email:t.email.trim(),message:t.message.trim(),_subject:t.subject?.trim()||"New message from the Vocal U website",_replyto:t.email.trim(),_template:"table",_url:window.location.href})},2e4);if(!e.ok)throw new Error(`Contact submission failed with status ${e.status}.`);const s=await e.json();if(s?.success!==!0&&s?.success!=="true")throw new Error("The form service did not accept the submission.")}export{m as M,c,u as s};
