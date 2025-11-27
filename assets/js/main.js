// ============================
// main.js — animações UI MVP
// ============================

// 1️⃣ ANIMAÇÃO DE BOTÕES
document.querySelectorAll('.btn, .btn-primary, .btn-brutal').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '';
    });
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(2px)';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
    });
});

// 2️⃣ CARDS — EFEITO LEVE AO HOVER
document.querySelectorAll('.brutal-box, .stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    });
});

// 3️⃣ SCROLL FADE-IN
const scrollElements = document.querySelectorAll('.scroll-fade');
const elementInView = (el, offset = 0) => el.getBoundingClientRect().top <= (window.innerHeight - offset);
const displayScrollElement = el => {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
    el.style.transition = 'all 0.5s ease-out';
};
const hideScrollElement = el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
};
const handleScrollAnimation = () => scrollElements.forEach(el => elementInView(el,100) ? displayScrollElement(el) : hideScrollElement(el));
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation();

// 4️⃣ TOOLTIP SIMPLES
document.querySelectorAll('[data-tooltip]').forEach(el => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.getAttribute('data-tooltip');
    el.appendChild(tooltip);
    el.addEventListener('mouseenter', () => tooltip.style.opacity = 1);
    el.addEventListener('mouseleave', () => tooltip.style.opacity = 0);
});

// 5️⃣ ANIMAÇÃO DE GRÁFICOS (DASHBOARD)
document.addEventListener('DOMContentLoaded', () => {
    if (window.Chart) {
        const charts = document.querySelectorAll('canvas');
        charts.forEach(canvas => {
            const chart = Chart.getChart(canvas);
            if (chart) chart.update(); // garante animação inicial
        });
    }
});

// 6️⃣ BOTÃO DE LOADING (FAKE)
document.querySelectorAll('.btn-loading').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.disabled = true;
        const loader = document.createElement('span');
        loader.className = 'loader';
        loader.style.marginLeft = '8px';
        loader.innerHTML = '⏳';
        btn.appendChild(loader);
        setTimeout(() => {
            btn.disabled = false;
            loader.remove();
        }, 1000);
    });
});
