import fs from "fs";
const DIR = "/home/user/now";

let sales = fs.readFileSync(DIR+"/sales-command-center/index.html","utf8");
let life  = fs.readFileSync(DIR+"/life-command-center/index.html","utf8");

// Remove the life app's relative cross-link (broken inside srcdoc; the shell switches instead)
life = life.replace(/<a class="btn" href="\.\.\/sales-command-center\/index\.html" id="salesLink">[\s\S]*?<\/a>/, "");

// Base64 (UTF-8 safe) — no quotes / no </script> / no escaping needed inside text/plain blocks
const b64 = h => Buffer.from(h, "utf8").toString("base64");

const shell = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Command Center</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;background:#000;}
  body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;flex-direction:column;color:#eef2ff;overflow:hidden;}
  .hq{display:flex;align-items:center;gap:.7rem;padding:.55rem 1rem;background:#0a0b0d;border-bottom:1px solid rgba(150,162,180,.16);flex:0 0 auto;z-index:5;}
  .hq .logo{font-size:1rem;font-weight:800;letter-spacing:1.5px;margin-right:auto;color:#e9ebee;}
  .sw{display:flex;gap:.35rem;background:rgba(255,255,255,.05);border:1px solid rgba(150,162,180,.16);border-radius:999px;padding:.25rem;}
  .sw button{border:none;background:none;color:#a9b2e6;font-family:inherit;font-size:.9rem;font-weight:650;padding:.4rem 1rem;border-radius:999px;cursor:pointer;transition:all .15s;}
  .sw button.active{color:#e9ebee;}
  .sw button.active{background:#2c3138;color:#e9ebee;}
  iframe{flex:1 1 auto;width:100%;border:none;background:#000;}
</style>
</head>
<body>
  <div class="hq">
    <div class="logo">◈ COMMAND CENTER</div>
    <div class="sw" id="sw">
      <button data-app="life">🌌 Life</button>
      <button data-app="sales">⚔️ Sales</button>
    </div>
  </div>
  <iframe id="frame" title="Command Center"></iframe>

  <script type="text/plain" id="app-life">${b64(life)}</script>
  <script type="text/plain" id="app-sales">${b64(sales)}</script>
  <script>
    function dec(id){ return decodeURIComponent(escape(atob(document.getElementById(id).textContent.trim()))); }
    var apps = { life: dec('app-life'), sales: dec('app-sales') };
    var frame = document.getElementById('frame');
    var current = null;
    function show(which){
      if(which===current) return;
      current = which;
      frame.srcdoc = apps[which];
      try{ localStorage.setItem('cc_last', which); }catch(e){}
      var btns = document.querySelectorAll('#sw button');
      for(var i=0;i<btns.length;i++){ btns[i].classList.toggle('active', btns[i].getAttribute('data-app')===which); }
    }
    document.getElementById('sw').addEventListener('click', function(e){
      var t=e.target; while(t && t.tagName!=='BUTTON') t=t.parentNode;
      if(t && t.getAttribute('data-app')) show(t.getAttribute('data-app'));
    });
    var last='life'; try{ last = localStorage.getItem('cc_last')||'life'; }catch(e){}
    show(last);
  </script>
</body>
</html>`;

fs.writeFileSync(DIR+"/command-center-hq/index.html", shell);
const title=(shell.match(/<title>[\s\S]*?<\/title>/)||[""])[0];
const style=(shell.match(/<style>[\s\S]*?<\/style>/)||[""])[0];
const body=(shell.match(/<body>([\s\S]*)<\/body>/)||[,""])[1];
fs.writeFileSync(DIR+"/command-center-hq/artifact.html", title+"\n"+style+"\n"+body);
console.log("merged shell:", (shell.length/1024).toFixed(0)+"KB (base64 embed) | life:", (life.length/1024).toFixed(0)+"KB sales:", (sales.length/1024).toFixed(0)+"KB");
