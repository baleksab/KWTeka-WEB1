function testEmail(email) {
	var r = new RegExp(/^[A-Za-z0-9\.\-\_]{5,}\@[a-z]{2,5}\.[a-z]{1,3}$/);

	if(r.test(email))
		return true;

	return false;
}

function testPassword(password) {
	var r = new RegExp(/^[A-Za-z0-9]{3,15}$/);

	if(r.test(password))
		return true;

	return false;
}

function register() {
    var email = document.querySelector("#email").value
    var firstName = document.querySelector("#firstName").value
    var lastName = document.querySelector("#lastName").value
    var budget = document.querySelector("#budget").value
    var password = document.querySelector("#password").value
    var confirmPassword = document.querySelector("#confirmPassword").value

    var errorMsg = ""

    if (firstName.length == 0 || lastName.length == 0)
        errorMsg = "*Moraju sva polja biti popunjena"
    else if (!testEmail(email))
        errorMsg = "*Lose je unet email"
    else if (!testPassword(password) || password != confirmPassword)
        errorMsg = "*Unesite ispravno sifru"

    var formError = document.querySelector("#formError")

    if (errorMsg == "") {
        var account = {}
        account["email"] = email
        account["first_name"] = firstName
        account["last_name"] = lastName
        account["password"] = password
        account["budget"] = budget

        account = JSON.stringify(account)

        var xmlHttp = new XMLHttpRequest()

        xmlHttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var content = JSON.parse(this.responseText)

                if (content["register"] == "True") {
                    var date = new Date()
                    date.setTime(date.getTime() + 86400000)

                    var utcDate = date.toUTCString()
                    var cookie = document.cookie.split(";")

                    for (var i = 0; i < cookie.length; i++)
                        document.cookie = cookie[i] + "=;expires=" + new Date(0).toUTCString()

                    account = JSON.parse(account)

                    document.cookie = `session_id=${content["session_id"]};expires=${utcDate};`
                    document.cookie = `email=${account["email"]};expires=${utcDate}`
                    document.cookie = `first_name=${account["first_name"]};expires=${utcDate};`
                    document.cookie = `last_name=${account["last_name"]};expires=${utcDate};`
                    document.cookie = `budget=${account["budget"]};expires=${utcDate};`

                    window.location = "home.py"

                    console.log("Registered")
                } else 
                    formError.textContent = "*Korisnik sa datim emailom vec postoji"
            }
        }
        
        xmlHttp.open("GET", `../cgi-bin/utils/requests.py?register=True&account=${account}`, true)
        xmlHttp.send()
    } else
        formError.textContent = errorMsg;
}

function logout() {
    document.cookie = "email=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    document.cookie = "first_name=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    document.cookie = "last_name=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    document.cookie = "budget=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)

            if (content["logout"] == "True") {
                document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
                console.log("Logged out")
            }

            window.location = 'login.py'
        }
    }
    
    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?logout=True&session-id=${getCookie("session_id")}`, true)
    xmlHttp.send()

}

function login() {
    var email = document.querySelector("#email").value
    var password = document.querySelector("#password").value
    
    var formError = document.querySelector("#formError")

    var errorMsg = ""

    if (email.length == 0 || password.length == 0)
        errorMsg = "*Sva polja moraju biti popunjena"

    if (errorMsg == "") {
        var account = {}
        account["email"] = email
        account["password"] = password
        
        account = JSON.stringify(account)

        var xmlHttp = new XMLHttpRequest()

        xmlHttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var content = JSON.parse(this.responseText)

                if (content["login"] == "True") {
                    var date = new Date()
                    date.setTime(date.getTime() + 86400000)

                    var utcDate = date.toUTCString()
                    var cookie = document.cookie.split(";")

                    for (var i = 0; i < cookie.length; i++)
                        document.cookie = cookie[i] + "=;expires=" + new Date(0).toUTCString()

                    document.cookie = `session_id=${content["session_id"]};expires=${utcDate};`
                    document.cookie = `email=${content["email"]};expires=${utcDate}`
                    document.cookie = `first_name=${content["first_name"]};expires=${utcDate};`
                    document.cookie = `last_name=${content["last_name"]};expires=${utcDate};`
                    document.cookie = `budget=${content["budget"]};expires=${utcDate};`

                    window.location = "home.py"

                    console.log("Logged in")
                } else 
                    formError.textContent = "*Korisnik sa datim podacima ne postoji"
            }
        }

        xmlHttp.open("GET", `../cgi-bin/utils/requests.py?login=True&account=${account}`)
        xmlHttp.send()
    } else 
        formError.textContent = errorMsg
}    

function getCookie(name) {
    const cookies = document.cookie.split(';')

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=')
        
        if (cookieName === name)
            return decodeURIComponent(cookieValue);
    }

    return null;
}

function checkIfLoggedIn() {
    if (getCookie("session_id"))
        window.location = "home.py"
}

function loadAllGames() {
    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)

            var catalog = document.querySelector("#game-catalog")
            catalog.innerHTML = ""

            for (const id in content) {
                const game = content[id]

                var ratingColor = "red";
                var displayButton = "none";

                if (parseFloat(game["rating"]) > 2.5 && parseFloat(game["rating"]) < 4.0)
                    ratingColor = "orange";
                else if (parseFloat(game["rating"]) >= 4.0)
                    ratingColor = "green";
                else 
                    ratingColor = "red";

                var buttonText = "Dodaj u korpu"
                var buttonColor = "#3498db"
                var buttonFunction = `addToCart(${id})`

                console.log(game["users_carts"])

                if (getCookie("session_id")) {
                    displayButton = "inline-block"

                    if (getCookie("email")) {
                        if (game["users_carts"].includes(getCookie("email"))) {
                            buttonText = "Ukloni iz korpe"
                            buttonColor = "red"
                            buttonFunction = `removeFromCart(${id})`
                        } else if (game["users_inventories"].includes(getCookie("email"))) {
                            buttonText = "Vec imate ovu igricu"
                            buttonColor = "orange"
                            buttonFunction = ``
                        }
                    }
                }

                catalog.innerHTML += `
                    <div class="game">
                        <h2>${game["name"]}</h2>
                        <img src="${game["image"]}" alt="${game["name"]}">
                        <p class="info">Ocena: <span style="color: ${ratingColor}">${game["rating"]}</span></p>
                        <p class="info">Cena: ${game["price"]}<span style="color: green;">$</span></p>
                        <button id="buy-button${id}" style="display: ${displayButton}; background-color: ${buttonColor}" onclick="${buttonFunction}">${buttonText}</button>
                    </div>
                `
            }
        }
    }

    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?get-all-games=True`)
    xmlHttp.send()
}

