import sqlite3
import json
import hashlib
import random

class Database():
    def __init__(self):
        self.connection = sqlite3.connect("database.db")

    def get_user_by_mail(self, email):
        sql = f"SELECT * FROM users WHERE email = '{email}'"
        
        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        for row in cursor.fetchall():
            content = dict()
            content["email"] = row[0]
            content["first_name"] = row[1]
            content["last_name"] = row[2]
            content["password"] = row[3]
            content["budget"] = row[4]

            cursor.close()

            return content
        
        return False

    def register_user(self, account):
        account = json.loads(account)

        content = dict()
        content["register"] = "False"

        if self.get_user_by_mail(account["email"]) == False:
            session_id = random.randint(10**13, 10**14 - 1)
            password = hashlib.sha256(account["password"].encode("utf-8")).hexdigest()

            sql = f'''
                    INSERT INTO users(email, first_name, last_name, password, budget, session_id)
                    VALUES('{account["email"]}', '{account["first_name"]}', '{account["last_name"]}', '{password}', '{account["budget"]}', '{session_id}')
                   '''
            cursor = self.connection.cursor()
            cursor.execute(sql)

            self.connection.commit()

            cursor.close()

            content["register"] = "True"
            content["session_id"] = session_id

        return content
    
    def logout_user(self, session_id):
        content = dict()
        content["logout"] = "False"
        
        sql = f"UPDATE users SET session_id = '' WHERE session_id='{session_id}'"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        row_count = cursor.rowcount

        cursor.close()

        if row_count > 0:
            content["logout"] = "True"

        return content
        
    def login_user(self, account):
        account = json.loads(account)
        password = hashlib.sha256(account["password"].encode("utf-8")).hexdigest()

        content = dict()
        content["login"] = "False"

        user = self.get_user_by_mail(account["email"])

        if (user != False and user["password"] == password):
            session_id = random.randint(10**13, 10**14 - 1) 

            sql = f"UPDATE users SET session_id = '{session_id}' WHERE email = '{account["email"]}'"
                
            cursor = self.connection.cursor()
            cursor.execute(sql)

            self.connection.commit()

            content["session_id"] = session_id
            content["first_name"] = user["first_name"]
            content["last_name"] = user["last_name"]
            content["email"] = user["email"]
            content["budget"] = user["budget"]
            content["login"] = "True"

        return content

    def get_all_games(self):
        content = dict() 

        sql = "SELECT * FROM games"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        for row in cursor.fetchall():
            id = row[0]
            name = row[1]
            image = row[2]
            price = row[3]
            rating = row[4]

            game = dict()
            game["name"] = name
            game["image"] = image
            game["price"] = price
            game["rating"] = rating

            content[id] = game

        cursor.close()

        return content

