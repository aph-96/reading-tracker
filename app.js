
const STORAGE_KEY = "readingTrackerDataV3";
const currentYear = new Date().getFullYear();
let state = loadData();

const $ = (id) => document.getElementById(id);
const clone = (x) => JSON.parse(JSON.stringify(x));

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return normalizeData(JSON.parse(raw));
  }catch(e){ console.warn(e); }
  const seeded = normalizeData(clone(window.INITIAL_READING_DATA));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveData(){
  state.generatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}
function normalizeData(d){
  if(Array.isArray(d)){
    const books=d.map((x,i)=>({
      id:`m_${Date.now()}_${i}`,title:x.title||"Untitled",author:"",
      rating:null,spice:null,category:null,notes:"",
      reads:Array.from({length:Number(x.count)||1},(_,j)=>({year:currentYear,date:null,type:j?"reread":"new",source:"Legacy import",approximate:true}))
    }));
    return {version:3,books,goals:{[currentYear]:40},settings:{defaultGoal:40}};
  }
  d=d||{};
  d.version=3;
  d.books=Array.isArray(d.books)?d.books:[];
  d.goals=d.goals||{};
  d.settings=d.settings||{defaultGoal:40};
  d.settings.defaultGoal=Number(d.settings.defaultGoal)||40;
  if(!d.goals[currentYear]) d.goals[currentYear]=d.settings.defaultGoal;
  d.books.forEach((b,i)=>{
    b.id=b.id||`b_${Date.now()}_${i}`;
    b.title=b.title||"Untitled";
    b.author=b.author||"";
    b.rating=b.rating??null;b.spice=b.spice??null;b.category=b.category??null;b.notes=b.notes||"";
    b.reads=Array.isArray(b.reads)?b.reads:[];
  });
  return d;
}
function uid(){ return "b_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function esc(s=""){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
function bookReads(b){ return b.reads?.length||0; }
function knownYears(b){ return (b.reads||[]).map(r=>r.year).filter(Boolean); }
function latestYear(b){ const ys=knownYears(b); return ys.length?Math.max(...ys):0; }
function verdictLabel(v){ return ({favourite:"💜 Favourite",good:"👍 Good",fine:"😐 Fine",disliked:"👎 Didn't like"})[v]||""; }
function starText(v){ return v ? "★".repeat(v)+"☆".repeat(5-v) : ""; }
function spiceText(v){ return v ? "🌶️".repeat(v) : ""; }
function currentYearReads(){ return state.books.flatMap(b=>(b.reads||[]).filter(r=>Number(r.year)===currentYear).map(r=>({book:b,read:r}))); }
function yearReads(year){ return state.books.flatMap(b=>(b.reads||[]).filter(r=>Number(r.year)===Number(year)).map(r=>({book:b,read:r}))); }
function lifetimeReads(){ return state.books.reduce((n,b)=>n+bookReads(b),0); }
function unknownReads(){ return state.books.reduce((n,b)=>n+(b.reads||[]).filter(r=>!r.year).length,0); }

function bookCard(b){
  const reads=bookReads(b);
  const favourite=b.category==="favourite";
  const rating=b.rating ? `<span class="badge">${starText(b.rating)}</span>` : "";
  const spice=b.spice ? `<span class="badge">${spiceText(b.spice)}</span>` : "";
  const needs=!b.rating && !b.category && !b.spice;
  return `<article class="book-card">
    <div class="book-main">
      <div class="book-title">${favourite?"⭐ ":""}${esc(b.title)}</div>
      ${b.author?`<div class="book-author">${esc(b.author)}</div>`:""}
      <div class="book-meta">
        ${rating}${spice}
        ${b.category?`<span class="badge ${favourite?"fav":""}">${verdictLabel(b.category)}</span>`:""}
        <span class="badge reads">Read ${reads}×</span>
        ${needs?`<span class="badge">+ details</span>`:""}
      </div>
    </div>
    <button class="book-open" data-open-book="${b.id}" aria-label="Open ${esc(b.title)}">›</button>
  </article>`;
}

function renderYear(){
  const reads=currentYearReads();
  const goal=Number(state.goals[currentYear]||state.settings.defaultGoal||40);
  const newCount=reads.filter(x=>x.read.type!=="reread").length;
  const rereads=reads.length-newCount;
  const pct=Math.min(100,goal?Math.round(reads.length/goal*100):0);
  $("yearHero").innerHTML=`<div class="year-hero">
    <div class="year-top"><div><p class="eyebrow">${currentYear} READING</p><div class="year-count">${reads.length} <small>/ ${goal} books</small></div></div><div>${pct}%</div></div>
    <div class="progress"><span style="width:${pct}%"></span></div>
    <div class="stat-line"><span>${newCount} new</span><span>${rereads} rereads</span><span>${state.books.length} unique books in library</span></div>
  </div>`;
  $("yearTitle").textContent=`${currentYear} Books`;
  const sorted=[...reads].sort((a,b)=>(b.read.date||"").localeCompare(a.read.date||"")||a.book.title.localeCompare(b.book.title));
  $("yearBooks").innerHTML=sorted.length?sorted.map(x=>bookCard(x.book)).join(""):`<div class="empty">No books logged for ${currentYear} yet.</div>`;
}

function renderLibrary(){
  const q=$("searchInput")?.value.trim().toLowerCase()||"";
  const filter=$("libraryFilter")?.value||"all";
  const sort=$("librarySort")?.value||"title";
  let books=[...state.books].filter(b=>{
    const text=(b.title+" "+b.author).toLowerCase();
    if(q && !text.includes(q)) return false;
    if(filter==="needs-details" && (b.rating||b.spice||b.category)) return false;
    if(filter==="favourites" && b.category!=="favourite") return false;
    if(filter==="reread" && bookReads(b)<2) return false;
    return true;
  });
  books.sort((a,b)=>{
    if(sort==="rating") return (b.rating||0)-(a.rating||0)||a.title.localeCompare(b.title);
    if(sort==="reads") return bookReads(b)-bookReads(a)||a.title.localeCompare(b.title);
    if(sort==="recent") return latestYear(b)-latestYear(a)||a.title.localeCompare(b.title);
    return a.title.localeCompare(b.title);
  });
  $("libraryStats").textContent=`${books.length} shown · ${state.books.length} unique books · ${lifetimeReads()} lifetime reads`;
  $("libraryBooks").innerHTML=books.length?books.map(bookCard).join(""):`<div class="empty">Nothing matches that filter.</div>`;
}

function renderRereads(){
  const f=$("rereadFilter")?.value||"all";
  let books=[...state.books].filter(b=>{
    if(f==="favourites") return b.category==="favourite";
    if(f==="rated") return Number(b.rating)>=4;
    if(f==="multi") return bookReads(b)>=2;
    return b.category==="favourite" || Number(b.rating)>=4 || bookReads(b)>=2;
  });
  books.sort((a,b)=>{
    const af=a.category==="favourite"?1:0,bf=b.category==="favourite"?1:0;
    return bf-af||(b.rating||0)-(a.rating||0)||bookReads(b)-bookReads(a)||a.title.localeCompare(b.title);
  });
  $("rereadBooks").innerHTML=books.length?books.map(bookCard).join(""):`<div class="empty">As you add ratings and favourites, reread picks will appear here.</div>`;
}

function renderHistory(){
  const years=[...new Set(state.books.flatMap(b=>knownYears(b)))].sort((a,b)=>b-a);
  $("historyYears").innerHTML=years.map(y=>{
    const reads=yearReads(y);
    const goal=state.goals[y];
    const rereads=reads.filter(x=>x.read.type==="reread").length;
    return `<div class="history-card">
      <div class="history-card-top"><div><p class="eyebrow">${y}</p><div class="history-total">${reads.length} books</div></div>${goal?`<span class="badge">Goal ${goal}</span>`:""}</div>
      <div class="stat-line" style="margin-top:10px"><span>${reads.length-rereads} new</span><span>${rereads} rereads</span></div>
    </div>`;
  }).join("")||`<div class="empty">No known historical years yet.</div>`;
}

function renderData(){
  $("dataSummary").innerHTML=`<strong>${state.books.length}</strong> unique books<br>
    <strong>${lifetimeReads()}</strong> lifetime read records<br>
    <strong>${unknownReads()}</strong> historical reads with unknown year<br>
    Data format version ${state.version}`;
}
function renderAll(){ renderYear();renderLibrary();renderRereads();renderHistory();renderData();bindBookOpeners(); }
function bindBookOpeners(){
  document.querySelectorAll("[data-open-book]").forEach(btn=>btn.onclick=()=>openDetails(btn.dataset.openBook));
}

function setView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===name));
  document.querySelectorAll("[data-nav]").forEach(b=>b.classList.toggle("active",b.dataset.nav===name));
  window.scrollTo({top:0,behavior:"smooth"});
}

