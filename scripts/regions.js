function makeAreas(regionNumber, count) {
    const areas = [];
    for (let i = 1; i <= count; i++) {
        const code = "r" + regionNumber + "c" + i;
        areas.push({
            name: code,
            image: "icons/regions/" + code + ".jpg",
            desc: "Short description for " + code + ". Replace this text with your own."
        });
    }
    return areas;
}

const regions = [
    {
        name: "Lahai-Roi",
        image: "icons/regions/r1.jpg",
        areas: [
            { name: "Somnoire: Night City", image: "icons/regions/r1c1.jpg", desc: "Born of a fevered hallucination, this bustling concrete jungle is shrouded in eternal night, revealing a completely different cityscape.\nA cage forged from sorrow and despair. A graveyard of unfinished dreams and a time long gone." },
            { name: "Dimmr Plains", image: "icons/regions/r1c2.jpg", desc: "The subterranean region of Lahai-Roi, located beneath the Bjartr Woods, is a unique underground zone formed around the Solvein Heartwood. Its unusually high Voidmatter levels make it off-limits to most.\nThe Spacetrek Collective has been permitted to conduct limited expeditions, but intense Voidmatter interference has so far yielded little meaningful intelligence." },
            { name: "Roya Frostlands - Frostlands Surface", image: "icons/regions/r1c3.jpg", desc: "Once a boreal fjordland thick with forests, this region was home to the nomadic Roya. Lahai-Roi's first recorded Lament triggered a geomagnetic pole shift, transforming the area into the new polar extremity of Solaris and burying it beneath endless snow and ice. The upheaval caused near-orbit satellites and space stations to fall from the sky; their wreckage still litters the surface of the frostlands today." },
            { name: "Startorch Academy", image: "icons/regions/r1c4.jpg", desc: `Officially Spacetrek Collective: Startorch Academy, it stands as a borderless scientific community dedicated to the pure pursuit of knowledge. Its name reflects its ethos, "to carry the flame of inquiry and ignite the torch of civilization." Within this vast academic city, knowledge flows freely and cultures meet in harmony.` },
            { name: "Bjartr Woods", image: "icons/regions/r1c5.jpg", desc: "A sacred homeland of the Roya and the habitat of the Soliskin. Bathed in the radiance of the Reactor Drive, its towering trees reach hungrily toward the light, their deep, interwoven roots returning that energy to the earth." },
            { name: "Research Institute", image: "icons/regions/r1c6.jpg", desc: "Officially Spacetrek Collective: Research Institute, it stands as part of Lahai-Roi's borderless research initiative, like Startorch Academy. Its mission is to extract and apply advanced technologies. Linked directly to the Starward Riseway, the Institute rests above the greatsword's tip like a guarding Stargram, watching over Lahai-Roi from above." }
        ]
    },

    { 
        name: "Rinascita", 
        image: "icons/regions/r2.jpg", 
        areas: [
            { name: "Sanguis Plateaus - Three Heroes' Crest", image: "icons/regions/r2c1.jpg", desc: "The highest peak in the Sanguis Plateaus, named for both its unique summit and the three Heroes of Heroes—Fabius, Atilius, and Valeria, who once stood there." },
            { name: "Journeying Paradise", image: "icons/regions/r2c2.jpg", desc: `Another world concealed within the Dark Tide. From its depths resound the whispers of the ancient "Divinity", the origin of all malice and fear. At the edge of the underworld, an immaculate Paradise draws bewildered souls, whose lifeless forms chant in unison, day and night—for naught but to earn Its grace and redemption.` },
            { name: "Sanguis Plateaus", image: "icons/regions/r2c3.jpg", desc: "The Sanguis Plateaus serve as both Septimontians' hunting grounds and the first line of defense against the Dark Tide. On these magnificent yet bleak highlands, the Blightcloud hovering above stirs relentlessly.\nHere, power and glory reach their peak, then give way to bloodshed and death." },
            { name: "Fabricatorium of the Deep", image: "icons/regions/r2c4.jpg", desc: "The Fabricatorium of the Deep is a facility hidden in the unfathomed depths of the sea, where Common Echoes are manufactured, recycled, and studied. At its heart stands the Lumen Tower, composed of experimental zones that are arranged in a circular fashion and interconnected by pathways; everything here serves to maintain the smooth running of the facility." },
            { name: "Septimont", image: "icons/regions/r2c5.jpg", desc: `"All for glory, fear no death." Like Ragunna, Septimont is a city-state of Rinascita, though its people revere not Divinity, but heroes of flesh and blood. Famed for its Gladiators, this City of Glory is hosting the Great Agon—a grand championship held once every four years.` },
            { name: "Capitoline Hill City", image: "icons/regions/r2c6.jpg", desc: `The capital city of Septimont, one of Rinascita's city-states. Perched atop Capitoline Hill, it boasts towering stone structures that form the grand "Gryphon's Fortress." After fleeing the threat of the Dark Tide, the bold and battle-loving Septimontians have devoted their lives to chasing the heights of glory. With travelers from distant seas, they gather in this City of Glory built upon the legends of heroes.` },
            { name: "Titanbone Expanse", image: "icons/regions/r2c7.jpg", desc: "A vast plain framed by mountain ranges. Named for the giant boulder clusters left by ancient lava flows, it was here that Septimontian civilization first took root centuries ago. Now, only scattered old villages remain, where wayfaring outlanders often rest before crossing into the Septimont highlands." },
            { name: "Mournfell Canyon", image: "icons/regions/r2c8.jpg", desc: "The remains of a coast eroded by the Dark Tide. Temples and sacred statues once erected by Ragunnesi Acolytes now lie in ruin. Their silent halls, devoid of worshippers, are spread across the canyon floor, transformed into haunted dwellings of Tacet Discords." },
            { name: "Border Mountains", image: "icons/regions/r2c9.jpg", desc: "A precipitous mountain range that marks the border of Septimont. The craggy peaks form a natural barrier between Septimont and the outside world. During the first outbreak of the Dark Tide, the Border Mountains bore the brunt, leaving them forever scarred by ashen traces and Tidal Blight calcification." },
            { name: "Capitoline Foothills", image: "icons/regions/r2c10.jpg", desc: "An area at the base of Capitoline Hill, near the Borderline Fort. Herds graze in peace throughout lush pastures, and scattered villages nestle among ancient ruins. Yet even in such tranquility, small arenas remain a vital part of life." },
            { name: "Avinoleum", image: "icons/regions/r2c11.jpg", desc: "Once a theological seminary of Rinascita, it now rests in the boundless expanse of clouds.\nIt once recorded Rinascita's glory and grandeur, along with countless unspeakable secrets." },
            { name: "Beohr Waters", image: "icons/regions/r2c12.jpg", desc: "Once a sacred land, only a faint shadow of Avinoleum's glory remains.\nThose destined to fall still live, while those meant to survive lie buried, transformed into divine oracles no one hears.\nTheir lips remain sealed, and Their ears are bound by words They never spoke." },
            { name: "Vault Underground", image: "icons/regions/r2c13.jpg", desc: "Tucked beneath the Sea of Clouds lies a vast depository zone of the Averardo Vault.\nEach item moved to the Vault will be meticulously transported to its designated storage location, where it will be safeguarded with the utmost care and precision" },
            { name: "Riccioli Islands", image: "icons/regions/r2c14.jpg", desc: "A group of islands northwest of Ragunna, rich in various marine resources. Falling out of the governance of the Order of the Deep, these islands have preserved the customs from Rinascita's Age of a Thousand Islands era, setting them apart from the rest of Ragunna in lifestyle. However, rumor has it a great mystery lies hidden within this secluded paradise..." },
            { name: "Ragunna", image: "icons/regions/r2c15.jpg", desc: "Ragunna City, the administrative center of the Ragunna city-state in Rinascita, is a thriving port city by the sea, its districts linked by winding waterways. The Ragunnesi are devout followers of the Sentinel, who believe Common Echoes to be gifts from the Sentinel carrying Their divine will." },
            { name: "Whisperwind Haven", image: "icons/regions/r2c16.jpg", desc: "Whisperwind Haven stretches across a vast plain outside Ragunna, adorned with uniquely shaped windmills and babbling streams.\nWhen the wind sweeps through, the windmills turn in graceful unison, rippling the streams below. Together, the wind and water merge harmoniously, flowing into the mystical sea of clouds." },
            { name: "Penitent's End", image: "icons/regions/r2c17.jpg", desc: "This forsaken island, shrouded in dense sea mist, is dominated by steep cliffs with giant ringed structures. Ships caught in the currents often end up stranded on the island's treacherous shores. For those lucky enough to survive the wreck, even greater horrors await..." },
            { name: "Fagaceae Peninsula", image: "icons/regions/r2c18.jpg", desc: "This peninsula thick with oak trees was once where Rinascita's rulers gathered for secret councils. The Oracles carved into the stone and trees have withstood the passage of time, though their messages are now nearly impossible to distinguish." },
            { name: "Nimbus Sanctum", image: "icons/regions/r2c19.jpg", desc: "The sea of clouds lingering in this place is formed by concentrated Remnant Energy. Local legends of Ragunna speak of a serene, mirror-like area at the heart of Nimbus Sanctum, said to purify the darkest of thoughts and transform them into part of the clouds. At times, a haunting melody can be heard echoing from the depths of the sanctum." },
            { name: "Averardo Vault", image: "icons/regions/r2c20.jpg", desc: "Built by the Montelli family, Averardo Vault stands like a heavily guarded fortress on the outskirts of the city. Within its walls lies the family's vast collection of treasures, including precious metals, artworks, and rare Echoes. The vault also provides public services such as secure storage for valuables, appraisals, and acquisition of rare collections." },
            { name: "Thessaleo Fells", image: "icons/regions/r2c21.jpg", desc: "The rugged mountains of Thessaleo Fells always seem shrouded in the darkness of night, their gloom as deep as the abyssal sea. Once the domain of the Fisalia family, the oldest lineage in Ragunna, this desolate place remains one few outsiders dare to tread." },
        ]
    },

    { 
        name: "The Black Shores", 
        image: "icons/regions/r3.jpg", 
        areas: [
            { name: "Chronorift Metropolis", image: "icons/regions/r3c1.jpg", desc: "A ruined city, like amber trapped in the Sonoro.\nOnce-bustling streets lie overgrown with wild grass, low roads swallowed by seawater.\nThe Lament repeats endlessly, and time and space are fractured, but this view seems frozen, stopped in a silent eternity." },
            { name: "Black Shores Archipelago", image: "icons/regions/r3c2.jpg", desc: `An archipelago shrouded in the Stormy Sea of Solaris. Formed from Tacetites, these isles constantly emanate Remnant Energy, casting an eerie "mist" that envelopes the region.` },
            { name: "Tethys' Deep", image: "icons/regions/r3c3.jpg", desc: `Here sits the Black Shores' Lament observation hub, the heart of the Tethys System. Its high-dimensional code stretches across the vast underground sky like ever-shifting celestial bodies, known as the "Stellar Matrices."` }
        ]
    },

    { 
        name: "Huanglong", 
        image: "icons/regions/r4.jpg", 
        areas: [
            { name: "Jinzhou", image: "icons/regions/r4c1.jpg", desc: "Jinzhou is situated on the northern border of Huanglong, nestled within the expanse of a great lake, embraced by waters on three sides and cradled by mountains on the fourth.\nThe city experiences a humid climate characterized by four distinct seasons.\nRenowned as a vital pass in Huanglong, Jinzhou also serves as an indispensable stronghold in the defense against Tacet Discords." },
            { name: "Gorges of Spirits", image: "icons/regions/r4c2.jpg", desc: "While Jinzhou is the newest addition to Huanglong's cities, it holds a crucial position as a strategic pass.\nTravelers journeying to Jinzhou from other parts of Huanglong must pass through the Gorges of Spirits, a vital gateway into the city." },
            { name: "Mt. Firmament", image: "icons/regions/r4c3.jpg", desc: `A secluded island situated in the southeastern ocean of Jinzhou territory. Cloaked in mist, it obscures its connection to the secular world.\nMt. Firmament serves as the ancestral homeland of Jinzhou inhabitants. Legend has it that Sentinel Jué descended here to guide them.\nNavigating its waters is treacherous due to the thick fog. To safely reach its shores, you'll need to wait for precise timing and the expertise of a "Wayfinder".` }
        ]
    }
];

