
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phoneNo = document.getElementById('phoneNo').value;
    const messageElement = document.getElementById('message');

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, phoneNo })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.href = '/'; // Redirect to login page
        } else {
            messageElement.textContent = data.message;
            messageElement.style.color = 'red';
        }
    })
    .catch(error => {
        messageElement.textContent = 'Error registering user!';
        messageElement.style.color = 'red';
        console.error('Error:', error);
    });
}
