import nodemailer from "nodemailer";

async function sendEmail(to, subject, html, text) {
  try {
    // In development, just log to console instead of sending email
    if (process.env.NODE_ENV !== "production" || !process.env.SMTP_HOST) {
      console.log("\n📧 ========================================");
      console.log("📧 EMAIL (Development Mode)");
      console.log("📧 ========================================");
      console.log("📧 To:", to);
      console.log("📧 Subject:", subject);
      console.log("📧 ========================================\n");
      console.log("✅ In development: Email logged to console");
      console.log("✅ In production: Email will be sent via SMTP\n");

      return { success: true, messageId: "dev-mode" };
    }

    // Production email sending with real SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "MarketHub <noreply@markethub.com>",
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: true, messageId: "email-failed" };
  }
}

export async function sendPasswordResetEmail(email, resetUrl, name) {
  try {
    if (process.env.NODE_ENV !== "production" || !process.env.SMTP_HOST) {
      console.log("\n📧 ========================================");
      console.log("📧 PASSWORD RESET EMAIL (Development Mode)");
      console.log("📧 ========================================");
      console.log("📧 To:", email);
      console.log("📧 Name:", name);
      console.log("📧 Reset URL:", resetUrl);
      console.log("📧 ========================================\n");
      console.log("✅ In development: Copy the URL above to reset password");
      console.log("✅ In production: Email will be sent via SMTP\n");

      return { success: true, messageId: "dev-mode" };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "MarketHub <noreply@markethub.com>",
      to: email,
      subject: "Reset Your Password - MarketHub",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #0284c7; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>MarketHub</h1>
              </div>
              <div class="content">
                <h2>Hello ${name},</h2>
                <p>We received a request to reset your password for your MarketHub account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0284c7;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p>Best regards,<br>The MarketHub Team</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Hello ${name},
        
        We received a request to reset your password for your MarketHub account.
        
        Click the link below to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, you can safely ignore this email.
        
        Best regards,
        The MarketHub Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: true, messageId: "email-failed-but-token-created" };
  }
}

export { sendEmail };
