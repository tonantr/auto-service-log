# auto-service-log

waitress-serve --host=0.0.0.0 --port=8080 --call 'app:create_app'

waitress-serve --host=0.0.0.0 --port=8080 app:create_app

pm2 serve /Users/tonan/Documents/Programming/Python/restful_API/auto-service-log/frontend/build 3001 --spa

python3 -m http.server 3001 --directory app/build