let regionIndex = 0;
let areaIndex = 0;

const track = document.getElementById("regionTrack");
const viewport = document.getElementById("regionViewport");
const regionNameEl = document.getElementById("regionName");
const regionPrevBtn = document.getElementById("regionPrev");
const regionNextBtn = document.getElementById("regionNext");
const overviewSec = document.getElementById("overview");
const detailSec = document.getElementById("detail");
const detailBg = document.getElementById("detailBg");
const detailBackdrop = document.getElementById("detailBackdrop");
const filmTrack = document.getElementById("filmTrack");
const filmViewport = document.getElementById("filmViewport");
const areaNameEl = document.getElementById("areaName");
const areaDescEl = document.getElementById("areaDesc");
const areaPrev = document.getElementById("areaPrev");
const areaNext = document.getElementById("areaNext");
const regionDots = document.getElementById("regionDots");
const areaDots = document.getElementById("areaDots");

function buildRegions() {
    track.innerHTML = "";
    regions.forEach(function (region, i) {
        const slide = document.createElement("div");
        slide.className = "region-slide";
        slide.style.backgroundImage = "url('" + region.image + "')";
        slide.innerHTML = '<button class="more-btn" type="button">MORE <span>&#8594;</span></button>';
        slide.addEventListener("click", function () {
            if (i === regionIndex) {
                openDetail(i);
            } else {
                regionIndex = i;
                layoutRegions();
            }
        });
        track.appendChild(slide);
    });

    regionDots.innerHTML = "";
    regions.forEach(function (region, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot";
        dot.addEventListener("click", function () {
            regionIndex = i;
            layoutRegions();
        });
        regionDots.appendChild(dot);
    });

    layoutRegions();
}

