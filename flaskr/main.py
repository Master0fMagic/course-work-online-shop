from flask import Flask, request, abort, jsonify
from flask_cors import CORS

from setup import init_app
from clientService import ClientService
from seller import Seller, DeliveryService
from flask_login import login_user, logout_user, login_required, current_user
import error
import dto

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*", "supports_credentials": "true"}})
init_app(app)


@app.route('/api/login', methods=['POST'])
def login():
    """
    takes json: {
    "login":"user_email_or_phone_number",
    "password":"user_password"
    }

    creates user session
    :return: success or error
    """
    userdata = request.json['login']
    password = request.json['password']

    if not (userdata and password):
        abort(400, 'required field empty')

    cs = ClientService()
    try:
        user = cs.login(userdata, password)
        login_user(user)
    except (error.UseNotFoundException, error.WrongPasswordException) as er:
        abort(401, er.description)

    return jsonify(success=True)


@app.route('/api/logout')
@login_required
def logout():
    """
       ends user session
       :return: 200 ok
    """
    logout_user()
    return jsonify(success=True)


@app.route('/api/sing-up', methods=['POST'])
def sing_up():
    """
       takes json: {
       "email":"",  //field does not required
       "password":"",
       "repeated_password":"",
       "first_name":"",
       "last_name":"",
       "phone":"",
       }

       create new user and login him
       :return: success or error
       """
    email = request.json.get('email')
    password = request.json.get('password')
    repeated_password = request.json.get('repeated_password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    phone = request.json.get('phone')

    print(email)

    if not (password and repeated_password and first_name and last_name and phone):
        abort(400, 'missing required fields')

    if password != repeated_password:
        abort(400, 'passwords does not match')

    cs = ClientService()
    client = cs.register_new_user(first_name, last_name, phone, password, email)
    login_user(client)
    return jsonify(success=True)


@app.route('/api/order/create', methods=['POST'])
@login_required
def create_order():
    """
    takes json:{
    "address": "",
    "delivery_service_id": "",
    "items": [
        {
        "product_id":1,
        "amount": 1
        }
    ]

    }
    :return: 200
    """
    address = request.json.get('address')
    delivery_service_id = request.json.get('delivery_service_id')
    items = [dto.CreateOrderItemDto(product_id=item['product_id'], amount=item['amount']) for item in
             request.json.get('items')]

    if not (address and delivery_service_id and items):
        abort(400, 'not all fields persist')

    seller = Seller()
    seller.create_order(address, delivery_service_id, items, current_user.id)
    return jsonify(success=True)


@app.route('/api/delivery-services')
@login_required
def get_login_services():
    """

    :return: {
    "data": [
        {
            "id": 1,
            "name": "GLOVO",
            "price": 45.0
        }
    }
    """
    ds = DeliveryService()
    return {
        'data': [item.to_dict() for item in ds.get_delivery_services()]
    }


# todo add get apis for:
#               order history short ( date, sum, discount, sum_with_discount, delivery address, delivery service,
#                   delivery price, total sum )
#               order history full ( products bought: name, category, description, price for one, amount )
#               category filters
#               product catalog ( name, description, price, category_id, category )
#               delivery services ( name, id, price )


app.run()
