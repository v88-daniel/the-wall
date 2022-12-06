/** function to query an element */
function getElement(selector){
    return document.querySelector(selector);
}

/** function to validate empty inputs */
function emptyInputValidator(element, error_element, error_msg){
    error_element.textContent = error_msg;
    element.classList.add("error_input");
}

/** function to remove error messages */
function removeErrorMsg(element, error_element){
    error_element.textContent = "";
    element.classList.remove("error_input");
}