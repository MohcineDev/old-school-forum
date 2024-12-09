// Check if user is logged in
const userId = localStorage.getItem("user_id")
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

///the att is an array of objects of attribute Name : and array values
const appendBtns = (parent, child, attributes, txt) => {
    const elem = document.createElement(child)

    attributes.forEach(e => {
        let key = Object.keys(e)[0]
        elem.setAttribute(key, ...e[key])

    })
    elem.textContent = txt
    parent.appendChild(elem)
}


// Interaction functions for like/dislike
function interact(action, postId) { 
    console.log('hi from interact');

    if (action === 'delete') {
        confirm("Are you sure? This post might haunt you!") ?
            fetch(`/post_delete/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, post_id: postId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message)
                    location.href = '/'
                })
                .catch((error) => alert("Error interacting with post: " + error.message)) : null
    } else {

        fetch(`/${action}`, {
            method: action == 'delete' ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.msg)
                window.location.reload()
            })
            .catch((error) => alert("Error interacting with post: " + error.msg))
    }
}



///theeeeeeeme
const light = document.querySelector('.light-btn')
const dark = document.querySelector('.dark-btn')
const preferedtheme = localStorage.getItem('preferedtheme')

const applyDark = () => {
    document.body.classList.add("dark")
    document.body.classList.remove("light")
}

const applyLight = () => {
    document.body.classList.add("light")
    document.body.classList.remove("dark")
}

if (preferedtheme == 'light') applyLight()
else applyDark()


///this is Optional Chaining
light ?.addEventListener('click', (e) => {
    localStorage.setItem("preferedtheme", "light")
    applyLight()
})

///--they call it logical and
dark && dark.addEventListener('click', (e) => {
    localStorage.setItem("preferedtheme", "dark")
    applyDark()
})
