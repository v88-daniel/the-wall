const body = getElement("body");
const create_message_modal = getElement("#create_message_modal");
const delete_message_modal = getElement(".delete_message_modal");
const confirm_delete_comment_modal = getElement(".confirm_delete_comment_modal");
const create_message_input = getElement("#create_message_modal textarea");
const post_message_button = getElement("#post_message_button");
const no_message_prompt = getElement("#no_message_prompt");
const message_count = getElement("#message_count strong");
/* message/comment that needs to be deleted will be placed here.
 * will use this variable to target the element.*/
let message_to_delete = null;

/** open the modal to create a new message */
getElement("#create_message_button").addEventListener("click", openCreateMessageModal);

/** close modal */
getElements(".close_modal").forEach(button => button.addEventListener("click", closeCreateMessageModal))

/** type message */
create_message_input.addEventListener("keyup", () => validateTyping(create_message_input, post_message_button));

/** post message */
create_message_modal.addEventListener("submit", postNewmessage);

/** adding event listener to confirm delete forms */
delete_message_modal.addEventListener("submit", deleteMessage);
confirm_delete_comment_modal.addEventListener("submit", deleteComment);


/** function to open create message modal */
function openCreateMessageModal(){
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.add("modal_open");
}

/** function to close create message modal */
function closeCreateMessageModal(){
    this.closest(".modal_backdrop").classList.remove("show");
    body.classList.remove("modal_open");
    create_message_input.value = "";
}

/** function to post a message */
function postNewmessage(event){
    event.preventDefault();

    if(create_message_input.value){
        post_message_button.classList.add("disabled");
        const new_message = postMessage(create_message_input, message_count, no_message_prompt);
        const edit_form = new_message.querySelector(".edit_form");

        /** open edit form */
        new_message.querySelector(".toggle_edit_button").addEventListener("click", openEditForm);

        /**submit edit */
        edit_form.addEventListener("submit", submitEdit)
        
        /** close edit form */
        edit_form.querySelector(".cancel_button").addEventListener("click", closeEditForm);

        /** delete message */
        new_message.querySelector(".delete_button").addEventListener("click", openDeleteConfirmationModal)

        /** toggle comment form */
        new_message.querySelector(".comment_button").addEventListener("click", toggleCommentForm);

        /** add comment */
        new_message.querySelector(".post_comment_button").addEventListener("click", submitComment)
    }
}

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
        message_block.querySelector(".comment_button").classList.add("has_comment");
    }
    else{
        message_block.querySelector(".comment_button").classList.remove("has_comment");
    }
}

/** function to update message count */
function updateMessageCount(message_count, no_message_prompt){
    const messages = document.querySelectorAll(".message_block.clone");
    message_count.textContent = messages.length;

    if(message_count.textContent > 0){
        no_message_prompt.classList.add("hide");
    }
    else{
        no_message_prompt.classList.remove("hide");
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
    const modal = getElement(this.getAttribute("data-modal"))
    message_to_delete = this.closest(this.getAttribute("data-to-delete"));
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
    const comment_form = this.closest(".comment_form");
    const comment_textarea = comment_form.querySelector("textarea");
    if(comment_textarea.value){
        const comments_container = message_block.querySelector(".comments_container");
        const new_comment = createMessage(comment_textarea.value, ".comment_block", comments_container);
        comment_textarea.value = "";

        /** update comment count */
        updateCommentCount(message_block);
        this.classList.add("disabled");

        return new_comment;
    }
}

/** function to post message */
function postMessage(create_message_input, message_count, no_message_prompt){
    const messages_container = getElement("#messages_container");
    const new_message = createMessage(create_message_input.value, ".message_block.original", messages_container);
    create_message_input.value = "";
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");

    updateMessageCount(message_count, no_message_prompt);
    body.classList.remove("modal_open");

    return new_message;
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


/** function to delete message once confirmed */
function deleteMessage(event){
    event.preventDefault();
    delete_message_modal.closest(".modal_backdrop").classList.toggle("show");
    message_to_delete.remove();
    updateMessageCount(message_count, no_message_prompt)
}

/** function to delete comment once confirmed */
function deleteComment(event){
    event.preventDefault();
    confirm_delete_comment_modal.closest(".modal_backdrop").classList.toggle("show");
    const parent_message_block = message_to_delete.closest(".message_block");
    message_to_delete.remove();
    updateCommentCount(parent_message_block);
}

/** variable name
 *  create message textarea
 *  function
 * use ul li
 * use id
 * 3pm monday: deadline
 * favicon
 */