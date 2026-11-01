// Pointer, touch and keyboard controls share the same normalized split value.
export function initImageComparison(){
 let dragging=null;
 const set=(stage,value)=>{const v=Math.min(100,Math.max(0,value));stage.style.setProperty('--split',v+'%');const h=stage.querySelector('.comparison-handle');h.setAttribute('aria-valuenow',String(Math.round(v)));h.setAttribute('aria-valuetext',`${Math.round(v)}% before, ${100-Math.round(v)}% after`)};
 const fromPointer=(stage,e)=>{const r=stage.getBoundingClientRect();set(stage,(e.clientX-r.left)/r.width*100)};
 document.addEventListener('pointerdown',e=>{const stage=e.target.closest('.comparison[data-interactive]');if(!stage||e.button>0)return;if(e.target.closest('.comparison-handle'))e.preventDefault();dragging={stage,id:e.pointerId};stage.setPointerCapture(e.pointerId);stage.dataset.dragging='true';stage.querySelector('.comparison-handle').focus({preventScroll:true});fromPointer(stage,e)});
 document.addEventListener('pointermove',e=>{if(dragging&&dragging.id===e.pointerId)fromPointer(dragging.stage,e)});
 const finish=e=>{if(!dragging||dragging.id!==e.pointerId)return;dragging.stage.removeAttribute('data-dragging');if(dragging.stage.hasPointerCapture(e.pointerId))dragging.stage.releasePointerCapture(e.pointerId);dragging=null};
 document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',finish);
 document.addEventListener('keydown',e=>{const handle=e.target.closest('.comparison-handle');if(!handle)return;const stage=handle.closest('.comparison'),v=Number(handle.getAttribute('aria-valuenow')),step=e.shiftKey?10:1;let next;if(e.key==='ArrowLeft')next=v-step;else if(e.key==='ArrowRight')next=v+step;else if(e.key==='PageDown')next=v-10;else if(e.key==='PageUp')next=v+10;else if(e.key==='Home')next=0;else if(e.key==='End')next=100;else return;e.preventDefault();set(stage,next)});
}
