<?php
// Set headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Content-Type: application/json');

// Get timestamp when request was received
$serverTime = microtime(true);

// Extract client timestamp from the request
$clientTime = isset($_GET['time']) ? floatval($_GET['time']) : 0;

// Return server timestamp and original client timestamp
echo json_encode([
    'serverTime' => $serverTime,
    'clientTime' => $clientTime
]);
?>
