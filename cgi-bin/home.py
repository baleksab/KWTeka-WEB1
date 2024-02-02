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
    <body onload="populateHome()">
        <div class="container">
        <header>
            <nav>
                <div class="logo"><a href="home.py">WEBTeka</a></div>
                <ul>
                    <li id="profileButton"><a href="#">Profil</a></li>
                    <li id="cartButton"><a href="cart.py">Korpa</a></li>
                    <li id="logoutButton"><a href="logout.py">Odjava</a></li>
                    <li id="loginButton"><a href="login.py">Prijava</a></li>
                    <li id="registerButton"><a href="register.py">Registracija</a></li>
                </ul>
            </nav>
        </header>
      
        <div class="games-container" id="game-catalog">
            
        </div>

        <footer>
                &copy; 2024 WEBTeka
        </footer>
        </div>

        <script src="../js/script.js"></script>
    </body>
    </html>
''')