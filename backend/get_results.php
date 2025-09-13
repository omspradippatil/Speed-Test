<?php
// Include database configuration
require_once 'config.php';

// Set headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Content-Type: application/json');

try {
    // Build the query with optional filters
    $query = "SELECT * FROM tests WHERE 1=1";
    $params = [];
    
    // Filter by from date
    if (isset($_GET['fromDate']) && !empty($_GET['fromDate'])) {
        $query .= " AND DATE(timestamp) >= :fromDate";
        $params[':fromDate'] = $_GET['fromDate'];
    }
    
    // Filter by to date
    if (isset($_GET['toDate']) && !empty($_GET['toDate'])) {
        $query .= " AND DATE(timestamp) <= :toDate";
        $params[':toDate'] = $_GET['toDate'];
    }
    
    // Filter by IP address
    if (isset($_GET['ip']) && !empty($_GET['ip'])) {
        $query .= " AND ip LIKE :ip";
        $params[':ip'] = '%' . $_GET['ip'] . '%';
    }
    
    // Order by timestamp descending
    $query .= " ORDER BY timestamp DESC";
    
    // Prepare and execute the query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    // Fetch all results
    $results = $stmt->fetchAll();
    
    // Return results as JSON
    echo json_encode([
        'success' => true,
        'results' => $results
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
