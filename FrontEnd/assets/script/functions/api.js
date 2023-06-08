import { alertElement } from "./dom.js";

export async function fetchJSON(url, options = {}) {
    const headers = { Accept: "application/json", ...options.headers };
    const reply = await fetch(url, { ...options, headers });
    if (reply.ok) {
        return reply.json();
    } else {
        alertElement("Erreur serveur");
    }
    return reply;
}

export async function fetchLogin(dataUser) {
    const reply = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
    });
    if (reply.ok) {
        return reply.json();
    } else if (reply.status === 401) {
        alertElement("Mot de passe incorrect");
    } else {
        alertElement("L'adresse mail saisie, est incorrect");
    }
}

export async function fetchDel(id) {
    const reply = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.user,
        },
    });
    console.log("del test api res", reply);
    return reply;
}

