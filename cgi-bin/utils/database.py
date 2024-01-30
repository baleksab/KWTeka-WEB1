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
    
    def logout_client(self, session_id):
        sql = f"UPDATE users SET session_id = '' WHERE session_id='{session_id}'"

        cursor = self.connection.cursor()
        cursor.execute(sql)

        self.connection.commit()
        
        content = cursor.fetchone()
        cursor.close()

        if content:
            return True