import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import DarkModeToggle from '../DarkModeToggle';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-page {
    min-height: 100vh;
    background-color: var(--bg-page, #f5efe0);
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, var(--grid-color, rgba(180,160,120,0.18)) 60px, var(--grid-color, rgba(180,160,120,0.18)) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, var(--grid-color, rgba(180,160,120,0.12)) 60px, var(--grid-color, rgba(180,160,120,0.12)) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .sd-nav {
    background: var(--bg-card, #fffdf5); border-bottom: 2px solid var(--border, #c9b99a);
    padding: 14px 24px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px var(--border, #c9b99a);
  }
  .sd-nav-logo { font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700; color: var(--text-primary, #3d2c1e); }
  .sd-nav-logo span { color: #c0570e; }
  .sd-nav-right { display: flex; align-items: center; gap: 12px; }
  .sd-notif-btn {
    width: 38px; height: 38px; background: var(--bg-subtle, #f0e8d8); border: 2px solid var(--border, #c9b99a); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; position: relative; transition: all 0.15s;
  }
  .sd-notif-btn:hover { background: #e8dcc8; transform: translateY(-1px); }
  .sd-notif-dot {
    position: absolute; top: -4px; right: -4px; width: 10px; height: 10px;
    background: #c0570e; border-radius: 50%; border: 2px solid var(--bg-card, #fffdf5);
  }
  .sd-avatar {
    width: 38px; height: 38px; background: #3d2c1e; border-radius: 50%; border: 2px solid var(--border, #c9b99a);
    display: flex; align-items: center; justify-content: center;
    color: #f5efe0; font-size: 16px; cursor: pointer; font-weight: 700;
  }

  .sd-content { max-width: 960px; margin: 0 auto; padding: 24px 20px; }

  .sd-greeting { margin-bottom: 22px; }
  .sd-greeting h1 { font-family: 'Caveat', cursive; font-size: 36px; font-weight: 700; color: var(--text-primary, #3d2c1e); }
  .sd-greeting p { color: var(--text-muted, #9c8060); font-size: 13px; margin-top: 3px; }

  .sd-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
  .sd-stat-card {
    background: var(--bg-card, #fffdf5); border: 2px solid var(--border, #c9b99a); border-radius: 16px;
    padding: 16px; display: flex; align-items: center; gap: 12px;
    box-shadow: 3px 3px 0px var(--shadow, #c9b99a); cursor: pointer; transition: all 0.15s;
  }
  .sd-stat-card:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px var(--shadow, #c9b99a); }
  .sd-stat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .sd-stat-icon.blue { background: #e8f0fe; }
  .sd-stat-icon.green { background: #e8f5e9; }
  .sd-stat-icon.orange { background: #fff3e0; }
  .sd-stat-icon.yellow { background: #fffde7; }
  .sd-stat-num { font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700; color: var(--text-primary, #3d2c1e); line-height: 1; }
  .sd-stat-label { font-size: 11px; color: var(--text-muted, #9c8060); font-weight: 600; margin-top: 2px; }

  .sd-section-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: var(--text-secondary, #5c4033);
    margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
  }
  .sd-view-all { font-size: 13px; color: #c0570e; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; text-decoration: underline; text-decoration-style: wavy; }

  .sd-ai-bar {
    background: linear-gradient(135deg, #3d2c1e, #5c4033);
    border: 2px solid #3d2c1e; border-radius: 18px; padding: 20px 22px;
    margin-bottom: 16px; box-shadow: 4px 4px 0px #c0570e;
  }
  .sd-ai-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .sd-ai-icon { width: 36px; height: 36px; background: #c0570e; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .sd-ai-title { font-family: 'Caveat', cursive; font-size: 20px; color: #f5efe0; font-weight: 700; }
  .sd-ai-sub { font-size: 11px; color: rgba(245,239,224,0.6); margin-top: 1px; }
  .sd-ai-input-row { display: flex; gap: 10px; margin-bottom: 10px; }
  .sd-ai-input { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px; color: #f5efe0; font-size: 14px; outline: none; font-family: 'DM Sans', sans-serif; }
  .sd-ai-input::placeholder { color: rgba(245,239,224,0.4); }
  .sd-ai-input:focus { border-color: #c0570e; }
  .sd-ai-send { width: 44px; height: 44px; background: #c0570e; border: none; border-radius: 12px; color: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sd-ai-chips { display: flex; gap: 6px; flex-wrap: wrap; }
  .sd-ai-chip { font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: rgba(245,239,224,0.8); cursor: pointer; font-family: 'DM Sans', sans-serif; }

  .sd-mini-map {
    background: linear-gradient(135deg, #e8f4f8, #d4eaf0);
    border: 2px solid #b8d8e8; border-radius: 14px; height: 130px;
    position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
    cursor: pointer; margin-bottom: 24px;
  }
  .sd-map-grid { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg,rgba(100,150,180,0.15) 0,rgba(100,150,180,0.15) 1px,transparent 1px,transparent 30px),repeating-linear-gradient(90deg,rgba(100,150,180,0.15) 0,rgba(100,150,180,0.15) 1px,transparent 1px,transparent 30px); }
  .sd-map-building { position: absolute; background: rgba(100,150,180,0.25); border: 1.5px solid rgba(100,150,180,0.4); border-radius: 4px; }
  .sd-map-pin { position: absolute; font-size: 18px; animation: sd-bounce 2s ease-in-out infinite; }
  @keyframes sd-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .sd-map-label { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #2c6e8a; text-align: center; position: relative; z-index: 2; }
  .sd-map-sublabel { font-size: 11px; color: #5a8fa3; text-align: center; position: relative; z-index: 2; margin-top: 2px; }

  .sd-quick-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 24px; }
  .sd-quick-btn {
    background: var(--bg-card, #fffdf5); border: 2px solid var(--border, #c9b99a); border-radius: 14px;
    padding: 16px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: all 0.15s; box-shadow: 3px 3px 0px var(--shadow, #c9b99a); font-family: 'DM Sans', sans-serif;
  }
  .sd-quick-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px var(--shadow, #c9b99a); }
  .sd-quick-icon { font-size: 24px; }
  .sd-quick-label { font-size: 12px; font-weight: 600; color: var(--text-secondary, #5c4033); text-align: center; }

  .sd-two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 16px; }
  .sd-card { background: var(--bg-card, #fffdf5); border: 2px solid var(--border, #c9b99a); border-radius: 18px; padding: 20px; box-shadow: 4px 4px 0px var(--shadow, #c9b99a); }

  .sd-cal-strip { display: flex; gap: 6px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px; }
  .sd-cal-day { min-width: 46px; padding: 8px 6px; border-radius: 12px; text-align: center; border: 2px solid var(--border-light, #e0d0b8); background: var(--bg-subtle, #faf3e0); cursor: pointer; transition: all 0.15s; }
  .sd-cal-day.active { background: #3d2c1e; border-color: #3d2c1e; }
  .sd-cal-day-name { font-size: 10px; font-weight: 600; color: var(--text-muted, #9c8060); text-transform: uppercase; }
  .sd-cal-day.active .sd-cal-day-name { color: #f5efe0; }
  .sd-cal-day-num { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: var(--text-primary, #3d2c1e); line-height: 1.1; }
  .sd-cal-day.active .sd-cal-day-num { color: #fff; }

  .sd-empty { text-align: center; padding: 20px; color: var(--text-muted, #9c8060); font-family: 'Caveat', cursive; font-size: 16px; }

  .sd-prof-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; cursor: pointer; transition: background 0.15s; border-bottom: 1.5px dashed var(--border-light, #e0d0b8); }
  .sd-prof-item:last-child { border-bottom: none; }
  .sd-prof-item:hover { background: var(--bg-subtle, #faf3e0); }
  .sd-prof-av { width: 38px; height: 38px; border-radius: 12px; background: #3d2c1e; border: 2px solid var(--border, #c9b99a); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .sd-prof-name { font-size: 13px; font-weight: 600; color: var(--text-primary, #3d2c1e); }
  .sd-prof-dept { font-size: 11px; color: var(--text-muted, #9c8060); }
  .sd-status-pill { margin-left: auto; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; }
  .sd-status-pill.free { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .sd-status-pill.busy { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }
  .sd-status-pill.away { background: #fff8e1; color: #e65100; border: 1px solid #ffe082; }

  .sd-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg-card, #fffdf5); border-top: 2px solid var(--border, #c9b99a); display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100; }
  .sd-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .sd-nav-item:hover { background: var(--bg-subtle, #f0e8d8); }
  .sd-nav-item-icon { font-size: 20px; }
  .sd-nav-item-label { font-size: 10px; font-weight: 600; color: var(--text-muted, #9c8060); }
  .sd-nav-item.active .sd-nav-item-label { color: #c0570e; }

  @media (max-width: 700px) {
    .sd-stats { grid-template-columns: repeat(2,1fr); }
    .sd-quick-grid { grid-template-columns: repeat(2,1fr); }
    .sd-two-col { grid-template-columns: 1fr; }
  }
`;

const EMOJIS = ['👨‍💻', '👩‍🔬', '👨‍🏫', '👩‍💼', '🧑‍🔬', '👩‍🏫', '👨‍🎓', '👩‍🎓'];
const getEmoji = (name) => EMOJIS[(name || 'A').charCodeAt(0) % EMOJIS.length];

const generateDays = () => {
  const today = new Date();
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: d.getDate(),
    };
  });
};

const quickActions = [
  { icon: '🔍', label: 'Find Professor', path: '/student/find' },
  { icon: '📅', label: 'Book Meeting', path: '/student/request' },
  { icon: '🗺️', label: 'Campus Map', path: '/student/map' },
  { icon: '🤖', label: 'AI Assistant', path: '/student/ai' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const days = generateDays();
  const [activeDay, setActiveDay] = useState(0);
  const [userName, setUserName] = useState('there');
  const [userInitial, setUserInitial] = useState('?');
  const [activeNav, setActiveNav] = useState('home');
  const [aiQuery, setAiQuery] = useState('');
  const [professors, setProfessors] = useState([]);
  const [freeCount, setFreeCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      setUserName(name);
      setUserInitial(name.charAt(0).toUpperCase());
    }
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/professors`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfessors(data.slice(0, 4));
        setFreeCount(data.filter(p => (p.status || 'free') === 'free').length);
      }
    } catch (err) {
      console.log('Could not load professors');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sd-page">

        <div className="sd-nav">
          <span className="sd-nav-logo">find<span>oorr</span></span>
          <div className="sd-nav-right">
            <DarkModeToggle />
            <div className="sd-notif-btn" onClick={() => navigate('/student/notifications')}>
              🔔<div className="sd-notif-dot" />
            </div>
            <div className="sd-avatar">{userInitial}</div>
          </div>
        </div>

        <div className="sd-content">
          <div className="sd-greeting">
            <h1>hey, {userName} 👋</h1>
            <p>{new Date().toLocaleDateString('en-US', {weekday:'long', day:'numeric', month:'long', year:'numeric'})} · MIT Academy of Engineering</p>
          </div>

          <div className="sd-stats">
            {[
              { icon: '📅', color: 'blue', num: 0, label: 'Upcoming Meetings' },
              { icon: '✅', color: 'green', num: freeCount, label: 'Professors Available' },
              { icon: '⏳', color: 'orange', num: 0, label: 'Pending Requests' },
              { icon: '🔔', color: 'yellow', num: 0, label: 'New Notifications' },
            ].map(s => (
              <div className="sd-stat-card" key={s.label}>
                <div className={`sd-stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="sd-stat-num">{s.num}</div>
                  <div className="sd-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sd-section-title">🤖 AI assistant</div>
          <div className="sd-ai-bar">
            <div className="sd-ai-top">
              <div className="sd-ai-icon">🤖</div>
              <div>
                <div className="sd-ai-title">AI Assistant</div>
                <div className="sd-ai-sub">Ask me about schedules, locations, or policies</div>
              </div>
            </div>
            <div className="sd-ai-input-row">
              <input className="sd-ai-input" placeholder="e.g. Is my professor free this afternoon?" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => { if(e.key==='Enter') navigate('/student/ai'); }} />
              <button className="sd-ai-send" onClick={() => navigate('/student/ai')}>▶</button>
            </div>
            <div className="sd-ai-chips">
              {['📍 Where is my professor?','📅 Who is free today?','❓ How to request meeting?','📋 College schedule'].map(c => (
                <span key={c} className="sd-ai-chip" onClick={() => navigate('/student/ai')}>{c}</span>
              ))}
            </div>
          </div>

          <div className="sd-section-title">
            🗺️ campus map
            <span className="sd-view-all" onClick={() => navigate('/student/map')}>open full map →</span>
          </div>
          <div className="sd-mini-map" onClick={() => navigate('/student/map')}>
            <div className="sd-map-grid" />
            <div className="sd-map-building" style={{width:'80px',height:'50px',top:'20px',left:'40px'}} />
            <div className="sd-map-building" style={{width:'60px',height:'40px',top:'30px',right:'60px'}} />
            <div className="sd-map-building" style={{width:'50px',height:'35px',bottom:'20px',left:'120px'}} />
            <div className="sd-map-pin" style={{top:'18px',left:'60px'}}>📍</div>
            <div className="sd-map-pin" style={{top:'28px',right:'80px',animationDelay:'0.5s'}}>📍</div>
            <div className="sd-map-pin" style={{bottom:'10px',left:'140px',animationDelay:'1s'}}>📍</div>
            <div style={{position:'relative',zIndex:2,textAlign:'center'}}>
              <div className="sd-map-label">🗺️ MIT AOE Campus Map</div>
              <div className="sd-map-sublabel">{freeCount} professors available now</div>
            </div>
          </div>

          <div className="sd-section-title">✦ quick actions</div>
          <div className="sd-quick-grid">
            {quickActions.map(a => (
              <button key={a.label} className="sd-quick-btn" onClick={() => navigate(a.path)}>
                <span className="sd-quick-icon">{a.icon}</span>
                <span className="sd-quick-label">{a.label}</span>
              </button>
            ))}
          </div>

          <div className="sd-two-col">
            <div className="sd-card">
              <div className="sd-section-title">
                📅 upcoming meetings
                <span className="sd-view-all" onClick={() => navigate('/student/request')}>book one →</span>
              </div>
              <div className="sd-cal-strip">
                {days.map((d, i) => (
                  <div key={i} className={`sd-cal-day ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>
                    <div className="sd-cal-day-name">{d.name}</div>
                    <div className="sd-cal-day-num">{d.num}</div>
                  </div>
                ))}
              </div>
              <div className="sd-empty">📭 no meetings yet — book one!</div>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              <div className="sd-card">
                <div className="sd-section-title">
                  👨‍🏫 professor availability
                  <span className="sd-view-all" onClick={() => navigate('/student/find')}>view all →</span>
                </div>
                {professors.length === 0 ? (
                  <div className="sd-empty">no professors yet</div>
                ) : (
                  professors.map(p => (
                    <div className="sd-prof-item" key={p.id} onClick={() => navigate('/student/find')}>
                      <div className="sd-prof-av">{getEmoji(p.name)}</div>
                      <div>
                        <div className="sd-prof-name">{p.name}</div>
                        <div className="sd-prof-dept">{p.department || 'MIT AOE'}</div>
                      </div>
                      <span className={`sd-status-pill ${p.status || 'free'}`}>
                        {p.status === 'busy' ? 'In Class' : p.status === 'away' ? 'Away' : 'Available'}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="sd-card">
                <div className="sd-section-title">
                  🔔 notifications
                  <span className="sd-view-all" onClick={() => navigate('/student/notifications')}>view all</span>
                </div>
                <div className="sd-empty">🔕 no notifications yet</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sd-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/student/dashboard' },
            { id: 'find', icon: '🔍', label: 'find', path: '/student/find' },
            { id: 'map', icon: '🗺️', label: 'map', path: '/student/map' },
            { id: 'ai', icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { id: 'notif', icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.id} className={`sd-nav-item ${activeNav===n.id?'active':''}`} onClick={() => { setActiveNav(n.id); navigate(n.path); }}>
              <span className="sd-nav-item-icon">{n.icon}</span>
              <span className="sd-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}