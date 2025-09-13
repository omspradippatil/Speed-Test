<?php
// Disable output buffering
if (ob_get_level()) ob_end_clean();

// Set headers to prevent caching
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename=random.dat');

// Get the requested file size from query parameter, with defaults
$requestedSize = isset($_GET['size']) ? intval($_GET['size']) : 8192; // Default 8KB
$maxSize = 104857600; // 100MB max

// Ensure size is within reasonable limits
if ($requestedSize < 1024) {
    $requestedSize = 1024; // Minimum 1KB
} elseif ($requestedSize > $maxSize) {
    $requestedSize = $maxSize;
}

// Generate random data and output it
$chunkSize = 1024; // Output in 1KB chunks
$bytesRemaining = $requestedSize;

while ($bytesRemaining > 0) {
    $bytesToSend = min($chunkSize, $bytesRemaining);
    echo str_repeat('X', $bytesToSend);
    
    $bytesRemaining -= $bytesToSend;
    
    // Flush the output
    flush();
    if (ob_get_level() > 0) ob_flush();
}
?>
