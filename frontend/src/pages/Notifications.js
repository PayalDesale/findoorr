import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
  .notif-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .notif-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .notif-nav-title { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #3d2c1e; flex: 1; }
  .notif-mark-all {
    font-size: 12px; font-weight: 700; color: #c0570e; cursor: pointer;
    text-decoration: underline; text-decoration-style: wavy;
  }

  .notif-content { max-width: 760px; margin: 0 auto; padding: 24px 20px; }

  /* STATS */
  .notif-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .notif-stat {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 14px;
    padding: 16px; text-align: center; box-shadow: 3px 3px 0px #c9b99a;
  }
  .notif-stat-num { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; color: #c0570e; line-height: 1; }
  .notif-stat-label { font-size: 11px; color: #9c8060; font-weight: 600; margin-top: 2px; }

  /* FILTER CHIPS */
  .notif-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .notif-chip {
    padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: 2px solid #c9b99a; background: #fffdf5; color: #5c4033;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .notif-chip:hover { background: #f0e8d8; }
  .notif-chip.active { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }

  /* SECTION */
  .notif-section-label {
    font-family: 'Caveat', cursive; font-size: 16px; font-weight: 700; color: #9c8060;
    margin-bottom: 10px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* NOTIFICATION ITEM */
  .notif-item {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 16px;
    padding: 16px; margin-bottom: 10px; box-shadow: 3px 3px 0px #c9b99a;
    display: flex; gap: 14px; align-items: flex-start; cursor: pointer;
    transition: all 0.15s; position: relative;
  }
  .notif-item:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #c9b99a; background: #faf3e0; }
  .notif-item.unread { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; }
  .notif-item.unread::before {
    content: ''; position: absolute; top: 12px; right: 14px;
    width: 8px; height: 8px; border-radius: 50%; background: #c0570e;
  }

  .notif-icon-wrap {
    width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid;
  }
  .notif-icon-wrap.green { background: #e8f5e9; border-color: #a5d6a7; }
  .notif-icon-wrap.orange { background: #fff3e0; border-color: #ffcc80; }
  .notif-icon-wrap.blue { background: #e8f0fe; border-color: #9fa8da; }
  .notif-icon-wrap.red { background: #fde8e8; border-color: #ef9a9a; }
  .notif-icon-wrap.yellow { background: #fffde7; border-color: #fff176; }
  .notif-icon-wrap.purple { background: #f3e5f5; border-color: #ce93d8; }

  .notif-body { flex: 1; }
  .notif-title { font-size: 14px; font-weight: 700; color: #3d2c1e; margin-bottom: 3px; line-height: 1.4; }
  .notif-title span { color: #c0570e; }
  .notif-desc { font-size: 12px; color: #5c4033; line-height: 1.5; margin-bottom: 8px; }
  .notif-meta { display: flex; align-items: center; gap: 10px; }
  .notif-time { font-size: 11px; color: #bfaa90; }
  .notif-tag {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px;
  }
  .notif-tag.meeting { background: #e8f0fe; color: #3949ab; border: 1px solid #9fa8da; }
  .notif-tag.alert { background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; }
  .notif-tag.schedule { background: #e8f5e9; color: #388e3c; border: 1px solid #a5d6a7; }
  .notif-tag.location { background: #f3e5f5; color: #7b1fa2; border: 1px solid #ce93d8; }
  .notif-tag.system { background: #f5f5f5; color: #616161; border: 1px solid #e0e0e0; }

  /* ACTION BUTTONS on notif */
  .notif-actions { display: flex; gap: 8px; margin-top: 10px; }
  .notif-act-btn {
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; border: 2px solid;
  }
  .notif-act-btn.primary { background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c0570e; }
  .notif-act-btn.primary:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0px #c0570e; }
  .notif-act-btn.secondary { background: #f0e8d8; border-color: #d6c5a8; color: #5c4033; }
  .notif-act-btn.secondary:hover { background: #e8dcc8; }

  /* EMPTY */
  .notif-empty { text-align: center; padding: 60px 20px; }
  .notif-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .notif-empty-text { font-family: 'Caveat', cursive; font-size: 22px; color: #9c8060; }

  /* BOTTOM NAV */
  .notif-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #fffdf5; border-top: 2px solid #c9b99a;
    display: flex; justify-content: space-around; padding: 10px 0 14px; z-index: 100;
  }
  .notif-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s;
  }
  .notif-nav-item:hover { background: #f0e8d8; }
  .notif-nav-item-icon { font-size: 20px; }
  .notif-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .notif-nav-item.active .notif-nav-item-label { color: #c0570e; }

  @media (max-width: 600px) {
    .notif-stats { grid-template-columns: repeat(3,1fr); }
  }
`;

const allNotifications = [
  {
    id: 1, icon: '✅', color: 'green', unread: true, tag: 'meeting', time: '10 min ago',
    title: <><span>Dr. Sharma</span> confirmed your meeting!</>,
    desc: 'Your meeting request for 10:30 AM today has been approved. Room 204, CS Block.',
    actions: ['View Details', 'Get Directions'],
    category: 'today',
  },
  {
    id: 2, icon: '⚠️', color: 'orange', unread: true, tag: 'alert', time: '45 min ago',
    title: <>Class cancelled — <span>Prof. Mehta</span></>,
    desc: "Prof. Mehta's 11:00 AM DBMS lecture is cancelled today due to a department meeting.",
    actions: ['View Schedule'],
    category: 'today',
  },
  {
    id: 3, icon: '🔔', color: 'blue', unread: true, tag: 'meeting', time: '1 hour ago',
    title: <>Reminder: Meeting with <span>Prof. Kulkarni</span> in 2 hrs</>,
    desc: 'Your doubt clearing session starts at 2:00 PM. Join via the virtual link.',
    actions: ['Join Meeting', 'Reschedule'],
    category: 'today',
  },
  {
    id: 4, icon: '📍', color: 'purple', unread: false, tag: 'location', time: '2 hours ago',
    title: <><span>Dr. Joshi</span> is now available in Room 209</>,
    desc: 'You had a pending query with Dr. Joshi. He is now free in Room 209, CS Block.',
    actions: ['Book Meeting'],
    category: 'today',
  },
  {
    id: 5, icon: '❌', color: 'red', unread: false, tag: 'meeting', time: 'Yesterday',
    title: <>Meeting request <span>rejected</span> by Prof. Desai</>,
    desc: 'Your meeting request for yesterday at 3:00 PM was declined. Reason: Schedule conflict.',
    actions: ['Request Again'],
    category: 'earlier',
  },
  {
    id: 6, icon: '🗓️', color: 'green', unread: false, tag: 'schedule', time: 'Yesterday',
    title: <>New office hours set by <span>Dr. Sharma</span></>,
    desc: 'Dr. Sharma has updated his office hours. Now available Mon & Wed 11AM–1PM.',
    actions: ['View Profile'],
    category: 'earlier',
  },
  {
    id: 7, icon: '⭐', color: 'yellow', unread: false, tag: 'system', time: '2 days ago',
    title: <>Rate your meeting with <span>Prof. Kulkarni</span></>,
    desc: 'How was your session last Tuesday? Leave a quick review to help other students.',
    actions: ['Leave Review', 'Skip'],
    category: 'earlier',
  },
  {
    id: 8, icon: '🤖', color: 'blue', unread: false, tag: 'system', time: '3 days ago',
    title: <>AI Assistant answered your query</>,
    desc: '"Is Dr. Sharma free on Friday afternoon?" — Yes, he has office hours 2PM–4PM.',
    actions: ['View Answer'],
    category: 'earlier',
  },
];

const filters = ['All', 'Unread', 'Meetings', 'Alerts', 'Schedule', 'Location'];

export default function Notifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(allNotifications);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return n.unread;
    if (activeFilter === 'Meetings') return n.tag === 'meeting';
    if (activeFilter === 'Alerts') return n.tag === 'alert';
    if (activeFilter === 'Schedule') return n.tag === 'schedule';
    if (activeFilter === 'Location') return n.tag === 'location';
    return true;
  });

  const todayNotifs = filtered.filter(n => n.category === 'today');
  const earlierNotifs = filtered.filter(n => n.category === 'earlier');
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <style>{styles}</style>
      <div className="notif-page">

        <div className="notif-nav">
          <div className="notif-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <span className="notif-nav-title">🔔 notifications</span>
          <span className="notif-mark-all" onClick={markAllRead}>mark all read</span>
        </div>

        <div className="notif-content">

          {/* Stats */}
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
              <div className="notif-stat-num">3</div>
              <div className="notif-stat-label">Today</div>
            </div>
          </div>

          {/* Filters */}
          <div className="notif-filters">
            {filters.map(f => (
              <button key={f} className={`notif-chip ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">🎉</div>
              <div className="notif-empty-text">all caught up!</div>
            </div>
          ) : (
            <>
              {todayNotifs.length > 0 && (
                <>
                  <div className="notif-section-label">📅 today</div>
                  {todayNotifs.map(n => (
                    <NotifCard key={n.id} n={n} navigate={navigate} />
                  ))}
                </>
              )}
              {earlierNotifs.length > 0 && (
                <>
                  <div className="notif-section-label" style={{marginTop:'16px'}}>🗂️ earlier</div>
                  {earlierNotifs.map(n => (
                    <NotifCard key={n.id} n={n} navigate={navigate} />
                  ))}
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
            { id: 'ai', icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { id: 'notif', icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.id} className={`notif-nav-item ${n.id === 'notif' ? 'active' : ''}`}
              onClick={() => navigate(n.path)}>
              <span className="notif-nav-item-icon">{n.icon}</span>
              <span className="notif-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

function NotifCard({ n, navigate }) {
  const actionMap = {
    'View Details': '/student/professor/1',
    'Get Directions': '/student/map',
    'View Schedule': '/student/find',
    'Join Meeting': '/student/ai',
    'Reschedule': '/student/request',
    'Book Meeting': '/student/request',
    'Request Again': '/student/request',
    'View Profile': '/student/professor/1',
    'Leave Review': '/student/professor/1',
    'Skip': null,
    'View Answer': '/student/ai',
  };

  return (
    <div className={`notif-item ${n.unread ? 'unread' : ''}`}>
      <div className={`notif-icon-wrap ${n.color}`}>{n.icon}</div>
      <div className="notif-body">
        <div className="notif-title">{n.title}</div>
        <div className="notif-desc">{n.desc}</div>
        <div className="notif-meta">
          <span className="notif-time">{n.time}</span>
          <span className={`notif-tag ${n.tag}`}>{n.tag}</span>
        </div>
        <div className="notif-actions">
          {n.actions.map((a, i) => (
            <button key={a}
              className={`notif-act-btn ${i === 0 ? 'primary' : 'secondary'}`}
              onClick={() => actionMap[a] && navigate(actionMap[a])}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
