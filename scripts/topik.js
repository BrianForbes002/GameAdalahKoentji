document.querySelectorAll(".topic-card button").forEach(btn=>{

    const topicSearch=document.getElementById("topicSearch");

    const topicCards=document.querySelectorAll(".topic-card");

    topicSearch.addEventListener("input",()=>{

        const key=topicSearch.value.toLowerCase();

        topicCards.forEach(card=>{

            const title=card.querySelector("h2").textContent.toLowerCase();

            if(title.includes(key)){

                card.style.display="block";

            }else{

                card.style.display="none";

            }

        });

    });
    const buttons=document.querySelectorAll(".topic-category button");

    buttons.forEach(btn=>{

        btn.onclick=function(){

            buttons.forEach(b=>b.classList.remove("active"));

            this.classList.add("active");

            const category=this.textContent;

            topicCards.forEach(card=>{

                if(category=="All"){

                    card.style.display="block";

                }

                else if(card.dataset.category===category){

                    card.style.display="block";

                }

                else{

                    card.style.display="none";

                }

            });

        }

    });

    btn.onclick=function(){

        alert("Welcome to this discussion!");

    }

});