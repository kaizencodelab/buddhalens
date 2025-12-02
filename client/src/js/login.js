import { auth, googleProvider } from '../config/firebase.js';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

// Google Login
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // The signed-in user info.
            const user = result.user;
            console.log("User signed in: ", user.email);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("Google Sign-In failed: " + error.message);
        }
    });
}

// Email/Password Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed: " + error.message);
        }
    });
}
