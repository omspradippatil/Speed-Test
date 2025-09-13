-- Om Speed Test Database Schema

CREATE DATABASE IF NOT EXISTS sjcem_speedtest;
USE sjcem_speedtest;

CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ping_ms FLOAT(5,2) NOT NULL,
    jitter_ms FLOAT(5,2) NOT NULL,
    download_mbps FLOAT(7,2) NOT NULL,
    upload_mbps FLOAT(7,2) NOT NULL
);
