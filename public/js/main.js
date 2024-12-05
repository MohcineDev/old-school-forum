// Check if user is logged in
let userId = localStorage.getItem("user_id")
console.log(userId);

const profileLink = document.querySelector('.profile')
const registerLink = document.getElementById("registerLink")
const loginLink = document.getElementById("loginLink")
const logoutButton = document.getElementById("logoutButton")

if (userId) {
    ///set the usrename
    profileLink.textContent = localStorage.getItem("username")
    profileLink.style.display = 'inline-block'

    // Show logout button
    logoutButton.style.display = "inline-block"

    // Hide Login and Register, show Logout
    loginLink.style.display = "none"
    registerLink.style.display = "none"
} else {
    // Show Login and Register, hide Logout
    loginLink.style.display = "inline-block"
    registerLink.style.display = "inline-block"
    logoutButton.style.display = "none"
    ///hide profile link
    profileLink.style.display = 'none'
}

// Logout functionality

logoutButton.addEventListener("click", function () {
    // Clear user data from localStorage

    confirm("Logout Confirmation") ? (

        localStorage.clear(),
        // Redirect to the login page
        window.location.href = "/"
    ) : null
})


const appendBtns = (parent, child, attributes, txt) => {
    const elem = document.createElement(child)

    attributes.forEach(e => {
        let key = Object.keys(e)[0]
        elem.setAttribute(key, ...e[key])

    })
    elem.textContent = txt
    parent.appendChild(elem)
}