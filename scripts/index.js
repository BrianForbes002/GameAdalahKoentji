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
    login.classList.add('active');   
}

document.addEventListener('click', function(e){
    const before = document.querySelector('.patch_notes_before');
    const after = document.querySelector('.patch_notes_after');

    if (!before || !after) return;

    if(!e.target.closest('.header') && !e.target.closest('.download-grid') && !e.target.closest('.social-media')) {
        before.style.display = 'none';
        after.style.display = 'flex';
    }
});

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
    login.classList.remove('active');
    login_form_content_main.style.display = 'flex';
    login_form_content_more.style.display = 'none';
    login_form_forgot_password.style.display = 'none';
    login_form_register.style.display = 'none';
    formLogin.reset();
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

            users.push({
                id: Date.now(),
                uid: Math.floor(100000000 + Math.random() * 900000000),
                email: register_email,
                password: register_password
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
                errorEl.textContent = 'Wrong password!';
                return;
            }

            saveCurrentUser(user);

            updateHeaderUser();

            closeLoginForm();

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
}

function logout() {
    localStorage.removeItem('currentUser');
    updateHeaderUser();
}

document.addEventListener('DOMContentLoaded', function () { 
    initFormLogin();
    updateHeaderUser();
});