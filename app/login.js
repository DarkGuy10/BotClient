const tokenField = document.querySelector('#tokenField');
const loginForm = document.querySelector('#loginForm');
const buttonText = document.querySelector('#loginSubmit span');
const {ipcRenderer} = require('electron');

loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const token = tokenField.value;
    buttonText.innerText = 'Logging in...';
    ipcRenderer.send('login', token);
});

ipcRenderer.on('login', (event, clientUser, token) => {
    buttonText.innerHTML = `Succesfully logged in as: <b>${clientUser}</b>`;
    buttonText.parentElement.classList.add('success');
    window.localStorage.setItem('token', token);
    setTimeout(() => {window.location.assign('index.html');}, 2000)
});

ipcRenderer.on('error', (event, code, message) => {
    alert(`${code} ${message}`);
    buttonText.innerText = `Login`;
});