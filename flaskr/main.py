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


@app.route('/api/order/categories')
@login_required
def get_categories():
    """

    :return: {
    "data": [
        {
            "id": 5,
            "name": "??????????????????"
        }
        ]
    }
    """
    seller = Seller()
    return {
        'data': [item.to_dict() for item in seller.get_categories()]
    }


@app.route('/api/products')
def get_products():
    """

    :return: {
     "data": [
        {
            "category": "??????????????????",
            "category_id": 5,
            "description": "12/256",
            "id": 5,
            "name": "Google Pixel 6 Pro",
            "price": 38999.0
        },
        ]
    }
   """
    seller = Seller()
    return {
        'data': [item.to_dict() for item in seller.get_products()]
    }


@app.route('/api/order/history')
@login_required
def get_order_history():
    """
    :return:{
     "data": [
        {
            "address": "??.????????????, ????.???????????? ??????????????, 27??, 67",
            "date": 1655650779,
            "delivery_price": 45.0,
            "delivery_service": "GLOVO",
            "discount": 0.0,
            "id": 2,
            "sum": 34999.0,
            "sum_with_discount": 34999.0,
            "total_sum": 35044.0
        }
        ]
    }
    """
    seller = Seller()
    return {
        'data': [item.to_dict() for item in seller.get_order_history(current_user.id)]
    }


@app.route('/api/order/history/<int:id>')
@login_required
def get_order_product(id: int):
    """
    :param id: order id
    :return: {
         "data": [
            {
                "amount": 1,
                "category": "??????????????????",
                "description": "256gb",
                "name": "Apple Iphone 13",
                "price": 34999.0
            }
        ]
    }
    """

    seller = Seller()
    return {
        'data': [item.to_dict() for item in seller.get_products_by_order(id)]
    }


app.run()
