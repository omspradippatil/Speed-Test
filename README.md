# Om Speed Test

A complete internet speed testing application built with PHP and MySQL. This application allows users to test their internet connection speed including ping, jitter, download, and upload speeds.

## Features

- **Speed Testing**: Measures ping, jitter, download, and upload speeds
- **Real-time Visualization**: Displays test progress with animated gauges
- **Result Storage**: Saves test results in a MySQL database
- **Reports**: View and filter historical test results
- **Data Export**: Export results as CSV

## Requirements

- PHP 7.0 or higher
- MySQL 5.6 or higher
- Web server (Apache, Nginx, etc.)
- Modern web browser

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/om-speed-test.git
   ```

2. Import the database schema:
   ```
   mysql -u username -p < db.sql
   ```

3. Configure the database connection:
   - Edit `backend/config.php` with your database credentials

4. Upload the files to your web server

5. Open the application in your web browser

## Usage

1. Visit the main page and click "Start Test"
2. The application will test ping, jitter, download, and upload speeds
3. Results will be displayed and saved to the database
4. View historical results on the Reports page

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Om Pradip Patil

