// Theme: apply saved preference immediately to avoid flash
(function(){const t=localStorage.getItem('soai-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();

const menu=document.querySelector('.menu');const links=document.querySelector('.links');if(menu){menu.addEventListener('click',()=>links.classList.toggle('open'))}
document.querySelectorAll('[data-title-reveal]').forEach(el=>{let toggle=false;const cycle=()=>{el.classList.add('revealing');setTimeout(()=>{toggle=!toggle;el.innerHTML=toggle?'SOUL OF <span class="gold">ANAI</span>':'SOUL OF <span class="gold">AN AI</span>';el.classList.remove('revealing');},700);};setTimeout(()=>{cycle();setInterval(cycle,5000);},3500);});

// ── Breathing mirror ──────────────────────────────────────────────────────────
(function(){
  const canvas = document.querySelector('.mirror-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, raf;
  let tx = 0, ty = 0;          // smoothed mouse offset, –0.5…0.5
  let mtx = 0, mty = 0;        // raw mouse target

  // Read --gold from the active theme; cache it; refresh on data-theme change
  let rgb = [202, 168, 106];
  function refreshColor() {
    const hex = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
    const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (m) rgb = [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)];
  }
  refreshColor();
  new MutationObserver(refreshColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  function draw(ts) {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // Ease mouse
    tx += (mtx - tx) * 0.045;
    ty += (mty - ty) * 0.045;

    // Scroll fade: fully gone after 60 % of hero height
    const fadeOut = Math.max(0, 1 - window.scrollY / (H * 0.6));
    if (fadeOut <= 0) return;

    const [r,g,b] = rgb;
    const c = `${r},${g},${b}`;

    // Three independent breath cycles — organic, never fully in sync
    const b1 = Math.sin(ts * 0.00033) * 0.5 + 0.5;  // ~19 s
    const b2 = Math.sin(ts * 0.00025 + 1.3) * 0.5 + 0.5; // ~25 s
    const b3 = Math.sin(ts * 0.00019 + 2.7) * 0.5 + 0.5; // ~33 s

    const base = Math.min(W, H) * 0.27;

    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.translate(W / 2, H / 2);

    // 2-D tilt approximation: shear + small parallax shift
    ctx.transform(1, ty * 0.07, tx * 0.07, 1, tx * base * 0.09, ty * base * 0.09);

    // ── Atmospheric haze ──────────────────────────────────────
    const haze = ctx.createRadialGradient(0, 0, base * 0.2, 0, 0, base * 1.9);
    haze.addColorStop(0,   `rgba(${c},0)`);
    haze.addColorStop(0.45,`rgba(${c},${0.028 + b1 * 0.018})`);
    haze.addColorStop(1,   `rgba(${c},0)`);
    ctx.fillStyle = haze;
    ctx.beginPath(); ctx.arc(0, 0, base * 1.9, 0, Math.PI*2); ctx.fill();

    // ── Inner glow ────────────────────────────────────────────
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, base * 0.45);
    glow.addColorStop(0,`rgba(${c},${0.07 + b2 * 0.05})`);
    glow.addColorStop(1,`rgba(${c},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, base * 0.45, 0, Math.PI*2); ctx.fill();

    // ── Concentric rings  (outer → inner) ────────────────────
    //    Each breathes on a different cycle and at a different amplitude
    const rings = [
      { s:1.04, lw:0.55, a:0.10, br:b3, blur:true  },
      { s:0.90, lw:0.75, a:0.17, br:b1, blur:false },
      { s:0.76, lw:0.55, a:0.13, br:b2, blur:false },
      { s:0.60, lw:1.10, a:0.24, br:b1, blur:false },
      { s:0.42, lw:0.50, a:0.11, br:b3, blur:true  },
    ];

    rings.forEach(({s, lw, a, br, blur}) => {
      const rad = base * s * (1 + (br - 0.5) * 0.028);
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(${c},${a * (0.55 + br * 0.45)})`;
      ctx.lineWidth = lw;
      if (blur) ctx.filter = 'blur(0.8px)';
      ctx.stroke();
      if (blur) ctx.filter = 'none';
    });

    // ── Centre point ──────────────────────────────────────────
    const pr = 1.4 + b2 * 1.2;
    const pg = ctx.createRadialGradient(0,0,0,0,0,pr*2.5);
    pg.addColorStop(0,`rgba(${c},${0.35+b2*0.35})`);
    pg.addColorStop(1,`rgba(${c},0)`);
    ctx.fillStyle = pg;
    ctx.beginPath(); ctx.arc(0, 0, pr * 2.5, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mtx = (e.clientX - rect.left  - rect.width  / 2) / rect.width;
    mty = (e.clientY - rect.top   - rect.height / 2) / rect.height;
  });

  resize();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(performance.now()); });
  draw(performance.now());
})();

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
