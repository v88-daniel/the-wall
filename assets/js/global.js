/** function to query an element */
function getElement(selector){
    return document.querySelector(selector);
}

/** function to query multiple elements */
function getElements(selector){
    return document.querySelectorAll(selector);
}

/** function to validate empty inputs */
function emptyInputValidator(element, error_element, error_message){
    error_element.textContent = error_message;
    element.classList.add("error_input");
}

/** function to remove error messages */
function removeErrorMessage(element, error_element){
    error_element.textContent = "";
    element.classList.remove("error_input");
}