import { fetchJSON, fetchLogin } from "./functions/api.js";

const login = document.querySelector("header nav li:nth-child(3)");
login.setAttribute("data", "active");
login.classList.add("active");

function logIn() {
    document
        .querySelector(".login-form")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            authentication().catch((e) => {
                throw new Error("Erreur serveur", { cause: e });
            });
        });
}

logIn();

async function authentication() {
    const username = document.getElementById("login_mail").value;
    const password = document.getElementById("password").value;
    const dataUser = {
        email: username,
        password: password,
    };

    await fetchLogin(dataUser).then((response) => {
        const userKey = response.token;
        window.localStorage.setItem("user", userKey);
        document.location.href = "edit.html";
    });
}
