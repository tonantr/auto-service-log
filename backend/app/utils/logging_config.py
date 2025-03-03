import logging

logging.basicConfig(
    filename="app.log",
    level=logging.WARNING,
    format="%(asctime)s - %(levelname)s - %(module)s - Line: %(lineno)d - %(message)s",
)
logger = logging.getLogger(__name__)