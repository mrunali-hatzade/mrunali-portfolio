import "./globals.css";

export const metadata = {
  title: "Mrunali Hatzade | Full Stack Developer & AI Explorer",
  description: "Mrunali Hatzade — Full Stack Developer skilled in Java, Spring Boot, Node.js, and AI. Open to full-time opportunities. Based in Pune, India.",
  charSet: "UTF-8",
  icons: {
    icon: "/mh_logo.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&family=Cormorant+Garamond:ital,wght@0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
