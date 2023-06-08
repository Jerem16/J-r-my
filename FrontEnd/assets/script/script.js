import {
    createFilter,
    createGallery,
    filterResult,
    refreshGallery,
} from "./components/GalleryElements.js";
import { layoutModal, modalGallery } from "./components/ModalElements.js";

import { fetchJSON, fetchDel } from "./functions/api.js";

const GetGallery = "http://localhost:5678/api/works";
const GetCategories = "http://localhost:5678/api/categories";

let category = [];
export let workArray = [];

async function categories() {}
export async function gallery() {
    refreshGallery(".gallery");

    await fetchJSON(GetCategories)
        .then((res) => (category = res))
        .then(() => createFilter(category));

    await fetchJSON(GetGallery)
        .then((res) => (workArray = res))
        .then(() => createGallery(workArray))
        .then(() => filterResult(workArray));

    console.log("works =", workArray);
}
export async function modalReload() {
    await fetchJSON(GetGallery)
        .then((res) => (workArray = res))
        .then(() => modalGallery(workArray));
}

export async function deleteWork(element) {
    const id = this.dataset.id;
    //

    await fetchDel(id).then(() => element.target.parentElement.remove());
    await fetchJSON(GetGallery)
        .then((res) => (workArray = res))
        .then(() => del(element))
        .then(() => createGallery(workArray))
        .catch((e) => {
            console.log("err", e);
            if (e.status == "401") {
                error();
            }
        });
}

function del(element) {
    let select_X = document.querySelectorAll("#modal-works-gallery");

    for (let i in select_X) {
        let select = document.querySelectorAll(".data_selected");
        let select_2 = document.querySelectorAll(".imgWork");
        select[i].remove();
        // select_2[i].remove();
    }
}

categories();
gallery();
modalReload();

// Display & management of modal buttons

layoutModal();
