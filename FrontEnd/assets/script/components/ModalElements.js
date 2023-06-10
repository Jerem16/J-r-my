// Import des modules
import { fetchDel, fetchJSON } from "../functions/api.js";
import { alertElement, createElement } from "../functions/dom.js";
import {
    category,
    deleteWork,
    gallery,
    modalReload,
    workArray,
} from "../script.js";
import {
    createGallery,
    galleryElements,
    refreshGallery,
} from "./GalleryElements.js";

/** @type {Number|[]|null} */
let memo = null;
/** @type {HTMLElement|null} */
let modal = null;
let modal_1 = document.getElementById("modal_1");
let modal_2 = document.getElementById("modal_2");
const modalPoint = document.getElementById("modal-works-gallery");

let templateModal_2 = null;
let templateOpt = null;
const options = document.querySelector("#opt > option");

const workForm = document.querySelector("#work_form");
workForm?.addEventListener("submit", addWork);

const title = document.getElementById("title");
const new_cat = document.getElementById("category");
const img_element = document.createElement("img"); // Document qui héberge l'image uploader de utilisateur
const postButton = document.querySelector(".modal_send-img");

/** @type {String||Number} */
const img_regex = /\.(jpg|jpeg|jfif|pjpeg|pjp|png)$/i;

//** Templates **/
/**Clone et affiche les templates
 */
function cloneTemplate() {
    if (!templateModal_2) {
        //(!templateModal_2) empêche la duplication de du template
        templateModal_2 = document
            .querySelector("#modal_2-layout")
            ?.content.cloneNode(true);
        workForm.prepend(templateModal_2);
        
        //(options) Créer les élément options
        new_cat?.setAttribute("size", "");
        new_cat.innerHTML = `
        <option value=""></option>
        <option value="1">Object</option>
        <option value="2">Appartements</option>
        <option value="3">
            Hotels & restaurants
        </option>`;
    }
    postButtonLocked();
}

//** Modales **/
/**
 * @param {EventListener} event- L'événement click
 */
export function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", true);
    modal = target;

    if (modal_2.style.display === "" && modal_1.style.display === "") {
        modal_1.style.display = "none";
        document
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

        if (!title.isEqualNode(workForm)) {
            templateModal_2?.remove();
            // templateOpt?.remove();
        }
    }

    returnModal();
    closeModal(modal);
}

/**
 * @param {EventListener} event
 * @param {HTMLElement} modal - L'élément modal à fermer
 */
export function closeModal(modal) {
    document.querySelectorAll(".js-modal_close").forEach((element) => {
        element.addEventListener("click", function (event) {
            removeModal(modal, event);
            console.log("closeModal");
        });
    });
}

/**Retour modal (précédent)
 * @param {EventListener} event
 */
export function returnModal() {
    document
        .querySelector(".js-modal_return")
        .addEventListener("click", function (event) {
            removeModal(modal, event);
            console.log("returnModal");
        });
}

/** Fait disparaître la modal
 * @param {HTMLElement} target - L'élément modal à supprimer
 * @param {EventListener} event - L'événement click
 */
export function removeModal(target, event) {
    event.preventDefault();
    if (target === null) return;
    target.style.display = "none";
    target.setAttribute("aria-hidden", true);
    target.removeAttribute("aria-modal");
}

/** Initialise l'affichage de la modal
 * @param {Event} event - L'événement click
 */
export function layoutModal() {
    document.querySelectorAll(".js-modal").forEach((element) => {
        element.addEventListener("click", openModal);
    });
    modalGallery();
}

//**? Affichage de la gallery dans la modales **/

/**Définie l'affichage d'un élément (dans la galerie du modal)
 * @param {Work[]} [work] - élément[0] à afficher=> (workArray)
 * @type {HTMLElement}
 */
function modalGalleryElements(work) {
    const figure_2 = createElement("figure", {
        class: "imgWork",
        "data-id": work.id,
    });
    modalPoint.append(figure_2);

    const image = createElement("img", {
        src: work.imageUrl,
        alt: work.title,
    });
    figure_2.appendChild(image);

    const deleteIcon = createElement("img", {
        src: "./assets/icons/trash_ico.svg",
        alt: "delete",
        class: "delete",
        "data-id": work.id,
    });
    figure_2.appendChild(deleteIcon);

    const moveIcon = createElement("img", {
        src: "./assets/icons/move.svg",
        alt: "move",
        class: "move",
    });
    figure_2.appendChild(moveIcon);

    const figcaption = createElement("figcaption", {}, "éditer");
    figure_2.appendChild(figcaption);
}
/**Ajoute touts les éléments à afficher
 * @param {Work[]} [workArray]
 */
export function modalGallery(works) {
    refreshGallery("#modal-works-gallery");

    if (modalPoint === null) return;
    works?.forEach((work) => {
        modalGalleryElements(work);
    });

    deleteElement();
    deleteAllElements();
}

//**! Affichage de la gallery dans la modales **/

/** Supprime l'un des éléments des travaux au
 * @param {EventListener} event
 */
