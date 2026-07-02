document.addEventListener("DOMContentLoaded", () => {

    /* DATA USER */

    const userName = "Ayunda";
    const userPhoto = "icons/community/profile8.jpeg";

    /* SEMUA KOTAK KOMENTAR */

    const commentBoxes = document.querySelectorAll(".comment-content");

    commentBoxes.forEach(box => {

        const textarea = box.querySelector("textarea");
        const button = box.querySelector("button");

        /* KLIK TOMBOL SEND */

        button.addEventListener("click", () => {

            const text = textarea.value.trim();

            if (text === "") {
                alert("Komentar tidak boleh kosong!");
                textarea.focus();
                return;
            }

            // Buat elemen komentar baru
            const comment = document.createElement("div");
            comment.className = "comment";

            comment.innerHTML = `
                <img class="post-image" src="${userPhoto}" alt="Profile">
                <div class="comment-text">
                    <strong>${userName}</strong>
                    <p>${text}</p>
                </div>
            `;

            // Tambahkan komentar sebelum textarea
            box.insertBefore(comment, textarea);

            // Kosongkan textarea
            textarea.value = "";

            // Fokus kembali ke textarea
            textarea.focus();

            /* TAMBAH JUMLAH KOMENTAR */

            const details = box.parentElement;
            const summary = details.querySelector("summary");

            const number = summary.textContent.match(/\d+/);

            if (number) {

                let total = parseInt(number[0]);
                total++;

                summary.innerHTML = `💬 ${total}`;

            }

        });

        /* ENTER = SEND SHIFT + ENTER = BARIS BARU */

        textarea.addEventListener("keydown", function(e){

            if(e.key === "Enter" && !e.shiftKey){

                e.preventDefault();
                button.click();

            }

        });

    });

});