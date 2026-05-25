'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [quickRead, setQuickRead] = useState(false);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! 👋 I'm Mrunali's AI Assistant. Ask me anything about her skills, experience, projects, or how to contact her!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef(null);

  // Scroll to Top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom cyber cursor state
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('');

  useEffect(() => {
    document.body.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--dot-x', `${e.clientX}px`);
        cursorRef.current.style.setProperty('--dot-y', `${e.clientY}px`);
      }
    };

    const handleMouseDown = () => {
      setCursorState(prev => prev.includes('hovered') ? 'clicked hovered' : 'clicked');
    };

    const handleMouseUp = () => {
      setCursorState(prev => prev.includes('hovered') ? 'hovered' : '');
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .svc-card, .project-card, .stats-card, .cert-pill, .award-pill, .social-pill, .hamburger, .chatbot-toggle-btn')) {
        setCursorState(prev => prev.includes('clicked') ? 'clicked hovered' : 'hovered');
      } else {
        setCursorState(prev => prev.includes('clicked') ? 'clicked' : '');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Scroll chatbot to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Monitor scroll for Go to Top button
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // 3D Canvas Background Animation (Interactive 3D Digital Wave/Mesh Terrain)
  useEffect(() => {
    const canvas = document.getElementById('bg-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let mouse = { x: width / 2, y: height / 2, active: false };
    let time = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      // Semi-clear canvas to create smooth trails
      ctx.fillStyle = 'rgba(11, 12, 16, 0.18)';
      ctx.fillRect(0, 0, width, height);

      time += 0.5;

      // (Ring coordinates are now updated on a separate, high-performance requestAnimationFrame loop)

      // Terrain parameters
      const cols = 28;
      const rows = 28;
      const fov = 350;
      const floorY = height * 0.70; // plane height
      const rowDistance = 38;
      const scrollOffset = (time * 0.8) % rowDistance;

      const projected = [];

      // Calculate all 3D mesh points
      for (let c = 0; c < cols; c++) {
        projected[c] = [];
        for (let r = 0; r < rows; r++) {
          // X: centered around center of viewport
          let x = (c - cols / 2) * 75;
          // Z: depth of grid rows scrolling forward
          let z = (r * rowDistance) + 140 - scrollOffset;

          // Multi-frequency waves for natural flow
          let baseY = Math.sin(x * 0.0035 + time * 0.035) * Math.cos(z * 0.0035 + time * 0.02) * 55;
          baseY += Math.sin((x + z) * 0.0015 + time * 0.012) * 25;

          // Valley structure: raise side coordinates to frame the text content
          let centerDist = Math.abs(c - cols / 2) / (cols / 2);
          let elevation = Math.pow(centerDist, 2.2) * 160;
          let totalBaseY = baseY + elevation;

          // Projected baseline screen space positions
          let scale = fov / (fov + z);
          let px = x * scale + width / 2;
          let py = (floorY - totalBaseY) * scale + height / 2;

          // Distance check for real-time cursor deformation (ripple effect)
          let dist = 99999;
          let ripple = 0;
          if (mouse.active) {
            let dx = px - mouse.x;
            let dy = py - mouse.y;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 240) {
              let force = 1 - dist / 240;
              // Propagate ripples outward based on screen distance
              ripple = Math.sin(dist * 0.05 - time * 0.1) * 45 * Math.pow(force, 1.5);
            }
          }

          let finalY = totalBaseY + ripple;
          let finalPy = (floorY - finalY) * scale + height / 2;

          // Fade coordinates into the depth (atmospheric distance haze)
          let alpha = (1 - z / 1100);
          if (z < 160) {
            alpha *= Math.max(0, (z - 100) / 60); // smooth clip close to lens
          }
          alpha = Math.max(0, Math.min(0.24, alpha));

          projected[c][r] = {
            x: px,
            y: finalPy,
            alpha: alpha,
            z: z,
            distToMouse: dist
          };
        }
      }

      // Drawing function for grid lines connecting vertices
      const drawGridLine = (p1, p2) => {
        let avgZ = (p1.z + p2.z) / 2;
        let alpha = (1 - avgZ / 1100);
        if (avgZ < 160) {
          alpha *= Math.max(0, (avgZ - 100) / 60);
        }
        alpha = Math.max(0, Math.min(0.24, alpha));

        if (alpha <= 0) return;

        let avgDist = (p1.distToMouse + p2.distToMouse) / 2;
        let mouseRatio = 0;
        if (mouse.active && avgDist < 200) {
          mouseRatio = Math.pow(1 - avgDist / 200, 1.5);
        }

        // Color shift from cyber-green (#64ffda) to accent-violet (#7f77dd) on cursor proximity
        let r = Math.floor(100 * (1 - mouseRatio) + 127 * mouseRatio);
        let g = Math.floor(255 * (1 - mouseRatio) + 119 * mouseRatio);
        let b = Math.floor(218 * (1 - mouseRatio) + 221 * mouseRatio);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * (0.55 + mouseRatio * 0.45)})`;
        ctx.lineWidth = mouseRatio > 0 ? 0.8 + mouseRatio * 0.8 : 0.65;
        ctx.stroke();
      };

      // Loop to render horizontal and vertical grid lines
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          let p = projected[c][r];

          // Connect horizontal mesh lines
          if (c < cols - 1) {
            drawGridLine(p, projected[c + 1][r]);
          }
          // Connect vertical mesh lines
          if (r < rows - 1) {
            drawGridLine(p, projected[c][r + 1]);
          }

          // Draw small glowing data points at specific intervals on the mesh grid
          if ((c + r) % 4 === 0) {
            let dotAlpha = p.alpha;
            if (p.z < 160) {
              dotAlpha *= Math.max(0, (p.z - 100) / 60);
            }
            if (dotAlpha > 0) {
              let mouseRatio = 0;
              if (mouse.active && p.distToMouse < 200) {
                mouseRatio = Math.pow(1 - p.distToMouse / 200, 1.5);
              }
              let rColor = Math.floor(100 * (1 - mouseRatio) + 127 * mouseRatio);
              let gColor = Math.floor(255 * (1 - mouseRatio) + 119 * mouseRatio);
              let bColor = Math.floor(218 * (1 - mouseRatio) + 221 * mouseRatio);

              ctx.beginPath();
              ctx.arc(p.x, p.y, (1 - p.z / 1100) * 1.8 + 0.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${dotAlpha * (0.85 + mouseRatio * 0.15)})`;
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Interactive Dev Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'System initialized. Welcome to Mrunali\'s Terminal OS v1.0.0.' }
  ]);
  const [isAutotyping, setIsAutotyping] = useState(true);
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const executeCommand = (cmdText) => {
    const cmd = cmdText.trim().toLowerCase();
    if (!cmd) return;

    let response = [];
    switch (cmd) {
      case 'help':
        response = [
          'Available commands:',
          '  info     - About Mrunali',
          '  skills   - Core tech stack',
          '  projects - Featured developments',
          '  contact  - Get in touch',
          '  stats    - Key metrics',
          '  clear    - Clear terminal logs'
        ];
        break;
      case 'info':
        response = [
          'Mrunali Hatzade — Full Stack Developer & AI Explorer.',
          'Graduated in 2025 in ENTC Engineering from DYPIEMR, Pune.',
          'Passionate about backend services (Java/Spring Boot), interactive',
          'frontends (React/Next.js), DevOps, and building AI-first apps.'
        ];
        break;
      case 'skills':
        response = [
          'Core Technologies:',
          '  Frontend : React, Next.js, HTML5, CSS3, Tailwind CSS, JS/TS',
          '  Backend  : Java, Spring Boot, Spring Security, JWT, Node.js, Python',
          '  Databases: PostgreSQL, MySQL, MongoDB, Prisma ORM',
          '  AI & Cloud: LLMs, LangChain, OCI AI Associate, AWS, Docker'
        ];
        break;
      case 'projects':
        response = [
          'Featured Projects:',
          '  1. Café Aura        - Next.js, CSS, Tailwind (Café reservation)',
          '  2. LuxeGlow Studio  - HTML/CSS, JS, Animations [Coming Soon]',
          '  3. Iron Pulse       - React, Tailwind, Framer Motion [Coming Soon]',
          '  4. Lifeline Hospital- Next.js, React, Tailwind (Medical dashboard)'
        ];
        break;
      case 'contact':
        response = [
          'Reach out via:',
          '  Email   : mrunalithatzade20@gmail.com',
          '  Phone   : +91 72184 05826',
          '  LinkedIn: linkedin.com/in/mrunali-hatzade-72a35a231',
          '  GitHub  : github.com/mrunali-hatzade'
        ];
        break;
      case 'stats':
        response = [
          'Key Metrics:',
          '  • Projects Completed : 5+',
          '  • Experience Level   : Fresh & Ready to Ship',
          '  • Client Trust Score : 100%',
          '  • Learning Curiosity: Infinite (∞)'
        ];
        break;
      case 'clear':
        setTerminalHistory([]);
        return;
      default:
        response = [
          `Command not found: "${cmd}"`,
          'Type "help" to see all valid commands.'
        ];
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: 'input', text: `guest@mrunali:~$ ${cmdText}` },
      ...response.map(line => ({ type: 'output', text: line }))
    ]);
  };

  // Autotyping Intro Sequence
  useEffect(() => {
    let active = true;
    
    const typeSequence = async () => {
      // 1. Wait 1200ms for page entrance animations
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (!active) return;
      
      // 2. Type "help"
      const word1 = "help";
      for (let i = 1; i <= word1.length; i++) {
        if (!active) return;
        setTerminalInput(word1.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 120));
      }
      
      // Wait 400ms
      await new Promise(resolve => setTimeout(resolve, 400));
      if (!active) return;
      
      // Submit "help"
      executeCommand("help");
      setTerminalInput("");
      
      // 3. Wait 1800ms
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (!active) return;
      
      // 4. Type "info"
      const word2 = "info";
      for (let i = 1; i <= word2.length; i++) {
        if (!active) return;
        setTerminalInput(word2.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 120));
      }
      
      // Wait 400ms
      await new Promise(resolve => setTimeout(resolve, 400));
      if (!active) return;
      
      // Submit "info"
      executeCommand("info");
      setTerminalInput("");
      
      // 5. Complete autotyping
      setIsAutotyping(false);
    };
    
    typeSequence();
    
    return () => {
      active = false;
    };
  }, []);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (isAutotyping) return;
    const cmd = terminalInput.trim();
    if (!cmd) return;
    setTerminalInput('');
    executeCommand(cmd);
  };

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit handler - sends data to Next.js API, opens mailto as fallback on failure if needed
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message to the database.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg('Could not save to database. Opening your email app instead...');

      // Fallback: Mailto client open
      const mailtoSubject = formData.subject || 'Portfolio Inquiry';
      const mailto = `mailto:mrunalithatzade20@gmail.com?subject=${encodeURIComponent(mailtoSubject + ' — from ' + formData.name)}&body=${encodeURIComponent('Name: ' + formData.name + '\nEmail: ' + formData.email + '\n\n' + formData.message)}`;
      window.location.href = mailto;

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setErrorMsg('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const simulateTypewriter = (fullText) => {
    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    let i = 0;
    let currentText = '';
    
    const interval = setInterval(() => {
      if (i < fullText.length) {
        if (fullText[i] === '<') {
          const closeIdx = fullText.indexOf('>', i);
          if (closeIdx !== -1) {
            currentText += fullText.slice(i, closeIdx + 1);
            i = closeIdx + 1;
          } else {
            currentText += fullText[i];
            i++;
          }
        } else {
          currentText += fullText[i];
          i++;
        }
        
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].text = currentText;
          }
          return updated;
        });
      } else {
        clearInterval(interval);
      }
    }, 8);
  };

  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');

    // Intercept chat reset commands to prompt confirmation box inline
    const trimmedText = userText.trim().toLowerCase();
    if (trimmedText === 'new chat' || trimmedText === 'reset' || trimmedText === 'clear' || trimmedText === 'start over' || trimmedText === 'clear chat' || trimmedText === 'reset chat') {
      setMessages(prev => {
        if (prev[prev.length - 1]?.isConfirmation) return prev;
        return [
          ...prev,
          { sender: 'user', text: userText },
          {
            sender: 'bot',
            text: "Would you like to start a new conversation or continue this one?",
            isConfirmation: true
          }
        ];
      });
      return;
    }

    const currentMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(currentMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: currentMessages })
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        simulateTypewriter(data.reply);
      } else {
        simulateTypewriter("Sorry, I'm experiencing some connection issues. Please contact Mrunali directly at mrunalithatzade20@gmail.com!");
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      simulateTypewriter("Sorry, I'm experiencing some connection issues. Please contact Mrunali directly at mrunalithatzade20@gmail.com!");
    }
  };

  const handleQuickReply = async (text) => {
    const currentMessages = [...messages, { sender: 'user', text: text }];
    setMessages(currentMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: currentMessages })
      });

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        simulateTypewriter(data.reply);
      } else {
        simulateTypewriter("Sorry, I'm experiencing some connection issues. Please contact Mrunali directly at mrunalithatzade20@gmail.com!");
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      simulateTypewriter("Sorry, I'm experiencing some connection issues. Please contact Mrunali directly at mrunalithatzade20@gmail.com!");
    }
  };

  const promptNewChat = () => {
    if (messages[messages.length - 1]?.isConfirmation) return;

    setMessages(prev => [...prev, {
      sender: 'bot',
      text: "Would you like to start a new conversation or continue this one?",
      isConfirmation: true
    }]);
  };

  const handleStartNewChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Hi! 👋 I'm Mrunali's AI Assistant. Ask me anything about her skills, experience, projects, or how to contact her!"
      }
    ]);
  };

  const handleContinueChat = (indexToRemove) => {
    setMessages(prev => {
      const updated = [...prev];
      updated.splice(indexToRemove, 1);
      return updated;
    });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Great! Let's continue. What else would you like to know about Mrunali? 😊"
      }]);
    }, 500);
  };

  return (
    <>
      <canvas id="bg-3d-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none' }} />
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#">MH</a>
        <ul className={`nav-links ${navOpen ? 'open' : ''}`} id="navLinks">
          <a href="#about" onClick={() => setNavOpen(false)}>About</a>
          <a href="#services" onClick={() => setNavOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setNavOpen(false)}>Projects</a>
          <a href="#experience" onClick={() => setNavOpen(false)}>Experience</a>
          <a href="#skills" onClick={() => setNavOpen(false)}>Skills</a>
          <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
        </ul>
        <a href="#contact" className="nav-cta"><span className="nav-cta-dot"></span>Available for work</a>
        <div className="hamburger" id="hamburger" onClick={() => setNavOpen(prev => !prev)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ maxWidth: 'none', paddingTop: '80px' }}>
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-container">
          {/* Left Column: Hero Content */}
          <div className="hero-left-content">
            <p className="hero-tag">// hello world — welcome to my portfolio</p>
            <h1 className="hero-name">
              Mrunali<br />Hatzade
            </h1>
            <p className="hero-subtitle">
              Full Stack Developer &amp; AI Explorer
            </p>

            <div className="hero-chips">
              <span className="hero-chip">Engineer</span>
              <span className="hero-chip">Content Creator</span>
              <span className="hero-chip">DevOps</span>
            </div>

            <p className="hero-desc">
              I build complete digital experiences — from pixel-perfect frontends to robust backends — and I&apos;m passionate about integrating AI into modern solutions. In today&apos;s market, AI isn&apos;t optional; it&apos;s essential. Let me help your business stand out.
            </p>

            <div className="hero-social-pills">
              <a href="https://github.com/mrunali-hatzade/" target="_blank" rel="noreferrer" className="social-pill">GitHub</a>
              <a href="https://www.linkedin.com/in/mrunali-hatzade-72a35a231/" target="_blank" rel="noreferrer" className="social-pill">LinkedIn</a>
              <a href="https://youtube.com/@mrunalihatzade3652?si=a9jj1ibGiBVHT2ib" target="_blank" rel="noopener noreferrer" className="social-pill">YouTube</a>
              <a href="https://www.instagram.com/mrunali.35/" target="_blank" rel="noreferrer" className="social-pill">Instagram</a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mrunalithatzade20@gmail.com" target="_blank" rel="noopener noreferrer" className="social-pill">Email</a>
            </div>

            <div className="hero-action-buttons">
              <a href="#contact" className="btn-collaborate">Let&apos;s Collaborate →</a>
              <a href="#projects" className="btn-projects-outline">Explore Projects</a>
              <a
                href="https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0"
                download="Mrunali_Hatzade_Resume.pdf"
                className="btn-resume-outline"
                title="Download Resume"
                aria-label="Download Resume"
              >
                Resume
              </a>
            </div>
          </div>

          {/* Vertical Divider line */}
          <div className="hero-divider"></div>

          {/* Right Column: Dev Terminal & Stats */}
          <div className="hero-right-column">
            <div className="dev-terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="terminal-title">guest@mrunali: ~</span>
              </div>
              <div className="terminal-body" onClick={() => document.getElementById('terminal-input')?.focus()}>
                <div className="terminal-content">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className={`terminal-line ${line.type}`}>
                      {line.text}
                    </div>
                  ))}
                  <form onSubmit={handleTerminalSubmit} className="terminal-form">
                    <span className="terminal-prompt">guest@mrunali:~$</span>
                    <input
                      id="terminal-input"
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="terminal-input-field"
                      autoComplete="off"
                      readOnly={isAutotyping}
                      placeholder={isAutotyping ? "System typing..." : "Type 'help', 'projects', 'skills'..."}
                    />
                  </form>
                  <div ref={terminalBottomRef} />
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="hero-stats-column">
              <p className="stats-header">// stats</p>
              <div className="stats-grid">
                <div className="stats-card">
                  <span className="stats-number">5+</span>
                  <span className="stats-label">Projects</span>
                </div>
                <div className="stats-card">
                  <span className="stats-number">Fresh</span>
                  <span className="stats-label">Experience</span>
                </div>
                <div className="stats-card">
                  <span className="stats-number">100%</span>
                  <span className="stats-label">Trustworthy</span>
                </div>
                <div className="stats-card">
                  <span className="stats-number">∞</span>
                  <span className="stats-label">Curiosity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 01. ABOUT */}
      <section id="about">
        <p className="section-label">01. About</p>
        <div className="about-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Who I Am</h2>
          <div className="about-toggle-container">
            <div className="toggle-segment-control">
              <button 
                type="button" 
                className={`toggle-option ${!quickRead ? 'active' : ''}`} 
                onClick={() => setQuickRead(false)}
              >
                Detailed Story
              </button>
              <button 
                type="button" 
                className={`toggle-option ${quickRead ? 'active' : ''}`} 
                onClick={() => setQuickRead(true)}
              >
                10-Sec Scan
              </button>
              <div className="toggle-slider" style={{ transform: quickRead ? 'translateX(100%)' : 'translateX(0)' }}></div>
            </div>
          </div>
        </div>

        {quickRead ? (
          <div className="quick-read-container reveal visible">
            <div className="quick-read-grid">
              <div className="qr-card">
                <span className="qr-icon">🎓</span>
                <h4>Education & Origin</h4>
                <p><strong>B.E. in Electronics & Telecommunication</strong> (ENTC, 2025) from <strong>Dr. D.Y. Patil Institute (DYPIEMR)</strong>, Akurdi, Pune.</p>
              </div>
              <div className="qr-card">
                <span className="qr-icon">💼</span>
                <h4>Employment Status</h4>
                <p><strong>Available for Work</strong>. Open to Full-Time roles & freelance/contract development projects.</p>
              </div>
              <div className="qr-card">
                <span className="qr-icon">🚀</span>
                <h4>Primary Tech Stack</h4>
                <p>Core focus in <strong>Java, Spring Boot, React, Next.js, and SQL</strong>, with experience in building secure REST APIs & cloud setups.</p>
              </div>
              <div className="qr-card">
                <span className="qr-icon">📍</span>
                <h4>Location & Mobility</h4>
                <p>Based in <strong>Pune, India</strong>. Ready for remote collaborations or open to relocation to major tech hubs.</p>
              </div>
              <div className="qr-card">
                <span className="qr-icon">🏅</span>
                <h4>Top Credentials</h4>
                <p>Winner of **Techcombact 2.0 Hackathon** and certified **Oracle Cloud (OCI) AI Foundations Associate**.</p>
              </div>
              <div className="qr-card">
                <span className="qr-icon">🤖</span>
                <h4>AI First Integration</h4>
                <p>Equipped with an **AI-first mindset**, actively building applications with LLM API integrations (Gemini, Claude) & prompt design.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="about-grid reveal visible">
            <div className="about-text">
              <p>Hi! I'm a <span>2025 graduate</span> in <span>Electronics & Telecommunication Engineering (ENTC)</span> from <span>Dr. D.Y. Patil Institute of Engineering, Management and Research (DYPIEMR)</span>, Akurdi, Pune.</p>
              <p>I'm a <span>Full Stack Developer</span> who loves building end-to-end digital products — crafting responsive, intuitive frontends, scalable backends, and thoughtful UI/UX experiences.</p>
              <p>The market is evolving fast and <span>AI is at the center of it</span>. I've embraced this shift and actively explore AI integrations, making solutions smarter and businesses future-ready. I also dabble in <span>DevOps & Cloud Computing</span> to ship and scale reliably.</p>
              <p>Beyond engineering, I'm a <span>content creator</span> — I believe great tech deserves great storytelling. Let's connect and build something incredible together!</p>
              <div className="about-chips">
                <span className="about-chip">🎓 ENTC Engineer, 2025</span>
                <span className="about-chip">📍 Pune, India</span>
                <span className="about-chip">💼 Open to Full-Time</span>
                <span className="about-chip">🤖 AI-First Mindset</span>
                <span className="about-chip">☁️ DevOps Explorer</span>
                <span className="about-chip">✍️ Content Creator</span>
              </div>
            </div>
            <div>
              <div className="about-facts">
                <span className="fact">Frontend Dev</span>
                <span className="fact">Backend Dev</span>
                <span className="fact">UI/UX Design</span>
                <span className="fact">AI Integration</span>
                <span className="fact">Java & Spring Boot</span>
                <span className="fact">Node.js & Next.js</span>
                <span className="fact">Cloud & DevOps</span>
                <span className="fact">Content Creation</span>
                <span className="fact">REST APIs</span>
                <span className="fact">Database Design</span>
                <span className="fact">Git & GitHub</span>
                <span className="fact">Problem Solving</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 02. SERVICES */}
      <section id="services" className="services-section">
        <p className="section-label">02. Services</p>
        <div className="services-header">
          <h2 className="section-title">What I Offer</h2>
          <p className="services-sub">From idea to deployment — I cover the full product lifecycle.</p>
        </div>
        <div className="services-process reveal">
          <div className="svc-card">
            <div className="svc-num">01 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3>Full Stack Development</h3>
            <p>End-to-end web applications — from pixel-perfect frontends to robust, scalable backends. I handle the complete stack.</p>
            <div className="svc-price">Rates tailored to project scope</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">02 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
            </div>
            <h3>AI-Integrated Solutions</h3>
            <p>Embed AI into your product — chatbots, intelligent automation, LLM integrations. Stay competitive with AI-first features.</p>
            <div className="svc-price">Custom pricing based on complexity</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">03 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <h3>Landing Page Design</h3>
            <p>High-conversion landing page layouts that look stunning and feel intuitive. Designs that convert visitors into loyal customers.</p>
            <div className="svc-price">Rates based on page length & styling</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">04 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <h3>Backend & API Dev</h3>
            <p>Secure, high-performance REST APIs with Spring Boot, Node.js and Java. JWT auth, clean architecture, production-ready.</p>
            <div className="svc-price">Rates based on database & endpoints</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">05 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
            </div>
            <h3>Cloud & DevOps</h3>
            <p>Deploy and scale on AWS, OCI, Docker and CI/CD pipelines. Ship faster and manage infrastructure effortlessly.</p>
            <div className="svc-price">Tailored setups matching your scale</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">06 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Tech Content Creation</h3>
            <p>Tutorials, documentation, social posts and blogs that educate, build authority and grow your tech audience.</p>
            <div className="svc-price">Flexible pricing per project / piece</div>
          </div>
        </div>
      </section>


      {/* 03. PROJECTS */}
      <section id="projects">
        <p className="section-label">03. Projects</p>
        <h2 className="section-title">Things I've Built</h2>

        <div className="projects-grid reveal">
          {/* Cafe */}
          <div
            className="project-card tilt-card"
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const rotateX = ((y - cy) / cy) * -10;
              const rotateY = ((x - cx) / cx) * 10;
              card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
              const shine = card.querySelector('.tilt-shine');
              if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(100,255,218,0.13) 0%, transparent 65%)`;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
              const shine = e.currentTarget.querySelector('.tilt-shine');
              if (shine) shine.style.background = 'transparent';
            }}
          >
            <div className="tilt-shine" />
            <div className="project-card-header project-header-cafe">
              <div className="project-mockup-frame">
                <img src="/cafe-aura-thumb.png" alt="Café Aura Website Preview" />
              </div>
            </div>
            <div className="project-card-body">
              <div className="project-tech">
                <span className="tech-tag tag-next">Next.js</span>
                <span className="tech-tag tag-css">CSS</span>
                <span className="tech-tag tag-tailwind">Tailwind</span>
                <span className="tech-tag tag-other">Other</span>
              </div>
              <h3>Café Aura</h3>
              <p>A beautiful, fully responsive café website featuring an interactive menu, gallery, reservation system, and warm brand identity — designed to bring the café experience online.</p>
              <div className="project-actions">
                <a href="https://cafe-aura-website.vercel.app" target="_blank" rel="noopener noreferrer" className="project-btn-primary" id="cafe-live">
                  View Demo →
                </a>
                <a href="https://github.com/mrunali-hatzade/cafe-aura-website" target="_blank" rel="noopener noreferrer" className="project-btn-github" id="cafe-github" title="GitHub Repository">
                  <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Salon */}
          <div
            className="project-card tilt-card"
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const rotateX = ((y - cy) / cy) * -10;
              const rotateY = ((x - cx) / cx) * 10;
              card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
              const shine = card.querySelector('.tilt-shine');
              if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(100,255,218,0.13) 0%, transparent 65%)`;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
              const shine = e.currentTarget.querySelector('.tilt-shine');
              if (shine) shine.style.background = 'transparent';
            }}
          >
            <div className="tilt-shine" />
            <div className="project-card-header project-header-salon" style={{ position: 'relative' }}>
              <div className="project-mockup-frame">
                <img src="/luxeglow-studio-thumb.png" alt="LuxeGlow Studio Website Preview" />
              </div>
              <div className="project-coming-soon-overlay">
                <div className="coming-soon-badge">
                  <svg viewBox="0 0 24 24" strokeWidth="2.2" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  COMING SOON
                </div>
              </div>
            </div>
            <div className="project-card-body">
              <div className="project-tech">
                <span className="tech-tag tag-html">HTML/CSS</span>
                <span className="tech-tag tag-js">JavaScript</span>
                <span className="tech-tag tag-animations">Animations</span>
              </div>
              <h3>LuxeGlow Studio</h3>
              <p>A sleek, modern salon website with service listings, stylist profiles, online booking integration, and a gallery — crafted to elevate the brand's digital presence.</p>
              <div className="project-actions">
                <span className="project-btn-coming-soon">
                  <svg viewBox="0 0 24 24" strokeWidth="2.2" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Under Construction
                </span>
              </div>
            </div>
          </div>

          {/* Gym */}
          <div
            className="project-card tilt-card"
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const rotateX = ((y - cy) / cy) * -10;
              const rotateY = ((x - cx) / cx) * 10;
              card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
              const shine = card.querySelector('.tilt-shine');
              if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(100,255,218,0.13) 0%, transparent 65%)`;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
              const shine = e.currentTarget.querySelector('.tilt-shine');
              if (shine) shine.style.background = 'transparent';
            }}
          >
            <div className="tilt-shine" />
            <div className="project-card-header project-header-gym" style={{ position: 'relative' }}>
              <div className="project-mockup-frame">
                <img src="/iron-pulse-thumb.png" alt="Iron Pulse Website Preview" />
              </div>
              <div className="project-coming-soon-overlay">
                <div className="coming-soon-badge">
                  <svg viewBox="0 0 24 24" strokeWidth="2.2" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  COMING SOON
                </div>
              </div>
            </div>
            <div className="project-card-body">
              <div className="project-tech">
                <span className="tech-tag tag-react">React</span>
                <span className="tech-tag tag-tailwind">Tailwind</span>
                <span className="tech-tag tag-animations">Animations</span>
              </div>
              <h3>Iron Pulse</h3>
              <p>An energetic, high-impact gym website featuring membership plans, class schedules, trainer profiles, and a motivational design to convert visitors into members.</p>
              <div className="project-actions">
                <span className="project-btn-coming-soon">
                  <svg viewBox="0 0 24 24" strokeWidth="2.2" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Under Construction
                </span>
              </div>
            </div>
          </div>

          {/* Hospital */}
          <div
            className="project-card tilt-card"
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const rotateX = ((y - cy) / cy) * -10;
              const rotateY = ((x - cx) / cx) * 10;
              card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
              const shine = card.querySelector('.tilt-shine');
              if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(100,255,218,0.13) 0%, transparent 65%)`;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
              const shine = e.currentTarget.querySelector('.tilt-shine');
              if (shine) shine.style.background = 'transparent';
            }}
          >
            <div className="tilt-shine" />
            <div className="project-card-header project-header-hospital">
              <div className="project-mockup-frame">
                <img src="/lifeline-hospital-thumb.png" alt="Lifeline Hospital Website Preview" />
              </div>
            </div>
            <div className="project-card-body">
              <div className="project-tech">
                <span className="tech-tag tag-react">React</span>
                <span className="tech-tag tag-tailwind">Tailwind</span>
                <span className="tech-tag tag-next">Next.js</span>
              </div>
              <h3>Lifeline Hospital</h3>
              <p>A professional hospital website with doctor listings, department info, appointment booking, and an emergency contact section — building trust with a clean, accessible design.</p>
              <div className="project-actions">
                <a href="https://lifeline-hospital-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="project-btn-primary" id="hospital-live">
                  View Demo →
                </a>
                <a href="https://github.com/mrunali-hatzade/Lifeline-Hospital" target="_blank" rel="noopener noreferrer" className="project-btn-github" id="hospital-github" title="GitHub Repository">
                  <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I WORK — PROCESS */}
      <section id="process" className="process-section-wrap">
        <p className="section-label">How I Work</p>
        <h2 className="section-title">My Process</h2>
        <div className="process-grid reveal">

          <div className="process-card">
            <div className="process-step-num">STEP 01</div>
            <div className="process-card-inner">
              <div className="process-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3>Discovery</h3>
              <p>Understanding your goals, users, and constraints before writing a single line of code.</p>
            </div>
            <div className="process-connector"></div>
          </div>

          <div className="process-card">
            <div className="process-step-num">STEP 02</div>
            <div className="process-card-inner">
              <div className="process-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <h3>Architecture</h3>
              <p>Designing a solid, scalable foundation — schemas, API contracts, and component structure.</p>
            </div>
            <div className="process-connector"></div>
          </div>

          <div className="process-card">
            <div className="process-step-num">STEP 03</div>
            <div className="process-card-inner">
              <div className="process-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h3>Development</h3>
              <p>Building iteratively with regular check-ins, clean code, and test-driven practices.</p>
            </div>
            <div className="process-connector"></div>
          </div>

          <div className="process-card process-card-last">
            <div className="process-step-num">STEP 04</div>
            <div className="process-card-inner">
              <div className="process-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Delivery</h3>
              <p>Deployment, documentation, and post-launch support to ensure everything runs flawlessly.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 04. EXPERIENCE */}
      <section id="experience">
        <p className="section-label">04. Experience</p>
        <h2 className="section-title">Where I've Worked</h2>
        <div className="exp-list reveal">
          <div className="exp-card">
            <div className="exp-header">
              <span className="exp-title">Java Full Stack Developer — Intern (Remote)</span>
              <span className="exp-date">Nov 2025 – Jan 2026</span>
            </div>
            <p className="exp-org">Bangalore, India</p>
            <ul className="exp-bullets">
              <li>Developed a Task Management backend using Java and Spring Boot with secure role-based authentication via Spring Security and JWT.</li>
              <li>Built scalable REST APIs and integrated MySQL database for efficient data management.</li>
              <li>Collaborated on full-stack features, contributing to both backend logic and frontend integration.</li>
            </ul>
          </div>
          <div className="exp-card">
            <div className="exp-header">
              <span className="exp-title">Full Stack Java Application Developer — Intern</span>
              <span className="exp-date">Dec 2023 – Mar 2024</span>
            </div>
            <p className="exp-org">Pune, India (On-site)</p>
            <ul className="exp-bullets">
              <li>Developed and maintained backend modules ensuring smooth database connectivity and data integrity.</li>
              <li>Built and tested application features using Java, JDBC, and MySQL for efficient data handling.</li>
              <li>Participated in code reviews and contributed to improving application performance.</li>
            </ul>
          </div>
          <div className="exp-card">
            <div className="exp-header">
              <span className="exp-title">Web Development, Python-Django Framework — Intern</span>
              <span className="exp-date">Nov 2022 – Mar 2023</span>
            </div>
            <p className="exp-org">Pune, India</p>
            <ul className="exp-bullets">
              <li>Built web applications using Python and Django framework.</li>
              <li>Worked on frontend-backend integration and learned real-world web development workflows.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 05. SKILLS */}
      <section id="skills">
        <p className="section-label">05. Skills</p>
        <h2 className="section-title">What I Work With</h2>
        <div className="skills-grid reveal">
          <div className="skill-card">
            <h3>Frontend & Design</h3>
            <div className="skill-tags">
              <span className="tag">React / Next.js</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Vue.js</span>
              <span className="tag">CSS / Tailwind</span>
              <span className="tag">HTML5 / JavaScript</span>
              <span className="tag">UI/UX Prototyping</span>
            </div>
          </div>
          <div className="skill-card">
            <h3>Backend & Database</h3>
            <div className="skill-tags">
              <span className="tag">Java / Spring Boot</span>
              <span className="tag">Node.js / Express</span>
              <span className="tag">Python / Django</span>
              <span className="tag">MongoDB / PostgreSQL</span>
              <span className="tag">REST / GraphQL APIs</span>
              <span className="tag">JWT / Auth</span>
            </div>
          </div>
          <div className="skill-card">
            <h3>Cloud, DevOps & Tools</h3>
            <div className="skill-tags">
              <span className="tag">AWS / Cloud</span>
              <span className="tag">Docker / Containers</span>
              <span className="tag">CI-CD Pipelines</span>
              <span className="tag">Git / GitHub</span>
              <span className="tag">VS Code / IntelliJ</span>
              <span className="tag">Maven</span>
            </div>
          </div>
          <div className="skill-card">
            <h3>AI & Generative Tech</h3>
            <div className="skill-tags">
              <span className="tag">ChatGPT / Claude</span>
              <span className="tag">LLM Integration</span>
              <span className="tag">LangChain / RAG</span>
              <span className="tag">Hugging Face</span>
              <span className="tag">Gemini API</span>
              <span className="tag">Vector Databases</span>
            </div>
          </div>
        </div>
      </section>

      {/* 06. EDUCATION */}
      <section id="education">
        <p className="section-label">06. Education</p>
        <h2 className="section-title">Academic Journey</h2>
        <div className="edu-list reveal">
          <div className="edu-card">
            <div>
              <p className="edu-degree">B.E. — Electronics & Telecommunication Engineering (ENTC)</p>
              <p className="edu-school">Dr. D.Y. Patil Institute of Engineering, Management and Research (DYPIEMR), Akurdi, Pune</p>
            </div>
            <span className="edu-year">2021 – 2025</span>
          </div>
          <div className="edu-card">
            <div>
              <p className="edu-degree">Higher Secondary Education (HSC)</p>
              <p className="edu-school">Lal Bahadur Shastri Jr. College, Bhandara</p>
            </div>
            <span className="edu-year">2020 – 2021</span>
          </div>
          <div className="edu-card">
            <div>
              <p className="edu-degree">Secondary School Education (SSC)</p>
              <p className="edu-school">Jaycees Convent School, Bhandara</p>
            </div>
            <span className="edu-year">2018 – 2019</span>
          </div>
        </div>
      </section>

      {/* 07. CERTIFICATIONS */}
      <section id="certifications" className="certs-compact-section">
        <p className="section-label">07. Certifications</p>
        <h2 className="section-title">Credentials</h2>
        <div className="certs-inline reveal">

          <a href="https://drive.google.com/file/d/1PF7hd8L3kjDin6y7KCC4eBeH-7F67jP_/view?usp=sharing"
            target="_blank" rel="noopener noreferrer" className="cert-pill cert-pill-link">
            <span className="cert-pill-icon">🏅</span>
            <span className="cert-pill-text">Oracle Cloud Infrastructure 2025 — AI Foundations Associate</span>
            <svg className="cert-pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <a href="https://drive.google.com/file/d/1ZhR5oCYT_xZ86VUFdkF5ktDpXhrX6COH/view?usp=sharing"
            target="_blank" rel="noopener noreferrer" className="cert-pill cert-pill-link">
            <span className="cert-pill-icon">☕</span>
            <span className="cert-pill-text">Full Stack Java Dev — Core Java, Spring Boot, REST APIs, Hibernate</span>
            <svg className="cert-pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <a href="https://drive.google.com/file/d/1nstsrRn0G_x_YA9ZgSt_F-70xUTWUQDS/view?usp=drive_link"
            target="_blank" rel="noopener noreferrer" className="cert-pill cert-pill-link">
            <span className="cert-pill-icon">📢</span>
            <span className="cert-pill-text">Google Ads Certification — Search Advertising</span>
            <svg className="cert-pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

        </div>
      </section>


      {/* 08. RECOGNITION */}
      <section id="awards" className="awards-compact-section">
        <p className="section-label">08. Recognition</p>
        <h2 className="section-title">Achievements</h2>
        <div className="awards-compact reveal">
          <div className="award-pill">
            <span className="award-pill-icon">🥇</span>
            <div>
              <span className="award-pill-title">Hackathon Winner</span>
              <span className="award-pill-sub">TECHCOMBACT 2.0 (Hardware) — DYPIEMR</span>
            </div>
          </div>
          <div className="award-pill">
            <span className="award-pill-icon">🏆</span>
            <div>
              <span className="award-pill-title">State Level — 1st</span>
              <span className="award-pill-sub">Tennikoit, Nandurbar 2016–17</span>
            </div>
          </div>
          <div className="award-pill">
            <span className="award-pill-icon">🏆</span>
            <div>
              <span className="award-pill-title">State Level — 1st</span>
              <span className="award-pill-sub">Tennikoit, Nashik 2018–19</span>
            </div>
          </div>
        </div>
      </section>

      {/* 09. TESTIMONIALS */}
      <section id="testimonials">
        <p className="section-label">09. Testimonials</p>
        <h2 className="section-title">Kind Words</h2>
        <div className="testimonials-grid reveal">

          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">Mrunali delivered a full-stack solution that exceeded our expectations. Her ability to combine clean UI design with solid backend architecture is rare — and her communication throughout the project was excellent.</p>
            <div className="testi-author">
              <div className="testi-avatar">RK</div>
              <div>
                <p className="testi-name">Rahul Kulkarni</p>
                <p className="testi-role">Startup Founder, Pune</p>
              </div>
            </div>
            <div className="testi-stars">★★★★★</div>
          </div>

          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">Working with Mrunali on our salon website was a fantastic experience. She understood our brand perfectly and built something truly beautiful and functional. The booking flow she designed is seamless.</p>
            <div className="testi-author">
              <div className="testi-avatar">PS</div>
              <div>
                <p className="testi-name">Priya Sharma</p>
                <p className="testi-role">Business Owner, Mumbai</p>
              </div>
            </div>
            <div className="testi-stars">★★★★★</div>
          </div>

          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">Mrunali's technical depth in Java and Spring Boot is impressive. She built our REST API layer efficiently, wrote clean code, and delivered ahead of schedule. Highly recommended for any backend or full-stack project.</p>
            <div className="testi-author">
              <div className="testi-avatar">AM</div>
              <div>
                <p className="testi-name">Arjun Mehta</p>
                <p className="testi-role">Tech Lead, Bangalore</p>
              </div>
            </div>
            <div className="testi-stars">★★★★★</div>
          </div>

        </div>
      </section>

      {/* 10. CONTACT */}
      <section id="contact">
        <p className="section-label">10. Contact</p>
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-wrapper reveal">
          <div className="contact-info">
            <p className="contact-tagline">Let's build something <span>incredible</span> together.</p>
            <p>I'm open to full-time opportunities, freelance projects, and collaborations. Whether you need a full stack solution, an AI-integrated product, or just want to say hi — reach out through any of the channels below!</p>

            <div className="contact-details-cards">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mrunalithatzade20@gmail.com" target="_blank" rel="noopener noreferrer" className="detail-card">
                <div className="detail-icon">📧</div>
                <div className="detail-content">
                  <h4>Email Me</h4>
                  <p>mrunalithatzade20@gmail.com</p>
                </div>
              </a>
              <a href="tel:7218405826" className="detail-card">
                <div className="detail-icon">📞</div>
                <div className="detail-content">
                  <h4>Call Me</h4>
                  <p>+91 72184 05826</p>
                </div>
              </a>
            </div>

            <div className="contact-social-row">
              <a href="https://www.linkedin.com/in/mrunali-hatzade-72a35a231/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" id="contact-linkedin" title="LinkedIn">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://github.com/mrunali-hatzade/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" id="contact-github" title="GitHub">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
              <a href="https://www.instagram.com/mrunali.35/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" id="contact-instagram" title="Instagram">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100072803246358" target="_blank" rel="noopener noreferrer" className="social-icon-btn" id="contact-facebook" title="Facebook">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://youtube.com/@mrunalihatzade3652?si=a9jj1ibGiBVHT2ib" target="_blank" rel="noopener noreferrer" className="social-icon-btn" id="contact-youtube" title="YouTube">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.91 29 29 0 00.46-5.33 29 29 0 00-.46-5.34z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>

            <a href="https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0" download="Mrunali_Hatzade_Resume.pdf" className="contact-resume-btn">
              <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </a>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <h3>Send Me a Message</h3>
            <p className="form-sub">I typically respond within 24 hours. Looking forward to hearing from you! 👋</p>
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">Your Name</label>
                  <input
                    type="text"
                    id="fname"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="femail">Your Email</label>
                  <input
                    type="type"
                    id="femail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rahul@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="fsubject">Subject</label>
                <select
                  id="fsubject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select a topic…</option>
                  <option value="job">Full-Time Job Opportunity</option>
                  <option value="freelance">Freelance / Project</option>
                  <option value="collab">Collaboration</option>
                  <option value="ai">AI Integration Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fbudget">Budget Range <span style={{color:'var(--muted)',fontWeight:400,fontSize:'0.8rem'}}>(optional)</span></label>
                <select id="fbudget" name="budget" style={{width:'100%'}}>
                  <option value="">Select a budget range…</option>
                  <option value="under5k">Under ₹5,000</option>
                  <option value="5k-15k">₹5,000 – ₹15,000</option>
                  <option value="15k-30k">₹15,000 – ₹30,000</option>
                  <option value="30k-50k">₹30,000 – ₹50,000</option>
                  <option value="50k+">₹50,000+</option>
                  <option value="discuss">Let's Discuss</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fmessage">Message</label>
                <textarea
                  id="fmessage"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, role, or idea..."
                  required
                ></textarea>
              </div>
              <div className="form-submit">
                <span className="form-note">✨ Your message goes directly to my database.</span>
                <button type="submit" className="btn-send" id="form-submit-btn" disabled={loading}>
                  <svg viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9" />
                  </svg>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
            {success && (
              <div id="form-success" style={{ display: 'block', marginTop: '1.2rem', padding: '1rem 1.4rem', background: 'rgba(100,255,218,0.07)', border: '1px solid rgba(100,255,218,0.25)', borderRadius: '8px', color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.85rem' }}>
                {errorMsg ? `⚠️ ${errorMsg}` : '✅ Message sent & saved to database successfully!'}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 Mrunali Hatzade. All rights reserved</p>
        <div className="footer-location" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.6rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
          <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor" style={{ width: '13px', height: '13px', stroke: 'var(--accent)' }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Pune, Maharashtra, India
        </div>
      </footer>

      {/* CHATBOT */}
      <div className={`chatbot-widget ${chatOpen ? 'chat-open' : ''}`}>
        {/* Toggle Button */}
        <button className="chatbot-toggle-btn" onClick={() => setChatOpen(!chatOpen)} aria-label="Toggle AI Assistant">
          {chatOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px'}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '22px', height: '22px'}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          )}
          {!chatOpen && <span className="chatbot-pulse-indicator"></span>}
        </button>

        {/* Chat Window */}
        {chatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div className="chatbot-avatar-status">
                <div className="chatbot-status-avatar">MH</div>
                <div>
                  <h4>Mrunali's Assistant</h4>
                  <span className="chatbot-status-online"><span className="online-dot"></span>Online</span>
                </div>
              </div>
              <div className="chatbot-header-actions">
                {messages.length > 1 && (
                  <button 
                    type="button"
                    className="chatbot-header-action-btn"
                    onClick={promptNewChat} 
                    title="New Chat"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{width: '10px', height: '10px'}}><path d="M12 5v14M5 12h14"/></svg>
                    New Chat
                  </button>
                )}
                <button className="chatbot-close-btn" onClick={() => setChatOpen(false)}>&times;</button>
              </div>
            </div>

            <div className="chatbot-messages" ref={chatMessagesRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`}>
                  {msg.sender === 'user' ? (
                    <div className="chat-bubble user-bubble">
                      {msg.text}
                    </div>
                  ) : msg.isConfirmation ? (
                    <div className="chat-bubble bot-bubble chat-confirm-box">
                      <p>{msg.text}</p>
                      <div className="confirm-actions">
                        <button 
                          type="button" 
                          className="confirm-btn-primary"
                          onClick={handleStartNewChat}
                        >
                          Start New
                        </button>
                        <button 
                          type="button" 
                          className="confirm-btn-secondary"
                          onClick={() => handleContinueChat(idx)}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="chat-bubble bot-bubble"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-wrapper bot-wrapper">
                  <div className="chat-bubble bot-bubble typing-bubble">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="chatbot-quick-replies">
              <button type="button" onClick={() => handleQuickReply("About Mrunali")}>About</button>
              <button type="button" onClick={() => handleQuickReply("Her Skills")}>Skills</button>
              <button type="button" onClick={() => handleQuickReply("Her Projects")}>Projects</button>
              <button type="button" onClick={() => handleQuickReply("Her Services")}>Services</button>
              <button type="button" onClick={() => handleQuickReply("Download Resume")}>Resume</button>
              <button type="button" onClick={() => handleQuickReply("Contact Info")}>Contact</button>
            </div>

            <form className="chatbot-input-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
              />
              <button type="submit" className="chatbot-send-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9"/></svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* GO TO TOP */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* CUSTOM CYBER CURSOR */}
      <div ref={cursorRef} className={`custom-cyber-cursor ${cursorState}`}>
        <div className="cursor-glow"></div>
        <div className="cursor-ring">
          <div className="cursor-ticks">
            <span className="tick tick-t"></span>
            <span className="tick tick-r"></span>
            <span className="tick tick-b"></span>
            <span className="tick tick-l"></span>
          </div>
        </div>
        <div className="cursor-dot"></div>
      </div>
    </>
  );
}
