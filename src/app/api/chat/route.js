import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are a helpful, friendly AI Assistant embedded in Mrunali Hatzade's Developer Portfolio website.
You have two roles:
1. Answer ANY general knowledge questions helpfully, like ChatGPT would — coding, tech, career advice, general facts, etc.
2. Be the expert on Mrunali Hatzade's portfolio — her skills, projects, experience, services, certifications, and contact info.

Here is all the correct and official information about Mrunali Hatzade:
- Name: Mrunali Hatzade
- Role: Full Stack Developer & AI Integration Engineer.
- Location: Pune, Maharashtra, India.
- Contact Email: mrunalithatzade20@gmail.com
- Contact Phone: +91 72184 05826
- Socials:
  * LinkedIn: https://www.linkedin.com/in/mrunali-hatzade-72a35a231/
  * GitHub: https://github.com/mrunali-hatzade/
  * Instagram: https://www.instagram.com/mrunali.35/
  * YouTube: https://youtube.com/@mrunalihatzade3652?si=a9jj1ibGiBVHT2ib
- Resume Link: https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0
- Services Offered:
  * Full Stack Web Development (React, Next.js, Java, Spring Boot, starting ₹15,000 / project)
  * AI-Integrated Solutions (intelligent automation, LLMs, Chatbots, starting ₹5,000 / integration)
  * UI/UX & Prototyping (user interfaces, starting ₹3,000 / design)
  * Backend & API Development (secure REST APIs with Spring Boot, JWT, starting ₹6,000 / project)
  * Cloud & DevOps (AWS, OCI, Docker, CI/CD, starting ₹4,000 / setup)
  * Tech Content Creation (tutorials, docs, blogs, starting ₹1,500 / piece)
