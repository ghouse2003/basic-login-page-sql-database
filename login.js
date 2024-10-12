function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Login successful, redirecting...');
            window.location.href = './FinalPage.html'; 
            
        } else {
            messageElement.textContent = 'Login failed! User does not exist.';
            messageElement.style.color = 'red';
        }
    })
    .catch(error => {
        messageElement.textContent = 'Error logging in!';
        messageElement.style.color = 'red';
        console.error('Error:', error);
    });
}