function layoutRegions() {
    const slides = track.children;
    if (!slides.length) return;

    const vw = viewport.clientWidth;
    const slideW = slides[0].offsetWidth;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap || cs.gap) || 0;
    const step = slideW + gap;
    const offset = (vw - slideW) / 2;

    track.style.transform = "translateX(" + (offset - regionIndex * step) + "px)";

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.toggle("active", i === regionIndex);
    }

    regionNameEl.textContent = regions[regionIndex].name;

    const rdots = regionDots.children;
    for (let i = 0; i < rdots.length; i++) {
        rdots[i].classList.toggle("active", i === regionIndex);
    }
}

function regionNext() {
    regionIndex = (regionIndex + 1) % regions.length;
    layoutRegions();
}

function regionPrev() {
    regionIndex = (regionIndex - 1 + regions.length) % regions.length;
    layoutRegions();
}

function openDetail(i) {
    regionIndex = i;
    areaIndex = 0;
    buildFilmstrip();
    showArea(0);
    detailSec.classList.add("active");
    detailSec.setAttribute("aria-hidden", "false");
    overviewSec.classList.add("hidden");
    document.body.style.overflow = "hidden";
}

function closeDetail() {
    detailSec.classList.remove("active");
    detailSec.setAttribute("aria-hidden", "true");
    overviewSec.classList.remove("hidden");
    document.body.style.overflow = "";
    layoutRegions();
}

