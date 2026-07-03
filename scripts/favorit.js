document.querySelectorAll(".favorite-card").forEach(card=>{
    const name = card.dataset.name;
    const btn = card.querySelector(".favorite-btn");
    let saved =
    localStorage.getItem("fav_"+name);
    if(saved=="true"){
        btn.textContent="❤️";
    }

    btn.onclick=()=>{
        if(btn.textContent=="🤍"){
            btn.textContent="❤️";
            localStorage.setItem("fav_"+name,true);
        }else{
            btn.textContent="🤍";
            localStorage.removeItem("fav_"+name);
        }
    };
});

document.querySelectorAll(".favorite-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        btn.classList.add("pop");
        setTimeout(()=>{
            btn.classList.remove("pop");
        },250);
    });

    const search=document.getElementById("searchFavorite");

    search.addEventListener("keyup",()=>{

        const keyword=search.value.toLowerCase();

        document.querySelectorAll(".favorite-card").forEach(card=>{

            const name=card.dataset.name.toLowerCase();

            if(name.includes(keyword)){

                card.style.display="flex";

            }else{

                card.style.display="none";
            }

        });

    });
    
});