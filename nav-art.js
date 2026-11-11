(()=>{const svg={
home:'<svg viewBox="0 0 28 28"><path d="M5 13.5 14 6l9 7.5v9H8v-8"/><path d="M11 22v-6h6v6"/></svg>',
quiz:'<svg viewBox="0 0 28 28"><path d="M6 21.5 7.6 16 18.8 5.3c1-1 2.5-1 3.5 0l.4.4c1 1 1 2.5 0 3.5L11.5 20 6 21.5Z"/><path d="m8 16 4 4"/></svg>',
records:'<svg viewBox="0 0 28 28"><path d="M7 5.5h14v17H7z"/><path d="M10 10h8M10 14h8M10 18h5"/></svg>',
profile:'<svg viewBox="0 0 28 28"><circle cx="14" cy="9" r="4"/><path d="M6.5 22c.8-5 3.3-7.5 7.5-7.5s6.7 2.5 7.5 7.5"/></svg>',
settings:'<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="4"/><path d="M14 3v4M14 21v4M3 14h4M21 14h4M6.2 6.2 9 9M19 19l2.8 2.8M21.8 6.2 19 9M9 19l-2.8 2.8"/></svg>'};document.querySelectorAll('nav [data-page]').forEach(b=>{const label=b.getAttribute('aria-label')||b.querySelector('span')?.textContent||'';b.innerHTML=`<span class="nav-line-icon">${svg[b.dataset.page]||''}</span><span class="nav-label">${label}</span>`})})();
