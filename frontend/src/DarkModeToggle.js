import React from 'react';
import { useTheme } from './ThemeContext';

const styles = `
  .theme-toggle {
    width: 52px; height: 28px; border-radius: 20px;
    border: 2px solid #c9b99a; cursor: pointer;
    position: relative; transition: all 0.3s ease;
    display: flex; align-items: center; padding: 2px;
    flex-shrink: 0;
  }
  .theme-toggle.light { background: #f0e8d8; border-color: #c9b99a; }
  .theme-toggle.dark { background: #3d2c1e; border-color: #c0570e; }
  .theme-toggle-knob {
    width: 20px; height: 20px; border-radius: 50%;
    transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
    font-size: 12px; position: absolute;
  }
  .theme-toggle.light .theme-toggle-knob { left: 3px; background: #c0570e; }
  .theme-toggle.dark .theme-toggle-knob { left: 25px; background: #f5efe0; }
`;

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <style>{styles}</style>
      <div className={`theme-toggle ${isDark ? 'dark' : 'light'}`} onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <div className="theme-toggle-knob">{isDark ? '🌙' : '☀️'}</div>
      </div>
    </>
  );
}