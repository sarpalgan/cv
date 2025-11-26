gsap.registerPlugin(ScrollTrigger, Draggable);

document.addEventListener("DOMContentLoaded", () => {
    // Certifications Slider
    const certs = document.querySelectorAll('.cert-item');
    const track = document.querySelector('.cert-track');
    const wrapper = document.querySelector('.cert-slider-wrapper');

    if (certs.length > 0 && track && wrapper) {
        
        // Helper to get current dimensions
        const getDimensions = () => {
            const trackWidth = track.scrollWidth;
            const wrapperWidth = wrapper.offsetWidth;
            const maxScroll = Math.max(0, trackWidth - wrapperWidth);
            
            const itemWidth = certs.length > 1 
                ? certs[1].offsetLeft - certs[0].offsetLeft 
                : certs[0].offsetWidth + 32;
            
            return { maxScroll, itemWidth };
        };

        // State
        let currentTween = null;
        let isPaused = false;
        const speed = 50; // px per second

        // Animation Functions
        const animateTo = (targetX, delay = 0) => {
            if (currentTween) currentTween.kill();
            
            const currentX = gsap.getProperty(track, "x");
            const distance = Math.abs(targetX - currentX);
            const duration = distance / speed;

            currentTween = gsap.to(track, {
                x: targetX,
                duration: duration,
                ease: "none",
                delay: delay,
                onComplete: () => {
                    // Determine next direction based on where we are
                    const { maxScroll } = getDimensions();
                    // If we are at the end (-maxScroll), go to 0
                    // If we are at 0, go to -maxScroll
                    // Use a small epsilon for float comparison
                    if (Math.abs(targetX - (-maxScroll)) < 1) {
                        animateTo(0, 2); // Wait 2s then go right
                    } else {
                        animateTo(-maxScroll, 2); // Wait 2s then go left
                    }
                }
            });
        };

        // Start initial animation
        const { maxScroll } = getDimensions();
        if (maxScroll > 0) {
            animateTo(-maxScroll, 0);
        }

        // Hover Logic
        const pause = () => {
            isPaused = true;
            if (currentTween) currentTween.pause();
        };
        
        const play = () => {
            isPaused = false;
            if (currentTween) currentTween.play();
        };

        track.addEventListener('mouseenter', pause);
        track.addEventListener('mouseleave', play);

        // Manual Interaction (Buttons & Drag)
        const handleManualInteraction = () => {
            // Kill current auto-scroll
            if (currentTween) {
                currentTween.kill();
                currentTween = null;
            }
        };

        const resumeAutoScroll = () => {
            if (isPaused) return; // Don't resume if mouse is still hovering
            
            const { maxScroll } = getDimensions();
            const currentX = gsap.getProperty(track, "x");
            
            // Decide which way to go. 
            // Simple logic: continue towards the furthest edge? 
            // Or just default to going left (towards -maxScroll) unless we are already there?
            
            if (Math.abs(currentX - (-maxScroll)) < 1) {
                animateTo(0, 2);
            } else {
                // Go towards end
                animateTo(-maxScroll, 0); // No delay when resuming from manual move? Or maybe small delay?
            }
        };

        // Draggable
        Draggable.create(track, {
            type: "x",
            bounds: wrapper,
            inertia: true,
            onPress: handleManualInteraction,
            onDragEnd: resumeAutoScroll, // Resume after drag
            onDragStart: function() {
                this.applyBounds(wrapper);
            }
        });

        // Buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        const moveManual = (direction) => {
            handleManualInteraction();
            
            const currentX = gsap.getProperty(track, "x");
            const { maxScroll: currentMax, itemWidth: currentItemWidth } = getDimensions();
            
            let targetX = currentX + (direction * currentItemWidth);
            targetX = Math.max(Math.min(targetX, 0), -currentMax);

            gsap.to(track, {
                x: targetX,
                duration: 0.4,
                ease: "power2.out",
                onComplete: resumeAutoScroll // Resume after button click animation
            });
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => moveManual(1)); 
            nextBtn.addEventListener('click', () => moveManual(-1)); 
        }
        
        // Resize handling
        window.addEventListener('resize', () => {
             const draggable = Draggable.get(track);
             if (draggable) draggable.applyBounds(wrapper);
             // Ideally we should also update the current animation target if maxScroll changed
        });
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // 3D Tilt Effect for Skill Cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                duration: 0.1,
                ease: "none"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
});
