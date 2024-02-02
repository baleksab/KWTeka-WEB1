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

        if user != False and user["password"] == password:
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
            game["game_id"] = id
            game["users_carts"] = list()

            sql = f"SELECT email FROM users_carts WHERE game_id = '{id}'"

            cursor2 = self.connection.cursor()
            cursor2.execute(sql)

            self.connection.commit()

            for row2 in cursor2.fetchall():
                game["users_carts"].append(row2[0])

            cursor2.close()

            content[id] = game

        cursor.close()

        return content
    
    def get_game_by_id(self, game_id):
        sql = f"SELECT * FROM games WHERE game_id = '{game_id}'"
        
        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        for row in cursor.fetchall():
            id = row[0]
            name = row[1]
            image = row[2]
            price = row[3]
            rating = row[4]

            content = dict()
            content["name"] = name
            content["image"] = image
            content["price"] = price
            content["rating"] = rating
            content["game_id"] = id

            cursor.close()

            return content
        
        return False

    def add_to_cart(self, email, game_id):
        game = self.get_game_by_id(game_id)
        user = self.get_user_by_mail(email)

        content = dict()
        content["added"] = "False"

        if game != False and user != False:
            check_query = f"SELECT * FROM users_carts WHERE email = '{email}' and game_id = '{game_id}'"

            cursor = self.connection.cursor()
            cursor.execute(check_query)

            self.connection.commit()

            existing_row = cursor.fetchone()

            cursor.close()

            if not existing_row:
                sql = f"INSERT INTO users_carts(email, game_id) VALUES ('{user["email"]}', '{game["game_id"]}')"

                cursor = self.connection.cursor()
                cursor.execute(sql)

                self.connection.commit()

                cursor.close()

                content["added"] = "True"

        return content
    
    def remove_from_cart(self, email, game_id):
        content = dict()
        content["removed"] = "True"

        sql = f"DELETE FROM users_carts WHERE email = '{email}' and game_id = '{game_id}'"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        cursor.close()

        content["added"] = "True"

        return content
    
    def get_all_cart_games(self, email):
        content = dict()

        sql = f"SELECT * FROM users_carts WHERE email = '{email}'"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()

        for row in cursor.fetchall():
            id = row[1]
            content[id] = self.get_game_by_id(id)

        cursor.close()

        return content
    
    def buy_cart_games(self, email):
        content = dict()
        content["success"] = "False"

        games = self.get_all_cart_games(email)
        user = self.get_user_by_mail(email)

        sum = 0

        for id in games:
            sum += float(games[id]["price"])
        
        if user != False and float(user["budget"]) >= sum:
            sql = f"UPDATE users SET budget = budget - '{sum}' WHERE email = '{email}'"

            cursor = self.connection.cursor()
            cursor.execute(sql)

            self.connection.commit()

            cursor.close()

            for id in games:
                sql = f"INSERT INTO users_inventories(email, game_id) VALUES ('{email}', '{id}')"

                cursor = self.connection.cursor()
                cursor.execute(sql)

                self.connection.commit()

                cursor.close()

                self.remove_from_cart(email, id)

            content["success"] = "True"
            content["budget"] = float(user["budget"]) - sum

        return content

