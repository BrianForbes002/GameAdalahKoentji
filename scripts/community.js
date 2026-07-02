document.addEventListener("DOMContentLoaded", () => {

    /* DATA USER */

    const userName = "Lyra_eather";
    const userPhoto = "icons/community/profile10.jpeg";

    /* KOMENTAR */

    const commentBoxes = document.querySelectorAll(".comment-content");

    commentBoxes.forEach(box => {

        const textarea = box.querySelector("textarea");
        const button = box.querySelector("button");

        // Klik tombol Send
        button.addEventListener("click", () => {

            const text = textarea.value.trim();

            if (text === "") {
                alert("Komentar tidak boleh kosong!");
                textarea.focus();
                return;
            }

            const comment = document.createElement("div");
            comment.className = "comment";

            comment.innerHTML = `
                <img class="post-image" src="${userPhoto}" alt="Profile">
                <div class="comment-text">
                    <strong>${userName}</strong>
                    <p>${text}</p>
                </div>
            `;

            // Tambahkan komentar
            box.insertBefore(comment, textarea);

            textarea.value = "";
            textarea.focus();

            // Tambah jumlah komentar
            const details = box.parentElement;
            const summary = details.querySelector("summary");

            const number = summary.textContent.match(/\d+/);

            if (number) {
                let total = parseInt(number[0]);
                total++;
                summary.innerHTML = `💬 ${total}`;
            }

        });

        // Enter = Send
        textarea.addEventListener("keydown", function(e){

            if(e.key === "Enter" && !e.shiftKey){

                e.preventDefault();
                button.click();

            }

        });

    });

    /* FITUR MEMBUAT POSTINGAN BARU */

    let postType = "";

    // Membuka popup
    function openPost(type){
        postType = type;
        document.getElementById("postModal").style.display="flex";
        document.getElementById("postTitle").innerHTML=
        "Create "+type.charAt(0).toUpperCase()+type.slice(1);
        const upload=document.getElementById("uploadArea");
        const input=document.getElementById("postMedia");
        const text=document.getElementById("postText");
        const info=document.getElementById("uploadText");
        input.value="";
        if(type==="picture"){
            upload.style.display="block";
            input.accept="image/*";
            text.placeholder="Write a caption...";
            info.innerHTML="Choose a picture";
        }
        else if(type==="video"){
            upload.style.display="block";
            input.accept="video/*";
            text.placeholder="Write a caption...";
            info.innerHTML="Choose a video";
        }
        else{
            upload.style.display="none";
            text.placeholder="Write your article...";
        }
    }

    // Menutup popup
    function closePost(){
        document.getElementById("postModal").style.display="none";
        document.getElementById("postText").value="";
        document.getElementById("postMedia").value="";
    }

    // Membuat postingan
    function createPost(){
        const text = document.getElementById("postText").value.trim();
        const mediaInput = document.getElementById("postMedia");
        const file = mediaInput.files[0];
        // Validasi
        if(postType === "article"){
            if(text === ""){
                alert("Please write your article first!");
                return;
            }
        }else{
            if(!file){
                alert("Please select a file first!");
                return;
            }
        }
        const feed = document.querySelector(".feed");
        const post = document.createElement("div");
        post.className = "post";
        // Header
        let mediaHTML = "";
        // ARTICLE
        if(postType === "article"){
            mediaHTML = `
                <p class="post-text">${text}</p>
            `;
        }
        // PICTURE
        else if(postType === "picture"){
            const imageURL = URL.createObjectURL(file);
            mediaHTML = `
                <p class="post-text">${text}</p>
                <img src="${imageURL}" alt="Picture">
            `;
        }
        // VIDEO
        else if(postType === "video"){
            const videoURL = URL.createObjectURL(file);
            mediaHTML = `
                <p class="post-text">${text}</p>
                <video controls style="width:100%;border-radius:12px;margin-top:10px;">
                    <source src="${videoURL}">
                </video>
            `;
        }
        post.innerHTML = `
            <div class="post-header">
                <div class="profile">
                    <img src="${userPhoto}" alt="">
                    <div>
                        <strong>${userName}</strong><br>
                        <small>${postType}</small>
                    </div>
                </div>
            </div>
            ${mediaHTML}
            <div class="post-footer">
                <span>👁 0</span>
                <span>💬 0</span>
                <span>🤍 0</span>
            </div>
        `;
        // Tambahkan ke paling atas
        const firstPost = feed.querySelector(".post");
        if(firstPost){
            feed.insertBefore(post, firstPost);
        }else{
            feed.appendChild(post);
        }
        closePost();
    }

    window.openPost = openPost;
    window.closePost = closePost;
    window.createPost = createPost;

});