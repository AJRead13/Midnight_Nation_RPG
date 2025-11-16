const nodemailer = require('nodemailer');

// Create email transporter
// Note: In production, use environment variables for credentials
const createTransporter = () => {
  // For development, you can use a test account from ethereal.email
  // In production, configure with your actual SMTP service (Gmail, SendGrid, AWS SES, etc.)
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Development fallback - log emails to console instead of sending
  console.warn('Email service not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.');
  return null;
};

const transporter = createTransporter();

/**
 * Send an email notification
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log('📧 Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Content:', text || html);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Midnight Nation RPG" <noreply@midnightnation.com>',
      to,
      subject,
      text,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send session created notification
 */
const sendSessionCreatedNotification = async (user, campaign, session) => {
  const subject = `New Session: ${campaign.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">New Campaign Session</h2>
      <p>Hello ${user.displayName || user.username},</p>
      <p>A new session has been scheduled for <strong>${campaign.name}</strong>!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Session #${session.sessionNumber}: ${session.title || 'Untitled Session'}</h3>
        ${session.date ? `<p><strong>📅 Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>` : ''}
        ${session.duration ? `<p><strong>⏱️ Duration:</strong> ${session.duration} hours</p>` : ''}
        ${session.summary ? `<p><strong>Summary:</strong> ${session.summary}</p>` : ''}
      </div>
      
      <p>See you at the table!</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        You're receiving this email because you're a member of the campaign "${campaign.name}". 
        You can manage your notification preferences in your profile settings.
      </p>
    </div>
  `;

  const text = `
New Campaign Session

Hello ${user.displayName || user.username},

A new session has been scheduled for ${campaign.name}!

Session #${session.sessionNumber}: ${session.title || 'Untitled Session'}
${session.date ? `Date: ${new Date(session.date).toLocaleDateString()}` : ''}
${session.duration ? `Duration: ${session.duration} hours` : ''}
${session.summary ? `Summary: ${session.summary}` : ''}

See you at the table!

---
You're receiving this email because you're a member of the campaign "${campaign.name}". 
You can manage your notification preferences in your profile settings.
  `;

  return sendEmail({
    to: user.email,
    subject,
    html,
    text
  });
};

/**
 * Send session updated notification
 */
const sendSessionUpdatedNotification = async (user, campaign, session) => {
  const subject = `Session Updated: ${campaign.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Session Updated</h2>
      <p>Hello ${user.displayName || user.username},</p>
      <p>A session for <strong>${campaign.name}</strong> has been updated!</p>
      
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #333;">Session #${session.sessionNumber}: ${session.title || 'Untitled Session'}</h3>
        ${session.date ? `<p><strong>📅 Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>` : ''}
        ${session.duration ? `<p><strong>⏱️ Duration:</strong> ${session.duration} hours</p>` : ''}
        ${session.summary ? `<p><strong>Summary:</strong> ${session.summary}</p>` : ''}
      </div>
      
      <p>Please check the campaign page for the latest details.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        You're receiving this email because you're a member of the campaign "${campaign.name}". 
        You can manage your notification preferences in your profile settings.
      </p>
    </div>
  `;

  const text = `
Session Updated

Hello ${user.displayName || user.username},

A session for ${campaign.name} has been updated!

Session #${session.sessionNumber}: ${session.title || 'Untitled Session'}
${session.date ? `Date: ${new Date(session.date).toLocaleDateString()}` : ''}
${session.duration ? `Duration: ${session.duration} hours` : ''}
${session.summary ? `Summary: ${session.summary}` : ''}

Please check the campaign page for the latest details.

---
You're receiving this email because you're a member of the campaign "${campaign.name}". 
You can manage your notification preferences in your profile settings.
  `;

  return sendEmail({
    to: user.email,
    subject,
    html,
    text
  });
};

/**
 * Send notifications to all campaign members
 */
const notifyCampaignMembers = async (campaign, session, notificationType) => {
  try {
    // Populate campaign members if not already populated
    if (!campaign.players || campaign.players.length === 0) {
      return { success: false, message: 'No players in campaign' };
    }

    const User = require('../models/User');
    const members = await User.find({ 
      _id: { $in: [...campaign.players, campaign.gameMaster] }
    });

    const results = [];
    
    for (const member of members) {
      // Check if user has notifications enabled
      const prefs = member.notificationPreferences || {};
      
      if (!prefs.emailNotifications) {
        console.log(`Skipping email for ${member.username} - email notifications disabled`);
        continue;
      }

      if (notificationType === 'created' && !prefs.sessionCreated) {
        console.log(`Skipping email for ${member.username} - session created notifications disabled`);
        continue;
      }

      if (notificationType === 'updated' && !prefs.sessionUpdated) {
        console.log(`Skipping email for ${member.username} - session updated notifications disabled`);
        continue;
      }

      // Send appropriate notification
      let result;
      if (notificationType === 'created') {
        result = await sendSessionCreatedNotification(member, campaign, session);
      } else if (notificationType === 'updated') {
        result = await sendSessionUpdatedNotification(member, campaign, session);
      }

      results.push({
        user: member.username,
        email: member.email,
        ...result
      });
    }

    return {
      success: true,
      notificationsSent: results.filter(r => r.success).length,
      totalMembers: members.length,
      results
    };
  } catch (error) {
    console.error('Error notifying campaign members:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendSessionCreatedNotification,
  sendSessionUpdatedNotification,
  notifyCampaignMembers
};
