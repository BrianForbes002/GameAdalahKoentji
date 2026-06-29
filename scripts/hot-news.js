// ==========================================
// HOT NEWS JAVASCRIPT
// Dibuat sesuai materi JavaScript Dasar
// ==========================================

// Menunggu seluruh halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // Mengambil seluruh elemen yang diperlukan
    // =====================================

    var semuaCard = document.querySelectorAll(".news-card");
    var semuaLink = document.querySelectorAll(".link");
    var semuaFavorite = document.querySelectorAll(".favorite");
    var semuaFilter = document.querySelectorAll(".filter-btn");

    var tombolDarkMode = document.getElementById("darkModeBtn");
    var tombolTop = document.getElementById("topBtn");






    // =====================================
    // HOVER MENAMPILKAN TANGGAL
    // =====================================

    for (var i = 0; i < semuaCard.length; i++) {

        semuaCard[i].addEventListener("mouseenter", function () {

            var tanggal = this.querySelector(".date");

            tanggal.style.color = "#00d4ff";
            tanggal.style.fontWeight = "bold";

            if (tanggal.innerHTML.indexOf("Published : ") == -1) {

                tanggal.innerHTML = "Published : " + tanggal.innerHTML;

            }

        });



        semuaCard[i].addEventListener("mouseleave", function () {

            var tanggal = this.querySelector(".date");

            tanggal.style.color = "";
            tanggal.style.fontWeight = "";

            tanggal.innerHTML =
                tanggal.innerHTML.replace("Published : ", "");

        });

    }



    // =====================================
    // SHOW MORE / SHOW LESS
    // =====================================

    for (var i = 0; i < semuaCard.length; i++) {

        var daftarP = semuaCard[i].querySelectorAll("p");

        if (daftarP.length >= 3) {

            daftarP[2].classList.add("short-text");

        }

    }



    for (var i = 0; i < semuaLink.length; i++) {

        semuaLink[i].addEventListener("click", function (e) {

            e.preventDefault();

            var card = this.parentElement;

            var daftarP = card.querySelectorAll("p");

            var deskripsi = daftarP[2];



            if (deskripsi.classList.contains("short-text")) {

                deskripsi.classList.remove("short-text");

                this.innerHTML = "Show Less";

            }

            else {

                deskripsi.classList.add("short-text");

                this.innerHTML = "Read More";

            }

        });

    }



    // =====================================
    // FILTER BERITA
    // =====================================

    for (var i = 0; i < semuaFilter.length; i++) {

        semuaFilter[i].addEventListener("click", function () {

            for (var j = 0; j < semuaFilter.length; j++) {

                semuaFilter[j].classList.remove("active-filter");

            }

            this.classList.add("active-filter");

            var kategori =
                this.getAttribute("data-filter");
                for (var k = 0; k < semuaCard.length; k++) {

                if (kategori == "all") {

                    semuaCard[k].style.display = "block";

                }

                else if (semuaCard[k].classList.contains(kategori)) {

                    semuaCard[k].style.display = "block";

                }

                else {

                    semuaCard[k].style.display = "none";

                }

            }

        });

    }



    // =====================================
    // BADGE NEW
    // =====================================

    var badge = document.querySelector(".badge-new");

    if (badge != null) {

        badge.innerHTML = "🔥 NEW";

    }



    // =====================================
    // DARK MODE
    // =====================================

    if (localStorage.getItem("darkmode") == "on") {

        document.body.classList.add("dark-mode");

    }



    tombolDarkMode.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");



        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("darkmode", "on");

        }

        else {

            localStorage.setItem("darkmode", "off");

        }

    });



    // =====================================
    // FAVORITE
    // =====================================

    var dataFavorite = localStorage.getItem("favorite");



    if (dataFavorite == null) {

        dataFavorite = "";

    }



    for (var i = 0; i < semuaFavorite.length; i++) {

        var id = semuaFavorite[i].getAttribute("data-id");



        if (dataFavorite.indexOf(id) != -1) {

            semuaFavorite[i].classList.add("active");

            semuaFavorite[i].innerHTML = "❤ Favorite";

        }



        semuaFavorite[i].addEventListener("click", function () {

            var id = this.getAttribute("data-id");

            var data = localStorage.getItem("favorite");



            if (data == null) {

                data = "";

            }



            if (this.classList.contains("active")) {

                this.classList.remove("active");

                this.innerHTML = "♡ Favorite";



                data = data.replace(id + ",", "");

            }

            else {

                this.classList.add("active");

                this.innerHTML = "❤ Favorite";



                data = data + id + ",";

            }



            localStorage.setItem("favorite", data);

        });

    }
    // =====================================
    // BACK TO TOP
    // =====================================

    window.addEventListener("scroll", function () {

        if (window.scrollY > 300) {

            tombolTop.style.display = "block";

        }

        else {

            tombolTop.style.display = "none";

        }

    });



    tombolTop.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"
            

        });

    });



    // =====================================
    // SELESAI
    // =====================================

});

// ==============================
// READ MORE
// ==============================

var tombolRead = document.querySelectorAll(".read-btn");

tombolRead.forEach(function(btn){

    btn.addEventListener("click", function(){

        var card = btn.parentElement;

        var teksTambahan = card.querySelector(".extra-text");

        var detail = card.querySelector(".detail-link");

        if(teksTambahan.style.display === "block"){

            teksTambahan.style.display = "none";

            detail.style.display = "none";

            btn.innerHTML = "Read More";

        }

        else{

            teksTambahan.style.display = "block";

            detail.style.display = "inline-block";

            btn.innerHTML = "Show Less";

        }

    });

});



