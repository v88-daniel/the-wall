function emptyInputValidator(element, error_element, error_msg){
    error_element.textContent = error_msg;
    element.classList.add("error_input");
}

function removeErrorMsg(element, error_element){
    error_element.textContent = "";
    element.classList.remove("error_input");
}