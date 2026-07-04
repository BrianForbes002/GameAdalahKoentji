let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

let isAnimating = false;

function slide(direction) {
    if (isAnimating) return;
    isAnimating = true;

    let activeSection = document.querySelector('section.active');
    let character = activeSection.querySelector('.character');
    let items = activeSection.querySelectorAll('.characterList');

    let step = 185;
    if (items[0]) {
        const cs = getComputedStyle(items[0]);
        step = items[0].getBoundingClientRect().width
            + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    }
    let distance = direction === 'next' ? -step : step;

    character.style.transition = "transform 0.5s ease";
    character.style.transform = "translateX(" + distance + "px)";

    function handler(e) {
        if (e.target !== character || e.propertyName !== 'transform') return;

        character.removeEventListener('transitionend', handler);

        if (direction === 'next') {
            character.appendChild(items[0]);
        } else {
            character.prepend(items[items.length - 1]);
        }

        character.style.transition = "none";
        character.style.transform = "translateX(0)";

        isAnimating = false;
    }

    character.addEventListener('transitionend', handler);
}

function detailNav(direction) {
    const cont = document.querySelector('section.active .character');
    if (!cont) return;
    const cards = Array.from(cont.children);
    if (cards.length < 2) return;
    const target = direction === 'next' ? cards[1] : cards[cards.length - 1];
    openCharDetail(target);
}

next.addEventListener('click', () =>
    document.body.classList.contains('detail-mode') ? detailNav('next') : slide('next'));
prev.addEventListener('click', () =>
    document.body.classList.contains('detail-mode') ? detailNav('prev') : slide('prev'));

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

regions.forEach(function (region) {
    region.addEventListener('click', function () {
        let target = region.dataset.target;

        if (!target) return;

        closeCharDetail();

        regions.forEach(function (r) {
            r.classList.remove('active');
        });

        let sections = document.querySelectorAll('section');
        sections.forEach(function (section) {
            section.classList.remove('active');
        });

        let targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        document.querySelectorAll('.region[data-target="' + target + '"]').forEach(function (r) {
            r.classList.add('active');
        });

        updateButtons(target);
    });
});

let activeSection = document.querySelector('section.active');
updateButtons(activeSection.id);

const charDetail = document.getElementById('charDetail');
const charDetailImg = document.getElementById('charDetailImg');
const charDetailName = document.getElementById('charDetailName');
const charDetailQuote = document.getElementById('charDetailQuote');
const charDetailDesc = document.getElementById('charDetailDesc');
const charDetailToggle = document.getElementById('charDetailToggle');
const charDetailArt = document.querySelector('.char-detail-art');
const charDetailBg = document.getElementById('charDetailBg');