function loadNavbarButtons() {
    var logout = document.querySelector("#logoutButton")
    var register = document.querySelector("#registerButton")
    var login = document.querySelector("#loginButton")
    var profile = document.querySelector("#profileButton")
    var cart = document.querySelector("#cartButton")

    if (getCookie("session_id")) {
        login.style.display = "none";
        register.style.display = "none";
    } else {
        logout.style.display = "none";
        profile.style.display = "none";
        cart.style.display = "none";
    }
}

function populateHome() {
    loadNavbarButtons()
    loadAllGames()
}

function addToCart(id) {
    var button = document.querySelector(`#buy-button${id}`)
    button.disabled = true 

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)

            if (content["added"] == "True") {
                button.style["background-color"] = "red"
                button.textContent = "Ukloni iz korpe"

                button.onclick = function() {
                    removeFromCart(id)
                }
            }

            button.disabled = false
        }
    }
    
    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?add-to-cart=True&email=${getCookie("email")}&game-id=${id}`, true)
    xmlHttp.send()
}

function removeFromCart(id) {
    var button = document.querySelector(`#buy-button${id}`)
    button.disabled = true 

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)

            if (content["removed"] == "True") {
                button.style["background-color"] = "#3498db"
                button.textContent = "Dodaj u korpu"

                button.onclick = function() {
                    addToCart(id)
                }
            }

            button.disabled = false
        }
    }
    
    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?remove-from-cart=True&email=${getCookie("email")}&game-id=${id}`, true)
    xmlHttp.send()
}

function populateCart() {
    if (getCookie("session_id") == null)
        window.location = "home.py"
    
    loadNavbarButtons()
    loadCartGames()
}

function loadCartGames() {
    var usersStatus = document.querySelector("#users-status-id")
    var budgetLabel = document.querySelector("#budget")
    var cartLabel = document.querySelector("#cart-cost")
    var newBudgetLabel = document.querySelector("#new-budget")

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)
            console.log(content)
            var catalog = document.querySelector("#game-catalog")
            catalog.innerHTML = ""
            var sum = 0;

            for (const id in content) {
                const game = content[id]

                var ratingColor = "red";

                if (parseFloat(game["rating"]) > 2.5 && parseFloat(game["rating"]) < 4.0)
                    ratingColor = "orange";
                else if (parseFloat(game["rating"]) >= 4.0)
                    ratingColor = "green";
                else 
                    ratingColor = "red";

                var buttonText = "Ukloni iz korpe"
                var buttonColor = "red"
                var buttonFunction = `removeFromCart2(${id})`

                catalog.innerHTML += `
                    <div class="game">
                        <h2>${game["name"]}</h2>
                        <img src="${game["image"]}" alt="${game["name"]}">
                        <p class="info">Ocena: <span style="color: ${ratingColor}">${game["rating"]}</span></p>
                        <p class="info">Cena: ${game["price"]}<span style="color: green;">$</span></p>
                        <button id="buy-button${id}" style="background-color: ${buttonColor};" onclick="${buttonFunction}">${buttonText}</button>
                    </div>
                `

                sum += parseFloat(game["price"])
            }

            if (Object.keys(content).length == 0) {
                catalog.innerHTML = "<h1>KORPA JE PRAZNA</h1>"
                usersStatus.style["display"] = "none"
            } else {
                budgetLabel.money = parseFloat(getCookie("budget")).toFixed(2)
                cartLabel.money = sum.toFixed(2) 
                newBudgetLabel.money = (budgetLabel.money - sum).toFixed(2)
                
                budgetLabel.textContent = budgetLabel.money
                cartLabel.textContent = cartLabel.money
                newBudgetLabel.textContent = newBudgetLabel.money
            }
        }
    }

    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?get-all-cart-games=True&email=${getCookie("email")}`)
    xmlHttp.send()
}

