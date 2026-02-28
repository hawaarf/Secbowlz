document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll Effect - Change nav background
    function handleScroll() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id], header');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId || 
                        link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('commentsContainer');
    
    // Sample initial comments
    const initialComments = [
        {
            name: 'Andi Prasetyo',
            date: '2025-01-15',
            comment: 'Sangat mengapresiasi transparansi Secbowl dalam menangani insiden ini. Semoga bisa menjadi contoh bagi brand lain.'
        },
        {
            name: 'Dewi Kartika',
            date: '2025-01-14',
            comment: 'Saya tetap setia dengan Secbowl karena mereka berani mengakui kesalahan dan memperbaikinya. Respect!'
        }
    ];
    
    // Load initial comments
    loadComments();
    
    function loadComments() {
        // Clear container
        commentsContainer.innerHTML = '';
        
        // Get comments from localStorage or use initial
        let comments = JSON.parse(localStorage.getItem('secbowl_comments')) || initialComments;
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">Belum ada komentar. Jadilah yang pertama!</p>';
            return;
        }
        
        // Sort by date (newest first)
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display comments
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsContainer.appendChild(commentElement);
        });
    }
    
    function createCommentElement(comment) {
        const div = document.createElement('div');
        div.className = 'user-comment';
        
        const formattedDate = formatDate(comment.date);
        
        div.innerHTML = `
            <div class="user-comment-header">
                <span class="user-comment-name">${escapeHtml(comment.name)}</span>
                <span class="user-comment-date">${formattedDate}</span>
            </div>
            <div class="user-comment-body">${escapeHtml(comment.comment)}</div>
        `;
        
        return div;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Form submission
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('commentName').value.trim();
        const email = document.getElementById('commentEmail').value.trim();
        const commentText = document.getElementById('commentText').value.trim();
        
        if (!name || !email || !commentText) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }
        
        // Create new comment object
        const newComment = {
            name: name,
            email: email,
            comment: commentText,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Get existing comments or initialize
        let comments = JSON.parse(localStorage.getItem('secbowl_comments')) || initialComments;
        
        // Add new comment
        comments.push(newComment);
        
        // Save to localStorage
        localStorage.setItem('secbowl_comments', JSON.stringify(comments));
        
        // Reload comments
        loadComments();
        
        // Reset form
        commentForm.reset();
        
        // Show success message
        showNotification('Komentar berhasil dikirim! Terima kasih atas masukan Anda.', 'success');
    });
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        
        const bgColor = type === 'success' 
            ? 'linear-gradient(135deg, #f2c029, #e5a820)' 
            : 'linear-gradient(135deg, #ff6b6b, #ee5a5a)';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: ${type === 'success' ? '#1a1a1a' : '#fff'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 100000;
            font-weight: 600;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 320px;
        `;
        notification.textContent = message;
        
        // Add animation keyframes if not exists
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { 
                        transform: translateX(100%); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                }
                @keyframes slideOutRight {
                    from { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                    to { 
                        transform: translateX(100%); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 4000);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.getElementById('mainNav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
