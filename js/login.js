import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.google-login');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // 处理表单提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('登录成功:', userCredential.user);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('登录失败:', error);
            alert('登录失败: ' + error.message);
        }
    });

    // Google登录
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('Google登录成功:', result.user);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Google登录失败:', error);
            alert('Google登录失败: ' + error.message);
        }
    });

    // 切换密码显示
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('img').src = 
            `../images/icons/${type === 'password' ? 'eye' : 'eye-off'}.svg`;
    });
}); 