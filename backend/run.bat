@echo off
cd /d "%~dp0"
echo Starting Flask app with Waitress...
waitress-serve --host=0.0.0.0 --port=8080 --call "app:create_app"
pause
