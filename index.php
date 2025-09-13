<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Om Speed Test</title>
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
                        <a class="nav-link active" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="reports.php">Reports</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <h1 class="mb-4">Test Your Internet Speed</h1>
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="mb-4">
                            <button id="startTest" class="btn btn-primary btn-lg">Start Test</button>
                        </div>
                        
                        <div id="testInProgress" style="display: none;">
                            <div class="mb-4">
                                <h3>Current Test: <span id="currentTest">Initializing...</span></h3>
                                <div class="progress">
                                    <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%"></div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body text-center">
                                            <h4>Ping</h4>
                                            <div class="gauge-container">
                                                <canvas id="pingGauge"></canvas>
                                            </div>
                                            <h2 id="pingResult">-- ms</h2>
                                            <p>Jitter: <span id="jitterResult">-- ms</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body text-center">
                                            <h4 id="speedLabel">Download</h4>
                                            <div class="gauge-container">
                                                <canvas id="speedGauge"></canvas>
                                            </div>
                                            <h2 id="speedResult">-- Mbps</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="testResults" style="display: none;">
                            <h3 class="mb-3">Test Results</h3>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5>Ping</h5>
                                            <h3 id="finalPing">-- ms</h3>
                                            <p>Jitter: <span id="finalJitter">-- ms</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5>Download</h5>
                                            <h3 id="finalDownload">-- Mbps</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5>Upload</h5>
                                            <h3 id="finalUpload">-- Mbps</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5>Test Date</h5>
                                            <h3 id="testDate">--</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button id="restartTest" class="btn btn-primary mt-3">Test Again</button>
                        </div>
                    </div>
                </div>
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
    <script src="assets/js/speedtest.js"></script>
</body>
</html>
