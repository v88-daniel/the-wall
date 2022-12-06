const create_msg_modal = getElement(".create_msg_modal");
const confirm_delete_modal = getElement(".confirm_delete_modal");
const create_msg_input = getElement(".create_msg_modal textarea");
const post_msg_btn = getElement(".post_msg_btn");
const no_msg_prompt = getElement(".no_msg_prompt")
const msg_count = getElement(".message_count strong");
/* message/comment that needs to be deleted will be placed here.
 * will use this variable to target the element.*/
let element_to_delete = null;

/** open the modal to create a new message */
getElement(".create_msg_btn").addEventListener("click", () => create_msg_modal.closest(".modal_backdrop").classList.toggle("show"));

/** type message */
create_msg_input.addEventListener("keyup", () => validateTyping(create_msg_input, post_msg_btn));

/** post message */
create_msg_modal.addEventListener("submit", event => {
    event.preventDefault();

    if(create_msg_input.value){
        postMessage(create_msg_input, msg_count, no_msg_prompt);
        post_msg_btn.classList.add("disabled");
    }
});

/** add click event to the messages area */
document.addEventListener("click", event => {
    const clicked_element = event.target;

    /** close create_msg_form modal */
    if(clicked_element.hasAttribute("data-close")){
        clicked_element.closest("."+clicked_element.getAttribute("data-close")).classList.remove("show");
    }

    /** if edit_btn is clicked (whether on comment or message) */
    if(clicked_element.matches(".edit_btn")){
        toggleEditForm(clicked_element)
    }

    /** cancel edit */
    if(clicked_element.matches(".cancel_btn")){
        const msg_block = clicked_element.closest("."+clicked_element.getAttribute("data-cancel"));
        msg_block.querySelector("form").classList.toggle("show");
        msg_block.querySelector(".display_body").classList.toggle("hide");
    }

    /** submit edit */
    if(clicked_element.matches(".edit_msg_btn")){
        event.preventDefault();
        submitEdit(clicked_element);
    }

    /** toggle add comment form */
    if(clicked_element.matches(".comment_btn")){
        clicked_element.closest(".message_block").querySelector(".comment_form").classList.toggle("show");
    }

    /** submit comment */
    if(clicked_element.matches(".post_comment_btn")){
        event.preventDefault();
        submitComment(clicked_element);
    }

    /** if delete btn is clicked */
    if(clicked_element.matches(".delete_btn")){
        element_to_delete = clicked_element.closest("."+clicked_element.getAttribute("data-delete"));
        const title = clicked_element.getAttribute("data-to-delete");
        showConfirmDeleteModal(title);
    }

    /** confirm delete */
    if(clicked_element.matches(".remove_btn")){
        confirm_delete_modal.closest(".modal_backdrop").classList.toggle("show");

        if(element_to_delete.matches(".comment_block")){
            const parent_message_block = element_to_delete.closest(".message_block");
            element_to_delete.remove();
            updateCommentCount(parent_message_block);
        }
        else{
            element_to_delete.remove();
            updateMessageCount(msg_count, no_msg_prompt)
        }
    }
});


/** function to create a message */
function createMessage(message, msg_block_class, msg_container){
    const msg_block = getElement(msg_block_class);
    const msg_block_clone = msg_block.cloneNode(true);
    msg_block_clone.classList.add("clone");
    msg_block_clone.classList.remove("original");
    msg_block_clone.querySelector(".display_body .text").textContent = message;
    msg_container.prepend(msg_block_clone);

    const textareas = msg_block_clone.querySelectorAll("form textarea");
    textareas.forEach(textarea => {
        const post_btn = textarea.closest("form").querySelector("button[type='submit']");
        textarea.addEventListener("keyup", () => validateTyping(textarea, post_btn));
    });
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
    const msg_block = clicked_element.closest("."+clicked_element.getAttribute("data-edit"));
    const current_msg = msg_block.querySelector(".text").textContent;
    msg_block.querySelector("form textarea").value = current_msg;
    msg_block.querySelector("form").classList.toggle("show");
    msg_block.querySelector(".display_body").classList.toggle("hide");
}

/** function to submit edits */
function submitEdit(edit_msg_btn){
    const msg_block = edit_msg_btn.closest("."+edit_msg_btn.getAttribute("data-submit-edit"));
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
        createMessage(comment_textarea.value, ".comment_block", comment_container);
        comment_textarea.value = "";

        /** update comment count */
        updateCommentCount(parent_msg_block);
        submit_comment_btn.classList.add("disabled");
    }
}

/** function to post message */
function postMessage(create_msg_input, msg_count, no_msg_prompt){
    const messages_container = getElement(".messages_container");
    createMessage(create_msg_input.value, ".message_block.original", messages_container);
    create_msg_input.value = "";
    create_msg_modal.closest(".modal_backdrop").classList.toggle("show");

    updateMessageCount(msg_count, no_msg_prompt);
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

/** function to show confirm delete modal */
function showConfirmDeleteModal(title){
    confirm_delete_modal.querySelector("h2").textContent = `Confirm Delete ${title}`;
    confirm_delete_modal.querySelector("p").textContent = `Are you sure you want to remove this ${title.toLowerCase()}? This action cannot be undone.`;
    confirm_delete_modal.closest(".modal_backdrop").classList.toggle("show");
}