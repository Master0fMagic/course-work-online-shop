import logging

from flask_login import LoginManager
from flask_session import Session
from clientService import ClientService


def init_app(app):
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    logging.basicConfig(level=logging.INFO)

    Session().init_app(app)

    client_service = ClientService()
    # add required services

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return client_service.get_user_by_id(user_id)
