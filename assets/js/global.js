/**
 * DOCU: Queries a single element from the DOM. <br>
 * Triggered on all .js files. <br>
 * Last updated at: December 13, 2022
 * @param {string} selector. A css selector.
 * @returns {node object} The queried node object
 * @author Daniel
 */
function getElement(selector){
    return document.querySelector(selector);
}

/**
 * DOCU: Queries multiple elements from the DOM. <br>
 * Triggered on all .js files. <br>
 * Last updated at: December 13, 2022
 * @param {string} selector. A css selector.
 * @returns {node object} The queried node objects
 * @author Daniel
 */
function getElements(selector){
    return document.querySelectorAll(selector);
}

/**
 * DOCU: Displays an error message for empty inputs. <br>
 * Triggered on sign_up.js and login.js. <br>
 * Last updated at: December 13, 2022
 * @param {node object} element. An input element.
 * @param {node object} error_element. A node element to display an error message.
 * @param {string} error_message. A string containing the given error message.
 * @author Daniel
 */
function emptyInputValidator(element, error_element, error_message){
    error_element.textContent = error_message;
    element.classList.add("error_input");
}

/**
 * DOCU: Removes an error message. <br>
 * Triggered on sign_up.js and login.js. <br>
 * Last updated at: December 13, 2022
 * @param {node object} element. An input element.
 * @param {node object} error_element. A node element to display an error message.
 * @author Daniel
 */
function removeErrorMessage(element, error_element){
    error_element.textContent = "";
    element.classList.remove("error_input");
}