function setTapRating(container,value){
  container.dataset.value=value??"";
  container.querySelectorAll("button[data-value]").forEach(btn=>btn.classList.toggle("active",Number(btn.dataset.value)<=Number(value||0)));
}

function openBookForm(mode="current",book=null){
  $("bookForm").reset();
  $("bookId").value=book?.id||"";
  $("bookMode").value=mode;
  $("bookDialogTitle").textContent=book?"Edit Book":(mode==="historical"?"Add Historical Book":"Add Book");
  $("bookDialogEyebrow").textContent=book?"EDIT":"BOOK";
  $("bookTitle").value=book?.title||"";
  $("bookAuthor").value=book?.author||"";
  $("bookCategory").value=book?.category||"";
  $("bookNotes").value=book?.notes||"";
  $("bookDate").value=new Date().toISOString().slice(0,10);
  setTapRating($("starRating"),book?.rating);
  setTapRating($("spiceRating"),book?.spice);
  $("currentReadFields").hidden=mode==="historical"||!!book;
  $("historicalReadFields").hidden=mode!=="historical"||!!book;
  $("bookDialog").showModal();
}

function openDetails(id){
  const b=state.books.find(x=>x.id===id);if(!b)return;
  const reads=[...(b.reads||[])].sort((a,b)=>{
    const ay=a.year??9999,by=b.year??9999;
    return ay-by||(a.date||"").localeCompare(b.date||"");
  });
  $("detailsContent").innerHTML=`
    <div class="modal-head">
      <div><p class="eyebrow">BOOK DETAILS</p><div class="details-title">${b.category==="favourite"?"⭐ ":""}${esc(b.title)}</div>${b.author?`<div class="book-author">${esc(b.author)}</div>`:""}</div>
      <button class="icon-btn small" data-close="detailsDialog">×</button>
    </div>
    <div class="details-meta">
      ${b.rating?`<span class="badge">${starText(b.rating)}</span>`:`<span class="badge">Unrated</span>`}
      ${b.spice?`<span class="badge">${spiceText(b.spice)}</span>`:`<span class="badge">Spice not set</span>`}
      ${b.category?`<span class="badge">${verdictLabel(b.category)}</span>`:""}
    </div>
    <div class="details-grid">
      <div class="detail-box"><span>LIFETIME READS</span><strong>${bookReads(b)}</strong></div>
      <div class="detail-box"><span>LATEST KNOWN YEAR</span><strong>${latestYear(b)||"Unknown"}</strong></div>
    </div>
    ${b.notes?`<div class="detail-box"><span>NOTES</span>${esc(b.notes)}</div>`:""}
    <div class="read-history"><h3>Reading history</h3>
      ${reads.length?reads.map((r,i)=>`<div class="read-row"><span>${formatReadWhen(r)}</span><span>${i===0?"First read":"Reread"}</span></div>`).join(""):`<div class="read-row"><span>No read records</span></div>`}
    </div>
    <div class="detail-actions">
      <button class="secondary-btn" id="editDetailsBtn">Edit details</button>
      <button class="primary-btn" id="markRereadBtn">Mark reread</button>
      <button class="danger-btn" id="deleteBookBtn">Delete book</button>
    </div>`;
  $("detailsDialog").showModal();
  $("detailsContent").querySelector("[data-close]").onclick=()=>$("detailsDialog").close();
  $("editDetailsBtn").onclick=()=>{$("detailsDialog").close();openBookForm("edit",b);};
  $("markRereadBtn").onclick=()=>{
    $("detailsDialog").close();$("rereadBookId").value=b.id;$("rereadBookTitle").textContent=b.title;
    $("rereadDate").value=new Date().toISOString().slice(0,10);$("rereadDialog").showModal();
  };
  $("deleteBookBtn").onclick=()=>{
    if(confirm(`Delete "${b.title}" and all of its read history?`)){
      state.books=state.books.filter(x=>x.id!==b.id);$("detailsDialog").close();saveData();toast("Book deleted");
    }
  };
}
function formatReadWhen(r){
  if(r.date){
    if(/^\d{4}-\d{2}-\d{2}$/.test(r.date)){
      const d=new Date(r.date+"T12:00:00");
      return d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
    }
    if(/^\d{4}-\d{2}$/.test(r.date)){
      const [y,m]=r.date.split("-");
      return new Date(Number(y),Number(m)-1,1).toLocaleDateString(undefined,{year:"numeric",month:"long"});
    }
  }
  if(r.year) return String(r.year);
  return "Historical · year unknown";
}

