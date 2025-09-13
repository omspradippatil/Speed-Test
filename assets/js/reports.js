/**
 * Om Speed Test - Reports JavaScript
 * Handles the reports page functionality including loading, filtering, and exporting results
 */

// DOM Elements
const filterForm = document.getElementById('filterForm');
const resetFiltersBtn = document.getElementById('resetFilters');
const exportCSVBtn = document.getElementById('exportCSV');
const exportPDFBtn = document.getElementById('exportPDF');
const resultsTable = document.getElementById('resultsTable');
const noResults = document.getElementById('noResults');
const speedChart = document.getElementById('speedChart');

// Chart instance
let resultsChart;

// Test results data
let testResults = [];

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load initial results
    loadResults();
    
    // Add event listeners
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadResults();
    });
    
    resetFiltersBtn.addEventListener('click', resetFilters);
    exportCSVBtn.addEventListener('click', exportToCSV);
    exportPDFBtn.addEventListener('click', exportToPDF);
});

// Load test results from the server
async function loadResults() {
    // Get filter values
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const ipAddress = document.getElementById('ipAddress').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (ipAddress) params.append('ip', ipAddress);
    
    try {
        const response = await fetch(`backend/get_results.php?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
            testResults = data.results;
            displayResults(testResults);
        } else {
            console.error('Error loading results:', data.error);
            alert('Error loading results. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        alert('Error connecting to server. Please try again.');
    }
}

// Display results in the table
function displayResults(results) {
    resultsTable.innerHTML = '';
    
    if (results.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${result.id}</td>
                <td>${new Date(result.timestamp).toLocaleString()}</td>
                <td>${result.ip}</td>
                <td>${parseFloat(result.ping_ms).toFixed(1)}</td>
                <td>${parseFloat(result.jitter_ms).toFixed(1)}</td>
                <td>${parseFloat(result.download_mbps).toFixed(2)}</td>
                <td>${parseFloat(result.upload_mbps).toFixed(2)}</td>
            `;
            
            resultsTable.appendChild(row);
        });
    }
    
    // Update the chart
    updateChart(results);
}

// Update the chart with the latest results
function updateChart(results) {
    // Reverse the array to get chronological order
    const chartData = [...results].reverse();
    
    // Extract timestamps and speeds
    const labels = chartData.map(result => new Date(result.timestamp).toLocaleString());
    const downloadData = chartData.map(result => parseFloat(result.download_mbps));
    const uploadData = chartData.map(result => parseFloat(result.upload_mbps));
    
    // Destroy previous chart if exists
    if (resultsChart) {
        resultsChart.destroy();
    }
    
    // Create new chart
    resultsChart = new Chart(speedChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Download Speed (Mbps)',
                    data: downloadData,
                    borderColor: '#4a6bff',
                    backgroundColor: 'rgba(74, 107, 255, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Upload Speed (Mbps)',
                    data: uploadData,
                    borderColor: '#ff4a6b',
                    backgroundColor: 'rgba(255, 74, 107, 0.1)',
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Internet Speed Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date & Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Speed (Mbps)'
                    },
                    min: 0
                }
            }
        }
    });
}

// Reset all filters
function resetFilters() {
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('ipAddress').value = '';
    
    loadResults();
}

// Export results to CSV
function exportToCSV() {
    if (testResults.length === 0) {
        alert('No results to export.');
        return;
    }
    
    // Create CSV content
    let csvContent = 'ID,Date & Time,IP Address,Ping (ms),Jitter (ms),Download (Mbps),Upload (Mbps)\n';
    
    testResults.forEach(result => {
        csvContent += `${result.id},`;
        csvContent += `"${new Date(result.timestamp).toLocaleString()}",`;
        csvContent += `${result.ip},`;
        csvContent += `${parseFloat(result.ping_ms).toFixed(1)},`;
        csvContent += `${parseFloat(result.jitter_ms).toFixed(1)},`;
        csvContent += `${parseFloat(result.download_mbps).toFixed(2)},`;
        csvContent += `${parseFloat(result.upload_mbps).toFixed(2)}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'om_speedtest_results.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export results to PDF
function exportToPDF() {
    alert('PDF export functionality requires a PDF generation library. Consider integrating a library like jsPDF or using a server-side solution.');
    
    // Note: Actual PDF generation would require additional libraries like jsPDF
    // This would be implemented with a library or by sending the data to a server-side PDF generator
}
