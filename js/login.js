document.getElementById("loginBtn").addEventListener("click", () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    const errorMessage = document.getElementById("errorMessage");

    if (!username.value || !password.value) {
        errorMessage.textContent = "Todos los campos son obligatorios";
        errorMessage.style.display = "block";
        return;
    }
    fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            localStorage.setItem("id", data.data.user_id)
            window.location.href = "/index.html";
            
        } else {
            errorMessage.textContent = data.message || "Usuario o Contraseña incorrectos";
            errorMessage.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        errorMessage.textContent = "Ocurrió un error, por favor intente más tarde.";
        errorMessage.style.display = "block";
    });
});
