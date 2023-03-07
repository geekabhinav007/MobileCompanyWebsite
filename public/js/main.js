

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', e => {
    e.preventDefault();

    // Send a request to the server-side logout route using fetch
    fetch('/logout', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(data => {
            window.location.href = 'index.html'; // Redirect to login.html
        })
        .catch(err => console.log(err));
});
