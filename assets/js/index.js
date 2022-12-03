document.addEventListener("DOMContentLoaded", () => {
    const user = {
        email: "daniel@gmail.com",
        password: "123456"
    }

    const sign_in_form = document.querySelector(".sign_in_form");
    const email_input = document.querySelector(".sign_in_form .email_input");
    const password_input = document.querySelector(".sign_in_form .password_input");

    const email_error = document.querySelector(".sign_in_form .error_email");
    const password_error = document.querySelector(".sign_in_form .error_password");

    sign_in_form.addEventListener("submit", (event) => {
        event.preventDefault();

        /** validate email */
        if(!email_input.value){
            emptyInputValidator(email_input, email_error, "Please enter your email");
        }
        else if(email_input.value !== user.email){
            emptyInputValidator(email_input, email_error, "Email not found");
        }
        else{
            removeErrorMsg(email_input, email_error);
        }

        /** validate password */
        if(!password_input.value){
            emptyInputValidator(password_input, password_error, "Please enter your password");
        }
        else if((password_input.value !== user.password) && (email_input.value === user.email)){
            emptyInputValidator(password_input, password_error, "Incorrect password");
        }
        else{
            removeErrorMsg(password_input, password_error);
        }

        if(email_input.value === user.email && password_input.value === user.password){
            console.log("sdf")
            location.href = "wall.html"
        }
    });
});