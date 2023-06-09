// Display & management of modal buttons
import { fetchDel, fetchJSON } from "../functions/api.js";
import { alertElement, createElement } from "../functions/dom.js";
import { deleteWork, gallery, modalReload, workArray } from "../script.js";
import {
    createGallery,
    galleryElements,
    refreshGallery,
} from "./GalleryElements.js";

let id = [];
let memo = [];
let modal = null;
let modal_1 = document.getElementById("modal_1");
let modal_2 = document.getElementById("modal_2");

const new_cat = document.getElementById("category");
function cloneTemplate() {
    const templateModal_2 = document
        .querySelector("#modal_2-layout")
        ?.content.cloneNode(true);
    workForm.prepend(templateModal_2);
    const templateOpt = document.querySelector("#opt")?.content.cloneNode(true);
    new_cat?.append(templateOpt);
    postButtonLocked();
}

const labelOpt = document.querySelector(".modal_categories-img");

// Document qui hebèrge l'image utilisateur
const img_element = document.createElement("img");

// Initialisation de variables globales des éléments du formulaire utilisés dans plusieurs fonctions
const workForm = document.querySelector("#work_form");
workForm?.addEventListener("submit", addWork);

const title = document.getElementById("title");

export function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", true);
    modal = target;

    if (modal_2.style.display === "" && modal_1.style.display === "") {
        modal_1.style.display = "none";
        const modal_return = document
            .querySelector(".js-modal_return")
            .addEventListener("click", function () {
                modal_1.style.display = null;
            });
    }
    if (modal_2.style.display === "") {
        cloneTemplate();
        inputImg();
        const templateModal_2 = document.querySelector("#modal_2-layout");
        const templateLabel = document.querySelector(".modal_add-photo");

        if (title.isEqualNode(workForm) !== true) {
            templateModal_2?.remove();
            // templateOpt?.remove();
        }
    }
    returnModal();
    closeModal(modal);
}

export function closeModal(modal) {
    document.querySelectorAll(".js-modal_close").forEach((element) => {
        element.addEventListener("click", function (event) {
            removeModal(modal, event);
            console.log("closeModal");
        });
    });
}

export function returnModal() {
    document
        .querySelector(".js-modal_return")
        .addEventListener("click", function (event) {
            removeModal(modal, event);
            console.log("returnModal");
        });
}

export function removeModal(target, event) {
    event.preventDefault();
    if (target === null) return;
    target.style.display = "none";
    target.setAttribute("aria-hidden", true);
    target.removeAttribute("aria-modal");
}

export function layoutModal() {
    document.querySelectorAll(".js-modal").forEach((element) => {
        element.addEventListener("click", openModal);
    });
    modalGallery();
}
const modalPoint = document.getElementById("modal-works-gallery");
export function modalGallery(works) {
    refreshGallery("#modal-works-gallery");

    if (modalPoint === null) return;
    works?.map((work) => {
        modalGalleryElements(work);
    });

    deleteElement();
    deleteAllElements();
}

function modalGalleryElements(work) {
    const figure_2 = createElement("figure", {
        class: "imgWork",
        "data-id": work.id,
    });
    modalPoint.append(figure_2);

    figure_2.innerHTML = `
        <img src=${work.imageUrl} 
        alt=${work.title}>

        <img src="./assets/icons/trash_ico.svg" alt="delete" class="delete" 
        data-id=${work.id}>

        <img src="./assets/icons/move.svg"" alt="delete" class="move">
        
        <figcaption>éditer</figcaption>`;
}

function deleteElement() {
    const deleteElement = document.querySelectorAll(".delete");
    deleteElement.forEach((element) => {
        element.addEventListener("click", deleteWork);
    });
}

function deleteAllElements() {
    const deleteAllElements = document.querySelector(".edit_delete-all");
    deleteAllElements.addEventListener("click", function () {
        for (let i = 0; i < workArray?.length; i++) {
            deleteAllWorks(i, workArray);
        }
    });
}