function findExistingByTitle(title){
  const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,"");
  return state.books.find(b=>norm(b.title)===norm(title));
}

$("bookForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("bookId").value;
  const mode=$("bookMode").value;
  const title=$("bookTitle").value.trim();
  if(!title)return;
  let b=id?state.books.find(x=>x.id===id):findExistingByTitle(title);
  const editing=!!id;
  if(!b){
    b={id:uid(),title,author:"",rating:null,spice:null,category:null,notes:"",reads:[],createdAt:new Date().toISOString()};
    state.books.push(b);
  }
  b.title=title;b.author=$("bookAuthor").value.trim();b.category=$("bookCategory").value||null;b.notes=$("bookNotes").value.trim();
  b.rating=$("starRating").dataset.value?Number($("starRating").dataset.value):null;
  b.spice=$("spiceRating").dataset.value?Number($("spiceRating").dataset.value):null;

  if(!editing){
    if(mode==="current"){
      const date=$("bookDate").value||null;
      const year=date?Number(date.slice(0,4)):currentYear;
      b.reads.push({year,date,type:b.reads.length?"reread":"new",source:"App"});
    }else{
      const year=$("historicalYear").value?Number($("historicalYear").value):null;
      const month=$("historicalMonth").value;
      const date=year&&month?`${year}-${month}`:null;
      b.reads.push({year,date,type:b.reads.length?"reread":"new",source:"Historical manual entry",approximate:true});
    }
  }
  $("bookDialog").close();saveData();toast(editing?"Details updated":"Book added");
});

