document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginLoader = document.getElementById('loginLoader');
    const btnText = loginForm.querySelector('button span');

    // Check if already logged in
    if (localStorage.getItem('healthos_token')) {
        window.location.href = 'index.html';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        loginError.style.display = 'none';
        btnText.style.display = 'none';
        loginLoader.style.display = 'block';

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        // ──────────────────────────────────────────
        // 1. Try to authenticate against accounts
        //    stored locally during sign-up (no backend needed)
        // ──────────────────────────────────────────
        const usersRaw = localStorage.getItem('healthos_users');
        if (usersRaw) {
            try {
                const users = JSON.parse(usersRaw);
                const match = users.find(u =>
                    u.email.toLowerCase() === email && u.password === password
                );
                if (match) {
                    localStorage.setItem('healthos_token', 'local-auth-token-' + Date.now());
                    localStorage.setItem('healthos_user', JSON.stringify({
                        name: match.name || match.firstName,
                        email: match.email
                    }));
                    await new Promise(r => setTimeout(r, 500));
                    window.location.href = 'index.html';
                    return;
                } else {
                    // Email found but password wrong
                    const emailExists = users.find(u => u.email.toLowerCase() === email);
                    if (emailExists) {
                        showLoginError('Incorrect password. Please try again.');
                        return;
                    }
                }
            } catch (e) { /* ignore parse error */ }
        }

        // ──────────────────────────────────────────
        // 2. Try old single-user token (compatibility)
        // ──────────────────────────────────────────
        const singleUser = localStorage.getItem('healthos_registered_email');
        const singlePass = localStorage.getItem('healthos_registered_password');
        if (singleUser && singlePass && email === singleUser && password === singlePass) {
            localStorage.setItem('healthos_token', 'local-auth-token-' + Date.now());
            await new Promise(r => setTimeout(r, 500));
            window.location.href = 'index.html';
            return;
        }

        // ──────────────────────────────────────────
        // 3. Built-in demo account (works offline)
        // ──────────────────────────────────────────
        if (email === 'user@example.com' && password === 'password123') {
            localStorage.setItem('healthos_token', 'demo-token-' + Date.now());
            localStorage.setItem('healthos_user', JSON.stringify({ name: 'Alex', email }));
            await new Promise(r => setTimeout(r, 500));
            window.location.href = 'index.html';
            return;
        }

        // ──────────────────────────────────────────
        // 4. Try Flask backend (if running)
        // ──────────────────────────────────────────
        try {
            const apiUrl = 'http://localhost:5000/api/login';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('healthos_token', data.token);
                localStorage.setItem('healthos_user', JSON.stringify(data.user));
                await new Promise(r => setTimeout(r, 500));
                window.location.href = 'index.html';
                return;
            }
        } catch (err) {
            // Backend offline — that's fine, continue to error
        }

        showLoginError('Account not found. Please sign up first or check your credentials.');
    });

    function showLoginError(msg) {
        loginError.textContent = msg;
        loginError.style.display = 'block';
        if (btnText) btnText.style.display = 'block';
        if (loginLoader) loginLoader.style.display = 'none';
    }
});
