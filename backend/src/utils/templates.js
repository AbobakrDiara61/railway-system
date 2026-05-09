// ============================================================
// RailConnect Email Templates
// ============================================================

const BASE_CSS = `
  body{margin:0;padding:0;background:#EEF1F6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}
  img{border:0;height:auto;outline:none;text-decoration:none}
  table,td{mso-table-lspace:0;mso-table-rspace:0}

  .wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(11,29,58,.1)}
  @media(max-width:600px){.wrap{border-radius:0}}

  /* Header */
  .eh{background:#0B1D3A;padding:28px 36px;text-align:center}
  .eh-brand{font-size:22px;font-weight:800;color:#fff;letter-spacing:.5px;text-decoration:none}
  .eh-brand span{color:#D4A843}
  .eh-sub{font-size:11px;color:rgba(255,255,255,.5);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
  .eh-bar{width:48px;height:2px;background:linear-gradient(90deg,#C62828,#D4A843);margin:12px auto 0;border-radius:2px}

  /* Body */
  .eb{padding:32px 36px 24px;font-size:14px;line-height:1.75;color:#4A5568}
  @media(max-width:600px){.eb{padding:24px 20px}}
  .eb h1{font-size:20px;font-weight:700;color:#0B1D3A;margin:0 0 8px}
  .eb p{margin:0 0 14px}

  /* Cards */
  .card{background:#F8F9FC;border:1px solid #e8eaf0;border-radius:8px;padding:20px;margin:16px 0}
  .card-dark{background:#0B1D3A;border-radius:8px;padding:22px;margin:16px 0}
  .card-gold{background:#FFFBF0;border:1px solid #F5E6C4;border-radius:8px;padding:22px;margin:16px 0;text-align:center}
  .card-title{font-size:11px;font-weight:700;color:#0B1D3A;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #D4A843;padding-bottom:8px;margin-bottom:14px;display:inline-block}
  .card-dark .card-title{color:#D4A843;border-bottom-color:rgba(212,168,67,.3)}

  /* Feature rows */
  .feat{display:flex;align-items:flex-start;gap:10px;padding:7px 0;font-size:13px;color:#4A5568;border-bottom:1px solid rgba(0,0,0,.05)}
  .feat:last-child{border-bottom:none}

  /* Data rows (dark card) */
  .drow{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:13px}
  .drow:last-child{border-bottom:none}
  .drow-lbl{font-size:12px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px}
  .drow-val{color:#fff;font-weight:600}

  /* OTP */
  .otp-box{background:#F8F9FC;border:2px dashed #d0d5dd;border-radius:10px;padding:24px 16px;text-align:center;margin:20px 0}
  .otp-lbl{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#718096;font-weight:600;margin-bottom:10px}
  .otp-code{font-size:38px;font-weight:800;color:#0B1D3A;letter-spacing:10px;font-family:'Courier New',monospace}
  .otp-bar{width:40px;height:2px;background:linear-gradient(90deg,#C62828,#D4A843);margin:12px auto;border-radius:2px}

  /* Alerts */
  .alert{display:flex;align-items:flex-start;gap:10px;padding:13px 16px;border-radius:6px;font-size:13px;margin:14px 0}
  .alert-warn{background:#FFF3E0;border-left:3px solid #E65100;color:#E65100}
  .alert-info{background:#E3F2FD;border-left:3px solid #0B1D3A;color:#0B1D3A}
  .alert-success{background:#E8F5E9;border-left:3px solid #2E7D32;color:#2E7D32}
  .alert-err{background:#FFEBEE;border-left:3px solid #C62828;color:#C62828}

  /* Buttons */
  .btn{display:inline-block;padding:13px 32px;border-radius:7px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:.2px}
  .btn-red{background:#C62828;color:#fff !important}
  .btn-navy{background:#0B1D3A;color:#fff !important}
  .btn-gold{background:#D4A843;color:#0B1D3A !important}
  .btn-wrap{text-align:center;margin:22px 0}

  /* Misc */
  .divider{height:1px;background:linear-gradient(90deg,transparent,#d0d5dd,transparent);margin:22px 0}
  .center-icon{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px}
  .text-sm{font-size:12px;color:#718096}

  /* Footer */
  .ef{background:#0B1D3A;padding:28px 36px;text-align:center}
  .ef-brand{font-size:14px;font-weight:700;color:#fff;margin-bottom:3px}
  .ef-brand span{color:#D4A843}
  .ef-sub{font-size:10px;color:rgba(255,255,255,.35);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
  .ef-links{margin-bottom:12px}
  .ef-links a{color:rgba(255,255,255,.55);text-decoration:none;font-size:12px;margin:0 8px}
  .ef-contact{font-size:11px;color:rgba(255,255,255,.4);line-height:1.9;margin-bottom:14px}
  .ef-contact a{color:#D4A843;text-decoration:none}
  .ef-hr{height:1px;background:rgba(255,255,255,.08);margin:12px 0}
  .ef-copy{font-size:10px;color:rgba(255,255,255,.25)}
`;

