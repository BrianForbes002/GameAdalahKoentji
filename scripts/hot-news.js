document.addEventListener("DOMContentLoaded", function () {

    var semuaCard = document.querySelectorAll(".news-card");
    var semuaLink = document.querySelectorAll(".link");
    var semuaFavorite = document.querySelectorAll(".favorite");
    var semuaFilter = document.querySelectorAll(".filter-btn");

    var tombolDarkMode = document.getElementById("darkModeBtn");
    var tombolTop = document.getElementById("topBtn");





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
            tombolDarkMode.innerText = '☀️ Light Mode';
            tombolDarkMode.classList.add('active');

        }

        else {

            localStorage.setItem("darkmode", "off");
            tombolDarkMode.innerText = '🌙 Dark Mode';
            tombolDarkMode.classList.remove('active');

        }

    });



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
                    document.getElementById("reviewSection").style.display = "none";
                    semuaCard[k].style.display = "block";
                }

                else if (kategori == "favorite") {
                    document.getElementById("reviewSection").style.display = "block";
                    var fav = semuaCard[k].querySelector(".favorite");
                    var id = fav.getAttribute("data-id");
                    var data = localStorage.getItem("favorite") || "";
                    if (data.indexOf(id + ",") != -1) {
                        semuaCard[k].style.display = "block";
                    }
                    else {
                        semuaCard[k].style.display = "none";
                    }
                }

                else if (semuaCard[k].classList.contains(kategori)) {
                    document.getElementById("reviewSection").style.display = "none";
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


/* =====================================
   COMMUNITY REVIEW
===================================== */

var currentNews="newcharacter";

var reviewData = {

newcharacter:[
{
nama:"Maxwel",
komentar:"Wooow, Virex is incredibly powerful! I love this new character.",
default:true
},
{
nama:"Andrew",
komentar:"Lookk, Besttt update so far!",
default:true
},
{
nama:"Nadheline",
komentar:"Finallyyyy Georgio and Georgia have arrived.",
default:true
},
{
nama:"Yemima",
komentar:"Whatttt i seee Georgio and Georgia so cool.",
default:true
}
],

weapon:[
{
nama:"Kenzi",
komentar:"The newwwww weapon looks amazing.",
default:true
},
{
nama:"Nhadeen",
komentar:"Its stats are reallyyy strong.",
default:true
},
{
nama:"Grace",
komentar:"I likeee ittt.",
default:true
},
{
nama:"Yosafat",
komentar:"So coollll.",
default:true
}
],

double:[
{
nama:"Tapasya",
komentar:"Double rewards are always worth farminggg.",
default:true
}
],


frozen:[
{
nama:"Shintya",
komentar:"This event gives lotssss of Astrites.",
default:true
},
{
nama:"Hanzel",
komentar:"Woow Sooo Ext.",
default:true
}
],


maintenance:[
{
nama:"Virhly",
komentar:"Maintenance finished fasterrr than expected.",
default:true
},
{
nama:"Kezia",
komentar:"What i seeee, Maintenance so fastttt.",
default:true
}
]

};

function loadReviews(){

    var data = localStorage.getItem("communityReview");

    if(data){

        var saved = JSON.parse(data);

        for(var key in saved){

            if(reviewData[key]){

                reviewData[key] =
                    reviewData[key].concat(saved[key]);

            }

        }

    }

}

function saveReviews(){

    localStorage.setItem(

        "communityReview",

        JSON.stringify(reviewData)

    );

}

loadReviews();
function renderReviews(){

    var tbody=document.getElementById("reviewTable");

    tbody.innerHTML="";

    if(!reviewData[currentNews]){

        reviewData[currentNews]=[];

    }

    reviewData[currentNews].forEach(function(item,index){

    var tombol = "-";

    if(item.default != true){

        tombol = "<button class='delete-btn' onclick='hapusReview(" + index + ")'>Delete</button>";

    }

    tbody.innerHTML +=

    "<tr>" +

    "<td>" + (index + 1) + "</td>" +

    "<td>" + item.nama + "</td>" +

    "<td>" + item.komentar + "</td>" +

    "<td>" + tombol + "</td>" +

    "</tr>";

});

}

renderReviews();



document.querySelectorAll(".news-item").forEach(function(item){

    item.addEventListener("click",function(){

        document.querySelectorAll(".news-item")

        .forEach(function(x){

            x.classList.remove("active");

        });

        item.classList.add("active");

        currentNews=item.dataset.news;

        document.getElementById("reviewTitle").innerHTML=item.innerHTML;

        renderReviews();

    });

});



document.getElementById("reviewForm")

.addEventListener("submit",function(e){

    e.preventDefault();

    var nama=document.getElementById("reviewName").value;

    var komentar=document.getElementById("reviewComment").value;

    if(!reviewData[currentNews]){

        reviewData[currentNews]=[];

    }

    reviewData[currentNews].push({

    nama:nama,

    komentar:komentar,

    default:false

});

    saveReviews();

    renderReviews();

    this.reset();

});



function hapusReview(index){

    if(reviewData[currentNews][index].default == true){

        alert("Default reviews cannot be deleted.");

        return;

    }

    reviewData[currentNews].splice(index,1);

    saveReviews();

    renderReviews();

}