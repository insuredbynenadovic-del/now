import fs from "fs";
const book = JSON.parse(fs.readFileSync("/home/user/now/sales-command-center/Michael-Ringy-book.json","utf8")).leads;
const DATA = JSON.stringify(book).replace(/</g,"\\u003c");

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>The Bridge</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#0a0a0b; --ink:#efe9dd; --ink2:#a49b88; --muted:#6b6456;
    --brass:#c9a25a; --brass-2:#e6cd8f; --line:rgba(201,162,90,.22); --panel:rgba(24,22,18,.55);
    --danger:#c0625f; --cool:#7d8ea0;
  }
  html,body{height:100%;}
  body{background:var(--bg); color:var(--ink); font-family:Georgia,"Times New Roman",serif; overflow-x:hidden; position:relative; min-height:100vh;}
  /* film grain + vignette */
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:3;
    background:radial-gradient(120% 100% at 50% 0%, transparent 55%, rgba(0,0,0,.55) 100%);}
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:3;opacity:.05;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .wrap{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:clamp(1.5rem,4vw,3.5rem) clamp(1.2rem,4vw,2.5rem);}
  .eyebrow{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:.72rem;letter-spacing:.34em;text-transform:uppercase;color:var(--brass);}
  .masthead{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:1rem;flex-wrap:wrap;gap:.5rem;}
  .masthead h1{font-size:clamp(1.4rem,3vw,2rem);font-weight:400;letter-spacing:.5px;}
  .masthead .clock{font-family:ui-monospace,monospace;color:var(--ink2);font-size:.85rem;}

  .hero{margin:clamp(2rem,6vw,4rem) 0;}
  .hero .line{font-size:clamp(1.35rem,3.4vw,2.3rem);line-height:1.35;font-weight:400;max-width:22ch;text-wrap:balance;}
  .hero .line b{color:var(--brass-2);font-style:italic;}
  .hero .big{display:flex;align-items:flex-end;gap:1.2rem;margin-top:1.6rem;flex-wrap:wrap;}
  .figure{font-size:clamp(3.6rem,13vw,7rem);line-height:.9;font-weight:400;color:var(--ink);letter-spacing:-.02em;font-variant-numeric:tabular-nums;}
  .figure .u{font-size:.28em;color:var(--ink2);letter-spacing:.02em;margin-left:.3rem;}
  .figure-sub{font-family:ui-monospace,monospace;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);padding-bottom:1rem;max-width:24ch;}

  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-top:2.5rem;}
  @media(max-width:720px){.grid{grid-template-columns:repeat(2,1fr);}}
  .cell{background:#0c0b0a;padding:1.1rem 1.2rem;}
  .cell .k{font-family:ui-monospace,monospace;font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);}
  .cell .v{font-size:2.1rem;font-weight:400;margin-top:.35rem;font-variant-numeric:tabular-nums;}
  .cell .v.warn{color:var(--danger);}
  .cell .v.brass{color:var(--brass-2);}

  .pipeline{margin-top:2.5rem;}
  .pipeline .head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.9rem;}
  .pipeline .head .t{font-family:ui-monospace,monospace;font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--brass);}
  .pipeline .bar{display:flex;height:14px;border-radius:2px;overflow:hidden;border:1px solid var(--line);}
  .pipeline .seg{height:100%;}
  .pipeline .legend{display:flex;flex-wrap:wrap;gap:.2rem 1.4rem;margin-top:.9rem;font-family:ui-monospace,monospace;font-size:.72rem;color:var(--ink2);}
  .pipeline .legend span b{color:var(--ink);font-weight:400;}
  .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:.45rem;vertical-align:middle;}

  .targets{margin-top:2.8rem;}
  .targets .t{font-family:ui-monospace,monospace;font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--brass);margin-bottom:1rem;}
  .target{display:flex;align-items:baseline;gap:1rem;padding:1rem 0;border-top:1px solid var(--line);}
  .target .rank{font-family:ui-monospace,monospace;color:var(--muted);font-size:.8rem;width:2ch;}
  .target .who{font-size:1.25rem;flex:1;}
  .target .who small{display:block;font-family:ui-monospace,monospace;font-size:.72rem;letter-spacing:.06em;color:var(--ink2);margin-top:.2rem;text-transform:none;}
  .target .prob{font-size:1.5rem;color:var(--brass-2);font-variant-numeric:tabular-nums;}
  .target .prob small{color:var(--muted);font-size:.6em;}
  .foot{margin-top:3.2rem;padding-top:1.3rem;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .foot .note{font-family:ui-monospace,monospace;font-size:.7rem;color:var(--muted);letter-spacing:.05em;max-width:44ch;}
  .enter{font-family:ui-monospace,monospace;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:var(--bg);background:var(--brass);border:none;padding:.9rem 1.6rem;border-radius:2px;cursor:pointer;text-decoration:none;}
  .enter:hover{background:var(--brass-2);}
  @keyframes breathe{0%,100%{opacity:.85}50%{opacity:1}}
  .live{animation:breathe 3.4s ease-in-out infinite;}
</style></head>
<body>
<div class="wrap">
  <div class="masthead">
    <div><div class="eyebrow">Command · Private Terminal</div><h1 id="greet">The Bridge</h1></div>
    <div class="clock" id="clock"></div>
  </div>

  <div class="hero">
    <div class="line" id="thesis"></div>
    <div class="big">
      <div class="figure live"><span id="reach">0</span><span class="u" id="reachU">in reach</span></div>
      <div class="figure-sub" id="reachSub"></div>
    </div>
  </div>

  <div class="grid" id="stats"></div>

  <div class="pipeline">
    <div class="head"><div class="t">Pipeline</div><div class="t" id="activeCount"></div></div>
    <div class="bar" id="bar"></div>
    <div class="legend" id="legend"></div>
  </div>

  <div class="targets">
    <div class="t">Call first — ranked by pull</div>
    <div id="targetList"></div>
  </div>

  <div class="foot">
    <div class="note">Your book, on this device only. This is the read-out; open the center to work it.</div>
    <a class="enter" href="./My-Command-Center-857-leads.html">Enter Command Center →</a>
  </div>
</div>

<script>
"use strict";
const LEADS = window.__BOOK__ = ${DATA};
const dead=["Issued","Lost","Declined","Canceled"];
const active=LEADS.filter(l=>!dead.includes(l.stage));
const t=(new Date()).toISOString().slice(0,10);
const num=n=>n.toLocaleString();

// expected policies "in reach" = sum of close-odds across active
const reach=active.reduce((s,l)=>s+(+l.closeProb||0),0)/10;
const issued=LEADS.filter(l=>l.stage==="Issued").length;
const quoted=LEADS.filter(l=>l.stage==="Quoted").length;
const appts=LEADS.filter(l=>l.appointmentAt||l.stage==="Appointment Set").length;
const ghosts=LEADS.filter(l=>l.stage==="Ghosted").length;
const closers=active.filter(l=>(+l.closeProb||0)>=8).length;
const overdue=LEADS.filter(l=>l.followUpAt && l.followUpAt.slice(0,10)<t && !dead.includes(l.stage)).length;

const h=new Date().getHours();
document.getElementById("greet").textContent = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
document.getElementById("thesis").innerHTML = "You are holding <b>"+num(active.length)+" live prospects</b>. "+
  (closers?("<b>"+closers+"</b> are within one conversation of closing."):("Warm them and they close."));

function tick(){ const d=new Date(); document.getElementById("clock").textContent = d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})+"  ·  "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"}); }
tick(); setInterval(tick,1000*30);

