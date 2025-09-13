/**
 * Om Speed Test - Main JavaScript
 * Handles the speed test functionality including ping, download, and upload tests
 */

// Configuration
const config = {
    pingCount: 10,      // Number of ping requests
    downloadSizes: [     // Sizes in KB for download tests
        100, 500, 1000, 2000, 5000, 10000
    ],
    uploadSizes: [       // Sizes in KB for upload tests
        100, 500, 1000, 2000, 5000
    ],
    testTimeout: 15000   // Maximum time for each test in ms
};

// Main variables
let pingResults = [];
let downloadResults = [];
let uploadResults = [];
let pingGauge, speedGauge;

// DOM Elements
const startTestBtn = document.getElementById('startTest');
const restartTestBtn = document.getElementById('restartTest');
const progressBar = document.getElementById('progressBar');
const currentTest = document.getElementById('currentTest');
const testInProgress = document.getElementById('testInProgress');
const testResults = document.getElementById('testResults');
const speedLabel = document.getElementById('speedLabel');

// Test results elements
const pingResult = document.getElementById('pingResult');
const jitterResult = document.getElementById('jitterResult');
const speedResult = document.getElementById('speedResult');
const finalPing = document.getElementById('finalPing');
const finalJitter = document.getElementById('finalJitter');
const finalDownload = document.getElementById('finalDownload');
const finalUpload = document.getElementById('finalUpload');
const testDate = document.getElementById('testDate');

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create gauge charts
    initializeGauges();
    
    // Add event listeners
    startTestBtn.addEventListener('click', startSpeedTest);
    restartTestBtn.addEventListener('click', restartTest);
});

// Initialize gauge charts
function initializeGauges() {
    // Ping gauge
    const pingCtx = document.getElementById('pingGauge').getContext('2d');
    pingGauge = new Chart(pingCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#4a6bff', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            rotation: -90,
            circumference: 180,
            plugins: { legend: { display: false } },
            animation: { duration: 500 }
        }
    });
    
    // Speed gauge
    const speedCtx = document.getElementById('speedGauge').getContext('2d');
    speedGauge = new Chart(speedCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#4a6bff', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            rotation: -90,
            circumference: 180,
            plugins: { legend: { display: false } },
            animation: { duration: 500 }
        }
    });
}

// Start the speed test
async function startSpeedTest() {
    // Reset previous results
    pingResults = [];
    downloadResults = [];
    uploadResults = [];
    
    // Show test in progress UI
    startTestBtn.style.display = 'none';
    testInProgress.style.display = 'block';
    testResults.style.display = 'none';
    
    try {
        // Run ping test
        updateProgress(0, 'Testing Ping...');
        const pingStats = await runPingTest();
        
        // Update ping display
        updatePingGauge(pingStats.avg);
        pingResult.textContent = `${pingStats.avg.toFixed(1)} ms`;
        jitterResult.textContent = `${pingStats.jitter.toFixed(1)} ms`;
        
        // Run download test
        updateProgress(33, 'Testing Download Speed...');
        speedLabel.textContent = 'Download';
        const downloadSpeed = await runDownloadTest();
        
        // Update download display
        updateSpeedGauge(downloadSpeed);
        speedResult.textContent = `${downloadSpeed.toFixed(2)} Mbps`;
        
        // Run upload test
        updateProgress(66, 'Testing Upload Speed...');
        speedLabel.textContent = 'Upload';
        const uploadSpeed = await runUploadTest();
        
        // Update upload display
        updateSpeedGauge(uploadSpeed);
        speedResult.textContent = `${uploadSpeed.toFixed(2)} Mbps`;
        
        // Complete the test
        updateProgress(100, 'Test Complete');
        
        // Save results to database
        await saveResults(pingStats.avg, pingStats.jitter, downloadSpeed, uploadSpeed);
        
        // Show final results
        displayFinalResults(pingStats.avg, pingStats.jitter, downloadSpeed, uploadSpeed);
        
    } catch (error) {
        console.error('Speed test error:', error);
        alert('An error occurred during the speed test. Please try again.');
        restartTest();
    }
}

// Run ping test
async function runPingTest() {
    let pingTimes = [];
    
    for (let i = 0; i < config.pingCount; i++) {
        const startTime = performance.now();
        const response = await fetch(`backend/ping.php?time=${startTime}&cache=${Math.random()}`);
        const endTime = performance.now();
        const data = await response.json();
        
        // Calculate round trip time
        const pingTime = endTime - startTime;
        pingTimes.push(pingTime);
        
        // Update gauge after each ping
        const currentAvg = pingTimes.reduce((sum, time) => sum + time, 0) / pingTimes.length;
        updatePingGauge(currentAvg);
        pingResult.textContent = `${currentAvg.toFixed(1)} ms`;
    }
    
    // Calculate statistics
    pingTimes.sort((a, b) => a - b);
    const avg = pingTimes.reduce((sum, time) => sum + time, 0) / pingTimes.length;
    
    // Calculate jitter (average deviation)
    let jitterSum = 0;
    for (let i = 1; i < pingTimes.length; i++) {
        jitterSum += Math.abs(pingTimes[i] - pingTimes[i-1]);
    }
    const jitter = jitterSum / (pingTimes.length - 1);
    jitterResult.textContent = `${jitter.toFixed(1)} ms`;
    
    return { min: pingTimes[0], max: pingTimes[pingTimes.length - 1], avg, jitter };
}

