import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

// Fixed building positions on the SVG map
const BUILDINGS = [
  { id: 'cs', name: 'CS Block', x: 180, y: 120, w: 120, h: 70, color: '#e8d5b0' },
  { id: 'it', name: 'IT Block', x: 340, y: 120, w: 120, h: 70, color: '#d5e8d4' },
  { id: 'mech', name: 'Mech Block', x: 180, y: 230, w: 120, h: 70, color: '#d4d5e8' },
  { id: 'civil', name: 'Civil Block', x: 340, y: 230, w: 120, h: 70, color: '#e8d4d4' },
  { id: 'admin', name: 'Admin Block', x: 500, y: 175, w: 110, h: 70, color: '#e8e4d0' },
  { id: 'library', name: 'Library', x: 60, y: 175, w: 90, h: 70, color: '#d0e8e4' },
];

// Assign buildings to professors based on department
const getDeptBuilding = (dept) => {
  if (!dept) return BUILDINGS[0];
  const d = dept.toLowerCase();
  if (d.includes('computer') || d.includes('cs')) return BUILDINGS[0];
  if (d.includes('it') || d.includes('information')) return BUILDINGS[1];
  if (d.includes('mech')) return BUILDINGS[2];
  if (d.includes('civil')) return BUILDINGS[3];
  return BUILDINGS[0];
};

// Give each professor a slightly different pin position within their building
const getPinPos = (building, index) => ({
  x: building.x + 20 + (index % 3) * 30,
  y: building.y + 20 + Math.floor(index / 3) * 20,
});

