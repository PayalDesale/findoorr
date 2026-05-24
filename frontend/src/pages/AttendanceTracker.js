import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .at-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .at-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .at-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .at-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .at-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; flex: 1; }
  .at-ai-badge {
    display: flex; align-items: center; gap: 6px; background: #e8f5e9;
    border: 1.5px solid #a5d6a7; border-radius: 20px; padding: 4px 12px;
    font-size: 12px; font-weight: 700; color: #388e3c;
  }
  .at-ai-dot { width: 7px; height: 7px; border-radius: 50%; background: #4caf50; animation: at-pulse 1.5s infinite; }
  @keyframes at-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .at-content { max-width: 900px; margin: 0 auto; padding: 20px; }

  /* STATS */
  .at-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
  .at-stat {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 14px 12px; box-shadow: 3px 3px 0px #c9b99a; text-align: center;
  }
  .at-stat-icon { font-size: 22px; margin-bottom: 4px; }
  .at-stat-num { font-family: 'Caveat', cursive; font-size: 26px; font-weight: 700; color: #c0570e; line-height: 1; }
  .at-stat-label { font-size: 10px; color: #9c8060; font-weight: 600; margin-top: 2px; }

  /* CARD */
  .at-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 18px;
    padding: 20px; box-shadow: 4px 4px 0px #c9b99a; margin-bottom: 18px;
  }
  .at-section-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700;
    color: #5c4033; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;
  }

  /* CLASS TABS */
  .at-class-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 18px; }
  .at-class-tab {
    flex-shrink: 0; padding: 8px 16px; border: 2px solid #c9b99a; border-radius: 20px;
    background: #f5efe0; cursor: pointer; font-size: 13px; font-weight: 600;
    color: #5c4033; transition: all 0.15s; white-space: nowrap;
  }
  .at-class-tab.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }

  /* FACE SCAN SECTION */
  .at-scan-box {
    border: 2.5px dashed #c9b99a; border-radius: 18px; padding: 28px 20px;
    text-align: center; margin-bottom: 18px; background: #faf6ee;
    position: relative; overflow: hidden;
  }
  .at-scan-box.scanning { border-color: #4caf50; background: #f0fff4; }
  .at-scan-box.done { border-color: #c0570e; background: #fff8f0; }

  .at-scan-frame {
    width: 140px; height: 140px; border-radius: 16px; margin: 0 auto 16px;
    position: relative; display: flex; align-items: center; justify-content: center;
    background: #f0e8d8; border: 2px solid #c9b99a; overflow: hidden;
  }
  .at-scan-frame.scanning { border-color: #4caf50; background: #e8f5e9; }
  .at-scan-frame.done { border-color: #c0570e; }

  .at-scan-emoji { font-size: 64px; }

  .at-scan-line {
    position: absolute; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #4caf50, transparent);
    animation: at-scan 1.8s ease-in-out infinite;
  }
  @keyframes at-scan {
    0% { top: 0; opacity: 1; }
    50% { top: calc(100% - 3px); opacity: 1; }
    100% { top: 0; opacity: 0; }
  }

  .at-scan-corners::before, .at-scan-corners::after {
    content: ''; position: absolute; width: 20px; height: 20px;
    border-color: #4caf50; border-style: solid;
  }
  .at-scan-corners::before { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
  .at-scan-corners::after { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }

  .at-scan-title { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: #3d2c1e; margin-bottom: 6px; }
  .at-scan-sub { font-size: 13px; color: #9c8060; margin-bottom: 18px; }

  .at-scan-btn {
    padding: 12px 32px; background: #3d2c1e; border: none; border-radius: 12px;
    color: #f5efe0; font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700;
    cursor: pointer; box-shadow: 3px 3px 0px #c0570e; transition: all 0.2s;
  }
  .at-scan-btn:hover { transform: translateY(-2px); box-shadow: 5px 5px 0px #c0570e; }
  .at-scan-btn.scanning { background: #388e3c; box-shadow: 3px 3px 0px #1b5e20; cursor: wait; }

  /* GEOFENCE STATUS */
  .at-geo-row {
    display: flex; align-items: center; justify-content: space-between;
    background: #f5efe0; border: 1.5px solid #c9b99a; border-radius: 12px;
    padding: 12px 16px; margin-bottom: 10px;
  }
  .at-geo-left { display: flex; align-items: center; gap: 10px; }
  .at-geo-icon { font-size: 24px; }
  .at-geo-name { font-size: 13px; font-weight: 600; color: #3d2c1e; }
  .at-geo-sub { font-size: 11px; color: #9c8060; margin-top: 1px; }
  .at-geo-badge {
    font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px;
    flex-shrink: 0;
  }
  .at-geo-badge.inside { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .at-geo-badge.outside { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }

  /* STUDENT LIST */
  .at-student-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 8px;
    border-bottom: 1.5px dashed #e0d0b8; transition: background 0.15s; border-radius: 8px;
  }
  .at-student-row:last-child { border-bottom: none; }
  .at-student-row:hover { background: #faf3e0; }
  .at-student-av {
    width: 40px; height: 40px; border-radius: 12px; background: #3d2c1e;
    border: 2px solid #c9b99a; display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .at-student-name { font-size: 13px; font-weight: 600; color: #3d2c1e; }
  .at-student-id { font-size: 11px; color: #9c8060; margin-top: 1px; }
  .at-student-time { font-size: 11px; color: #9c8060; margin-left: auto; flex-shrink: 0; }
  .at-att-badge {
    font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0;
  }
  .at-att-badge.present { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .at-att-badge.absent { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }
  .at-att-badge.late { background: #fff8e1; color: #e65100; border: 1px solid #ffe082; }

  /* PROGRESS BAR */
  .at-progress-wrap { background: #f0e8d8; border-radius: 20px; height: 10px; overflow: hidden; margin-top: 6px; }
  .at-progress-bar { height: 100%; border-radius: 20px; transition: width 0.6s ease; }

  /* CALENDAR HEATMAP */
  .at-heat-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 5px; }
  .at-heat-cell {
    aspect-ratio: 1; border-radius: 6px; display: flex; align-items: center;
    justify-content: center; font-size: 10px; font-weight: 700; cursor: pointer;
    transition: transform 0.15s; border: 1.5px solid transparent;
  }
  .at-heat-cell:hover { transform: scale(1.15); }
  .at-heat-cell.present { background: #c8e6c9; color: #2e7d32; border-color: #a5d6a7; }
  .at-heat-cell.absent { background: #ffcdd2; color: #c62828; border-color: #ef9a9a; }
  .at-heat-cell.late { background: #fff9c4; color: #e65100; border-color: #ffe082; }
  .at-heat-cell.empty { background: #f0e8d8; color: #c9b99a; border-color: #e0d0b8; }
  .at-heat-day { font-family: 'Caveat', cursive; font-size: 13px; color: #9c8060; text-align: center; margin-bottom: 6px; font-weight: 600; }

  /* SUBJECT CARDS */
  .at-subject-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .at-subject-card {
    background: #f5efe0; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 14px; cursor: pointer; transition: all 0.15s;
  }
  .at-subject-card:hover { box-shadow: 3px 3px 0px #c9b99a; transform: translateY(-2px); }
  .at-subject-card.active-class { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; }
  .at-subject-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .at-subject-name { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #3d2c1e; }
  .at-subject-pct { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; }
  .at-subject-meta { font-size: 11px; color: #9c8060; margin-bottom: 8px; }

  /* BOTTOM NAV */
  .at-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .at-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; }
  .at-nav-item-icon { font-size: 20px; }
  .at-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .at-nav-item.active .at-nav-item-label { color: #c0570e; }

  /* MODAL */
  .at-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .at-modal {
    background: #fffdf5; border: 3px solid #3d2c1e; border-radius: 24px;
    padding: 32px 24px; max-width: 340px; width: 100%; text-align: center;
    box-shadow: 8px 8px 0px #c0570e;
    animation: at-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes at-pop { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
  .at-modal-emoji { font-size: 52px; margin-bottom: 10px; }
  .at-modal-title { font-family: 'Caveat', cursive; font-size: 26px; font-weight: 700; color: #3d2c1e; margin-bottom: 6px; }
  .at-modal-sub { font-size: 13px; color: #9c8060; margin-bottom: 20px; line-height: 1.6; }
  .at-modal-btn { width: 100%; padding: 12px; background: #3d2c1e; border: none; border-radius: 12px; color: #f5efe0; font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 3px 3px 0px #c0570e; }

  @media (max-width: 600px) {
    .at-stats { grid-template-columns: repeat(2,1fr); }
    .at-subject-grid { grid-template-columns: 1fr; }
  }
`;

const classes = ['DBMS', 'Software Engg', 'AI & ML', 'Computer Networks', 'Web Tech'];

const students = [
  { emoji: '🧑‍💻', name: 'Tejas Nair', id: 'CS21001', status: 'present', time: '9:02 AM', pct: 92 },
  { emoji: '👩‍🎓', name: 'Karunya B.', id: 'CS21002', status: 'present', time: '9:04 AM', pct: 88 },
  { emoji: '👨‍🎓', name: 'Rohan Desai', id: 'CS21003', status: 'late', time: '9:18 AM', pct: 74 },
  { emoji: '👩‍💻', name: 'Priya Mehta', id: 'CS21004', status: 'absent', time: '—', pct: 61 },
  { emoji: '🧑‍🎓', name: 'Aditya Rao', id: 'CS21005', status: 'present', time: '9:01 AM', pct: 95 },
  { emoji: '👩‍🔬', name: 'Sneha Joshi', id: 'CS21006', status: 'present', time: '9:06 AM', pct: 83 },
  { emoji: '👨‍💻', name: 'Vivek Patil', id: 'CS21007', status: 'absent', time: '—', pct: 55 },
  { emoji: '🧑‍🔬', name: 'Meera Shah', id: 'CS21008', status: 'present', time: '9:03 AM', pct: 90 },
];

const subjects = [
  { name: 'DBMS', code: 'CS301', pct: 88, present: 22, total: 25, color: '#c0570e' },
  { name: 'AI & ML', code: 'CS401', pct: 76, present: 19, total: 25, color: '#388e3c' },
  { name: 'Soft. Engg', code: 'CS302', pct: 92, present: 23, total: 25, color: '#1565c0' },
  { name: 'Networks', code: 'CS303', pct: 64, present: 16, total: 25, color: '#c62828' },
];

const heatDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const heatData = [
  'present','present','absent','present','present','empty','empty',
  'present','late','present','present','absent','empty','empty',
  'present','present','present','absent','present','empty','empty',
  'late','present','present','present','present','empty','empty',
];

const geofences = [
  { icon: '🏫', name: 'CS Department', sub: 'Room 204, 2nd Floor', status: 'inside' },
  { icon: '📚', name: 'Library Zone', sub: 'Ground Floor', status: 'outside' },
  { icon: '🍽️', name: 'Cafeteria', sub: 'Block C', status: 'outside' },
];

export default function AttendanceTracker() {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState(0);
  const [scanState, setScanState] = useState('idle'); // idle | scanning | done
  const [showModal, setShowModal] = useState(false);
  const [manualOverride, setManualOverride] = useState({});

  const presentCount = students.filter(s => (manualOverride[s.id] || s.status) === 'present').length;
  const absentCount = students.filter(s => (manualOverride[s.id] || s.status) === 'absent').length;
  const lateCount = students.filter(s => (manualOverride[s.id] || s.status) === 'late').length;
  const total = students.length;

  const startScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('done');
      setShowModal(true);
    }, 2800);
  };

  const toggleStatus = (id, current) => {
    const next = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present';
    setManualOverride(p => ({ ...p, [id]: next }));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="at-page">

        {/* Nav */}
        <div className="at-nav">
          <div className="at-back" onClick={() => navigate('/professor/dashboard')}>←</div>
          <span className="at-nav-title">👥 attendance tracker</span>
          <div className="at-ai-badge"><div className="at-ai-dot" /> AI-Powered</div>
        </div>

        <div className="at-content">

          {/* Stats */}
          <div className="at-stats">
            <div className="at-stat">
              <div className="at-stat-icon">✅</div>
              <div className="at-stat-num" style={{color:'#388e3c'}}>{presentCount}</div>
              <div className="at-stat-label">Present</div>
            </div>
            <div className="at-stat">
              <div className="at-stat-icon">❌</div>
              <div className="at-stat-num" style={{color:'#c62828'}}>{absentCount}</div>
              <div className="at-stat-label">Absent</div>
            </div>
            <div className="at-stat">
              <div className="at-stat-icon">⏰</div>
              <div className="at-stat-num" style={{color:'#e65100'}}>{lateCount}</div>
              <div className="at-stat-label">Late</div>
            </div>
            <div className="at-stat">
              <div className="at-stat-icon">📊</div>
              <div className="at-stat-num">{Math.round((presentCount/total)*100)}%</div>
              <div className="at-stat-label">Today's Rate</div>
            </div>
          </div>

          {/* Class Tabs */}
          <div className="at-class-tabs">
            {classes.map((c, i) => (
              <div key={c} className={`at-class-tab ${activeClass === i ? 'active' : ''}`} onClick={() => setActiveClass(i)}>{c}</div>
            ))}
          </div>

          {/* Face Scan */}
          <div className={`at-scan-box ${scanState}`}>
            <div className={`at-scan-frame ${scanState} at-scan-corners`}>
              <span className="at-scan-emoji">
                {scanState === 'idle' ? '📷' : scanState === 'scanning' ? '🤖' : '✅'}
              </span>
              {scanState === 'scanning' && <div className="at-scan-line" />}
            </div>
            <div className="at-scan-title">
              {scanState === 'idle' && 'AI Facial Recognition'}
              {scanState === 'scanning' && 'Scanning classroom...'}
              {scanState === 'done' && 'Attendance marked!'}
            </div>
            <div className="at-scan-sub">
              {scanState === 'idle' && 'Uses OpenCV + GPS geofencing to auto-mark attendance — no roll call needed'}
              {scanState === 'scanning' && 'Detecting faces + verifying geofence location...'}
              {scanState === 'done' && `${presentCount} of ${total} students detected and marked automatically`}
            </div>
            {scanState !== 'done' && (
              <button
                className={`at-scan-btn ${scanState === 'scanning' ? 'scanning' : ''}`}
                onClick={scanState === 'idle' ? startScan : undefined}>
                {scanState === 'idle' ? '🚀 start AI scan' : '⏳ scanning...'}
              </button>
            )}
            {scanState === 'done' && (
              <button className="at-scan-btn" onClick={() => setScanState('idle')} style={{background:'#5c4033'}}>
                🔄 scan again
              </button>
            )}
          </div>

          {/* Geofence */}
          <div className="at-card">
            <div className="at-section-title">📡 geofence zones</div>
            {geofences.map(g => (
              <div className="at-geo-row" key={g.name}>
                <div className="at-geo-left">
                  <span className="at-geo-icon">{g.icon}</span>
                  <div>
                    <div className="at-geo-name">{g.name}</div>
                    <div className="at-geo-sub">{g.sub}</div>
                  </div>
                </div>
                <span className={`at-geo-badge ${g.status}`}>{g.status === 'inside' ? '📍 Inside' : '⭕ Outside'}</span>
              </div>
            ))}
          </div>

          {/* Student List */}
          <div className="at-card">
            <div className="at-section-title">
              🧑‍🎓 student list — {classes[activeClass]}
              <span style={{fontSize:13, fontFamily:'DM Sans', fontWeight:400, color:'#9c8060'}}>tap to override</span>
            </div>
            {students.map(s => {
              const status = manualOverride[s.id] || s.status;
              return (
                <div className="at-student-row" key={s.id}>
                  <div className="at-student-av">{s.emoji}</div>
                  <div style={{flex:1}}>
                    <div className="at-student-name">{s.name}</div>
                    <div className="at-student-id">{s.id}</div>
                  </div>
                  <div style={{textAlign:'right', marginRight:8}}>
                    <div style={{fontSize:11, color:'#9c8060'}}>{s.pct}% overall</div>
                    <div className="at-progress-wrap" style={{width:60}}>
                      <div className="at-progress-bar" style={{
                        width:`${s.pct}%`,
                        background: s.pct >= 75 ? '#4caf50' : s.pct >= 60 ? '#ff9800' : '#f44336'
                      }} />
                    </div>
                  </div>
                  <span className={`at-att-badge ${status}`} style={{cursor:'pointer'}} onClick={() => toggleStatus(s.id, status)}>
                    {status === 'present' ? '✅ Present' : status === 'absent' ? '❌ Absent' : '⏰ Late'}
                  </span>
                  <div className="at-student-time">{s.time}</div>
                </div>
              );
            })}
          </div>

          {/* Subject Attendance */}
          <div className="at-card">
            <div className="at-section-title">📚 subject-wise attendance</div>
            <div className="at-subject-grid">
              {subjects.map(s => (
                <div key={s.name} className={`at-subject-card ${s.pct < 75 ? 'active-class' : ''}`}>
                  <div className="at-subject-top">
                    <div className="at-subject-name">{s.name}</div>
                    <div className="at-subject-pct" style={{color: s.pct >= 75 ? '#388e3c' : '#c62828'}}>{s.pct}%</div>
                  </div>
                  <div className="at-subject-meta">{s.code} · {s.present}/{s.total} classes</div>
                  <div className="at-progress-wrap">
                    <div className="at-progress-bar" style={{
                      width:`${s.pct}%`,
                      background: s.pct >= 75 ? '#4caf50' : s.pct >= 60 ? '#ff9800' : '#f44336'
                    }} />
                  </div>
                  {s.pct < 75 && <div style={{fontSize:11, color:'#c62828', marginTop:6, fontWeight:700}}>⚠️ below 75% — at risk!</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Heatmap */}
          <div className="at-card">
            <div className="at-section-title">📅 attendance heatmap — this month</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:8}}>
              {heatDays.map((d,i) => <div key={i} className="at-heat-day">{d}</div>)}
            </div>
            <div className="at-heat-grid">
              {heatData.map((d, i) => (
                <div key={i} className={`at-heat-cell ${d}`}>
                  {d !== 'empty' ? (i % 7 === 5 || i % 7 === 6 ? '' : i+1) : ''}
                </div>
              ))}
            </div>
            <div style={{display:'flex', gap:16, marginTop:14, flexWrap:'wrap'}}>
              {[['present','#c8e6c9','#2e7d32','Present'],['late','#fff9c4','#e65100','Late'],['absent','#ffcdd2','#c62828','Absent']].map(([k,bg,col,lbl]) => (
                <div key={k} style={{display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#5c4033'}}>
                  <div style={{width:14, height:14, borderRadius:4, background:bg, border:`1.5px solid ${col}`}} />
                  {lbl}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Success Modal */}
        {showModal && (
          <div className="at-overlay">
            <div className="at-modal">
              <div className="at-modal-emoji">🤖</div>
              <div className="at-modal-title">scan complete!</div>
              <div className="at-modal-sub">
                AI detected <strong>{presentCount} students present</strong>, {absentCount} absent, {lateCount} late.<br /><br />
                Attendance has been auto-saved and analytics updated! 🎉
              </div>
              <button className="at-modal-btn" onClick={() => setShowModal(false)}>awesome, done! →</button>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="at-bottom-nav">
          {[
            { id: 'dash', icon: '🏠', label: 'dashboard', path: '/professor/dashboard' },
            { id: 'avail', icon: '📅', label: 'availability', path: '/professor/availability' },
            { id: 'requests', icon: '📨', label: 'requests', path: '/professor/requests' },
            { id: 'attend', icon: '👥', label: 'attendance', path: '/professor/attendance', active: true },
            { id: 'analytics', icon: '📊', label: 'analytics', path: '/professor/analytics' },
          ].map(n => (
            <div key={n.id} className={`at-nav-item ${n.active ? 'active' : ''}`} onClick={() => navigate(n.path)}>
              <span className="at-nav-item-icon">{n.icon}</span>
              <span className="at-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
