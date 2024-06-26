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
        <title>WEBTeka - Cart</title>
    </head>
    <body onload="populateProfile()">
        <div class="container">
            <header>
                <nav>
                    <div class="logo"><a href="home.py">WEBTeka</a></div>
                    <ul>
                        <li id="profileButton"><a href="profile.py">Profil</a></li>
                        <li id="cartButton"><a href="cart.py">Korpa</a></li>
                        <li id="logoutButton"><a href="logout.py">Odjava</a></li>
                        <li id="loginButton"><a href="login.py">Prijava</a></li>
                        <li id="registerButton"><a href="register.py">Registracija</a></li>
                    </ul>
                </nav>
            </header>
        
            <div class="games-container" style="flex-direction: column;">
                <div id="users-status-id" class="user-status">
                    <h2>Ime: <span id="first-name"> </span></h2>
                    <h2>Prezime: <span id="last-name"> </span></h2>
                    <h2>Budzet: <span id="budget"> </span><span style="color: green;">$</span></h2>
                    <h2 style="color: orange;">Mozete prodati vase igrice za 60% njene prodajne cene!<h2>
                </div>
      
                <div class="cart-list" id="game-catalog">

                </div>
            </div>

            <footer>
                &copy; 2024 WEBTeka
            </footer>
        </div>

        <script src="../js/script.js"></script>
    </body>
    </html>
''')