const STATUS_COLOR = {
  free: '#4caf50',
  busy: '#f44336',
  'in-class': '#ff9800',
  offline: '#9e9e9e',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cm-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .cm-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .cm-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s;
  }
  .cm-back:hover { background: #e8dcc8; }
  .cm-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; flex: 1; }
  .cm-live-badge {
    display: flex; align-items: center; gap: 6px; background: #e8f5e9;
    border: 1.5px solid #a5d6a7; border-radius: 20px; padding: 4px 12px;
    font-size: 12px; font-weight: 700; color: #388e3c;
  }
  .cm-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #4caf50;
    animation: cm-pulse 1.5s ease-in-out infinite;
  }
  @keyframes cm-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .cm-content { max-width: 960px; margin: 0 auto; padding: 20px; }

  .cm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
  .cm-stat {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 14px; display: flex; align-items: center; gap: 10px;
    box-shadow: 3px 3px 0px #c9b99a;
  }
  .cm-stat-icon { font-size: 22px; }
  .cm-stat-info { flex: 1; }
  .cm-stat-val { font-family: 'Caveat', cursive; font-size: 26px; font-weight: 700; color: #3d2c1e; line-height: 1; }
  .cm-stat-label { font-size: 11px; color: #9c8060; font-weight: 600; }

  .cm-map-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 20px;
    padding: 20px; box-shadow: 5px 5px 0px #c9b99a; margin-bottom: 20px;
  }
  .cm-map-title { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #3d2c1e; margin-bottom: 16px; }

  .cm-svg-wrap { width: 100%; overflow-x: auto; border: 2px solid #e0d0b8; border-radius: 14px; background: #f9f4e8; }

  .cm-legend { display: flex; gap: 16px; margin-top: 14px; flex-wrap: wrap; }
  .cm-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #5c4033; }
  .cm-legend-dot { width: 10px; height: 10px; border-radius: 50%; }

  .cm-profs { margin-top: 20px; }
  .cm-profs-title { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #3d2c1e; margin-bottom: 14px; }
  .cm-prof-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cm-prof-card {
    background: #fffdf5; border: 2px solid #d6c5a8; border-radius: 14px;
    padding: 14px; display: flex; align-items: center; gap: 12px;
    box-shadow: 3px 3px 0px #c9b99a; cursor: pointer; transition: all 0.15s;
  }
  .cm-prof-card:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px #c0570e; border-color: #c0570e; }
  .cm-prof-card.selected { border-color: #c0570e; background: #fff8f0; box-shadow: 4px 4px 0px #c0570e; }
  .cm-prof-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid #c9b99a; display: flex; align-items: center; justify-content: center; font-size: 22px; background: #f0e8d8; flex-shrink: 0; }
  .cm-prof-name { font-weight: 700; font-size: 14px; color: #3d2c1e; }
  .cm-prof-dept { font-size: 11px; color: #9c8060; margin-top: 2px; }
  .cm-prof-status {
    margin-left: auto; font-size: 10px; font-weight: 700; padding: 4px 10px;
    border-radius: 20px; flex-shrink: 0;
  }
  .cm-prof-status.free { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .cm-prof-status.busy { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }
  .cm-prof-status.offline { background: #f5f5f5; color: #757575; border: 1px solid #e0e0e0; }

  .cm-popup {
    position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%);
    background: #fffdf5; border: 2px solid #c0570e; border-radius: 16px;
    padding: 16px 20px; box-shadow: 4px 4px 0px #c0570e; z-index: 200;
    min-width: 280px; max-width: 340px;
  }
  .cm-popup-name { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #3d2c1e; }
  .cm-popup-dept { font-size: 12px; color: #9c8060; margin-bottom: 10px; }
  .cm-popup-building { font-size: 13px; font-weight: 600; color: #5c4033; margin-bottom: 12px; }
  .cm-popup-btn {
    width: 100%; padding: 10px; background: #3d2c1e; border: none; border-radius: 10px;
    color: #f5efe0; font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700;
    cursor: pointer; box-shadow: 2px 2px 0px #c0570e;
  }
  .cm-popup-close {
    position: absolute; top: 10px; right: 12px; background: none; border: none;
    font-size: 18px; cursor: pointer; color: #9c8060;
  }

  .cm-empty { text-align: center; padding: 30px; color: #9c8060; font-family: 'Caveat', cursive; font-size: 18px; }

  .cm-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .cm-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; }
  .cm-nav-item:hover { background: #f0e8d8; }
  .cm-nav-icon { font-size: 20px; }
  .cm-nav-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .cm-nav-item.active .cm-nav-label { color: #c0570e; }
`;

const EMOJIS = ['👨‍💻','👩‍🔬','👨‍🏫','👩‍💼','🧑‍🔬','👩‍🏫','👨‍🎓','👩‍🎓'];
const getEmoji = (name) => EMOJIS[(name||'A').charCodeAt(0) % EMOJIS.length];

export default function CampusMap() {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchProfessors();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchProfessors, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/professors`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfessors(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.log('Could not load professors');
    } finally {
      setLoading(false);
    }
  };

  const freeCount = professors.filter(p => p.status === 'free').length;
  const busyCount = professors.filter(p => p.status !== 'free').length;

  // Build professor pins for SVG
  const profPins = professors.map((p, i) => {
    const building = getDeptBuilding(p.department);
    const pos = getPinPos(building, i);
    return { ...p, pinX: pos.x, pinY: pos.y, building };
  });

  return (
    <>
      <style>{styles}</style>
      <div className="cm-page">
        <div className="cm-nav">
          <div className="cm-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <span className="cm-nav-title">🗺️ campus map</span>
          <div className="cm-live-badge">
            <div className="cm-live-dot" />
            LIVE
          </div>
        </div>

        <div className="cm-content">
          {/* Stats */}
          <div className="cm-stats">
            {[
              { icon: '👨‍🏫', val: professors.length, label: 'Total Professors' },
              { icon: '✅', val: freeCount, label: 'Available Now' },
              { icon: '🔴', val: busyCount, label: 'Busy / In Class' },
              { icon: '🕐', val: lastUpdated.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), label: 'Last Updated' },
            ].map(s => (
              <div className="cm-stat" key={s.label}>
                <span className="cm-stat-icon">{s.icon}</span>
                <div className="cm-stat-info">
                  <div className="cm-stat-val">{s.val}</div>
                  <div className="cm-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Campus Map */}
          <div className="cm-map-card">
            <div className="cm-map-title">📍 MIT Academy of Engineering, Pune</div>
            <div className="cm-svg-wrap">
              <svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',minWidth:'500px'}}>
                {/* Campus ground */}
                <rect x="10" y="10" width="660" height="340" rx="12" fill="#f0e8d0" stroke="#c9b99a" strokeWidth="2"/>

                {/* Roads */}
                <line x1="10" y1="195" x2="670" y2="195" stroke="#d4c4a0" strokeWidth="12"/>
                <line x1="310" y1="10" x2="310" y2="350" stroke="#d4c4a0" strokeWidth="12"/>

                {/* Gate */}
                <rect x="295" y="330" width="30" height="20" rx="3" fill="#8B6914" stroke="#5c4033" strokeWidth="2"/>
                <text x="310" y="345" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">GATE</text>

                {/* Buildings */}
                {BUILDINGS.map(b => (
                  <g key={b.id}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={b.color} stroke="#c9b99a" strokeWidth="2"/>
                    <text x={b.x + b.w/2} y={b.y + b.h/2 - 6} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3d2c1e">{b.name}</text>
                    <text x={b.x + b.w/2} y={b.y + b.h/2 + 8} textAnchor="middle" fontSize="9" fill="#7c6050">MIT AOE</text>
                  </g>
                ))}

                {/* Trees */}
                {[[50,50],[600,50],[50,300],[600,300],[155,195],[465,195]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="14" fill="#a5d6a7" stroke="#66bb6a" strokeWidth="1.5"/>
                    <line x1={x} y1={y+14} x2={x} y2={y+22} stroke="#795548" strokeWidth="2"/>
                  </g>
                ))}

                {/* Professor pins */}
                {profPins.map((p) => (
                  <g key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{cursor:'pointer'}}>
                    <circle cx={p.pinX} cy={p.pinY} r="12" fill={STATUS_COLOR[p.status] || '#4caf50'} stroke="#fff" strokeWidth="2" opacity="0.9"/>
                    <text x={p.pinX} y={p.pinY+5} textAnchor="middle" fontSize="10">{getEmoji(p.name)}</text>
                    {/* Pulse animation for free professors */}
                    {p.status === 'free' && (
                      <circle cx={p.pinX} cy={p.pinY} r="16" fill="none" stroke="#4caf50" strokeWidth="1.5" opacity="0.5">
                        <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    )}
                  </g>
                ))}

                {/* Compass */}
                <g transform="translate(630,40)">
                  <circle cx="0" cy="0" r="20" fill="#fffdf5" stroke="#c9b99a" strokeWidth="1.5"/>
                  <text x="0" y="-8" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#c0570e">N</text>
                  <text x="0" y="13" textAnchor="middle" fontSize="7" fill="#9c8060">S</text>
                  <text x="-12" y="3" textAnchor="middle" fontSize="7" fill="#9c8060">W</text>
                  <text x="12" y="3" textAnchor="middle" fontSize="7" fill="#9c8060">E</text>
                </g>
              </svg>
            </div>

            {/* Legend */}
            <div className="cm-legend">
              {[
                { color: '#4caf50', label: 'Free / Available' },
                { color: '#f44336', label: 'Busy' },
                { color: '#ff9800', label: 'In Class' },
                { color: '#9e9e9e', label: 'Offline' },
              ].map(l => (
                <div className="cm-legend-item" key={l.label}>
                  <div className="cm-legend-dot" style={{background: l.color}}/>
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Professor list */}
          <div className="cm-profs">
            <div className="cm-profs-title">👨‍🏫 Professors on Campus</div>
            {loading ? (
              <div className="cm-empty">Loading professors...</div>
            ) : professors.length === 0 ? (
              <div className="cm-empty">😕 No professors registered yet!</div>
            ) : (
              <div className="cm-prof-list">
                {professors.map(p => (
                  <div key={p.id}
                    className={`cm-prof-card ${selected?.id === p.id ? 'selected' : ''}`}
                    onClick={() => setSelected(selected?.id === p.id ? null : p)}>
                    <div className="cm-prof-avatar">{getEmoji(p.name)}</div>
                    <div>
                      <div className="cm-prof-name">{p.name}</div>
                      <div className="cm-prof-dept">{p.department || 'MIT AOE'}</div>
                    </div>
                    <span className={`cm-prof-status ${p.status || 'free'}`}>
                      {p.status === 'free' ? '✅ Free' : p.status === 'busy' ? '🔴 Busy' : '⚫ Offline'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popup when professor pin clicked */}
        {selected && (
          <div className="cm-popup">
            <button className="cm-popup-close" onClick={() => setSelected(null)}>✕</button>
            <div className="cm-popup-name">{getEmoji(selected.name)} {selected.name}</div>
            <div className="cm-popup-dept">{selected.department || 'MIT AOE'}</div>
            <div className="cm-popup-building">
              📍 {getDeptBuilding(selected.department).name}
              &nbsp;·&nbsp;
              <span style={{color: STATUS_COLOR[selected.status] || '#4caf50', fontWeight:700}}>
                {selected.status === 'free' ? '✅ Available' : '🔴 Busy'}
              </span>
            </div>
            <button className="cm-popup-btn" onClick={() => navigate('/student/request')}>
              📅 Request Meeting →
            </button>
          </div>
        )}

        <div className="cm-bottom-nav">
          {[
            { icon: '🏠', label: 'home', path: '/student/dashboard' },
            { icon: '🔍', label: 'find', path: '/student/find' },
            { icon: '🗺️', label: 'map', path: '/student/map', active: true },
            { icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.label} className={`cm-nav-item ${n.active ? 'active' : ''}`} onClick={() => navigate(n.path)}>
              <span className="cm-nav-icon">{n.icon}</span>
              <span className="cm-nav-label">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}