// count-up the hero figure
const target=Math.round(reach*10)/10;
let cur=0; const step=target/28;
const rEl=document.getElementById("reach");
(function roll(){ cur+=step; if(cur>=target){cur=target;} rEl.textContent=cur.toFixed(1); if(cur<target) requestAnimationFrame(roll); })();
document.getElementById("reachU").textContent=" policies in reach";
document.getElementById("reachSub").textContent="expected closes across your active book, weighted by your own odds";

const cells=[["Clients issued",issued,"brass"],["Quoted, deciding",quoted,""],["Appointments",appts,""],["Overdue",overdue,overdue?"warn":""]];
document.getElementById("stats").innerHTML=cells.map(c=>'<div class="cell"><div class="k">'+c[0]+'</div><div class="v '+c[2]+'">'+num(c[1])+'</div></div>').join("");

// pipeline bar
const stages=[["Quoted","#c9a25a"],["Appointment Set","#b98a54"],["Contacted","#7d8ea0"],["New","#4f5560"],["Ghosted","#8a6a55"]];
const counts={}; active.forEach(l=>counts[l.stage]=(counts[l.stage]||0)+1);
const totalActive=active.length||1;
document.getElementById("activeCount").textContent=num(active.length)+" active";
document.getElementById("bar").innerHTML=stages.map(([s,c])=>{const n=counts[s]||0;return n?'<div class="seg" style="width:'+(n/totalActive*100)+'%;background:'+c+'"></div>':"";}).join("")+'<div class="seg" style="flex:1;background:#1a1815"></div>';
document.getElementById("legend").innerHTML=stages.map(([s,c])=>{const n=counts[s]||0;return n?'<span><span class="dot" style="background:'+c+'"></span>'+s+' <b>'+n+'</b></span>':"";}).join("");

// top targets by a simple pull score
function score(l){let s=(+l.closeProb||0)*6;const w={"Quoted":45,"Appointment Set":35,"Contacted":15,"New":8,"Ghosted":18};s+=w[l.stage]||10;if(l.priority==="Critical")s+=40;if(l.priority==="Hot")s+=25;return s;}
const topLeads=active.slice().sort((a,b)=>score(b)-score(a)).slice(0,5);
document.getElementById("targetList").innerHTML=topLeads.map((l,i)=>{
  const name=[l.firstName,l.lastName].filter(Boolean).join(" ")||"(no name)";
  const sub=[l.state,l.stage,l.objection].filter(Boolean).join("  ·  ");
  return '<div class="target"><div class="rank">'+String(i+1).padStart(2,"0")+'</div><div class="who">'+name+'<small>'+sub+'</small></div><div class="prob">'+(l.closeProb||"–")+'<small>/10</small></div></div>';
}).join("");
</script>
</body></html>`;

const dest="/tmp/claude-0/-home-user-now/48819e51-b32f-574b-bf31-202684bdc4cf/scratchpad/The-Bridge.html";
fs.writeFileSync(dest, page);
console.log("built The Bridge:", (fs.statSync(dest).size/1024|0)+"KB");