const characterData = {
    "Rover": {
        img:  "",
        img2: "",
        bg:   "icons/resonators/rover-bg.png",
        quote: "Is this the beginning of a new journey? Brimming with novel sounds, and untold stories...",
        desc:  "Awakened with an unknown past, Rover embarks on a journey to uncover the truths. As secrets are unveiled, Rover establishes deeper connections with the world."
    },

    "Qiuyuan": {
        img:  "icons/resonators/qiuyuan1.png",
        img2: "icons/resonators/qiuyuan2.png",
        bg:   "icons/resonators/bg-qy.png",
        quote: "Every mountain stands as a trial. Pass this one, and you are free to take your own path.",
        desc:  "A swordsman of cool resilience and absolute integrity, wandering Huanglong alone. He seeks not fame nor high office, but mastery of swordsmanship and a life guided by high morals."
    },
    "Lumi": {
        img:  "",
        img2: "icons/resonators/lumi1.png",
        bg:   "icons/resonators/lumi-bg.png",
        quote: "Lumi is here! Ready to light up the dark!",
        desc:  "A cheerful and energetic girl who brings light wherever she goes. Her radiant smile is as warm as the sunshine itself."
    },
    "Youhu": {
        img:  "",
        img2: "icons/resonators/youhu1.png",
        bg:   "icons/resonators/youhu-bg.png",
        quote: "Treasure found! Let's see what we have here.",
        desc:  "An enthusiastic antique appraiser from Huanglong. She has a sharp eye for artifacts and a lively personality."
    },
    "Xiangli Yao": {
        img:  "icons/resonators/xiangliyao1.png",
        img2: "icons/resonators/xiangliyao2.png",
        bg:   "icons/resonators/xiangliyao-bg.png",
        quote: "Reconfiguration! Let logic dictate the outcome.",
        desc:  "A genius researcher at the Huaxu Academy. He perceives the world through a lens of rational analysis and unwavering curiosity."
    },
    "Zhezhi": {
        img:  "icons/resonators/zhezhi1.png",
        img2: "icons/resonators/zhezhi2.png",
        bg:   "icons/resonators/zhezhi-bg.png",
        quote: "What I wanted to say is, the sunlight on you right now is so beautiful. Can I... paint you?",
        desc:  "Zhezhi is a commissioned painter, quiet and shy with a dedication to her craft. She's not very eloquent, but her persistence and love for painting speak volumes."
    },
    "Changli": {
        img:  "icons/resonators/changli1.png",
        img2: "icons/resonators/changli2.png",
        bg:   "icons/resonators/changli-bg.png",
        quote: "Be reduced to cinders... The flames of rebirth await.",
        desc:  "Counselor to the Jinzhou Magistrate. She directs her focus to the infinite possibilities in the grand scheme of things."
    },
    "Jinhsi": {
        img:  "icons/resonators/jinhsi1.png",
        img2: "icons/resonators/jinhsi2.png",
        bg:   "icons/resonators/jinhsi-bg.png",
        quote: "We have a course yet to be accomplished. Rest assured, I'll lead the way.",
        desc:  "Being the Magistrate of Jinzhou, Jinhsi bears her noble and weighty share of duties. Through repeated ages, the Lament has preyed upon mankind's vulnerable hope. Yet, grasping the nettle, she strives with all her might to forge a path toward tomorrow."
    },
    "Yinlin": {
        img:  "icons/resonators/yinlin1.png",
        img2: "icons/resonators/yinlin2.png",
        bg:   "icons/resonators/yinlin-bg.png",
        quote: "Let me show you a real performance.",
        desc:  "A former Patroller of the Public Security Bureau. She is a natural-born investigator who is exceptionally skilled at discovering hidden truths."
    },
    "Jiyan": {
        img:  "icons/resonators/jiyan1.png",
        img2: "icons/resonators/jiyan2.png",
        bg:   "icons/resonators/jiyan-bg.png",
        quote: "The wind carries the whispers of the fallen. None shall whisper!",
        desc:  "General of the Midnight Rangers. Righteous, resolute, and caring, he leads the forces to defend the borders against the Discord."
    },
    "Lingyang": {
        img:  "icons/resonators/lingyang1.png",
        img2: "icons/resonators/lingyang2.png",
        bg:   "icons/resonators/lingyang-bg.png",
        quote: "This is... my curtain call! Time for the high-pole moves!",
        desc:  "A talented Liondancer in Jinzhou. He possesses a warm heart and an unwavering dedication to preserving the traditional arts of his troupe."
    },
    "Verina": {
        img:  "icons/resonators/verina1.png",
        img2: "icons/resonators/verina2.png",
        bg:   "icons/resonators/verina-bg.png",
        quote: "I want to protect everyone, just like how the stars protect the night sky.",
        desc:  "A timid but determined botanist. Verina uses her knowledge of plants to heal and protect her allies."
    },
    "Jianxin": {
        img:  "icons/resonators/jianxin1.png",
        img2: "icons/resonators/jianxin2.png",
        bg:   "icons/resonators/jianxin-bg.png",
        quote: "Calm your mind and center your qi. Let the energy flow naturally.",
        desc:  "A Taoist monk dedicated to the mastery of martial arts. She constantly seeks spiritual growth and physical perfection."
    },
    "Taoqi": {
        img:  "",
        img2: "icons/resonators/taoqi1.png",
        bg:   "icons/resonators/taoqi-bg.png",
        quote: "This is my ground! Attack is the best defense!",
        desc:  "The Director of the Ministry of Development in Jinzhou. Reliable and sturdy, she acts as the unbreakable shield for her people."
    },
    "Yuanwu": {
        img:  "",
        img2: "icons/resonators/yuanwu1.png",
        bg:   "icons/resonators/yuanwu-bg.png",
        quote: "Stay grounded. Let the earth be your strength.",
        desc:  "The owner of a boxing gym in Jinzhou. He combines his mastery of martial arts with thunderous power to protect what matters."
    },
    "Danjin": {
        img:  "",
        img2: "icons/resonators/danjin1.png",
        bg:   "icons/resonators/danjin-bg.png",
        quote: "Eradicate... I will clear the obstacles for you.",
        desc:  "A ranger who travels the world, holding the concept of justice in high regard. She eliminates bandits and thieves wherever she goes."
    },
    "Mortefi": {
        img:  "",
        img2: "icons/resonators/mortefi1.png",
        bg:   "icons/resonators/mortefi-bg.png",
        quote: "This will be your final resting place. A fiery end!",
        desc:  "An expert in Applied Tacetite Studies at the Huaxu Academy. His fiery temper is as explosive as his research."
    },
    "Sanhua": {
        img:  "",
        img2: "icons/resonators/sanhua1.png",
        bg:   "icons/resonators/sanhua-bg.png",
        quote: "I will clear the obstacles for you. Frost, descend.",
        desc:  "A loyal bodyguard serving the Magistrate of Jinzhou. Beneath her cold exterior lies a fiercely protective heart."
    },
    "Baizhi": {
        img:  "",
        img2: "icons/resonators/baizhi1.png",
        bg:   "icons/resonators/baizhi-bg.png",
        quote: "Everything has a cost. The truth will be revealed.",
        desc:  "A researcher from the Huaxu Academy. Her pursuit of knowledge often leads her into dangerous and uncharted territories."
    },
    "Chixia": {
        img:  "",
        img2: "icons/resonators/chixia1.png",
        bg:   "icons/resonators/chixia-bg.png",
        quote: "I'll reduce them to ashes! Leave it to the hero!",
        desc:  "A fiery Patroller of Jinzhou. She burns with an unyielding passion to help others and eradicate evil in her city."
    },
    "Yangyang": {
        img:  "",
        img2: "icons/resonators/yangyang1.png",
        bg:   "icons/resonators/yangyang-bg.png",
        quote: "Like wind flowing at your side. I will protect this peace.",
        desc:  "An Outrider of the Midnight Rangers. Gentle yet resilient, she offers solace to her allies while striking her enemies like a howling gale."
    },

    "Bulling": {
        img:  "",
        img2: "icons/resonators/bulling1.png",
        bg:   "icons/resonators/bulling-bg.png",
        quote: "Let the shadows conceal our path.",
        desc:  "An operative operating in the deep shadows of the Black Shores, tasked with gathering intel beyond the reach of normal factions."
    },
    "Galbrena": {
        img:  "icons/resonators/galbrena1.png",
        img2: "icons/resonators/galbrena2.png",
        bg:   "icons/resonators/galbrena-bg.png",
        quote: "Every tide brings a new secret to the shore.",
        desc:  "A solitary wanderer bound to the Black Shores. Her resonance with the ocean's depths makes her a formidable force."
    },
    "Camellya": {
        img:  "icons/resonators/camellya1.png",
        img2: "icons/resonators/camellya2.png",
        bg:   "icons/resonators/camellya-bg.png",
        quote: "Uh-uh! You're quite the interesting one, aren't you?",
        desc:  "An enigmatic Resonator affiliated with the Black Shores. She wanders the world following her own whims and unpredictable desires."
    },
    "The Shorekeeper": {
        img:  "icons/resonators/theshorekeeper1.png",
        img2: "icons/resonators/theshorekeeper2.png",
        bg:   "icons/resonators/theshorekeeper-bg.png",
        quote: "I am certain now. It must be love. Echoes of the Past, ordained.",
        desc:  "The mysterious administrator of the Black Shores. She orchestrates the ebb and flow of planetary tides, preserving the world's underlying order."
    },
    "Encore": {
        img:  "icons/resonators/encore1.png",
        img2: "icons/resonators/encore2.png",
        bg:   "icons/resonators/encore-bg.png",
        quote: "You're in for it now! Cosmos, destroy!",
        desc:  "A consultant from the Black Shores. Armed with her wooly companions Cosmos and Cloudy, she approaches the world with vibrant childlike innocence."
    },
    "Aalto": {
        img:  "",
        img2: "icons/resonators/aalto1.png",
        bg:   "icons/resonators/aalto-bg.png",
        quote: "Now you see me, now you don't! The stage is set.",
        desc:  "An elusive Information Broker affiliated with the Black Shores. He is always one step ahead, cloaked in mist and mystery."
    },

    "Cartethyia": {
        img:  "icons/resonators/cartethyia1.png",
        img2: "icons/resonators/cartethyia2.png",
        bg:   "icons/resonators/cartethyia-bg.png",
        quote: "We weave our destiny through the threads of Rinascita.",
        desc:  "A prominent figure in Ragunna, manipulating strings from behind the curtains to ensure her faction's survival."
    },
    "Ciaccona": {
        img:  "icons/resonators/ciaccona1.png",
        img2: "icons/resonators/ciaccona2.png",
        bg:   "icons/resonators/ciaccona-bg.png",
        quote: "A dance of blades is the finest performance.",
        desc:  "A virtuoso of combat within the Troupe of Fools, treating every battle as a grand theatrical display."
    },
    "Zani": {
        img:  "icons/resonators/zani1.png",
        img2: "icons/resonators/zani2.png",
        bg:   "icons/resonators/zani-bg.png",
        quote: "Quiet now. The hunt is about to begin.",
        desc:  "A silent stalker affiliated with Ragunna's underground, striking with lethal precision."
    },
    "Cantarella": {
        img:  "icons/resonators/cantarella1.png",
        img2: "icons/resonators/cantarella2.png",
        bg:   "icons/resonators/cantarella-bg.png",
        quote: "A touch of poison makes the sweetest wine.",
        desc:  "An alluring yet deadly Resonator whose charm masks her highly toxic Forte abilities."
    },
    "Brant": {
        img:  "icons/resonators/brant1.png",
        img2: "icons/resonators/brant2.png",
        bg:   "icons/resonators/brant-bg.png",
        quote: "On stage, I slip into countless roles, donning new masks to breathe life into every story.",
        desc:  "The captain of Rinascita's Troupe of Fools. He is a free spirit and romantic. Unpredictable and full of life, he is the beating heart of the troupe."
    },
    "Phoebe": {
        img:  "icons/resonators/phoebe1.png",
        img2: "icons/resonators/phoebe2.png",
        bg:   "icons/resonators/phoebe-bg.png",
        quote: "My prayers, like the light I carry, will offer comfort and peace to all.",
        desc:  "Acolyte of the Order of the Deep, she is a young woman of quiet devotion. With a kind heart, she fulfills her duties with unwavering diligence."
    },
    "Roccia": {
        img:  "icons/resonators/roccia1.png",
        img2: "icons/resonators/roccia2.png",
        bg:   "icons/resonators/roccia-bg.png",
        quote: "Unbreakable as the mountains, unyielding as stone.",
        desc:  "A vanguard of Ragunna, acting as an immovable shield for those who cannot protect themselves."
    },
    "Carlotta": {
        img:  "icons/resonators/carlotta1.png",
        img2: "icons/resonators/carlotta2.png",
        bg:   "icons/resonators/carlotta-bg.png",
        quote: "The blooming of a gem, the taking of a life—In my own name, I reshape reality.",
        desc:  "The second daughter of Montelli and an art investor unbound by convention, Carlotta moves seamlessly through social circles and business transactions while quietly handling the family's unspeakable troubles in secret."
    },

    "Iuno": {
        img:  "icons/resonators/iuno1.png",
        img2: "icons/resonators/iuno2.png",
        bg:   "icons/resonators/iuno-bg.png",
        quote: "The peaks hold memories older than mankind.",
        desc:  "A guardian of the high altitudes, preserving the ancient relics hidden within Septimont's icy grasp."
    },
    "Augusta": {
        img:  "icons/resonators/augusta1.png",
        img2: "icons/resonators/augusta2.png",
        bg:   "icons/resonators/augusta-bg.png",
        quote: "Rule with a firm hand, and the frost will yield.",
        desc:  "A stern commander overseeing the Septimont borders, ensuring no threat descends upon the plains."
    },
    "Lupa": {
        img:  "icons/resonators/lupa1.png",
        img2: "icons/resonators/lupa2.png",
        bg:   "icons/resonators/lupa-bg.png",
        quote: "The pack survives because we hunt together.",
        desc:  "A feral Resonator with ties to the wilderness, leading her forces with animalistic instinct."
    },

    "Luuk Herssen": {
        img:  "icons/resonators/luukherssen1.png",
        img2: "icons/resonators/luukherssen2.png",
        bg:   "icons/resonators/luukherssen-bg.png",
        quote: "Knowledge is a flame that must never be extinguished.",
        desc:  "A brilliant scholar dedicated to unraveling the deepest mysteries of resonance phenomena at the academy."
    },
    "Aemeath": {
        img:  "icons/resonators/aemeath1.png",
        img2: "icons/resonators/aemeath2.png",
        bg:   "icons/resonators/aemeath-bg.png",
        quote: "The stars align to show us the way.",
        desc:  "An astrological researcher whose calculations often predict the movement of Tacet Discords."
    },
    "Lynae": {
        img:  "icons/resonators/lynae1.png",
        img2: "icons/resonators/lynae2.png",
        bg:   "icons/resonators/lynae-bg.png",
        quote: "Let the light of inquiry pierce the darkness.",
        desc:  "An energetic student at Startorch Academy, always eager to test her explosive theories on the battlefield."
    },
    "Chisa": {
        img:  "icons/resonators/chisa1.png",
        img2: "icons/resonators/chisa2.png",
        bg:   "icons/resonators/chisa-bg.png",
        quote: "Precision is key. One wrong variable, and boom.",
        desc:  "A meticulous engineer tasked with developing experimental weaponry for the Midnight Rangers."
    },

    "Mornye": {
        img:  "icons/resonators/mornye1.png",
        img2: "icons/resonators/mornye2.png",
        bg:   "icons/resonators/mornye-bg.png",
        quote: "Beyond the sky, there lies a sea of undiscovered stars.",
        desc:  "A visionary explorer charting unknown territories and expanding humanity's reach beyond the known borders."
    },

    "Sigrika": {
        img:  "icons/resonators/sigrika1.png",
        img2: "icons/resonators/sigrika2.png",
        bg:   "icons/resonators/sigrika-bg.png",
        quote: "The spirits of the wild guide our spears.",
        desc:  "A fierce warrior of the Roya Tribe, fiercely protective of her ancestral lands and traditions."
    },

    "Phrolova": {
        img:  "icons/resonators/phrolova1.png",
        img2: "icons/resonators/phrolova2.png",
        bg:   "icons/resonators/phrolova-bg.png",
        quote: "The world is but a shattered reflection. Let me show you the beauty in its brokenness.",
        desc:  "An enigmatic Overseer of the Fractsidus. Phrolova wields a delicate but deadly power, observing the world's descent into chaos with chilling elegance."
    },

    "Calcharo": {
        img:  "icons/resonators/calcharo1.png",
        img2: "icons/resonators/calcharo2.png",
        bg:   "icons/resonators/calcharo-bg.png",
        quote: "Target confirmed. They'll make an offer we like. I'll make sure of it.",
        desc:  "Leader of the \"Ghost Hounds\", an international mercenary group. Ruthless, vengeful, unforgiving. A potential client must be mindful of the price to pay before making him an offer."
    },
};

