let currentReplyId = null;

function getAdminSupport() {
    const raw = localStorage.getItem("support");
    return raw ? JSON.parse(raw) : [];
}

function saveAdminSupport(data) {
    localStorage.setItem("support", JSON.stringify(data));
}

function animateCount(el, target, duration = 900) {
    if (!el) return;
    const start = parseInt(el.textContent, 10) || 0;
    if (start === target) {
        el.textContent = target;
        return;
    }
    const startTime = performance.now();
    function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (p < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(tick);
}

function renderChart() {
    const data = getAdminSupport();
    const total = data.length;

    const segments = [
        { label: "Report Bug",       value: data.filter(i => i.problem === "Report Bug").length,       color: "#ff4d6d" },
        { label: "Technical Issues", value: data.filter(i => i.problem === "Technical Issues").length, color: "#ffd166" },
        { label: "Account Help",     value: data.filter(i => i.problem === "Account Help").length,     color: "#06d6a0" }
    ];

    const donut = document.getElementById("donutChart");
    const legend = document.getElementById("chartLegend");

    if (donut) {
        if (total === 0) {
            donut.style.background = "conic-gradient(#2a3550 0deg 360deg)";
        } else {
            let acc = 0;
            const stops = segments.map(function (s) {
                const startDeg = (acc / total) * 360;
                acc += s.value;
                const endDeg = (acc / total) * 360;
                return `${s.color} ${startDeg}deg ${endDeg}deg`;
            });
            donut.style.background = `conic-gradient(${stops.join(", ")})`;
        }
    }

    animateCount(document.getElementById("donutTotal"), total);

    if (legend) {
        legend.innerHTML = segments.map(function (s) {
            const pct = total ? Math.round((s.value / total) * 100) : 0;
            return `
                <li>
                    <span class="legend-dot" style="background:${s.color};"></span>
                    <span class="legend-label">${s.label}</span>
                    <span class="legend-val">${s.value} <small>(${pct}%)</small></span>
                </li>`;
        }).join("");
    }
}

function renderDashboardStats() {
    const data = getAdminSupport();

    const bugs = data.filter(item => item.problem === "Report Bug").length;
    const tech = data.filter(item => item.problem === "Technical Issues").length;
    const acc = data.filter(item => item.problem === "Account Help").length;

    animateCount(document.getElementById("totalReq"), data.length);
    animateCount(document.getElementById("bugReq"), bugs);
    animateCount(document.getElementById("techReq"), tech);
    animateCount(document.getElementById("accReq"), acc);

    renderChart();
}

function renderAdminTable() {
    const data = getAdminSupport();
    const tbody = document.getElementById("adminTableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No support requests yet.</td></tr>`;
        return;
    }

    const reversedData = [...data].reverse();

    reversedData.forEach(item => {
        let statusClass = "status-pending";
        let btnText = "Respond";
        let btnStyle = "";

        if (item.status === "In Progress") {
            statusClass = "status-progress";
        }
        
        if (item.status === "Resolved") {
            statusClass = "status-resolved";
            btnText = "View / Update";
            btnStyle = "background: linear-gradient(135deg, #555, #777); box-shadow: none;";
        }

        const _imgs = ticketImages(item);
        const imgBtn = _imgs.length ? '<button type="button" class="view-img-btn" onclick="openImageAlert(' + item.id + ')">📎 ' + _imgs.length + '</button>' : "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Date">${item.date}</td>
            <td data-label="Email">${item.email}</td>
            <td data-label="Problem">${item.problem}</td>
            <td data-label="Detail" class="cell-detail">${item.info} ${imgBtn}</td>
            <td data-label="Status" class="${statusClass}">${item.status}</td>
            <td data-label="Action">
                <button class="btn-reply" style="${btnStyle}" onclick="openReplyModal(${item.id})">${btnText}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openReplyModal(id) {
    const data = getAdminSupport();
    const item = data.find(x => x.id === id);
    if (!item) return;

    currentReplyId = id;
    document.getElementById("replyEmail").textContent = "Replying to: " + item.email;
    document.getElementById("replyDetail").textContent = item.info || "-";

    const _imgs = ticketImages(item);
    const imagesField = document.getElementById("replyImagesField");
    const imagesBox = document.getElementById("replyImages");
    if (_imgs.length) {
        imagesBox.innerHTML = _imgs.map(function (src) {
            return '<img src="' + src + '" alt="Attachment" onclick="openImageAlert(' + item.id + ')">';
        }).join("");
        imagesField.style.display = "";
    } else {
        imagesBox.innerHTML = "";
        imagesField.style.display = "none";
    }

    document.getElementById("updateStatus").value = item.status || "Pending";

    document.getElementById("adminFeedbackText").value = item.adminReply || "";
    
    document.getElementById("replyModal").classList.add("active");
}

function closeReplyModal() {
    document.getElementById("replyModal").classList.remove("active");
    currentReplyId = null;
}

document.getElementById("saveReplyBtn").addEventListener("click", function() {
    if (!currentReplyId) return;

    const data = getAdminSupport();
    const item = data.find(x => x.id === currentReplyId);
    
    if (item) {
        item.status = document.getElementById("updateStatus").value;
        item.adminReply = document.getElementById("adminFeedbackText").value;
        item.hasUnreadReply = true;
        
        saveAdminSupport(data);
        renderDashboardStats();
        renderAdminTable();
        closeReplyModal();
        alert("Feedback sent successfully!");
    }
});

function ticketImages(item) {
    if (item.images && item.images.length) return item.images;
    if (item.image) return [item.image];
    return [];
}

window.openImageAlert = function (id) {
    const item = getAdminSupport().find(function (x) { return x.id === id; });
    if (!item) return;
    const imgs = ticketImages(item);
    if (!imgs.length) return;
    const box = document.getElementById("imageAlertImgs");
    box.innerHTML = imgs.map(function (src) {
        return '<img src="' + src + '" alt="Attachment">';
    }).join("");
    document.getElementById("imageAlert").classList.add("active");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
};

window.closeImageAlert = function () {
    document.getElementById("imageAlert").classList.remove("active");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
};

function adminLogout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Access Denied. Please login first.");
        window.location.href = "index.html";
        return;
    }

    const userIsAdmin = (typeof isAdmin === 'function')
    ? isAdmin(user) : (user.role === 'admin' || user.email.toLowerCase() === 'admin@wuwa.com');

    if (!userIsAdmin) {
        alert("Access Denied. You are not an admin.");
        window.location.href = "index.html";
        return;
    }

    renderDashboardStats();
    renderAdminTable();
});