const HEADER = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td class="eh">
      <a href="#" class="eh-brand"><span>🚂</span> RailConnect</a>
      <div class="eh-sub">Your Journey Starts Here</div>
      <div class="eh-bar"></div>
    </td></tr>
  </table>`;

const FOOTER = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td class="ef">
      <div class="ef-brand"><span>🚂</span> RailConnect</div>
      <div class="ef-sub">Your Journey Starts Here</div>
      <div class="ef-links">
        <a href="#">Help Center</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
      <div class="ef-contact">
        📞 <a href="tel:+18001234567">1-800-123-4567</a> &nbsp;·&nbsp;
        ✉️ <a href="mailto:support@railconnect.com">support@railconnect.com</a><br>
        📍 42 Rail Plaza, Central Station, New Delhi 110001
      </div>
      <div class="ef-hr"></div>
      <div class="ef-copy">
        © 2025 RailConnect Railway Systems. All rights reserved.<br>
        This is an automated email. Please do not reply.
      </div>
    </td></tr>
  </table>`;

const shell = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title} — RailConnect</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0">
    <tr><td style="padding:0 16px">
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" class="wrap">
        ${HEADER}
        <tr><td class="eb">${body}</td></tr>
        ${FOOTER}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ============================================================
// 1. Welcome
// ============================================================
export const WELCOME_EMAIL_TEMPLATE = (userName) => shell(
  'Welcome',
  `<h1>Welcome aboard, ${userName}! 🎉</h1>
  <p>We're thrilled to have you join the RailConnect family. Your seamless railway travel experience starts right now.</p>
  <div class="card">
    <div class="card-title">What awaits you</div>
    <div class="feat"><span>🎫</span> Easy online ticket booking across 5,000+ routes</div>
    <div class="feat"><span>💰</span> Exclusive fares &amp; loyalty rewards on every journey</div>
    <div class="feat"><span>🔔</span> Real-time train updates &amp; delay notifications</div>
    <div class="feat"><span>📱</span> Manage bookings anytime, from any device</div>
  </div>
  <div class="btn-wrap"><a href="#" class="btn btn-red">Start Your First Journey →</a></div>
  <div class="divider"></div>
  <p class="text-sm">Questions? Call <a href="tel:+18001234567" style="color:#C62828;text-decoration:none">1-800-123-4567</a>. Happy travels! 🚂</p>`
);

