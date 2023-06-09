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

export async function gallery() {
    workArray = [];
    await Promise.all([
        fetchJSON(GetCategories).then((res) => (category = res)),
        fetchJSON(GetGallery).then((res) => (workArray = res)),
    ]);

    refreshGallery(".gallery");

    console.log("works =", workArray);
}

export async function deleteWork(element) {
    const id = this?.dataset.id;

    console.log(this.element);

    try {
        await fetchDel(id);
        del(id, ".data_selected");
        element.target.parentElement.remove();
    } catch (e) {
        if (e.status == "401") {
            error();
        }
    }
}

function del(delId, selector) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        if (element.dataset.id == delId) {
            element.remove();
        }
    }
}

export async function modalReload() {
    workArray = await fetchJSON(GetGallery);
    modalGallery(workArray);
    // refreshGallery(".gallery");
    // createGallery(workArray);
}

await gallery().then(() => show());

async function show() {
    await createFilter(category);
    await createGallery(workArray);
    await filterResult(workArray);
}

modalReload();

// Display & management of modal buttons
layoutModal();
