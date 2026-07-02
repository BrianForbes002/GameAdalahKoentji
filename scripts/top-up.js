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
        window.location.href = "index.html"; 
    };

    function renderAccount() {
        const user = getUser();
        const uidEl = document.querySelector(".section-top .account .phone-num");
        const nameEl = document.querySelector(".section-top .account .name");
        const serverEl = document.querySelector(".section-top .account .server");
        const switchBtn = document.querySelector(".section-top .account .right");

        const headerUser = document.getElementById("headerUser");
        if (headerUser) {
            headerUser.textContent = user ? user.uid : "";
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
                if (confirm("Switch account? You will be logged out and sent to the home page to log in again.")) {
                    window.logout();
                }
            } else {
                if(typeof loginForm === "function") loginForm();
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
        body.innerHTML = `
            <div class="tu-success">
                <div class="tu-success-icon">✓</div>
                <p>Your purchase was successful!</p>
                <div class="tu-sum-line"><span>Order ID</span><b>${oid}</b></div>
                <div class="tu-sum-line"><span>Paid</span><b>${fmt(total)}</b></div>
                <div class="tu-sum-line"><span>Method</span><b>${selectedPayment}</b></div>
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
            if (this.dataset.mode === "done") { closeAll(); return; }
            processPurchase();
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