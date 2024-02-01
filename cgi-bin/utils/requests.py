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
    content = database.logout_user(get["session_id"].value)
    print(json.dumps(content))

if "login" in get:
    print("Content-type: application/json\n")
    content = database.login_user(get["account"].value)
    print(json.dumps(content))

if "get-all-games" in get:
    print("Content-type: application/json\n")
    content = database.get_all_games()
    print(json.dumps(content))