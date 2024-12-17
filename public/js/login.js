const form = document.querySelector("form")
form.addEventListener("submit", function (event) {
    event.preventDefault();

    console.log('1231')

    // Capture form data
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                alert('Invalid credentials')
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message); // For debugging purposes
            // Redirect to the home page
           localStorage.setItem("user_id", data.user.id); // Example
           localStorage.setItem("username", data.user.username);
            window.location.href = "/";
        })
        .catch((error) => console.error(error));
})