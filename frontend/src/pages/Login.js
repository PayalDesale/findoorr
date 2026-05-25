import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { saveToken } from '../api';

const API_URL = process.env.REACT_APP_API_URL || 'https://findoorr-production.up.railway.app';

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wiggle {
    0%,100% { transform: rotate(-1deg); }
    50%      { transform: rotate(1deg); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .findoorr-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; padding: 24px;
  }

  .findoorr-card {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 20px;
    padding: 44px 40px; width: 100%; max-width: 420px;
    box-shadow: 6px 6px 0px #c9b99a;
    animation: fadeUp 0.5s ease-out; position: relative;
  }
  .findoorr-card::before {
    content: ''; position: absolute;
    top: 10px; left: 10px; right: -10px; bottom: -10px;
    border: 2px dashed rgba(180,150,100,0.25); border-radius: 20px; pointer-events: none;
  }

  .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .logo-pin { font-size: 28px; animation: wiggle 3s ease-in-out infinite; display: inline-block; }
  .logo-text { font-family: 'Caveat', cursive; font-size: 36px; font-weight: 700; color: #3d2c1e; letter-spacing: -0.5px; }
  .logo-text span { color: #c0570e; }
  .tagline { font-family: 'Caveat', cursive; font-size: 16px; color: #9c8060; margin-bottom: 28px; }

  .tab-row { display: flex; background: #f0e8d8; border-radius: 12px; padding: 4px; margin-bottom: 24px; gap: 4px; border: 1.5px solid #d6c5a8; }
  .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 9px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif; }
  .tab-btn.active { background: #3d2c1e; color: #f5efe0; box-shadow: 2px 2px 0px #c9b99a; }
  .tab-btn.inactive { background: transparent; color: #9c8060; }

  .role-row { display: flex; gap: 10px; margin-bottom: 22px; }
  .role-btn { flex: 1; padding: 12px 8px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .role-btn.active { background: #3d2c1e; border: 2px solid #3d2c1e; color: #f5efe0; box-shadow: 3px 3px 0px #c0570e; }
  .role-btn.inactive { background: #f0e8d8; border: 2px solid #d6c5a8; color: #9c8060; }
  .role-emoji { font-size: 22px; }

  .field-label { font-family: 'Caveat', cursive; font-size: 16px; font-weight: 600; color: #5c4033; margin-bottom: 6px; display: block; }
  .field-input { width: 100%; padding: 12px 14px; background: #faf6ee; border: 1.5px solid #d6c5a8; border-radius: 10px; color: #3d2c1e; font-size: 14px; margin-bottom: 16px; outline: none; transition: border 0.2s ease; font-family: 'DM Sans', sans-serif; }
  .field-input::placeholder { color: #bfaa90; }
  .field-input:focus { border-color: #c0570e; background: #fffdf5; }

  .submit-btn { width: 100%; padding: 14px; background: #3d2c1e; border: 2px solid #3d2c1e; border-radius: 12px; color: #f5efe0; font-weight: 700; cursor: pointer; margin-top: 4px; font-family: 'Caveat', cursive; font-size: 20px; letter-spacing: 0.3px; transition: all 0.15s ease; box-shadow: 4px 4px 0px #c0570e; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .submit-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #c0570e; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

  .error-box { background: #fdf0e8; border: 1.5px solid #e8b49a; border-radius: 10px; padding: 10px 14px; color: #c0570e; margin-bottom: 16px; font-family: 'Caveat', cursive; font-size: 15px; }
  .success-box { background: #e8f5e9; border: 1.5px solid #a5d6a7; border-radius: 10px; padding: 10px 14px; color: #388e3c; margin-bottom: 16px; font-family: 'Caveat', cursive; font-size: 15px; }

  .footer-text { text-align: center; margin-top: 18px; color: #9c8060; font-size: 13px; }
  .footer-link { color: #c0570e; cursor: pointer; font-weight: 600; text-decoration: underline; text-decoration-style: wavy; }

  .stamp { position: absolute; top: -16px; right: 24px; background: #c0570e; color: #fff; font-family: 'Caveat', cursive; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 20px; transform: rotate(2deg); box-shadow: 2px 2px 0px #3d2c1e; }

  .extra-fields { margin-bottom: 0; }
`;

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ⭐ KEY FUNCTION: Firebase login ke baad Railway JWT bhi save karo
  const syncWithBackend = async (email, password, userName, userRole) => {
    // Step 1: Login try karo Railway pe
    try {
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginData.token) {
        saveToken(loginData.token);
        console.log('✅ JWT saved from login');
        return loginData;
      }
    } catch (e) {
      console.log('Login attempt failed:', e.message);
    }

    // Step 2: Agar login fail hua (user Railway mein nahi hai) toh register karo
    try {
      const regRes = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || email.split('@')[0],
          email,
          password,
          role: userRole || 'student',
          department: '',
        }),
      });
      const regData = await regRes.json();
      if (regData.token) {
        saveToken(regData.token);
        console.log('✅ JWT saved from auto-register');
        return regData;
      }
    } catch (e) {
      console.log('Auto-register failed:', e.message);
    }

    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!form.email || !form.password) { setError('fill in all fields first!'); return; }
    if (mode === 'register' && !form.name) { setError('we need your name!'); return; }

    setLoading(true);
    try {
      if (mode === 'register') {
        // 1. Firebase account banao
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

        // 2. Firebase mein naam set karo
        await updateProfile(cred.user, { displayName: form.name });

        // 3. Firestore mein save karo
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: form.name,
          email: form.email,
          role: role,
          department: form.department || '',
          phone: form.phone || '',
          createdAt: new Date().toISOString(),
        });

        // 4. Railway backend mein register karo + JWT lo
        try {
          const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              password: form.password,
              role: role,
              department: form.department || '',
            }),
          });
          const data = await res.json();
          if (data.token) {
            saveToken(data.token);
            console.log('✅ JWT saved on register');
          }
        } catch (backendErr) {
          console.log('Backend register failed, Firebase only');
        }

        setSuccess('account created! logging you in... 🎉');
        setTimeout(() => navigate(role === 'student' ? '/student/dashboard' : '/professor/dashboard'), 1000);

      } else {
        // LOGIN FLOW

        // 1. Firebase se login karo
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);

        // 2. ⭐ Railway backend se JWT lo aur save karo
        // Agar user Railway mein nahi hai toh auto-register karta hai
        const userName = cred.user.displayName || form.email.split('@')[0];
        await syncWithBackend(form.email, form.password, userName, role);

        // 3. Dashboard pe jao
        navigate(role === 'student' ? '/student/dashboard' : '/professor/dashboard');
      }
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'that email is already registered!',
        'auth/invalid-email': 'that email looks invalid!',
        'auth/weak-password': 'password must be at least 6 characters!',
        'auth/user-not-found': 'no account found with that email!',
        'auth/wrong-password': 'wrong password — try again!',
        'auth/invalid-credential': 'wrong email or password!',
        'auth/too-many-requests': 'too many attempts — try again later!',
      };
      setError(msgs[err.code] || 'something went wrong, try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div className="findoorr-page">
        <div className="findoorr-card">
          <div className="stamp">beta 🌿</div>

          <div className="logo-row">
            <span className="logo-pin">📍</span>
            <span className="logo-text">find<span>oorr</span></span>
          </div>
          <p className="tagline">find your prof. no more empty classrooms.</p>

          <div className="tab-row">
            <button className={`tab-btn ${mode === 'login' ? 'active' : 'inactive'}`} onClick={() => { setMode('login'); setError(''); }}>sign in</button>
            <button className={`tab-btn ${mode === 'register' ? 'active' : 'inactive'}`} onClick={() => { setMode('register'); setError(''); }}>sign up</button>
          </div>

          <div className="role-row">
            <button className={`role-btn ${role === 'student' ? 'active' : 'inactive'}`} onClick={() => setRole('student')}>
              <span className="role-emoji">🎓</span> student
            </button>
            <button className={`role-btn ${role === 'professor' ? 'active' : 'inactive'}`} onClick={() => setRole('professor')}>
              <span className="role-emoji">👨‍🏫</span> professor
            </button>
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}
          {success && <div className="success-box">✅ {success}</div>}

          {mode === 'register' && (
            <div className="extra-fields">
              <label className="field-label">your name</label>
              <input className="field-input" placeholder="e.g. Payal Desale" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />

              <label className="field-label">department</label>
              <input className="field-input" placeholder="e.g. Computer Engineering" value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })} />

              <label className="field-label">phone (optional)</label>
              <input className="field-input" placeholder="e.g. 9876543210" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          )}

          <label className="field-label">email</label>
          <input className="field-input" type="email" placeholder="you@mitaoe.ac.in" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />

          <label className="field-label">password</label>
          <input className="field-input" type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" /> {mode === 'login' ? 'signing in...' : 'creating account...'}</>
              : mode === 'login' ? "let's go →" : "create account →"
            }
          </button>

          <p className="footer-text">
            {mode === 'login' ? "new here? " : "already joined? "}
            <span className="footer-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'sign up' : 'sign in'}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}