$("rereadForm").addEventListener("submit",e=>{
  e.preventDefault();
  const b=state.books.find(x=>x.id===$("rereadBookId").value);if(!b)return;
  const date=$("rereadDate").value||null;
  b.reads.push({year:date?Number(date.slice(0,4)):currentYear,date,type:"reread",source:"App"});
  $("rereadDialog").close();saveData();toast("Reread added");
});

document.querySelectorAll(".tap-rating button[data-value]").forEach(btn=>{
  btn.addEventListener("click",()=>setTapRating(btn.closest(".tap-rating"),Number(btn.dataset.value)));
});
document.querySelectorAll("[data-clear]").forEach(btn=>btn.addEventListener("click",()=>setTapRating(btn.closest(".tap-rating"),null)));
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>$(btn.dataset.close).close()));

document.querySelectorAll("[data-nav]").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.nav)));
$("quickAddBtn").onclick=()=>openBookForm("current");
$("addBookBtn").onclick=()=>openBookForm("current");
$("addHistoricalBtn").onclick=()=>openBookForm("historical");
$("searchInput").addEventListener("input",renderLibrary);
$("libraryFilter").addEventListener("change",renderLibrary);
$("librarySort").addEventListener("change",renderLibrary);
$("rereadFilter").addEventListener("change",renderRereads);

$("editGoalBtn").onclick=()=>{
  const old=state.goals[currentYear]||state.settings.defaultGoal||40;
  const val=prompt(`Reading goal for ${currentYear}:`,old);
  if(val===null)return;
  const n=Number(val);
  if(!Number.isFinite(n)||n<1)return alert("Please enter a valid goal.");
  state.goals[currentYear]=Math.round(n);saveData();
};

$("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download=`reading-tracker-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();URL.revokeObjectURL(a.href);toast("Backup exported");
};

$("importInput").addEventListener("change",async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    const imported=normalizeData(JSON.parse(await file.text()));
    if(!confirm(`Import ${imported.books.length} books and replace the current app data?`))return;
    state=imported;saveData();toast("Backup imported");
  }catch(err){alert("That file could not be imported.");}
  e.target.value="";
});

$("resetBtn").onclick=()=>{
  if(!confirm("Reset the app to the bundled data? Any changes since installing will be lost unless exported first."))return;
  state=normalizeData(clone(window.INITIAL_READING_DATA));saveData();toast("Bundled data restored");
};

function toast(msg){
  const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}
if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(console.warn);
renderAll();
