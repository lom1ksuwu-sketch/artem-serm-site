document.addEventListener('DOMContentLoaded', function() {
    console.log('ArtemSERM загружен');
    
    // ========== 1. Переключение темы ==========
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        console.log(`Тема изменена на: ${newTheme}`);
    });
    
    // ========== 2. Мобильное меню ==========
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isHidden = nav.style.display !== 'flex';
            
            if (isHidden) {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'var(--card-bg)';
                nav.style.padding = '20px';
                nav.style.boxShadow = 'var(--shadow-hover)';
                nav.style.gap = '15px';
                nav.style.zIndex = '100';
                nav.style.border = '1px solid var(--border-color)';
                nav.style.borderRadius = '12px';
                nav.style.marginTop = '10px';
            } else {
                nav.style.display = 'none';
            }
        });
        
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                if (window.innerWidth <= 992) {
                    nav.style.display = 'none';
                }
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                nav.style.display = '';
                nav.style.position = '';
                nav.style.flexDirection = '';
                nav.style.background = '';
                nav.style.padding = '';
                nav.style.boxShadow = '';
                nav.style.border = '';
                nav.style.borderRadius = '';
                nav.style.marginTop = '';
            } else if (nav.style.display === 'flex') {
                nav.style.display = 'none';
            }
        });
    }
    
    // ========== 3. FAQ ==========
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
    
    // ========== 4. Выбор тарифа ==========
    const tariffButtons = document.querySelectorAll('.btn-card');
    const planInput = document.getElementById('selected-plan');
    
    tariffButtons.forEach(btn => {
        const originalHTML = btn.innerHTML;
        btn.setAttribute('data-original', originalHTML);
    });
    
    tariffButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            planInput.value = plan;
            
            tariffButtons.forEach(btn => {
                const original = btn.getAttribute('data-original');
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                btn.style.transform = '';
            });
            
            const original = this.getAttribute('data-original');
            this.innerHTML = original.replace('>', '>✓ ');
            this.style.background = 'var(--success-color)';
            this.style.color = 'white';
            this.style.borderColor = 'var(--success-color)';
            this.style.transform = 'scale(1.02)';
            
            document.getElementById('form').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Яндекс.Метрика: цель "select_tariff"
            if (typeof ym !== 'undefined') {
                ym(106109845, 'reachGoal', 'select_tariff');
                console.log('🎯 Яндекс.Метрика: цель select_tariff отправлена');
            }
            
            console.log(`Выбран тариф: ${plan}`);
        });
    });
    
    // ========== 5. Обработка формы ==========
    const form = document.getElementById('application-form');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    function showNotification(text, type) {
        notificationText.textContent = text;
        
        if (type === 'error') {
            notification.style.background = 'var(--error-color)';
        } else {
            notification.style.background = 'var(--success-color)';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const consent = document.getElementById('consent');
            if (!consent.checked) {
                showNotification('Пожалуйста, дайте согласие на обработку данных', 'error');
                consent.focus();
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                contact: document.getElementById('contact').value.trim(),
                business: document.getElementById('business').value,
                plan: planInput.value || 'не выбран',
                message: document.getElementById('message').value.trim(),
                date: new Date().toLocaleString('ru-RU'),
                url: window.location.href
            };
            
            if (!formData.name) {
                showNotification('Пожалуйста, введите ваше имя', 'error');
                document.getElementById('name').focus();
                return;
            }
            
            if (!formData.contact) {
                showNotification('Введите Telegram или телефон', 'error');
                document.getElementById('contact').focus();
                return;
            }
            
            if (!formData.message) {
                showNotification('Опишите вашу проблему', 'error');
                document.getElementById('message').focus();
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            const telegramMessage = `
🆕 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Имя:</b> ${formData.name}
📞 <b>Контакт:</b> ${formData.contact}
🏢 <b>Ниша:</b> ${formData.business || 'не указана'}
📦 <b>Тариф:</b> ${formData.plan}
📝 <b>Сообщение:</b>
${formData.message}
📅 <b>Дата:</b> ${formData.date}
🔗 <b>Страница:</b> ${formData.url}
            `.trim();
            
            try {
                const response = await fetch('/api/send-to-telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: telegramMessage,
                        formData: formData
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('✅ Заявка отправлена! Свяжусь с вами в Telegram в течение 2 часов.', 'success');
                    
                    // Яндекс.Метрика: цель "contact_form"
                    if (typeof ym !== 'undefined') {
                        ym(106109845, 'reachGoal', 'contact_form');
                        console.log('🎯 Яндекс.Метрика: цель contact_form отправлена');
                    }
                    
                    setTimeout(() => {
                        form.reset();
                        planInput.value = '';
                        
                        tariffButtons.forEach(btn => {
                            const original = btn.getAttribute('data-original');
                            btn.innerHTML = original;
                            btn.style.background = '';
                            btn.style.color = '';
                            btn.style.borderColor = '';
                            btn.style.transform = '';
                        });
                        
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 2000);
                    
                    console.log('✅ Заявка отправлена в Telegram:', formData);
                    
                } else {
                    throw new Error(result.error || 'Ошибка отправки');
                }
                
            } catch (error) {
                console.error('❌ Ошибка отправки:', error);
                showNotification('Ошибка отправки. Пожалуйста, напишите мне в Telegram напрямую.', 'error');
                
                saveToLocalStorage(formData);
                
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    function saveToLocalStorage(formData) {
        try {
            const savedForms = JSON.parse(localStorage.getItem('serm_forms') || '[]');
            savedForms.push({
                ...formData,
                timestamp: new Date().toISOString(),
                saved: true
            });
            localStorage.setItem('serm_forms', JSON.stringify(savedForms.slice(-5)));
            console.log('📦 Заявка сохранена в localStorage');
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    }
    
    // ========== 6. Маска для контакта ==========
    const contactInput = document.getElementById('contact');
    
    if (contactInput) {
        contactInput.addEventListener('input', function() {
            let value = this.value;
            
            if (value.startsWith('@')) {
                this.value = '@' + value.substring(1).replace(/[^a-zA-Z0-9_]/g, '');
            }
            else {
                let phone = value.replace(/\D/g, '');
                
                if (phone.length > 0) {
                    if (!phone.startsWith('7')) {
                        phone = '7' + phone;
                    }
                    
                    let formatted = '+7';
                    if (phone.length > 1) formatted += ' (' + phone.substring(1, 4);
                    if (phone.length > 4) formatted += ') ' + phone.substring(4, 7);
                    if (phone.length > 7) formatted += '-' + phone.substring(7, 9);
                    if (phone.length > 9) formatted += '-' + phone.substring(9, 11);
                    
                    this.value = formatted.substring(0, 18);
                }
            }
        });
    }
    
    // ========== 7. Отслеживание кнопки в шапке ==========
    const headerCta = document.querySelector('.nav-cta');
    if (headerCta) {
        headerCta.addEventListener('click', function() {
            if (typeof ym !== 'undefined') {
                ym(106109845, 'reachGoal', 'header_cta_click');
                console.log('🎯 Яндекс.Метрика: цель header_cta_click отправлена');
            }
        });
    }
    
    // ========== 8. Плавная прокрутка ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (window.innerWidth <= 992) {
                    nav.style.display = 'none';
                }
            }
        });
    });
    
    // ========== 9. Анимации при прокрутке ==========
    const animateElements = () => {
        const elements = document.querySelectorAll('.card, .pricing-card, .logic-step');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    document.querySelectorAll('.card, .pricing-card, .logic-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('load', animateElements);
    window.addEventListener('scroll', animateElements);
    
    // ========== 10. Инициализация ==========
    console.log('✅ Все скрипты инициализированы');
    console.log(`Тема: ${html.getAttribute('data-theme')}`);
});