const defaultQuote = "Ready to resonate.";

let charImages = [];
let imgStyles = []; 
let imgBgs = [];   
let charImageIndex = 0;

function setArtBg(url) {
    if (!charDetailBg) return;
    if (url) {
        charDetailBg.style.backgroundImage = 'url("' + url + '")';
        charDetailBg.classList.add('show');
    } else {
        charDetailBg.classList.remove('show');
    }
}

function openCharDetail(card) {
    const cardImg = card.querySelector('img');
    const nameEl = card.querySelector('p');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const preset = characterData[name] || {};

    let img1 = card.dataset.splash  || preset.img  || '';
    let img2 = card.dataset.splash2 || preset.img2 || '';

    let imgFallback = card.dataset.fallback || preset.fallback || ''; 
    const bgAsset = card.dataset.bg || preset.bg || '';
    
    const quote = card.dataset.quote  || preset.quote || defaultQuote;
    const desc  = card.dataset.desc   || preset.desc  || '';

    charImages = [];
    imgStyles = [];
    imgBgs = [];

    if (img1 !== '') { 
        charImages.push(img1); 
        imgStyles.push('');
        imgBgs.push(bgAsset); 
    }

    if (img2 !== '') { 
        charImages.push(img2); 
        imgStyles.push('alt');
        imgBgs.push(bgAsset); 
    }

    if (charImages.length === 0) {
        if (imgFallback !== '') {
            charImages.push(imgFallback);
            imgStyles.push('alt'); 
            imgBgs.push(bgAsset); 
        } else {
            const tallImg = card.querySelector('.img-tall');
            const fallbackHtml = (tallImg && tallImg.getAttribute('src')) || (cardImg ? cardImg.getAttribute('src') : '');
            if (fallbackHtml) {
                charImages.push(fallbackHtml);
                imgStyles.push('fallback'); 
                imgBgs.push(bgAsset || ''); 
            }
        }
    }

    charImageIndex = 0;
    charDetailImg.classList.remove('swapping');
    charDetailImg.src = charImages[0] || '';
    charDetailImg.alt = name;

    charDetailArt.classList.remove('alt', 'fallback');
    if (imgStyles[0] === 'alt') {
        charDetailArt.classList.add('alt');
    } else if (imgStyles[0] === 'fallback') {
        charDetailArt.classList.add('fallback');
    }
    
    setArtBg(imgBgs[0]);
    charDetail.classList.toggle('bg-alt', imgStyles[0] === 'alt' || imgStyles[0] === 'fallback');

    charDetailName.textContent = name;
    charDetailQuote.textContent = quote;
    charDetailDesc.textContent = desc;
    charDetailDesc.style.display = desc ? 'block' : 'none';

    charDetailToggle.classList.toggle('show', charImages.length > 1);

    const characterContainer = card.parentElement;
    const items = Array.from(characterContainer.children);
    const clickedIndex = items.indexOf(card);
    
    for (let i = 0; i < clickedIndex; i++) {
        characterContainer.appendChild(characterContainer.firstElementChild);
    }
    
    characterContainer.style.transition = "none";
    characterContainer.style.transform = "translateX(0)";

    document.querySelectorAll('.characterList').forEach(c => c.classList.remove('active-card'));
    card.classList.add('active-card');

    document.body.classList.add('detail-mode');
    charDetail.classList.add('active');
    updateDetailArrows();
}

