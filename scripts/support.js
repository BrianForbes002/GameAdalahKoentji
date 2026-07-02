let editId = null;

function getSupport() {
    const raw = localStorage.getItem("support");
    return raw ? JSON.parse(raw) : [];
}

function saveSupport(data) {
    localStorage.setItem("support", JSON.stringify(data));
}

function formatDate() {
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const today = new Date();

    return `${today.getDate()} ${month[today.getMonth()]} ${today.getFullYear()}`;
}

const sections = document.querySelectorAll("main section");

let current = 0;
let scrolling = false;

window.addEventListener("wheel", function(e){
    if(loginOpen){
        e.preventDefault();
        return;
    }

    if(scrolling) return;

    scrolling = true;

    if(e.deltaY > 0){
        current = Math.min(current + 1, sections.length - 1);
    }else{
        current = Math.max(current - 1, 0);
    }

    sections[current].scrollIntoView({
        behavior:"smooth"
    });

    setTimeout(function(){
        scrolling = false;
    },700);

}, { passive:false });

function loadEmail() {
    const email = document.getElementById("supportEmail");
    const error = document.getElementById("supportFormError");

    if (!email) return;

    const user = getCurrentUser();

    if (user) {
        email.value = user.email;
        email.readOnly = true;
        email.placeholder = "";
    } else {
        email.value = "";
        email.readOnly = true;
        email.placeholder = "Please login first";
    }

    error.textContent = "";
}

function fillForm(data) {
    document.getElementById("playerName").value = data.name;
    document.getElementById("additionalInfo").value = data.info;

    const radio = document.querySelector(`input[value="${data.problem}"]`);

    if (radio) {
        radio.checked = true;
    }
}

function clearForm() {
    document.getElementById("playerName").value = "";
    document.getElementById("additionalInfo").value = "";
    document.getElementById("bug").checked = true;

    loadEmail();

    document.querySelector(".btn-send").textContent = "Send";
}

function resetSupportForm() {
    document.getElementById("playerName").value = "";
    document.getElementById("additionalInfo").value = "";
    document.getElementById("bug").checked = true;

    loadEmail();
}

function alertLogin() {
    const alertBtn = document.getElementById("alertBtn");

    if (!alertBtn) return;

    alertBtn.addEventListener("click", function () {
        document.getElementById("loginAlert").classList.remove("active");
        loginForm();
    });
}

function initSupportForm() {
    const form = document.getElementById("supportForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
        e.preventDefault();
        const error = document.getElementById("supportFormError");
        error.textContent = "";

        if (typeof loginOpen !== 'undefined' && loginOpen) {
            return; 
        }

        if (!getCurrentUser()) {
            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

            document.getElementById("loginAlert").classList.add("active");
            error.textContent = "Please login first!";

            return;
        }

        const email = document.getElementById("supportEmail").value.trim();
        const name = document.getElementById("playerName").value.trim();
        const info = document.getElementById("additionalInfo").value.trim();
        const problem = document.querySelector('input[name="problem"]:checked');

        if(name === ""){
            error.textContent = "Please enter your name!";
            return;
        }

        if(problem === null){
            error.textContent = "Please choose a problem!";
            return;
        }

        const data = getSupport();
        const btnSend = document.querySelector(".btn-send");
        const formBox = document.querySelector(".support-form .fieldset") || document.querySelector(".support-form fieldset");

        const originalBtnText = btnSend.textContent;
        btnSend.textContent = "Transmitting...";
        btnSend.classList.add("loading");
        formBox.classList.add("form-transmitting");

        setTimeout(function() {

            if(editId === null){
                data.push({
                    id: Date.now(),
                    email,
                    name,
                    problem: problem.value,
                    info,
                    date: formatDate(),
                    status: "Pending"
                });
            } else {
                const item = data.find(function(x){
                    return x.id === editId;
                });
                if(item){
                    item.name = name;
                    item.problem = problem.value;
                    item.info = info;
                }
            }

            saveSupport(data);

            btnSend.classList.remove("loading");
            btnSend.classList.add("success");
            btnSend.textContent = editId === null ? "Data Sent!" : "Updated!";
            formBox.classList.remove("form-transmitting");

            setTimeout(function() {
                
                editId = null;
                clearForm();
                renderSupportTable();

                btnSend.classList.remove("success");
                btnSend.textContent = originalBtnText;

                document.querySelector(".support-history-section").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 1000);

        }, 1500);
    });

}

const prefersLessMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawnResetShards(container) {
    if (prefersLessMotion()) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const count = 14;

    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = w * (1 - t);          
        const y = h * (0.35 + 0.3 * t);

        const shard = document.createElement("div");
        shard.className = "shard shard-fall";

        const size = 6 + Math.random() * 12;
        shard.style.width = size + "px";
        shard.style.height = size + "px";
        shard.style.left = x + "px";
        shard.style.top = y + "px";

        const spreadX = (Math.random() * 2 - 1) * (55 + Math.random() * 60);
        const fallY = 130 + Math.random() * 170;
        shard.style.setProperty("--tx", spreadX.toFixed(1) + "px");
        shard.style.setProperty("--ty", fallY.toFixed(1) + "px");
        shard.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");

        container.appendChild(shard);
        setTimeout(() => shard.remove(), 900);
    }
}

function spawnReassembleShards(container) {
    if (prefersLessMotion()) return;
    const count = 16;

    for (let i = 0; i < count; i++) {
        const shard = document.createElement("div");
        shard.className = "shard shard-gather";

        const size = 6 + Math.random() * 11;
        shard.style.width = size + "px";
        shard.style.height = size + "px";

        const sx = (Math.random() * 2 - 1) * (120 + Math.random() * 90);
        const mag = 110 + Math.random() * 110;
        const sy = (Math.random() < 0.7) ? mag : -mag;
        shard.style.setProperty("--sx", sx.toFixed(1) + "px");
        shard.style.setProperty("--sy", sy.toFixed(1) + "px");
        shard.style.setProperty("--rot", Math.round(Math.random() * 540 - 270) + "deg");
        shard.style.animationDelay = (Math.random() * 0.12).toFixed(2) + "s";

        container.appendChild(shard);
        setTimeout(() => shard.remove(), 850);
    }
}

function spawnDeleteShards(rect) {
    if (prefersLessMotion()) return;
    const count = 9;

    for (let i = 0; i < count; i++) {
        const shard = document.createElement("div");
        shard.className = "shard shard-delete";

        const size = 7 + Math.random() * 13;
        shard.style.width = size + "px";
        shard.style.height = size + "px";
        shard.style.left = (rect.left + Math.random() * rect.width) + "px";
        shard.style.top = (rect.top + Math.random() * rect.height) + "px";

        const ang = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 150;
        shard.style.setProperty("--tx", (Math.cos(ang) * dist).toFixed(1) + "px");
        shard.style.setProperty("--ty", (Math.sin(ang) * dist).toFixed(1) + "px");
        shard.style.setProperty("--sc", (1.5 + Math.random() * 1.9).toFixed(2));
        shard.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");

        document.body.appendChild(shard);
        setTimeout(() => shard.remove(), 750);
    }
}

function initResetButton(){
    const btn = document.getElementById("resetBtn");

    if(!btn) return;

    btn.addEventListener("click", function(e){
        e.preventDefault();

        const formContainer = document.querySelector(".support-form");
        const fieldset = document.querySelector(".support-form fieldset");

        const cloneTop = fieldset.cloneNode(true);
        const cloneBottom = fieldset.cloneNode(true);

        cloneTop.removeAttribute("id");
        cloneBottom.removeAttribute("id");

        cloneTop.classList.add("form-clone", "form-clone-top");
        cloneBottom.classList.add("form-clone", "form-clone-bottom");

        const originalInputs = fieldset.querySelectorAll("input, textarea");
        const topInputs = cloneTop.querySelectorAll("input, textarea");
        const bottomInputs = cloneBottom.querySelectorAll("input, textarea");

        originalInputs.forEach((input, index) => {
            if (input.type === "radio" || input.type === "checkbox") {
                topInputs[index].checked = input.checked;
                bottomInputs[index].checked = input.checked;
            } else {
                topInputs[index].value = input.value;
                bottomInputs[index].value = input.value;
            }
        });

        formContainer.appendChild(cloneTop);
        formContainer.appendChild(cloneBottom);
        
        fieldset.style.opacity = "0"; 

        const slash = document.createElement("div");
        slash.classList.add("sword-slash");
        formContainer.appendChild(slash);

        requestAnimationFrame(() => {
            slash.classList.add("slash-active");

            setTimeout(() => {
                cloneTop.classList.add("shatter-top");
                cloneBottom.classList.add("shatter-bottom");
                spawnResetShards(formContainer);
            }, 100);

            setTimeout(() => {
                resetSupportForm(); 

                cloneTop.remove();
                cloneBottom.remove();
                slash.remove();

                spawnReassembleShards(formContainer);

                fieldset.style.opacity = "1";
                fieldset.classList.add("form-reassemble");

                setTimeout(() => {
                    fieldset.classList.remove("form-reassemble");
                }, 700);

            }, 950); 
        });
    });
}