- Projects:
  * Café Aura (Café website built with Next.js, CSS, Tailwind, and other technologies, featuring menu, reservation. Demo: https://cafe-aura-website.vercel.app, GitHub: https://github.com/mrunali-hatzade/cafe-aura-website)
  * LuxeGlow Studio (Modern salon website with stylist profiles, online booking. Demo: https://luxeglow-studio-demo.vercel.app, GitHub: https://github.com/mrunali-hatzade/LuxeGlow-Studio)
  * Iron Pulse (Gym website with membership plans, class schedules. Demo: https://iron-pulse-demo.vercel.app, GitHub: https://github.com/mrunali-hatzade/Iron-Pulse)
  * Lifeline Hospital (Hospital portal with doctor listings, appointments. Demo: https://lifeline-hospital-demo.vercel.app, GitHub: https://github.com/mrunali-hatzade/Lifeline-Hospital)
- Professional Experience:
  * Java Full Stack Developer Intern (Bangalore, remote, Nov 25 - Jan 26) - Developed task management backend with Java/Spring Boot/Spring Security/JWT/MySQL.
  * Full Stack Java Application Developer Intern (Pune, onsite, Dec 23 - Mar 24) - Developed/maintained database modules using Java, JDBC, and MySQL.
  * Web Development Python-Django Intern (Pune, Nov 22 - Mar 23) - Built web applications using Python & Django framework.
- Skills:
  * Frontend & Design: React, Next.js, Vue.js, TypeScript, CSS, Tailwind CSS, HTML5, JavaScript, UI/UX Prototyping.
  * Backend & Database: Java, Spring Boot, Node.js, Express, Python, Django, REST/GraphQL APIs, JWT Auth, MySQL, PostgreSQL, MongoDB, Vector Databases.
  * Cloud, DevOps & Tools: AWS, OCI, Docker, Git/GitHub, CI/CD, VS Code, IntelliJ, Maven.
  * AI & GenTech: ChatGPT/Claude, LLM Integration, LangChain/RAG, Hugging Face, Gemini API, Vector Databases.
- Education:
  * B.E. in Electronics & Telecommunication Engineering (ENTC) (2021-2025) at Dr. D.Y. Patil Institute of Engineering, Management and Research (DYPIEMR), Akurdi, Pune.
  * HSC (2020-2021) at Lal Bahadur Shastri Jr. College, Bhandara.
  * SSC (2018-2019) at Jaycees Convent School, Bhandara.
- Certifications:
  * Oracle Cloud Infrastructure 2025 AI Foundations Associate (Certificate: https://drive.google.com/file/d/1PF7hd8L3kjDin6y7KCC4eBeH-7F67jP_/view?usp=sharing)
  * Full Stack Java Dev (Certificate: https://drive.google.com/file/d/1ZhR5oCYT_xZ86VUFdkF5ktDpXhrX6COH/view?usp=sharing)
  * Google Ads Certification (Certificate: https://drive.google.com/file/d/1nstsrRn0G_x_YA9ZgSt_F-70xUTWUQDS/view?usp=drive_link)
- Achievements:
  * Hackathon Winner: TECHCOMBACT 2.0 (Hardware) at DYPIEMR.
  * State Level Tennikoit Championship: 1st Place (Nandurbar 2016-17 & Nashik 2018-19).

FORMATTING RULES:
1. ALWAYS format links using HTML anchor tags: <a href="url" target="_blank" rel="noopener noreferrer" class="chat-link">Link Text</a>.
2. ALWAYS use HTML tags like <br/> for line breaks and <strong>text</strong> for bold. Never use Markdown like '**' or newlines.
3. Be concise and conversational. Keep answers under 3-4 sentences unless the user asks for details.
4. For general questions (greetings, programming questions, how-are-you, general knowledge), answer them naturally and helpfully. You do NOT need to redirect everything to Mrunali's portfolio.`;

function getLocalFallbackResponse(text) {
  const normalizedText = text.toLowerCase();

  // ── Greetings ──
  if (normalizedText.includes('hello') || normalizedText.includes('hi') || normalizedText.includes('hey') || normalizedText.match(/^(hi|hey|hello|hola|sup|yo)\b/)) {
    return "Hey there! 👋 I'm Mrunali's AI Assistant. I can answer questions about her portfolio <em>and</em> general tech questions. What's on your mind?";
  }

  // ── How are you / conversational ──
  if (normalizedText.includes('how are you') || normalizedText.includes('how r u') || normalizedText.includes('how are u') || normalizedText.includes('what are you')) {
    return "I'm doing great, thanks for asking! 😊 I'm an AI assistant here to help you. Feel free to ask me anything — about Mrunali's portfolio, coding tips, tech advice, or anything else!";
  }

  // ── Thanks / OK / Acknowledgment ──
  if (
    normalizedText.includes('thank') ||
    normalizedText.includes('thanks') ||
    normalizedText.includes('thx') ||
    normalizedText.includes('thank u') ||
    normalizedText.includes('ty') ||
    /\b(ok|okay|fine|cool|sure|alright|got\s+it|perfect|k|kk|awesome|great|nice|good)\b/i.test(normalizedText)
  ) {
    return "You're very welcome! 😊 Let me know if you want to explore something else, or if there's any other information you need about Mrunali. You can also use the quick replies below!";
  }

  // ── Testimonials ──
  if (normalizedText.includes('testimonial') || normalizedText.includes('review') || normalizedText.includes('recommendation') || normalizedText.includes('kind words') || (normalizedText.includes('kind') && normalizedText.includes('words'))) {
    return "Here is what clients have said about working with Mrunali:<br/><br/>" +
           "• <strong>Rahul Kulkarni</strong> (Startup Founder): <em>\"Mrunali delivered a full-stack solution that exceeded our expectations. Her ability to combine clean UI design with solid backend architecture is rare...\"</em><br/><br/>" +
           "• <strong>Priya Sharma</strong> (Business Owner): <em>\"Working with Mrunali on our salon website was a fantastic experience. She understood our brand perfectly...\"</em><br/><br/>" +
           "• <strong>Arjun Mehta</strong> (Tech Lead): <em>\"Mrunali's technical depth in Java and Spring Boot is impressive. She built our REST API layer efficiently...\"</em><br/><br/>" +
           "You can also scroll directly to the <strong><a href='#testimonials' class='chat-link'>Testimonials</a></strong> section on the page!";
  }

  if (normalizedText.includes('about') || normalizedText.includes('yourself') || normalizedText.includes('who is') || normalizedText.includes('who are') || normalizedText.includes('profile') || normalizedText.includes('background') || normalizedText.includes('introduce') || normalizedText.includes('mrunali') || normalizedText.includes('tell me about')) {
    return "Mrunali Hatzade is a Full Stack Developer based in Pune, India. She is a 2025 ENTC Engineering graduate who builds modern, AI-integrated web applications using React, Next.js, Java, and Spring Boot. 🚀";
  }

  if (normalizedText.includes('project') || normalizedText.includes('portfolio') || normalizedText.includes('built') || normalizedText.includes('work') || normalizedText.includes('app')) {
    return "Mrunali has built several premium web applications:<br/><br/>" +
           "• <strong><a href='#projects' class='chat-link'>Café Aura</a></strong> (Café Website)<br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://cafe-aura-website.vercel.app' target='_blank' rel='noopener noreferrer' class='chat-link'>Live Demo</a> &nbsp;|&nbsp; 💻 <a href='https://github.com/mrunali-hatzade/cafe-aura-website' target='_blank' rel='noopener noreferrer' class='chat-link'>GitHub</a><br/><br/>" +
           "• <strong><a href='#projects' class='chat-link'>LuxeGlow Studio</a></strong> (Salon/Spa Website)<br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://luxeglow-studio-demo.vercel.app' target='_blank' rel='noopener noreferrer' class='chat-link'>Live Demo</a> &nbsp;|&nbsp; 💻 <a href='https://github.com/mrunali-hatzade/LuxeGlow-Studio' target='_blank' rel='noopener noreferrer' class='chat-link'>GitHub</a><br/><br/>" +
           "• <strong><a href='#projects' class='chat-link'>Iron Pulse</a></strong> (Fitness/Gym Website)<br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://iron-pulse-demo.vercel.app' target='_blank' rel='noopener noreferrer' class='chat-link'>Live Demo</a> &nbsp;|&nbsp; 💻 <a href='https://github.com/mrunali-hatzade/Iron-Pulse' target='_blank' rel='noopener noreferrer' class='chat-link'>GitHub</a><br/><br/>" +
           "• <strong><a href='#projects' class='chat-link'>Lifeline Hospital</a></strong> (Medical/Hospital Portal)<br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://lifeline-hospital-demo.vercel.app' target='_blank' rel='noopener noreferrer' class='chat-link'>Live Demo</a> &nbsp;|&nbsp; 💻 <a href='https://github.com/mrunali-hatzade/Lifeline-Hospital' target='_blank' rel='noopener noreferrer' class='chat-link'>GitHub</a><br/><br/>" +
           "Click on any project name to view it on the page, or click the links to check them out directly!";
  }

  if (normalizedText.includes('skill') || normalizedText.includes('stack') || normalizedText.includes('tech') || normalizedText.includes('frontend') || normalizedText.includes('backend') || normalizedText.includes('java') || normalizedText.includes('react') || normalizedText.includes('spring')) {
    return "Her core stack includes Frontend: React, Next.js, TypeScript, CSS/Tailwind; Backend: Java, Spring Boot, Node.js/Express, Python; and Databases: MySQL and MongoDB.";
  }

  if (normalizedText.includes('experience') || normalizedText.includes('intern') || normalizedText.includes('job') || normalizedText.includes('work')) {
    return "She has interned as a Java Full Stack Developer Intern (Bangalore, remote, Nov 25 - Jan 26), Full Stack Java App Developer Intern (Pune, onsite, Dec 23 - Mar 24), and Web Dev Intern (Pune, Nov 22 - Mar 23).";
  }

  if (normalizedText.includes('service') || normalizedText.includes('hire') || normalizedText.includes('pricing') || normalizedText.includes('price') || normalizedText.includes('cost') || normalizedText.includes('rate')) {
    return "She offers: Full Stack Web Dev (starting ₹15k), AI Integrations (starting ₹5k), UI/UX Design (starting ₹3k), Backend/API Dev (starting ₹6k), DevOps setup (starting ₹4k), and Tech Content Creation (starting ₹1.5k).";
  }

  if (normalizedText.includes('education') || normalizedText.includes('college') || normalizedText.includes('degree') || normalizedText.includes('qualification') || normalizedText.includes('study') || normalizedText.includes('school') || normalizedText.includes('university') || normalizedText.includes('dypiemr') || normalizedText.includes('engineering') || normalizedText.includes('academic') || normalizedText.includes('hsc') || normalizedText.includes('ssc')) {
    return "Mrunali has a strong academic foundation in engineering:<br/><br/>" +
           "• 🎓 <strong>B.E. in Electronics & Telecommunication (ENTC)</strong> (2021–2025)<br/>" +
           "  &nbsp;&nbsp;<a href='#education' class='chat-link'>Dr. D.Y. Patil Institute of Engineering, Management and Research (DYPIEMR), Akurdi, Pune</a><br/><br/>" +
           "• 🏫 <strong>HSC (Higher Secondary Education)</strong> (2020–2021)<br/>" +
           "  &nbsp;&nbsp;Lal Bahadur Shastri Jr. College, Bhandara<br/><br/>" +
           "• 🏫 <strong>SSC (Secondary School Education)</strong> (2018–2019)<br/>" +
           "  &nbsp;&nbsp;Jaycees Convent School, Bhandara<br/><br/>" +
           "You can click on the links to scroll directly to the <strong><a href='#education' class='chat-link'>Education</a></strong> section!";
  }

  if (normalizedText.includes('cert') || normalizedText.includes('course') || normalizedText.includes('credential') || normalizedText.includes('certification') || normalizedText.includes('oracle') || normalizedText.includes('google ads')) {
    return "Mrunali holds the following professional credentials:<br/><br/>" +
           "• 🏅 <strong>Oracle Cloud Infrastructure 2025 — AI Foundations Associate</strong><br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://drive.google.com/file/d/1PF7hd8L3kjDin6y7KCC4eBeH-7F67jP_/view?usp=sharing' target='_blank' rel='noopener noreferrer' class='chat-link'>View Certificate</a><br/><br/>" +
           "• ☕ <strong>Full Stack Java Dev — Core Java, Spring Boot, REST APIs, Hibernate</strong><br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://drive.google.com/file/d/1ZhR5oCYT_xZ86VUFdkF5ktDpXhrX6COH/view?usp=sharing' target='_blank' rel='noopener noreferrer' class='chat-link'>View Certificate</a><br/><br/>" +
           "• 📢 <strong>Google Ads Certification — Search Advertising</strong><br/>" +
           "  &nbsp;&nbsp;🔗 <a href='https://drive.google.com/file/d/1nstsrRn0G_x_YA9ZgSt_F-70xUTWUQDS/view?usp=drive_link' target='_blank' rel='noopener noreferrer' class='chat-link'>View Certificate</a><br/><br/>" +
           "Check the <strong><a href='#certifications' class='chat-link'>Credentials</a></strong> section to view them on page!";
  }

  if (normalizedText.includes('award') || normalizedText.includes('achievement') || normalizedText.includes('hackathon') || normalizedText.includes('winner') || normalizedText.includes('sport') || normalizedText.includes('recognition') || normalizedText.includes('tennikoit')) {
    return "Mrunali has received several notable achievements and recognitions:<br/><br/>" +
           "• 🥇 <strong>Hackathon Winner</strong> — TECHCOMBACT 2.0 (Hardware) at DYPIEMR<br/><br/>" +
           "• 🏆 <strong>State Level — 1st Place</strong> — Tennikoit Championship, Nandurbar (2016–17)<br/><br/>" +
           "• 🏆 <strong>State Level — 1st Place</strong> — Tennikoit Championship, Nashik (2018–19)<br/><br/>" +
           "Feel free to check out the <strong><a href='#awards' class='chat-link'>Achievements</a></strong> section on the page!";
  }

  if (normalizedText.includes('resume') || normalizedText.includes('cv') || normalizedText.includes('download')) {
    return "You can view or download Mrunali's updated resume here:<br/><br/>" +
           "📄 <strong><a href='https://drive.google.com/uc?export=download&id=13bFl8OEjv3xnyamQGS7wz9ozDqU4M7m0' target='_blank' rel='noopener noreferrer' class='chat-link'>Download Resume (PDF)</a></strong><br/><br/>" +
           "Alternatively, you can click the 'Resume' button located in the Hero section at the top!";
  }

  if (normalizedText.includes('contact') || normalizedText.includes('email') || normalizedText.includes('phone') || normalizedText.includes('number') || normalizedText.includes('call') || normalizedText.includes('reach') || normalizedText.includes('message')) {
    return "You can reach Mrunali via email at mrunalithatzade20@gmail.com, or phone at +91 72184 05826. Her socials (LinkedIn, GitHub, Instagram, YouTube) are also linked in the footer!";
  }

  // ── General / unmatched — no longer blindly redirects to contact ──
  return "Hmm, I'm not totally sure about that one! 🤔 You can ask me about Mrunali's <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, <strong>services</strong>, or <strong>contact info</strong> — or use the quick reply buttons below to explore!";
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required." }, { status: 400 });
    }

    const lastMessageText = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return local fallback if no API key is set
      console.log("No GEMINI_API_KEY set. Using smart local fallback response.");
      const reply = getLocalFallbackResponse(lastMessageText);
      return NextResponse.json({ reply });
    }

    // Map conversation history to Gemini format (user -> 'user', bot -> 'model')
    const contents = messages.map((msg) => {
      let role = "user";
      if (msg.sender === "bot") {
        role = "model";
      }
      return {
        role,
        parts: [{ text: msg.text }]
      };
    });

    // Make API request to Google Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API call failed:", errorText);
      // Fallback
      const reply = getLocalFallbackResponse(lastMessageText);
      return NextResponse.json({ reply });
    }

    const data = await response.json();
    let reply = "";
    
    try {
      reply = data.candidates[0].content.parts[0].text;
      // Convert standard bold Markdown "**text**" to "<strong>text</strong>"
      reply = reply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Convert standard italic Markdown "*text*" or "_text_" to "<em>text</em>"
      reply = reply.replace(/\*(.*?)\*/g, "<em>$1</em>");
      reply = reply.replace(/_(.*?)_/g, "<em>$1</em>");
      // Convert carriage returns/newlines to HTML <br/> tags
      reply = reply.replace(/\n/g, "<br/>");
    } catch (e) {
      console.error("Failed to parse Gemini response parts:", e);
      reply = getLocalFallbackResponse(lastMessageText);
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error in chat API route:", error);
    try {
      const { messages } = await request.json();
      const lastMessageText = messages[messages.length - 1].text;
      const reply = getLocalFallbackResponse(lastMessageText);
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json({ reply: "I'm having trouble connecting right now. Please message Mrunali directly at mrunalithatzade20@gmail.com!" });
    }
  }
}
