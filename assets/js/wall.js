const body = getElement("body");
const create_msg_modal = getElement(".create_msg_modal");
const confirm_delete_message_modal = getElement(".confirm_delete_message_modal");
const confirm_delete_comment_modal = getElement(".confirm_delete_comment_modal");
const create_msg_input = getElement(".create_msg_modal textarea");
const post_msg_btn = getElement(".post_msg_btn");
const no_msg_prompt = getElement(".no_msg_prompt")
const msg_count = getElement(".message_count strong");
/* message/comment that needs to be deleted will be placed here.
 * will use this variable to target the element.*/
let message_to_delete = null;

/** open the modal to create a new message */
getElement(".create_msg_btn").addEventListener("click", () => {
    create_msg_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.add("modal_open");
});

/** type message */
create_msg_input.addEventListener("keyup", () => validateTyping(create_msg_input, post_msg_btn));

/** post message */
create_msg_modal.addEventListener("submit", event => {
    event.preventDefault();

    if(create_msg_input.value){
        const new_message = postMessage(create_msg_input, msg_count, no_msg_prompt);
        post_msg_btn.classList.add("disabled");

        /** adding event listener to its edit form */
        const edit_msg_form = new_message.querySelector(".edit_form");
        addEventListenerForEdit(edit_msg_form);

        /** adding event listener to its add comment form */
        new_message.querySelector(".comment_form").addEventListener("submit", function(event){
            event.preventDefault();
            const submit_comment_btn = this.querySelector(".post_comment_btn");
            const new_comment = submitComment(submit_comment_btn);

            /** adding event listener to its edit form */
            const edit_comment_form = new_comment.querySelector(".edit_form");
            addEventListenerForEdit(edit_comment_form);
        })
    }
});

/** adding event listener to confirm delete forms */
confirm_delete_message_modal.addEventListener("submit", deleteMessage);
confirm_delete_comment_modal.addEventListener("submit", deleteComment);

/** add click event to the messages area */
document.addEventListener("click", event => {
    const clicked_element = event.target;

    /** close create_msg_form modal */
    if(clicked_element.hasAttribute("data-close")){
        clicked_element.closest("."+clicked_element.getAttribute("data-close")).classList.remove("show");
        body.classList.remove("modal_open");
    }

    /** if edit_btn is clicked (whether on comment or message) */
    if(clicked_element.matches(".edit_btn")){
        toggleEditForm(clicked_element)
    }

    /** cancel edit */
    if(clicked_element.hasAttribute("data-cancel")){
        const msg_block = clicked_element.closest("."+clicked_element.getAttribute("data-cancel"));
        msg_block.querySelector(".edit_form").classList.toggle("show");
        msg_block.querySelector(".display_body").classList.toggle("hide");
    }

    /** toggle add comment form */
    if(clicked_element.matches(".comment_btn")){
        clicked_element.closest(".message_block").querySelector(".comment_form").classList.toggle("show");
    }

    /** if delete btn is clicked */
    if(clicked_element.matches(".delete_btn")){
        message_to_delete = clicked_element.closest(clicked_element.getAttribute("data-delete"));
        const confirm_modal = clicked_element.getAttribute("data-modal-selector");
        getElement(confirm_modal).closest(".modal_backdrop").classList.toggle("show");
        body.classList.add("modal_open");
    }
});


/** function to create a message */
function createMessage(message, msg_block_class, msg_container){
    const msg_block_clone = getElement(msg_block_class).cloneNode(true);
    msg_block_clone.classList.add("clone");
    msg_block_clone.classList.remove("original");
    msg_block_clone.querySelector(".display_body .text").textContent = message;
    msg_container.prepend(msg_block_clone);

    const textareas = msg_block_clone.querySelectorAll("form textarea");
    textareas.forEach(textarea => {
        const post_btn = textarea.closest("form").querySelector("button[type='submit']");
        textarea.addEventListener("keyup", () => validateTyping(textarea, post_btn));
    });

    return msg_block_clone;
}

