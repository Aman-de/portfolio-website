document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only enable custom cursor on non-touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a slight delay to the outline for a smooth drag effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, .project-card, .skill-card');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.borderColor = 'var(--accent-purple)';
                cursorOutline.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    } else {
        // Hide custom cursor on mobile/touch screens
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Trigger initial reveal immediately for items already in view (like hero)
    setTimeout(() => {
        const topElements = document.querySelectorAll('.hero .reveal-up');
        topElements.forEach(el => el.classList.add('active'));
    }, 100);

    // --- Video Mute Toggle Logic ---
    const muteButtons = document.querySelectorAll('.mute-btn');
    
    muteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent default just in case, though it's a button type
            e.preventDefault();
            e.stopPropagation();

            const targetId = btn.getAttribute('data-target');
            const iframe = document.getElementById(targetId);
            if (!iframe) return;

            const isMuted = btn.getAttribute('data-muted') === 'true';
            
            if (isMuted) {
                // Currently muted, so UNMUTE
                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                // Also set volume to 100 just in case
                iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                
                btn.setAttribute('data-muted', 'false');
                btn.querySelector('.icon-muted').style.display = 'none';
                btn.querySelector('.icon-unmuted').style.display = 'block';
                btn.classList.add('unmuted-state');
            } else {
                // Currently unmuted, so MUTE
                iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                
                btn.setAttribute('data-muted', 'true');
                btn.querySelector('.icon-muted').style.display = 'block';
                btn.querySelector('.icon-unmuted').style.display = 'none';
                btn.classList.remove('unmuted-state');
            }
        });
    });
});

// --- Contact Form: mailto handler ---
function handleContactForm(e) {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const subject  = encodeURIComponent(`Portfolio Enquiry from ${name}`);
    const body     = encodeURIComponent(`Hi Udit,\n\nMy name is ${name} and my email is ${email}.\n\n${message}`);
    const mailto   = `mailto:contact@uditvideo.com?subject=${subject}&body=${body}`;

    window.location.href = mailto;

    // Show success message
    const success = document.getElementById('cf-success');
    if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
}
