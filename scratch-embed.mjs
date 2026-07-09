// Build a standalone Command Center with the real 857-lead book pre-loaded.
// Injects a bootstrap that seeds localStorage before the app script runs, so
// the app opens straight into the real book. OUTPUT CONTAINS PII — scratchpad
// only, never committed or published.
import fs from "fs";

const base = fs.readFileSync("/home/user/now/sales-command-center/index.html", "utf8");
const book = JSON.parse(fs.readFileSync("/home/user/now/sales-command-center/Michael-Ringy-book.json", "utf8")).leads;
const DATA = JSON.stringify(book).replace(/</g, "\\u003c");

const bootstrap = `<script>
/* Pre-load the real book before the app boots. Runs once; your edits persist. */
try{
  if(!localStorage.getItem("scc_seeded_v1")){
    localStorage.setItem("scc_leads_v1", JSON.stringify(${DATA}));
    localStorage.setItem("scc_seeded_v1","1");
  }
}catch(e){}
</script>
`;

// Insert the bootstrap immediately after <body> so it executes before the app.
const out = base.replace("<body>", "<body>\n" + bootstrap);
const dest = "/tmp/claude-0/-home-user-now/48819e51-b32f-574b-bf31-202684bdc4cf/scratchpad/My-Command-Center-857-leads.html";
fs.writeFileSync(dest, out);
console.log("built Command Center:", (fs.statSync(dest).size / 1024 | 0) + "KB with " + book.length + " leads");