// Run download test
async function runDownloadTest() {
    const results = [];
    
    for (const size of config.downloadSizes) {
        const startTime = performance.now();
        const url = `backend/download.php?size=${size * 1024}&cache=${Math.random()}`;
        
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const endTime = performance.now();
            
            // Calculate speed in Mbps
            const duration = (endTime - startTime) / 1000; // seconds
            const sizeInBits = blob.size * 8;
            const speedMbps = (sizeInBits / duration) / 1000000;
            
            results.push(speedMbps);
            
            // Update the gauge
            const avgSpeed = results.reduce((sum, speed) => sum + speed, 0) / results.length;
            updateSpeedGauge(avgSpeed);
            speedResult.textContent = `${avgSpeed.toFixed(2)} Mbps`;
        } catch (error) {
            console.error('Download test error:', error);
        }
    }
    
    // Calculate average speed (excluding outliers)
    results.sort((a, b) => a - b);
    const filteredResults = results.slice(1, -1); // Remove the lowest and highest values
    return filteredResults.reduce((sum, speed) => sum + speed, 0) / filteredResults.length;
}

// Run upload test
async function runUploadTest() {
    const results = [];
    
    for (const size of config.uploadSizes) {
        // Create a blob of random data
        const blob = new Blob([new ArrayBuffer(size * 1024)]);
        
        const startTime = performance.now();
        
        try {
            const response = await fetch('backend/upload.php', {
                method: 'POST',
                body: blob,
                headers: {
                    'Cache-Control': 'no-cache',
                }
            });
            
            const endTime = performance.now();
            const data = await response.json();
            
            // Calculate speed in Mbps
            const duration = (endTime - startTime) / 1000; // seconds
            const sizeInBits = blob.size * 8;
            const speedMbps = (sizeInBits / duration) / 1000000;
            
            results.push(speedMbps);
            
            // Update the gauge
            const avgSpeed = results.reduce((sum, speed) => sum + speed, 0) / results.length;
            updateSpeedGauge(avgSpeed);
            speedResult.textContent = `${avgSpeed.toFixed(2)} Mbps`;
        } catch (error) {
            console.error('Upload test error:', error);
        }
    }
    
    // Calculate average speed (excluding outliers)
    results.sort((a, b) => a - b);
    const filteredResults = results.slice(1, -1); // Remove the lowest and highest values
    return filteredResults.reduce((sum, speed) => sum + speed, 0) / filteredResults.length;
}

// Save test results to the database
async function saveResults(ping, jitter, download, upload) {
    try {
        const response = await fetch('backend/save_result.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ping: ping,
                jitter: jitter,
                download: download,
                upload: upload
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error saving results:', error);
        return { success: false };
    }
}

// Update the progress bar
function updateProgress(percent, message) {
    progressBar.style.width = `${percent}%`;
    currentTest.textContent = message;
}

// Update the ping gauge
function updatePingGauge(value) {
    // Scale ping for gauge display (0-200ms range)
    let pingPercent = Math.min(value / 200, 1) * 100;
    
    pingGauge.data.datasets[0].data = [pingPercent, 100 - pingPercent];
    pingGauge.update();
}

// Update the speed gauge
function updateSpeedGauge(value) {
    // Scale speed for gauge display (0-100 Mbps range)
    let speedPercent = Math.min(value / 100, 1) * 100;
    
    speedGauge.data.datasets[0].data = [speedPercent, 100 - speedPercent];
    speedGauge.update();
}

// Display final results
function displayFinalResults(ping, jitter, download, upload) {
    finalPing.textContent = `${ping.toFixed(1)} ms`;
    finalJitter.textContent = `${jitter.toFixed(1)} ms`;
    finalDownload.textContent = `${download.toFixed(2)} Mbps`;
    finalUpload.textContent = `${upload.toFixed(2)} Mbps`;
    testDate.textContent = new Date().toLocaleString();
    
    testInProgress.style.display = 'none';
    testResults.style.display = 'block';
}

// Restart the test
function restartTest() {
    startTestBtn.style.display = 'block';
    testInProgress.style.display = 'none';
    testResults.style.display = 'none';
}