function editForm(){
    const buttons = document.querySelectorAll(".edit-btn");

    buttons.forEach(function(btn){
        btn.addEventListener("click",function(){
            const id = Number(this.dataset.id);
            const data = getSupport();

            const item = data.find(function(x){
                return x.id === id;
            });

            if(!item) return;

            const user = getCurrentUser();

            if(!user || user.email !== item.email){
                alert("You can only edit your own support request.");
                return;
            }

            editId = id;

            document.getElementById("supportEmail").value = item.email;

            fillForm(item);

            document.getElementById("supportFormError").textContent = "";

            document.querySelector(".btn-send").textContent = "Save Changes";

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        });

    });

}

function deleteForm(){
    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(function(btn){
        btn.addEventListener("click",function(){
            const id = Number(this.dataset.id);
            let data = getSupport();
            const item = data.find(function(x){
                return x.id === id;
            });

            if(!item) return;

            const user = getCurrentUser();

            if(!user || user.email !== item.email){
                alert("You can only delete your own support request.");
                return;
            }

            if(!confirm("Are you sure you want to delete this support history?")){
                return;
            }

            const row = this.closest("tr");
            const rect = row.getBoundingClientRect();

            // Laser di tengah layar (X) + sejajar baris yang dihapus (Y)
            const centerX = window.innerWidth / 2;
            const centerY = rect.top + (rect.height / 2);
            
            const laser = document.createElement("div");
            laser.classList.add("frontal-laser");
            
            laser.style.top = centerY + "px";
            laser.style.left = centerX + "px";
            
            document.body.appendChild(laser);

            const spawnRect = { left: centerX - 110, top: rect.top, width: 220, height: rect.height };
            setTimeout(function() { spawnDeleteShards(spawnRect); }, 150);

            row.classList.add("row-shatter-3d");

            setTimeout(function() {

                laser.remove(); 

                data = data.filter(function(x){
                    return x.id !== id;
                });

                saveSupport(data);

                if(editId === id){
                    editId = null;
                    clearForm();
                }

                renderSupportTable();

            }, 700); 

        });
    });
}

function renderSupportTable() {
    const tbody = document.getElementById("supportTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const user = getCurrentUser();
    const data = getSupport();

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No support history.</td></tr>`;
        return;
    }

    data.forEach(function(item, index){
        const tr = document.createElement("tr");
        let action = "-";

        if(user && user.email === item.email){
            if (item.status === "Pending") {
                action = `
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                `;
            } else {
                action = `
                    <button class="edit-btn" style="background: linear-gradient(135deg, #06d6a0, #00b4d8);" onclick="viewFeedback(${item.id})">
                        View Reply
                    </button>
                `;
            }
        }

        let badgeClass = "badge-pending";
        if (item.status === "In Progress") badgeClass = "badge-progress";
        if (item.status === "Resolved") badgeClass = "badge-resolved";

        tr.innerHTML = `
            <td data-label="No">${index + 1}</td>
            <td data-label="Email">${item.email}</td>
            <td data-label="Name">${item.name}</td>
            <td data-label="Problem">${item.problem}</td>
            <td data-label="Date">${item.date}</td>
            <td data-label="Status"><span class="status-badge ${badgeClass}">${item.status}</span></td>
            <td data-label="Action">${action}</td>
        `;

        tbody.appendChild(tr);
    });

    editForm();
    deleteForm();
}

window.viewFeedback = function(id) {
    const data = getSupport();
    const item = data.find(x => x.id === id);
    
    if(!item) return;

    const feedbackText = item.adminReply && item.adminReply.trim() !== ""  ? item.adminReply : "Admin is currently reviewing your ticket. Please wait for further updates.";
    
    document.getElementById("feedbackText").textContent = feedbackText;
    document.getElementById("feedbackAlert").classList.add("active");

    if (item.hasUnreadReply) {
        item.hasUnreadReply = false;
        saveSupport(data);
    }
}

window.closeFeedbackAlert = function() {
    document.getElementById("feedbackAlert").classList.remove("active");
}

function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function(item) {
        const question = item.querySelector(".question");
        
        question.addEventListener("click", function() {
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });

            item.classList.toggle("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadEmail();
    initSupportForm();
    initResetButton();
    alertLogin();
    renderSupportTable();
    initFAQ();
});