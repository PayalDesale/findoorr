import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mr-page {
    min-height: 100vh;
    background-color: #f0f7f0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(120,160,120,0.15) 60px, rgba(120,160,120,0.15) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(120,160,120,0.1) 60px, rgba(120,160,120,0.1) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .mr-nav {
    background: #f8fff8; border-bottom: 2px solid #a8c9a8;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #a8c9a8;
  }
  .mr-back { width: 36px; height: 36px; background: #e8f5e9; border: 2px solid #a8c9a8; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0; }
  .mr-back:hover { background: #c8e6c9; transform: translateY(-1px); }
  .mr-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #1a3a1a; flex: 1; }
  .mr-nav-count { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #fde8e8; color: #c62828; border: 1.5px solid #ef9a9a; }

  .mr-content { max-width: 860px; margin: 0 auto; padding: 24px 20px; }

  .mr-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 22px; }
  .mr-stat { background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 14px; padding: 14px; text-align: center; box-shadow: 3px 3px 0px #a8c9a8; }
  .mr-stat-num { font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700; color: #2e7d32; line-height: 1; }
  .mr-stat-label { font-size: 11px; color: #6a9a6a; font-weight: 600; margin-top: 2px; }

  .mr-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .mr-chip { padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; border: 2px solid #a8c9a8; background: #f8fff8; color: #2e4a2e; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .mr-chip:hover { background: #e8f5e9; }
  .mr-chip.active { background: #1a3a1a; border-color: #1a3a1a; color: #f0f7f0; box-shadow: 2px 2px 0px #2e7d32; }

  .mr-card {
    background: #f8fff8; border: 2px solid #a8c9a8; border-radius: 18px;
    padding: 20px; margin-bottom: 14px; box-shadow: 4px 4px 0px #a8c9a8;
    transition: all 0.15s; position: relative;
  }
  .mr-card.pending { border-color: #ffe082; box-shadow: 4px 4px 0px #ffe082; }
  .mr-card.approved { border-color: #a5d6a7; box-shadow: 4px 4px 0px #a5d6a7; }
  .mr-card.rejected { border-color: #ef9a9a; box-shadow: 4px 4px 0px #ef9a9a; opacity: 0.7; }

  .mr-card-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
  .mr-student-avatar { width: 52px; height: 52px; border-radius: 14px; background: #1a3a1a; border: 2px solid #a8c9a8; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #f0f7f0; flex-shrink: 0; font-family: 'Caveat', cursive; }
  .mr-student-info { flex: 1; }
  .mr-student-name { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: #1a3a1a; }
  .mr-student-dept { font-size: 12px; color: #6a9a6a; margin-top: 2px; }
  .mr-status-badge { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; flex-shrink: 0; }
  .mr-status-badge.pending { background: #fff8e1; color: #f57f17; border: 1.5px solid #ffe082; }
  .mr-status-badge.approved { background: #e8f5e9; color: #2e7d32; border: 1.5px solid #a5d6a7; }
  .mr-status-badge.rejected { background: #fde8e8; color: #c62828; border: 1.5px solid #ef9a9a; }

  .mr-details-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 14px; }
  .mr-detail { background: #f0f7f0; border: 1.5px solid #c8e6c8; border-radius: 10px; padding: 10px 12px; }
  .mr-detail-label { font-size: 10px; font-weight: 700; color: #6a9a6a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .mr-detail-val { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #1a3a1a; }

  .mr-note { background: #fffde7; border: 1.5px solid #ffe082; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px; color: #5c4033; line-height: 1.5; }
  .mr-note-label { font-size: 10px; font-weight: 700; color: #f57f17; text-transform: uppercase; margin-bottom: 4px; }

  .mr-actions { display: flex; gap: 10px; }
  .mr-action-btn { flex: 1; padding: 11px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: 'Caveat', cursive; border: 2px solid; text-align: center; }
  .mr-action-btn.approve { background: #e8f5e9; border-color: #a5d6a7; color: #2e7d32; box-shadow: 2px 2px 0px #a5d6a7; }
  .mr-action-btn.approve:hover { background: #c8e6c9; transform: translate(-1px,-1px); box-shadow: 3px 3px 0px #a5d6a7; }
  .mr-action-btn.reject { background: #fde8e8; border-color: #ef9a9a; color: #c62828; box-shadow: 2px 2px 0px #ef9a9a; }
  .mr-action-btn.reject:hover { background: #ffcdd2; transform: translate(-1px,-1px); }
  .mr-action-btn.done { background: #f5f5f5; border-color: #e0e0e0; color: #9e9e9e; cursor: default; }

  .mr-section-label { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #6a9a6a; margin-bottom: 10px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  .mr-loading { text-align: center; padding: 60px 20px; }
  .mr-loading-icon { font-size: 40px; margin-bottom: 12px; animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .mr-loading-text { font-family: 'Caveat', cursive; font-size: 20px; color: #6a9a6a; }

  .mr-empty { text-align: center; padding: 50px 20px; }
  .mr-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .mr-empty-text { font-family: 'Caveat', cursive; font-size: 22px; color: #6a9a6a; }

  .mr-error { background: #fde8e8; border: 2px solid #ef9a9a; border-radius: 14px; padding: 16px; margin-bottom: 16px; text-align: center; }
  .mr-error-text { font-family: 'Caveat', cursive; font-size: 18px; color: #c62828; }
  .mr-retry-btn { margin-top: 10px; padding: 8px 20px; background: #1a3a1a; color: #f0f7f0; border: none; border-radius: 10px; font-family: 'Caveat', cursive; font-size: 16px; cursor: pointer; }

  .mr-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #f8fff8; border-top: 2px solid #a8c9a8; display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100; }
  .mr-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .mr-nav-item:hover { background: #e8f5e9; }
  .mr-nav-item-icon { font-size: 20px; }
  .mr-nav-item-label { font-size: 10px; font-weight: 600; color: #6a9a6a; }
  .mr-nav-item.active .mr-nav-item-label { color: #2e7d32; }

  @media (max-width: 600px) {
    .mr-stats { grid-template-columns: repeat(2,1fr); }
    .mr-details-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Today', 'Virtual'];

export default function MeetingRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const token = localStorage.getItem('findoorr_token');

  const fetchMeetings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/meetings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch meetings');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError('Could not load meeting requests. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update');
      setRequests(r => r.map(x => x.id === id ? { ...x, status } : x));
    } catch {
      alert('Could not update meeting status. Please try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filtered = requests.filter(r => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return r.status === 'pending';
    if (activeFilter === 'Approved') return r.status === 'approved';
    if (activeFilter === 'Rejected') return r.status === 'rejected';
    if (activeFilter === 'Today') return r.date === today;
    if (activeFilter === 'Virtual') return r.mode === 'virtual';
    return true;
  });

  const pending = filtered.filter(r => r.status === 'pending');
  const others = filtered.filter(r => r.status !== 'pending');
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    const todayDate = new Date();
    if (date.toDateString() === todayDate.toDateString()) return 'Today';
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const getReceivedTime = (created) => {
    if (!created) return '';
    const diff = Date.now() - new Date(created).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mr-page">

        <div className="mr-nav">
          <div className="mr-back" onClick={() => navigate('/professor/dashboard')}>←</div>
          <span className="mr-nav-title">📋 meeting requests</span>
          {pendingCount > 0 && <span className="mr-nav-count">{pendingCount} pending</span>}
        </div>

        <div className="mr-content">

          <div className="mr-stats">
            {[
              { num: requests.filter(r => r.status === 'pending').length, label: 'Pending' },
              { num: requests.filter(r => r.status === 'approved').length, label: 'Approved' },
              { num: requests.filter(r => r.status === 'rejected').length, label: 'Rejected' },
              { num: requests.length, label: 'Total' },
            ].map(s => (
              <div className="mr-stat" key={s.label}>
                <div className="mr-stat-num">{s.num}</div>
                <div className="mr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mr-filters">
            {filters.map(f => (
              <button key={f} className={`mr-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div className="mr-loading">
              <div className="mr-loading-icon">⏳</div>
              <div className="mr-loading-text">loading requests...</div>
            </div>
          ) : error ? (
            <div className="mr-error">
              <div className="mr-error-text">⚠️ {error}</div>
              <button className="mr-retry-btn" onClick={fetchMeetings}>retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mr-empty">
              <div className="mr-empty-icon">{requests.length === 0 ? '📭' : '🎉'}</div>
              <div className="mr-empty-text">{requests.length === 0 ? 'no requests yet' : 'all clear!'}</div>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <>
                  <div className="mr-section-label">⏳ needs your response</div>
                  {pending.map(r => (
                    <RequestCard key={r.id} r={r} onUpdate={updateStatus}
                      formatDate={formatDate} getInitials={getInitials} getReceivedTime={getReceivedTime} />
                  ))}
                </>
              )}
              {others.length > 0 && (
                <>
                  <div className="mr-section-label" style={{ marginTop: '16px' }}>🗂️ already handled</div>
                  {others.map(r => (
                    <RequestCard key={r.id} r={r} onUpdate={updateStatus}
                      formatDate={formatDate} getInitials={getInitials} getReceivedTime={getReceivedTime} />
                  ))}
                </>
              )}
            </>
          )}

        </div>

        <div className="mr-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/professor/dashboard' },
            { id: 'avail', icon: '📅', label: 'schedule', path: '/professor/availability' },
            { id: 'req', icon: '📋', label: 'requests', path: '/professor/requests' },
            { id: 'attend', icon: '👥', label: 'attendance', path: '/professor/attendance' },
            { id: 'stats', icon: '📊', label: 'analytics', path: '/professor/analytics' },
          ].map(n => (
            <div key={n.id} className={`mr-nav-item ${n.id === 'req' ? 'active' : ''}`} onClick={() => navigate(n.path)}>
              <span className="mr-nav-item-icon">{n.icon}</span>
              <span className="mr-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

function RequestCard({ r, onUpdate, formatDate, getInitials, getReceivedTime }) {
  return (
    <div className={`mr-card ${r.status}`}>
      <div className="mr-card-top">
        <div className="mr-student-avatar">{getInitials(r.student_name)}</div>
        <div className="mr-student-info">
          <div className="mr-student-name">{r.student_name || 'Student'}</div>
          <div className="mr-student-dept">{r.student_email || ''} · {getReceivedTime(r.created_at)}</div>
        </div>
        <span className={`mr-status-badge ${r.status}`}>{r.status}</span>
      </div>

      <div className="mr-details-grid">
        <div className="mr-detail"><div className="mr-detail-label">Date</div><div className="mr-detail-val">📅 {formatDate(r.date)}</div></div>
        <div className="mr-detail"><div className="mr-detail-label">Time</div><div className="mr-detail-val">🕐 {r.time || '—'}</div></div>
        <div className="mr-detail"><div className="mr-detail-label">Type</div><div className="mr-detail-val">{r.mode === 'virtual' ? '💻' : '🏫'} {r.mode || 'In-Person'}</div></div>
        <div className="mr-detail" style={{ gridColumn: '1/-1' }}><div className="mr-detail-label">Topic</div><div className="mr-detail-val">📌 {r.purpose || '—'}</div></div>
      </div>

      {r.note && (
        <div className="mr-note">
          <div className="mr-note-label">Student's note</div>
          {r.note}
        </div>
      )}

      <div className="mr-actions">
        {r.status === 'pending' ? (
          <>
            <button className="mr-action-btn approve" onClick={() => onUpdate(r.id, 'approved')}>✓ approve</button>
            <button className="mr-action-btn reject" onClick={() => onUpdate(r.id, 'rejected')}>✗ reject</button>
          </>
        ) : (
          <button className="mr-action-btn done" style={{ flex: 1 }}>
            {r.status === 'approved' ? '✓ approved' : '✗ rejected'}
          </button>
        )}
      </div>
    </div>
  );
}
