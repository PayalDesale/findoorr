import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .cm-back:hover { background: #e8dcc8; transform: translateY(-1px); }
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

  /* STATS ROW */
  .cm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
  .cm-stat {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 14px; display: flex; align-items: center; gap: 10px;
    box-shadow: 3px 3px 0px #c9b99a;
  }
  .cm-stat-icon { font-size: 22px; }
  .cm-stat-num { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #c0570e; line-height: 1; }
  .cm-stat-label { font-size: 10px; color: #9c8060; font-weight: 600; }

  /* FLOOR TABS */
  .cm-floor-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .cm-floor-tab {
    padding: 8px 18px; border-radius: 10px; border: 2px solid #c9b99a;
    background: #f0e8d8; color: #5c4033; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    box-shadow: 2px 2px 0px #c9b99a;
  }
  .cm-floor-tab.active {
    background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0;
    box-shadow: 2px 2px 0px #c0570e;
  }

  /* MAP AREA */
  .cm-map-wrap {
    background: #e8f4f8; border: 2px solid #b8d8e8; border-radius: 18px;
    overflow: hidden; margin-bottom: 20px; position: relative;
    box-shadow: 4px 4px 0px #b8d8e8;
  }
  .cm-map-inner {
    width: 100%; height: 420px; position: relative;
    background: linear-gradient(135deg, #e8f4f8, #ddeef5);
  }
  .cm-map-grid-bg {
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg,rgba(100,150,180,0.12) 0,rgba(100,150,180,0.12) 1px,transparent 1px,transparent 40px),
      repeating-linear-gradient(90deg,rgba(100,150,180,0.12) 0,rgba(100,150,180,0.12) 1px,transparent 1px,transparent 40px);
  }

  /* BUILDINGS */
  .cm-building {
    position: absolute; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 2px; cursor: pointer; transition: all 0.2s;
    border: 2px solid;
  }
  .cm-building:hover { transform: scale(1.05); z-index: 10; }
  .cm-building-label { font-size: 10px; font-weight: 700; text-align: center; line-height: 1.2; padding: 0 4px; }
  .cm-building-icon { font-size: 18px; }

  .cm-building.cs { background: rgba(197,168,121,0.4); border-color: rgba(160,130,90,0.6); color: #5c4033; }
  .cm-building.ai { background: rgba(144,202,249,0.4); border-color: rgba(100,160,210,0.6); color: #1a5276; }
  .cm-building.lib { background: rgba(165,214,167,0.4); border-color: rgba(100,170,110,0.6); color: #1b5e20; }
  .cm-building.admin { background: rgba(255,204,128,0.4); border-color: rgba(210,160,60,0.6); color: #7c4a00; }
  .cm-building.canteen { background: rgba(239,154,154,0.4); border-color: rgba(200,100,100,0.6); color: #7f1d1d; }
  .cm-building.lab { background: rgba(206,147,216,0.4); border-color: rgba(160,100,190,0.6); color: #4a148c; }
  .cm-building.sports { background: rgba(128,222,234,0.4); border-color: rgba(80,180,200,0.6); color: #006064; }
  .cm-building.parking { background: rgba(200,200,200,0.4); border-color: rgba(150,150,150,0.6); color: #424242; }

  /* PATHS */
  .cm-path {
    position: absolute; background: rgba(180,160,120,0.3);
    border-radius: 4px;
  }

  /* PROFESSOR PINS */
  .cm-pin {
    position: absolute; display: flex; flex-direction: column; align-items: center;
    cursor: pointer; z-index: 20; transition: all 0.2s;
  }
  .cm-pin:hover { transform: scale(1.15); z-index: 30; }
  .cm-pin-bubble {
    background: #3d2c1e; border: 2px solid #c0570e; border-radius: 12px;
    padding: 4px 8px; display: flex; align-items: center; gap: 4px;
    box-shadow: 2px 2px 0px #c0570e; white-space: nowrap;
  }
  .cm-pin-emoji { font-size: 14px; }
  .cm-pin-name { font-size: 10px; font-weight: 700; color: #f5efe0; }
  .cm-pin-tail {
    width: 0; height: 0;
    border-left: 6px solid transparent; border-right: 6px solid transparent;
    border-top: 8px solid #3d2c1e;
  }
  .cm-pin-dot {
    width: 10px; height: 10px; border-radius: 50%; background: #c0570e;
    border: 2px solid #fff; margin-top: -3px;
    animation: cm-pulse 1.5s ease-in-out infinite;
  }

  /* LEGEND */
  .cm-legend {
    position: absolute; bottom: 12px; left: 12px;
    background: rgba(255,253,245,0.92); border: 1.5px solid #c9b99a;
    border-radius: 12px; padding: 10px 14px; backdrop-filter: blur(8px);
  }
  .cm-legend-title { font-family: 'Caveat', cursive; font-size: 14px; font-weight: 700; color: #3d2c1e; margin-bottom: 6px; }
  .cm-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #5c4033; margin-bottom: 3px; }
  .cm-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ZOOM CONTROLS */
  .cm-zoom {
    position: absolute; top: 12px; right: 12px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .cm-zoom-btn {
    width: 32px; height: 32px; background: #fffdf5; border: 2px solid #c9b99a;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; font-weight: 700; color: #3d2c1e;
    transition: all 0.15s; box-shadow: 2px 2px 0px #c9b99a;
  }
  .cm-zoom-btn:hover { background: #f0e8d8; }

  /* PROFESSOR LIST */
  .cm-section-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700;
    color: #5c4033; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
  }
  .cm-view-all { font-size: 13px; color: #c0570e; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; text-decoration: underline; text-decoration-style: wavy; }

  .cm-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

  .cm-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 18px;
    padding: 20px; box-shadow: 4px 4px 0px #c9b99a;
  }

  .cm-prof-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 8px;
    border-bottom: 1.5px dashed #e0d0b8; border-radius: 10px; cursor: pointer; transition: background 0.15s;
  }
  .cm-prof-item:last-child { border-bottom: none; }
  .cm-prof-item:hover { background: #faf3e0; }
  .cm-prof-av {
    width: 42px; height: 42px; border-radius: 12px; background: #3d2c1e;
    border: 2px solid #c9b99a; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .cm-prof-name { font-size: 13px; font-weight: 600; color: #3d2c1e; }
  .cm-prof-loc { font-size: 11px; color: #9c8060; margin-top: 2px; }
  .cm-prof-status {
    margin-left: auto; font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px; flex-shrink: 0;
  }
  .cm-prof-status.free { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .cm-prof-status.busy { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }
  .cm-prof-status.away { background: #fff8e1; color: #e65100; border: 1px solid #ffe082; }

  /* BUILDING LIST */
  .cm-building-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 8px;
    border-bottom: 1.5px dashed #e0d0b8; cursor: pointer; transition: background 0.15s; border-radius: 8px;
  }
  .cm-building-item:last-child { border-bottom: none; }
  .cm-building-item:hover { background: #faf3e0; }
  .cm-building-color { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
  .cm-building-name { font-size: 13px; font-weight: 600; color: #3d2c1e; flex: 1; }
  .cm-building-count { font-size: 11px; color: #9c8060; }

  /* SEARCH BAR */
  .cm-search-wrap { position: relative; margin-bottom: 16px; }
  .cm-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; }
  .cm-search {
    width: 100%; padding: 12px 14px 12px 42px;
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 12px;
    font-size: 14px; color: #3d2c1e; outline: none; box-shadow: 3px 3px 0px #c9b99a;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .cm-search::placeholder { color: #bfaa90; }
  .cm-search:focus { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; }

  /* TOOLTIP */
  .cm-tooltip {
    position: absolute; background: #fffdf5; border: 2px solid #c9b99a;
    border-radius: 14px; padding: 14px; box-shadow: 4px 4px 0px #c9b99a;
    z-index: 50; min-width: 200px; top: 20px; left: 50%; transform: translateX(-50%);
  }
  .cm-tooltip-name { font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700; color: #3d2c1e; }
  .cm-tooltip-dept { font-size: 12px; color: #9c8060; margin: 2px 0 8px; }
  .cm-tooltip-btn {
    width: 100%; padding: 8px; background: #3d2c1e; border: none; border-radius: 8px;
    color: #f5efe0; font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'Caveat', cursive; font-size: 16px; box-shadow: 2px 2px 0px #c0570e;
  }

  /* BOTTOM NAV */
  .cm-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .cm-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s;
  }
  .cm-nav-item:hover { background: #f0e8d8; }
  .cm-nav-item-icon { font-size: 20px; }
  .cm-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .cm-nav-item.active .cm-nav-item-label { color: #c0570e; }

  @media (max-width: 700px) {
    .cm-stats { grid-template-columns: repeat(2,1fr); }
    .cm-two-col { grid-template-columns: 1fr; }
    .cm-map-inner { height: 300px; }
  }
`;

const professors = [
  { emoji: '👨‍💻', name: 'Dr. R. Sharma', dept: 'CS', loc: 'Room 204, CS Block', status: 'free', x: '22%', y: '28%' },
  { emoji: '👩‍🔬', name: 'Prof. A. Kulkarni', dept: 'AI', loc: 'AI Lab, Room 301', status: 'busy', x: '58%', y: '22%' },
  { emoji: '👨‍🏫', name: 'Dr. V. Mehta', dept: 'DBMS', loc: 'Faculty Lounge', status: 'away', x: '72%', y: '55%' },
  { emoji: '👩‍💼', name: 'Prof. S. Desai', dept: 'SE', loc: 'Room 112, SE Block', status: 'free', x: '38%', y: '62%' },
  { emoji: '🧑‍🔬', name: 'Dr. P. Joshi', dept: 'Networks', loc: 'Room 209, CS Block', status: 'free', x: '18%', y: '58%' },
];

const buildings = [
  { name: 'CS Block', color: '#c5a879', count: '2 profs', icon: '💻', x: '12%', y: '18%', w: '140px', h: '90px', type: 'cs' },
  { name: 'AI Lab', color: '#90caf9', count: '1 prof', icon: '🤖', x: '48%', y: '12%', w: '120px', h: '80px', type: 'ai' },
  { name: 'Library', color: '#a5d6a7', count: '0 profs', icon: '📚', x: '72%', y: '10%', w: '100px', h: '70px', type: 'lib' },
  { name: 'Admin Block', color: '#ffcc80', count: '0 profs', icon: '🏛️', x: '62%', y: '42%', w: '110px', h: '80px', type: 'admin' },
  { name: 'SE Block', color: '#ef9a9a', count: '1 prof', icon: '⚙️', x: '28%', y: '50%', w: '120px', h: '80px', type: 'canteen' },
  { name: 'Networks Lab', color: '#ce93d8', count: '1 prof', icon: '🌐', x: '8%', y: '46%', w: '110px', h: '75px', type: 'lab' },
  { name: 'Canteen', color: '#80deea', count: '—', icon: '🍽️', x: '44%', y: '72%', w: '100px', h: '60px', type: 'sports' },
  { name: 'Parking', color: '#c8c8c8', count: '—', icon: '🅿️', x: '76%', y: '74%', w: '90px', h: '55px', type: 'parking' },
];

export default function CampusMap() {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState(0);
  const [activeNav, setActiveNav] = useState('map');
  const [selectedPin, setSelectedPin] = useState(null);
  const [search, setSearch] = useState('');

  const floors = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];

  const filtered = professors.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.dept.toLowerCase().includes(search.toLowerCase()) ||
    p.loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="cm-page">

        {/* Nav */}
        <div className="cm-nav">
          <div className="cm-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <span className="cm-nav-title">🗺️ campus map</span>
          <div className="cm-live-badge">
            <div className="cm-live-dot" /> LIVE
          </div>
        </div>

        <div className="cm-content">

          {/* Stats */}
          <div className="cm-stats">
            {[
              { icon: '👨‍🏫', num: 5, label: 'On Campus' },
              { icon: '🟢', num: 3, label: 'Available Now' },
              { icon: '🏫', num: 8, label: 'Buildings' },
              { icon: '📍', num: 12, label: 'Tracked Rooms' },
            ].map(s => (
              <div className="cm-stat" key={s.label}>
                <div className="cm-stat-icon">{s.icon}</div>
                <div>
                  <div className="cm-stat-num">{s.num}</div>
                  <div className="cm-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="cm-search-wrap">
            <span className="cm-search-icon">🔍</span>
            <input className="cm-search" placeholder="search professor or building..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Floor Tabs */}
          <div className="cm-floor-tabs">
            {floors.map((f, i) => (
              <button key={f} className={`cm-floor-tab ${activeFloor === i ? 'active' : ''}`} onClick={() => setActiveFloor(i)}>{f}</button>
            ))}
          </div>

          {/* Map */}
          <div className="cm-map-wrap">
            <div className="cm-map-inner" onClick={() => setSelectedPin(null)}>
              <div className="cm-map-grid-bg" />

              {/* Paths */}
              <div className="cm-path" style={{width:'2px',height:'60%',left:'50%',top:'20%'}} />
              <div className="cm-path" style={{width:'70%',height:'2px',left:'15%',top:'50%'}} />
              <div className="cm-path" style={{width:'40%',height:'2px',left:'10%',top:'70%'}} />

              {/* Buildings */}
              {buildings.map(b => (
                <div key={b.name} className={`cm-building ${b.type}`}
                  style={{left:b.x, top:b.y, width:b.w, height:b.h}}>
                  <div className="cm-building-icon">{b.icon}</div>
                  <div className="cm-building-label">{b.name}</div>
                </div>
              ))}

              {/* Professor Pins */}
              {professors.map((p, i) => (
                <div key={p.name} className="cm-pin" style={{left:p.x, top:p.y}}
                  onClick={e => { e.stopPropagation(); setSelectedPin(selectedPin === i ? null : i); }}>
                  <div className="cm-pin-bubble">
                    <span className="cm-pin-emoji">{p.emoji}</span>
                    <span className="cm-pin-name">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                  </div>
                  <div className="cm-pin-tail" />
                  <div className="cm-pin-dot" />
                  {selectedPin === i && (
                    <div className="cm-tooltip">
                      <div className="cm-tooltip-name">{p.name}</div>
                      <div className="cm-tooltip-dept">{p.dept} · {p.loc}</div>
                      <button className="cm-tooltip-btn" onClick={() => navigate('/student/request')}>book meeting →</button>
                    </div>
                  )}
                </div>
              ))}

              {/* Legend */}
              <div className="cm-legend">
                <div className="cm-legend-title">legend</div>
                <div className="cm-legend-item"><div className="cm-legend-dot" style={{background:'#4caf50'}} /> available</div>
                <div className="cm-legend-item"><div className="cm-legend-dot" style={{background:'#f44336'}} /> in class</div>
                <div className="cm-legend-item"><div className="cm-legend-dot" style={{background:'#ff9800'}} /> away</div>
              </div>

              {/* Zoom */}
              <div className="cm-zoom">
                <div className="cm-zoom-btn">+</div>
                <div className="cm-zoom-btn">−</div>
                <div className="cm-zoom-btn" style={{fontSize:'12px'}}>⌖</div>
              </div>
            </div>
          </div>

          {/* Prof List + Building Directory */}
          <div className="cm-two-col">

            {/* Professors on Campus */}
            <div className="cm-card">
              <div className="cm-section-title">
                📍 professors on campus
                <span className="cm-view-all" onClick={() => navigate('/student/find')}>view all →</span>
              </div>
              {filtered.map(p => (
                <div className="cm-prof-item" key={p.name} onClick={() => navigate('/student/professor/1')}>
                  <div className="cm-prof-av">{p.emoji}</div>
                  <div>
                    <div className="cm-prof-name">{p.name}</div>
                    <div className="cm-prof-loc">📍 {p.loc}</div>
                  </div>
                  <span className={`cm-prof-status ${p.status}`}>
                    {p.status === 'free' ? 'Available' : p.status === 'busy' ? 'In Class' : 'Away'}
                  </span>
                </div>
              ))}
            </div>

            {/* Building Directory */}
            <div className="cm-card">
              <div className="cm-section-title">🏫 building directory</div>
              {buildings.map(b => (
                <div className="cm-building-item" key={b.name}>
                  <div className="cm-building-color" style={{background:b.color}} />
                  <span style={{fontSize:'16px'}}>{b.icon}</span>
                  <div className="cm-building-name">{b.name}</div>
                  <div className="cm-building-count">{b.count}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Nav */}
        <div className="cm-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/student/dashboard' },
            { id: 'find', icon: '🔍', label: 'find', path: '/student/find' },
            { id: 'map', icon: '🗺️', label: 'map', path: '/student/map' },
            { id: 'ai', icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { id: 'notif', icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.id} className={`cm-nav-item ${activeNav===n.id?'active':''}`}
              onClick={() => { setActiveNav(n.id); navigate(n.path); }}>
              <span className="cm-nav-item-icon">{n.icon}</span>
              <span className="cm-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}