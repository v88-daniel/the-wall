document.addEventListener("DOMContentLoaded", function(){
    let user = {
        email: "daniel@gmail.com",
        password: "123456"
    }
    
    const sign_in_form = document.querySelector(".sign_in_form");

    sign_in_form.addEventListener("submit", function(event){
        event.preventDefault();

        const email_input = document.querySelector(".sign_in_form .email_input");
        const password_input = document.querySelector(".sign_in_form .password_input");

        const email_input_err = document.querySelector(".sign_in_form .email_err_msg");
        const password_input_err = document.querySelector(".sign_in_form .password_err_msg");
        
        if(email_input.value === user.email && password_input.value === user.password){
            window.location.href = "file:///C:/Users/Majesca/Desktop/the_wall/views/wall.html";
        }
        
        if(email_input.value === ""){
            showEmailError("Please enter your email");
        }
        else if(email_input.value != user.email){
            showEmailError("Incorrect email");
        }else{
            email_input.classList.remove("error");
            email_input_err.classList.remove("show");
        }

        if(password_input.value === ""){
            showPasswordError("Please enter your password");
        }
        else if(password_input.value !== user.password){
            showPasswordError("Incorrect password")
        }else{
            password_input.classList.remove("error");
            password_input_err.classList.remove("show");
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
        
    })

})