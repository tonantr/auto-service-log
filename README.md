# auto-service-log

# Start a Flask app using waitress-serve. Using Waitress (Cross-platform)
waitress-serve --host=0.0.0.0 --port=8080 --call 'app:create_app'

# Gunicorn is recommended for production environments on macOS or Linux.
gunicorn --bind 0.0.0.0:8080 'app:create_app()'

# Serve the frontend using pm2
pm2 serve /Users/tonan/Documents/Programming/Python/restful_API/auto-service-log/frontend/build 3001 --spa


