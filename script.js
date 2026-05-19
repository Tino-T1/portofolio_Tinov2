document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Start revealing home section after loader
            revealOnScroll();
        }, 1500);
    });

    // 2. Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorGlow = document.getElementById('cursor-glow');

    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        
        // Smooth glow follower
        cursorGlow.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 500, fill: "forwards" });

        // Hover Effect detection
        const target = e.target;
        if (target.closest('a') || target.closest('button') || target.closest('.btn') || target.closest('.glass')) {
            cursorGlow.style.width = '60px';
            cursorGlow.style.height = '60px';
            cursorGlow.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        } else {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
            cursorGlow.style.backgroundColor = 'transparent';
        }
    });

    // 3. Typing Animation
    const typingText = document.getElementById('typing-text');
    const roles = ["Pengembang Frontend", "Desainer UI", "Pengembang Fullstack", "Visioner Teknologi"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 4. Navbar & Scroll Progress
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Navbar glass effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active Link Highlight
        highlightNavLink();
    });

    function highlightNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // 5. Mobile Menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // 6. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    function revealOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Special case for skills progress bars
                    if (entry.target.id === 'skills') {
                        entry.target.classList.add('revealed');
                    }
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
        
        // Specific observer for skills section to trigger bars
        const skillsSection = document.getElementById('skills');
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillsSection.classList.add('revealed');
            }
        }, { threshold: 0.3 });
        skillsObserver.observe(skillsSection);
    }

    // 7. Card Tilt Effect (Subtle)
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // 8. Certificate Modal
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const certCards = document.querySelectorAll('.cert-card');
    const span = document.getElementsByClassName('modal-close')[0];

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = card.querySelector('img').src;
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    span.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    // 9. Back to Top Click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 10. Supabase Initialization
    const supabaseUrl = 'https://bzppctjnqyvptwjvywva.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cHBjdGpucXl2cHR3anZ5d3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjY4MjgsImV4cCI6MjA5NDc0MjgyOH0.kZl-hlPXvAUYa5kjpEBRsyraNW2KM8SJLbvNB0JS6W4';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // 11. Load Profile (Identity) Data
    async function loadProfile() {
        try {
            const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
            if (error) throw error;
            if (data) {
                document.getElementById('hero-name').textContent = data.full_name;
                document.getElementById('hero-badge').textContent = data.badge_text;
                document.getElementById('hero-description').textContent = data.description;
                document.getElementById('about-whoami').textContent = data.about_whoami;
                document.getElementById('about-education').textContent = data.about_education;
                document.getElementById('about-mission').textContent = data.about_mission;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // 12. Load Projects Data
    async function loadProjects() {
        try {
            const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            
            const projectsGrid = document.getElementById('projects-grid');
            if (data && data.length > 0) {
                projectsGrid.innerHTML = ''; // Clear container
                data.forEach(project => {
                    // Create tags HTML
                    let tagsHtml = '';
                    if (project.tags) {
                        const tagsArray = project.tags.split(',');
                        tagsArray.forEach(tag => {
                            tagsHtml += `<span>${tag.trim()}</span>`;
                        });
                    }

                    // Card template
                    const cardHtml = `
                        <div class="project-card glass revealed" data-reveal="up">
                            <div class="project-img">
                                <img src="${project.image_url}" alt="${project.title}">
                            </div>
                            <div class="project-info">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-tags">
                                    ${tagsHtml}
                                </div>
                                <div class="project-links">
                                    <a href="${project.demo_url}"><i data-lucide="external-link"></i> Demo</a>
                                    <a href="${project.github_url}"><i data-lucide="github"></i> Kode</a>
                                </div>
                            </div>
                        </div>
                    `;
                    projectsGrid.insertAdjacentHTML('beforeend', cardHtml);
                });
                // Re-initialize Lucide icons for dynamically added content
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    // Call fetch functions
    loadProfile();
    loadProjects();

    // 13. Form Submission via Supabase
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            const name = document.getElementById('wa-name').value;
            const email = document.getElementById('wa-email').value;
            const message = document.getElementById('wa-message').value;
            
            btn.textContent = 'MENGIRIM...';
            btn.disabled = true;

            try {
                const { data, error } = await supabase
                    .from('messages')
                    .insert([
                        { name: name, email: email, message: message }
                    ]);

                if (error) throw error;

                alert('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.');
                contactForm.reset();
            } catch (error) {
                console.error('Error saving message:', error);
                alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
});
