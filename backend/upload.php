<?php
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

// Get the raw POST data
$postData = file_get_contents("php://input");

// Calculate size of received data
$receivedBytes = strlen($postData);

// Return JSON response with received size
echo json_encode([
    'received' => $receivedBytes,
    'success' => true,
    'timestamp' => microtime(true)
]);
?>
