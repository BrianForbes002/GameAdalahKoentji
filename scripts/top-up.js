(function () {
    "use strict";

    function getUser() {
        try { return JSON.parse(localStorage.getItem("currentUser")); }
        catch (e) { return null; }
    }

    function fmt(n) {
        return "Rp " + Number(n).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    function parsePrice(txt) { return parseFloat(String(txt).replace(/[^0-9.]/g, "")) || 0; }

    function uidTag() { const u = getUser(); return u ? String(u.uid) : "guest"; }
    function cartKey() { return "tuCart_" + uidTag(); }
    function histKey() { return "tuHistory_" + uidTag(); }

    function getCart() { try { return JSON.parse(localStorage.getItem(cartKey())) || []; } catch (e) { return []; } }
    function setCart(c) { localStorage.setItem(cartKey(), JSON.stringify(c)); updateCartCount(); }
    function getHistory() { try { return JSON.parse(localStorage.getItem(histKey())) || []; } catch (e) { return []; } }
    function setHistory(h) { localStorage.setItem(histKey(), JSON.stringify(h)); }

    function nowStr() {
        const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
    }
    function orderId() {
        return "WW" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 900 + 100);
    }

    let selectedPayment = null;
    let pendingItems = [];
    let pendingFromCart = false;

    let qtySelectedItem = null;
    let qtySelectedVal = 1;

    let lastPaymentDetail = null;

    function toast(msg, type) {
        const t = document.createElement("div");
        t.className = "tu-toast" + (type ? " tu-toast-" + type : "");
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(function () { t.classList.add("show"); });
        setTimeout(function () {
            t.classList.remove("show");
            setTimeout(function () { t.remove(); }, 400);
        }, 2600);
    }

    window.logout = function() {
        localStorage.removeItem("currentUser");
        lastUserStr = null; 
        closeAll();          
        renderAccount();     
        updateCartCount();
        renderCart();
        toast("Logged out.", "ok");
    };

    function renderAccount() {
        const user = getUser();
        const uidEl = document.querySelector(".section-top .account .phone-num");
        const nameEl = document.querySelector(".section-top .account .name");
        const serverEl = document.querySelector(".section-top .account .server");
        const switchBtn = document.querySelector(".section-top .account .right");

        const headerUser = document.getElementById("headerUser");
        const exitBtn = document.getElementById("exitBtn");
        const loginLogo = document.querySelector(".right-section .login-logo");

        if (user) {
            if (headerUser) { headerUser.textContent = user.uid; headerUser.style.display = "inline-block"; }
            if (exitBtn) exitBtn.style.display = "inline-block";
            if (loginLogo) loginLogo.style.display = "none";
        } else {
            if (headerUser) { headerUser.textContent = ""; headerUser.style.display = "none"; }
            if (exitBtn) exitBtn.style.display = "none";
            if (loginLogo) loginLogo.style.display = "";
        }

        if (!uidEl || !nameEl || !switchBtn) return;

        if (user) {
            uidEl.textContent = "U" + user.uid;

            let savedName = localStorage.getItem("wuwa_nickname_" + user.uid) || "Rover";
            nameEl.textContent = savedName;

            nameEl.style.cursor = "pointer";
            nameEl.style.textDecoration = "underline";
            nameEl.style.textDecorationColor = "rgba(255,255,255,0.3)";
            nameEl.title = "Click to change your nickname";

            nameEl.onclick = function() {
                let newName = prompt("Enter your new in-game nickname:", nameEl.textContent);
                if (newName && newName.trim() !== "") {
                    let finalName = newName.trim().substring(0, 12);
                    nameEl.textContent = finalName;
                    localStorage.setItem("wuwa_nickname_" + user.uid, finalName);
                }
            };

            if (serverEl) serverEl.textContent = "SEA";
            switchBtn.textContent = "Switch account";
        } else {
            uidEl.textContent = "Not logged in";
            nameEl.textContent = "Guest";
            nameEl.style.cursor = "default";
            nameEl.style.textDecoration = "none";
            nameEl.onclick = null;
            if (serverEl) serverEl.textContent = "—";
            switchBtn.textContent = "Login";
        }

        switchBtn.onclick = function () {
            if (getUser()) {
                window.logout();
                if (typeof loginForm === "function") loginForm();
            } else {
                if (typeof loginForm === "function") loginForm();
            }
        };
    }

    let lastUserStr = localStorage.getItem("currentUser");
    setInterval(function() {
        const curr = localStorage.getItem("currentUser");
        if (curr !== lastUserStr) {
            lastUserStr = curr;
            renderAccount();
            updateCartCount();
            renderCart();
        }
    }, 500);

    function initPayments() {
        const methods = document.querySelectorAll(".payment-method");
        methods.forEach(function (pm) {
            pm.addEventListener("click", function () {
                methods.forEach(function (x) { x.classList.remove("selected"); });
                pm.classList.add("selected");
                const p = pm.querySelector("p");
                selectedPayment = p ? p.textContent.trim() : null;
            });
        });
    }

    function categoryOf(name) {
        const n = name.toLowerCase();
        if (n.indexOf("subscription") > -1 || n.indexOf("monthly") > -1) return "Monthly Pass";
        if (n.indexOf("collection") > -1 || n.indexOf("solvent") > -1 || n.indexOf("sage") > -1) return "Special Bundle";
        if (n.indexOf("lunites") > -1 || n.indexOf("lunite") > -1) return "Lunites";
        return "Other";
    }
    function initTabs() {
        document.querySelectorAll(".top-up-items").forEach(function (item) {
            const nm = item.querySelector(".name");
            item.dataset.category = categoryOf(nm ? nm.textContent.trim() : "");
        });

        const tabs = document.querySelectorAll(".tabs ul li");
        if (tabs.length && !document.querySelector(".tabs ul li.active")) {
            tabs[0].classList.add("active");
        }
        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                tabs.forEach(function (x) { x.classList.remove("active"); });
                tab.classList.add("active");
                const t = tab.textContent.trim();
                document.querySelectorAll(".top-up-items").forEach(function (item) {
                    const show = (t === "ALL") || (item.dataset.category === t);
                    item.style.display = show ? "" : "none";
                });
            });
        });
    }

    function itemFromCard(card) {
        const nameEl = card.querySelector(".name");
        const priceEl = card.querySelector(".price");
        const imgEl = card.querySelector(".img img");
        return {
            name: nameEl ? nameEl.textContent.trim() : "Item",
            price: priceEl ? parsePrice(priceEl.textContent) : 0,
            img: imgEl ? imgEl.getAttribute("src") : ""
        };
    }

    function initItemButtons() {
        document.querySelectorAll(".top-up-items").forEach(function (card) {

            const priceEl = card.querySelector(".price");
            if (priceEl) {
                const val = parsePrice(priceEl.textContent);
                priceEl.innerHTML = "<span>Rp</span> " + val.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            const buyBtn = card.querySelector(".buy-btn");
            const cartBtn = card.querySelector(".cart-btn");
            const item = itemFromCard(card);

            if (buyBtn) {
                buyBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    openConfirm([{ item: item, qty: 1 }], false);
                });
            }
            if (cartBtn) {
                cartBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    openQtyPrompt(item);
                });
            }
        });
    }

    function addToCartCustom(item, qty) {
        const cart = getCart();
        const found = cart.find(function (c) { return c.name === item.name; });
        if (found) {
            found.qty += qty;
            found.selected = true;
        } else {
            cart.push({ name: item.name, price: item.price, img: item.img, qty: qty, selected: true });
        }
        setCart(cart);
        toast(`Added ${qty}x "${item.name}" to cart`, "ok");
    }

    function toggleSelectAll(checked) {
        const cart = getCart();
        cart.forEach(function (c) { c.selected = checked; });
        setCart(cart);
        renderCart();
    }

    function toggleItemSelect(name, checked) {
        const cart = getCart();
        const it = cart.find(function (c) { return c.name === name; });
        if (it) {
            it.selected = checked;
            setCart(cart);
            renderCart();
        }
    }

    function clearCart() {
        if(confirm("Are you sure you want to remove all items from the cart?")) {
            setCart([]);
            renderCart();
        }
    }

    function changeQty(name, delta) {
        const cart = getCart();
        const it = cart.find(function (c) { return c.name === name; });
        if (!it) return;
        it.qty += delta;
        if (it.qty < 1) {
            setCart(cart.filter(function (c) { return c.name !== name; }));
        } else {
            setCart(cart);
        }
        renderCart();
    }

    function updateCartCount() {
        const badge = document.getElementById("tuCartCount");
        if (!badge) return;
        const count = getCart().reduce(function (s, c) { return s + c.qty; }, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }

    function renderCart() {
        const body = document.getElementById("tuCartBody");
        const totalEl = document.getElementById("tuCartTotal");
        if (!body) return;
        const cart = getCart();

        if (cart.length === 0) {
            body.innerHTML = '<div class="tu-cart-empty">Your cart is empty.</div>';
            totalEl.textContent = fmt(0);
            return;
        }

        const allSelected = cart.every(function (c) { return c.selected; });

        body.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #eee;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:bold; color:#555;">
                    <input type="checkbox" id="tuSelectAll" ${allSelected ? 'checked' : ''} style="width:18px; height:18px; accent-color:#d68533; cursor:pointer;">
                    Select all
                </label>
                <button id="tuClearAll" style="background:none; border:none; color:#aeb4c2; cursor:pointer; display:flex; align-items:center; gap:5px; font-size:14px; font-weight:bold; transition:color 0.2s;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Clear all
                </button>
            </div>
            ${cart.map(function (c) {
                return `
                <div class="tu-cart-item" style="display:flex; align-items:center; gap:12px; padding:15px 0; border-bottom:1px solid #f0f0f0;">
                    <input type="checkbox" class="tu-item-check" data-name="${encodeURIComponent(c.name)}" ${c.selected ? 'checked' : ''} style="width:18px; height:18px; accent-color:#d68533; cursor:pointer; flex-shrink:0;">

                    <div class="tu-ci-img" style="width:55px; height:55px; border-radius:6px; background:#f2f2f2; overflow:hidden; flex-shrink:0;">
                        ${c.img ? '<img src="' + c.img + '" style="width:100%; height:100%; object-fit:cover;">' : ""}
                    </div>

                    <div class="tu-ci-info" style="flex:1;">
                        <div class="tu-ci-name" style="font-size:14px; font-weight:bold; color:#333; line-height:1.2; margin-bottom: 5px;">${c.name}</div>

                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                            <div class="tu-ci-price" style="font-size:15px; color:#d68533; font-weight:bold; margin:0;">${fmt(c.price)}</div>
                            <div class="tu-ci-qty" style="display:flex; align-items:center; gap:8px;">
                                <button data-act="dec" data-name="${encodeURIComponent(c.name)}" style="width:28px; height:28px; border:1px solid #ddd; background:#fafafa; border-radius:4px; cursor:pointer; font-weight:bold; color:#444;">&minus;</button>
                                <span style="min-width:24px; text-align:center; font-size:14px; font-weight:bold;">${c.qty}</span>
                                <button data-act="inc" data-name="${encodeURIComponent(c.name)}" style="width:28px; height:28px; border:1px solid #ddd; background:#fafafa; border-radius:4px; cursor:pointer; font-weight:bold; color:#444;">&plus;</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join("")}
        `;

        const selectedTotal = cart.filter(function (c) { return c.selected; }).reduce(function (s, c) { return s + c.price * c.qty; }, 0);
        totalEl.textContent = fmt(selectedTotal);

        document.getElementById("tuSelectAll").addEventListener("change", function(e) {
            toggleSelectAll(e.target.checked);
        });

        document.getElementById("tuClearAll").addEventListener("click", clearCart);

        body.querySelectorAll(".tu-item-check").forEach(function(chk) {
            chk.addEventListener("change", function(e) {
                toggleItemSelect(decodeURIComponent(this.dataset.name), e.target.checked);
            });
        });

        body.querySelectorAll("button[data-act]").forEach(function (b) {
            b.addEventListener("click", function () {
                const name = decodeURIComponent(b.dataset.name);
                const act = b.dataset.act;
                if (act === "inc") changeQty(name, 1);
                else if (act === "dec") changeQty(name, -1);
            });
        });
    }

    function openCart() { renderCart(); openPanel("tuCartDrawer"); }

    function checkout() {
        const cart = getCart();
        const selectedItems = cart.filter(function (c) { return c.selected; });

        if (cart.length === 0) {
            toast("Your cart is empty.", "warn");
            return;
        }
        if (selectedItems.length === 0) {
            toast("Please select at least one item to checkout.", "warn");
            return;
        }

        openConfirm(selectedItems.map(function (c) { return { item: c, qty: c.qty }; }), true);
    }

    function openQtyPrompt(item) {
        qtySelectedItem = item;
        qtySelectedVal = 1;
        document.getElementById("tuQtyName").textContent = item.name;

        const imgEl = document.getElementById("tuQtyImg");
        imgEl.src = item.img;
        imgEl.style.display = item.img ? "inline-block" : "none";

        document.getElementById("tuQtyVal").textContent = qtySelectedVal;
        openPanel("tuQtyModal");
    }

    function openConfirm(list, fromCart) {
        pendingItems = list;
        pendingFromCart = fromCart;

        const body = document.getElementById("tuModalBody");
        const total = list.reduce(function (s, x) { return s + x.item.price * x.qty; }, 0);
        const user = getUser();

        body.innerHTML = `
            <div class="tu-sum-list">
                ${list.map(function (x) {
                    return `<div class="tu-sum-row"><span>${x.item.name} <em>x${x.qty}</em></span><b>${fmt(x.item.price * x.qty)}</b></div>`;
                }).join("")}
            </div>
            <div class="tu-sum-line"><span>Account</span><b>${user ? ("U" + user.uid) : "Not logged in"}</b></div>
            <div class="tu-sum-line"><span>Payment</span><b>${selectedPayment || '<span class="tu-warn-text">Not selected</span>'}</b></div>
            <div class="tu-sum-line tu-sum-total"><span>Total</span><b>${fmt(total)}</b></div>`;

        document.getElementById("tuModalTitle").textContent = "Confirm Purchase";
        const confirmBtn = document.getElementById("tuModalConfirm");
        confirmBtn.textContent = "Pay Now";
        confirmBtn.disabled = false;
        confirmBtn.dataset.mode = "";
        lastPaymentDetail = null;
        openPanel("tuModal");
    }

    function processPurchase() {
        if (!getUser()) {
            toast("Please login first to purchase.", "warn");
            closeAll();
            setTimeout(function () {
                if(typeof loginForm === "function") loginForm();
            }, 1200);
            return;
        }
        if (!selectedPayment) {
            toast("Please choose a payment method first.", "warn");
            return;
        }
        if (!pendingItems.length) return;

        const history = getHistory();
        const oid = orderId();
        pendingItems.forEach(function (x) {
            history.push({
                orderId: oid,
                name: x.item.name,
                qty: x.qty,
                price: x.item.price,
                total: x.item.price * x.qty,
                payment: selectedPayment,
                paymentDetail: lastPaymentDetail ? lastPaymentDetail.label : "",
                date: nowStr()
            });
        });
        setHistory(history);

        if (pendingFromCart) {
            const cart = getCart();
            const remainingCart = cart.filter(function(c) { return !c.selected; });
            setCart(remainingCart);
        }

        updateCartCount();

        const total = pendingItems.reduce(function (s, x) { return s + x.item.price * x.qty; }, 0);
        showSuccess(oid, total);
        pendingItems = [];
        pendingFromCart = false;
    }

    function showSuccess(oid, total) {
        const body = document.getElementById("tuModalBody");
        document.getElementById("tuModalTitle").textContent = "Payment Successful";
        const methodLine = lastPaymentDetail && lastPaymentDetail.label
            ? `<div class="tu-sum-line"><span>Paid via</span><b>${selectedPayment} · ${lastPaymentDetail.label}</b></div>`
            : `<div class="tu-sum-line"><span>Method</span><b>${selectedPayment}</b></div>`;
        body.innerHTML = `
            <div class="tu-success">
                <div class="tu-success-icon">✓</div>
                <p>Your purchase was successful!</p>
                <div class="tu-sum-line"><span>Order ID</span><b>${oid}</b></div>
                <div class="tu-sum-line"><span>Paid</span><b>${fmt(total)}</b></div>
                ${methodLine}
                <small>Log in to the game to claim your items.</small>
            </div>`;
        const confirmBtn = document.getElementById("tuModalConfirm");
        confirmBtn.textContent = "Done";
        confirmBtn.disabled = false;
        confirmBtn.dataset.mode = "done";
    }

    function openPanel(id) {
        document.getElementById("tuOverlay").classList.add("show");
        document.getElementById(id).classList.add("show");
    }
    function closeAll() {
        ["tuOverlay", "tuCartDrawer", "tuModal", "tuQtyModal"].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.classList.remove("show");
        });
        const cb = document.getElementById("tuModalConfirm");
        if (cb) cb.dataset.mode = "";
    }

    function paymentKind(name) {
        const n = (name || "").toLowerCase();
        if (n.indexOf("card") > -1 || n.indexOf("credit") > -1 || n.indexOf("debit") > -1) return "card";
        if (n.indexOf("qris") > -1) return "qris";
        return "ewallet";
    }

    function normalizePhone(raw) {
        let s = String(raw).replace(/[^\d+]/g, "");
        if (s.indexOf("+62") === 0) s = "0" + s.slice(3);
        else if (s.indexOf("62") === 0 && s.charAt(0) !== "0") s = "0" + s.slice(2);
        return s;
    }
    const TU_OPERATORS = [
        { name: "Telkomsel", px: ["0811","0812","0813","0821","0822","0823","0851","0852","0853"] },
        { name: "Indosat",   px: ["0814","0815","0816","0855","0856","0857","0858"] },
        { name: "XL",        px: ["0817","0818","0819","0859","0877","0878"] },
        { name: "Axis",      px: ["0831","0832","0833","0838"] },
        { name: "Tri",       px: ["0895","0896","0897","0898","0899"] },
        { name: "Smartfren", px: ["0881","0882","0883","0884","0885","0886","0887","0888","0889"] }
    ];
    function detectOperator(p) {
        const pre = p.slice(0, 4);
        for (let i = 0; i < TU_OPERATORS.length; i++) {
            if (TU_OPERATORS[i].px.indexOf(pre) > -1) return TU_OPERATORS[i].name;
        }
        return null;
    }
    function validatePhone(raw) {
        const p = normalizePhone(raw);
        if (!p) return { ok: false, msg: "Phone number is required" };
        if (p.indexOf("08") !== 0) return { ok: false, msg: "Number must start with 08" };
        if (p.length < 10 || p.length > 13) return { ok: false, msg: "Number must be 10–13 digits" };
        return { ok: true, value: p, operator: detectOperator(p) };
    }

    function luhnOk(num) {
        let sum = 0, alt = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let d = parseInt(num.charAt(i), 10);
            if (alt) { d *= 2; if (d > 9) d -= 9; }
            sum += d; alt = !alt;
        }
        return sum % 10 === 0;
    }
    function cardScheme(n) {
        if (/^4/.test(n)) return "Visa";
        if (/^(5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(n)) return "Mastercard";
        if (/^3[47]/.test(n)) return "Amex";
        if (/^35(2[89]|[3-8]\d)/.test(n)) return "JCB";
        return null;
    }
    function validateCardNumber(raw) {
        const n = String(raw).replace(/\D/g, "");
        if (!n) return { ok: false, msg: "Card number is required" };
        const scheme = cardScheme(n);
        if (!scheme) return { ok: false, msg: "Card type not recognized" };
        const okLen = scheme === "Amex" ? n.length === 15 : (n.length >= 13 && n.length <= 19);
        if (!okLen) return { ok: false, msg: "Card number length is invalid" };
        if (!luhnOk(n)) return { ok: false, msg: "Card number is invalid" };
        return { ok: true, value: n, scheme: scheme, okMsg: scheme + " card" };
    }
    function validateExpiry(raw) {
        const m = String(raw).match(/^(\d{2})\s*\/\s*(\d{2})$/);
        if (!m) return { ok: false, msg: "Use MM/YY format" };
        const mm = parseInt(m[1], 10), yy = 2000 + parseInt(m[2], 10);
        if (mm < 1 || mm > 12) return { ok: false, msg: "Invalid month" };
        const last = new Date(yy, mm, 0, 23, 59, 59);
        if (last < new Date()) return { ok: false, msg: "Card has expired" };
        return { ok: true, value: m[1] + "/" + m[2] };
    }
    function validateCVV(raw, scheme) {
        const c = String(raw).replace(/\D/g, "");
        const need = scheme === "Amex" ? 4 : 3;
        if (c.length !== need) return { ok: false, msg: "CVV must be " + need + " digits" };
        return { ok: true, value: c };
    }
    function validateName(raw) {
        const v = String(raw).trim();
        if (v.length < 3) return { ok: false, msg: "Cardholder name is required" };
        if (!/^[a-zA-Z .'-]+$/.test(v)) return { ok: false, msg: "Letters only" };
        return { ok: true, value: v.toUpperCase() };
    }

    function maskCard(n) { return "•••• " + n.slice(-4); }
    function maskPhone(p) { return p.slice(0, 4) + "••••" + p.slice(-3); }

    function paintField(fieldId, hintId, r) {
        const f = document.getElementById(fieldId);
        const h = document.getElementById(hintId);
        if (!f || !h) return;
        f.classList.remove("ok", "err");
        if (r.ok === true) { f.classList.add("ok"); h.className = "tu-hint ok"; h.textContent = r.okMsg || "Looks good"; }
        else if (r.ok === false) { f.classList.add("err"); h.className = "tu-hint err"; h.textContent = r.msg; }
        else { h.className = "tu-hint"; h.innerHTML = "&nbsp;"; }
    }
    function paintPhone(r) {
        const f = document.getElementById("tuF-phone");
        const b = document.getElementById("tuPhoneBadge");
        const h = document.getElementById("tuPhoneHint");
        if (!f) return;
        const hasVal = !!document.getElementById("tuPhone").value;
        f.classList.remove("ok", "err");
        if (r.ok) {
            f.classList.add("ok");
            b.hidden = false; b.className = "tu-badge ok";
            b.textContent = r.operator || "Valid";
            h.className = "tu-hint ok"; h.textContent = "Number looks good";
        } else {
            b.hidden = true;
            if (hasVal) { f.classList.add("err"); h.className = "tu-hint err"; h.textContent = r.msg; }
            else { h.className = "tu-hint"; h.textContent = "e.g. 0812 3456 7890"; }
        }
    }

    function openPayDetails() {
        lastPaymentDetail = null;
        const kind = paymentKind(selectedPayment);
        const total = pendingItems.reduce(function (s, x) { return s + x.item.price * x.qty; }, 0);
        const body = document.getElementById("tuModalBody");
        const confirmBtn = document.getElementById("tuModalConfirm");
        document.getElementById("tuModalTitle").textContent = "Payment · " + selectedPayment;
        confirmBtn.dataset.mode = "paydetails";

        const head = '<div class="tu-pay-head"><span>Total to pay</span><b>' + fmt(total) + '</b></div>';

        if (kind === "ewallet") {
            body.innerHTML = head +
                '<p class="tu-pay-note">Enter your ' + selectedPayment +
                ' phone number. A payment request will be pushed to your app to confirm.</p>' +
                '<div class="tu-field" id="tuF-phone">' +
                    '<label>' + selectedPayment + ' Number</label>' +
                    '<div class="tu-input-wrap">' +
                        '<input id="tuPhone" inputmode="numeric" autocomplete="tel" placeholder="08xxxxxxxxxx" maxlength="16">' +
                        '<span class="tu-badge" id="tuPhoneBadge" hidden></span>' +
                    '</div>' +
                    '<div class="tu-hint" id="tuPhoneHint">e.g. 0812 3456 7890</div>' +
                '</div>';
            confirmBtn.textContent = "Pay " + fmt(total);
            confirmBtn.disabled = true;

            const ph = document.getElementById("tuPhone");
            ph.addEventListener("input", function () {
                ph.value = ph.value.replace(/[^\d+]/g, "");
                const r = validatePhone(ph.value);
                paintPhone(r);
                confirmBtn.disabled = !r.ok;
            });
            setTimeout(function () { ph.focus(); }, 60);
        }

        else if (kind === "card") {
            body.innerHTML = head +
                '<p class="tu-pay-note">Your card is processed securely and is never stored on this site.</p>' +
                '<div class="tu-field" id="tuF-cc">' +
                    '<label>Card Number</label>' +
                    '<div class="tu-input-wrap">' +
                        '<input id="tuCC" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="23">' +
                        '<span class="tu-scheme" id="tuScheme" hidden></span>' +
                    '</div>' +
                    '<div class="tu-hint" id="tuCCHint">&nbsp;</div>' +
                '</div>' +
                '<div class="tu-field" id="tuF-name">' +
                    '<label>Cardholder Name</label>' +
                    '<div class="tu-input-wrap"><input id="tuName" placeholder="NAME ON CARD" autocomplete="cc-name"></div>' +
                    '<div class="tu-hint" id="tuNameHint">&nbsp;</div>' +
                '</div>' +
                '<div class="tu-row2">' +
                    '<div class="tu-field" id="tuF-exp">' +
                        '<label>Expiry</label>' +
                        '<div class="tu-input-wrap"><input id="tuExp" inputmode="numeric" placeholder="MM/YY" maxlength="5"></div>' +
                        '<div class="tu-hint" id="tuExpHint">&nbsp;</div>' +
                    '</div>' +
                    '<div class="tu-field" id="tuF-cvv">' +
                        '<label>CVV</label>' +
                        '<div class="tu-input-wrap"><input id="tuCVV" inputmode="numeric" placeholder="123" maxlength="4"></div>' +
                        '<div class="tu-hint" id="tuCVVHint">&nbsp;</div>' +
                    '</div>' +
                '</div>';
            confirmBtn.textContent = "Pay " + fmt(total);
            confirmBtn.disabled = true;

            const cc = document.getElementById("tuCC");
            const nm = document.getElementById("tuName");
            const exp = document.getElementById("tuExp");
            const cvv = document.getElementById("tuCVV");
            let scheme = null;

            function revalidateCard() {
                const ok = validateCardNumber(cc.value).ok &&
                           validateName(nm.value).ok &&
                           validateExpiry(exp.value).ok &&
                           validateCVV(cvv.value, scheme).ok;
                confirmBtn.disabled = !ok;
            }

            cc.addEventListener("input", function () {
                const n = cc.value.replace(/\D/g, "").slice(0, 19);
                cc.value = n.replace(/(.{4})/g, "$1 ").trim();
                const r = validateCardNumber(n);
                scheme = r.scheme || cardScheme(n);
                const chip = document.getElementById("tuScheme");
                if (scheme) { chip.hidden = false; chip.textContent = scheme; chip.className = "tu-scheme s-" + scheme.toLowerCase(); }
                else { chip.hidden = true; }
                paintField("tuF-cc", "tuCCHint", n ? r : { ok: null });
                if (cvv.value) paintField("tuF-cvv", "tuCVVHint", validateCVV(cvv.value, scheme));
                revalidateCard();
            });
            exp.addEventListener("input", function () {
                let v = exp.value.replace(/\D/g, "").slice(0, 4);
                if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                exp.value = v;
                paintField("tuF-exp", "tuExpHint", v.length === 5 ? validateExpiry(v) : { ok: null });
                revalidateCard();
            });
            cvv.addEventListener("input", function () {
                cvv.value = cvv.value.replace(/\D/g, "");
                paintField("tuF-cvv", "tuCVVHint", cvv.value ? validateCVV(cvv.value, scheme) : { ok: null });
                revalidateCard();
            });
            nm.addEventListener("input", function () {
                paintField("tuF-name", "tuNameHint", nm.value ? validateName(nm.value) : { ok: null });
                revalidateCard();
            });
            setTimeout(function () { cc.focus(); }, 60);
        }

        else {
            const qid = orderId();
            body.innerHTML = head +
                '<p class="tu-pay-note">Scan this QRIS code with any bank or e-wallet app, then tap the button below.</p>' +
                '<canvas class="tu-qr" id="tuQR" width="200" height="200"></canvas>' +
                '<div class="tu-qr-cap">QRIS · ' + qid + '</div>';
            confirmBtn.textContent = "I have paid";
            confirmBtn.disabled = false;
            drawQR("tuQR", qid + "|" + total);
        }
    }

    function submitPayDetails() {
        const kind = paymentKind(selectedPayment);

        if (kind === "ewallet") {
            const r = validatePhone(document.getElementById("tuPhone").value);
            if (!r.ok) { paintPhone(r); toast(r.msg, "warn"); return; }
            lastPaymentDetail = { label: maskPhone(r.value) };
        }
        else if (kind === "card") {
            const rawCC = document.getElementById("tuCC").value;
            const scheme = cardScheme(rawCC.replace(/\D/g, ""));
            const rc = validateCardNumber(rawCC);
            const rn = validateName(document.getElementById("tuName").value);
            const re = validateExpiry(document.getElementById("tuExp").value);
            const rv = validateCVV(document.getElementById("tuCVV").value, scheme);
            if (!(rc.ok && rn.ok && re.ok && rv.ok)) {
                paintField("tuF-cc", "tuCCHint", rc);
                paintField("tuF-name", "tuNameHint", rn);
                paintField("tuF-exp", "tuExpHint", re);
                paintField("tuF-cvv", "tuCVVHint", rv);
                toast("Please check your card details", "warn");
                return;
            }
            lastPaymentDetail = { label: rc.scheme + " " + maskCard(rc.value) };
        }
        else {
            lastPaymentDetail = { label: "QRIS" };
        }

        processPurchase();
    }

    function drawQR(canvasId, str) {
        const c = document.getElementById(canvasId); if (!c) return;
        const ctx = c.getContext("2d"), N = 25, cell = c.width / N;
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        let seed = h >>> 0;
        const rnd = function () { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
        const g = [];
        for (let y = 0; y < N; y++) { const row = []; for (let x = 0; x < N; x++) row.push(rnd() > 0.5 ? 1 : 0); g.push(row); }
        const finder = function (ox, oy) {
            for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
                const edge = (x === 0 || x === 6 || y === 0 || y === 6);
                const core = (x > 1 && x < 5 && y > 1 && y < 5);
                g[oy + y][ox + x] = (edge || core) ? 1 : 0;
            }
        };
        finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#2b2b2b";
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (g[y][x]) ctx.fillRect(x * cell, y * cell, cell, cell);
    }

    function startPayment() {
        if (!getUser()) {
            toast("Please login first to purchase.", "warn");
            closeAll();
            setTimeout(function () { if (typeof loginForm === "function") loginForm(); }, 1200);
            return;
        }
        if (!selectedPayment) {
            toast("Please choose a payment method first.", "warn");
            return;
        }
        if (!pendingItems.length) return;
        openPayDetails();
    }

    function buildUI() {
        const fab = document.createElement("button");
        fab.className = "tu-cart-fab";
        fab.type = "button";
        fab.innerHTML = '<span class="tu-cart-ic">🛒</span><span class="tu-cart-count" id="tuCartCount">0</span>';
        fab.addEventListener("click", openCart);
        document.body.appendChild(fab);

        const wrap = document.createElement("div");
        wrap.innerHTML = `
            <div class="tu-overlay" id="tuOverlay"></div>

            <aside class="tu-cart-drawer" id="tuCartDrawer" aria-label="Cart">
                <div class="tu-cart-head">
                    <h3>Your Cart</h3>
                    <button class="tu-close" id="tuCartClose" type="button">&times;</button>
                </div>
                <div class="tu-cart-body" id="tuCartBody"></div>
                <div class="tu-cart-foot">
                    <div class="tu-cart-total"><span>Total</span><b id="tuCartTotal">Rp 0.00</b></div>
                    <button class="tu-checkout" id="tuCheckout" type="button">Checkout</button>
                </div>
            </aside>

            <div class="tu-modal" id="tuModal" role="dialog" aria-modal="true">
                <div class="tu-modal-box">
                    <h3 id="tuModalTitle">Confirm Purchase</h3>
                    <div class="tu-modal-body" id="tuModalBody"></div>
                    <div class="tu-modal-actions">
                        <button class="tu-btn-cancel" id="tuModalCancel" type="button">Cancel</button>
                        <button class="tu-btn-confirm" id="tuModalConfirm" type="button">Pay Now</button>
                    </div>
                </div>
            </div>

            <div class="tu-modal" id="tuQtyModal" role="dialog" aria-modal="true">
                <div class="tu-modal-box" style="max-width: 320px; text-align: center;">
                    <h3 style="font-size: 20px; margin-bottom: 15px;">Add to Cart</h3>
                    <img id="tuQtyImg" src="" style="width: 80px; height: 80px; border-radius: 8px; margin-bottom: 10px; background: #3a3a3a; object-fit: contain;">
                    <p id="tuQtyName" style="font-weight: bold; color: #333; margin-bottom: 20px; font-size: 16px;"></p>

                    <div class="tu-ci-qty" style="justify-content: center; gap: 20px; margin-bottom: 25px;">
                        <button id="tuQtyDec" type="button" style="width: 35px; height: 35px; font-size: 20px;">&minus;</button>
                        <span id="tuQtyVal" style="font-size: 22px;">1</span>
                        <button id="tuQtyInc" type="button" style="width: 35px; height: 35px; font-size: 20px;">+</button>
                    </div>

                    <div class="tu-modal-actions" style="margin-top: 0;">
                        <button class="tu-btn-cancel" id="tuQtyCancel" type="button">Cancel</button>
                        <button class="tu-btn-confirm" id="tuQtyConfirm" type="button">Add Item</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(wrap);

        document.getElementById("tuOverlay").addEventListener("click", closeAll);
        document.getElementById("tuCartClose").addEventListener("click", closeAll);
        document.getElementById("tuCheckout").addEventListener("click", checkout);

        document.getElementById("tuModalCancel").addEventListener("click", closeAll);
        document.getElementById("tuModalConfirm").addEventListener("click", function () {
            const mode = this.dataset.mode;
            if (mode === "done") { closeAll(); return; }
            if (mode === "paydetails") { submitPayDetails(); return; }
            startPayment();
        });

        document.getElementById("tuQtyDec").addEventListener("click", function() {
            if (qtySelectedVal > 1) {
                qtySelectedVal--;
                document.getElementById("tuQtyVal").textContent = qtySelectedVal;
            }
        });
        document.getElementById("tuQtyInc").addEventListener("click", function() {
            qtySelectedVal++;
            document.getElementById("tuQtyVal").textContent = qtySelectedVal;
        });
        document.getElementById("tuQtyCancel").addEventListener("click", closeAll);
        document.getElementById("tuQtyConfirm").addEventListener("click", function() {
            addToCartCustom(qtySelectedItem, qtySelectedVal);
            closeAll();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeAll();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        buildUI();
        renderAccount();
        initPayments();
        initTabs();
        initItemButtons();
        updateCartCount();
    });
})();