document.addEventListener("DOMContentLoaded", function(){
    const create_btn = document.querySelector(".create_msg_btn");
    const create_msg_modal = document.querySelector(".create_msg_modal");
    const close_modal = document.querySelector(".close_modal_btn");
    const create_msg_textarea = document.querySelector(".create_msg_modal textarea");
    const empty_msg_icon = document.querySelector(".no_msg");
    const msg_counter = document.querySelector(".msg_count span");
    const messages_container = document.querySelector('.messages');
    const msg_block = document.querySelector(".msg_block");
    const post_msg_btn = document.querySelector(".create_msg_modal .post_btn");
    const delete_modal = document.querySelector(".confirm_delete_modal");
    let delete_modal_title = document.querySelector(".confirm_delete_modal h2");
    let delete_modal_desc = document.querySelector(".confirm_delete_modal p");

    let msg_to_delete = undefined;

    create_msg_textarea.addEventListener("keydown", function(){
        if(create_msg_textarea.value.length > 1){
            post_msg_btn.classList.remove("disabled");
        }else{
            post_msg_btn.classList.add("disabled");
        }
    })

    msg_counter.textContent = 0;
    let msg_count = 0;

    create_btn.addEventListener("click", function(){
        create_msg_modal.classList.add("show");
        post_msg_btn.classList.add("disabled");
    })

    close_modal.addEventListener("click", function(){
        create_msg_modal.classList.remove("show");
        delete_modal.classList.remove("show");
    })

    create_msg_modal.addEventListener("submit", function(event){
        event.preventDefault();
       if(create_msg_textarea.value !== ""){
            create_msg_modal.classList.remove("show");
            empty_msg_icon.classList.add("hidden");

            const msg_block_clone = msg_block.cloneNode(true);
            msg_block_clone.classList.add("clone");
            
            msg_block_clone.children[1].children[0].textContent = create_msg_textarea.value;

            messages_container.prepend(msg_block_clone)

            create_msg_textarea.value = ""
            msg_counter.textContent = ++msg_count;

            /** delete btn */
            const delete_btn =  msg_block_clone.children[1].children[1].children[2];
            /** delete msg */
            delete_btn.addEventListener("click", function(){
                delete_modal_title.textContent = "Confirm Delete Message";
                delete_modal_desc.textContent = "Are you sure you want to remove this message? This action cannot be undone.";
                delete_modal.classList.add("show");
                msg_to_delete = msg_block_clone;
            });

            const close_modal_btn = document.querySelector(".confirm_delete_modal .close_modal_btn");
            close_modal_btn.addEventListener("click", function(){
                delete_modal.classList.remove("show");
            });

            const confirm_delete_btn = document.querySelector(".confirm_delete_modal .confirm_delete_btn");
            confirm_delete_btn.addEventListener("click", function(){
                msg_to_delete.remove();
                delete_modal.classList.remove("show");

                if(msg_to_delete == msg_block_clone){
                    msg_counter.textContent = --msg_count;
                    if(msg_count < 1){
                        empty_msg_icon.classList.remove("hidden");
                    }
                }
                
            });

            /** to edit btn */
            const edit_btn =  msg_block_clone.children[1].children[1].children[1];
            edit_btn.addEventListener("click", function(){
                const display_msg = this.parentElement.parentElement;
                const msg = this.parentElement.parentElement.children[0];
                const edit_form = this.parentElement.parentElement.parentElement.children[0];
                const edit_form_textarea = this.parentElement.parentElement.parentElement.children[0].children[0];

                edit_form.classList.add("show");
                display_msg.classList.add("hidden");
                edit_form_textarea.value = msg.textContent;
            })


            /** cancel edit button */
            const cancel_edit_btn = msg_block_clone.children[0].children[1].children[0];
            cancel_edit_btn.addEventListener("click", function(event){
                event.preventDefault();
                const edit_form = this.parentElement.parentElement;
                const display_msg = this.parentElement.parentElement.parentElement.children[1];
                edit_form.classList.remove("show")
                display_msg.classList.remove("hidden");
            });


            /** edit msg */
            const form_edit_btn = msg_block_clone.children[0].children[1].children[1];
            form_edit_btn.addEventListener("click", function(event){
                event.preventDefault();
                const new_msg = this.parentElement.parentElement.children[0].value;
                const edit_form = this.parentElement.parentElement;
                const display_msg = this.parentElement.parentElement.parentElement.children[1];
                edit_form.classList.remove("show")
                display_msg.classList.remove("hidden");

                const display_msg_body = this.parentElement.parentElement.parentElement.children[1].children[0];

                display_msg_body.textContent = new_msg;

            });

            /** open comment form */
            const add_comment_btn = msg_block_clone.children[1].children[1].children[0];
            add_comment_btn.addEventListener("click", function(){
                const comment_form = this.parentElement.parentElement.parentElement.children[2];
                comment_form.classList.add("show");
            })

            /** post comment */
            const post_comment_btn = msg_block_clone.children[2].children[1];
            post_comment_btn.addEventListener("click", function(event){
                event.preventDefault();
                const comment = this.parentElement.children[0];

                const comment_container = msg_block_clone.children[3];
                const comment_block = document.querySelector(".comment_block");
                const comment_block_clone = comment_block.cloneNode(true);
                comment_block_clone.classList.add("clone");
                comment_block_clone.children[1].children[0].textContent = comment.value;
                comment_container.prepend(comment_block_clone);
                this.parentElement.classList.remove("show");
                comment.value = "";

                /** delete comment */
                const delete_comment_btn = comment_block_clone.children[1].children[1].children[1];
                delete_comment_btn.addEventListener("click", function(){
                    delete_modal_title.textContent = "Confirm Delete Comment";
                    delete_modal_desc.textContent = "Are you sure you want to remove this comment? This action cannot be undone.";
                    delete_modal.classList.add("show");
                    msg_to_delete = comment_block_clone;
                })

                const edit_form = comment_block_clone.children[0];
                const edit_form_textarea = edit_form.children[0];
                const display_comment = comment_block_clone.children[1];
                const comment_body = display_comment.children[0];

                /** open edit comment form */
                const edit_comment_btn = comment_block_clone.children[1].children[1].children[0];
                edit_comment_btn.addEventListener("click", function(){
                    edit_form_textarea.value = comment_body.textContent;

                    edit_form.classList.add("show");
                    display_comment.classList.add("hidden");
                });

                /** cancel edit comment */
                const cancel_comment_btn = comment_block_clone.children[0].children[1].children[0];
                cancel_comment_btn.addEventListener("click", function(event){
                    event.preventDefault();
                    edit_form.classList.remove("show");
                    display_comment.classList.remove("hidden");
                });

                /** edit comment */
                const update_comment_btn = comment_block_clone.children[0].children[1].children[1];
                update_comment_btn.addEventListener("click", function(event){
                    event.preventDefault()
                    comment_body.textContent = edit_form_textarea.value;

                    edit_form.classList.remove("show");
                    display_comment.classList.remove("hidden");
                });
            })
       }
    })
})