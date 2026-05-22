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

  // 3D Canvas Background Animation (Floating Constellation)
  useEffect(() => {
    const canvas = document.getElementById('bg-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(65, Math.floor((width * height) / 24000));
    const connectionDistance = 145;
    
    let mouse = { x: null, y: null, active: false };

    class Particle {
      constructor() {
        this.reset();
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * 1000 + 200;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.vz = -Math.random() * 0.7 - 0.3; // depth velocity
        this.radius = Math.random() * 1.4 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (mouse.active) {
          const dx = (mouse.x - width / 2) * 0.05;
          const dy = (mouse.y - height / 2) * 0.05;
          this.x += (dx - this.x) * 0.002;
          this.y += (dy - this.y) * 0.002;
        }

        if (this.z <= 10 || Math.abs(this.x) > width || Math.abs(this.y) > height) {
          this.reset();
          this.z = 1000;
        }
      }

      draw() {
        const fov = 350;
        const scale = fov / (fov + this.z);
        const projX = this.x * scale + width / 2;
        const projY = this.y * scale + height / 2;

        let alpha = 1 - (this.z / 1200);
        if (this.z < 100) alpha *= (this.z / 100);
        alpha = Math.max(0, Math.min(0.60, alpha));

        ctx.beginPath();
        ctx.arc(projX, projY, this.radius * scale * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
        ctx.fill();

        return { x: projX, y: projY, alpha };
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

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
      ctx.fillStyle = 'rgba(11, 12, 16, 0.18)'; 
      ctx.fillRect(0, 0, width, height);

      const projected = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        projected.push(p.draw());
      }

      ctx.lineWidth = 0.55;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const pi = projected[i];
          const pj = projected[j];

          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            let lineAlpha = (1 - dist / connectionDistance) * 0.12;
            lineAlpha *= Math.min(pi.alpha, pj.alpha);
            
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${lineAlpha})`;
            ctx.stroke();
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

  // Code editor typewriter effect for bio
  const codeText = `const developer = {
  name: 'Mrunali Hatzade',
  role: 'Full-Stack Developer',
  stack: ['Java', 'Spring Boot', 'Next.js', 'AI'],
  available: true,
  location: 'Pune, India'
};

// Let's build something incredible together`;

  const [typedCode, setTypedCode] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < codeText.length) {
        setTypedCode(codeText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Cycling role typewriter
  const roles = [
    'Full Stack Developer',
    'AI Integration Engineer',
    'DevOps Explorer',
    'Content Creator',
    'Java & Spring Boot Dev',
  ];
  const [typedRole, setTypedRole] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    let timeout;
    if (!isDeleting && typedRole === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedRole === '') {
      setIsDeleting(false);
      setRoleIdx(prev => (prev + 1) % roles.length);
    } else {
      const speed = isDeleting ? 45 : 75;
      timeout = setTimeout(() => {
        setTypedRole(current.slice(0, isDeleting ? typedRole.length - 1 : typedRole.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [typedRole, roleIdx, isDeleting]);

  const highlightCode = (line) => {
    let comment = '';
    let codePart = line;
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      codePart = line.substring(0, commentIdx);
      comment = line.substring(commentIdx);
    }

    const strings = [];
    let processedCode = codePart.replace(/('[^'\n]*'?|"[^"\n]*"?)/g, (match) => {
      strings.push(match);
      return `__STR_${strings.length - 1}__`;
    });

    let escaped = processedCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/\b(const)\b/g, '<span class="code-keyword">$1</span>');
    escaped = escaped.replace(/\b(true|false)\b/g, '<span class="code-boolean">$1</span>');
    escaped = escaped.replace(/\b(name|role|stack|available|location)(?=\s*:)/g, '<span class="code-property">$1</span>');

    escaped = escaped.replace(/__STR_(\d+)__/g, (match, p1) => {
      const strVal = strings[parseInt(p1, 10)];
      const escapedStrVal = strVal
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<span class="code-string">${escapedStrVal}</span>`;
    });

    if (comment) {
      const escapedComment = comment
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      escaped += `<span class="code-comment">${escapedComment}</span>`;
    }

    return escaped;
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
          <div className="hero-content">
            <p className="hero-tag">// hello world — welcome to my portfolio</p>
            <h1 className="hero-name">
              Mrunali<br />Hatzade
            </h1>
            <p className="hero-role">
              <span className="role-dash">— </span>{typedRole}<span className="hero-desc-cursor">|</span>
            </p>

            <p className="hero-desc">
              I build complete digital experiences — from pixel-perfect frontends to robust backends — and I&apos;m passionate about integrating AI into modern solutions. In today&apos;s market, AI isn&apos;t optional; it&apos;s essential. Let me help your business stand out.
            </p>
            <div className="hero-btns">
              <a href="#projects" className="btn-primary">View My Work</a>
              <a href="#contact" className="btn-accent">Get In Touch →</a>
              <a
                href="https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0"
                download="Mrunali_Hatzade_Resume.pdf"
                className="btn-resume-icon"
                title="Download Resume"
                aria-label="Download Resume"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span className="btn-resume-label">Resume</span>
              </a>
            </div>
          </div>
          
          <div className="hero-socials-float-container">
            <a href="https://github.com/mrunali-hatzade/" target="_blank" rel="noreferrer" className="floating-social-badge github">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/mrunali-hatzade-72a35a231/" target="_blank" rel="noreferrer" className="floating-social-badge linkedin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/mrunali.35/" target="_blank" rel="noreferrer" className="floating-social-badge instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span>Instagram</span>
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mrunalithatzade20@gmail.com" target="_blank" rel="noopener noreferrer" className="floating-social-badge email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Email</span>
            </a>
            <a href="https://youtube.com/@mrunalihatzade3652?si=a9jj1ibGiBVHT2ib" target="_blank" rel="noreferrer" className="floating-social-badge youtube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.91 29 29 0 00.46-5.33 29 29 0 00-.46-5.34z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </section>

      {/* 01. ABOUT */}
      <section id="about">
        <p className="section-label">01. About</p>
        <h2 className="section-title">Who I Am</h2>
        <div className="about-grid reveal">
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
            <div className="svc-price">Starting ₹15,000 / project</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">02 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
            </div>
            <h3>AI-Integrated Solutions</h3>
            <p>Embed AI into your product — chatbots, intelligent automation, LLM integrations. Stay competitive with AI-first features.</p>
            <div className="svc-price">Starting ₹5,000 / integration</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">03 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <h3>UI/UX & Prototyping</h3>
            <p>User-first interfaces that look stunning and feel intuitive. Designs that convert visitors into loyal customers.</p>
            <div className="svc-price">Starting ₹3,000 / design</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">04 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <h3>Backend & API Dev</h3>
            <p>Secure, high-performance REST APIs with Spring Boot, Node.js and Java. JWT auth, clean architecture, production-ready.</p>
            <div className="svc-price">Starting ₹6,000 / project</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">05 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
            </div>
            <h3>Cloud & DevOps</h3>
            <p>Deploy and scale on AWS, OCI, Docker and CI/CD pipelines. Ship faster and manage infrastructure effortlessly.</p>
            <div className="svc-price">Starting ₹4,000 / setup</div>
          </div>
          <div className="svc-card">
            <div className="svc-num">06 /</div>
            <div className="svc-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Tech Content Creation</h3>
            <p>Tutorials, documentation, social posts and blogs that educate, build authority and grow your tech audience.</p>
            <div className="svc-price">Starting ₹1,500 / piece</div>
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
            <span className="project-emoji">☕</span>
            <p className="project-icon">// project_01</p>
            <h3>Café Aura</h3>
            <p>A beautiful, fully responsive café website featuring an interactive menu, gallery, reservation system, and warm brand identity — designed to bring the café experience online.</p>
            <div className="project-links">
              <a href="https://cafe-aura-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link" id="cafe-live">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
              <a href="https://github.com/mrunali-hatzade/Cafe-Aura" target="_blank" rel="noopener noreferrer" className="project-link" id="cafe-github">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                GitHub
              </a>
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
            <span className="project-emoji">💇</span>
            <p className="project-icon">// project_02</p>
            <h3>LuxeGlow Studio</h3>
            <p>A sleek, modern salon website with service listings, stylist profiles, online booking integration, and a gallery — crafted to elevate the brand's digital presence.</p>
            <div className="project-links">
              <a href="https://luxeglow-studio-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link" id="salon-live">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
              <a href="https://github.com/mrunali-hatzade/LuxeGlow-Studio" target="_blank" rel="noopener noreferrer" className="project-link" id="salon-github">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                GitHub
              </a>
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
            <span className="project-emoji">🏋️</span>
            <p className="project-icon">// project_03</p>
            <h3>Iron Pulse</h3>
            <p>An energetic, high-impact gym website featuring membership plans, class schedules, trainer profiles, and a motivational design to convert visitors into members.</p>
            <div className="project-links">
              <a href="https://iron-pulse-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link" id="gym-live">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
              <a href="https://github.com/mrunali-hatzade/Iron-Pulse" target="_blank" rel="noopener noreferrer" className="project-link" id="gym-github">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                GitHub
              </a>
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
            <span className="project-emoji">🏥</span>
            <p className="project-icon">// project_04</p>
            <h3>Lifeline Hospital</h3>
            <p>A professional hospital website with doctor listings, department info, appointment booking, and an emergency contact section — building trust with a clean, accessible design.</p>
            <div className="project-links">
              <a href="https://lifeline-hospital-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link" id="hospital-live">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
              <a href="https://github.com/mrunali-hatzade/Lifeline-Hospital" target="_blank" rel="noopener noreferrer" className="project-link" id="hospital-github">
                <svg viewBox="0 0 24 24" strokeWidth="1.8" fill="none" stroke="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                GitHub
              </a>
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
        <p>© 2025 Mrunali Hatzade. All rights reserved</p>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {messages.length > 1 && (
                  <button 
                    type="button"
                    className="chatbot-header-action-btn"
                    onClick={promptNewChat} 
                    title="New Chat"
                    style={{
                      background: 'rgba(100,255,218,0.1)',
                      border: '1px solid rgba(100,255,218,0.2)',
                      color: 'var(--accent)',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background 0.25s'
                    }}
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
                    <div className="chat-bubble bot-bubble chat-confirm-box" style={{ width: '100%', maxWidth: '240px', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
                      <p style={{ marginBottom: '0.8rem', fontSize: '0.82rem', color: 'var(--text)', lineHeight: '1.4' }}>{msg.text}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button" 
                          onClick={handleStartNewChat}
                          style={{
                            background: 'var(--accent)',
                            color: '#0b0c10',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            flex: '1'
                          }}
                        >
                          Start New
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleContinueChat(idx)}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--text)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            flex: '1'
                          }}
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
    </>
  );
}
