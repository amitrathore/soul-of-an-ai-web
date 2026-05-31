const menu=document.querySelector('.menu');const links=document.querySelector('.links');if(menu){menu.addEventListener('click',()=>links.classList.toggle('open'))}
const el=document.querySelector('[data-title-reveal]');if(el){let toggle=false;setInterval(()=>{toggle=!toggle;el.innerHTML=toggle?'SOUL OF <span class="gold">ANAI</span>':'SOUL OF <span class="gold">AN AI</span>';},2200)}
