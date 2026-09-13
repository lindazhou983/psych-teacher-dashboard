const cfg=window.DASHBOARD_CONFIG||{};
const safeSeed={
  classes:[
    ['4.1','四年级','独一无二的我','本课尚未开始','完整进行《独一无二的我》'],
    ['4.2','四年级','独一无二的我','主体活动已完成，差心灵手册','补做心灵手册'],
    ['4.3','四年级','独一无二的我','本课尚未开始','完整进行《独一无二的我》'],
    ['4.4','四年级','独一无二的我','差小组分享拼图 + 心灵手册','先完成小组分享拼图，再完成心灵手册'],
    ['4.5','四年级','独一无二的我','主体活动已完成，差心灵手册','补做心灵手册'],
    ['4.6','四年级','独一无二的我','差个人拼图 + 心灵手册','先完成个人拼图，再完成心灵手册'],
    ['5.1','五年级','向心号列车出发！','全部完成','进入下一课“三真一假”'],
    ['5.2','五年级','向心号列车出发！','差个人自画像 + 心灵手册','补个人自画像与心灵手册'],
    ['5.3','五年级','向心号列车出发！','差心灵手册','补做心灵手册'],
    ['5.4','五年级','向心号列车出发！','待确认','确认实际完成情况'],
    ['5.5','五年级','向心号列车出发！','差心灵手册','补做心灵手册']
  ],
  courses:[
    ['四、五年级','第1课','HELLO!心理课','已完成','11个班均已完成'],
    ['四年级','第2课','独一无二的我','授课中','四年级当前课程'],
    ['五年级','第2课','向心号列车出发！','授课中','五年级当前课程'],
    ['五年级','后续第1周','三真一假','已备待上','下一课'],
    ['五年级','后续第2周','我喜欢我自己：你远比自己想象的更优秀','已备待上','计划后一周'],
    ['五年级','后续第3周','秋天，不必急着丰收','已备待上','计划第三周'],
    ['四年级','后续第3周','闪闪发光的我','已备待上','计划第三周']
  ],weekly:[],meetings:[],appointments:[],cases:[]
};
let data=safeSeed;
const $=id=>document.getElementById(id);
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function badge(s=''){let c=/完成/.test(s)?'good':/待确认|未/.test(s)?'bad':'warn';return `<span class="badge ${c}">${esc(s)}</span>`}
function table(headers,rows){return `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.join(''):`<tr><td colspan="${headers.length}" class="muted">暂无记录</td></tr>`}</tbody></table>`}
function render(){
  const classes=(data.classes||[]).map(x=>Array.isArray(x)?{name:x[0],grade:x[1],topic:x[2],progress:x[3],next:x[4]}:x);
  const courses=(data.courses||[]).map(x=>Array.isArray(x)?{grade:x[0],week:x[1],title:x[2],status:x[3],plan:x[4]}:x);
  const pending=classes.filter(c=>!/全部完成|已完成/.test(c.progress||'')).length;
  $('metrics').innerHTML=[['班级进度','11'],['当前需跟进',pending],['已备课程',courses.length],['本周待办',(data.weekly||[]).filter(x=>x.status!=='已完成').length]].map(([l,n])=>`<div class="metric"><div class="label">${l}</div><div class="num">${n}</div></div>`).join('');
  const rows=classes.map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(c.topic||c.currentTopic||'—')}</td><td>${esc(c.progress||'—')}</td><td>${esc(c.next||'—')}</td><td>${esc(c.headTeacher||'—')}</td><td>${esc(c.psychRep||'—')}</td></tr>`);
  $('homeProgress').innerHTML=table(['班级','当前课题','实际进度','下一步','班主任','心理委员'],rows);
  $('grade4').innerHTML=table(['班级','当前课题','实际进度','下一步','班主任','心理委员','重点关注'],classes.filter(c=>String(c.name).startsWith('4.')).map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(c.topic||c.currentTopic||'—')}</td><td>${esc(c.progress||'—')}</td><td>${esc(c.next||'—')}</td><td>${esc(c.headTeacher||'—')}</td><td>${esc(c.psychRep||'—')}</td><td>${esc(c.watchStudents||'—')}</td></tr>`));
  $('grade5').innerHTML=table(['班级','当前课题','实际进度','下一步','班主任','心理委员','重点关注'],classes.filter(c=>String(c.name).startsWith('5.')).map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(c.topic||c.currentTopic||'—')}</td><td>${esc(c.progress||'—')}</td><td>${esc(c.next||'—')}</td><td>${esc(c.headTeacher||'—')}</td><td>${esc(c.psychRep||'—')}</td><td>${esc(c.watchStudents||'—')}</td></tr>`));
  $('courseCards').innerHTML=courses.map(c=>`<article class="card"><h3>${esc(c.title)}</h3><div class="meta">${esc(c.grade)} · ${esc(c.week)}</div>${badge(c.status)}<p>${esc(c.plan||'')}</p></article>`).join('');
  const wk=data.weekly||[];$('homeWeekly').innerHTML=table(['事项','类别','截止','状态'],wk.slice(0,8).map(x=>`<tr><td>${esc(x.title||x[0])}</td><td>${esc(x.type||x[1]||'—')}</td><td>${esc(x.due||x[2]||'—')}</td><td>${badge(x.status||x[3]||'未开始')}</td></tr>`));$('weeklyTable').innerHTML=$('homeWeekly').innerHTML;
  const mt=data.meetings||[];$('meetingTable').innerHTML=table(['日期','类型','主题','待跟进'],mt.map(x=>`<tr><td>${esc(x.date||'—')}</td><td>${esc(x.type||'—')}</td><td>${esc(x.title||'—')}</td><td>${esc(x.follow||'—')}</td></tr>`));
  const ap=data.appointments||[];$('appointmentTable').innerHTML=table(['日期','时间','学生代号','班级','状态'],ap.map(x=>`<tr><td>${esc(x.date||'—')}</td><td>${esc(x.time||'—')}</td><td>${esc(x.student||x.code||'—')}</td><td>${esc(x.cls||'—')}</td><td>${badge(x.status||'—')}</td></tr>`));
  const cs=data.cases||[];$('caseCards').innerHTML=cs.length?cs.map(x=>`<article class="card"><h3>${esc(x.code||'未命名个案')}</h3><div class="meta">${esc(x.cls||'')} · ${esc(x.status||'')}</div>${x.url?`<a class="button" href="${esc(x.url)}" target="_blank">打开记录</a>`:''}</article>`).join(''):'<div class="muted">暂无个案索引</div>';
}
async function loadCloud(){
  if(!cfg.apiUrl){$('syncStatus').textContent='尚未连接 Google 数据接口';render();return;}
  try{let r=await fetch(cfg.apiUrl,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);let j=await r.json();data=j;$('syncStatus').textContent='已同步 Google 数据';$('setup').style.display='none';render()}catch(e){$('syncStatus').textContent='云端同步失败，显示安全预览';render()}
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.page).classList.add('active')});
loadCloud();
