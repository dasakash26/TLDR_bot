import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def send_otp_email(recipient_email: str, otp: str, user_name: str = "User") -> bool:
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Verify Your Email - Recap"
        message["From"] = f"{settings.mail_from_name} <{settings.mail_user}>"
        message["To"] = recipient_email

        # Create HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(to bottom, #f5f5f4 0%, #fafaf9 50%, #f5f5f4 100%);">
            <!-- Outer Container with Padding -->
            <div style="padding: 40px 20px;">
                <!-- Main Card -->
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02); overflow: hidden;">
                    
                    <!-- Header with Subtle Pattern -->
                    <div style="background: linear-gradient(135deg, #c27c4e 0%, #d99b75 50%, #e09d6f 100%); padding: 56px 40px 48px; text-align: center; position: relative; overflow: hidden;">
                        <!-- Decorative Elements -->
                        <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.08); border-radius: 50%;"></div>
                        
                        <!-- Content -->
                        <div style="position: relative; z-index: 1;">
                            <div style="display: inline-block; padding: 12px 24px; background: rgba(255, 255, 255, 0.15); border-radius: 12px; margin-bottom: 16px; backdrop-filter: blur(10px);">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                                    RECAP
                                </h1>
                            </div>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.95); font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                                AI-Powered Document Intelligence
                            </p>
                        </div>
                    </div>
                    
                    <!-- Accent Line -->
                    <div style="height: 3px; background: linear-gradient(to right, #c27c4e 0%, #d99b75 50%, #c27c4e 100%);"></div>
                    
                    <!-- Content -->
                    <div style="padding: 48px 40px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <h2 style="margin: 0 0 16px 0; color: #292524; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Welcome, {user_name}
                            </h2>
                            
                            <p style="margin: 0; color: #57534e; font-size: 16px; line-height: 1.6; max-width: 460px; margin: 0 auto;">
                                Thank you for joining Recap. You're one step away from experiencing smarter, faster document search with AI-powered insights.
                            </p>
                        </div>
                        
                        <!-- Divider -->
                        <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #c27c4e, transparent); margin: 32px auto;"></div>
                        
                        <p style="margin: 0 0 20px 0; color: #292524; font-size: 15px; font-weight: 600; text-align: center;">
                            Your verification code
                        </p>
                        
                        <!-- OTP Box with Enhanced Design -->
                        <div style="position: relative; background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border: 2px solid #c27c4e; border-radius: 16px; padding: 40px 32px; text-align: center; margin: 24px 0; box-shadow: 0 4px 20px rgba(194, 124, 78, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);">
                            <!-- Corner Accents -->
                            <div style="position: absolute; top: 12px; left: 12px; width: 20px; height: 20px; border-top: 3px solid rgba(194, 124, 78, 0.3); border-left: 3px solid rgba(194, 124, 78, 0.3); border-radius: 4px 0 0 0;"></div>
                            <div style="position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-top: 3px solid rgba(194, 124, 78, 0.3); border-right: 3px solid rgba(194, 124, 78, 0.3); border-radius: 0 4px 0 0;"></div>
                            <div style="position: absolute; bottom: 12px; left: 12px; width: 20px; height: 20px; border-bottom: 3px solid rgba(194, 124, 78, 0.3); border-left: 3px solid rgba(194, 124, 78, 0.3); border-radius: 0 0 0 4px;"></div>
                            <div style="position: absolute; bottom: 12px; right: 12px; width: 20px; height: 20px; border-bottom: 3px solid rgba(194, 124, 78, 0.3); border-right: 3px solid rgba(194, 124, 78, 0.3); border-radius: 0 0 4px 0;"></div>
                            
                            <div style="font-size: 44px; font-weight: 800; color: #c27c4e; letter-spacing: 14px; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 8px rgba(194, 124, 78, 0.15);">
                                {otp}
                            </div>
                        </div>
                        
                        <!-- Info Box with Refined Style -->
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid rgba(245, 158, 11, 0.2); border-left: 4px solid #f59e0b; border-radius: 12px; padding: 18px 22px; margin: 28px 0; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                <strong style="display: block; margin-bottom: 6px; font-weight: 700;">Important</strong>
                                This code expires in <strong>24 hours</strong>. Don't share it with anyone.
                            </p>
                        </div>
                        
                        <!-- Divider -->
                        <div style="width: 40px; height: 1px; background: linear-gradient(to right, transparent, #d6d3d1, transparent); margin: 28px auto;"></div>
                        
                        <p style="margin: 0; color: #78716c; font-size: 14px; line-height: 1.6; text-align: center;">
                            If you didn't create a Recap account, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: linear-gradient(to bottom, #fafaf9, #f5f5f4); padding: 36px 40px; text-align: center; border-top: 1px solid #e7e5e4;">
                        <div style="margin-bottom: 12px;">
                            <a href="mailto:support@recap.com" style="color: #c27c4e; text-decoration: none; font-weight: 600; font-size: 14px; padding: 8px 20px; border: 1px solid rgba(194, 124, 78, 0.2); border-radius: 8px; display: inline-block; transition: all 0.2s;">
                                Contact Support
                            </a>
                        </div>
                        <p style="margin: 16px 0 0 0; color: #a8a29e; font-size: 12px; line-height: 1.5;">
                            © 2026 Recap<br>
                            <span style="color: #c27c4e;">Open Source</span> • Personal Project
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        # Create plain text alternative
        text_content = f"""
        Welcome, {user_name}!
        
        Thank you for signing up for Recap. To complete your registration, please verify your email address.
        
        Your verification code is: {otp}
        
        This code will expire in 24 hours. If you didn't request this verification, you can safely ignore this email.
        
        Need help? Contact us at support@recap.com
        
        © {2026} Recap. All rights reserved.
        """

        # Attach parts
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        message.attach(part1)
        message.attach(part2)

        # Send email
        with smtplib.SMTP(settings.mail_host, settings.mail_port) as server:
            server.starttls()
            server.login(settings.mail_user, settings.mail_password)
            server.send_message(message)
            
        logging.info(f"OTP email sent successfully to {recipient_email}")
        return True
        
    except Exception as e:
        logging.error(f"Failed to send OTP email to {recipient_email}: {str(e)}")
        return False
