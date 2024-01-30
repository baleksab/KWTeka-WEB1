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
    content = database.logout_client(get["session_id"].value)
    print(json.dumps(content))