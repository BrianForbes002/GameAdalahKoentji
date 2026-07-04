let loginOpen = false;

const menus = document.querySelectorAll('.menu');
menus.forEach(menu=>{
    if(menu.href === window.location.href){
        menu.classList.add('active');
    }
});

const audio = new Audio('music/A Small Miracle (Full Ver.) _ Aemeath Theme Song _ Wuthering Waves 3.1 OST [7diPtEM_AKk].mp3');
audio.loop = true;
const logos = document.querySelectorAll('.music-logos');
let isPlaying = false;
function playMusic() {
    if (isPlaying) {
        logos.forEach(logo =>{
            logo.classList.add('paused');
        })
        audio.pause();
        isPlaying = false;
    } else {
        logos.forEach(logo =>{
            logo.classList.remove('paused');
        })
        audio.play();
        isPlaying = true;
    }
}

const login = document.querySelector('.login-page');
function loginForm() {
    loginOpen = true;
    login.classList.add("active");
    document.body.style.overflow = "hidden";
}

const formLogin = document.getElementById('formLogin');
const login_form_content_main = document.querySelector('.login-form-content-main');
const login_form_content_more = document.querySelector('.login-form-content-more');
const login_back_button = document.querySelector('.back-button');
const login_form_forgot_password = document.querySelector('.login-form-forgot-password');
const login_form_register = document.querySelector('.login-form-register'); 
const errorEl = document.getElementById('formError');

function getUsers() {
    const data = localStorage.getItem('wuwaUsers');
    return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
    localStorage.setItem('wuwaUsers', JSON.stringify(users));
}


function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

const DEFAULT_ADMIN_EMAILS = ['admin@wuwa.com'];

const ADMIN_CODE = 'WUWA-ADMIN-2026';

function isAdmin(user) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return DEFAULT_ADMIN_EMAILS.includes(String(user.email).toLowerCase());
}

function seedAdminAccount() {
    const users = getUsers();
    const adminExists = users.some(function (u) {
        return u.email.toLowerCase() === 'admin@wuwa.com';
    });
    if (!adminExists) {
        users.push({
            id: Date.now(),
            uid: 100000001,  
            email: 'admin@wuwa.com',
            password: 'admin123' 
        });
        saveUsers(users);
    }
}

function initAdminHelp() {
    const btn = document.querySelector('.admin-help-btn');
    const panel = document.querySelector('.admin-help-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation(); 
        panel.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
        if (!panel.contains(e.target) && e.target !== btn) {
            panel.classList.remove('open'); 
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') panel.classList.remove('open');
    });
}

function openMoreLogin() {
    login_form_content_main.style.display = 'none';
    login_form_content_more.style.display = 'flex';
    login_back_button.style.opacity = 1;
    login_back_button.style.pointerEvents = 'visible';
    errorEl.textContent = '';
}

function backMain() {
    login_form_content_main.style.display = 'flex';
    login_form_content_more.style.display = 'none';
    login_form_forgot_password.style.display = 'none';
    login_form_register.style.display = 'none';
    login_back_button.style.opacity = 0;
    login_back_button.style.pointerEvents = 'none';
    errorEl.textContent = '';
    formLogin.reset();
}

function closeLoginForm() {
    loginOpen = false;
    login.classList.remove('active');
    login_form_content_main.style.display = 'flex';
    login_form_content_more.style.display = 'none';
    login_form_forgot_password.style.display = 'none';
    login_form_register.style.display = 'none';
    formLogin.reset();
    document.body.style.overflow = "";
    errorEl.textContent = '';
}

function forgot_password() {
    login_form_forgot_password.style.display = 'flex';
    login_form_content_main.style.display = 'none';
    login_back_button.style.opacity = 1;
    login_back_button.style.pointerEvents = 'visible';
    errorEl.textContent = '';
}

function register() {
    login_form_register.style.display = 'flex';
    login_form_content_main.style.display = 'none';
    login_back_button.style.opacity = 1;
    login_back_button.style.pointerEvents = 'visible';
    errorEl.textContent = '';
    resetAdminCodeField();
}

function resetAdminCodeField() {
    const wrap = document.getElementById('adminCodeWrap');
    const input = document.getElementById('register-admin-code');
    const toggle = document.getElementById('adminToggle');
    if (wrap) wrap.style.display = 'none';
    if (input) input.value = '';
    if (toggle) toggle.textContent = 'Daftar sebagai admin?';
}

