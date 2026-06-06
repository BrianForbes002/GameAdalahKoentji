const menus = document.querySelectorAll('.menu');
menus.forEach(menu=>{
    if(menu.href === window.location.href){
        menu.classList.add('active');
    }
});

const audio = new Audio('music/A Small Miracle (Full Ver.) _ Aemeath Theme Song _ Wuthering Waves 3.1 OST [7diPtEM_AKk].mp3');
audio.loop = true;
const logos = document.querySelectorAll('.music-logos');
let isPlaying = false;
function playMusic() {
    if (isPlaying) {
        logos.forEach(logo =>{
            logo.classList.add('paused');
        })
        audio.pause();
        isPlaying = false;
    } else {
        logos.forEach(logo =>{
            logo.classList.remove('paused');
        })
        audio.play();
        isPlaying = true;
    }
}

const login = document.querySelector('.login-page');
function loginForm() {
    login.classList.add('active');   
}

function closeLoginForm() {
    login.classList.remove('active')
}