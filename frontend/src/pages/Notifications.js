import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .notif-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .notif-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    position: sticky; top: 0; z-index: 100; box-shadow: 0 3px 0px #c9b99a;
  }
  .notif-back { width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0; }
  .notif-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .notif-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; flex: 1; }
  .notif-mark-all { font-size: 12px; font-weight: 700; color: #c0570e; cursor: pointer; text-decoration: underline; text-decoration-style: wavy; }

  .notif-content { max-width: 760px; margin: 0 auto; padding: 24px 20px; }

  .notif-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .notif-stat { background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px; padding: 16px; text-align: center; box-shadow: 3px 3px 0px #c9b99a; }
  .notif-stat-num { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; color: #c0570e; line-height: 1; }
  .notif-stat-label { font-size: 11px; color: #9c8060; font-weight: 600; margin-top: 2px; }

  .notif-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .notif-chip { padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; border: 2px solid #c9b99a; background: #fffdf5; color: #5c4033; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .notif-chip:hover { background: #f0e8d8; }
  .notif-chip.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }

  .notif-section-label { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #9c8060; margin-bottom: 10px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  .notif-item { background: #fffdf5; border: 2px solid #c9b99a; border-radius: 16px; padding: 16px; margin-bottom: 10px; box-shadow: 3px 3px 0px #c9b99a; display: flex; gap: 14px; align-items: flex-start; cursor: pointer; transition: all 0.15s; position: relative; }
  .notif-item:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #c9b99a; background: #faf3e0; }
  .notif-item.unread { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; }
  .notif-item.unread::before { content: ''; position: absolute; top: 12px; right: 14px; width: 8px; height: 8px; border-radius: 50%; background: #c0570e; }

  .notif-icon-wrap { width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid; }
  .notif-icon-wrap.green { background: #e8f5e9; border-color: #a5d6a7; }
  .notif-icon-wrap.orange { background: #fff3e0; border-color: #ffcc80; }
  .notif-icon-wrap.blue { background: #e8f0fe; border-color: #9fa8da; }
  .notif-icon-wrap.red { background: #fde8e8; border-color: #ef9a9a; }
  .notif-icon-wrap.yellow { background: #fffde7; border-color: #fff176; }

  .notif-body { flex: 1; }
  .notif-title { font-size: 14px; font-weight: 700; color: #3d2c1e; margin-bottom: 3px; line-height: 1.4; }
  .notif-title span { color: #c0570e; }
  .notif-desc { font-size: 12px; color: #5c4033; line-height: 1.5; margin-bottom: 8px; }
  .notif-meta { display: flex; align-items: center; gap: 10px; }
  .notif-time { font-size: 11px; color: #bfaa90; }
  .notif-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
  .notif-tag.meeting { background: #e8f0fe; color: #3949ab; border: 1px solid #9fa8da; }
  .notif-tag.meeting_request { background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; }
  .notif-tag.meeting_update { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .notif-tag.system { background: #f5f5f5; color: #616161; border: 1px solid #e0e0e0; }

  .notif-loading { text-align: center; padding: 60px 20px; }
  .notif-loading-icon { font-size: 40px; margin-bottom: 12px; animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .notif-loading-text { font-family: 'Caveat', cursive; font-size: 20px; color: #9c8060; }

  .notif-empty { text-align: center; padding: 60px 20px; }
  .notif-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .notif-empty-text { font-family: 'Caveat', cursive; font-size: 22px; color: #9c8060; }

  .notif-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #fffdf5; border-top: 2px solid #c9b99a; display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100; }
  .notif-nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s; }
  .notif-nav-item:hover { background: #f0e8d8; }
  .notif-nav-item-icon { font-size: 20px; }
  .notif-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .notif-nav-item.active .notif-nav-item-label { color: #c0570e; }
`;

const TYPE_CONFIG = {
  meeting_request: { icon: '📅', color: 'orange', tag: 'meeting_request' },
  meeting_update: { icon: '✅', color: 'green', tag: 'meeting_update' },
  meeting: { icon: '📋', color: 'blue', tag: 'meeting' },
  system: { icon: '🔔', color: 'yellow', tag: 'system' },
};

const filters = ['All', 'Unread', 'Meetings', 'System'];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [readIds, setReadIds] = useState(new Set());

  const token = localStorage.getItem('findoorr_token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = (id) => setReadIds(prev => new Set([...prev, id]));
  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)));

  const isUnread = (n) => !readIds.has(n.id);

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return isUnread(n);
    if (activeFilter === 'Meetings') return n.type === 'meeting_request' || n.type === 'meeting_update' || n.type === 'meeting';
    if (activeFilter === 'System') return n.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter(n => isUnread(n)).length;

  const getTimeAgo = (created) => {
    if (!created) return '';
    const diff = Date.now() - new Date(created).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system;

  const today = filtered.filter(n => {
    if (!n.created_at) return false;
    const d = new Date(n.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const earlier = filtered.filter(n => !today.includes(n));

  return (
    <>
      <style>{styles}</style>
      <div className="notif-page">

        <div className="notif-nav">
          <div className="notif-back" onClick={() => navigate(-1)}>←</div>
          <span className="notif-nav-title">🔔 notifications</span>
          {unreadCount > 0 && (
            <span className="notif-mark-all" onClick={markAllRead}>mark all read</span>
          )}
        </div>

        <div className="notif-content">

          <div className="notif-stats">
            <div className="notif-stat">
              <div className="notif-stat-num">{unreadCount}</div>
              <div className="notif-stat-label">Unread</div>
            </div>
            <div className="notif-stat">
              <div className="notif-stat-num">{notifications.length}</div>
              <div className="notif-stat-label">Total</div>
            </div>
            <div className="notif-stat">
              <div className="notif-stat-num">{today.length}</div>
              <div className="notif-stat-label">Today</div>
            </div>
          </div>

          <div className="notif-filters">
            {filters.map(f => (
              <button key={f} className={`notif-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div className="notif-loading">
              <div className="notif-loading-icon">⏳</div>
              <div className="notif-loading-text">loading notifications...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">🔕</div>
              <div className="notif-empty-text">
                {notifications.length === 0 ? 'no notifications yet' : 'nothing here'}
              </div>
            </div>
          ) : (
            <>
              {today.length > 0 && (
                <>
                  <div className="notif-section-label">📅 today</div>
                  {today.map(n => <NotifCard key={n.id} n={n} isUnread={isUnread(n)} onRead={markRead} getConfig={getConfig} getTimeAgo={getTimeAgo} />)}
                </>
              )}
              {earlier.length > 0 && (
                <>
                  <div className="notif-section-label" style={{ marginTop: '16px' }}>🗓️ earlier</div>
                  {earlier.map(n => <NotifCard key={n.id} n={n} isUnread={isUnread(n)} onRead={markRead} getConfig={getConfig} getTimeAgo={getTimeAgo} />)}
                </>
              )}
            </>
          )}

        </div>

        <div className="notif-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/student/dashboard' },
            { id: 'find', icon: '🔍', label: 'find', path: '/student/find' },
            { id: 'map', icon: '🗺️', label: 'map', path: '/student/map' },
            { id: 'notif', icon: '🔔', label: 'alerts', path: '/student/notifications' },
            { id: 'ai', icon: '🤖', label: 'AI', path: '/student/ai' },
          ].map(n => (
            <div key={n.id} className={`notif-nav-item ${n.id === 'notif' ? 'active' : ''}`} onClick={() => navigate(n.path)}>
              <span className="notif-nav-item-icon">{n.icon}</span>
              <span className="notif-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

function NotifCard({ n, isUnread, onRead, getConfig, getTimeAgo }) {
  const cfg = getConfig(n.type);
  return (
    <div className={`notif-item ${isUnread ? 'unread' : ''}`} onClick={() => onRead(n.id)}>
      <div className={`notif-icon-wrap ${cfg.color}`}>{cfg.icon}</div>
      <div className="notif-body">
        <div className="notif-title">{n.title}</div>
        <div className="notif-desc">{n.message}</div>
        <div className="notif-meta">
          <span className="notif-time">{getTimeAgo(n.created_at)}</span>
          <span className={`notif-tag ${cfg.tag}`}>{n.type?.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
}
