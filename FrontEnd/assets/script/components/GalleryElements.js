import { createElement } from "../functions/dom.js";

export function createFilter(category) {
    category = category.map((category) => category);

    const filterPoint = document.querySelector("#portfolio h2");

    const filterUl = createElement("ul", {
        class: "filterBar",
    });
    filterUl.innerHTML = `<li class="filter">Tous</li> `;
    filterPoint.append(filterUl);

    for (let i in category) {
        const filterLi = createElement("li", {
            class: "filter",
        });
        filterLi.innerText = category[i].name;
        filterUl.append(filterLi);
    }
    // retire les filtres dans edit.html
    if (window.location.pathname === "/edit.html") {
        filterUl.style.display = "none";
    }
    return category;
}
const gallery = document.querySelector(".gallery");
export function createGallery(works) {
    works?.forEach((work) => {
        galleryElements(work);
    });
}
export function galleryElements(work) {
    const figure = createElement("figure", {
        class: "data_selected",
        "data-id": work.id,
    });
    gallery.append(figure);
    figure.innerHTML = `
        <img src=${work.imageUrl} alt=${work.title}>
        <img src="./assets/icons/trash_ico.svg" alt="delete" class="delete hidden" data-id=${work.id}>
        <figcaption>${work.title}</figcaption>`;
    return figure;
}

export function filterResult(works) {
    works = works.map((works) => works);

    const filterByCategory = document.querySelectorAll(".filter");
    const gallery = document.querySelector(".gallery");

    for (let i = 0; i < filterByCategory.length; i++) {
        filterByCategory[i].addEventListener("click", function () {
            if (i !== 0) {
                let filteredGallerry = works.filter(
                    (el) => el.categoryId === i
                );
                refreshGallery(".gallery");
                createGallery(filteredGallerry);
            } else {
                refreshGallery(".gallery");
                createGallery(works);
            }
        });
    }
    return works;
}

/**
 * @param {String} selector
 */
export function refreshGallery(selector) {
    const gallery = document.querySelector(selector);
    if (gallery === null) {
        return;
    } else {
        gallery.innerHTML = "";
    }
}