function buildFilmstrip() {
    const areas = regions[regionIndex].areas;
    filmTrack.innerHTML = "";

    areas.forEach(function (area, i) {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "film-thumb";
        thumb.style.backgroundImage = "url('" + area.image + "')";
        thumb.addEventListener("click", function () {
            showArea(i);
        });
        filmTrack.appendChild(thumb);
    });

    const few = areas.length <= 3;
    areaPrev.style.display = few ? "none" : "";
    areaNext.style.display = few ? "none" : "";
    filmTrack.classList.toggle("centered", areas.length <= 4);

    areaDots.innerHTML = "";
    if (areas.length <= 12) {
        areas.forEach(function (area, i) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "dot";
            dot.addEventListener("click", function () {
                showArea(i);
            });
            areaDots.appendChild(dot);
        });
    }
}

function showArea(i) {
    const areas = regions[regionIndex].areas;
    areaIndex = (i + areas.length) % areas.length;
    const area = areas[areaIndex];

    detailBg.style.backgroundImage = "url('" + area.image + "')";
    detailBackdrop.style.backgroundImage = "url('" + area.image + "')";
    detailBg.classList.remove("fade");
    void detailBg.offsetWidth;
    detailBg.classList.add("fade");

    areaNameEl.textContent = area.name;
    areaDescEl.textContent = area.desc;

    const thumbs = filmTrack.children;
    for (let t = 0; t < thumbs.length; t++) {
        thumbs[t].classList.toggle("active", t === areaIndex);
    }

    const adots = areaDots.children;
    for (let t = 0; t < adots.length; t++) {
        adots[t].classList.toggle("active", t === areaIndex);
    }

    layoutFilmstrip();
}

