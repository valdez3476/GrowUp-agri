// assets/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== TOGGLE THEME (Clair/Sombre) ==========
    const themeToggle = document.getElementById('themeToggle');
    
    // Fonction pour définir le thème
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('growup-theme', theme);
        
        // Mettre à jour l'accessibilité
        document.documentElement.setAttribute('aria-label', `Thème ${theme}`);
    }
    
    // Fonction pour basculer le thème
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Animation du bouton
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Charger le thème sauvegardé ou détecter la préférence système
    function loadTheme() {
        const savedTheme = localStorage.getItem('growup-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('growup-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Initialiser le thème
    loadTheme();
    
    // Événement du bouton theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleTheme();
            e.preventDefault();
        }
    });
    
    // ========== MENU MOBILE ==========
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    function toggleMenu() {
        const isActive = mainNav.classList.toggle('active');
        
        // Animation du bouton hamburger
        if (isActive) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Empêcher le défilement
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleMenu();
            e.preventDefault();
        }
    });
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // ========== CAROUSEL AUTOMATIQUE ==========
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    const slideCount = document.querySelectorAll('.carousel-slide').length;
    let carouselInterval;
    
    function updateCarousel() {
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Mettre à jour les dots
            carouselDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }
    
    function nextSlide() {
        if (slideCount > 0) {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < slideCount) {
            currentSlide = index;
            updateCarousel();
            
            // Redémarrer l'intervalle après un clic manuel
            clearInterval(carouselInterval);
            startCarousel();
        }
    }
    
    function startCarousel() {
        if (slideCount > 1) {
            carouselInterval = setInterval(nextSlide, 5000);
        }
    }
    
    // Initialiser le carousel si présent
    if (carouselTrack && slideCount > 0) {
        startCarousel();
        
        // Arrêter le carousel au hover
        carouselTrack.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carouselTrack.addEventListener('mouseleave', () => {
            startCarousel();
        });
        
        // Contrôles manuels avec les dots
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Support tactile pour mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(carouselInterval);
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startCarousel();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe gauche
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe droite
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateCarousel();
            }
        }
    }
    
    // ========== SCROLL ANIMATIONS ==========
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation supplémentaire pour les images
                if (entry.target.classList.contains('feature-image')) {
                    entry.target.style.animationDelay = '0.2s';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
    
    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initialiser
    
    // ========== BACK TO TOP BUTTON ==========
    const backToTopBtn = document.getElementById('backToTop');
    
    function updateBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(10px)';
            setTimeout(() => {
                backToTopBtn.style.display = 'none';
            }, 300);
        }
    }
    
    window.addEventListener('scroll', updateBackToTopButton);
    updateBackToTopButton(); // Initialiser
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopBtn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            e.preventDefault();
        }
    });
    
    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Fermer le menu mobile si ouvert
                if (mainNav.classList.contains('active')) {
                    closeMenu();
                }
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL sans recharger la page
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // ========== ANIMATION DES CARTES AU HOVER ==========
    const cards = document.querySelectorAll('.stat-card, .testimonial-card, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // Desktop seulement
                card.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
    
    // ========== PERFORMANCE ET ACCESSIBILITE ==========
    
    // Chargement différé des images hors écran
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    lazyLoadImages();
    
    // Amélioration de l'accessibilité au clavier
    document.addEventListener('keydown', (e) => {
        // Navigation par tabulation dans le modal
        if (mainNav.classList.contains('active')) {
            const focusableElements = mainNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // ========== RESIZE OBSERVER ==========
    // Réinitialiser certaines animations lors du redimensionnement
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Fermer le menu mobile si ouvert lors du passage en desktop
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                closeMenu();
            }
            
            // Mettre à jour la position du back to top
            updateBackToTopButton();
        }, 250);
    });
    
    // ========== LOADING ANIMATION ==========
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Ajouter une transition douce après le chargement
        setTimeout(() => {
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }, 100);
    });
});