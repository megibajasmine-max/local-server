async function login() {

    const username =
    document.getElementById('username').value;

    const password =
    document.getElementById('password').value;

    const status =
    document.getElementById('status');

    try {

        const response = await fetch('/login', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if(data.success){

            status.innerHTML =
            "Welcome to Qeta AI";

            status.style.color = "lime";

        } else {

            status.innerHTML =
            data.message;

            status.style.color = "red";
        }

    } catch(error){

        status.innerHTML =
        "Server error";

        status.style.color = "red";
    }
}