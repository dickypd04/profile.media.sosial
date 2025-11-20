async function loadJSON(path){ try{ const r=await fetch(path); return await r.json(); }catch(e){console.error('JSON load error',path,e); return null } }

function el(tag, attrs={}, children=[]){ const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') e.className=v; else if(k==='html') e.innerHTML=v; else e.setAttribute(k,v) }); if(typeof children === 'string') e.textContent=children; else children.forEach(c=>e.appendChild(c)); return e }

function createLinkButton(item){ const a=el('a',{class:'link',href:item.url,target:'_blank',rel:'noopener noreferrer'}); const label=el('div',{class:'label'},[document.createTextNode(item.label)]); a.appendChild(label); if(item.subtitle) a.appendChild(el('small',{},[document.createTextNode(item.subtitle)])); return a }

async function init(){ const profile = await loadJSON('config/profile.json') || {}; const linksCfg = await loadJSON('config/links.json') || {links:[]}; const themeCfg = await loadJSON('config/theme.json') || {};

  // header
  const avatarEl = document.getElementById('avatar');
  if(profile.photo && profile.photo.length){ avatarEl.innerHTML = `<img src="${profile.photo}" alt="avatar">`; } else {
    avatarEl.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.02)"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z" fill="rgba(255,255,255,0.4)"/></svg>';
  }

  document.getElementById('username').textContent = profile.username || 'yourName';
  document.getElementById('bio').textContent = profile.bio || 'Deskripsi singkat kamu — ubah di config/profile.json';

  const linksContainer = document.getElementById('links');
  linksContainer.innerHTML = '';
  if(Array.isArray(linksCfg.links) && linksCfg.links.length){
    linksCfg.links.forEach(it=> linksContainer.appendChild(createLinkButton(it)));
  } else {
    linksContainer.appendChild(el('div',{},[document.createTextNode('Belum ada link. Edit /config/links.json') ]));
  }

  // footer
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('brand').textContent = profile.brand || 'YourBrand';

  // copy main link (first link) button
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async ()=>{
    const first = (linksCfg.links && linksCfg.links[0] && linksCfg.links[0].url) || window.location.href;
    try{ await navigator.clipboard.writeText(first); copyBtn.textContent='✅'; setTimeout(()=>copyBtn.textContent='🔗',1200) }catch(e){ console.warn(e); copyBtn.textContent='✖'; setTimeout(()=>copyBtn.textContent='🔗',1200) }
  });

  // simple theme toggle (only visual)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
    themeToggle.textContent = document.documentElement.classList.contains('light') ? '🌞' : '🌓';
  });

  // optional theme.json overrides (like default light mode)
  if(themeCfg.mode === 'light') document.documentElement.classList.add('light');
}

document.addEventListener('DOMContentLoaded', init);
