import nodemailer from "nodemailer";

/**
 * Sends a contact email notification.
 * Supports Resend API (via fetch) or SMTP (via Nodemailer) depending on environment variables.
 * 
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} [params.subject]
 * @param {string} params.message
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "mrunalithatzade20@gmail.com";
  const emailSubject = `[Portfolio Contact] New message from ${name}`;
  
  const textContent = `
New message from your Portfolio!

Name: ${name}
Email: ${email}
Subject: ${subject || "N/A"}
Message:
${message}
  `.trim();

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #64ffda; background: #0b0c10; padding: 15px; margin-top: 0; border-radius: 5px; text-align: center;">
        Portfolio Contact Form Submission
      </h2>
      <p>You received a new message from your portfolio contact form:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 100px; border-bottom: 1px solid #eee;">Name:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject || "N/A"}</td>
        </tr>
      </table>
      <div style="background: #1f2833; color: #c5a059; padding: 15px; border-radius: 5px; border-left: 4px solid #64ffda; white-space: pre-wrap;">${message}</div>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 0.8rem; color: #888; text-align: center;">
        Sent automatically from your portfolio website.
      </p>
    </div>
  `;

  // 1. Try Resend API first if configured
  if (process.env.RESEND_API_KEY) {
    console.log("Resend API Key found. Attempting to send email via Resend...");
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: receiverEmail,
          subject: emailSubject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Resend HTTP error ${response.status}`);
      }

      const resData = await response.json();
      console.log("Email sent successfully via Resend. ID:", resData.id);
      return { success: true, provider: "resend", id: resData.id };
    } catch (error) {
      console.error("Error sending email via Resend:", error);
      throw error; // Re-throw to propagate back to the handler
    }
  }

  // 2. Try SMTP/Nodemailer if SMTP is configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log("SMTP Credentials found. Attempting to send email via Nodemailer...");
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: parseInt(process.env.SMTP_PORT || "465", 10) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Portfolio Alert" <${process.env.SMTP_USER}>`,
        to: receiverEmail,
        replyTo: email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully via Nodemailer. Message ID:", info.messageId);
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (error) {
      console.error("Error sending email via Nodemailer:", error);
      throw error;
    }
  }

  // 3. Neither configured
  console.warn("Neither RESEND_API_KEY nor SMTP credentials (SMTP_USER/SMTP_PASS) were found in .env. Skipping email delivery.");
  return { success: false, reason: "No email provider configured" };
}