/** function to update comment count */
function updateCommentCount(message_block){
    const comment_count = message_block.querySelector(".comment_count");
    comment_count.textContent = message_block.querySelectorAll(".comment_block").length;

    if(comment_count.textContent > 0){
        message_block.querySelector(".comment_btn").classList.add("has_comment");
    }
    else{
        message_block.querySelector(".comment_btn").classList.remove("has_comment");
    }
}

/** function to update message count */
function updateMessageCount(msg_count, no_msg_prompt){
    const messages = document.querySelectorAll(".message_block.clone");
    msg_count.textContent = messages.length;

    if(msg_count.textContent > 0){
        no_msg_prompt.classList.add("hide");
    }
    else{
        no_msg_prompt.classList.remove("hide");
    }
}

/** function to open edit form */
function toggleEditForm(clicked_element){
    const msg_block = clicked_element.closest(clicked_element.getAttribute("data-edit"));
    const current_msg = msg_block.querySelector(".text").textContent;
    msg_block.querySelector("form textarea").value = current_msg;
    msg_block.querySelector("form").classList.toggle("show");
    msg_block.querySelector(".display_body").classList.toggle("hide");
}

/** function to submit edits */
function submitEdit(edit_msg_btn){
    const msg_block = edit_msg_btn.closest(edit_msg_btn.getAttribute("data-submit-edit"));
    const updated_text = msg_block.querySelector("form textarea").value;
    if(updated_text){
        msg_block.querySelector(".text").textContent = updated_text;
        msg_block.querySelector("form").classList.toggle("show");
        msg_block.querySelector(".display_body").classList.toggle("hide");
    }
}

/** function to submit comment */
function submitComment(submit_comment_btn){
    const parent_msg_block = submit_comment_btn.closest(".message_block");
    const comment_form = submit_comment_btn.closest(".comment_form");
    const comment_textarea = comment_form.querySelector("textarea");
    if(comment_textarea.value){
        const comment_container = parent_msg_block.querySelector(".comments");
        const new_comment = createMessage(comment_textarea.value, ".comment_block", comment_container);
        comment_textarea.value = "";

        /** update comment count */
        updateCommentCount(parent_msg_block);
        submit_comment_btn.classList.add("disabled");

        return new_comment;
    }
}

/** function to post message */
function postMessage(create_msg_input, msg_count, no_msg_prompt){
    const messages_container = getElement(".messages_container");
    const new_message = createMessage(create_msg_input.value, ".message_block.original", messages_container);
    create_msg_input.value = "";
    create_msg_modal.closest(".modal_backdrop").classList.toggle("show");

    updateMessageCount(msg_count, no_msg_prompt);
    body.classList.remove("modal_open");

    return new_message;
}

/** function to enable/disable form submission based on if the input is empty or not */
function validateTyping(textarea, submit_btn){
    if(textarea.value.length < 1){
        submit_btn.classList.add("disabled");
    }
    else{
        submit_btn.classList.remove("disabled");
    }
}

/** function to add edit functionality to edit forms */
function addEventListenerForEdit(edit_form){
    edit_form.addEventListener("submit", function(event){
        event.preventDefault();
        const edit_btn = this.querySelector(".edit_msg_btn");
        submitEdit(edit_btn);
    });
}

/** function to delete message once confirmed */
function deleteMessage(event){
    event.preventDefault();
    confirm_delete_message_modal.closest(".modal_backdrop").classList.toggle("show");
    message_to_delete.remove();
    updateMessageCount(msg_count, no_msg_prompt)
}

/** function to delete comment once confirmed */
function deleteComment(event){
    event.preventDefault();
    confirm_delete_comment_modal.closest(".modal_backdrop").classList.toggle("show");
    const parent_message_block = message_to_delete.closest(".message_block");
    message_to_delete.remove();
    updateCommentCount(parent_message_block);
}