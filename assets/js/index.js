const user = {
    email: "daniel@gmail.com",
    password: "123456"
}

const email_input = getElement("#login_form .email_input");
const password_input = getElement("#login_form .password_input");

const email_error = getElement("#login_form .error_email");
const password_error = getElement("#login_form .error_password");

getElement("#login_form").addEventListener("submit", login);

/**
 * DOCU: Processes the validation for login <br>
 * Triggered by the submit event of the login_form. <br>
 * Last updated at: December 13, 2022
 * @param {object} event. Required to call the preventDefault to avoid reloading the browser.
 * @author Daniel
 */
function login(event){
    event.preventDefault();

    /** validate email */
    if(!email_input.value){
        emptyInputValidator(email_input, email_error, "Please enter your email");
    }
    else if(email_input.value !== user.email){
        emptyInputValidator(email_input, email_error, "Email not found");
    }
    else{
        removeErrorMessage(email_input, email_error);
    }

    /** validate password */
    if(!password_input.value){
        emptyInputValidator(password_input, password_error, "Please enter your password");
    }
    else if((password_input.value !== user.password) && (email_input.value === user.email)){
        emptyInputValidator(password_input, password_error, "Incorrect password");
    }
    else{
        removeErrorMessage(password_input, password_error);
    }

    if(email_input.value === user.email && password_input.value === user.password){
        location.href = "wall.html";
    }
}