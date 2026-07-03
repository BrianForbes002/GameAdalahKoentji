document.addEventListener("DOMContentLoaded",()=>{

    /* ==========================
        LIKE KOMENTAR
    ========================== */

    document.querySelectorAll(".comment-card").forEach((card,index)=>{

        const id=index+1;

        const btn=card.querySelector(".love-btn");

        const span=btn.querySelector("span");

        let total=parseInt(btn.dataset.count);

        let saved=
        JSON.parse(localStorage.getItem("commentLike"+id));

        if(saved){

            total=saved.total;

            btn.classList.add("active");

            btn.innerHTML=`❤️ <span>${total}</span>`;

        }

        btn.addEventListener("click",()=>{

            if(btn.classList.contains("active")){

                total--;

                btn.classList.remove("active");

                btn.innerHTML=`🤍 <span>${total}</span>`;

                localStorage.removeItem("commentLike"+id);

            }else{

                total++;

                btn.classList.add("active");

                btn.innerHTML=`❤️ <span>${total}</span>`;

                localStorage.setItem(
                    "commentLike"+id,
                    JSON.stringify({
                        total:total
                    })
                );

            }

        });

    });




    /* ==========================
        BALAS KOMENTAR
    ========================== */

    document.querySelectorAll(".comment-card").forEach((card,index)=>{

        const id=index+1;

        const input=
        card.querySelector(".reply-input");

        const btn=
        card.querySelector(".reply-btn");

        const list=
        card.querySelector(".reply-list");



        let replies=
        JSON.parse(
        localStorage.getItem("reply"+id))
        ||[];




        function renderReplies(){

            list.innerHTML="";

            replies.forEach((reply,i)=>{

                const div=document.createElement("div");

                div.className="reply";

                div.innerHTML=`

                    <strong>You</strong>

                    <p>${reply.text}</p>

                    <button class="reply-like">
                    ${reply.like?"❤️":"🤍"}
                    ${reply.total}
                    </button>

                    <button class="delete-reply">
                    Hapus
                    </button>

                `;

                div.querySelector(".delete-reply")
                .onclick=()=>{

                    replies.splice(i,1);

                    saveReplies();

                };

                div.querySelector(".reply-like")
                .onclick=function(){

                    if(reply.like){

                        reply.like=false;

                        reply.total--;

                    }else{

                        reply.like=true;

                        reply.total++;

                    }

                    saveReplies();

                };

                list.appendChild(div);

            });

        }



        function saveReplies(){

            localStorage.setItem(
                "reply"+id,
                JSON.stringify(replies)
            );

            renderReplies();

        }



        btn.onclick=()=>{

            if(input.value.trim()=="") return;

            replies.push({

                text:input.value,

                total:0,

                like:false

            });

            input.value="";

            saveReplies();

        };



        renderReplies();

    });

});