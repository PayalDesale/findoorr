import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-page {
    min-height: 100vh;
    background-color: #f0f7f0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(120,160,120,0.15) 60px, rgba(120,160,120,0.15) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(120,160,120,0.1) 60px, rgba(120,160,120,0.1) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .lp-nav {
    background: #f8fff8; border-bottom: 2px solid #a8c9a8;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #a8c9a8;
  }
  .lp-back { width: 36px; height: 36px; background: #e8f5e9; border: 2px solid #a8c9a8; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0; }
  .lp-back:hover { background: #c8e6c9; transform: translateY(-1px); }
  .lp-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #1a3a1a; }

  .lp-content { max-width: 860px; margin: 0 auto; padding: 24px 20px; }

  .lp-card { background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 18px; padding: 22px; box-shadow: 4px 4px 0px #a8c9a8; margin-bottom: 16px; }
  .lp-card-title { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #1a3a1a; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  /* LIVE LOCATION CARD */
  .lp-location-hero {
    background: linear-gradient(135deg, #1a3a1a, #2e4a2e);
    border: 2px solid #1a3a1a; border-radius: 18px; padding: 24px;
    margin-bottom: 16px; box-shadow: 5px 5px 0px #2e7d32;
  }
  .lp-loc-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .lp-loc-icon { width: 52px; height: 52px; background: #2e7d32; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
  .lp-loc-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #f0f7f0; }
  .lp-loc-sub { font-size: 12px; color: rgba(240,247,240,0.6); margin-top: 2px; }
  .lp-loc-current { background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
  .lp-loc-pin { font-size: 24px; }
  .lp-loc-place { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #f0f7f0; }
  .lp-loc-updated { font-size: 11px; color: rgba(240,247,240,0.5); margin-top: 2px; }
  .lp-gps-toggle { display: flex; align-items: center; justify-content: space-between; }
  .lp-gps-label { font-size: 14px; font-weight: 600; color: rgba(240,247,240,0.8); }
  .lp-toggle { width: 52px; height: 28px; border-radius: 14px; border: 2px solid; cursor: pointer; transition: all 0.2s; position: relative; flex-shrink: 0; }
  .lp-toggle.on { background: #4caf50; border-color: #4caf50; }
  .lp-toggle.off { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); }
  .lp-toggle-knob { width: 20px; height: 20px; border-radius: 50%; background: #fff; position: absolute; top: 2px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
  .lp-toggle.on .lp-toggle-knob { left: 26px; }
  .lp-toggle.off .lp-toggle-knob { left: 2px; }

  /* MAP PREVIEW */
  .lp-map-preview {
    background: linear-gradient(135deg, #e8f4f8, #d4eaf0);
    border: 2px solid #b8d8e8; border-radius: 14px; height: 160px;
    position: relative; overflow: hidden; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .lp-map-grid {
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg,rgba(100,150,180,0.12) 0,rgba(100,150,180,0.12) 1px,transparent 1px,transparent 32px),
      repeating-linear-gradient(90deg,rgba(100,150,180,0.12) 0,rgba(100,150,180,0.12) 1px,transparent 1px,transparent 32px);
  }
  .lp-map-building { position: absolute; background: rgba(100,150,180,0.2); border: 1.5px solid rgba(100,150,180,0.35); border-radius: 4px; }
  .lp-map-you { position: absolute; font-size: 28px; z-index: 2; animation: lp-bounce 2s ease-in-out infinite; }
  @keyframes lp-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .lp-map-ring { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 2px solid rgba(76,175,80,0.4); animation: lp-ring 2s ease-out infinite; }
  @keyframes lp-ring { 0%{transform:scale(0.5);opacity:1} 100%{transform:scale(2);opacity:0} }
  .lp-map-label { position: relative; z-index: 2; text-align: center; }
  .lp-map-label-text { font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700; color: #2c6e8a; }

  /* TOGGLE ROW */
  .lp-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1.5px dashed #c8e6c8; }
  .lp-toggle-row:last-child { border-bottom: none; }
  .lp-toggle-info { flex: 1; }
  .lp-toggle-name { font-size: 14px; font-weight: 600; color: #1a3a1a; }
  .lp-toggle-desc { font-size: 11px; color: #6a9a6a; margin-top: 2px; }
  .lp-sm-toggle { width: 44px; height: 24px; border-radius: 12px; border: 2px solid; cursor: pointer; transition: all 0.2s; position: relative; flex-shrink: 0; }
  .lp-sm-toggle.on { background: #2e7d32; border-color: #2e7d32; }
  .lp-sm-toggle.off { background: #e0e0e0; border-color: #bdbdbd; }
  .lp-sm-knob { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 2px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .lp-sm-toggle.on .lp-sm-knob { left: 22px; }
  .lp-sm-toggle.off .lp-sm-knob { left: 2px; }

  /* VISIBILITY OPTIONS */
  .lp-visibility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 4px; }
  .lp-vis-option { padding: 14px; border-radius: 12px; border: 2px solid #c8e6c8; background: #f0f7f0; cursor: pointer; transition: all 0.15s; text-align: center; }
  .lp-vis-option:hover { border-color: #2e7d32; background: #e8f5e9; }
  .lp-vis-option.selected { border-color: #1a3a1a; background: #e8f5e9; box-shadow: 3px 3px 0px #2e7d32; }
  .lp-vis-icon { font-size: 24px; margin-bottom: 6px; }
  .lp-vis-label { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #1a3a1a; }
  .lp-vis-desc { font-size: 11px; color: #6a9a6a; margin-top: 2px; }

  /* QUIET HOURS */
  .lp-quiet-row { display: flex; align-items: center; gap: 12px; }
  .lp-quiet-input { flex: 1; padding: 10px 14px; background: #f0f7f0; border: 2px solid #c8e6c8; border-radius: 10px; font-size: 14px; color: #1a3a1a; font-family: 'DM Sans', sans-serif; outline: none; }
  .lp-quiet-input:focus { border-color: #2e7d32; }
  .lp-quiet-sep { font-size: 13px; color: #6a9a6a; font-weight: 600; }

  /* GEOFENCE */
  .lp-geofence-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1.5px dashed #c8e6c8; }
  .lp-geofence-item:last-child { border-bottom: none; }
  .lp-geofence-icon { font-size: 22px; }
  .lp-geofence-name { font-size: 13px; font-weight: 600; color: #1a3a1a; flex: 1; }
  .lp-geofence-sub { font-size: 11px; color: #6a9a6a; }
  .lp-geofence-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .lp-geofence-badge.active { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
  .lp-geofence-badge.inactive { background: #f5f5f5; color: #9e9e9e; border: 1px solid #e0e0e0; }

  /* SAVE BTN */
  .lp-save-btn { width: 100%; padding: 15px; background: #1a3a1a; border: 2px solid #1a3a1a; border-radius: 14px; color: #f0f7f0; font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; cursor: pointer; box-shadow: 4px 4px 0px #2e7d32; transition: all 0.15s; margin-bottom: 16px; }
  .lp-save-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #2e7d32; }

  /* BOTTOM NAV */
  .lp-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #f8fff8; border-top: 2px solid #a8c9a8; display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100; }
  .lp-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .lp-nav-item:hover { background: #e8f5e9; }
  .lp-nav-item-icon { font-size: 20px; }
  .lp-nav-item-label { font-size: 10px; font-weight: 600; color: #6a9a6a; }
  .lp-nav-item.active .lp-nav-item-label { color: #2e7d32; }

  @media (max-width: 600px) { .lp-visibility-grid { grid-template-columns: 1fr; } }
`;

const geofenceZones = [
  { icon: '🏫', name: 'CS Block', sub: 'Auto-marks you as available', active: true },
  { icon: '🤖', name: 'AI Lab — Block B', sub: 'Auto-marks you as in-class', active: true },
  { icon: '📚', name: 'Library', sub: 'Auto-marks you as away', active: false },
  { icon: '🍽️', name: 'Canteen', sub: 'Auto-marks you as on break', active: true },
  { icon: '🏛️', name: 'Admin Block', sub: 'Auto-marks you as in meeting', active: false },
];

const privacyToggles = [
  { name: 'Show location to students', desc: 'Students can see your current room on the map', on: true },
  { name: 'Show availability status', desc: 'Free / Busy / Away visible on your profile', on: true },
  { name: 'Allow meeting requests', desc: 'Students can send you meeting requests', on: true },
  { name: 'Show office hours publicly', desc: 'Office hours visible on your public profile', on: true },
  { name: 'Email notifications', desc: 'Get email for new meeting requests', on: false },
  { name: 'Push notifications', desc: 'Get push alerts on mobile', on: true },
];

const visibilityOptions = [
  { icon: '🌍', label: 'All Students', desc: 'Everyone can see you' },
  { icon: '📚', label: 'My Classes Only', desc: 'Only enrolled students' },
  { icon: '🔒', label: 'Nobody', desc: 'Hidden from everyone' },
  { icon: '⭐', label: 'Favorites Only', desc: 'Students you approved' },
];

export default function LocationPrivacy() {
  const navigate = useNavigate();
  const [gpsOn, setGpsOn] = useState(true);
  const [toggles, setToggles] = useState(privacyToggles);
  const [visibility, setVisibility] = useState(0);
  const [saved, setSaved] = useState(false);

  const flipToggle = (i) => setToggles(t => t.map((x, j) => j === i ? { ...x, on: !x.on } : x));

  return (
    <>
      <style>{styles}</style>
      <div className="lp-page">

        <div className="lp-nav">
          <div className="lp-back" onClick={() => navigate('/professor/dashboard')}>←</div>
          <span className="lp-nav-title">📍 location & privacy</span>
        </div>

        <div className="lp-content">

          {/* Live Location Hero */}
          <div className="lp-location-hero">
            <div className="lp-loc-top">
              <div className="lp-loc-icon">📍</div>
              <div>
                <div className="lp-loc-title">Live GPS Location</div>
                <div className="lp-loc-sub">Students see your real-time location on campus map</div>
              </div>
            </div>

            <div className="lp-loc-current">
              <span className="lp-loc-pin">📍</span>
              <div>
                <div className="lp-loc-place">Room 204, CS Block</div>
                <div className="lp-loc-updated">Last updated 1 min ago · On Campus</div>
              </div>
            </div>

            <div className="lp-gps-toggle">
              <span className="lp-gps-label">GPS Sharing {gpsOn ? '— ON' : '— OFF'}</span>
              <div className={`lp-toggle ${gpsOn ? 'on' : 'off'}`} onClick={() => setGpsOn(!gpsOn)}>
                <div className="lp-toggle-knob" />
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="lp-card">
            <div className="lp-card-title">🗺️ your position on campus map</div>
            <div className="lp-map-preview">
              <div className="lp-map-grid" />
              <div className="lp-map-building" style={{width:'100px',height:'60px',top:'20px',left:'30px'}} />
              <div className="lp-map-building" style={{width:'80px',height:'50px',top:'30px',right:'40px'}} />
              <div className="lp-map-ring" style={{top:'50%',left:'45%',transform:'translate(-50%,-50%)'}} />
              <div className="lp-map-you" style={{top:'50%',left:'45%',transform:'translate(-50%,-50%)'}}>📍</div>
            </div>
            <div style={{display:'flex',gap:'12px',fontSize:'12px',color:'#6a9a6a',fontWeight:'600'}}>
              <span>📍 Room 204</span>
              <span>·</span>
              <span>CS Block, Ground Floor</span>
              <span>·</span>
              <span style={{color:'#2e7d32'}}>✓ Visible to students</span>
            </div>
          </div>

          {/* Visibility */}
          <div className="lp-card">
            <div className="lp-card-title">👁️ who can see me?</div>
            <div className="lp-visibility-grid">
              {visibilityOptions.map((v, i) => (
                <div key={v.label} className={`lp-vis-option ${visibility === i ? 'selected' : ''}`} onClick={() => setVisibility(i)}>
                  <div className="lp-vis-icon">{v.icon}</div>
                  <div className="lp-vis-label">{v.label}</div>
                  <div className="lp-vis-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="lp-card">
            <div className="lp-card-title">🔒 privacy controls</div>
            {toggles.map((t, i) => (
              <div className="lp-toggle-row" key={t.name}>
                <div className="lp-toggle-info">
                  <div className="lp-toggle-name">{t.name}</div>
                  <div className="lp-toggle-desc">{t.desc}</div>
                </div>
                <div className={`lp-sm-toggle ${t.on ? 'on' : 'off'}`} onClick={() => flipToggle(i)}>
                  <div className="lp-sm-knob" />
                </div>
              </div>
            ))}
          </div>

          {/* Quiet Hours */}
          <div className="lp-card">
            <div className="lp-card-title">🌙 quiet hours</div>
            <p style={{fontSize:'13px',color:'#6a9a6a',marginBottom:'14px'}}>No notifications will be sent to students during these hours.</p>
            <div className="lp-quiet-row">
              <input className="lp-quiet-input" type="time" defaultValue="22:00" />
              <span className="lp-quiet-sep">to</span>
              <input className="lp-quiet-input" type="time" defaultValue="08:00" />
            </div>
          </div>

          {/* Geofence Zones */}
          <div className="lp-card">
            <div className="lp-card-title">📡 geofence zones</div>
            <p style={{fontSize:'13px',color:'#6a9a6a',marginBottom:'14px'}}>Auto-update your status when you enter these zones.</p>
            {geofenceZones.map(z => (
              <div className="lp-geofence-item" key={z.name}>
                <span className="lp-geofence-icon">{z.icon}</span>
                <div style={{flex:1}}>
                  <div className="lp-geofence-name">{z.name}</div>
                  <div className="lp-geofence-sub">{z.sub}</div>
                </div>
                <span className={`lp-geofence-badge ${z.active ? 'active' : 'inactive'}`}>
                  {z.active ? 'Active' : 'Off'}
                </span>
              </div>
            ))}
          </div>

          <button className="lp-save-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            {saved ? '✓ settings saved!' : 'save all settings →'}
          </button>

        </div>

        <div className="lp-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/professor/dashboard' },
            { id: 'avail', icon: '📅', label: 'schedule', path: '/professor/availability' },
            { id: 'req', icon: '📋', label: 'requests', path: '/professor/requests' },
            { id: 'attend', icon: '👥', label: 'attendance', path: '/professor/attendance' },
            { id: 'stats', icon: '📊', label: 'analytics', path: '/professor/analytics' },
          ].map(n => (
            <div key={n.id} className={`lp-nav-item ${n.id==='req'?'active':''}`} onClick={() => navigate(n.path)}>
              <span className="lp-nav-item-icon">{n.icon}</span>
              <span className="lp-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
