import cgi
import json
from database import Database

database = Database()
get = cgi.FieldStorage() 

if "register" in get:
    print("Content-type: application/json\n")
    content = database.register_user(get["account"].value)
    print(json.dumps(content))

if "logout" in get:
    print("Content-type: application/json\n")
    content = database.logout_user(get["session-id"].value)
    print(json.dumps(content))

if "login" in get:
    print("Content-type: application/json\n")
    content = database.login_user(get["account"].value)
    print(json.dumps(content))

if "get-all-games" in get:
    print("Content-type: application/json\n")
    content = database.get_all_games()
    print(json.dumps(content))

if "add-to-cart" in get:
    print("Content-type: application/json\n")
    content = database.add_to_cart(get["email"].value, get["game-id"].value)
    print(json.dumps(content))

if "remove-from-cart" in get:
    print("Content-type: application/json\n")
    content = database.remove_from_cart(get["email"].value, get["game-id"].value)
    print(json.dumps(content))

if "get-all-cart-games" in get:
    print("Content-type: application/json\n")
    content = database.get_all_cart_games(get["email"].value)
    print(json.dumps(content))

if "buy-cart-games" in get:
    print("Content-type: application/json\n")
    content = database.buy_cart_games(get["email"].value)
    print(json.dumps(content))