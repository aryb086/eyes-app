const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');
const ErrorResponse = require('./errorResponse');

// Create a stub transporter for testing
const transporter = nodemailer.createTransport(stubTransport());

// Log email sending in development
console.log('Using stub email transport. Emails will be logged but not sent.');

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (options) => {
  try {
    // Log email details
    console.log('Sending email:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text);
    console.log('HTML:', options.html);
    
    // In test mode, we don't actually send emails
    if (process.env.NODE_ENV === 'test') {
      console.log('Test mode: Email not actually sent');
      return { message: 'Email not sent in test mode' };
    }
    
    // Send the email using the stub transport
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Eyes App'}" <${process.env.EMAIL_FROM || 'noreply@eyesapp.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    
    console.log('Email sent (stub transport):', info.messageId);
    return { message: 'Email sent (stub transport)', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ErrorResponse('Email could not be sent', 500);
  }
};

/**
 * Send verification email
 * @param {Object} options - Options object
 * @param {string} options.name - User's name
 * @param {string} options.email - User's email
 * @param {string} options.token - Verification token
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendVerificationEmail = async ({ name, email, token }) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a86e8;">Welcome to Eyes App!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4a86e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verifyUrl}</p>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Thanks,<br>The Eyes App Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    text: `Please verify your email by visiting: ${verifyUrl}`,
    html: message
  });
};

/**
 * Send password reset email
 * @param {Object} options - Options object
 * @param {string} options.name - User's name
 * @param {string} options.email - User's email
 * @param {string} options.token - Reset token
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendPasswordResetEmail = async ({ name, email, token }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a86e8;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4a86e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This reset link will expire in 1 hour.</p>
      <p>Thanks,<br>The Eyes App Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: `You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\nPlease click the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
    html: message
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};
