/* ISIONXXX // brand layer — retints every app to the terminal palette.
   Load right AFTER the app's <style> block and BEFORE the app's main <script>. */
(() => {
  const MAP = {
    // primary / positive (old teal) -> amber   (to keep green for P&L, change '#1fae8f' to '#3fd17a')
    '#1fae8f':'#ffb000','#22b597':'#ffbe1a','#2fd1ac':'#ffc233','#3fe0bb':'#ffd166','#157a66':'#b37a00','#14846c':'#b37a00',
    '#15604f':'#5c3f00','#2f5a50':'#5c3f00','#0b3d33':'#2a1d00','#0d3a30':'#2a1d00','#1c4a3e':'#4a3300','#2f3d39':'#3a2c10',
    '#10322a':'#1f1600','#12352c':'#1f1600','#0f2621':'#1a1300','#10221d':'#171108','#132420':'#17120a','#141c1a':'#14110a',
    '#233':'#3a2c10','#bfeee0':'#ffe2a6','#9fd9c9':'#e6c27a','#cfe':'#e6d3a8','#e8fff8':'#fff3d6','#06231c':'#140c00',
    // warning (old amber) -> orange
    '#e8a33a':'#ff7a33','#e8b43a':'#ff9a4d','#6b4a14':'#5c2a10','#3a2a10':'#2b160a','#5a4218':'#5c2e10',
    // negative -> terminal red
    '#f0304a':'#ff4d4d','#e02a43':'#ff3b3b','#5a1420':'#5c1515','#4a1219':'#3d1010','#3d1419':'#2a0f0f','#3a1519':'#2a0f0f',
    '#33161a':'#240e0e','#5a1f26':'#4a1a1a','#ffd2d8':'#ffc9c9',
    // secondary (old blue) -> steel; primary buttons -> amber
    '#4a78ff':'#7f9cb0','#3050ff':'#ffb000','#1d2f6b':'#2a3640','#23305a':'#2a3640','#141a2a':'#11161a','#cdd8ff':'#c9d6df',
    // category series
    '#b06cf0':'#c8b38a','#ff8a65':'#e0607e','#5fd4e8':'#4fb3a9','#a3c94a':'#a3b14a',
    // neutrals -> near-black, warm white
    '#121212':'#0a0a0a','#171717':'#0e0e0e','#1c1c1c':'#131313','#2b2b2b':'#222222','#252525':'#1c1c1c','#1a1a1a':'#111111',
    '#151515':'#0e0e0e','#161616':'#101010','#101010':'#080808','#0f0f0f':'#090909','#0d0d0d':'#070707','#0c0c0c':'#080808',
    '#ececec':'#e6e1d6'
  };
  const keys = Object.keys(MAP).map(k => k.slice(1)).sort((a, b) => b.length - a.length);
  const RE = new RegExp('#(' + keys.join('|') + ')([0-9a-f]{2})?(?![0-9a-f])', 'gi');
  const RGB = /31,\s*174,\s*143/g;
  const fix = s => {
    if (!s || (s.indexOf('#') < 0 && s.indexOf('31,') < 0)) return s;
    return s.replace(RE, (m, h, a) => MAP['#' + h.toLowerCase()] + (a || '')).replace(RGB, '255,176,0');
  };
  const ATTR = ['fill', 'stroke', 'stop-color', 'style', 'color'];
  const tint = e => { for (const a of ATTR) { const v = e.getAttribute(a); if (v) { const n = fix(v); if (n !== v) e.setAttribute(a, n); } } };
  const walk = n => {
    if (n.nodeType !== 1) return;
    if (n.tagName === 'STYLE') { n.textContent = fix(n.textContent); return; }
    tint(n); n.querySelectorAll('*').forEach(tint);
  };
  document.querySelectorAll('style').forEach(s => { s.textContent = fix(s.textContent); });
  new MutationObserver(ms => { for (const m of ms) m.addedNodes.forEach(walk); })
    .observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => walk(document.body));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0a0a0a');
})();
