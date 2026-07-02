document.addEventListener("DOMContentLoaded",()=>{
    /* SEARCH BAR */
    const header=document.querySelector(".event-header");
    const search=document.createElement("input");
    search.type="text";
    search.placeholder="Search Event...";
    search.className="event-search";
    header.appendChild(search);
    search.addEventListener("keyup",function(){
        const keyword=this.value.toLowerCase();
        document.querySelectorAll(".event-card").forEach(card=>{
            const title=card.querySelector("h2").textContent.toLowerCase();
            if(title.includes(keyword)){
                card.style.display="flex";
            }else{
                card.style.display="none";
            }
        });
    });

    /* FILTER BUTTON */
    const filter=document.createElement("div");
    filter.className="event-filter";
    filter.innerHTML=`
        <button class="active" data-filter="all">All</button>
        <button data-filter="In Progress">In Progress</button>
        <button data-filter="Up Comming">Upcoming</button>
        <button data-filter="Finished">Finished</button>
    `;
    header.appendChild(filter);
    filter.querySelectorAll("button").forEach(btn=>{
        btn.onclick=function(){
            filter.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
            this.classList.add("active");
            const status=this.dataset.filter;
            document.querySelectorAll(".event-card").forEach(card=>{
                const badge=card.querySelector(".event-badge").textContent.trim();
                if(status==="all" || badge===status){
                    card.style.display="flex";
                }else{
                    card.style.display="none";
                }
            });
        }
    });

    /* BOOKMARK */
    let saved=JSON.parse(localStorage.getItem("savedEvents"))||[];
    document.querySelectorAll(".event-card").forEach((card,index)=>{
        const icon=document.createElement("span");
        icon.className="bookmark";
        icon.innerHTML=saved.includes(index)?"⭐":"☆";
        card.querySelector(".event-info").appendChild(icon);
        icon.onclick=function(){
            if(saved.includes(index)){
                saved=saved.filter(i=>i!==index);
                icon.innerHTML="☆";
            }else{
                saved.push(index);
                icon.innerHTML="⭐";
            }
            localStorage.setItem("savedEvents",JSON.stringify(saved));
        }
    });

    /* IMAGE PREVIEW */
    const popup=document.createElement("div");
    popup.className="image-popup";
    popup.innerHTML=`
        <span class="close-popup">&times;</span>
        <img>
    `;
    document.body.appendChild(popup);
    document.querySelectorAll(".event-image img").forEach(img=>{
        img.onclick=function(){
            popup.style.display="flex";
            popup.querySelector("img").src=this.src;
        }
    });
    popup.onclick=function(){
        popup.style.display="none";
    }

    /* COUNTDOWN */
    document.querySelectorAll(".event-card").forEach(card=>{
        const badge=card.querySelector(".event-badge").textContent.trim();
        if(badge!=="In Progress") return;
        const dateText=card.querySelector(".event-date").textContent;
        const match=dateText.match(/(\d{2}\/\d{2}\/\d{4})$/);
        if(!match) return;
        const end=new Date(match[1].split("/").reverse().join("-"));
        const countdown=document.createElement("p");
        countdown.className="countdown";
        card.querySelector(".event-info").appendChild(countdown);
        function update(){
            const now=new Date();
            const diff=end-now;
            if(diff<=0){
                countdown.innerHTML="Event Ended";
                return;
            }
            const day=Math.floor(diff/1000/60/60/24);
            const hour=Math.floor(diff/1000/60/60)%24;
            countdown.innerHTML=`⏳ ${day} Days ${hour} Hours Left`;
        }
        update();
        setInterval(update,60000);
    });
});

document.querySelectorAll(".event-card").forEach(card=>{
    const share=document.createElement("button");
    share.className="share-btn";
    share.textContent="🔗 Share";
    card.querySelector(".event-info").appendChild(share);
    share.onclick=()=>{
        navigator.clipboard.writeText(location.href);
        alert("Event link copied!");
    };
});