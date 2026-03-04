document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    // --- 1. ANIMACIÓN DE APARICIÓN AL HACER SCROLL (FADE-IN) ---
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 2. LÓGICA DEL MEDIDOR DE RIESGO (RISK SCORE) ---
    const scoreElement = document.getElementById('score-counter');
    const circleRing = document.querySelector('.focus-ring');
    const targetScore = 85; // Representa el nivel crítico basado en el brief
    const duration = 2000; // Duración de la animación en milisegundos
    let startTimestamp = null;

    // Configurar el anillo SVG al 0% inicial
    circleRing.setAttribute('stroke-dasharray', `0, 100`);

    const animateScore = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutQuart) para que desacelere al final
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        const currentScore = Math.floor(easeProgress * targetScore);
        scoreElement.innerText = currentScore;
        
        // Animar el anillo SVG acorde al número
        circleRing.setAttribute('stroke-dasharray', `${currentScore}, 100`);

        if (progress < 1) {
            window.requestAnimationFrame(animateScore);
        } else {
            scoreElement.innerText = targetScore;
            // Efecto de latido sutil en estado crítico final
            scoreElement.style.textShadow = "0 0 15px rgba(239, 68, 68, 0.6)";
        }
    };

    // Iniciar la animación del contador después de una leve pausa para impacto visual
    setTimeout(() => {
        window.requestAnimationFrame(animateScore);
    }, 500);

});
