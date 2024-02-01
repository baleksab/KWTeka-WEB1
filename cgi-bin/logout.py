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
    <body onload="logout()">
      
        <script src="../js/script.js"></script>
    </body>
    </html> 
''')