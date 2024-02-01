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
        account["budget"] = 0

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
                    document.cookie = `budget=${account["last_name"]};expires=${utcDate};`

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
    
    xmlHttp.open("GET", `../cgi-bin/utils/requests.py?logout=True&session_id=${getCookie("session_id")}`, true)
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
                    document.cookie = `budget=${content["last_name"]};expires=${utcDate};`

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