document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.google-login');

    // 检查是否已登录
    function checkLoginStatus() {
        const user = localStorage.getItem('user');
        if (user) {
            loginBtn.textContent = '已登录';
            loginBtn.classList.add('logged-in');
            return true;
        }
        return false;
    }

    // 更新登录状态
    function updateLoginState(isLoggedIn, userData) {
        if (isLoggedIn) {
            localStorage.setItem('user', JSON.stringify(userData));
            loginBtn.textContent = '已登录';
            loginBtn.classList.add('logged-in');
            loginModal.style.display = "none";
        } else {
            localStorage.removeItem('user');
            loginBtn.textContent = '登录';
            loginBtn.classList.remove('logged-in');
        }
    }

    // 打开登录弹窗
    loginBtn.onclick = function() {
        console.log('点击登录按钮'); // 添加调试日志
        if (checkLoginStatus()) {
            // 如果已登录，点击按钮变成登出
            if (confirm('确定要退出登录吗？')) {
                updateLoginState(false);
            }
        } else {
            loginModal.style.display = "block";
        }
    }

    // 关闭登录弹窗
    closeBtn.onclick = function() {
        loginModal.style.display = "none";
    }

    // 点击弹窗外部关闭
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
    }

    // 处理登录表单提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 模拟登录验证（这里可以替换为真实的后端验证）
        if (email === 'test@example.com' && password === 'password') {
            const userData = {
                email: email,
                name: '测试用户',
                avatar: './images/user-avatar.svg'
            };
            updateLoginState(true, userData);
            alert('登录成功！');
        } else {
            alert('邮箱或密码错误！\n(测试账号: test@example.com / password)');
        }
    });

    // 处理谷歌登录按钮点击
    googleBtn.addEventListener('click', () => {
        alert('Google登录功能开发中...');
    });

    // 初始化检查登录状态
    checkLoginStatus();
}); 