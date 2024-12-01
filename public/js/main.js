// Check if user is logged in
let userId = localStorage.getItem("user_id")
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


logoutButton.addEventListener("click", function () {
    // Clear user data from localStorage

    confirm("Logout Confirmation") ? (

        localStorage.clear(),
        // Redirect to the login page
        window.location.href = "/"
    ) : null
})
