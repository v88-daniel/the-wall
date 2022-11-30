document.addEventListener("DOMContentLoaded", function(){

    const sign_up_form = document.querySelector(".sign_up_form");
    const email_input = document.querySelector(".sign_up_form .email_input");
    const password_input = document.querySelector(".sign_up_form .password_input");
    const cpassword_input = document.querySelector(".sign_up_form .cpassword_input");

    const email_input_err = document.querySelector(".sign_up_form .email_err_msg");
    const password_input_err = document.querySelector(".sign_up_form .password_err_msg");
    const cpassword_input_err = document.querySelector(".sign_up_form .cpassword_err_msg");


    sign_up_form.addEventListener("submit", function(event){
        event.preventDefault();
        if(email_input.value && password_input.value && cpassword_input.value && (password_input.value == cpassword_input.value)){
            window.location.href = "file:///C:/Users/Majesca/Desktop/the_wall/views/wall.html";
        }

        if(email_input.value === ""){
            showEmailError("Please enter your email");
        }
        else{
            email_input.classList.remove("error");
            email_input_err.classList.remove("show");
        }

        if(password_input.value === ""){
            showPasswordError("Please enter your password");
        }
        else{
            password_input.classList.remove("error");
            password_input_err.classList.remove("show");
        }

        if(cpassword_input.value === ""){
            showCPasswordError("Please confirm your password");
        }
        else if(cpassword_input.value !== password_input.value){
            showCPasswordError("Entered passwords doesn't match");
        }
        else{
            cpassword_input.classList.remove("error");
            cpassword_input_err.classList.remove("show");
        }

        function showEmailError(err_msg){
            email_input.classList.add("error");
            email_input_err.classList.add("show");
            email_input_err.textContent = err_msg
        }
    
        function showPasswordError(err_msg){
            password_input.classList.add("error");
            password_input_err.classList.add("show");
            password_input_err.textContent = err_msg
        }

        function showCPasswordError(err_msg){
            cpassword_input.classList.add("error");
            cpassword_input_err.classList.add("show");
            cpassword_input_err.textContent = err_msg
        }
    })
})