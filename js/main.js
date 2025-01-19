document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typingIndicator');

    // 从配置文件获取API配置
    const { API_ENDPOINT, API_KEY } = config;

    // 显示欢迎消息
    showWelcomeMessage();

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';
            typingIndicator.classList.add('visible');
            
            try {
                console.log('Sending request to:', config.API_ENDPOINT);
                const response = await fetch(config.API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "Pro/Qwen/Qwen2-VL-7B-Instruct",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: "你是一个专业的美妆顾问，精通化妆、护肤和美容知识。请用温柔友善的语气回答问题，并在合适的时候给出具体的产品推荐。"
                                    }
                                ]
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: message
                                    }
                                ]
                            }
                        ],
                        frequency_penalty: 1,
                        max_tokens: 2000,
                        n: 1,
                        response_format: {
                            type: "text"
                        },
                        stream: false,
                        temperature: 0.7,
                        top_k: 1,
                        top_p: 1
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Response Error:', response.status, errorText);
                    throw new Error(`API responded with status ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                console.log('API Response:', data);
                
                typingIndicator.classList.remove('visible');
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    addMessage(data.choices[0].message.content, 'ai');
                } else {
                    console.error('Invalid API response structure:', data);
                    throw new Error('Invalid response structure from API');
                }
            } catch (error) {
                console.error('Detailed Error:', error);
                typingIndicator.classList.remove('visible');
                
                if (error.message.includes('Failed to fetch')) {
                    addMessage('抱歉，连接服务器失败。请检查您的网络连接，或稍后再试。您也可以尝试刷新页面后重试。', 'ai');
                } else {
                    addMessage(`抱歉，发生了错误：${error.message}`, 'ai');
                }
            }
        }
    }

    function showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'message ai';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ai-avatar';
        contentDiv.appendChild(avatarDiv);
        
        const textContent = document.createElement('div');
        textContent.innerHTML = `
            你好！我是你的专属美妆顾问~<br>
            我可以帮你：<br>
            • 解答化妆问题<br>
            • 推荐适合产品<br>
            • 分享美妆技巧<br><br>
            请问有什么想问的吗？
        `;
        contentDiv.appendChild(textContent);
        welcomeDiv.appendChild(contentDiv);
        
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeDiv);
        chatMessages.appendChild(typingIndicator);
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = `${type}-avatar`;
        contentDiv.appendChild(avatarDiv);
        
        const textDiv = document.createElement('div');
        textDiv.innerHTML = text.replace(/\n/g, '<br>');
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(contentDiv);
        chatMessages.insertBefore(messageDiv, typingIndicator);
        
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    // 事件监听
    sendButton?.addEventListener('click', sendMessage);
    userInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 修改平滑滚动代码，只处理页面内部锚点链接
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 添加返回顶部按钮
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.querySelector('.back-to-top').style.display = "block";
        } else {
            document.querySelector('.back-to-top').style.display = "none";
        }
    };

    // 肤质轮播功能
    function initSkinTypeSlider() {
        const slider = document.querySelector('.skin-type-slider');
        if (!slider) return;

        const cards = Array.from(slider.querySelectorAll('.skin-type-card'));
        const prevBtn = slider.querySelector('.nav-prev');
        const nextBtn = slider.querySelector('.nav-next');
        let currentIndex = 0;

        function updateCards() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'next');
                
                // 计算相对位置
                const position = (index - currentIndex + cards.length) % cards.length;
                
                if (position === 0) {
                    card.classList.add('active');
                } else if (position === 1) {
                    card.classList.add('next');
                }
                
                // 设置z-index确保正确的堆叠顺序
                card.style.zIndex = cards.length - position;
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCards();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCards();
        });

        // 初始化显示
        updateCards();
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', initSkinTypeSlider);
}); 