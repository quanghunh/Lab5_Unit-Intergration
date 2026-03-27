class EmailService {
  async sendEmail(to, subject, body) {
    // Giả lập gửi email (trong thực tế gọi SMTP)
    console.log(`Sending email to ${to}`);
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      to, subject
    };
  }
}
 
module.exports = EmailService;
