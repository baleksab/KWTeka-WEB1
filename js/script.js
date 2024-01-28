function register() {
    var email = document.querySelector("#email").value
    var firstName = document.querySelector("#firstName").value
    var lastName = document.querySelector("#lastName").value
    var password = document.querySelector("#password").value
    var confirmPassword = document.querySelector("#confirmPassword").value

    var formError = document.getElementById("formError")
    var errorText = ""

    if (password != confirmPassword)
        errorText += "Sifre se ne poklapaju\n"

    if (errorText == "") {
        account = {}
        account["email"] = email 
        account["firstName"] = firstName
        account["lastName"] = lastName 
        account["password"] = password

        accountJSON = JSON.stringify(account)

        var xmlHttp = new XMLHttpRequest()

        xmlHttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                content = JSON.parse(this.responseText)
            }
        }
         
        xmlHttp.open("POST", `../cgi-bin/requests.py?account=${accountJSON}`, true)
    }

    console.log(email, firstName, lastName, password, confirmPassword)
}