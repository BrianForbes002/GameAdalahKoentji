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
        const support = document.getElementById("uploadSupport");
        input.value="";
        document.getElementById("selectedFile").textContent = "No file selected";
        if(type==="picture"){
            upload.style.display="block";
            input.accept="image/png,image/jpeg,image/jpg";
            text.placeholder="Write a caption...";
            support.innerHTML = "Supported: JPG, PNG, JPEG";
        }
        else if(type==="video"){
            upload.style.display="block";
            input.accept="video/mp4,image/gif";
            text.placeholder="Write a caption...";
            support.innerHTML = "Supported: GIF, MP4, MOV";
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
        document.getElementById("selectedFile").textContent = "No file selected";
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
            <span class="views">👁 1</span>
            <details class="comment-box">
                <summary>💬 0</summary>
                <div class="comment-content">
                    <textarea placeholder="Add a comment..."></textarea>
                    <button>Send</button>
                </div>
            </details>
            <div class="like-container">
                <button class="like-btn">🤍 0</button>
            </div>
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
        setupNewPost(post);

        // Jika artikel
        if(postType === "article"){
            savePost("");
        }

        // Jika gambar / video
        else{
            const reader = new FileReader();
            reader.onload = function(e){
                savePost(e.target.result);
            };
            reader.readAsDataURL(file);

        }

        function savePost(media){
            const newPost = {
                name:userName,
                photo:userPhoto,
                type:postType,
                text:document.getElementById("postText").value.trim(),
                media:media,
                like:0,
                comments:[],
                views:1
            };
            let posts =
            JSON.parse(localStorage.getItem("communityPosts")) || [];
            posts.unshift(newPost);
            localStorage.setItem(
                "communityPosts",
                JSON.stringify(posts)
            );
        }
    }

    function setupNewPost(post){
        const textarea = post.querySelector("textarea");
        const button = post.querySelector(".comment-content button");
        const summary = post.querySelector("summary");
        const likeBtn = post.querySelector(".like-btn");
        let totalComment = 0;
        let totalLike = 0;
        let liked = false;
        // LIKE
        likeBtn.addEventListener("click",()=>{
            liked = !liked;
            if(liked){
                totalLike++;
                likeBtn.innerHTML = `❤️ ${totalLike}`;
            }else{
                totalLike--;
                likeBtn.innerHTML = `🤍 ${totalLike}`;
            }
        });
        // KOMENTAR
        button.addEventListener("click",()=>{
            const text = textarea.value.trim();
            if(text===""){
                alert("Komentar tidak boleh kosong!");
                return;
            }
            const comment = document.createElement("div");
            comment.className = "comment";
            comment.innerHTML = `
                <img class="post-image" src="${userPhoto}">
                <div class="comment-text">
                    <strong>${userName}</strong>
                    <p>${text}</p>
                </div>
            `;
            textarea.before(comment);
            textarea.value="";
            totalComment++;
            summary.innerHTML=`💬 ${totalComment}`;
        });
        textarea.addEventListener("keydown",(e)=>{
            if(e.key==="Enter" && !e.shiftKey){
                e.preventDefault();
                button.click();
            }
        });
    }

    const mediaInput = document.getElementById("postMedia");
    const selectedFile = document.getElementById("selectedFile");

    mediaInput.addEventListener("change", function(){

        if(this.files.length > 0){
            selectedFile.textContent = this.files[0].name;
        }else{
            selectedFile.textContent = "No file selected";
        }
    });

    window.openPost = openPost;
    window.closePost = closePost;
    window.createPost = createPost;

});