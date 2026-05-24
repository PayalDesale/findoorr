import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-page {
    min-height: 100vh;
    background-color: #f0f7f0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(120,160,120,0.15) 60px, rgba(120,160,120,0.15) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(120,160,120,0.1) 60px, rgba(120,160,120,0.1) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .pd-nav {
    background: #f8fff8; border-bottom: 2px solid #a8c9a8;
    padding: 14px 24px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #a8c9a8;
  }
  .pd-nav-logo { font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700; color: #1a3a1a; }
  .pd-nav-logo span { color: #2e7d32; }
  .pd-nav-badge {
    font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px;
    background: #e8f5e9; color: #2e7d32; border: 1.5px solid #a5d6a7; margin-left: 8px;
  }
  .pd-nav-right { display: flex; align-items: center; gap: 12px; }
  .pd-notif-btn {
    width: 38px; height: 38px; background: #e8f5e9; border: 2px solid #a8c9a8;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; position: relative; transition: all 0.15s;
  }
  .pd-notif-btn:hover { background: #c8e6c9; transform: translateY(-1px); }
  .pd-notif-dot { position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; background: #c0570e; border-radius: 50%; border: 2px solid #f8fff8; }
  .pd-avatar { width: 38px; height: 38px; background: #1a3a1a; border-radius: 50%; border: 2px solid #a8c9a8; display: flex; align-items: center; justify-content: center; color: #f0f7f0; font-size: 16px; font-weight: 700; cursor: pointer; }

  .pd-content { max-width: 960px; margin: 0 auto; padding: 24px 20px; }

  .pd-greeting { margin-bottom: 22px; }
  .pd-greeting h1 { font-family: 'Caveat', cursive; font-size: 36px; font-weight: 700; color: #1a3a1a; }
  .pd-greeting p { color: #6a9a6a; font-size: 13px; margin-top: 3px; }

  /* STATUS TOGGLE */
  .pd-status-bar {
    background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 16px;
    padding: 16px 20px; margin-bottom: 22px; box-shadow: 3px 3px 0px #a8c9a8;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .pd-status-left { display: flex; align-items: center; gap: 12px; }
  .pd-status-dot-big { width: 14px; height: 14px; border-radius: 50%; animation: pd-pulse 1.5s infinite; flex-shrink: 0; }
  .pd-status-dot-big.free { background: #4caf50; box-shadow: 0 0 8px #4caf50; }
  .pd-status-dot-big.busy { background: #f44336; box-shadow: 0 0 8px #f44336; }
  .pd-status-dot-big.away { background: #ff9800; box-shadow: 0 0 8px #ff9800; }
  @keyframes pd-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pd-status-text { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #1a3a1a; }
  .pd-status-sub { font-size: 12px; color: #6a9a6a; }
  .pd-status-btns { display: flex; gap: 8px; }
  .pd-status-btn {
    padding: 7px 16px; border-radius: 10px; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; border: 2px solid; font-family: 'DM Sans', sans-serif;
  }
  .pd-status-btn.free { background: #e8f5e9; border-color: #a5d6a7; color: #2e7d32; }
  .pd-status-btn.busy { background: #fde8e8; border-color: #ef9a9a; color: #c62828; }
  .pd-status-btn.away { background: #fff8e1; border-color: #ffe082; color: #e65100; }
  .pd-status-btn.active { box-shadow: 2px 2px 0px rgba(0,0,0,0.2); transform: translate(-1px,-1px); }

  /* STATS */
  .pd-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
  .pd-stat {
    background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 16px;
    padding: 16px; display: flex; align-items: center; gap: 12px;
    box-shadow: 3px 3px 0px #a8c9a8; cursor: pointer; transition: all 0.15s;
  }
  .pd-stat:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #a8c9a8; }
  .pd-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .pd-stat-icon.green { background: #e8f5e9; }
  .pd-stat-icon.blue { background: #e8f0fe; }
  .pd-stat-icon.orange { background: #fff3e0; }
  .pd-stat-icon.yellow { background: #fffde7; }
  .pd-stat-num { font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700; color: #1a3a1a; line-height: 1; }
  .pd-stat-label { font-size: 11px; color: #6a9a6a; font-weight: 600; margin-top: 2px; }

  .pd-section-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #2e4a2e;
    margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
  }
  .pd-view-all { font-size: 13px; color: #2e7d32; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; text-decoration: underline; text-decoration-style: wavy; }

  /* QUICK ACTIONS */
  .pd-quick-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 24px; }
  .pd-quick-btn {
    background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 14px;
    padding: 16px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: all 0.15s; box-shadow: 3px 3px 0px #a8c9a8;
  }
  .pd-quick-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #a8c9a8; background: #e8f5e9; }
  .pd-quick-icon { font-size: 24px; }
  .pd-quick-label { font-size: 12px; font-weight: 600; color: #2e4a2e; text-align: center; }

  .pd-two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 16px; }
  .pd-card { background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 18px; padding: 20px; box-shadow: 4px 4px 0px #a8c9a8; }

  /* MEETING REQUESTS */
  .pd-req-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1.5px dashed #c8e6c8;
  }
  .pd-req-item:last-child { border-bottom: none; }
  .pd-req-avatar { width: 40px; height: 40px; border-radius: 12px; background: #1a3a1a; border: 2px solid #a8c9a8; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .pd-req-info { flex: 1; }
  .pd-req-name { font-size: 13px; font-weight: 700; color: #1a3a1a; }
  .pd-req-sub { font-size: 11px; color: #6a9a6a; margin-top: 2px; }
  .pd-req-time { font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700; color: #2e7d32; }
  .pd-req-actions { display: flex; gap: 6px; }
  .pd-req-btn {
    padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; border: 2px solid; font-family: 'DM Sans', sans-serif;
  }
  .pd-req-btn.approve { background: #e8f5e9; border-color: #a5d6a7; color: #2e7d32; }
  .pd-req-btn.approve:hover { background: #c8e6c9; }
  .pd-req-btn.reject { background: #fde8e8; border-color: #ef9a9a; color: #c62828; }
  .pd-req-btn.reject:hover { background: #ffcdd2; }

  /* TODAY SCHEDULE */
  .pd-schedule-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1.5px dashed #c8e6c8;
  }
  .pd-schedule-item:last-child { border-bottom: none; }
  .pd-sched-time { background: #e8f5e9; border: 1.5px solid #a5d6a7; border-radius: 8px; padding: 6px 8px; text-align: center; min-width: 52px; }
  .pd-sched-hour { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #2e7d32; line-height: 1; }
  .pd-sched-day { font-size: 9px; color: #6a9a6a; font-weight: 600; }
  .pd-sched-name { font-size: 13px; font-weight: 600; color: #1a3a1a; }
  .pd-sched-sub { font-size: 11px; color: #6a9a6a; margin-top: 1px; }
  .pd-sched-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; flex-shrink: 0; }
  .pd-sched-badge.class { background: #e8f0fe; color: #3949ab; border: 1px solid #9fa8da; }
  .pd-sched-badge.free { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
  .pd-sched-badge.meeting { background: #fff8e1; color: #f57f17; border: 1px solid #ffe082; }

  /* ATTENDANCE */
  .pd-attend-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1.5px dashed #c8e6c8; }
  .pd-attend-item:last-child { border-bottom: none; }
  .pd-attend-name { font-size: 13px; font-weight: 600; color: #1a3a1a; flex: 1; }
  .pd-attend-pct { font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700; color: #2e7d32; }
  .pd-attend-bar { height: 6px; border-radius: 3px; background: #c8e6c9; overflow: hidden; flex: 1; }
  .pd-attend-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #4caf50, #2e7d32); }

  /* ANNOUNCEMENT */
  .pd-announce {
    background: linear-gradient(135deg, #1a3a1a, #2e4a2e);
    border: 2px solid #1a3a1a; border-radius: 18px; padding: 20px 22px;
    margin-bottom: 16px; box-shadow: 4px 4px 0px #2e7d32;
  }
  .pd-announce-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pd-announce-icon { width: 36px; height: 36px; background: #2e7d32; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .pd-announce-title { font-family: 'Caveat', cursive; font-size: 20px; color: #f0f7f0; font-weight: 700; }
  .pd-announce-sub { font-size: 11px; color: rgba(240,247,240,0.6); }
  .pd-announce-input {
    width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.1);
    border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px; color: #f0f7f0;
    font-size: 14px; outline: none; font-family: 'DM Sans', sans-serif; margin-bottom: 10px;
  }
  .pd-announce-input::placeholder { color: rgba(240,247,240,0.4); }
  .pd-announce-btn {
    padding: 10px 24px; background: #2e7d32; border: 2px solid #2e7d32; border-radius: 10px;
    color: #fff; font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700;
    cursor: pointer; box-shadow: 2px 2px 0px rgba(0,0,0,0.3); transition: all 0.15s;
  }
  .pd-announce-btn:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0px rgba(0,0,0,0.3); }

  /* BOTTOM NAV */
  .pd-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #f8fff8; border-top: 2px solid #a8c9a8;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .pd-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .pd-nav-item:hover { background: #e8f5e9; }
  .pd-nav-item-icon { font-size: 20px; }
  .pd-nav-item-label { font-size: 10px; font-weight: 600; color: #6a9a6a; }
  .pd-nav-item.active .pd-nav-item-label { color: #2e7d32; }

  @media (max-width: 700px) {
    .pd-stats { grid-template-columns: repeat(2,1fr); }
    .pd-quick-grid { grid-template-columns: repeat(2,1fr); }
    .pd-two-col { grid-template-columns: 1fr; }
  }
`;

const requests = [
  { emoji: '🎓', name: 'Tejas Nair', sub: 'Project Discussion · In-Person', time: '3:00 PM' },
  { emoji: '🎓', name: 'Priya Raut', sub: 'Doubt Clearing · Virtual', time: '4:30 PM' },
  { emoji: '🎓', name: 'Arjun Kulkarni', sub: 'Assignment Review · In-Person', time: 'Tomorrow 10AM' },
];

const schedule = [
  { time: '9:00', day: 'Now', name: 'Data Structures', sub: 'Room 204 · 45 students', badge: 'class' },
  { time: '11:00', day: 'AM', name: 'Office Hours', sub: 'Cabin 12 · Open to students', badge: 'free' },
  { time: '2:00', day: 'PM', name: 'Project Discussion', sub: 'Tejas Nair · Online', badge: 'meeting' },
  { time: '3:30', day: 'PM', name: 'Algorithms Lab', sub: 'Lab 3 · 30 students', badge: 'class' },
];

const attendance = [
  { name: 'Data Structures (A)', pct: 87 },
  { name: 'Algorithms Lab (B)', pct: 92 },
  { name: 'Advanced DSA (C)', pct: 74 },
];

export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const [profName, setProfName] = React.useState('Professor');
  const [profInitial, setProfInitial] = React.useState('P');
  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      setProfName(name);
      setProfInitial(name.charAt(0).toUpperCase());
    }
  }, []);
  const [status, setStatus] = useState('free');
  const [activeNav, setActiveNav] = useState('home');
  const [announcement, setAnnouncement] = useState('');

  return (
    <>
      <style>{styles}</style>
      <div className="pd-page">

        <div className="pd-nav">
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span className="pd-nav-logo">find<span>oorr</span></span>
            <span className="pd-nav-badge">Professor</span>
          </div>
          <div className="pd-nav-right">
            <div className="pd-notif-btn" onClick={() => navigate('/student/notifications')}>🔔<div className="pd-notif-dot"/></div>
            <div className="pd-avatar">{profInitial}</div>
          </div>
        </div>

        <div className="pd-content">

          <div className="pd-greeting">
            <h1>good morning, {profName} 👋</h1>
            <p>Wednesday, 20 May 2026 · 4 classes today · 3 pending requests</p>
          </div>

          {/* Status Toggle */}
          <div className="pd-status-bar">
            <div className="pd-status-left">
              <div className={`pd-status-dot-big ${status}`} />
              <div>
                <div className="pd-status-text">
                  {status === 'free' ? 'Available to students' : status === 'busy' ? 'Currently in class' : 'Away from campus'}
                </div>
                <div className="pd-status-sub">Room 204, CS Block · tap to change status</div>
              </div>
            </div>
            <div className="pd-status-btns">
              {['free','busy','away'].map(s => (
                <button key={s} className={`pd-status-btn ${s} ${status===s?'active':''}`} onClick={() => setStatus(s)}>
                  {s === 'free' ? '🟢 Free' : s === 'busy' ? '🔴 Busy' : '🟡 Away'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pd-stats">
            {[
              { icon: '📅', color: 'green', num: 3, label: 'Pending Requests' },
              { icon: '👥', color: 'blue', num: 120, label: 'Total Students' },
              { icon: '✅', color: 'orange', num: 8, label: 'Meetings Today' },
              { icon: '📊', color: 'yellow', num: '86%', label: 'Avg Attendance' },
            ].map(s => (
              <div className="pd-stat" key={s.label}>
                <div className={`pd-stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="pd-stat-num">{s.num}</div>
                  <div className="pd-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pd-section-title">✦ quick actions</div>
          <div className="pd-quick-grid">
            {[
              { icon: '📅', label: 'Set Availability', path: '/professor/availability' },
              { icon: '📋', label: 'Meeting Requests', path: '/professor/requests' },
              { icon: '📍', label: 'Share Location', path: '/professor/location' },
              { icon: '📊', label: 'View Analytics', path: '/professor/analytics' },
            ].map(a => (
              <button key={a.label} className="pd-quick-btn" onClick={() => navigate(a.path)}>
                <span className="pd-quick-icon">{a.icon}</span>
                <span className="pd-quick-label">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Announcement Bar */}
          <div className="pd-section-title">📢 send announcement</div>
          <div className="pd-announce">
            <div className="pd-announce-top">
              <div className="pd-announce-icon">📢</div>
              <div>
                <div className="pd-announce-title">Broadcast to Students</div>
                <div className="pd-announce-sub">All enrolled students will be notified instantly</div>
              </div>
            </div>
            <input className="pd-announce-input" placeholder="e.g. Class cancelled today, office hours moved to 3PM..."
              value={announcement} onChange={e => setAnnouncement(e.target.value)} />
            <button className="pd-announce-btn" onClick={() => setAnnouncement('')}>send to all students →</button>
          </div>

          {/* Two Col */}
          <div className="pd-two-col">

            {/* Today's Schedule */}
            <div className="pd-card">
              <div className="pd-section-title">
                📅 today's schedule
                <span className="pd-view-all" onClick={() => navigate('/professor/availability')}>manage →</span>
              </div>
              {schedule.map(s => (
                <div className="pd-schedule-item" key={s.name}>
                  <div className="pd-sched-time">
                    <div className="pd-sched-hour">{s.time}</div>
                    <div className="pd-sched-day">{s.day}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div className="pd-sched-name">{s.name}</div>
                    <div className="pd-sched-sub">{s.sub}</div>
                  </div>
                  <span className={`pd-sched-badge ${s.badge}`}>{s.badge}</span>
                </div>
              ))}
            </div>

            {/* Right col */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

              {/* Meeting Requests */}
              <div className="pd-card">
                <div className="pd-section-title">
                  📋 meeting requests
                  <span className="pd-view-all" onClick={() => navigate('/professor/requests')}>view all →</span>
                </div>
                {requests.map(r => (
                  <div className="pd-req-item" key={r.name}>
                    <div className="pd-req-avatar">{r.emoji}</div>
                    <div className="pd-req-info">
                      <div className="pd-req-name">{r.name}</div>
                      <div className="pd-req-sub">{r.sub}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
                      <div className="pd-req-time">{r.time}</div>
                      <div className="pd-req-actions">
                        <button className="pd-req-btn approve">✓</button>
                        <button className="pd-req-btn reject">✗</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance */}
              <div className="pd-card">
                <div className="pd-section-title">
                  👥 attendance
                  <span className="pd-view-all" onClick={() => navigate('/professor/attendance')}>details →</span>
                </div>
                {attendance.map(a => (
                  <div className="pd-attend-item" key={a.name}>
                    <div className="pd-attend-name">{a.name}</div>
                    <div className="pd-attend-bar"><div className="pd-attend-fill" style={{width:`${a.pct}%`}}/></div>
                    <div className="pd-attend-pct">{a.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="pd-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/professor/dashboard' },
            { id: 'avail', icon: '📅', label: 'schedule', path: '/professor/availability' },
            { id: 'req', icon: '📋', label: 'requests', path: '/professor/requests' },
            { id: 'attend', icon: '👥', label: 'attendance', path: '/professor/attendance' },
            { id: 'stats', icon: '📊', label: 'analytics', path: '/professor/analytics' },
          ].map(n => (
            <div key={n.id} className={`pd-nav-item ${activeNav===n.id?'active':''}`}
              onClick={() => { setActiveNav(n.id); navigate(n.path); }}>
              <span className="pd-nav-item-icon">{n.icon}</span>
              <span className="pd-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
