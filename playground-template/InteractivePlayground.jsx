'use client';

import { useState, useEffect } from 'react';

/**
 * Standalone Interactive Playground Component
 * 
 * Includes:
 * 1. Build-a-Dev Matcher Configurator
 * 2. Developer Clicker Game
 * 
 * Props:
 * @param {Function} onContactClick - Callback when recruiter clicks "Pre-Fill Contact Form"
 * @param {Function} onChatbotClick - Callback when recruiter clicks "Ask AI Bot About This Stack"
 * @param {string} resumeUrl - Direct download URL for your resume PDF
 */
export default function InteractivePlayground({ onContactClick, onChatbotClick, resumeUrl = "#" }) {
  const [playgroundTab, setPlaygroundTab] = useState('matcher');
  const [matcherSelections, setMatcherSelections] = useState({
    frontend: '',
    backend: '',
    cloud: '',
    specialty: ''
  });

  // Clicker Game State
  const [loc, setLoc] = useState(0);
  const [locPerSec, setLocPerSec] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { id: 'java-api', name: 'Java REST API', cost: 15, lps: 1.5, qty: 0, desc: 'Write Spring Boot controllers. Generates +1.5 LOC/sec.' },
    { id: 'react-components', name: 'React Components', cost: 100, lps: 8, qty: 0, desc: 'Reusable frontend views. Generates +8 LOC/sec.' },
    { id: 'security-audit', name: 'Spring Security Audit', cost: 500, lps: 45, qty: 0, desc: 'Secure endpoints and configure JWT. Generates +45 LOC/sec.' },
    { id: 'ai-integrations', name: 'AI Models Integration', cost: 3000, lps: 260, qty: 0, desc: 'Integrate Gemini API and Agents. Generates +260 LOC/sec.' },
    { id: 'cloud-devops', name: 'Cloud Infrastructure (OCI)', cost: 15000, lps: 1400, qty: 0, desc: 'Deploy auto-scaling APIs. Generates +1,400 LOC/sec.' }
  ]);
  const [clickEffects, setClickEffects] = useState([]);
  const [activeAchievements, setActiveAchievements] = useState([]);

  const PLAYGROUND_ACHIEVEMENTS = [
    { id: 'hello-world', name: '💻 Hello World', req: 10, desc: 'Write your first 10 Lines of Code' },
    { id: 'stack-overflow', name: '🔥 Stack Overflow Expert', req: 500, desc: 'Accumulate 500 Lines of Code' },
    { id: 'framework-architect', name: '🏗️ Framework Architect', req: 5000, desc: 'Unlock 5,000 Lines of Code' },
    { id: 'tech-visionary', name: '👑 Tech Visionary', req: 50000, desc: 'Deploy massive systems at 50,000 Lines of Code' }
  ];

  // Check achievements
  useEffect(() => {
    PLAYGROUND_ACHIEVEMENTS.forEach(ach => {
      if (loc >= ach.req && !activeAchievements.includes(ach.id)) {
        setActiveAchievements(prev => [...prev, ach.id]);
      }
    });
  }, [loc, activeAchievements]);

  // Load clicker stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLoc = localStorage.getItem('playground_loc');
      const savedLps = localStorage.getItem('playground_lps');
      const savedUpgrades = localStorage.getItem('playground_upgrades');
      const savedAchievements = localStorage.getItem('playground_achievements');
      if (savedLoc) setLoc(parseFloat(savedLoc));
      if (savedLps) {
        const parsedLps = parseFloat(savedLps);
        setLocPerSec(parsedLps);
        setClickValue(Math.max(1, Math.floor(parsedLps * 0.1)));
      }
      if (savedAchievements) {
        try {
          setActiveAchievements(JSON.parse(savedAchievements));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedUpgrades) {
        try {
          const parsed = JSON.parse(savedUpgrades);
          setUpgrades(prev => prev.map(up => {
            const match = parsed.find(p => p.id === up.id);
            return match ? { ...up, qty: match.qty, cost: match.cost } : up;
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save clicker stats to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && loc > 0) {
      localStorage.setItem('playground_loc', loc.toString());
      localStorage.setItem('playground_lps', locPerSec.toString());
      localStorage.setItem('playground_upgrades', JSON.stringify(upgrades));
      localStorage.setItem('playground_achievements', JSON.stringify(activeAchievements));
    }
  }, [loc, locPerSec, upgrades, activeAchievements]);

  // LPS Ticker (runs every 100ms for smooth passive gains)
  useEffect(() => {
    if (locPerSec <= 0) return;
    const interval = setInterval(() => {
      setLoc(prev => prev + (locPerSec / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [locPerSec]);

  // Keyboard button click handler
  const handleKeyboardClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLoc(prev => prev + clickValue);
    
    const newEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
      val: clickValue
    };
    setClickEffects(prev => [...prev, newEffect]);
    
    setTimeout(() => {
      setClickEffects(prev => prev.filter(eff => eff.id !== newEffect.id));
    }, 800);
  };

  // Buy upgrade handler
  const buyUpgrade = (upgradeId) => {
    setUpgrades(prev => prev.map(up => {
      if (up.id === upgradeId) {
        if (loc >= up.cost) {
          const nextQty = up.qty + 1;
          const nextCost = Math.round(up.cost * 1.35);
          setLoc(prevLoc => prevLoc - up.cost);
          setLocPerSec(prevLps => prevLps + up.lps);
          
          const newLps = locPerSec + up.lps;
          setClickValue(Math.max(1, Math.floor(newLps * 0.1)));
          return { ...up, qty: nextQty, cost: nextCost };
        }
      }
      return up;
    }));
  };

  const handlePreFillForm = () => {
    if (onContactClick) {
      onContactClick(matcherSelections);
    } else {
      alert(`Build-a-Dev Selection:\n- Frontend: ${matcherSelections.frontend}\n- Backend: ${matcherSelections.backend}\n- Cloud: ${matcherSelections.cloud}\n- Specialty: ${matcherSelections.specialty}\n\n(Define onContactClick callback prop to handle this action)`);
    }
  };

  const handleMatcherChatbot = () => {
    if (onChatbotClick) {
      onChatbotClick(matcherSelections);
    } else {
      alert(`AI Inquiry for stack: ${matcherSelections.frontend}, ${matcherSelections.backend}, ${matcherSelections.cloud}, ${matcherSelections.specialty}.\n\n(Define onChatbotClick callback prop to handle this action)`);
    }
  };

  return (
    <section id="playground">
      <p className="section-label">Interactive Playground</p>
      <h2 className="section-title">Developer Playground</h2>
      <p className="playground-subtitle">
        Put development skills to the test! Use the <strong>Build-a-Dev Matcher</strong> to check stack compatibility, or play the <strong>Developer Clicker</strong> game to write lines of code.
      </p>

      <div className="playground-container">
        <div className="playground-tabs">
          <button
            className={`playground-tab-btn ${playgroundTab === 'matcher' ? 'active' : ''}`}
            onClick={() => setPlaygroundTab('matcher')}
          >
            🛠️ Build-a-Dev Matcher
          </button>
          <button
            className={`playground-tab-btn ${playgroundTab === 'clicker' ? 'active' : ''}`}
            onClick={() => setPlaygroundTab('clicker')}
          >
            ⌨️ Developer Clicker
          </button>
        </div>

        <div className="playground-panel">
          {playgroundTab === 'matcher' ? (
            <div className="matcher-grid">
              <div className="matcher-options">
                <div className="matcher-category">
                  <h4>Frontend Skills</h4>
                  <div className="matcher-chips">
                    {['Next.js / React', 'Tailwind CSS', 'HTML5 / CSS3', 'JavaScript (ES6+)'].map((skill) => (
                      <button
                        key={skill}
                        className={`matcher-chip ${matcherSelections.frontend === skill ? 'selected' : ''}`}
                        onClick={() => setMatcherSelections(prev => ({ ...prev, frontend: prev.frontend === skill ? '' : skill }))}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="matcher-category">
                  <h4>Backend & Databases</h4>
                  <div className="matcher-chips">
                    {['Java / Spring Boot', 'REST APIs & JWT', 'Oracle SQL / MySQL', 'Node.js / Express'].map((skill) => (
                      <button
                        key={skill}
                        className={`matcher-chip ${matcherSelections.backend === skill ? 'selected' : ''}`}
                        onClick={() => setMatcherSelections(prev => ({ ...prev, backend: prev.backend === skill ? '' : skill }))}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="matcher-category">
                  <h4>Cloud & Tools</h4>
                  <div className="matcher-chips">
                    {['Oracle Cloud (OCI)', 'Vercel Deployments', 'Docker Containers', 'Git / GitHub'].map((skill) => (
                      <button
                        key={skill}
                        className={`matcher-chip ${matcherSelections.cloud === skill ? 'selected' : ''}`}
                        onClick={() => setMatcherSelections(prev => ({ ...prev, cloud: prev.cloud === skill ? '' : skill }))}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="matcher-category">
                  <h4>Specialty & Focus</h4>
                  <div className="matcher-chips">
                    {['Generative AI / LLMs', 'Intelligent Chatbots', 'Hospital/School Management', 'Commercial Café/Salon Sites'].map((skill) => (
                      <button
                        key={skill}
                        className={`matcher-chip ${matcherSelections.specialty === skill ? 'selected' : ''}`}
                        onClick={() => setMatcherSelections(prev => ({ ...prev, specialty: prev.specialty === skill ? '' : skill }))}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="matcher-results-col">
                {matcherSelections.frontend && matcherSelections.backend && matcherSelections.cloud && matcherSelections.specialty ? (
                  <div className="scorecard-card">
                    <div className="scorecard-header">
                      <h3>📋 Recruiter Compatibility Match</h3>
                    </div>
                    <div className="scorecard-body">
                      <div className="scorecard-detail-item">
                        <strong>Frontend Match:</strong> {matcherSelections.frontend} (100% Core Experience)
                      </div>
                      <div className="scorecard-detail-item">
                        <strong>Backend/DB Match:</strong> {matcherSelections.backend} (100% Core Experience)
                      </div>
                      <div className="scorecard-detail-item">
                        <strong>Infrastructure:</strong> {matcherSelections.cloud} (100% Core Experience)
                      </div>
                      <div className="scorecard-detail-item">
                        <strong>Focus Match:</strong> {matcherSelections.specialty} (100% Core Experience)
                      </div>
                      <div className="scorecard-desc">
                        ✨ <strong>Verdict: 100% Perfect Fit!</strong> Highly skilled dev candidate matches this technology profile.
                      </div>
                    </div>
                    <div className="scorecard-actions">
                      <button onClick={handlePreFillForm} className="scorecard-btn scorecard-btn-primary">
                        💬 Pre-Fill Contact Form
                      </button>
                      <a
                        href={resumeUrl}
                        download="Developer_Resume.pdf"
                        className="scorecard-btn scorecard-btn-secondary"
                      >
                        📄 Download Official Resume
                      </a>
                      <button onClick={handleMatcherChatbot} className="scorecard-btn scorecard-btn-secondary">
                        🤖 Ask AI Bot About This Stack
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="matcher-placeholder-wrap">
                    <div className="match-radial">
                      <svg>
                        <circle className="circle-bg" cx="80" cy="80" r="70" />
                        <circle
                          className="circle-progress"
                          cx="80"
                          cy="80"
                          r="70"
                          strokeDasharray={440}
                          strokeDashoffset={
                            440 - (440 * (
                              (matcherSelections.frontend ? 25 : 0) +
                              (matcherSelections.backend ? 25 : 0) +
                              (matcherSelections.cloud ? 25 : 0) +
                              (matcherSelections.specialty ? 25 : 0)
                            )) / 100
                          }
                        />
                      </svg>
                      <div className="match-percentage">
                        {(matcherSelections.frontend ? 25 : 0) +
                         (matcherSelections.backend ? 25 : 0) +
                         (matcherSelections.cloud ? 25 : 0) +
                         (matcherSelections.specialty ? 25 : 0)}%
                      </div>
                    </div>
                    <p className="matcher-placeholder">
                      Select one skill from each category above to generate a customized Developer Match Report.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="clicker-grid">
              <div className="clicker-main-col">
                <div className="clicker-stats">
                  <p className="clicker-loc-label">Lines of Code Written</p>
                  <p className="clicker-loc-value">{Math.floor(loc).toLocaleString()}</p>
                  <p className="clicker-lps-value">
                    Development Rate: <span>{locPerSec.toFixed(1)} LOC/sec</span> (+{clickValue} per click)
                  </p>
                </div>

                <div className="clicker-keyboard-wrapper">
                  <button
                    className="clicker-keyboard-btn"
                    onClick={handleKeyboardClick}
                    aria-label="Write Code Keyboard"
                  >
                    <span>⌨️</span>
                  </button>
                  {clickEffects.map((eff) => (
                    <span
                      key={eff.id}
                      className="floating-click-effect"
                      style={{ left: `${eff.x}px`, top: `${eff.y}px` }}
                    >
                      +{eff.val} LOC
                    </span>
                  ))}
                </div>

                <div className="clicker-achievements">
                  <h4>🏅 Achievements</h4>
                  <div className="achievements-shelf">
                    {PLAYGROUND_ACHIEVEMENTS.map((ach) => {
                      const isUnlocked = activeAchievements.includes(ach.id);
                      return (
                        <div
                          key={ach.id}
                          className={`achievement-badge ${isUnlocked ? 'unlocked' : ''}`}
                          title={`${ach.desc} (${isUnlocked ? 'Unlocked' : 'Locked'})`}
                        >
                          <span>{isUnlocked ? '✅' : '🔒'}</span> {ach.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="clicker-shop-col">
                {upgrades.map((up) => {
                  const isAffordable = loc >= up.cost;
                  return (
                    <div key={up.id} className="shop-item-card">
                      <div className="shop-item-info">
                        <span className="shop-item-title">
                          {up.name} {up.qty > 0 && <span className="shop-item-qty">x{up.qty}</span>}
                        </span>
                        <span className="shop-item-desc">{up.desc}</span>
                        <span className="shop-item-cost">💸 Cost: {up.cost} LOC</span>
                      </div>
                      <button
                        className="shop-buy-btn"
                        disabled={!isAffordable}
                        onClick={() => buyUpgrade(up.id)}
                      >
                        Buy Upgrade
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