function updateDetailArrows() {
    const cont = document.querySelector('section.active .character');
    const count = cont ? cont.children.length : 0;
    const show = count > 1;
    if (next) next.style.display = show ? '' : 'none';
    if (prev) prev.style.display = show ? '' : 'none';
}

function closeCharDetail() {
    charDetail.classList.remove('active');
    document.body.classList.remove('detail-mode');
    document.querySelectorAll('.characterList').forEach(c => c.classList.remove('active-card'));
    if (next) next.style.display = '';
    if (prev) prev.style.display = '';
}

function toggleCharImage() {
    if (charImages.length < 2) return;
    charImageIndex = (charImageIndex + 1) % charImages.length;

    charDetailImg.classList.add('swapping');
    setTimeout(function () {
        charDetailImg.src = charImages[charImageIndex];
        charDetailImg.classList.remove('swapping');

        if (imgStyles[charImageIndex] === 'alt') {
            charDetailArt.classList.add('alt');
        } else {
            charDetailArt.classList.remove('alt');
        }
            setArtBg(imgBgs[charImageIndex]);
            charDetail.classList.toggle('bg-alt', imgStyles[charImageIndex] === 'alt' || imgStyles[charImageIndex] === 'fallback');
    }, 200);
}

document.querySelectorAll('.characterList').forEach(function (card) {
    card.addEventListener('click', function () {
        openCharDetail(card);
    });
});

if (charDetail) {
    charDetail.addEventListener('click', function (e) {
        if (e.target === charDetail) closeCharDetail();
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCharDetail();
});