function deleteElement() {
    const deleteElements = document.querySelectorAll(".delete");
    deleteElements.forEach((element) => {
        element.addEventListener("click", deleteWork);
    });
}
/**"Supprime tout les travaux
 * @param {Event} event
 * @param {Work[]} [work] - Travaux à afficher (workArray)
 * @param {number} index - L'index de l'œuvre
 */
function deleteAllElements() {
    const deleteAllElement = document.querySelector(".edit_delete-all");
    deleteAllElement.addEventListener("click", function () {
        workArray?.forEach((work, index) => {
            deleteAllWorks(index, workArray);
        });
    });
}
/** Supprime toutes les œuvres
 * @param {number} index - L'index de l'œuvre
 * @param {Work[]} workArray - Le tableau des œuvres
 */
async function deleteAllWorks(index, workArray) {
    const id = workArray[index].id;
    try {
        await fetchDel(id);
        refreshGallery("#modal-works-gallery");
        refreshGallery(".gallery");
    } catch (e) {
        if (e.status == "401") {
            error();
        }
    }
}
/** Affiche une erreur
 * @type {Error}
 * @param {Event} event
 */
function error() {
    const modal = document.querySelector(".modal_wrapper");
    modal.style.display = "none";
    const errorMessage = "Veuillez vous connecter pour continuer";
    const error = alertElement(errorMessage);
    error.addEventListener("close", () => {
        document.location.href = "login.html";
    });
}

//**? Modal 2 ajouter ou supprimer des travaux **/

//** Boutton (d'envoi) du formulaire **/
/** Bloque le bouton d'envoi du formulaire
 */
function postButtonLocked() {
    postButton.disabled = true;
    postButton.style.background = "#A7A7A7";
    postButton.style.cursor = "not-allowed";
}
/**Vérifie les conditions pour activer le bouton d'envoi du formulaire
 * @param {EventListener} event
 */
function postWorkButton() {
    const files = image.files;
    const titleValue = title.value;
    const newCatValue = new_cat.value;

    if (files.length > 0 && titleValue !== "" && newCatValue !== "") {
        postButton.style.background = "#1D6154";
        postButton.disabled = false;
        postButton.style.cursor = "pointer";
    }

    if (files.length > 0) {
        title.addEventListener("input", postWorkButton);
        new_cat.addEventListener("input", postWorkButton);
        image.addEventListener("input", postWorkButton);
        workForm.addEventListener("submit", addWork);
    }
}

//********/ Form Elements modal_2 *****************//

// Création d'un input de type "file" (téléchargement d'image)

/** @type {HTMLInputElement} */
let image;
/** Crée un élément input de type "file" pour l'image */
function createImageElement() {
    image = document.createElement("input");
    image.id = "image";
    image.name = "image";
    image.type = "file";
    image.style.display = "none";
}
/** Définie l'ajout de l'élément input de type "file"*/
function inputImg() {
    const add_img = document.querySelector(".add_img");

    if (!image) {
        createImageElement();
    }

    add_img?.append(image);

    image.addEventListener("change", previewFile);
}

/**Affiche le fichier image sélectionné par l'utilisateur dans la modal.
 * @param {Event} e - L'événement change
 */
function previewFile(e) {
    const files = this.files;

    if (files?.length === 0 || !img_regex.test(files[0]?.name)) {
        alertElement("Le format d'image choisi n'est pas valide");
        return;
    }

    const file = files[0];
    const url = URL?.createObjectURL(file);
    const imgUrl = `http://localhost:5678/images/${file.name}`;

    memo = {
        url: imgUrl,
    };
    console.log("file =", imgUrl, "url =", url);

    const img_element = document.createElement("img");
    img_element.src = url;
    img_element.classList.add("done");

    const labelFile = document.querySelector(".modal_add-photo");
    labelFile.innerHTML = "";
    labelFile.appendChild(img_element);

    postWorkButton();
}

/** Ajoute une nouvelle œuvre via une requête POST
 * @param {Event} e - L'événement submit
 * @returns {Promise<void>}
 */
async function addWork(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image?.files[0]);
    formData.append("title", title.value);
    formData.append("category", parseInt(new_cat.value, 10));

    console.log("1 formData =", formData.content);

    try {
        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.user,
            },
            body: formData,
        });

        await modalReload();
        await fetchJSON("http://localhost:5678/api/works");

        workForm.reset();
        resetModalPOST();
    } catch (e) {
        if (e.status == "401") {
            alertElement("Session expirée, merci de vous reconnecter").then(
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

/**Reset le formulaire, l'input "file",  et le boutton d(envoi du formulaire,*/
function resetModalPOST() {
    const labelFile = document.querySelector(".modal_add-photo");
    postButtonLocked();
    labelFile.innerHTML = `
    <img src="assets/icons/sendBoxImg.svg" alt="sendBoxImg"/>
    <a class="add_img">+ Ajouter photo</a>
    `;

    if (image) {
        image.remove();
        image = null;
    }

    inputImg();
}
