const loginRegisterModal = document.querySelector('#loginRegisterModal');
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const { loginUsername, loginPassword } = loginForm.elements;
const { firstname, lastname, email, idNumber, registerUsername, registerPassword } = registerForm.elements;
const showRegisterFormBtn = document.querySelector('#showRegisterFormBtn');
const showLoginFormBtn = document.querySelector('#showLoginFormBtn');
const body = document.querySelector('body');

showRegisterFormBtn.addEventListener('click', () => {
    Array.from(loginForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    loginForm.classList.add('d-none');
    registerForm.classList.remove('d-none');
});

showLoginFormBtn.addEventListener('click', () => {
    Array.from(registerForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    registerForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        if (!e.target.checkValidity()) {
            e.stopPropagation();
            e.target.classList.add('was-validated');
            setTimeout(() => e.target.classList.remove('was-validated'), 1500);
        } else {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: loginUsername.value,
                    password: loginPassword.value
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                location.href = data.redirectUrl;
            } else if (res.status === 401) {
                throw '401 Unauthorized';
            } else {
                throw 'Error' + res.status;
            }
    
        }
    } catch(err) { console.log(err) }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated');
        setTimeout(() => e.target.classList.remove('was-validated'), 1500);
    } else {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value,
                idNumber: idNumber.value,
                username: registerUsername.value,
                password: registerPassword.value
            })
        });
        const data = await res.json();
        // console.log(data);
        if (!data.success && data.errorIn === 'email') {
            email.nextElementSibling.nextElementSibling.innerText = data.message;
            email.classList.add('is-invalid');
            setTimeout(() => {
                email.classList.remove('is-invalid')
                email.nextElementSibling.nextElementSibling.innerText = 'Email is required';
            }, 1500);
        } else if (!data.success && data.errorIn === 'username') {
            registerUsername.nextElementSibling.nextElementSibling.innerText = data.message;
            registerUsername.classList.add('is-invalid');
            setTimeout(() => {
                registerUsername.classList.remove('is-invalid')
                registerUsername.nextElementSibling.nextElementSibling.innerText = 'Username is required';
            }, 1500);
        } else {
            Array.from(registerForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
            bootstrap.Modal.getInstance(loginRegisterModal).hide();

            const div = document.createElement('div');
            div.className = 'toast show position-fixed bottom-0 end-0 bg-primary text-white m-2';
            div.innerHTML = `<div class='toast-body'>${data.message}</div>`;
            body.appendChild(div);
            setTimeout(() => { 
                div.remove();
                registerForm.classList.add('d-none');
                loginForm.classList.remove('d-none');
                bootstrap.Modal.getInstance(loginRegisterModal).show();
             }, 1500);
        }   
    }
});
