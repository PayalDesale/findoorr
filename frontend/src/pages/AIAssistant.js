import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ai-page {
    min-height: 100vh;
    background-color: #f5efe0;
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(180,160,120,0.18) 60px, rgba(180,160,120,0.18) 62px),
      repeating-linear-gradient(180deg, transparent, transparent 60px, rgba(180,160,120,0.12) 60px, rgba(180,160,120,0.12) 62px);
    font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column; height: 100vh;
  }

  .ai-nav {
    background: #fffdf5; border-bottom: 2px solid #c9b99a;
    padding: 14px 24px; display: flex; align-items: center; gap: 14px;
    box-shadow: 0 3px 0px #c9b99a; flex-shrink: 0;
  }
  .ai-back {
    width: 36px; height: 36px; background: #f0e8d8; border: 2px solid #c9b99a;
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; flex-shrink: 0;
  }
  .ai-back:hover { background: #e8dcc8; transform: translateY(-1px); }
  .ai-nav-info { flex: 1; }
  .ai-nav-title { font-family: 'Caveat', cursive; font-size: 22px; font-weight: 700; color: #3d2c1e; }
  .ai-nav-sub { font-size: 11px; color: #9c8060; display: flex; align-items: center; gap: 5px; }
  .ai-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf50; display: inline-block; animation: ai-pulse 1.5s infinite; }
  @keyframes ai-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ai-nav-avatar {
    width: 40px; height: 40px; background: linear-gradient(135deg, #3d2c1e, #c0570e);
    border-radius: 12px; border: 2px solid #c9b99a;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  .ai-chat-area {
    flex: 1; overflow-y: auto; padding: 20px;
    display: flex; flex-direction: column; gap: 16px;
    max-width: 760px; width: 100%; margin: 0 auto;
    padding-bottom: 20px;
  }

  .ai-welcome {
    background: #fffdf5; border: 2px solid #c9b99a; border-radius: 20px;
    padding: 24px; box-shadow: 4px 4px 0px #c9b99a; text-align: center; margin-bottom: 8px;
  }
  .ai-welcome-icon { font-size: 48px; margin-bottom: 10px; }
  .ai-welcome-title { font-family: 'Caveat', cursive; font-size: 26px; font-weight: 700; color: #3d2c1e; margin-bottom: 6px; }
  .ai-welcome-sub { font-size: 13px; color: #9c8060; line-height: 1.5; }

  .ai-quick-title { font-family: 'Caveat', cursive; font-size: 16px; color: #9c8060; text-align: center; margin-bottom: 10px; }
  .ai-quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .ai-quick-prompt {
    background: #fffdf5; border: 2px solid #d6c5a8; border-radius: 12px;
    padding: 12px 14px; cursor: pointer; transition: all 0.15s;
    box-shadow: 2px 2px 0px #d6c5a8;
  }
  .ai-quick-prompt:hover { border-color: #c0570e; box-shadow: 3px 3px 0px #c0570e; background: #faf3e0; transform: translate(-1px,-1px); }
  .ai-quick-prompt-icon { font-size: 18px; margin-bottom: 4px; }
  .ai-quick-prompt-text { font-size: 12px; font-weight: 600; color: #5c4033; line-height: 1.4; }

  .ai-msg-row { display: flex; gap: 10px; align-items: flex-end; }
  .ai-msg-row.user { flex-direction: row-reverse; }

  .ai-msg-avatar {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    border: 2px solid #c9b99a;
  }
  .ai-msg-avatar.bot { background: linear-gradient(135deg, #3d2c1e, #c0570e); }
  .ai-msg-avatar.user { background: #3d2c1e; color: #f5efe0; font-weight: 700; font-size: 13px; }

  .ai-bubble {
    max-width: 72%; padding: 12px 16px; border-radius: 18px; border: 2px solid;
    line-height: 1.6; font-size: 14px; position: relative;
  }
  .ai-bubble.bot {
    background: #fffdf5; border-color: #c9b99a; color: #3d2c1e;
    border-bottom-left-radius: 4px; box-shadow: 3px 3px 0px #c9b99a;
  }
  .ai-bubble.user {
    background: #3d2c1e; border-color: #3d2c1e; color: #f5efe0;
    border-bottom-right-radius: 4px; box-shadow: 3px 3px 0px #c0570e;
  }
  .ai-bubble-time { font-size: 10px; color: #bfaa90; margin-top: 6px; display: block; }
  .ai-bubble.user .ai-bubble-time { color: rgba(245,239,224,0.5); text-align: right; }

  .ai-typing { display: flex; gap: 4px; align-items: center; padding: 14px 16px; }
  .ai-typing-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #c9b99a;
    animation: ai-typing 1.2s ease-in-out infinite;
  }
  .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes ai-typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  .ai-error { background: #fde8e8; border: 1.5px solid #ef9a9a; border-radius: 10px; padding: 10px 14px; color: #c62828; font-size: 13px; margin-top: 4px; }

  .ai-input-area {
    background: #fffdf5; border-top: 2px solid #c9b99a;
    padding: 14px 20px; flex-shrink: 0; box-shadow: 0 -3px 0px #c9b99a;
  }
  .ai-input-wrap { max-width: 760px; margin: 0 auto; }
  .ai-suggestion-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .ai-suggestion {
    font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px;
    background: #f0e8d8; border: 1.5px solid #d6c5a8; color: #5c4033;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .ai-suggestion:hover { background: #e8dcc8; border-color: #c0570e; color: #3d2c1e; }
  .ai-input-row { display: flex; gap: 10px; align-items: flex-end; }
  .ai-input {
    flex: 1; padding: 12px 16px; background: #faf6ee; border: 2px solid #d6c5a8;
    border-radius: 14px; color: #3d2c1e; font-size: 14px; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border 0.2s; resize: none;
    min-height: 46px; max-height: 120px; line-height: 1.5;
  }
  .ai-input::placeholder { color: #bfaa90; }
  .ai-input:focus { border-color: #c0570e; background: #fffdf5; }
  .ai-send-btn {
    width: 46px; height: 46px; background: #3d2c1e; border: 2px solid #3d2c1e;
    border-radius: 12px; color: #f5efe0; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 3px 3px 0px #c0570e; transition: all 0.15s; flex-shrink: 0;
  }
  .ai-send-btn:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0px #c0570e; }
  .ai-send-btn:active { transform: translate(1px,1px); box-shadow: 1px 1px 0px #c0570e; }
  .ai-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const quickPrompts = [
  { icon: '📍', text: 'Where is Dr. Sharma right now?' },
  { icon: '📅', text: 'Who is free for a meeting today?' },
  { icon: '🕐', text: "What are Prof. Kulkarni's office hours?" },
  { icon: '📋', text: 'Show me the CS department schedule' },
  { icon: '❓', text: 'How do I request a meeting on Findoorr?' },
  { icon: '🗺️', text: 'Where is the AI Lab on campus?' },
];

const suggestions = ['Is Dr. Mehta free?', 'Cancel my meeting', 'Who teaches DSA?', 'Room 204 location'];

const SYSTEM_PROMPT = `You are Findoorr AI, a smart campus assistant for an Indian engineering college. You help students find professors, check availability, navigate campus, and manage meetings.

You know these professors:
- Dr. Rajesh Sharma (Computer Science) - Room 204, CS Block - teaches DSA, Algorithms, C++ - office hours Mon/Wed 11AM-12PM - currently FREE
- Prof. Anjali Kulkarni (Artificial Intelligence) - AI Lab Block B - teaches ML, Deep Learning, Python - office hours Tue/Fri 10AM-11AM - currently IN CLASS
- Dr. Vikas Mehta (Database Systems) - Faculty Lounge - teaches DBMS, SQL - office hours Mon/Thu 2PM-4PM - currently AWAY
- Prof. Sneha Desai (Software Engineering) - Room 112, SE Block - teaches Agile, Design Patterns - office hours Wed/Fri 3PM-5PM - currently FREE
- Dr. Pankaj Joshi (Computer Networks) - Room 209, CS Block - teaches Networking, TCP/IP - office hours Tue/Thu 11AM-1PM - currently FREE

Campus locations:
- CS Block: Ground floor, main building entrance left
- AI Lab: Block B, 2nd floor near elevator
- Library: Central building, all floors
- Canteen: Block C, ground floor
- Admin Block: Main gate, right side
- Sports Ground: Behind Block D

Meeting request process: Go to Find Professor > Click professor > Request Meeting > Choose date/time/type > Submit

Keep responses helpful, friendly, concise and campus-focused. Use emojis naturally. If asked something outside campus scope, gently redirect to campus topics.`;

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatRef = useRef(null);
  const userName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'there';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setShowWelcome(false);

    const userMsg = {
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
          ],
          max_tokens: 500,
          temperature: 0.7,
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        const botMsg = {
          role: 'bot',
          text: data.choices[0].message.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      const errMsg = {
        role: 'bot',
        text: '⚠️ Sorry, I couldn\'t connect right now. Please check your internet and try again!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ai-page">

        <div className="ai-nav">
          <div className="ai-back" onClick={() => navigate('/student/dashboard')}>←</div>
          <div className="ai-nav-info">
            <div className="ai-nav-title">🤖 findoorr AI</div>
            <div className="ai-nav-sub"><span className="ai-online-dot" /> online · powered by Groq + Llama 3</div>
          </div>
          <div className="ai-nav-avatar">🤖</div>
        </div>

        <div className="ai-chat-area" ref={chatRef}>

          {showWelcome && (
            <>
              <div className="ai-welcome">
                <div className="ai-welcome-icon">🤖</div>
                <div className="ai-welcome-title">hey {userName}! I'm your AI assistant</div>
                <div className="ai-welcome-sub">
                  Ask me anything about professor schedules, campus locations,<br />
                  office hours, or how to book meetings. I'm here to help!
                </div>
              </div>
              <div className="ai-quick-title">✦ try asking me...</div>
              <div className="ai-quick-grid">
                {quickPrompts.map(q => (
                  <div key={q.text} className="ai-quick-prompt" onClick={() => sendMessage(q.text)}>
                    <div className="ai-quick-prompt-icon">{q.icon}</div>
                    <div className="ai-quick-prompt-text">{q.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`ai-msg-row ${m.role}`}>
              <div className={`ai-msg-avatar ${m.role}`}>{m.role === 'bot' ? '🤖' : userInitial}</div>
              <div className={`ai-bubble ${m.role}`}>
                {m.text.split('\n').map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
                <span className="ai-bubble-time">{m.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-msg-row">
              <div className="ai-msg-avatar bot">🤖</div>
              <div className="ai-bubble bot">
                <div className="ai-typing">
                  <div className="ai-typing-dot" />
                  <div className="ai-typing-dot" />
                  <div className="ai-typing-dot" />
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="ai-input-area">
          <div className="ai-input-wrap">
            <div className="ai-suggestion-chips">
              {suggestions.map(s => (
                <span key={s} className="ai-suggestion" onClick={() => sendMessage(s)}>{s}</span>
              ))}
            </div>
            <div className="ai-input-row">
              <textarea
                className="ai-input"
                placeholder="ask me anything about your campus..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                rows={1}
                disabled={loading}
              />
              <button className="ai-send-btn" onClick={() => sendMessage()} disabled={loading}>
                {loading ? '⏳' : '▶'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}