function layoutFilmstrip() {
    const areas = regions[regionIndex].areas;
    if (areas.length <= 4) {
        filmTrack.style.transform = "translateX(0)";
        return;
    }

    const thumbs = filmTrack.children;
    if (!thumbs.length) return;

    const vpW = filmViewport.clientWidth;
    const thumbW = thumbs[0].offsetWidth;
    const cs = getComputedStyle(filmTrack);
    const gap = parseFloat(cs.columnGap || cs.gap) || 0;
    const step = thumbW + gap;
    const trackW = thumbs.length * step - gap;

    let offset = (vpW - thumbW) / 2 - areaIndex * step;
    const minOffset = Math.min(0, vpW - trackW);
    offset = Math.max(minOffset, Math.min(0, offset));
    filmTrack.style.transform = "translateX(" + offset + "px)";
}

function areaNextFn() {
    showArea(areaIndex + 1);
}

function areaPrevFn() {
    showArea(areaIndex - 1);
}

regionNextBtn.addEventListener("click", regionNext);
regionPrevBtn.addEventListener("click", regionPrev);
document.getElementById("backBtn").addEventListener("click", closeDetail);
areaNext.addEventListener("click", areaNextFn);
areaPrev.addEventListener("click", areaPrevFn);

document.addEventListener("keydown", function (e) {
    if (detailSec.classList.contains("active")) {
        if (e.key === "Escape") closeDetail();
        else if (e.key === "ArrowRight" && areaNext.style.display !== "none") areaNextFn();
        else if (e.key === "ArrowLeft" && areaPrev.style.display !== "none") areaPrevFn();
    } else {
        if (e.key === "ArrowRight") regionNext();
        else if (e.key === "ArrowLeft") regionPrev();
    }
});

window.addEventListener("resize", function () {
    if (detailSec.classList.contains("active")) layoutFilmstrip();
    else layoutRegions();
});

buildRegions();