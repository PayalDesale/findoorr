import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .an-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .an-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .an-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .an-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .an-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; flex: 1; }
  .an-export-btn {
    padding: 6px 16px; background: #3d2c1e; border: none; border-radius: 10px;
    color: #f5efe0; font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700;
    cursor: pointer; box-shadow: 2px 2px 0px #c0570e; transition: all 0.15s;
  }
  .an-export-btn:hover { transform: translateY(-1px); box-shadow: 3px 3px 0px #c0570e; }

  .an-content { max-width: 960px; margin: 0 auto; padding: 20px; }

  /* PERIOD TABS */
  .an-period-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .an-period-tab {
    padding: 8px 18px; border: 2px solid #c9b99a; border-radius: 20px;
    background: #f5efe0; cursor: pointer; font-size: 13px; font-weight: 600;
    color: #5c4033; transition: all 0.15s; box-shadow: 2px 2px 0px #c9b99a;
  }
  .an-period-tab.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }

  /* STATS ROW */
  .an-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
  .an-stat {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 16px 12px; box-shadow: 3px 3px 0px #c9b99a; position: relative; overflow: hidden;
  }
  .an-stat-bg { position: absolute; right: -10px; bottom: -10px; font-size: 52px; opacity: 0.08; }
  .an-stat-label { font-size: 11px; color: #9c8060; font-weight: 600; margin-bottom: 4px; }
  .an-stat-num { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; color: #3d2c1e; line-height: 1; }
  .an-stat-change { font-size: 11px; font-weight: 700; margin-top: 4px; }
  .an-stat-change.up { color: #388e3c; }
  .an-stat-change.down { color: #c62828; }

  /* CARD */
  .an-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 18px;
    padding: 20px; box-shadow: 4px 4px 0px #c9b99a; margin-bottom: 18px;
  }
  .an-card-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700;
    color: #5c4033; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;
  }
  .an-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }

  /* BAR CHART */
  .an-bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 140px; padding: 0 4px; }
  .an-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .an-bar-wrap { width: 100%; display: flex; align-items: flex-end; height: 110px; }
  .an-bar {
    width: 100%; border-radius: 6px 6px 0 0; transition: height 0.6s ease;
    cursor: pointer; position: relative;
  }
  .an-bar:hover { filter: brightness(1.1); }
  .an-bar-val { font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700; color: #3d2c1e; }
  .an-bar-label { font-size: 10px; color: #9c8060; font-weight: 600; text-align: center; }

  /* LINE CHART (SVG) */
  .an-line-chart { width: 100%; overflow: hidden; border-radius: 10px; }

  /* DONUT */
  .an-donut-wrap { display: flex; align-items: center; gap: 20px; }
  .an-donut-legend { display: flex; flex-direction: column; gap: 8px; }
  .an-donut-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #5c4033; }
  .an-donut-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
  .an-donut-val { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #3d2c1e; margin-left: auto; }

  /* HEATMAP */
  .an-heat-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 5px; }
  .an-heat-label { font-family: 'Caveat', cursive; font-size: 12px; color: #9c8060; text-align: center; margin-bottom: 4px; }
  .an-heat-cell {
    aspect-ratio: 1; border-radius: 6px; cursor: pointer;
    transition: transform 0.15s; border: 1.5px solid transparent;
  }
  .an-heat-cell:hover { transform: scale(1.2); z-index: 2; position: relative; }

  /* TOP STUDENTS */
  .an-student-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 8px;
    border-bottom: 1.5px dashed #e0d0b8; border-radius: 8px; transition: background 0.15s;
  }
  .an-student-row:last-child { border-bottom: none; }
  .an-student-row:hover { background: #faf3e0; }
  .an-student-rank { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #c9b99a; width: 28px; flex-shrink: 0; }
  .an-student-rank.gold { color: #f5a623; }
  .an-student-rank.silver { color: #9c8060; }
  .an-student-rank.bronze { color: #c0570e; }
  .an-student-av { width: 38px; height: 38px; border-radius: 10px; background: #3d2c1e; border: 2px solid #c9b99a; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .an-student-name { font-size: 13px; font-weight: 600; color: #3d2c1e; }
  .an-student-meta { font-size: 11px; color: #9c8060; margin-top: 1px; }
  .an-student-score { font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700; color: #c0570e; margin-left: auto; flex-shrink: 0; }

  /* MEETING STATS */
  .an-meeting-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .an-meeting-label { font-size: 13px; color: #5c4033; font-weight: 600; width: 120px; flex-shrink: 0; }
  .an-meeting-bar-wrap { flex: 1; background: #f0e8d8; border-radius: 20px; height: 12px; overflow: hidden; }
  .an-meeting-bar { height: 100%; border-radius: 20px; transition: width 0.6s ease; }
  .an-meeting-val { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #3d2c1e; width: 36px; text-align: right; flex-shrink: 0; }

  /* INSIGHT CARDS */
  .an-insight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .an-insight {
    background: #f5efe0; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 14px; display: flex; align-items: flex-start; gap: 10px;
  }
  .an-insight-icon { font-size: 28px; flex-shrink: 0; }
  .an-insight-title { font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700; color: #3d2c1e; margin-bottom: 3px; }
  .an-insight-text { font-size: 11px; color: #9c8060; line-height: 1.5; }

  /* BOTTOM NAV */
  .an-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .an-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; }
  .an-nav-item-icon { font-size: 20px; }
  .an-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .an-nav-item.active .an-nav-item-label { color: #c0570e; }

  @media (max-width: 640px) {
    .an-stats { grid-template-columns: repeat(2,1fr); }
    .an-two-col { grid-template-columns: 1fr; }
    .an-insight-grid { grid-template-columns: 1fr; }
  }
`;

const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const meetingsPerDay = [4, 7, 5, 9, 6, 2, 1];
const attendanceWeek = [88, 92, 79, 95, 85, 70, 60];

const heatColors = (val) => {
  if (val === 0) return { bg: '#f0e8d8', border: '#e0d0b8' };
  if (val < 3) return { bg: '#fef9c3', border: '#fde047' };
  if (val < 6) return { bg: '#fed7aa', border: '#fb923c' };
  return { bg: '#fca5a5', border: '#ef4444' };
};

const heatVals = [
  0,2,5,3,7,0,0,
  1,4,6,8,5,0,0,
  3,2,4,6,9,0,0,
  2,5,7,4,3,0,0,
];

const topStudents = [
  { emoji: '🧑‍💻', name: 'Tejas Nair', meta: '12 meetings · 96% attendance', score: 98 },
  { emoji: '👩‍🎓', name: 'Karunya B.', meta: '10 meetings · 92% attendance', score: 94 },
  { emoji: '🧑‍🔬', name: 'Aditya Rao', meta: '9 meetings · 95% attendance', score: 91 },
  { emoji: '👩‍💻', name: 'Sneha Joshi', meta: '8 meetings · 88% attendance', score: 87 },
  { emoji: '👨‍🎓', name: 'Rohan Desai', meta: '7 meetings · 74% attendance', score: 72 },
];

const meetingTypes = [
  { label: 'Assignment Help', val: 38, color: '#c0570e' },
  { label: 'Project Guidance', val: 27, color: '#388e3c' },
  { label: 'Exam Doubts', val: 20, color: '#1565c0' },
  { label: 'Career Advice', val: 15, color: '#7b1fa2' },
];

const insights = [
  { icon: '🔥', title: 'Peak Hours', text: 'Tuesdays 10–11 AM are your busiest slot — 9 avg meetings per week' },
  { icon: '📈', title: 'Attendance Up', text: 'Your class attendance improved by 8% compared to last month' },
  { icon: '⭐', title: 'Top Rated', text: 'Students rated you 4.8/5 — highest in the CS department this semester' },
  { icon: '⚠️', title: 'Low Slot', text: 'Saturday office hours have only 12% utilisation — consider rescheduling' },
];

// Simple SVG line chart
function LineChart({ data, labels, color }) {
  const w = 400, h = 100, pad = 10;
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - v / max) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${pts[pts.length-1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={color} stroke="#fffdf5" strokeWidth="2" />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={pts[i][0]} y={h - 1} textAnchor="middle" fontSize="8" fill="#9c8060" fontFamily="DM Sans">{l}</text>
      ))}
    </svg>
  );
}

// Simple donut
function Donut({ segments }) {
  const r = 54, cx = 64, cy = 64, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, x) => s + x.val, 0);
  return (
    <svg viewBox="0 0 128 128" style={{width:130,height:130,flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0e8d8" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.val / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{transform:'rotate(-90deg)',transformOrigin:'center'}}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontFamily="Caveat" fontWeight="700" fill="#3d2c1e">{total}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize="8" fontFamily="DM Sans" fill="#9c8060">meetings</text>
    </svg>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week');

  const periods = ['week', 'month', 'semester'];

  return (
    <>
      <style>{styles}</style>
      <div className="an-page">

        {/* Nav */}
        <div className="an-nav">
          <div className="an-back" onClick={() => navigate('/professor/dashboard')}>←</div>
          <span className="an-nav-title">📊 analytics</span>
          <button className="an-export-btn">⬇ export PDF</button>
        </div>

        <div className="an-content">

          {/* Period Tabs */}
          <div className="an-period-tabs">
            {periods.map(p => (
              <div key={p} className={`an-period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Semester'}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="an-stats">
            {[
              { label: 'Total Meetings', num: '47', change: '+12%', dir: 'up', icon: '📅' },
              { label: 'Avg Attendance', num: '84%', change: '+8%', dir: 'up', icon: '✅' },
              { label: 'Acceptance Rate', num: '91%', change: '-3%', dir: 'down', icon: '🤝' },
              { label: 'Student Rating', num: '4.8', change: '+0.2', dir: 'up', icon: '⭐' },
            ].map(s => (
              <div className="an-stat" key={s.label}>
                <div className="an-stat-bg">{s.icon}</div>
                <div className="an-stat-label">{s.label}</div>
                <div className="an-stat-num">{s.num}</div>
                <div className={`an-stat-change ${s.dir}`}>{s.dir === 'up' ? '▲' : '▼'} {s.change} vs last {period}</div>
              </div>
            ))}
          </div>

          {/* Meetings per Day Bar Chart */}
          <div className="an-card">
            <div className="an-card-title">📅 meetings per day</div>
            <div className="an-bar-chart">
              {weekDays.map((d, i) => (
                <div className="an-bar-col" key={d}>
                  <div className="an-bar-val">{meetingsPerDay[i]}</div>
                  <div className="an-bar-wrap">
                    <div className="an-bar" style={{
                      height: `${(meetingsPerDay[i] / Math.max(...meetingsPerDay)) * 100}%`,
                      background: meetingsPerDay[i] === Math.max(...meetingsPerDay)
                        ? 'linear-gradient(180deg,#c0570e,#e8885a)'
                        : 'linear-gradient(180deg,#3d2c1e,#7c5c44)',
                    }} />
                  </div>
                  <div className="an-bar-label">{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Trend + Meeting Types */}
          <div className="an-two-col">

            <div className="an-card">
              <div className="an-card-title">📈 attendance trend</div>
              <LineChart data={attendanceWeek} labels={weekDays} color="#c0570e" />
              <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                <span style={{fontSize:11,color:'#9c8060'}}>Mon</span>
                <span style={{fontSize:11,color:'#9c8060'}}>Sun</span>
              </div>
            </div>

            <div className="an-card">
              <div className="an-card-title">🥧 meeting types</div>
              <div className="an-donut-wrap">
                <Donut segments={meetingTypes} />
                <div className="an-donut-legend">
                  {meetingTypes.map(m => (
                    <div className="an-donut-item" key={m.label}>
                      <div className="an-donut-dot" style={{background:m.color}} />
                      <span>{m.label}</span>
                      <span className="an-donut-val">{m.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Office Hours Heatmap */}
          <div className="an-card">
            <div className="an-card-title">
              🔥 office hours heatmap
              <span style={{fontSize:12,fontFamily:'DM Sans',fontWeight:400,color:'#9c8060'}}>darker = more meetings</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:6}}>
              {weekDays.map(d => <div key={d} className="an-heat-label">{d}</div>)}
            </div>
            <div className="an-heat-grid">
              {heatVals.map((v, i) => {
                const { bg, border } = heatColors(v);
                return (
                  <div key={i} className="an-heat-cell" style={{background:bg,borderColor:border}} title={`${v} meetings`} />
                );
              })}
            </div>
            <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap',alignItems:'center'}}>
              <span style={{fontSize:11,color:'#9c8060',fontWeight:600}}>intensity →</span>
              {[0,2,5,7].map((v,i) => {
                const {bg,border} = heatColors(v);
                return <div key={i} style={{width:16,height:16,borderRadius:4,background:bg,border:`1.5px solid ${border}`}} />;
              })}
            </div>
          </div>

          {/* Meeting Request Breakdown */}
          <div className="an-card">
            <div className="an-card-title">📨 meeting request breakdown</div>
            {[
              { label: 'Accepted', val: 91, color: '#4caf50' },
              { label: 'Rescheduled', val: 6, color: '#ff9800' },
              { label: 'Rejected', val: 3, color: '#f44336' },
            ].map(m => (
              <div className="an-meeting-row" key={m.label}>
                <div className="an-meeting-label">{m.label}</div>
                <div className="an-meeting-bar-wrap">
                  <div className="an-meeting-bar" style={{width:`${m.val}%`,background:m.color}} />
                </div>
                <div className="an-meeting-val">{m.val}%</div>
              </div>
            ))}
          </div>

          {/* Top Engaged Students */}
          <div className="an-card">
            <div className="an-card-title">🏆 top engaged students</div>
            {topStudents.map((s, i) => (
              <div className="an-student-row" key={s.name}>
                <div className={`an-student-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}`}>#{i+1}</div>
                <div className="an-student-av">{s.emoji}</div>
                <div style={{flex:1}}>
                  <div className="an-student-name">{s.name}</div>
                  <div className="an-student-meta">{s.meta}</div>
                </div>
                <div className="an-student-score">{s.score}</div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="an-card">
            <div className="an-card-title">🤖 AI insights</div>
            <div className="an-insight-grid">
              {insights.map(ins => (
                <div className="an-insight" key={ins.title}>
                  <div className="an-insight-icon">{ins.icon}</div>
                  <div>
                    <div className="an-insight-title">{ins.title}</div>
                    <div className="an-insight-text">{ins.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="an-bottom-nav">
          {[
            { id:'dash', icon:'🏠', label:'dashboard', path:'/professor/dashboard' },
            { id:'avail', icon:'📅', label:'availability', path:'/professor/availability' },
            { id:'requests', icon:'📨', label:'requests', path:'/professor/requests' },
            { id:'attend', icon:'👥', label:'attendance', path:'/professor/attendance' },
            { id:'analytics', icon:'📊', label:'analytics', path:'/professor/analytics', active:true },
          ].map(n => (
            <div key={n.id} className={`an-nav-item ${n.active?'active':''}`} onClick={() => navigate(n.path)}>
              <span className="an-nav-item-icon">{n.icon}</span>
              <span className="an-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
