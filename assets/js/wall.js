const body = getElement("body");
const create_message_modal = getElement("#create_message_modal");
const delete_message_modal = getElement("#delete_message_modal");
const delete_comment_modal = getElement("#delete_comment_modal");
const create_message_input = getElement("#create_message_modal textarea");
const post_message_button = getElement("#post_message_button");

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

/**
 * DOCU: Opens the modal to create message <br>
 * Triggered by the click event of the #create_message_button. <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function openCreateMessageModal(){
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.add("modal_open");
}

/**
 * DOCU: Closes the modal to create message <br>
 * Triggered by the click event of all the buttons with a .close_modal class of the #create_message_modal. <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function closeCreateMessageModal(){
    this.closest(".modal_backdrop").classList.remove("show");
    this.closest("#create_message_modal").querySelector("#post_message_button").classList.add("disabled")
    body.classList.remove("modal_open");
    create_message_input.value = "";
}

/**
 * DOCU: Closes the confirmation modal <br>
 * Triggered by the click event of all the buttons with a .close_modal class of the .confirmation_modal. <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function closeConfirmationModal(){
    this.closest(".modal_backdrop").classList.remove("show");
    this.closest("form").querySelector("input").value = "";
    body.classList.remove("modal_open");
}

/**
 * DOCU: Runs postMessage function. Also adds event listeners to all action related to the newly created message <br>
 * Triggered by the addNewMessage function. <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function addNewMessage(event){
    event.preventDefault();

    if(create_message_input.value){
        post_message_button.classList.add("disabled");
        const new_message = postMessage();
        const edit_form = new_message.querySelector(".edit_form");

        /** ADD EVENT LISTENERS */
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

/**
 * DOCU: Runs the whole process of posting a message. <br>
 * Triggered by the addNewMessage function. <br>
 * Last updated at: December 13, 2022
 * @returns {node object} A message clone
 * @author Daniel
 */
function postMessage(){
    const messages_container = getElement("#messages_container");
    const new_message = createMessage(create_message_input.value, ".message_block.original", messages_container);
    create_message_input.value = "";
    create_message_modal.closest(".modal_backdrop").classList.toggle("show");

    updateMessageCount();
    body.classList.remove("modal_open");
    
    return new_message;
}

/**
 * DOCU: Creates a clone of a message/comment node object. <br>
 * Triggered by the postMesssage and submitComment functions. <br>
 * Last updated at: December 13, 2022
 * @param {string} message Required. Text content
 * @param {string} message_block_class Required. Class to target the message to clone.
 * @param {node object} submit_button Required. Button to enable/disable
 * @returns {node object} A message clone
 * @author Daniel
 */
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

    /** ADD ID */
    message_block_clone.setAttribute("data-id", generateId());

    return message_block_clone;
}

/**
 * DOCU: Updates the current number of messages. <br>
 * Triggered by postMessage and deleteMessage functions. <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
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

/**
 * DOCU: Enables/disables a button (style only) based on the length of a given textarea's input. <br>
 * Triggered by the createMessage function and create_message_input's keyup event <br>
 * Last updated at: December 13, 2022
 * @param {node object} textarea Required. Textarea to validate
 * @param {node object} submit_button Required. Button to enable/disable
 * @author Daniel
 */
function validateTyping(textarea, submit_button){
    if(textarea.value.length < 1){
        submit_button.classList.add("disabled");
    }
    else{
        submit_button.classList.remove("disabled");
    }
}

/**
 * DOCU: Opens an edit form. <br>
 * Triggered by a toggle edit button's click event inside the addNewMessage and submitComment function <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function openEditForm(){
    const text_block = this.closest(this.getAttribute("data-edit"));
    const current_text = text_block.querySelector(".text").textContent;
    text_block.querySelector("form textarea").value = current_text;
    text_block.querySelector("form").classList.toggle("show");
    text_block.querySelector(".display_body").classList.toggle("hide");
}

/**
 * DOCU: Closes an edit form. <br>
 * Triggered by a cancel button's (edit form) click event inside the addNewMessage and submitComment function <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function closeEditForm(){
    this.closest("form").classList.toggle("show");
    this.closest(this.getAttribute("data-cancel")).querySelector(".display_body").classList.toggle("hide");
}

/**
 * DOCU: Modifies a message/comment. <br>
 * Triggered by an edit form's submit event inside the addNewMessage and submitComment function <br>
 * Last updated at: December 13, 2022
 * @param {object} event. Required to call the preventDefault method to avoid reloading the browser.
 * @author Daniel
 */
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

/**
 * DOCU: Displays a confimation modal when a delete button is clicked. <br>
 * Triggered by a delete button's click event inside the addNewMessage and submitComment function <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function openDeleteConfirmationModal(){
    const modal = getElement(this.getAttribute("data-modal"));
    modal.querySelector("input").value = this.closest("li").getAttribute("data-id");
    modal.closest(".modal_backdrop").classList.add("show");
    body.classList.add("modal_open");
}

/**
 * DOCU: Displays/hides a comment form. <br>
 * Triggered by a comment button's click event inside the addNewMessage function <br>
 * Last updated at: December 13, 2022
 * @author Daniel
 */
function toggleCommentForm(){
    const message_block = this.closest(".message_block");
    message_block.querySelector(".comment_form").classList.toggle("show");
    message_block.querySelector(".comments_container").classList.toggle("show");
}

/**
 * DOCU: Submits a comment then add event listeners to all actions related to it. <br>
 * Triggered by a comment form's submit event inside the addNewMessage function <br>
 * Last updated at: December 13, 2022
 * @param {object} event. Required to call the preventDefault method to avoid reloading the browser.
 * @author Daniel
 */
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

/**
 * DOCU: Updates the current number of comments in a given message. <br>
 * Triggered by submitComment and deleteComment functions. <br>
 * Last updated at: December 13, 2022
 * @param {node object} message_block Required. The message where the comments came from.
 * @author Daniel
 */
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

/**
 * DOCU: Deletes a message once confirmed. <br>
 * Triggered by the submit event of the delete_message_modal. <br>
 * Last updated at: December 13, 2022
 * @param {object} event. Required to call the preventDefault method to avoid reloading the browser.
 * @author Daniel
 */
function deleteMessage(event){
    event.preventDefault();
    const message_id = this.querySelector("input[name='message_id']").value;
    const messages_array = Array.from(getElements(".message_block.clone"))
    messages_array.find(message => message.getAttribute("data-id") === message_id).remove();

    delete_message_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.remove("modal_open");
    updateMessageCount()
}

/**
 * DOCU: Deletes a comment once confirmed. <br>
 * Triggered by the submit event of the delete_comment_modal. <br>
 * Last updated at: December 13, 2022
 * @param {object} event. Required to call the preventDefault method to avoid reloading the browser.
 * @author Daniel
 */
function deleteComment(event){
    event.preventDefault();
    const comment_id = this.querySelector("input[name='comment_id']").value;
    const comments_array = Array.from(getElements(".comment_block.clone"))
    const comment = comments_array.find(comment => comment.getAttribute("data-id") === comment_id);
    const parent_message = comment.closest(".message_block")
    comment.remove();

    delete_comment_modal.closest(".modal_backdrop").classList.toggle("show");
    body.classList.remove("modal_open");
    updateCommentCount(parent_message);
}

/**
 * DOCU: Generates a random id for messages and comments. <br>
 * Triggered by createMessage function. <br>
 * Last updated at: December 13, 2022
 * @returns {number} randomly generated number
 * @author Daniel
 */
function generateId(){
    return Math.floor(Math.random() * new Date().getTime());
}