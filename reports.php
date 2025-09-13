<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Om Speed Test - Reports</title>
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">Om Speed Test</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="reports.php">Reports</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <h1 class="mb-4">Speed Test Reports</h1>
        
        <div class="card mb-4">
            <div class="card-header">
                <h5>Filters</h5>
            </div>
            <div class="card-body">
                <form id="filterForm" class="row g-3">
                    <div class="col-md-4">
                        <label for="fromDate" class="form-label">From Date</label>
                        <input type="date" class="form-control" id="fromDate" name="fromDate">
                    </div>
                    <div class="col-md-4">
                        <label for="toDate" class="form-label">To Date</label>
                        <input type="date" class="form-control" id="toDate" name="toDate">
                    </div>
                    <div class="col-md-4">
                        <label for="ipAddress" class="form-label">IP Address</label>
                        <input type="text" class="form-control" id="ipAddress" name="ipAddress">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary me-2">Apply Filters</button>
                        <button type="button" id="resetFilters" class="btn btn-secondary">Reset</button>
                        <div class="float-end">
                            <button type="button" id="exportCSV" class="btn btn-success me-2">Export CSV</button>
                            <button type="button" id="exportPDF" class="btn btn-danger">Export PDF</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5>Test Results</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date & Time</th>
                                <th>IP Address</th>
                                <th>Ping (ms)</th>
                                <th>Jitter (ms)</th>
                                <th>Download (Mbps)</th>
                                <th>Upload (Mbps)</th>
                            </tr>
                        </thead>
                        <tbody id="resultsTable">
                            <!-- Results will be loaded here via AJAX -->
                        </tbody>
                    </table>
                </div>
                <div id="noResults" class="alert alert-info" style="display: none;">
                    No results found.
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h5>Speed Trends</h5>
            </div>
            <div class="card-body">
                <canvas id="speedChart"></canvas>
            </div>
        </div>
    </div>

    <footer class="footer mt-5 py-3 bg-light">
        <div class="container text-center">
            <span class="text-muted">Powered by Om Speed Test</span>
        </div>
    </footer>

    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/chart.js"></script>
    <script src="assets/js/reports.js"></script>
</body>
</html>
