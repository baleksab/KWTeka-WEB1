#!/usr/bin/python3

from os import environ
from http.cookies import SimpleCookie 

print(f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../css/style.css">
        <title>WEBTeka</title>
    </head>
    <body onload="checkIfLoggedIn()">
        <div class="container">
            <div class="form-container">
                <form id="register-form">
                    <label for="email">E-mail adresa:</label>
                    <input type="email" id="email" name="email" required>

                    <label for="password">Sifra:</label>
                    <input type="password" id="password" name="password" required>

                    <button type="button" onclick="login()">Prijavite se</button>
                </form>
                <div class="form-feedback">Nemate nalog? <a href="register.py" id="goToLogin">Idite na registraciju.</a></div>
                <div class="form-feedback">Zelite da se vratite na katalog? <a href="home.py" id="goToLogin">Idite na katalog.</a></div>
                <div id="formError" class="form-feedback-error"></div>  
            </div>
        </div>
      
        <script src="../js/script.js"></script>
    </body>
    </html> 
''')