function toggleAdminCode() {
    const wrap = document.getElementById('adminCodeWrap');
    const toggle = document.getElementById('adminToggle');
    if (!wrap) return;
    const hidden = window.getComputedStyle(wrap).display === 'none';
    if (hidden) {
        wrap.style.display = 'block';
        if (toggle) toggle.textContent = 'Batal daftar sebagai admin';
    } else {
        wrap.style.display = 'none';
        const input = document.getElementById('register-admin-code');
        if (input) input.value = '';
        if (toggle) toggle.textContent = 'Daftar sebagai admin?';
    }
}

let forgotCode = '';
function get_forgot_vcode() {
    const forgot_email = document.getElementById('forgot-email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorEl = document.getElementById('formError');
    if (!forgot_email || !emailPattern.test(forgot_email)) {
        errorEl.textContent = 'Please enter a valid email address!';
        return;
    } else {
        errorEl.textContent = '';
    }

    const users = getUsers();
    const user = users.find(function(item){
        return item.email === forgot_email;
    });

    if (!user) {
        errorEl.textContent = 'Account not found!';
        return;
    }

    forgotCode = Math.floor(100000 + Math.random() * 900000).toString();
    alert('Your verification code is: ' + forgotCode);
}


let registerCode = '';
function get_register_vcode() {
    const register_email = document.getElementById('register-email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorEl = document.getElementById('formError');
    if (!register_email || !emailPattern.test(register_email)) {
        errorEl.textContent = 'Please enter a valid email address!';
        return;
    } else {
        errorEl.textContent = '';
    }

    registerCode = Math.floor(100000 + Math.random() * 900000).toString();
    alert('Your verification code is: ' + registerCode);
}
    

function initFormLogin() {
    const formLogin = document.getElementById('formLogin');
    if (!formLogin) return; 

    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const checkMain = document.getElementById('checkMain').checked;
        const checkMore = document.getElementById('checkMore').checked;

        const forgot_email = document.getElementById('forgot-email').value.trim();
        const forgot_vcode =  document.getElementById('forgot-vcode').value.trim();
        const forgot_new_password =  document.getElementById('forgot-new-password').value.trim();
        const forgot_confirm_password =  document.getElementById('forgot-confirm-password').value.trim();

        const register_email = document.getElementById('register-email').value.trim();
        const register_vcode =  document.getElementById('register-vcode').value.trim();
        const register_password =  document.getElementById('register-password').value.trim();
        const register_confirm_password =  document.getElementById('register-confirm-password').value.trim();
        const checkRegister = document.getElementById('checkRegister').checked;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errorEl = document.getElementById('formError');
        errorEl.textContent = '';
        
        if (login_form_forgot_password.style.display === 'flex') {

            if (!forgot_email || !forgot_vcode || !forgot_new_password || !forgot_confirm_password) {
                errorEl.textContent = 'All fields are required!';
                return;
            }

            if (!emailPattern.test(forgot_email)) {
                errorEl.textContent = 'Please enter a valid email address!';
                return;
            }

            if (!forgotCode) {
                errorEl.textContent = 'Please get verification code first!';
                return;
            }

            if (forgot_vcode !== forgotCode) {
                errorEl.textContent = 'Verification code is wrong!';
                return;
            }

            if (forgot_new_password !==forgot_confirm_password) {
                errorEl.textContent = 'Passwords do not match!';
                return;
            }

            const users = getUsers();

            const userIndex =
                users.findIndex(function(user){
                    return (user.email === forgot_email);
                });

            if (userIndex === -1) {
                errorEl.textContent = 'Account not found!';
                return;
            }

            users[userIndex].password = forgot_new_password;

            saveUsers(users);

            alert('Password updated!');

            forgotCode = '';

            backMain();

            return;

        } else if (login_form_register.style.display === 'flex') {

            if (!register_email || !register_vcode || !register_password || !register_confirm_password || !checkRegister) {
                errorEl.textContent = 'All fields are required!';
                return;
            }

            if (!emailPattern.test(register_email)) {
                errorEl.textContent = 'Please enter a valid email address!';
                return;
            }

            if (!registerCode) {
                errorEl.textContent = 'Please get verification code first!';
                return;
            }

            if (register_vcode !== registerCode) {
                errorEl.textContent = 'Verification code is wrong!';
                return;
            }

            if (register_password !== register_confirm_password) {
                errorEl.textContent = 'Passwords do not match!';
                return;
            }

            const users = getUsers();

            const emailExist =
                users.find(function(user){
                    return (user.email === register_email);
                });

            if (emailExist) {
                errorEl.textContent = 'Email already registered!';
                return;
            }

            const asAdmin = document.getElementById('register-admin-code').value.trim() === ADMIN_CODE;

            users.push({
                id: Date.now(),
                uid: Math.floor(100000000 + Math.random() * 900000000),
                email: register_email,
                password: register_password,
                role: asAdmin ? 'admin' : 'user'
            });
            
            saveUsers(users);

            alert('Register successful!');

            registerCode = '';

            backMain();

            return;
        }

        else {

            if (!email || !password || !checkMain) {
                errorEl.textContent = 'All fields are required!';
                return;
            }

            if (!emailPattern.test(email)) {
                errorEl.textContent = 'Please enter a valid email address!';
                return;
            }

            const users = getUsers();

            const user =
                users.find(function(item){
                    return item.email === email;
                });

            if (!user) {
                errorEl.textContent = 'Account not found!';
                return;
            }

            if (user.password !== password) {
                errorEl.textContent = 'Account not found!';
                return;
            }

            saveCurrentUser(user);

            closeLoginForm();

            const supportData = JSON.parse(localStorage.getItem("support") || "[]");
            const hasNotification = supportData.some(function(ticket) {
                return ticket.email === user.email && ticket.hasUnreadReply === true;
            });

            if (hasNotification) {
                setTimeout(function() {
                    showCustomNotification("System Alert: You have a new reply from Admin! Please check the Support page.");
                }, 400);
            }

            if (isAdmin(user)) {
                window.location.href = "admin.html";
                return;
            }

            updateHeaderUser();

            if (window.loadEmail) {
                loadEmail();
            }

            if (window.renderSupportTable) {
                renderSupportTable();
            }

            return;
        }
    });
}

