import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .pp-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .pp-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .pp-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .pp-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; }

  .pp-content { max-width: 900px; margin: 0 auto; padding: 24px 20px; }

  /* HERO CARD */
  .pp-hero {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 20px;
    padding: 28px; box-shadow: 5px 5px 0px #c9b99a; margin-bottom: 20px;
    display: flex; gap: 24px; align-items: flex-start; position: relative;
  }
  .pp-hero-avatar {
    width: 90px; height: 90px; border-radius: 20px; background: #3d2c1e;
    border: 3px solid #c9b99a; display: flex; align-items: center; justify-content: center;
    font-size: 42px; flex-shrink: 0;
  }
  .pp-hero-info { flex: 1; }
  .pp-hero-name { font-family: 'Caveat', cursive; font-size: 32px; font-weight: 700; color: #3d2c1e; line-height: 1.1; }
  .pp-hero-dept { font-size: 14px; color: #9c8060; margin: 4px 0 10px; }
  .pp-hero-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .pp-tag {
    font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px;
    background: #f0e8d8; color: #5c4033; border: 1.5px solid #d6c5a8;
  }
  .pp-hero-stats { display: flex; gap: 20px; }
  .pp-hero-stat { text-align: center; }
  .pp-hero-stat-num { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #c0570e; line-height: 1; }
  .pp-hero-stat-label { font-size: 10px; color: #9c8060; font-weight: 600; }
  .pp-status-badge {
    position: absolute; top: 20px; right: 20px;
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 20px;
  }
  .pp-status-badge.free { background: #e8f5e9; color: #388e3c; border: 2px solid #a5d6a7; }
  .pp-status-badge.busy { background: #fde8e8; color: #c62828; border: 2px solid #ef9a9a; }
  .pp-status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .pp-status-dot.free { background: #4caf50; }
  .pp-status-dot.busy { background: #f44336; }

  /* ACTION BUTTONS */
  .pp-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .pp-action-btn {
    padding: 14px; border-radius: 14px; border: 2px solid #c9b99a;
    background: #fffdf5; display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: all 0.15s; box-shadow: 3px 3px 0px #c9b99a; font-family: 'DM Sans', sans-serif;
  }
  .pp-action-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #c9b99a; background: #faf3e0; }
  .pp-action-btn.primary { background: #3d2c1e; border-color: #3d2c1e; box-shadow: 3px 3px 0px #c0570e; }
  .pp-action-btn.primary:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #c0570e; }
  .pp-action-icon { font-size: 22px; }
  .pp-action-label { font-size: 12px; font-weight: 600; color: #5c4033; }
  .pp-action-btn.primary .pp-action-label { color: #f5efe0; }

  /* TWO COL */
  .pp-two-col { display: grid; grid-template-columns: 1.1fr 1fr; gap: 16px; margin-bottom: 16px; }

  /* CARD */
  .pp-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 18px;
    padding: 20px; box-shadow: 4px 4px 0px #c9b99a; margin-bottom: 16px;
  }
  .pp-card-title {
    font-family: 'Caveat', cursive; font-size: 20px; font-weight: 700;
    color: #3d2c1e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }

  /* SCHEDULE */
  .pp-schedule-day { margin-bottom: 14px; }
  .pp-schedule-day-name {
    font-size: 11px; font-weight: 700; color: #9c8060; text-transform: uppercase;
    letter-spacing: 0.8px; margin-bottom: 8px;
  }
  .pp-schedule-slots { display: flex; flex-direction: column; gap: 6px; }
  .pp-slot {
    display: flex; align-items: center; gap: 10px; padding: 8px 12px;
    border-radius: 10px; border: 1.5px solid #e0d0b8;
  }
  .pp-slot.class { background: #fde8e8; border-color: #ef9a9a; }
  .pp-slot.free { background: #e8f5e9; border-color: #a5d6a7; }
  .pp-slot.meeting { background: #e8f0fe; border-color: #9fa8da; }
  .pp-slot-time { font-family: 'Caveat', cursive; font-size: 15px; font-weight: 700; color: #3d2c1e; min-width: 80px; }
  .pp-slot-label { font-size: 12px; font-weight: 600; color: #5c4033; flex: 1; }
  .pp-slot-room { font-size: 11px; color: #9c8060; }

  /* LOCATION */
  .pp-location-card {
    background: linear-gradient(135deg, #e8f4f8, #d4eaf0);
    border: 2px solid #b8d8e8; border-radius: 14px; padding: 16px;
    margin-bottom: 10px;
  }
  .pp-location-map {
    height: 100px; background: linear-gradient(135deg, #d4eaf0, #c8e0ea);
    border-radius: 10px; position: relative; overflow: hidden; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .pp-loc-grid {
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg,rgba(100,150,180,0.15) 0,rgba(100,150,180,0.15) 1px,transparent 1px,transparent 24px),
      repeating-linear-gradient(90deg,rgba(100,150,180,0.15) 0,rgba(100,150,180,0.15) 1px,transparent 1px,transparent 24px);
  }
  .pp-loc-pin { font-size: 28px; position: relative; z-index: 2; animation: pp-bounce 2s ease-in-out infinite; }
  @keyframes pp-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .pp-loc-info { display: flex; align-items: center; gap: 8px; }
  .pp-loc-text { font-size: 13px; font-weight: 600; color: #2c6e8a; }
  .pp-loc-sub { font-size: 11px; color: #5a8fa3; }

  /* OFFICE HOURS */
  .pp-oh-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1.5px dashed #e0d0b8;
  }
  .pp-oh-item:last-child { border-bottom: none; }
  .pp-oh-day { font-size: 13px; font-weight: 600; color: #3d2c1e; }
  .pp-oh-time { font-family: 'Caveat', cursive; font-size: 16px; color: #c0570e; font-weight: 700; }
  .pp-oh-badge {
    font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
  }
  .pp-oh-badge.open { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .pp-oh-badge.closed { background: #f5f5f5; color: #9e9e9e; border: 1px solid #e0e0e0; }

  /* REVIEWS */
  .pp-review-item {
    padding: 12px 0; border-bottom: 1.5px dashed #e0d0b8;
  }
  .pp-review-item:last-child { border-bottom: none; }
  .pp-review-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .pp-review-avatar {
    width: 30px; height: 30px; border-radius: 8px; background: #3d2c1e;
    display: flex; align-items: center; justify-content: center; color: #f5efe0; font-size: 12px; font-weight: 700;
  }
  .pp-review-name { font-size: 13px; font-weight: 600; color: #3d2c1e; flex: 1; }
  .pp-review-stars { color: #c0570e; font-size: 12px; }
  .pp-review-text { font-size: 12px; color: #5c4033; line-height: 1.5; }
  .pp-review-time { font-size: 10px; color: #bfaa90; margin-top: 4px; }

  /* SUBJECTS */
  .pp-subjects { display: flex; flex-wrap: wrap; gap: 8px; }
  .pp-subject-tag {
    padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600;
    background: #f0e8d8; color: #5c4033; border: 2px solid #d6c5a8;
    transition: all 0.15s; cursor: default;
  }
  .pp-subject-tag:hover { background: #e8dcc8; }

  /* BOTTOM NAV */
  .pp-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .pp-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s;
  }
  .pp-nav-item:hover { background: #f0e8d8; }
  .pp-nav-item-icon { font-size: 20px; }
  .pp-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }

  @media (max-width: 700px) {
    .pp-hero { flex-direction: column; }
    .pp-actions { grid-template-columns: 1fr 1fr; }
    .pp-two-col { grid-template-columns: 1fr; }
  }
`;

const schedule = [
  {
    day: 'Monday', slots: [
      { time: '9:00 - 10:30', label: 'Data Structures', room: 'Room 204', type: 'class' },
      { time: '11:00 - 12:00', label: 'Free / Office Hours', room: 'Cabin 12', type: 'free' },
      { time: '2:00 - 3:30', label: 'Algorithms Lab', room: 'Lab 3', type: 'class' },
    ]
  },
  {
    day: 'Tuesday', slots: [
      { time: '10:00 - 11:00', label: 'Free / Office Hours', room: 'Cabin 12', type: 'free' },
      { time: '11:30 - 1:00', label: 'Advanced DSA', room: 'Room 301', type: 'class' },
      { time: '3:00 - 3:30', label: 'Meeting — Tejas N.', room: 'Online', type: 'meeting' },
    ]
  },
  {
    day: 'Wednesday', slots: [
      { time: '9:00 - 10:30', label: 'Data Structures', room: 'Room 204', type: 'class' },
      { time: '1:00 - 3:00', label: 'Free / Office Hours', room: 'Cabin 12', type: 'free' },
    ]
  },
];

const officeHours = [
  { day: 'Monday', time: '11:00 AM – 12:00 PM', open: true },
  { day: 'Tuesday', time: '10:00 AM – 11:00 AM', open: true },
  { day: 'Wednesday', time: '1:00 PM – 3:00 PM', open: true },
  { day: 'Thursday', time: 'No office hours', open: false },
  { day: 'Friday', time: '2:00 PM – 4:00 PM', open: true },
];

const reviews = [
  { initials: 'AK', name: 'Arjun K.', stars: '★★★★★', text: 'Dr. Sharma explains DSA concepts incredibly well. Always available during office hours!', time: '2 days ago' },
  { initials: 'PR', name: 'Priya R.', stars: '★★★★★', text: 'Very approachable professor. Responded to my meeting request within minutes.', time: '1 week ago' },
  { initials: 'SM', name: 'Sneha M.', stars: '★★★★☆', text: 'Great teacher, but sometimes hard to find outside office hours. Use Findoorr!', time: '2 weeks ago' },
];

export default function ProfessorProfile() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(0);

  return (
    <>
      <style>{styles}</style>
      <div className="pp-page">

        {/* Nav */}
        <div className="pp-nav">
          <div className="pp-back" onClick={() => navigate('/student/find')}>←</div>
          <span className="pp-nav-title">👨‍💻 professor profile</span>
        </div>

        <div className="pp-content">

          {/* Hero */}
          <div className="pp-hero">
            <div className="pp-hero-avatar">👨‍💻</div>
            <div className="pp-hero-info">
              <div className="pp-hero-name">Dr. Rajesh Sharma</div>
              <div className="pp-hero-dept">Computer Science · SPPU · 14 years experience</div>
              <div className="pp-hero-tags">
                <span className="pp-tag">DSA</span>
                <span className="pp-tag">Algorithms</span>
                <span className="pp-tag">C++</span>
                <span className="pp-tag">Python</span>
                <span className="pp-tag">Competitive Programming</span>
              </div>
              <div className="pp-hero-stats">
                <div className="pp-hero-stat">
                  <div className="pp-hero-stat-num">4.8</div>
                  <div className="pp-hero-stat-label">Rating</div>
                </div>
                <div className="pp-hero-stat">
                  <div className="pp-hero-stat-num">142</div>
                  <div className="pp-hero-stat-label">Reviews</div>
                </div>
                <div className="pp-hero-stat">
                  <div className="pp-hero-stat-num">98%</div>
                  <div className="pp-hero-stat-label">Response</div>
                </div>
                <div className="pp-hero-stat">
                  <div className="pp-hero-stat-num">~12m</div>
                  <div className="pp-hero-stat-label">Avg Reply</div>
                </div>
              </div>
            </div>
            <div className="pp-status-badge free">
              <div className="pp-status-dot free" />
              Free Now
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pp-actions">
            <button className="pp-action-btn primary" onClick={() => navigate('/student/request')}>
              <span className="pp-action-icon">📅</span>
              <span className="pp-action-label">Request Meeting</span>
            </button>
            <button className="pp-action-btn" onClick={() => navigate('/student/map')}>
              <span className="pp-action-icon">📍</span>
              <span className="pp-action-label">Find on Map</span>
            </button>
            <button className="pp-action-btn" onClick={() => navigate('/student/ai')}>
              <span className="pp-action-icon">🤖</span>
              <span className="pp-action-label">Ask AI</span>
            </button>
          </div>

          {/* Location + Office Hours */}
          <div className="pp-two-col">

            {/* Location */}
            <div>
              <div className="pp-card">
                <div className="pp-card-title">📍 current location</div>
                <div className="pp-location-card">
                  <div className="pp-location-map">
                    <div className="pp-loc-grid" />
                    <div className="pp-loc-pin">📍</div>
                  </div>
                  <div className="pp-loc-info">
                    <div>
                      <div className="pp-loc-text">Room 204, CS Block</div>
                      <div className="pp-loc-sub">Last updated 2 minutes ago · On Campus</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="pp-card">
                <div className="pp-card-title">📚 subjects taught</div>
                <div className="pp-subjects">
                  {['Data Structures', 'Algorithms', 'C++ Programming', 'Python Basics', 'Competitive Programming', 'Problem Solving'].map(s => (
                    <span key={s} className="pp-subject-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="pp-card">
              <div className="pp-card-title">🕐 office hours</div>
              {officeHours.map(oh => (
                <div className="pp-oh-item" key={oh.day}>
                  <div>
                    <div className="pp-oh-day">{oh.day}</div>
                    <div className="pp-oh-time">{oh.time}</div>
                  </div>
                  <span className={`pp-oh-badge ${oh.open ? 'open' : 'closed'}`}>
                    {oh.open ? 'Open' : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="pp-card">
            <div className="pp-card-title">📅 weekly schedule</div>
            {/* Day tabs */}
            <div style={{display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap'}}>
              {schedule.map((s, i) => (
                <button key={s.day} onClick={() => setActiveDay(i)} style={{
                  padding: '7px 18px', borderRadius: '10px', border: '2px solid',
                  borderColor: activeDay === i ? '#3d2c1e' : '#d6c5a8',
                  background: activeDay === i ? '#3d2c1e' : '#f0e8d8',
                  color: activeDay === i ? '#f5efe0' : '#5c4033',
                  fontFamily: "'Caveat', cursive", fontSize: '16px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: activeDay === i ? '2px 2px 0px #c0570e' : '2px 2px 0px #c9b99a',
                }}>{s.day}</button>
              ))}
            </div>
            <div className="pp-schedule-slots">
              {schedule[activeDay].slots.map(slot => (
                <div key={slot.time} className={`pp-slot ${slot.type}`}>
                  <div className="pp-slot-time">{slot.time}</div>
                  <div className="pp-slot-label">{slot.label}</div>
                  <div className="pp-slot-room">📍 {slot.room}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="pp-card">
            <div className="pp-card-title">⭐ student reviews</div>
            {reviews.map(r => (
              <div className="pp-review-item" key={r.name}>
                <div className="pp-review-top">
                  <div className="pp-review-avatar">{r.initials}</div>
                  <div className="pp-review-name">{r.name}</div>
                  <div className="pp-review-stars">{r.stars}</div>
                </div>
                <div className="pp-review-text">{r.text}</div>
                <div className="pp-review-time">{r.time}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="pp-bottom-nav">
          {[
            { icon: '🏠', label: 'home', path: '/student/dashboard' },
            { icon: '🔍', label: 'find', path: '/student/find' },
            { icon: '🗺️', label: 'map', path: '/student/map' },
            { icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.label} className="pp-nav-item" onClick={() => navigate(n.path)}>
              <span className="pp-nav-item-icon">{n.icon}</span>
              <span className="pp-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}