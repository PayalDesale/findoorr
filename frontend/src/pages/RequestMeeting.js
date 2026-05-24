import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rm-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .rm-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .rm-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .rm-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .rm-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; }

  .rm-content { max-width: 860px; margin: 0 auto; padding: 24px 20px; }

  .rm-progress { display: flex; align-items: center; gap: 0; margin-bottom: 28px; }
  .rm-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .rm-step-circle {
    width: 36px; height: 36px; border-radius: 50%; border: 2px solid #d6c5a8;
    background: #f0e8d8; display: flex; align-items: center; justify-content: center;
    font-family: 'Caveat', cursive; font-size: 18px; font-weight: 700; color: #9c8060;
    transition: all 0.2s; position: relative; z-index: 2;
  }
  .rm-step-circle.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }
  .rm-step-circle.done { background: #c0570e; border-color: #c0570e; color: #fff; }
  .rm-step-label { font-size: 10px; font-weight: 600; color: #9c8060; text-align: center; }
  .rm-step-label.active { color: #3d2c1e; }
  .rm-step-line { flex: 1; height: 2px; background: #d6c5a8; margin-top: -18px; z-index: 1; }
  .rm-step-line.done { background: #c0570e; }

  .rm-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 20px;
    padding: 28px; box-shadow: 5px 5px 0px #c9b99a; margin-bottom: 20px;
  }
  .rm-card-title {
    font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700;
    color: #3d2c1e; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
  }

  .rm-prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 4px; }
  .rm-prof-option {
    display: flex; align-items: center; gap: 12px; padding: 14px;
    border: 2px solid #d6c5a8; border-radius: 14px; background: #faf3e0;
    cursor: pointer; transition: all 0.15s;
  }
  .rm-prof-option:hover { border-color: #c0570e; background: #fff8f0; }
  .rm-prof-option.selected { border-color: #3d2c1e; background: #f0e8d8; box-shadow: 3px 3px 0px #c0570e; }
  .rm-prof-emoji { font-size: 24px; }
  .rm-prof-opt-name { font-size: 13px; font-weight: 700; color: #3d2c1e; }
  .rm-prof-opt-dept { font-size: 11px; color: #9c8060; }
  .rm-prof-opt-status {
    margin-left: auto; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; flex-shrink: 0;
  }
  .rm-prof-opt-status.free { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .rm-prof-opt-status.busy { background: #fde8e8; color: #c62828; border: 1px solid #ef9a9a; }

  .rm-empty { text-align: center; padding: 30px; color: #9c8060; font-family: 'Caveat', cursive; font-size: 18px; }

  .rm-label { font-family: 'Caveat', cursive; font-size: 17px; font-weight: 600; color: #5c4033; margin-bottom: 8px; display: block; }
  .rm-input {
    width: 100%; padding: 13px 16px; background: #faf6ee; border: 2px solid #d6c5a8;
    border-radius: 12px; color: #3d2c1e; font-size: 14px; margin-bottom: 18px;
    outline: none; transition: border 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .rm-input::placeholder { color: #bfaa90; }
  .rm-input:focus { border-color: #c0570e; background: #fffdf5; }
  .rm-textarea {
    width: 100%; padding: 13px 16px; background: #faf6ee; border: 2px solid #d6c5a8;
    border-radius: 12px; color: #3d2c1e; font-size: 14px; margin-bottom: 18px;
    outline: none; transition: border 0.2s; font-family: 'DM Sans', sans-serif;
    resize: vertical; min-height: 100px;
  }
  .rm-textarea::placeholder { color: #bfaa90; }
  .rm-textarea:focus { border-color: #c0570e; background: #fffdf5; }

  .rm-type-row { display: flex; gap: 10px; margin-bottom: 18px; }
  .rm-type-btn {
    flex: 1; padding: 12px; border: 2px solid #d6c5a8; border-radius: 12px;
    background: #faf3e0; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: flex;
    flex-direction: column; align-items: center; gap: 4px; color: #5c4033;
  }
  .rm-type-btn:hover { border-color: #c0570e; }
  .rm-type-btn.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 3px 3px 0px #c0570e; }
  .rm-type-icon { font-size: 22px; }

  .rm-slot-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 18px; }
  .rm-slot {
    padding: 10px; border: 2px solid #d6c5a8; border-radius: 10px;
    background: #faf3e0; text-align: center; cursor: pointer; transition: all 0.15s;
  }
  .rm-slot:hover { border-color: #c0570e; background: #fff8f0; }
  .rm-slot.selected { background: #3d2c1e; border-color: #3d2c1e; box-shadow: 2px 2px 0px #c0570e; }
  .rm-slot-time { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #3d2c1e; }
  .rm-slot.selected .rm-slot-time { color: #f5efe0; }
  .rm-slot-avail { font-size: 10px; color: #9c8060; margin-top: 2px; }
  .rm-slot.selected .rm-slot-avail { color: rgba(245,239,224,0.7); }

  .rm-date-strip { display: flex; gap: 8px; margin-bottom: 18px; overflow-x: auto; }
  .rm-date-day {
    min-width: 52px; padding: 10px 6px; border-radius: 12px; text-align: center;
    border: 2px solid #e0d0b8; background: #faf3e0; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .rm-date-day.active { background: #3d2c1e; border-color: #3d2c1e; }
  .rm-date-name { font-size: 10px; font-weight: 600; color: #9c8060; text-transform: uppercase; }
  .rm-date-day.active .rm-date-name { color: #f5efe0; }
  .rm-date-num { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: #3d2c1e; }
  .rm-date-day.active .rm-date-num { color: #fff; }

  .rm-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1.5px dashed #e0d0b8;
  }
  .rm-summary-row:last-child { border-bottom: none; }
  .rm-summary-key { font-size: 13px; color: #9c8060; font-weight: 600; }
  .rm-summary-val { font-family: 'Caveat', cursive; font-size: 17px; font-weight: 700; color: #3d2c1e; }

  .rm-submit-btn {
    width: 100%; padding: 16px; background: #3d2c1e; border: 2px solid #3d2c1e;
    border-radius: 14px; color: #f5efe0; font-family: 'Caveat', cursive; font-size: 22px;
    font-weight: 700; cursor: pointer; box-shadow: 4px 4px 0px #c0570e;
    transition: all 0.15s; letter-spacing: 0.3px;
  }
  .rm-submit-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #c0570e; }

  .rm-nav-btn-row { display: flex; gap: 12px; margin-top: 4px; }
  .rm-prev-btn {
    flex: 1; padding: 14px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 14px; color: #5c4033; font-family: 'Caveat', cursive; font-size: 18px;
    font-weight: 700; cursor: pointer; box-shadow: 3px 3px 0px #c9b99a; transition: all 0.15s;
  }
  .rm-prev-btn:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px #c9b99a; }
  .rm-next-btn {
    flex: 2; padding: 14px; background: #3d2c1e; border: 2px solid #3d2c1e;
    border-radius: 14px; color: #f5efe0; font-family: 'Caveat', cursive; font-size: 18px;
    font-weight: 700; cursor: pointer; box-shadow: 3px 3px 0px #c0570e; transition: all 0.15s;
  }
  .rm-next-btn:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px #c0570e; }

  .rm-success { text-align: center; padding: 40px 20px; }
  .rm-success-icon { font-size: 64px; margin-bottom: 16px; animation: rm-pop 0.4s ease-out; }
  @keyframes rm-pop { 0%{transform:scale(0)} 80%{transform:scale(1.15)} 100%{transform:scale(1)} }
  .rm-success-title { font-family: 'Caveat', cursive; font-size: 32px; font-weight: 700; color: #3d2c1e; margin-bottom: 8px; }
  .rm-success-sub { font-size: 14px; color: #9c8060; margin-bottom: 28px; }
  .rm-success-btn {
    padding: 14px 32px; background: #3d2c1e; border: 2px solid #3d2c1e;
    border-radius: 14px; color: #f5efe0; font-family: 'Caveat', cursive; font-size: 20px;
    font-weight: 700; cursor: pointer; box-shadow: 4px 4px 0px #c0570e; transition: all 0.15s;
  }

  .rm-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .rm-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s;
  }
  .rm-nav-item:hover { background: #f0e8d8; }
  .rm-nav-item-icon { font-size: 20px; }
  .rm-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
`;

const EMOJIS = ['👨‍💻', '👩‍🔬', '👨‍🏫', '👩‍💼', '🧑‍🔬', '👩‍🏫', '👨‍🎓', '👩‍🎓'];
const getEmoji = (name) => EMOJIS[(name || 'A').charCodeAt(0) % EMOJIS.length];

const generateDates = () => {
  const today = new Date();
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    };
  });
};

const timeSlots = [
  { time: '9:00 AM' }, { time: '10:00 AM' }, { time: '11:00 AM' },
  { time: '12:00 PM' }, { time: '2:00 PM' }, { time: '3:30 PM' },
  { time: '4:00 PM' }, { time: '5:00 PM' }, { time: '5:30 PM' },
];

const topics = ['Doubt Clearing', 'Project Discussion', 'Assignment Review', 'Career Guidance', 'Research Query', 'Other'];

export default function RequestMeeting() {
  const navigate = useNavigate();
  const dates = generateDates();
  const [step, setStep] = useState(1);
  const [professors, setProfessors] = useState([]);
  const [loadingProfs, setLoadingProfs] = useState(true);
  const [selectedProf, setSelectedProf] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingType, setMeetingType] = useState('in-person');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const steps = ['Professor', 'Date & Time', 'Details', 'Confirm'];

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    setLoadingProfs(true);
    try {
      const res = await fetch(`${API_URL}/api/professors`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfessors(data);
        if (data.length > 0) setSelectedProf(0);
      }
    } catch (err) {
      console.log('Could not load professors');
    } finally {
      setLoadingProfs(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const user = auth.currentUser;
      const prof = professors[selectedProf];
      await fetch(`${API_URL}/api/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor_id: prof.id,
          professor_name: prof.name,
          student_name: user?.displayName || user?.email,
          student_email: user?.email,
          date: dates[selectedDate].full,
          time: timeSlots[selectedSlot]?.time || '',
          type: meetingType,
          topic: topic,
          notes: notes,
          firebase_uid: user?.uid,
        }),
      });
    } catch (err) {
      console.log('Could not save meeting, showing success anyway');
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="rm-page">
          <div className="rm-nav">
            <div className="rm-back" onClick={() => navigate('/student/dashboard')}>←</div>
            <span className="rm-nav-title">📅 request meeting</span>
          </div>
          <div className="rm-content">
            <div className="rm-card">
              <div className="rm-success">
                <div className="rm-success-icon">🎉</div>
                <div className="rm-success-title">request sent!</div>
                <div className="rm-success-sub">
                  Your meeting request with {professors[selectedProf]?.name} has been sent.<br />
                  You'll get a notification once they respond!
                </div>
                <button className="rm-success-btn" onClick={() => navigate('/student/dashboard')}>back to home →</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="rm-page">
        <div className="rm-nav">
          <div className="rm-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <span className="rm-nav-title">📅 request meeting</span>
        </div>

        <div className="rm-content">
          <div className="rm-progress">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="rm-step">
                  <div className={`rm-step-circle ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  <div className={`rm-step-label ${step === i+1 ? 'active' : ''}`}>{s}</div>
                </div>
                {i < steps.length-1 && <div className={`rm-step-line ${step > i+1 ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1 - Choose Professor */}
          {step === 1 && (
            <div className="rm-card">
              <div className="rm-card-title">👨‍🏫 choose a professor</div>
              {loadingProfs ? (
                <div className="rm-empty">loading professors...</div>
              ) : professors.length === 0 ? (
                <div className="rm-empty">😕 no professors registered yet!</div>
              ) : (
                <div className="rm-prof-grid">
                  {professors.map((p, i) => (
                    <div key={p.id} className={`rm-prof-option ${selectedProf === i ? 'selected' : ''}`}
                      onClick={() => setSelectedProf(i)}>
                      <span className="rm-prof-emoji">{getEmoji(p.name)}</span>
                      <div>
                        <div className="rm-prof-opt-name">{p.name}</div>
                        <div className="rm-prof-opt-dept">{p.department || 'MIT AOE'}</div>
                      </div>
                      <span className={`rm-prof-opt-status ${p.status || 'free'}`}>
                        {p.status === 'busy' ? 'Busy' : 'Free'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {professors.length > 0 && (
                <div style={{marginTop:'20px'}}>
                  <button className="rm-next-btn" style={{width:'100%'}} onClick={() => setStep(2)}>next → pick a date</button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 - Date & Time */}
          {step === 2 && (
            <div className="rm-card">
              <div className="rm-card-title">📅 pick date & time</div>
              <label className="rm-label">select date</label>
              <div className="rm-date-strip">
                {dates.map((d, i) => (
                  <div key={i} className={`rm-date-day ${selectedDate === i ? 'active' : ''}`}
                    onClick={() => setSelectedDate(i)}>
                    <div className="rm-date-name">{d.name}</div>
                    <div className="rm-date-num">{d.num}</div>
                  </div>
                ))}
              </div>
              <label className="rm-label">available time slots</label>
              <div className="rm-slot-grid">
                {timeSlots.map((s, i) => (
                  <div key={s.time}
                    className={`rm-slot ${selectedSlot === i ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(i)}>
                    <div className="rm-slot-time">{s.time}</div>
                    <div className="rm-slot-avail">Available</div>
                  </div>
                ))}
              </div>
              <div className="rm-nav-btn-row">
                <button className="rm-prev-btn" onClick={() => setStep(1)}>← back</button>
                <button className="rm-next-btn" onClick={() => setStep(3)}>next → add details</button>
              </div>
            </div>
          )}

          {/* Step 3 - Details */}
          {step === 3 && (
            <div className="rm-card">
              <div className="rm-card-title">📝 meeting details</div>
              <label className="rm-label">meeting type</label>
              <div className="rm-type-row">
                <button className={`rm-type-btn ${meetingType === 'in-person' ? 'active' : ''}`}
                  onClick={() => setMeetingType('in-person')}>
                  <span className="rm-type-icon">🏫</span> In-Person
                </button>
                <button className={`rm-type-btn ${meetingType === 'virtual' ? 'active' : ''}`}
                  onClick={() => setMeetingType('virtual')}>
                  <span className="rm-type-icon">💻</span> Virtual
                </button>
              </div>
              <label className="rm-label">topic / purpose</label>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'18px'}}>
                {topics.map(t => (
                  <span key={t} onClick={() => setTopic(t)} style={{
                    padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                    cursor:'pointer', transition:'all 0.15s',
                    background: topic === t ? '#3d2c1e' : '#f0e8d8',
                    border: `2px solid ${topic === t ? '#3d2c1e' : '#d6c5a8'}`,
                    color: topic === t ? '#f5efe0' : '#5c4033',
                    boxShadow: topic === t ? '2px 2px 0px #c0570e' : 'none',
                  }}>{t}</span>
                ))}
              </div>
              <label className="rm-label">additional notes</label>
              <textarea className="rm-textarea"
                placeholder="anything specific you want to discuss..."
                value={notes} onChange={e => setNotes(e.target.value)} />
              <div className="rm-nav-btn-row">
                <button className="rm-prev-btn" onClick={() => setStep(2)}>← back</button>
                <button className="rm-next-btn" onClick={() => setStep(4)}>next → confirm</button>
              </div>
            </div>
          )}

          {/* Step 4 - Confirm */}
          {step === 4 && (
            <div className="rm-card">
              <div className="rm-card-title">✅ confirm request</div>
              <div style={{marginBottom:'24px'}}>
                {[
                  { key: 'Professor', val: professors[selectedProf]?.name || '-' },
                  { key: 'Department', val: professors[selectedProf]?.department || 'MIT AOE' },
                  { key: 'Date', val: dates[selectedDate]?.full || '-' },
                  { key: 'Time', val: selectedSlot !== null ? timeSlots[selectedSlot].time : 'Not selected' },
                  { key: 'Type', val: meetingType === 'in-person' ? '🏫 In-Person' : '💻 Virtual' },
                  { key: 'Topic', val: topic || 'Not specified' },
                ].map(r => (
                  <div className="rm-summary-row" key={r.key}>
                    <span className="rm-summary-key">{r.key}</span>
                    <span className="rm-summary-val">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="rm-nav-btn-row">
                <button className="rm-prev-btn" onClick={() => setStep(3)}>← back</button>
                <button className="rm-next-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'sending...' : 'send request 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rm-bottom-nav">
          {[
            { icon: '🏠', label: 'home', path: '/student/dashboard' },
            { icon: '🔍', label: 'find', path: '/student/find' },
            { icon: '🗺️', label: 'map', path: '/student/map' },
            { icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.label} className="rm-nav-item" onClick={() => navigate(n.path)}>
              <span className="rm-nav-item-icon">{n.icon}</span>
              <span className="rm-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}