function updateHeaderUser() {
    const user = getCurrentUser();

    const headerUser = document.getElementById('headerUser');
    const exitBtn = document.getElementById('exitBtn');
    const loginBtn = document.querySelector('.login-logo');

    if (!headerUser || !exitBtn) return;

    if (user) {
        headerUser.textContent = user.uid;

        exitBtn.style.display = 'inline-block';

        if (loginBtn) {
            loginBtn.style.display = 'none';
        }

    } else {
        headerUser.textContent = '';

        exitBtn.style.display = 'none';

        if (loginBtn) {
            loginBtn.style.display = 'flex';
        }
    }

    updateSupportNotifDot();
}

function logout() {
    localStorage.removeItem("currentUser");

    if (typeof editId !== "undefined") {
        editId = null;
        editData = null;
    }

    updateHeaderUser();

    if (typeof resetSupportForm === "function") {
        resetSupportForm();
    }

    if (typeof renderSupportTable === "function") {
        renderSupportTable();
    }
}

function showCustomNotification(message) {
    const notif = document.createElement("div");
    notif.style.position = "fixed";
    notif.style.top = "100px";
    notif.style.right = "30px";
    if (window.innerWidth <= 480) {
        notif.style.left = "30px";
    } else if (window.innerWidth <= 768) {
        notif.style.left = "60px";
    }
    notif.style.background = "rgba(10, 20, 50, 0.9)";
    notif.style.border = "1px solid #00e5ff";
    notif.style.color = "white";
    notif.style.padding = "15px 25px";
    notif.style.borderRadius = "8px";
    notif.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.4)";
    notif.style.zIndex = "999999";
    notif.style.fontWeight = "bold";
    notif.style.transform = "translateX(200%)"; 
    notif.style.transition = "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)";
    notif.innerHTML = "🔔 " + message;

    document.body.appendChild(notif);

    setTimeout(function() {
        notif.style.transform = "translateX(0)";
    }, 100);

    setTimeout(function() {
        notif.style.transform = "translateX(200%)";
        setTimeout(function() {
            notif.remove();
        }, 500); 
    }, 5000);
}

function updateSupportNotifDot() {
    const supportMenu = document.querySelector('a.menu[href="support.html"]');
    if (!supportMenu) return;

    const user = getCurrentUser();
    if (!user) {
        supportMenu.classList.remove("has-notif");
        return;
    }

    const supportData = JSON.parse(localStorage.getItem("support") || "[]");
    
    const hasNotification = supportData.some(function(ticket) {
        return ticket.email === user.email && ticket.hasUnreadReply === true;
    });

    if (hasNotification) {
        supportMenu.classList.add("has-notif");
    } else {
        supportMenu.classList.remove("has-notif");
    }
}

document.addEventListener('DOMContentLoaded', function () { 
    seedAdminAccount();
    initFormLogin();
    updateHeaderUser();
    initAdminHelp();
});

window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) e.preventDefault();  
}, { passive: false });

window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) &&
        ['+', '-', '=', '0'].includes(e.key)) {
        e.preventDefault();
    }
});

['gesturestart', 'gesturechange', 'gestureend'].forEach(function (evt) {
    document.addEventListener(evt, function (e) { e.preventDefault(); }); 
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault(); 
    lastTouchEnd = now;
}, { passive: false });