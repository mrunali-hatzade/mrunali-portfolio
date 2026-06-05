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

  // Project filter state
  const [activeCategory, setActiveCategory] = useState('all');


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

  // ── INTERACTIVE PLAYGROUND STATE ──────────────────────────────
  const [playgroundTab, setPlaygroundTab] = useState('matcher');
  const [matcherSelections, setMatcherSelections] = useState({
    frontend: '',
    backend: '',
    cloud: '',
    specialty: ''
  });
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

  // Custom cyber cursor state
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState('');
  const bulletsRef = useRef([]);

  useEffect(() => {
    document.body.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--dot-x', `${e.clientX}px`);
        cursorRef.current.style.setProperty('--dot-y', `${e.clientY}px`);
      }
    };

    const handleMouseDown = (e) => {
      setCursorState(prev => prev.includes('hovered') ? 'clicked hovered' : 'clicked');
      
      // Prevent text selection highlights when clicking non-interactive elements
      if (!e.target.closest('a, button, input, textarea, [role="button"], .chatbot-window, .dev-terminal-window, select')) {
        e.preventDefault();
      }
      
      // Fire bullets on left click
      if (e.button === 0) {
        const isHovered = cursorRef.current?.classList.contains('hovered');
        const bulletColor = isHovered ? 'rgba(127, 119, 221, 1)' : 'rgba(100, 255, 218, 1)';
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        const floorY = height * 0.70;

        bulletsRef.current.push({
          bx: (e.clientX - 12) - width / 2,
          by: floorY - (e.clientY - height / 2),
          bz: 0,
          vz: 22,
          color: bulletColor,
          size: 3
        });
        bulletsRef.current.push({
          bx: (e.clientX + 12) - width / 2,
          by: floorY - (e.clientY - height / 2),
          bz: 0,
          vz: 22,
          color: bulletColor,
          size: 3
        });
      }
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
      // Clear canvas completely to prevent ghosting/marks and keep background image sharp
      ctx.clearRect(0, 0, width, height);

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

      // UPDATE AND DRAW 3D LASER BULLETS
      const activeBullets = bulletsRef.current;
      for (let i = activeBullets.length - 1; i >= 0; i--) {
        const b = activeBullets[i];
        b.bz += b.vz; // travel forward in Z

        // Calculate 3D perspective projected screen points for the front and back of the laser line
        const scaleFront = fov / (fov + b.bz);
        const pxFront = b.bx * scaleFront + width / 2;
        const pyFront = (floorY - b.by) * scaleFront + height / 2;

        const scaleBack = fov / (fov + b.bz - 40); // trail back in Z
        const pxBack = b.bx * scaleBack + width / 2;
        const pyBack = (floorY - b.by) * scaleBack + height / 2;

        // Draw 3D laser line
        ctx.beginPath();
        ctx.moveTo(pxFront, pyFront);
        ctx.lineTo(pxBack, pyBack);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.size * scaleFront; // gets thinner in the distance
        ctx.lineCap = 'round';
        
        ctx.shadowBlur = 8 * scaleFront;
        ctx.shadowColor = b.color;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow

        // Remove bullet if it goes too far or becomes too small
        if (b.bz > 1200 || scaleFront < 0.05) {
          activeBullets.splice(i, 1);
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
  const terminalBodyRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
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
          'Featured Projects (10 total — by industry):',
          '  1. Café Aura        - Next.js, CSS, Tailwind       [Café] 🟢 Live',
          '  2. Glam & Glow      - HTML/CSS, JS, Animations     [Salon] 🟢 Live',
          '  3. JS Salon Akurdi  - Next.js, React, Tailwind     [Salon] 🟢 Live',
          '  4. Club 36 Cafe     - Next.js, React, Tailwind     [Café] 🟢 Live',
          '  5. Seven The Salon  - React, HTML/CSS, JS, Anim.   [Salon] 🟢 Live',
          '  6. Iron Edge        - React, Tailwind, Animations  [Gym] 🟢 Live',
          '  7. Gym 2            - React, Tailwind, Animations  [Gym] 🟢 Live',
          '  8. Nakade Hospital  - Next.js, React, Tailwind     [Hospital] 🟢 Live',
          '  9. NestFind Realty  - Next.js, React, Tailwind     [Real Estate] 🟡 WIP',
          '  10. Jaycees Convent - React, Tailwind, Animations  [Education] 🟢 Live'
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
          '  • Projects Built     : 10+ (across 6 industries)',
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

  // ── PLAYGROUND LOGIC ──────────────────────────────────────────
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

  // Load clicker stats
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

  // Save clicker stats
  useEffect(() => {
    if (typeof window !== 'undefined' && loc > 0) {
      localStorage.setItem('playground_loc', loc.toString());
      localStorage.setItem('playground_lps', locPerSec.toString());
      localStorage.setItem('playground_upgrades', JSON.stringify(upgrades));
      localStorage.setItem('playground_achievements', JSON.stringify(activeAchievements));
    }
  }, [loc, locPerSec, upgrades, activeAchievements]);

  // LPS Ticker
  useEffect(() => {
    if (locPerSec <= 0) return;
    const interval = setInterval(() => {
      setLoc(prev => prev + (locPerSec / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [locPerSec]);

  // Click keyboard handler
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

  // Auto scroll and fill form for matcher
  const handlePreFillForm = () => {
    setFormData(prev => ({
      ...prev,
      subject: 'Recruiter Match - Custom Dev Profile',
      message: `Hi Mrunali,\n\nWe matched on your portfolio playground! We are looking for a developer with:\n- Frontend: ${matcherSelections.frontend}\n- Backend/DB: ${matcherSelections.backend}\n- Cloud/Infrastructure: ${matcherSelections.cloud}\n- Specialty Focus: ${matcherSelections.specialty}\n\nWe would love to discuss potential opportunities or project collaborations.\n\nBest regards,\n[Recruiter / Client Name]`
    }));
    
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Chatbot quick match reply helper
  const handleMatcherChatbot = () => {
    setChatOpen(true);
    const query = `Tell me about your experience with ${matcherSelections.frontend}, ${matcherSelections.backend}, ${matcherSelections.cloud}, and ${matcherSelections.specialty}.`;
    handleQuickReply(query);
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

  // ── PROJECT DATA ──────────────────────────────────────────────
  const PROJECTS = [
    {
      id: 'cafe-aura',
      category: 'cafe',
      status: 'live',
      title: 'Café Aura',
      description: 'A beautiful, fully responsive café website featuring an interactive menu, gallery, reservation system, and warm brand identity — designed to bring the café experience online.',
      tech: [
        { label: 'Next.js', cls: 'tag-next' },
        { label: 'CSS', cls: 'tag-css' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Other', cls: 'tag-other' },
      ],
      thumb: '/cafe-aura-thumb.png',
      thumbAlt: 'Café Aura Website Preview',
      headerClass: 'project-header-cafe',
      liveUrl: 'https://cafe-aura-website.vercel.app',
      githubUrl: 'https://github.com/mrunali-hatzade/cafe-aura-website',
      liveId: 'cafe-live',
      githubId: 'cafe-github',
    },
    {
      id: 'glam-glow-salon',
      category: 'salon',
      status: 'live',
      title: 'Glam & Glow Salon',
      description: 'A stunning salon website with elegant service showcases, gallery, online appointment booking, and a luxe brand identity — built to attract and convert beauty-conscious clients.',
      tech: [
        { label: 'HTML/CSS', cls: 'tag-html' },
        { label: 'JavaScript', cls: 'tag-js' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/glam-glow-salon-thumb.png',
      thumbAlt: 'Glam & Glow Salon Website Preview',
      headerClass: 'project-header-salon',
      liveUrl: 'https://glamandglow-eight.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/salon-glam-glow',
      liveId: 'glam-glow-live',
      githubId: 'glam-glow-github',
    },
    {
      id: 'js-salon-akurdi',
      category: 'salon',
      status: 'live',
      title: 'JS Salon Akurdi',
      description: 'A premium unisex hair salon website in Akurdi, Pune featuring stylist profiles, comprehensive service menus, interactive galleries, and a high-end luxury lookbook.',
      tech: [
        { label: 'Next.js', cls: 'tag-next' },
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/js-salon-akurdi-thumb.png',
      thumbAlt: 'JS Salon Akurdi Website Preview',
      headerClass: 'project-header-salon',
      liveUrl: 'https://js-salon-akurdi.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/JS-salon-akurdi',
      liveId: 'js-salon-live',
      githubId: 'js-salon-github',
    },
    {
      id: 'club-36-cafe',
      category: 'cafe',
      status: 'live',
      title: 'Club 36 Cafe',
      description: 'A vibrant cafe website featuring a modern digital menu, location info, and customer outreach features — crafted to bring the Club 36 Cafe experience online.',
      tech: [
        { label: 'Next.js', cls: 'tag-next' },
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/club-36-cafe-thumb.png',
      thumbAlt: 'Club 36 Cafe Website Preview',
      headerClass: 'project-header-cafe',
      liveUrl: 'https://club-36-cafe-bhandara.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/club-36-cafe-bhandara',
      liveId: 'club-36-live',
      githubId: 'club-36-github',
    },
    {
      id: 'seven-the-salon',
      category: 'salon',
      status: 'live',
      title: 'Seven The Salon',
      description: 'A contemporary unisex salon website in Nigdi Pradhikaran, Pune featuring dynamic styling portfolios, detail-oriented service lists, and seamless customer connection points.',
      tech: [
        { label: 'React', cls: 'tag-react' },
        { label: 'HTML/CSS', cls: 'tag-html' },
        { label: 'JavaScript', cls: 'tag-js' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/seven-the-salon-thumb.png',
      thumbAlt: 'Seven The Salon Website Preview',
      headerClass: 'project-header-salon',
      liveUrl: 'https://seventhesalon.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/seventhesalon',
      liveId: 'seven-salon-live',
      githubId: 'seven-salon-github',
    },
    {
      id: 'iron-edge',
      category: 'gym',
      status: 'live',
      title: 'Iron Edge',
      description: 'An energetic, high-impact gym website featuring membership plans, class schedules, trainer profiles, and a motivational design to convert visitors into members.',
      tech: [
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/iron-pulse-thumb.png',
      thumbAlt: 'Iron Edge Website Preview',
      headerClass: 'project-header-gym',
      liveUrl: 'https://gym-xi-sand.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/gym',
      liveId: 'gym-live',
      githubId: 'gym-github',
    },
    {
      id: 'gym-2',
      category: 'gym',
      status: 'live',
      title: 'Gym 2',
      description: 'A clean, fast, and fully responsive secondary gym landing page with dynamic membership options, class information, and an elegant dark user interface.',
      tech: [
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/gym-2-thumb.png',
      thumbAlt: 'Gym 2 Website Preview',
      headerClass: 'project-header-gym',
      liveUrl: 'https://gym2-lilac.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/gym2-',
      liveId: 'gym-2-live',
      githubId: 'gym-2-github',
    },
    {
      id: 'nakade-hospital',
      category: 'hospital',
      status: 'live',
      title: 'Nakade Hospital',
      description: 'A professional hospital website with doctor listings, department info, appointment booking, and an emergency contact section — building trust with a clean, accessible design.',
      tech: [
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Next.js', cls: 'tag-next' },
      ],
      thumb: '/lifeline-hospital-thumb.png',
      thumbAlt: 'Nakade Hospital Website Preview',
      headerClass: 'project-header-hospital',
      liveUrl: 'https://hospital-seven-orpin.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/hospital',
      liveId: 'hospital-live',
      githubId: 'hospital-github',
    },
    {
      id: 'nestfind-realty',
      category: 'realestate',
      status: 'wip',
      title: 'NestFind Realty',
      description: 'A modern real estate platform with property search & filters, listing pages with virtual tour previews, agent profiles, and an AI-powered property recommendation flow.',
      tech: [
        { label: 'Next.js', cls: 'tag-next' },
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/nestfind-realty-thumb.png',
      thumbAlt: 'NestFind Realty Website Preview',
      headerClass: 'project-header-realestate',
      liveUrl: null,
      githubUrl: null,
    },
    {
      id: 'jaycees-convent-project',
      category: 'education',
      status: 'live',
      title: 'Jaycees Convent',
      description: 'A comprehensive, modern website for Jaycees Convent School featuring administration details, course listings, school activities, and an interactive students portal.',
      tech: [
        { label: 'React', cls: 'tag-react' },
        { label: 'Tailwind', cls: 'tag-tailwind' },
        { label: 'Animations', cls: 'tag-animations' },
      ],
      thumb: '/jaycees-convent-thumb.png',
      thumbAlt: 'Jaycees Convent School Website Preview',
      headerClass: 'project-header-education',
      liveUrl: 'https://jaycees-convent.vercel.app/',
      githubUrl: 'https://github.com/mrunali-hatzade/jaycees-convent',
      liveId: 'jaycees-convent-live',
      githubId: 'jaycees-convent-github',
    },
  ];

  const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🗂️' },
    { id: 'salon', label: 'Salon', icon: '💅' },
    { id: 'cafe', label: 'Café / Restaurant', icon: '☕' },
    { id: 'hospital', label: 'Hospital / Clinic', icon: '🏥' },
    { id: 'realestate', label: 'Real Estate', icon: '🏠' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'education', label: 'Education', icon: '🎓' },
  ];

  const filteredProjects = PROJECTS.filter(p =>
    activeCategory === 'all' || p.category === activeCategory
  );

  const getCategoryCount = (catId) => {
    if (catId === 'all') return PROJECTS.length;
    return PROJECTS.filter(p => p.category === catId).length;
  };

  const tiltHandlers = (card) => ({
    onMouseMove: (e) => {
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
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      const shine = e.currentTarget.querySelector('.tilt-shine');
      if (shine) shine.style.background = 'transparent';
    },
  });

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
          <a href="#playground" onClick={() => setNavOpen(false)}>Playground</a>
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
              <div 
                className="terminal-body" 
                ref={terminalBodyRef}
                onClick={() => document.getElementById('terminal-input')?.focus()}
              >
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
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="hero-stats-column">
              <p className="stats-header">// stats</p>
              <div className="stats-grid">
                <div className="stats-card">
                  <span className="stats-number">10+</span>
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

      {/* TECH TICKER SLIDER */}
      <div className="tech-ticker-container">
        <div className="tech-ticker-wrapper">
          <div className="ticker-header">SKILLS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>React</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Next.js</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Spring Boot</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Java</div>
          <div className="ticker-item"><span className="ticker-dot"></span>PostgreSQL</div>
          <div className="ticker-item"><span className="ticker-dot"></span>TypeScript</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Python</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Tailwind CSS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Docker</div>
          <div className="ticker-item"><span className="ticker-dot"></span>AWS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>LangChain</div>
          <div className="ticker-item"><span className="ticker-dot"></span>REST APIs</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Node.js</div>
          <div className="ticker-item"><span className="ticker-dot"></span>MongoDB</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Git & GitHub</div>
          <div className="ticker-item"><span className="ticker-dot"></span>AI Integration</div>
          
          {/* Repeated for seamless loop */}
          <div className="ticker-header">SKILLS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>React</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Next.js</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Spring Boot</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Java</div>
          <div className="ticker-item"><span className="ticker-dot"></span>PostgreSQL</div>
          <div className="ticker-item"><span className="ticker-dot"></span>TypeScript</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Python</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Tailwind CSS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Docker</div>
          <div className="ticker-item"><span className="ticker-dot"></span>AWS</div>
          <div className="ticker-item"><span className="ticker-dot"></span>LangChain</div>
          <div className="ticker-item"><span className="ticker-dot"></span>REST APIs</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Node.js</div>
          <div className="ticker-item"><span className="ticker-dot"></span>MongoDB</div>
          <div className="ticker-item"><span className="ticker-dot"></span>Git & GitHub</div>
          <div className="ticker-item"><span className="ticker-dot"></span>AI Integration</div>
        </div>
      </div>

      {/* 03. PROJECTS */}
      <section id="projects">
        <p className="section-label">03. Projects</p>
        <h2 className="section-title">Things I've Built</h2>

        {/* Filter Bar */}
        <div className="projects-filter-bar reveal">
          <div className="projects-filter-header">
            {/* Category Tabs */}
            <div className="projects-category-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-tab${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  id={`cat-tab-${cat.id}`}
                >
                  <span className="tab-icon">{cat.icon}</span>
                  {cat.label}
                  <span className="tab-count">{getCategoryCount(cat.id)}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Results info */}
          <p className="projects-results-info">
            Showing <span>{filteredProjects.length}</span> of <span>{PROJECTS.length}</span> projects
            {activeCategory !== 'all' && (
              <> in <span>{CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>
            )}
          </p>
        </div>

        <div className="projects-grid reveal">
          {filteredProjects.length === 0 ? (
            <div className="projects-empty-state">
              <div className="empty-icon">🔍</div>
              <p>No projects match this filter combination. Try a different category or status.</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div
                key={project.id}
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

                {/* Card Header with Thumbnail */}
                <div className={`project-card-header ${project.headerClass}`}>
                  <div className="project-mockup-frame">
                    <img src={project.thumb} alt={project.thumbAlt} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="project-card-body">
                  {/* Category label */}
                  <p className="project-category-label">
                    {CATEGORIES.find(c => c.id === project.category)?.icon}{' '}
                    {CATEGORIES.find(c => c.id === project.category)?.label}
                  </p>

                  <div className="project-tech">
                    {project.tech.map(t => (
                      <span key={t.label} className={`tech-tag ${t.cls}`}>{t.label}</span>
                    ))}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-actions">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-btn-primary" id={project.liveId}>
                        View Demo →
                      </a>
                    ) : (
                      <span className="project-btn-coming-soon">
                        <svg viewBox="0 0 24 24" strokeWidth="2.2" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        Under Construction
                      </span>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-btn-github" id={project.githubId} title="GitHub Repository">
                        <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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
              <div className="edu-links">
                <a href="https://jaycees-convent.vercel.app/" target="_blank" rel="noopener noreferrer" className="edu-link">
                  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Website
                </a>
                <a href="https://github.com/mrunali-hatzade/jaycees-convent" target="_blank" rel="noopener noreferrer" className="edu-link-github">
                  <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                  GitHub
                </a>
              </div>
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

      {/* 10. INTERACTIVE PLAYGROUND */}
      <section id="playground">
        <p className="section-label">10. Interactive Playground</p>
        <h2 className="section-title">Developer Playground</h2>
        <p className="playground-subtitle">
          Ready to put Mrunali&apos;s skills to the test? Use the <strong>Build-a-Dev Matcher</strong> to check project compatibility, or play the <strong>Developer Clicker</strong> idle game to dynamically preview her technical stack.
        </p>

        <div className="playground-container reveal">
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
                          ✨ <strong>Verdict: 100% Perfect Fit!</strong> Mrunali Hatzade has hands-on production and internship experience delivering solutions utilizing this exact stack.
                        </div>
                      </div>
                      <div className="scorecard-actions">
                        <button onClick={handlePreFillForm} className="scorecard-btn scorecard-btn-primary">
                          💬 Pre-Fill Contact Form
                        </button>
                        <a
                          href="https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0"
                          download="Mrunali_Hatzade_Resume.pdf"
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

          <div className="playground-template-sale">
            <div className="sale-text">
              <h4>💡 Developer Special: Want this Interactive Playground on your portfolio?</h4>
              <p>Get the fully responsive, plug-and-play Next.js React component &amp; globals.css stylesheet for just $9.</p>
            </div>
            <a href="https://mrunalihatzade.gumroad.com/l/portfolio-playground" target="_blank" rel="noopener noreferrer" className="sale-btn">
              Get Source Code ($9) →
            </a>
          </div>
        </div>
      </section>

      {/* 11. CONTACT */}
      <section id="contact">
        <p className="section-label">11. Contact</p>
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
