<?php
// Include database configuration
require_once 'config.php';

// Set headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Content-Type: application/json');

// Check if the request is a POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input data
if (!isset($data['ping']) || !isset($data['jitter']) || 
    !isset($data['download']) || !isset($data['upload'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Get client IP
$ip = $_SERVER['REMOTE_ADDR'];
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
}

// Get user agent
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';

try {
    // Prepare SQL statement
    $stmt = $pdo->prepare("
        INSERT INTO tests (ip, user_agent, ping_ms, jitter_ms, download_mbps, upload_mbps)
        VALUES (:ip, :user_agent, :ping_ms, :jitter_ms, :download_mbps, :upload_mbps)
    ");
    
    // Bind parameters
    $stmt->bindParam(':ip', $ip);
    $stmt->bindParam(':user_agent', $userAgent);
    $stmt->bindParam(':ping_ms', $data['ping']);
    $stmt->bindParam(':jitter_ms', $data['jitter']);
    $stmt->bindParam(':download_mbps', $data['download']);
    $stmt->bindParam(':upload_mbps', $data['upload']);
    
    // Execute query
    $stmt->execute();
    
    // Get the ID of the inserted record
    $testId = $pdo->lastInsertId();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'test_id' => $testId
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
