const KEY = "studysphere_tasks_v1";
let tasks = readTasks();
let filter = "all";
const $ = id => document.getElementById(id);
function readTasks(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(tasks))}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const visible=tasks.filter(t=>filter==="all"||(filter==="active"&&!t.done)||(filter==="completed"&&t.done));
 $("taskList").innerHTML=visible.map(t=>`<article class="task ${t.done?"done":""}"><input class="check" type="checkbox" data-toggle="${t.id}" aria-label="Toggle task" ${t.done?"checked":""}><div class="task-main"><div class="task-title">${safe(t.title)}</div><div class="meta"><span class="pill">${safe(t.subject)}</span><span class="duration">◷ ${Number(t.duration)} min</span></div></div><button class="delete" type="button" data-delete="${t.id}" aria-label="Delete task">×</button></article>`).join("");
 $("emptyState").classList.toggle("hidden",visible.length>0);
 if(!visible.length){const msgs=filter==="completed"?["No completed tasks yet","Finish a task and it will show here."]:filter==="active"?["All caught up!","You have no pending tasks in this view."]:["Your study plan starts here","Add your first task above and build a productive day."];$("emptyState").querySelector("h3").textContent=msgs[0];$("emptyState").querySelector("p").textContent=msgs[1]}
 const total=tasks.length,done=tasks.filter(t=>t.done).length,minutes=tasks.reduce((s,t)=>s+Number(t.duration||0),0),pct=total?Math.round(done/total*100):0;
 $("totalTasks").textContent=total;$("completedTasks").textContent=done;$("focusHours").textContent=(minutes/60).toFixed(minutes%60===0?0:1);$("progressPercent").textContent=pct;$("progressBar").style.width=pct+"%";$("ringPercent").textContent=pct+"%";$("progressRing").style.background=`conic-gradient(var(--purple) ${pct*3.6}deg,#f0eef9 0deg)`;$("taskCountLabel").textContent=`${tasks.filter(t=>!t.done).length} task${tasks.filter(t=>!t.done).length===1?"":"s"} left to focus on`;$("progressMessage").textContent=!total?"Add a task to get started. You've got this!":pct===100?"Amazing work! You've completed every planned task.":`${done} of ${total} tasks completed. Keep your momentum going!`;
 const counts={};tasks.forEach(t=>{counts[t.subject]??={total:0,done:0};counts[t.subject].total++;if(t.done)counts[t.subject].done++});
 const colors=["#7866e9","#43b989","#f0ad52","#4d9ce8","#e982a3"];
 $("subjectList").innerHTML=Object.entries(counts).map(([name,v],i)=>`<div class="subject-row"><span class="subject-name">${safe(name)}</span><span class="subject-count">${v.done}/${v.total} done</span><div class="subject-track"><span style="width:${Math.round(v.done/v.total*100)}%;--subject-color:${colors[i%colors.length]}"></span></div></div>`).join("")||'<p class="muted small">Add tasks to see your subjects here.</p>';
}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const title=$("taskInput").value.trim();if(!title)return;tasks.unshift({id:Date.now().toString()+Math.random().toString(16).slice(2),title,subject:$("subjectInput").value,duration:Number($("durationInput").value),done:false});save();$("taskForm").reset();$("durationInput").value="30";filter="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("selected",b.dataset.filter==="all"));$("taskInput").focus();render()});
$("taskList").addEventListener("change",e=>{const id=e.target.dataset.toggle;if(!id)return;const task=tasks.find(t=>t.id===id);if(task){task.done=e.target.checked;save();render()}});
$("taskList").addEventListener("click",e=>{const id=e.target.dataset.delete;if(!id)return;tasks=tasks.filter(t=>t.id!==id);save();render()});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("selected",x===b));render()}));
$("clearCompleted").addEventListener("click",()=>{tasks=tasks.filter(t=>!t.done);save();render()});
const now=new Date();$("currentDate").textContent=now.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});$("todayLabel").textContent=now.toLocaleDateString(undefined,{month:"long",year:"numeric"}).toUpperCase()+" • YOUR STUDY SPACE";render();