//************ */ Delete Elements *****************/

async function deleteAllWorks(i, workArray) {
    let id = workArray[i].id;
    await fetchDel(id).then((res) => {
        if (res.ok) {
            refreshGallery("#modal-works-gallery");
            refreshGallery(".gallery");
        } else if (res.status == "401") {
            error();
        }
    });
}

function error() {
    let modal = document.querySelector(".modal_wrapper");
    modal.style.display = "none";
    const error = alertElement("Veuillez vous connecter pour continuer");
    error.addEventListener("close", () => {
        document.location.href = "login.html";
    });
}

//************ */ Form Elements modal_2 *****************/

// Création de l'imput de téléchargement image

let image = createElement("div");
function inputImg() {
    const add_img = document.querySelector(".add_img");

    image.innerHTML = `
    <input id="image" name="image" type="file" style="display: none;"/>`;

    add_img?.append(image);

    image = document.querySelector("#image");
    image?.addEventListener("change", previewFile);
}

// Function d'affichage de l'image

function previewFile(e) {
    workForm.append(image);

    img_element.classList.add("done");

    if (this?.files) {
        let img = this.files;
        const img_regex = new RegExp("[.]{1}jpg|jpeg|jfif|pjpeg|pjp|png$", "g");
        if (img?.length === 0 || !img_regex.test(img[0]?.name)) {
            alertElement("Le format d'image choisi, n'est pas valide");
            return;
        }
    }

    let file = e?.target.files[0];
    let url = URL?.createObjectURL(file);
    const imgUrl = `http://localhost:5678/images/${file.name}`;
    memo = {
        url: imgUrl,
    };
    console.log("file =", imgUrl, "url =", url);

    const labelFile = document.querySelector(".modal_add-photo");

    img_element.src = url;
    labelFile.innerHTML = "";
    labelFile.appendChild(img_element);

    postWorkButton();
}

const postButton = document.querySelector(".modal_send-img");
function postButtonLocked() {
    postButton.disabled = true;
    postButton.style.background = "#A7A7A7";
    postButton.style.cursor = "not-allowed";
}

postButton?.addEventListener("change", () => {});

function postWorkButton() {
    if (image.files.length > 0 && title.value != "" && new_cat.value != "") {
        postButton.style.background = "#1D6154";
        postButton.disabled = false;
        postButton.style.cursor = "pointer";
    }
    if (image.files.length > 0) {
        title.addEventListener("input", postWorkButton);
        new_cat.addEventListener("input", postWorkButton);
        image.addEventListener("input", postWorkButton);
        workForm.addEventListener("submit", addWork);
    }
}

// /**
//  * @param {Event} e
//  */
async function addWork(e) {
    e.preventDefault();

    const formData = new FormData();
    formData?.append("image", image?.files[0]);
    formData.append("title", title.value);
    formData.append("category", parseInt(new_cat.value, 10));

    console.log("1 formData =", formData.content);

    try {
        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + localStorage.user,
            },
            body: formData,
        });

        await modalReload();
        await fetchJSON("http://localhost:5678/api/works");

        workForm.reset();
        img_element.remove();
        resetModalPOST();
    } catch (e) {
        if (e.status == "401") {
            alertElement("session expirée, merci de vous reconnecter").then(
                () => (document.location.href = "login.html")
            );
        }
        console.error(e);
    }

    const elements = document.querySelectorAll(".imgWork");
    const lastElement = elements[elements.length - 1];

    console.log(lastElement.dataset.id);

    const newMem = {
        imageUrl: memo.url,
        title: title.value,
        id: lastElement.dataset.id,
    };

    galleryElements(newMem);
}

async function resetModalPOST() {
    const labelFile = document.querySelector(".modal_add-photo");
    postButtonLocked();
    labelFile.innerHTML = `
    <img src="assets/icons/sendBoxImg.svg" alt="sendBoxImg"/>
    <a class="add_img">+ Ajouter photo</a>
    `;
    image.remove();
    inputImg();
}
