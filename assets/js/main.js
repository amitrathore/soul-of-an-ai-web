// Theme: apply saved preference immediately to avoid flash
(function(){const t=localStorage.getItem('soai-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();

const menu=document.querySelector('.menu');const links=document.querySelector('.links');if(menu){menu.addEventListener('click',()=>links.classList.toggle('open'))}
document.querySelectorAll('[data-title-reveal]').forEach(el=>{let toggle=false;const cycle=()=>{el.classList.add('revealing');setTimeout(()=>{toggle=!toggle;el.innerHTML=toggle?'SOUL OF <span class="gold">ANAI</span>':'SOUL OF <span class="gold">AN AI</span>';el.classList.remove('revealing');},700);};setTimeout(()=>{cycle();setInterval(cycle,5000);},3500);});

// Theme picker — inject below footer
(function(){
  const themes=[{t:'dark',label:'Dark'},{t:'twilight',label:'Twilight'},{t:'light',label:'Light'}];
  const footer=document.querySelector('.footer');
  if(!footer)return;
  const picker=document.createElement('div');
  picker.className='theme-picker';
  const current=localStorage.getItem('soai-theme')||'dark';
  picker.innerHTML='<span class="theme-picker-label">Theme</span>'+themes.map(({t,label})=>`<button class="theme-swatch${t===current?' active':''}" data-t="${t}" title="${label}" aria-label="${label} theme"></button>`).join('');
  footer.after(picker);
  picker.addEventListener('click',e=>{
    const btn=e.target.closest('.theme-swatch');
    if(!btn)return;
    const t=btn.dataset.t;
    document.documentElement.setAttribute('data-theme',t);
    localStorage.setItem('soai-theme',t);
    picker.querySelectorAll('.theme-swatch').forEach(b=>b.classList.toggle('active',b.dataset.t===t));
  });
})();
