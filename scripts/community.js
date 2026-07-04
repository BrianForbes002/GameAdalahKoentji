document.addEventListener("DOMContentLoaded", () => {
    const userName = "Lyra_eather";
    const userPhoto = "icons/community/profile10.jpeg";
    const commentBoxes = document.querySelectorAll(".comment-content");

    commentBoxes.forEach(box => {
        const textarea = box.querySelector("textarea");
        const button = box.querySelector("button");

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

            box.insertBefore(comment, textarea);
            textarea.value = "";
            textarea.focus();

            const details = box.parentElement;
            const summary = details.querySelector("summary");
            const number = summary.textContent.match(/\d+/);

            if (number) {
                let total = parseInt(number[0]);
                total++;
                summary.innerHTML = `💬 ${total}`;
            }
        });

        textarea.addEventListener("keydown", function(e){
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault();
                button.click();
            }
        });
    });

    let postType = "";

    function openPost(type){
        postType = type;
        document.getElementById("postModal").style.display="flex";
        document.getElementById("postTitle").innerHTML="Create "+type.charAt(0).toUpperCase()+type.slice(1);
        
        const upload = document.getElementById("uploadArea");
        const input = document.getElementById("postMedia");
        const text = document.getElementById("postText");
        const support = document.getElementById("uploadSupport");
        
        input.value = "";
        document.getElementById("selectedFile").textContent = "No file selected";
        
        if(type === "picture"){
            upload.style.display="block";
            input.accept="image/png,image/jpeg,image/jpg";
            text.placeholder="Write a caption...";
            support.innerHTML = "Supported: JPG, PNG, JPEG";
        }
        else if(type === "video"){
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

    function closePost(){
        document.getElementById("postModal").style.display="none";
        document.getElementById("postText").value="";
        document.getElementById("postMedia").value="";
        document.getElementById("selectedFile").textContent = "No file selected";
    }

    function createPost(){
        const text = document.getElementById("postText").value.trim();
        const mediaInput = document.getElementById("postMedia");
        const file = mediaInput.files[0];

        if(postType === "article"){
            if(text === ""){
                alert("Please write your article first!");
                return;
            }
            renderAndSavePost(text, "");
        } else {
            if(!file){
                alert("Please select a file first!");
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e){
                renderAndSavePost(text, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function renderAndSavePost(text, mediaURL) {
        const feed = document.querySelector(".feed");
        const post = document.createElement("div");
        post.className = "post";
        
        let mediaHTML = "";
        if(postType === "article"){
            mediaHTML = `<p class="post-text">${text}</p>`;
        }
        else if(postType === "picture"){
            mediaHTML = `
                <p class="post-text">${text}</p>
                <img src="${mediaURL}" alt="Picture">
            `;
        }
        else if(postType === "video"){
            mediaHTML = `
                <p class="post-text">${text}</p>
                <video controls style="width:100%;border-radius:12px;margin-top:10px;">
                    <source src="${mediaURL}">
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

        const firstPost = feed.querySelector(".post");
        if(firstPost){
            feed.insertBefore(post, firstPost);
        } else {
            feed.appendChild(post);
        }
        
        closePost();

        const newPost = {
            id: Date.now(),
            name: userName,
            photo: userPhoto,
            type: postType,
            text: text,
            media: mediaURL,
            like: 0,
            comments: [],
            views: 1
        };

        let posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
        posts.unshift(newPost);
        localStorage.setItem("communityPosts", JSON.stringify(posts));

        setupNewPost(post, newPost.id, 0, 0);
    }

    function loadPosts() {
        let posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
        const feed = document.querySelector(".feed");
        const firstHardcodedPost = feed.querySelector(".post");

        posts.forEach(data => {
            const post = document.createElement("div");
            post.className = "post";
            
            let mediaHTML = "";
            if(data.type === "article"){
                mediaHTML = `<p class="post-text">${data.text}</p>`;
            } else if(data.type === "picture"){
                mediaHTML = `<p class="post-text">${data.text}</p><img src="${data.media}" alt="Picture">`;
            } else if(data.type === "video"){
                mediaHTML = `<p class="post-text">${data.text}</p><video controls style="width:100%;border-radius:12px;margin-top:10px;"><source src="${data.media}"></video>`;
            }

            post.innerHTML = `
            <div class="post-header">
                <div class="profile">
                    <img src="${data.photo}" alt="">
                    <div>
                        <strong>${data.name}</strong><br>
                        <small>${data.type}</small>
                    </div>
                </div>
            </div>
            ${mediaHTML}
            <div class="post-footer">
                <span class="views">👁 ${data.views}</span>
                <details class="comment-box">
                    <summary>💬 ${data.comments.length}</summary>
                    <div class="comment-content">
                        ${data.comments.map(c => `
                            <div class="comment">
                                <img class="post-image" src="${c.photo}">
                                <div class="comment-text">
                                    <strong>${c.name}</strong>
                                    <p>${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                        <textarea placeholder="Add a comment..."></textarea>
                        <button>Send</button>
                    </div>
                </details>
                <div class="like-container">
                    <button class="like-btn">${data.like > 0 ? '❤️ ' + data.like : '🤍 ' + data.like}</button>
                </div>
            </div>
            `;

            if (firstHardcodedPost) {
                feed.insertBefore(post, firstHardcodedPost);
            } else {
                feed.appendChild(post);
            }
            
            setupNewPost(post, data.id, data.like, data.comments.length);
        });
    }

    function setupNewPost(post, postId = null, initialLike = 0, initialComment = 0){
        const textarea = post.querySelector("textarea");
        const button = post.querySelector(".comment-content button");
        const summary = post.querySelector("summary");
        const likeBtn = post.querySelector(".like-btn");
        
        let totalComment = initialComment;
        let totalLike = initialLike;
        let liked = initialLike > 0;
        
        likeBtn.addEventListener("click", () => {
            liked = !liked;
            if(liked){
                totalLike++;
                likeBtn.innerHTML = `❤️ ${totalLike}`;
            }else{
                totalLike--;
                likeBtn.innerHTML = `🤍 ${totalLike}`;
            }
            updatePostData(postId, 'like', totalLike);
        });
        
        button.addEventListener("click", () => {
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
            
            if (postId) {
                let posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
                let postIndex = posts.findIndex(p => p.id === postId);
                if (postIndex > -1) {
                    posts[postIndex].comments.push({ name: userName, photo: userPhoto, text: text });
                    localStorage.setItem("communityPosts", JSON.stringify(posts));
                }
            }
        });
        
        textarea.addEventListener("keydown", (e) => {
            if(e.key==="Enter" && !e.shiftKey){
                e.preventDefault();
                button.click();
            }
        });
    }

    function updatePostData(postId, key, value) {
        if (!postId) return;
        let posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
        let postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex > -1) {
            posts[postIndex][key] = value;
            localStorage.setItem("communityPosts", JSON.stringify(posts));
        }
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

    loadPosts();

    window.openPost = openPost;
    window.closePost = closePost;
    window.createPost = createPost;
});