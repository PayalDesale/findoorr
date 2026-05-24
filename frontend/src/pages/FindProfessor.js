import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 100px;
  }

  .fp-nav {
    background: #fffdf5;
    border-bottom: 2px solid #c9b99a;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 3px 0px #c9b99a;
  }

  .fp-back {
    width: 36px; height: 36px;
    background: #f0e8d8;
    border: 2px solid #c9b99a;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .fp-back:hover { background: #e8dcc8; transform: translateY(-1px); }

  .fp-nav-title {
    font-family: 'Caveat', cursive;
    font-size: 24px;
    font-weight: 700;
    color: #3d2c1e;
  }

  .fp-content { max-width: 860px; margin: 0 auto; padding: 24px 20px; }

  /* SEARCH BAR */
  .fp-search-wrap {
    position: relative;
    margin-bottom: 16px;
  }
  .fp-search-icon {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
  }
  .fp-search {
    width: 100%;
    padding: 14px 16px 14px 46px;
    background: #fffdf5;
    border: 2px solid #c9b99a;
    border-radius: 14px;
    font-size: 15px;
    color: #3d2c1e;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    box-shadow: 3px 3px 0px #c9b99a;
    transition: all 0.2s;
  }
  .fp-search::placeholder { color: #bfaa90; }
  .fp-search:focus { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; }

  /* FILTER CHIPS */
  .fp-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .fp-chip {
    padding: 7px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid #c9b99a;
    background: #fffdf5;
    color: #5c4033;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .fp-chip:hover { background: #f0e8d8; }
  .fp-chip.active {
    background: #3d2c1e;
    border-color: #3d2c1e;
    color: #f5efe0;
    box-shadow: 2px 2px 0px #c0570e;
  }

  /* RESULTS COUNT */
  .fp-count {
    font-family: 'Caveat', cursive;
    font-size: 18px;
    color: #9c8060;
    margin-bottom: 16px;
  }
  .fp-count span { color: #c0570e; font-weight: 700; }

  /* PROFESSOR CARD */
  .fp-card {
    background: #fffdf5;
    border: 2px solid #c9b99a;
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 14px;
    box-shadow: 4px 4px 0px #c9b99a;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .fp-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #c9b99a;
    background: #faf3e0;
  }
  .fp-card:active { transform: translate(1px,1px); box-shadow: 2px 2px 0px #c9b99a; }

  .fp-prof-avatar {
    width: 58px; height: 58px;
    border-radius: 16px;
    background: #3d2c1e;
    border: 2px solid #c9b99a;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }

  .fp-prof-info { flex: 1; }

  .fp-prof-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .fp-prof-name {
    font-family: 'Caveat', cursive;
    font-size: 22px;
    font-weight: 700;
    color: #3d2c1e;
  }

  .fp-status-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    flex-shrink: 0;
  }
  .fp-status-pill.free { background: #e8f5e9; color: #388e3c; border: 1.5px solid #a5d6a7; }
  .fp-status-pill.busy { background: #fde8e8; color: #c62828; border: 1.5px solid #ef9a9a; }
  .fp-status-pill.away { background: #fff8e1; color: #e65100; border: 1.5px solid #ffe082; }

  .fp-status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
  }
  .fp-status-dot.free { background: #4caf50; }
  .fp-status-dot.busy { background: #f44336; }
  .fp-status-dot.away { background: #ff9800; }

  .fp-prof-dept {
    font-size: 13px;
    color: #9c8060;
    margin-bottom: 10px;
  }

  .fp-prof-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .fp-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 8px;
    background: #f0e8d8;
    color: #5c4033;
    border: 1px solid #d6c5a8;
  }

  .fp-prof-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fp-location {
    font-size: 12px;
    color: #9c8060;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fp-book-btn {
    padding: 7px 18px;
    background: #3d2c1e;
    border: 2px solid #3d2c1e;
    border-radius: 10px;
    color: #f5efe0;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Caveat', cursive;
    font-size: 16px;
    transition: all 0.15s;
    box-shadow: 2px 2px 0px #c0570e;
  }
  .fp-book-btn:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0px #c0570e; }

  /* EMPTY STATE */
  .fp-empty {
    text-align: center;
    padding: 60px 20px;
    color: #9c8060;
  }
  .fp-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .fp-empty-text { font-family: 'Caveat', cursive; font-size: 22px; }

  /* BOTTOM NAV */
  .fp-bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #fffdf5;
    border-top: 2px solid #c9b99a;
    display: flex;
    justify-content: space-around;
    padding: 10px 0 14px;
    z-index: 100;
  }
  .fp-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 4px 16px; border-radius: 10px; transition: background 0.15s;
  }
  .fp-nav-item:hover { background: #f0e8d8; }
  .fp-nav-item-icon { font-size: 20px; }
  .fp-nav-item-label { font-size: 10px; font-weight: 600; color: #9c8060; }
  .fp-nav-item.active .fp-nav-item-label { color: #c0570e; }
`;

const allProfessors = [
  { emoji: '👨‍💻', name: 'Dr. R. Sharma', dept: 'Computer Science', status: 'free', statusLabel: 'free now', location: 'Room 204, CS Block', tags: ['DSA', 'Algorithms', 'C++'], rating: 4.8 },
  { emoji: '👩‍🔬', name: 'Prof. A. Kulkarni', dept: 'Artificial Intelligence', status: 'busy', statusLabel: 'in class', location: 'Room 301, AI Lab', tags: ['ML', 'Deep Learning', 'Python'], rating: 4.9 },
  { emoji: '👨‍🏫', name: 'Dr. V. Mehta', dept: 'Database Systems', status: 'away', statusLabel: 'away', location: 'Faculty Lounge', tags: ['DBMS', 'SQL', 'NoSQL'], rating: 4.6 },
  { emoji: '👩‍💼', name: 'Prof. S. Desai', dept: 'Software Engineering', status: 'free', statusLabel: 'free now', location: 'Room 112, SE Block', tags: ['Agile', 'Design Patterns'], rating: 4.7 },
  { emoji: '🧑‍🔬', name: 'Dr. P. Joshi', dept: 'Computer Networks', status: 'free', statusLabel: 'free now', location: 'Room 209, CS Block', tags: ['Networking', 'TCP/IP', 'Security'], rating: 4.5 },
  { emoji: '👩‍🏫', name: 'Prof. N. Patil', dept: 'Theory of Computation', status: 'busy', statusLabel: 'in class', location: 'Lecture Hall 2', tags: ['TOC', 'Automata', 'Compiler'], rating: 4.4 },
];

const departments = ['All', 'CS', 'AI', 'DBMS', 'SE', 'Networks'];

export default function FindProfessor() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeNav, setActiveNav] = useState('find');

  const filtered = allProfessors.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.dept.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = activeFilter === 'All' || p.tags.some(t => t.includes(activeFilter)) || p.dept.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="fp-page">

        {/* Nav */}
        <div className="fp-nav">
          <div className="fp-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <span className="fp-nav-title">🔍 find a professor</span>
        </div>

        <div className="fp-content">

          {/* Search */}
          <div className="fp-search-wrap">
            <span className="fp-search-icon">🔍</span>
            <input
              className="fp-search"
              placeholder="search by name, department, subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="fp-filters">
            {departments.map(d => (
              <button
                key={d}
                className={`fp-chip ${activeFilter === d ? 'active' : ''}`}
                onClick={() => setActiveFilter(d)}
              >{d}</button>
            ))}
            <button
              className={`fp-chip ${activeFilter === 'free' ? 'active' : ''}`}
              onClick={() => setActiveFilter('free')}
            >🟢 Available Now</button>
          </div>

          {/* Count */}
          <p className="fp-count">showing <span>{filtered.length}</span> professors</p>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="fp-empty">
              <div className="fp-empty-icon">😕</div>
              <div className="fp-empty-text">no professors found!</div>
            </div>
          ) : (
            filtered.map(p => (
              <div className="fp-card" key={p.name} onClick={() => navigate('/student/professor/1')}>
                <div className="fp-prof-avatar">{p.emoji}</div>
                <div className="fp-prof-info">
                  <div className="fp-prof-top">
                    <span className="fp-prof-name">{p.name}</span>
                    <span className={`fp-status-pill ${p.status}`}>
                      <span className={`fp-status-dot ${p.status}`} />
                      {p.statusLabel}
                    </span>
                  </div>
                  <div className="fp-prof-dept">{p.dept} · ⭐ {p.rating}</div>
                  <div className="fp-prof-tags">
                    {p.tags.map(t => <span key={t} className="fp-tag">{t}</span>)}
                  </div>
                  <div className="fp-prof-bottom">
                    <span className="fp-location">📍 {p.location}</span>
                    <button className="fp-book-btn" onClick={e => { e.stopPropagation(); navigate('/student/request'); }}>
                      book →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fp-bottom-nav">
          {[
            { id: 'home', icon: '🏠', label: 'home', path: '/student/dashboard' },
            { id: 'find', icon: '🔍', label: 'find', path: '/student/find' },
            { id: 'map', icon: '🗺️', label: 'map', path: '/student/map' },
            { id: 'ai', icon: '🤖', label: 'AI chat', path: '/student/ai' },
            { id: 'notif', icon: '🔔', label: 'alerts', path: '/student/notifications' },
          ].map(n => (
            <div key={n.id} className={`fp-nav-item ${activeNav === n.id ? 'active' : ''}`}
              onClick={() => { setActiveNav(n.id); navigate(n.path); }}>
              <span className="fp-nav-item-icon">{n.icon}</span>
              <span className="fp-nav-item-label">{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}