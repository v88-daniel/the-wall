document.addEventListener("DOMContentLoaded", () => {

    const messages_container = document.querySelector(".messages_container");
    const create_msg_form = document.querySelector(".create_msg_modal");
    const create_msg_input = document.querySelector(".create_msg_modal textarea");
    const no_msg_prompt = document.querySelector(".no_msg_prompt")
    const msg_count = document.querySelector(".message_count strong");
    msg_count.textContent = 0;

    /** open the modal to create a new message */
    const create_msg_modal = document.querySelector(".create_msg_modal");
    const create_msg_btn = document.querySelector(".create_msg_btn");
    create_msg_btn.addEventListener("click", () => {
        create_msg_modal.classList.toggle("show");
    });

    /** close the modal through x button */
    const close_modal_btn = document.querySelector(".close_modal_btn");
    close_modal_btn.addEventListener("click", function(){
        closeModal(this, ".create_msg_modal");
        create_msg_input.value = "";
    });

    /** close the modal through cancel button */
    const cancel_modal_btn = document.querySelector(".create_msg_modal .cancel_btn");
    cancel_modal_btn.addEventListener("click", function(){
        closeModal(this, ".create_msg_modal");
        create_msg_input.value = "";
    });

    /** type message */
    const post_msg_btn = document.querySelector(".post_msg_btn");
    create_msg_input.addEventListener("keyup", function(){
        if(create_msg_input.value.length < 1){
            post_msg_btn.classList.add("disabled");
        }else{
            post_msg_btn.classList.remove("disabled");
        }
    });

    /** delete message */
    messages_container.addEventListener("click", event => {
        const clicked_event = event.target;

        if(clicked_event.matches(".delete_btn")){
            if(clicked_event.closest(".comment_block")){
                const comment_count = clicked_event.closest(".message_block").querySelector(".comment_count");
                comment_count.textContent = --comment_count.textContent;
                if(comment_count.textContent < 1){
                    clicked_event.closest(".message_block").querySelector(".comment_btn").classList.remove("has_comment");
                }
                clicked_event.closest(".comment_block").remove();
            }else{
                clicked_event.closest(".message_block").remove();
                msg_count.textContent = --msg_count.textContent;
                if(msg_count.textContent < 1){
                    no_msg_prompt.classList.remove("hide");
                }
            }
        }
    });

    /** post message */
    create_msg_form.addEventListener("submit", (event) => {
        event.preventDefault();

        if(create_msg_input.value){
            const new_message = createMessage(create_msg_input.value, ".message_body", ".message_block", ".messages_container");
            create_msg_input.value = "";
            create_msg_modal.classList.toggle("show");

            msg_count.textContent = ++msg_count.textContent;
            no_msg_prompt.classList.add("hide");

            /** toggle edit message */
            const toggle_edit_btn = new_message.querySelector(".edit_btn");
            toggle_edit_btn.addEventListener("click", function(){
                const msg_block = this.closest(".message_block");
                const current_msg = msg_block.querySelector(".message_body").textContent;
                msg_block.querySelector(".edit_msg_form textarea").value = current_msg;
                toggleEditMessageForm(this, ".message_block", ".edit_msg_form", ".display_msg");
            })

            /** cancel edit message */
            const cancel_btn = new_message.querySelector(".cancel_btn");
            cancel_btn.addEventListener("click", function(){
                toggleEditMessageForm(this, ".message_block", ".edit_msg_form", ".display_msg");
            })

            /** submit edited message */
            const edit_btn = new_message.querySelector(".edit_msg_form .edit_msg_btn");
            edit_btn.addEventListener("click", function(event){
                event.preventDefault();
                const msg_block = this.closest(".message_block");
                const updated_message = msg_block.querySelector(".edit_msg_form textarea").value;
                msg_block.querySelector(".display_msg .message_body").textContent = updated_message;

                toggleEditMessageForm(this, ".message_block", ".edit_msg_form", ".display_msg");
            })

            /** toggle add comment form */
            const toggle_comment_btn = new_message.querySelector(".comment_btn");
            toggle_comment_btn.addEventListener("click", function(){
                this.closest(".message_block").querySelector(".comment_form").classList.toggle("show");
            });

            /** submit comment */
            const post_comment_btn = new_message.querySelector(".post_comment_btn");
            post_comment_btn.addEventListener("click", function(event){
                event.preventDefault();
                const comment_form = this.closest(".comment_form");
                const comment_textarea = comment_form.querySelector("textarea");
                const new_comment = createMessage(comment_textarea.value, ".comment_body", ".comment_block", ".comments");
                comment_textarea.value = "";
                comment_form.classList.toggle("show");

                /** update comment count */
                const comment_count = new_message.querySelector(".comment_count");
                comment_count.textContent = ++comment_count.textContent;
                new_message.querySelector(".comment_btn").classList.add("has_comment");

                /** toggle edit message */
                const toggle_edit_btn = new_comment.querySelector(".edit_btn");
                toggle_edit_btn.addEventListener("click", function(){
                    const comment_block = this.closest(".comment_block");
                    const current_comment = comment_block.querySelector(".comment_body").textContent;
                    comment_block.querySelector(".edit_comment_form textarea").value = current_comment;
                    toggleEditMessageForm(this, ".comment_block", ".edit_comment_form", ".display_comment");
                })

                /** cancel edit message */
                const cancel_btn = new_comment.querySelector(".cancel_btn");
                cancel_btn.addEventListener("click", function(){
                    toggleEditMessageForm(this, ".comment_block", ".edit_comment_form", ".display_comment");
                })

                /** submit edited message */
                const edit_btn = new_comment.querySelector(".edit_comment_form .edit_msg_btn");
                edit_btn.addEventListener("click", function(event){
                    event.preventDefault();
                    const comment_block = this.closest(".comment_block");
                    const updated_comment = comment_block.querySelector(".edit_comment_form textarea").value;
                    comment_block.querySelector(".display_comment .comment_body").textContent = updated_comment;
                    toggleEditMessageForm(this, ".comment_block", ".edit_comment_form", ".display_comment");
                })
            })
        }
    });
});

/** function to create a message */
function createMessage(message, msg_element_class, msg_block_class, msg_container_class){
    const messages_container = document.querySelector(msg_container_class);
    const msg_block = document.querySelector(msg_block_class);
    const msg_block_clone = msg_block.cloneNode(true);
    msg_block_clone.classList.add("clone");
    msg_block_clone.querySelector(msg_element_class).textContent = message;
    messages_container.prepend(msg_block_clone);

    return msg_block_clone;
}

/** function to close modal */
function closeModal(button, modal_class){
    const modal = button.closest(modal_class);
    modal.classList.remove("show");
}

/** function to toggle edit form */
function toggleEditMessageForm(button, message_element_class, form_class, text_display_class){
    const msg_block = button.closest(message_element_class);
    msg_block.querySelector(form_class).classList.toggle("show");
    msg_block.querySelector(text_display_class).classList.toggle("hide");
}