function removeFromCart2(id) {
    var button = document.querySelector(`#buy-button${id}`)
    button.disabled = true 

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)

            if (content["removed"] == "True") {
                loadCartGames()
            }
        }
    }
    
    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?remove-from-cart=True&email=${getCookie("email")}&game-id=${id}`, true)
    xmlHttp.send()
}

function buyCartItems() {
    var buyButton = document.querySelector("#buyButton")
    buyButton.disabled = true

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)
            
            if (content["success"] == "True") {
                var date = new Date()
                date.setTime(date.getTime() + 86400000)
                document.cookie = `budget=${content["budget"]};expires=${date.toUTCString()};`

                loadCartGames()
                alert("Uspesno obavljena kupovina!")
            } else
                alert("Nemate dovoljno novca!")

            buyButton.disabled = false
        }
    }

    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?buy-cart-games=True&email=${getCookie("email")}`)
    xmlHttp.send()
}

function populateProfile() {
    if (getCookie("session_id") == null)
        window.location = "home.py"

    loadNavbarButtons()
    loadInventoryGames()
}

function loadInventoryGames() {
    var firstNameLabel = document.querySelector("#first-name")
    var lastNameLabel = document.querySelector("#last-name")
    var budgetLabel = document.querySelector("#budget")

    firstNameLabel.textContent = getCookie("first_name")
    lastNameLabel.textContent = getCookie("last_name")
    budgetLabel.textContent = parseFloat(getCookie("budget")).toFixed(2)

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)
        
            var catalog = document.querySelector("#game-catalog")
            catalog.innerHTML = ""
            
            for (const id in content) {
                const game = content[id]

                var ratingColor = "red";
                var price = (parseFloat(game["price"]) * 0.6).toFixed(2)

                if (parseFloat(game["rating"]) > 2.5 && parseFloat(game["rating"]) < 4.0)
                    ratingColor = "orange";
                else if (parseFloat(game["rating"]) >= 4.0)
                    ratingColor = "green";
                else 
                    ratingColor = "red";

                var buttonText = "Prodaj igricu"
                var buttonColor = "#3498db"
                var buttonFunction = `sellGameFromInventory(${id})`

                catalog.innerHTML += `
                    <div class="game">
                        <h2>${game["name"]}</h2>
                        <img src="${game["image"]}" alt="${game["name"]}">
                        <p class="info">Ocena: <span style="color: ${ratingColor}">${game["rating"]}</span></p>
                        <p class="info">Cena: ${game["price"]}<span style="color: green;">$</span></p>
                        <p class="info">Otkupna cena: ${price}<span style="color: green;">$</span></p>
                        <button id="buy-button${id}" style="background-color: ${buttonColor};" onclick="${buttonFunction}">${buttonText}</button>
                    </div>
                `
            }

            if (Object.keys(content).length == 0) {
                catalog.innerHTML = "<h1>NEMATE NI JEDNU IGRICU KUPLJENU</h1>"
            } 
        }
    }

    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?get-all-inventory-games=True&email=${getCookie("email")}`)
    xmlHttp.send()
}

function sellGameFromInventory(id) {
    var buyButton = document.querySelector(`#buy-button${id}`)
    buyButton.disabled = true

    var xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var content = JSON.parse(this.responseText)
            
            if (content["success"] == "True") {
                var date = new Date()
                date.setTime(date.getTime() + 86400000)
                document.cookie = `budget=${content["budget"]};expires=${date.toUTCString()};`

                loadInventoryGames()
                alert("Uspesno ste prodali igricu!")
            }  else
                console.log("Desila se neka greska")

            buyButton.disabled = false
        }
    }

    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?sell-inventory-game=True&email=${getCookie("email")}&game-id=${id}`)
    xmlHttp.send()
}