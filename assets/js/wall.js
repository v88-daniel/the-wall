const body = getElement("body");
const create_message_modal = getElement("#create_message_modal");
const delete_message_modal = getElement("#delete_message_modal");
const delete_comment_modal = getElement("#delete_comment_modal");
const create_message_input = getElement("#create_message_modal textarea");
const post_message_button = getElement("#post_message_button");

/* temporary variable for message/comment that needs to be deleted.*/
let text_to_delete = null;

/** open create message modal */
getElement("#create_message_button").addEventListener("click", openCreateMessageModal);

/** close create message modal */
getElements("#create_message_modal .close_modal").forEach(button => button.addEventListener("click", closeCreateMessageModal));

/** close delete confirmation modal */
getElements(".confirmation_modal .close_modal").forEach(button => button.addEventListener("click", closeConfirmationModal));

/** type message */
create_message_input.addEventListener("keyup", () => validateTyping(create_message_input, post_message_button));

/** post message */
create_message_modal.addEventListener("submit", addNewMessage);

/** adding event listener to confirm delete forms */
delete_message_modal.addEventListener("submit", deleteMessage);
delete_comment_modal.addEventListener("submit", deleteComment);

/** function to open create message modal */
function openCreateMessageModal(){
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.add("modal_open");
}

/** function to close create message modal */
function closeCreateMessageModal(){
    this.closest(".modal_backdrop").classList.remove("show");
    this.closest("#create_message_modal").querySelector("#post_message_button").classList.add("disabled")
    body.classList.remove("modal_open");
    create_message_input.value = "";
}

/** function to close create message modal */
function closeConfirmationModal(){
    this.closest(".modal_backdrop").classList.remove("show");
    body.classList.remove("modal_open");
}

/** function to post a message */
function addNewMessage(event){
    event.preventDefault();

    if(create_message_input.value){
        post_message_button.classList.add("disabled");
        const new_message = postMessage();
        const edit_form = new_message.querySelector(".edit_form");

        /**ADD EVENT LISTENERS */
        /** open edit form */
        new_message.querySelector(".toggle_edit_button").addEventListener("click", openEditForm);

        /**submit edit */
        edit_form.addEventListener("submit", submitEdit)
        
        /** close edit form */
        edit_form.querySelector(".cancel_button").addEventListener("click", closeEditForm);

        /** delete message */
        new_message.querySelector(".delete_button").addEventListener("click", openDeleteConfirmationModal);

        /** toggle comment form */
        new_message.querySelector(".comment_button").addEventListener("click", toggleCommentForm);

        /** add comment */
        new_message.querySelector(".comment_form").addEventListener("submit", submitComment);
    }
}

/** function to post message */
function postMessage(){
    const messages_container = getElement("#messages_container");
    const new_message = createMessage(create_message_input.value, ".message_block.original", messages_container);
    create_message_input.value = "";
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");

    updateMessageCount();
    body.classList.remove("modal_open");

    return new_message;
}

/** function to create a message */
function createMessage(message, message_block_class, messages_container){
    const message_block_clone = getElement(message_block_class).cloneNode(true);
    message_block_clone.classList.add("clone");
    message_block_clone.classList.remove("original");
    message_block_clone.querySelector(".display_body .text").textContent = message;
    messages_container.prepend(message_block_clone);

    /** ADD EVENT LISTENER FOR ITS 'EDIT FORM' AND 'ADD COMMENT FORM' */
    const textareas = message_block_clone.querySelectorAll("form textarea");
    textareas.forEach(textarea => {
        const post_button = textarea.closest("form").querySelector("button[type='submit']");
        textarea.addEventListener("keyup", () => validateTyping(textarea, post_button));
    });

    return message_block_clone;
}

/** function to update message count */
function updateMessageCount(){
    const messages = document.querySelectorAll(".message_block.clone");
    const no_message_prompt = getElement("#no_message_prompt");
    const message_count = getElement("#message_count strong");
    message_count.textContent = messages.length;

    if(message_count.textContent > 0){
        no_message_prompt.classList.add("hide");
    }
    else{
        no_message_prompt.classList.remove("hide");
    }
}

