/**
 * @param {String} tagName
 * @param {Object} attributes
 * @return {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);
    for (const [attribute, value] of Object.entries(attributes)) {
        if (value !== null) {
            element.setAttribute(attribute, value);
        }
    }
    return element;
}

/**
 *
 * @param {string} message
 * @returns {HTMLElement}
 */
export function alertElement(message) {
    const alertElement = createElement("div", {
        class: "alert alert-danger m-2",
        role: "alert",
    });

    const info = createElement("div", {});
    info.innerText = message;
    alertElement.append(info);
    const button = createElement("button", {});
    button.innerHTML = `&#x2716`;
    alertElement.append(button);

    document.body.prepend(alertElement);

    const end = document.querySelector("button");
    end.addEventListener("click", (e) => {
        e.preventDefault();
        alertElement.remove();
        alertElement.dispatchEvent(new CustomEvent("close"));
    });

    return alertElement;
}
