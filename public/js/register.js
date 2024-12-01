const form = document.querySelector("form")
        form.addEventListener("submit", function (event) {
            event.preventDefault();


            // Capture form data
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username, email, password }),
            })
            .then((response) => {
                    if (!response.ok) {
                        throw new Error("Invalid credentials");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data.message); // For debugging purposes
                    // Redirect to the login page
                    window.location.href = "/login";
                })
                .catch((error) => console.error(error));
        })