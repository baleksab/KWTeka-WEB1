#!/usr/bin/python

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

                    <label for="firstName">Ime:</label>
                    <input type="text" id="firstName" name="firstName" required>

                    <label for="lastName">Prezime:</label>
                    <input type="text" id="lastName" name="lastName" required>
      
                    <label for="budget">Budzet:</label>
                    <input type="number" min="0" id="budget" name="budget" required>

                    <label for="password">Sifra:</label>
                    <input type="password" id="password" name="password" required>

                    <label for="confirmPassword">Unesite ponovo sifru:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>

                    <button type="button" onclick="register()">Registrujte se</button>
                </form>
                <div class="form-feedback">Vec imate nalog? <a href="login.py" id="goToLogin">Idite na prijavu.</a></div>
                <div class="form-feedback">Zelite da se vratite na katalog? <a href="home.py" id="goToLogin">Idite na katalog.</a></div>
                <div id="formError" class="form-feedback-error"></div>  
            </div>
        </div>
      
        <script src="../js/script.js"></script>
    </body>
    </html> 
''')