/** function to enable/disable form submission based on if the input is empty or not */
function validateTyping(textarea, submit_button){
    if(textarea.value.length < 1){
        submit_button.classList.add("disabled");
    }
    else{
        submit_button.classList.remove("disabled");
    }
}

/** function to open edit form */
function openEditForm(){
    const text_block = this.closest(this.getAttribute("data-edit"));
    const current_text = text_block.querySelector(".text").textContent;
    text_block.querySelector("form textarea").value = current_text;
    text_block.querySelector("form").classList.toggle("show");
    text_block.querySelector(".display_body").classList.toggle("hide");
}

/** function to close edit form */
function closeEditForm(){
    this.closest("form").classList.toggle("show");
    this.closest(this.getAttribute("data-cancel")).querySelector(".display_body").classList.toggle("hide");
}

/** function to submit edits */
function submitEdit(event){
    event.preventDefault();
    const text_block = this.closest(this.getAttribute("data-to-edit"));
    const updated_text = text_block.querySelector("form textarea").value;
    if(updated_text){
        text_block.querySelector(".text").textContent = updated_text;
        text_block.querySelector("form").classList.toggle("show");
        text_block.querySelector(".display_body").classList.toggle("hide");
    }
}

/** function to open delete confirmation modal */
function openDeleteConfirmationModal(){
    const modal = getElement(this.getAttribute("data-modal"));
    text_to_delete = this.closest(this.getAttribute("data-to-delete"));
    modal.closest(".modal_backdrop").classList.add("show");
    body.classList.add("modal_open");
}

/** function to toggle comment form */
function toggleCommentForm(){
    const message_block = this.closest(".message_block");
    message_block.querySelector(".comment_form").classList.toggle("show");
    message_block.querySelector(".comments_container").classList.toggle("show");
}

/** function to submit comment */
function submitComment(event){
    event.preventDefault();
    const message_block = this.closest(".message_block");
    const comment_textarea = this.querySelector("textarea");
    if(comment_textarea.value){
        const comments_container = message_block.querySelector(".comments_container");
        const new_comment = createMessage(comment_textarea.value, ".comment_block", comments_container);
        const edit_form = new_comment.querySelector(".edit_form");
        comment_textarea.value = "";

        /** update comment count */
        updateCommentCount(message_block);
        this.querySelector(".post_comment_button").classList.add("disabled");

        /** ADD EVENT LISTENERS */
        /** delete comment */
        new_comment.querySelector(".delete_button").addEventListener("click", openDeleteConfirmationModal);

        /** open edit form */
        new_comment.querySelector(".toggle_edit_button").addEventListener("click", openEditForm);

        /**submit edit */
        edit_form.addEventListener("submit", submitEdit);

        /** close edit form */
        edit_form.querySelector(".cancel_button").addEventListener("click", closeEditForm);
    }
}

/** function to update comment count */
function updateCommentCount(message_block){
    const comment_count = message_block.querySelector(".comment_count");
    comment_count.textContent = message_block.querySelectorAll(".comment_block").length;

    if(comment_count.textContent > 0){
        message_block.querySelector(".comment_button").classList.add("has_comment");
    }
    else{
        message_block.querySelector(".comment_button").classList.remove("has_comment");
    }
}

/** function to delete message once confirmed */
function deleteMessage(event){
    event.preventDefault();
    delete_message_modal.closest(".modal_backdrop").classList.toggle("show");
    text_to_delete.remove();
    updateMessageCount()
}

/** function to delete comment once confirmed */
function deleteComment(event){
    event.preventDefault();
    delete_comment_modal.closest(".modal_backdrop").classList.toggle("show");
    const parent_message_block = text_to_delete.closest(".message_block");
    text_to_delete.remove();
    updateCommentCount(parent_message_block);
}