import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ma-page {
    min-height: 100vh;
    background-color: #f0f7f0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(120,160,120,0.15) 60px, rgba(120,160,120,0.15) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(120,160,120,0.1) 60px, rgba(120,160,120,0.1) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .ma-nav {
    background: #f8fff8; border-bottom: 2px solid #a8c9a8;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #a8c9a8;
  }
  .ma-back { width: 36px; height: 36px; background: #e8f5e9; border: 2px solid #a8c9a8; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0; }
  .ma-back:hover { background: #c8e6c9; transform: translateY(-1px); }
  .ma-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #1a3a1a; flex: 1; }
  .ma-save-btn { padding: 8px 20px; background: #2e7d32; border: 2px solid #2e7d32; border-radius: 10px; color: #fff; font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 2px 2px 0px rgba(0,0,0,0.2); transition: all 0.15s; }
  .ma-save-btn:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0px rgba(0,0,0,0.2); }

  .ma-content { max-width: 960px; margin: 0 auto; padding: 24px 20px; }

  /* WEEK NAV */
  .ma-week-nav {
    background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 16px;
    padding: 14px 18px; margin-bottom: 20px; box-shadow: 3px 3px 0px #a8c9a8;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ma-week-btn { width: 34px; height: 34px; background: #e8f5e9; border: 2px solid #a8c9a8; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; transition: all 0.15s; }
  .ma-week-btn:hover { background: #c8e6c9; }
  .ma-week-label { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #1a3a1a; }

  /* DAY TABS */
  .ma-day-tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; }
  .ma-day-tab {
    min-width: 80px; padding: 10px 8px; border-radius: 12px; text-align: center;
    border: 2px solid #c8e6c8; background: #f0f7f0; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .ma-day-tab.active { background: #1a3a1a; border-color: #1a3a1a; box-shadow: 2px 2px 0px #2e7d32; }
  .ma-day-tab-name { font-size: 10px; font-weight: 700; color: #6a9a6a; text-transform: uppercase; }
  .ma-day-tab.active .ma-day-tab-name { color: #c8e6c8; }
  .ma-day-tab-num { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: #1a3a1a; }
  .ma-day-tab.active .ma-day-tab-num { color: #fff; }
  .ma-day-tab-dot { width: 5px; height: 5px; border-radius: 50%; background: #2e7d32; margin: 3px auto 0; }
  .ma-day-tab.active .ma-day-tab-dot { background: #a5d6a7; }

  /* TWO COL */
  .ma-two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
  .ma-card { background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 18px; padding: 20px; box-shadow: 4px 4px 0px #a8c9a8; margin-bottom: 16px; }
  .ma-card-title { font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700; color: #1a3a1a; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
  .ma-add-btn { font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 8px; background: #e8f5e9; border: 2px solid #a5d6a7; color: #2e7d32; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .ma-add-btn:hover { background: #c8e6c9; }

  /* TIME BLOCKS */
  .ma-timeline { position: relative; padding-left: 52px; }
  .ma-time-label { position: absolute; left: 0; font-family: 'Caveat', cursive; font-size: 14px; font-weight: 700; color: #6a9a6a; width: 46px; text-align: right; }
  .ma-time-line { position: absolute; left: 52px; right: 0; height: 1px; background: #d8ead8; }
  .ma-block {
    position: relative; border-radius: 10px; padding: 8px 12px; margin-bottom: 4px;
    border: 2px solid; cursor: pointer; transition: all 0.15s; margin-left: 0;
  }
  .ma-block:hover { transform: translateX(2px); }
  .ma-block.class { background: #e8f0fe; border-color: #9fa8da; }
  .ma-block.free { background: #e8f5e9; border-color: #a5d6a7; }
  .ma-block.blocked { background: #fde8e8; border-color: #ef9a9a; }
  .ma-block.meeting { background: #fff8e1; border-color: #ffe082; }
  .ma-block-title { font-size: 13px; font-weight: 700; color: #1a3a1a; }
  .ma-block-sub { font-size: 11px; color: #6a9a6a; margin-top: 2px; }
  .ma-block-time { font-family: 'Caveat', cursive; font-size: 12px; font-weight: 700; }
  .ma-block.class .ma-block-time { color: #3949ab; }
  .ma-block.free .ma-block-time { color: #2e7d32; }
  .ma-block.blocked .ma-block-time { color: #c62828; }
  .ma-block.meeting .ma-block-time { color: #f57f17; }

  /* SLOT ROWS for right panel */
  .ma-slot-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1.5px dashed #c8e6c8; }
  .ma-slot-row:last-child { border-bottom: none; }
  .ma-slot-time-pill { background: #e8f5e9; border: 1.5px solid #a5d6a7; border-radius: 8px; padding: 5px 10px; font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700; color: #2e7d32; white-space: nowrap; }
  .ma-slot-label { flex: 1; font-size: 13px; font-weight: 600; color: #1a3a1a; }
  .ma-slot-toggle { width: 42px; height: 24px; border-radius: 12px; border: 2px solid; cursor: pointer; transition: all 0.2s; position: relative; flex-shrink: 0; }
  .ma-slot-toggle.on { background: #2e7d32; border-color: #2e7d32; }
  .ma-slot-toggle.off { background: #e0e0e0; border-color: #bdbdbd; }
  .ma-slot-knob { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 2px; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .ma-slot-toggle.on .ma-slot-knob { left: 20px; }
  .ma-slot-toggle.off .ma-slot-knob { left: 2px; }

  /* OFFICE HOURS EDITOR */
  .ma-oh-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1.5px dashed #c8e6c8; }
  .ma-oh-row:last-child { border-bottom: none; }
  .ma-oh-day { font-size: 13px; font-weight: 700; color: #1a3a1a; min-width: 80px; }
  .ma-oh-input { padding: 6px 10px; background: #f0f7f0; border: 1.5px solid #c8e6c8; border-radius: 8px; font-size: 13px; color: #1a3a1a; font-family: 'DM Sans', sans-serif; outline: none; width: 100px; }
  .ma-oh-input:focus { border-color: #2e7d32; }
  .ma-oh-sep { color: #6a9a6a; font-size: 12px; }

  /* LEGEND */
  .ma-legend { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  .ma-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #2e4a2e; font-weight: 600; }
  .ma-legend-dot { width: 12px; height: 12px; border-radius: 3px; }
  .ma-legend-dot.class { background: #9fa8da; }
  .ma-legend-dot.free { background: #a5d6a7; }
  .ma-legend-dot.blocked { background: #ef9a9a; }
  .ma-legend-dot.meeting { background: #ffe082; }

  /* BOTTOM NAV */
  .ma-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #f8fff8; border-top: 2px solid #a8c9a8; display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100; }
  .ma-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .ma-nav-item:hover { background: #e8f5e9; }
  .ma-nav-item-icon { font-size: 20px; }
  .ma-nav-item-label { font-size: 10px; font-weight: 600; color: #6a9a6a; }
  .ma-nav-item.active .ma-nav-item-label { color: #2e7d32; }

  @media (max-width: 700px) { .ma-two-col { grid-template-columns: 1fr; } }
`;

const days = [
  { name: 'MON', num: 19, dot: true },
  { name: 'TUE', num: 20, dot: true },
  { name: 'WED', num: 21, dot: false },
  { name: 'THU', num: 22, dot: true },
  { name: 'FRI', num: 23, dot: true },
];

const scheduleBlocks = [
  { type: 'class', title: 'Data Structures', sub: 'Room 204 · 45 students', time: '9:00 – 10:30 AM', top: 0 },
  { type: 'free', title: 'Office Hours', sub: 'Cabin 12 · Open', time: '11:00 – 12:00 PM', top: 1 },
  { type: 'meeting', title: 'Meeting — Tejas Nair', sub: 'Project Discussion · Online', time: '2:00 – 2:30 PM', top: 2 },
  { type: 'class', title: 'Algorithms Lab', sub: 'Lab 3 · 30 students', time: '3:00 – 4:30 PM', top: 3 },
  { type: 'blocked', title: 'Blocked', sub: 'Personal — not available', time: '5:00 – 6:00 PM', top: 4 },
];

const timeSlots = [
  { time: '8:00 AM', label: 'Early Morning Slot', on: false },
  { time: '10:00 AM', label: 'Mid Morning Slot', on: true },
  { time: '12:00 PM', label: 'Lunch Hour Slot', on: false },
  { time: '2:00 PM', label: 'Early Afternoon', on: true },
  { time: '4:00 PM', label: 'Late Afternoon', on: true },
  { time: '6:00 PM', label: 'Evening Slot', on: false },
];

const officeHours = [
  { day: 'Monday', from: '11:00', to: '12:00' },
  { day: 'Tuesday', from: '10:00', to: '11:00' },
  { day: 'Wednesday', from: '--', to: '--' },
  { day: 'Thursday', from: '3:00', to: '5:00' },
  { day: 'Friday', from: '2:00', to: '4:00' },
];

export default function ManageAvailability() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(1);
  const [slots, setSlots] = useState(timeSlots);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (i) => setSlots(s => s.map((x, j) => j === i ? { ...x, on: !x.on } : x));

  return (
    <>
      <style>{styles}</style>
      <div className="ma-page">

        <div className="ma-nav">
          <div className="ma-back" onClick={() => navigate('/professor/dashboard')}>←</div>
          <span className="ma-nav-title">📅 manage availability</span>
          <button className="ma-save-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            {saved ? '✓ saved!' : 'save changes'}
          </button>
        </div>

        <div className="ma-content">

          {/* Week Nav */}
          <div className="ma-week-nav">
            <div className="ma-week-btn">←</div>
            <span className="ma-week-label">📅 Week of May 19 – 25, 2026</span>
            <div className="ma-week-btn">→</div>
          </div>

          {/* Day Tabs */}
          <div className="ma-day-tabs">
            {days.map((d, i) => (
              <div key={d.name} className={`ma-day-tab ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>
                <div className="ma-day-tab-name">{d.name}</div>
                <div className="ma-day-tab-num">{d.num}</div>
                {d.dot && <div className="ma-day-tab-dot" />}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="ma-legend">
            {[{type:'class',label:'Class'},{type:'free',label:'Free/Office Hours'},{type:'meeting',label:'Meeting'},{type:'blocked',label:'Blocked'}].map(l => (
              <div className="ma-legend-item" key={l.type}><div className={`ma-legend-dot ${l.type}`}/>{l.label}</div>
            ))}
          </div>

          <div className="ma-two-col">

            {/* Schedule Timeline */}
            <div className="ma-card">
              <div className="ma-card-title">
                🗓️ {days[activeDay].name} schedule
                <button className="ma-add-btn">+ add slot</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {scheduleBlocks.map(b => (
                  <div key={b.title} className={`ma-block ${b.type}`}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div>
                        <div className="ma-block-title">{b.title}</div>
                        <div className="ma-block-sub">{b.sub}</div>
                      </div>
                      <div className={`ma-block-time`}>{b.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

              {/* Toggle Slots */}
              <div className="ma-card">
                <div className="ma-card-title">⏰ available slots</div>
                {slots.map((s, i) => (
                  <div className="ma-slot-row" key={s.time}>
                    <div className="ma-slot-time-pill">{s.time}</div>
                    <div className="ma-slot-label">{s.label}</div>
                    <div className={`ma-slot-toggle ${s.on ? 'on' : 'off'}`} onClick={() => toggleSlot(i)}>
                      <div className="ma-slot-knob" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Hours Editor */}
              <div className="ma-card">
                <div className="ma-card-title">🕐 office hours</div>
                {officeHours.map(oh => (
                  <div className="ma-oh-row" key={oh.day}>
                    <div className="ma-oh-day">{oh.day}</div>
                    <input className="ma-oh-input" defaultValue={oh.from} />
                    <span className="ma-oh-sep">to</span>
                    <input className="ma-oh-input" defaultValue={oh.to} />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        <div className="ma-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/professor/dashboard' },
            { id: 'avail', icon: '📅', label: 'schedule', path: '/professor/availability' },
            { id: 'req', icon: '📋', label: 'requests', path: '/professor/requests' },
            { id: 'attend', icon: '👥', label: 'attendance', path: '/professor/attendance' },
            { id: 'stats', icon: '📊', label: 'analytics', path: '/professor/analytics' },
          ].map(n => (
            <div key={n.id} className={`ma-nav-item ${n.id==='avail'?'active':''}`} onClick={() => navigate(n.path)}>
              <span className="ma-nav-item-icon">{n.icon}</span>
              <span className="ma-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
