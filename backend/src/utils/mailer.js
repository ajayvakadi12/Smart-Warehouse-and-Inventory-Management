const nodemailer = require("nodemailer");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isEmailConfigured() {
  const u = process.env.EMAIL_USER || "";
  const p = process.env.EMAIL_PASS || "";
  return (
    u.length > 0 &&
    p.length > 0 &&
    !u.includes("your_gmail") &&
    !p.includes("your_gmail")
  );
}

// Build a real Gmail transporter
function buildGmailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Build a free Ethereal test transporter (auto-generates throwaway account)
async function buildEtherealTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    previewUrl: true,
  };
}

// ─── HTML Template ────────────────────────────────────────────────────────────

function buildHtml(toEmail, otp) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
          📦 SmartWarehouse
        </h1>
        <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px;">Inventory Management System</p>
      </div>
      <div style="padding:32px 28px;background:#fff;">
        <h2 style="font-size:20px;font-weight:700;color:#1e293b;margin:0 0 8px;">Password Reset Request</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;line-height:1.6;">
          We received a request to reset the password for <strong style="color:#1e293b;">${toEmail}</strong>.
          Use the OTP below — it is valid for <strong>10 minutes</strong>.
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#64748b;letter-spacing:2px;text-transform:uppercase;">Your OTP Code</p>
          <p style="margin:0;font-size:40px;font-weight:900;letter-spacing:12px;color:#2563eb;font-family:monospace;">${otp}</p>
        </div>
        <p style="font-size:13px;color:#94a3b8;margin:0;line-height:1.6;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
      <div style="background:#f8fafc;padding:16px 28px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">
          © ${new Date().getFullYear()} SmartWarehouse Inventory System. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Send OTP email.
 * - If Gmail credentials are configured in .env  → sends a real email via Gmail.
 * - Otherwise                                    → uses a free Ethereal test account,
 *   prints the OTP + preview URL to the backend console (no setup required).
 */
const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"SmartWarehouse" <${process.env.EMAIL_USER || "noreply@smartwarehouse.dev"}>`,
    to: toEmail,
    subject: "🔐 Password Reset OTP — SmartWarehouse",
    html: buildHtml(toEmail, otp),
  };

  if (isEmailConfigured()) {
    // ── Production: real Gmail send ──────────────────────────────────────────
    const transporter = buildGmailTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
  } else {
    // ── Development: Ethereal preview ────────────────────────────────────────
    console.warn(
      "\n⚠️  EMAIL_USER / EMAIL_PASS not configured in .env — using Ethereal test account.\n"
    );

    const { transporter } = await buildEtherealTransporter();
    const info = await transporter.sendMail(mailOptions);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 OTP for ${toEmail} : \x1b[33m${otp}\x1b[0m`);
    console.log(`🔗 Preview URL : ${nodemailer.getTestMessageUrl(info)}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
};

module.exports = { sendOTPEmail };
