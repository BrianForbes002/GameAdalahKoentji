document.addEventListener("DOMContentLoaded",()=>{
    const checks=document.querySelectorAll(".follow-container input");
    const counter=document.getElementById("followCount");
    const progress=document.getElementById("progressBar");
    const shuffle=document.getElementById("shuffleBtn");
    const followPage=document.querySelector(".follow-page");

    function update(){
        let total=0;
        checks.forEach(c=>{
            if(c.checked) total++;
        });

        counter.innerHTML=total;
        progress.style.width=(total/checks.length)*100+"%";
        localStorage.setItem("followData",
        JSON.stringify(
            [...checks].map(c=>c.checked)
        ));
    }

    const saved=JSON.parse(localStorage.getItem("followData"));
    if(saved){
        checks.forEach((c,i)=>{
            c.checked=saved[i];
        });
    }

    update();
    checks.forEach(c=>{
        c.addEventListener("change",update);
    });

    shuffle.onclick=function(){
        const cards=[...document.querySelectorAll(".follow-user")];
        cards.sort(()=>Math.random()-0.5);
        cards.forEach(card=>{
            followPage.appendChild(card);
        });
    }
});