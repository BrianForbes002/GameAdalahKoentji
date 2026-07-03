// ================= AUDIO =================

const blackSound = new Audio("icons/regions/soundregion.mp3");
const huangSound = new Audio("icons/regions/soundregion2.mp3");
const rinaSound = new Audio("icons/regions/soundregion3.mp3");

// ================= POPUP =================

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");
const popupLevel = document.getElementById("popupLevel");
const popupBoss = document.getElementById("popupBoss");

// ================= FUNCTION =================

function stopAllSounds(){

    blackSound.pause();
    huangSound.pause();
    rinaSound.pause();

    blackSound.currentTime = 0;
    huangSound.currentTime = 0;
    rinaSound.currentTime = 0;

}

function showPopup(title, desc, level, boss, link){

    popupTitle.innerHTML = title;
    popupDesc.innerHTML = desc;
    popupLevel.innerHTML = "<b>Recommended Level :</b> " + level;
    popupBoss.innerHTML = "<b>Main Boss :</b> " + boss;

    regionLink = link;

    popup.style.display = "flex";

}

// ================= BLACK SHORES =================

document.getElementById("blackshores").onclick = function(){

    stopAllSounds();

    blackSound.play();

    showPopup(

        "Black Shores",

        "A mysterious island hidden beyond the sea. Filled with ancient ruins and dangerous Echoes.",

        "A+",

        "Crownless",
        "blackshores.html"


    );

}

// ================= HUANGLONG =================

document.getElementById("huanglong").onclick = function(){

    stopAllSounds();

    huangSound.play();

    showPopup(

        "Huanglong",

        "A prosperous nation protected by powerful Resonators and surrounded by mountains.",

        "A+",

        "Inferno Rider",
        "huanglong.html"

    );

}

// ================= RINASCITA =================

document.getElementById("rinascita").onclick = function(){

    stopAllSounds();

    rinaSound.play();

    showPopup(

        "Rinascita",

        "A beautiful coastal city famous for its elegant architecture and rich culture.",

        "A+",

        "Lorelei",
        "rinascita.html"

    );

}

// ================= CLOSE =================

document.querySelector(".close").onclick=function(){

    popup.style.display="none";

}

const closeBtn = document.getElementById("closeBtn");

if (closeBtn) {

    closeBtn.onclick = function(){

        popup.style.display = "none";

    }

}

document.getElementById("exploreBtn").onclick = function(){

    window.location.href = regionLink;

}
window.onclick=function(event){

    if(event.target==popup){

        popup.style.display="none";

    }

}