// ============================================================
// 2. OTP Verification
// ============================================================
export const OTP_VERIFICATION_EMAIL_TEMPLATE = (otpCode, userName = 'User') => shell(
  'Verify Your Email',
  `<h1>Verify your email 🔐</h1>
  <p>Hi ${userName}, enter the code below to complete your registration:</p>
  <div class="otp-box">
    <div class="otp-lbl">Your Verification Code</div>
    <div class="otp-code">${otpCode}</div>
    <div class="otp-bar"></div>
  </div>
  <div class="alert alert-warn">⏱️ &nbsp;This code expires in <strong>10 minutes</strong>. Request a new one from the login page if needed.</div>
  <div class="alert alert-info">🛡️ &nbsp;<strong>Security note:</strong> Never share this code. RailConnect will never ask for your OTP via phone or chat.</div>
  <p class="text-sm" style="margin-top:8px">Didn't create an account? You can safely ignore this email.</p>`
);

// ============================================================
// 3. Password Reset Request
// ============================================================
export const PASSWORD_RESET_REQUEST_TEMPLATE = (resetLink, userName = 'User') => shell(
  'Reset Your Password',
  `<h1>Reset your password 🔑</h1>
  <p>Hi ${userName}, we received a request to reset your RailConnect account password.</p>
  <p>Click below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
  <div class="btn-wrap"><a href="${resetLink}" class="btn btn-red">Reset Password →</a></div>
  <div class="divider"></div>
  <p class="text-sm" style="margin-bottom:8px">If the button doesn't work, copy this link into your browser:</p>
  <div style="background:#F8F9FC;border:1px solid #e8eaf0;border-radius:6px;padding:10px 14px;font-size:11px;color:#718096;word-break:break-all;font-family:'Courier New',monospace">${resetLink}</div>
  <div class="alert alert-err" style="margin-top:16px">⚠️ &nbsp;Didn't request this? Ignore this email — your password stays unchanged.</div>
  <div class="alert alert-info">🛡️ &nbsp;Never share your password reset link with anyone.</div>`
);

// ============================================================
// 4. Password Reset Success
// ============================================================
export const PASSWORD_RESET_SUCCESS_TEMPLATE = (userName) => shell(
  'Password Updated',
  `<div style="text-align:center">
    <div class="center-icon" style="background:#E8F5E9">✅</div>
    <h1>Password updated!</h1>
    <p>Hi ${userName}, your account password has been changed successfully.</p>
  </div>
  <div class="alert alert-success">🔒 &nbsp;Your account is now secured. All previous sessions have been signed out for your safety.</div>
  <div class="btn-wrap"><a href="#" class="btn btn-navy">Login to your account →</a></div>
  <div class="divider"></div>
  <p class="text-sm" style="text-align:center">Didn't make this change? Contact us at <a href="mailto:support@railconnect.com" style="color:#C62828;text-decoration:none">support@railconnect.com</a> or <a href="tel:+18001234567" style="color:#C62828;text-decoration:none">1-800-123-4567</a>.</p>`
);

// ============================================================
// 5. Account Deleted
// ============================================================
export const ACCOUNT_DELETED_TEMPLATE = (userName = 'User') => shell(
  'Account Deleted',
  `<div style="text-align:center">
    <div class="center-icon" style="background:#EEF1F6;font-size:28px">👋</div>
    <h1>Goodbye, ${userName}</h1>
    <p>Your RailConnect account has been permanently deleted as requested.</p>
  </div>
  <div class="card">
    <div class="card-title">What happens next</div>
    <div class="feat"><span>🗑️</span> All personal data has been permanently removed</div>
    <div class="feat"><span>🎫</span> Active bookings remain valid until journey completion</div>
    <div class="feat"><span>💰</span> Pending refunds go to your original payment method</div>
    <div class="feat"><span>⭐</span> Loyalty points forfeited per our terms</div>
  </div>
  <div class="card-gold">
    <h3 style="color:#B8922E;font-size:15px;font-weight:700;margin-bottom:8px">We'd love to have you back!</h3>
    <p style="font-size:13px;color:#4A5568;margin-bottom:14px">Create a new account anytime and start fresh with all our latest features.</p>
    <a href="#" class="btn btn-gold">Create new account</a>
  </div>
  <p class="text-sm" style="text-align:center;margin-top:16px">Thank you for traveling with RailConnect. Safe journeys ahead! 🚂</p>`
);