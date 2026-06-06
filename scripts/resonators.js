let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

next.addEventListener('click', function(){
    let activeSection = document.querySelector('section.active');
    let character = activeSection.querySelector('.character');
    let items = activeSection.querySelectorAll('.characterList');
    character.style.transition = "transform 0.5s ease";
    character.style.transform = "translateX(-185px)";
    character.addEventListener('transitionend', function(){
        character.appendChild(items[0]);
        character.style.transition = "none";
        character.style.transform = "translateX(0)";
    }, { once:true });
});

prev.addEventListener('click', function(){
    let activeSection = document.querySelector('section.active');
    let character = activeSection.querySelector('.character');
    let items = activeSection.querySelectorAll('.characterList');
    character.style.transition = "transform 0.5s ease";
    character.style.transform = "translateX(185px)";
    character.addEventListener('transitionend', function(){
        character.prepend(items[items.length - 1]);
        character.style.transition = "none";
        character.style.transform = "translateX(0)";
    }, { once:true });
});

let regions = document.querySelectorAll('.region');
let button = document.querySelector('.buttons');

function updateButtons(target) {
    let activeSection = document.getElementById(target);
    let mask = activeSection.querySelector('.character-wrapper');
    if (
        target === 'unknown' ||
        target === 'septimont' ||
        target === 'spacetrek-collective' ||
        target === 'the-roya-tribe' ||
        target === 'the-fractsidus' ||
        target === 'other'
    ) {
        button.style.display = 'none';
        mask.classList.remove('active');
    } else {
        button.style.display = 'flex';
        mask.classList.add('active');
    }
}

regions.forEach(function(region){
    region.addEventListener('click', function(){
        regions.forEach(function(r){
            r.classList.remove('active');
        });
        let target = region.dataset.target;
        let sections = document.querySelectorAll('section');
        sections.forEach(function(section){
            section.classList.remove('active');
        });
        document.getElementById(target).classList.add('active');
        region.classList.add('active');
        updateButtons(target);
    });
});

let activeSection = document.querySelector('section.active');
updateButtons(activeSection.id);