from app import create_app
from waitress import serve
from config import DevelopmentConfig, ProductionConfig
# from app.database.database import db


app = create_app()

# with app.app_context():
#     db.create_all()


if __name__ == "__main__":

    config = DevelopmentConfig

    host = config.FLASK_HOST
    port = config.FLASK_PORT
    debug = config.FLASK_DEBUG

    if debug:
        print(f"Running in debug mode on http://{host}:{port}")
        app.run(host=host, port=port, debug=debug)
    else:
        print(f"Starting production server at http://{host}:{port}")
        serve(app, host=host, port=port)
