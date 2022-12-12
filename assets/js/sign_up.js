const email_input = getElement("#sign_up_form .email_input");
const password_input = getElement("#sign_up_form .password_input");
const confirm_password_input = getElement("#sign_up_form .cpassword_input");

const email_error = getElement("#sign_up_form .error_email");
const password_error = getElement("#sign_up_form .error_password");
const confirm_password_error = getElement("#sign_up_form .error_cpassword");

getElement("#sign_up_form").addEventListener("submit", signUp);


function signUp(event){
    event.preventDefault();

    /** validate email */
    if(!email_input.value){
        emptyInputValidator(email_input, email_error, "Please enter your email");
    }
    else{
        removeErrorMsg(email_input, email_error);
    }

    /** validate password */
    if(!password_input.value){
        emptyInputValidator(password_input, password_error, "Please enter your password");
    }
    else{
        removeErrorMsg(password_input, password_error);
    }

    /** validate confirm password */
    if(!confirm_password_input.value && password_input.value){
        emptyInputValidator(confirm_password_input, confirm_password_error, "Please confirm your password");
    }
    else if(confirm_password_input.value !== password_input.value){
        emptyInputValidator(confirm_password_input, confirm_password_error, "Entered passwords doesn't match");
    }
    else{
        removeErrorMsg(confirm_password_input, confirm_password_error);
    }

    if(email_input.value && password_input.value && confirm_password_input.value && (password_input.value === confirm_password_input.value)){
        location.href = "wall.html";
    }
}