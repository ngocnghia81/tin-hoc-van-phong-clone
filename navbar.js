document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Handle dropdown menus on mobile
    const dropdownLinks = document.querySelectorAll('.nav-links li a .dropdown-icon');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                const parentLi = this.closest('li');
                parentLi.classList.toggle('dropdown-active');
                
                // Create dropdown menu if it doesn't exist
                let dropdownMenu = parentLi.querySelector('.dropdown-menu');
                
                if (!dropdownMenu) {
                    dropdownMenu = document.createElement('ul');
                    dropdownMenu.className = 'dropdown-menu';
                    dropdownMenu.innerHTML = `
                        <li><a href="index.html#basic">Tin học văn phòng cơ bản</a></li>
                        <li><a href="index.html#advanced">Tin học văn phòng nâng cao</a></li>
                        <li><a href="index.html#online">Khóa học trực tuyến</a></li>
                    `;
                    parentLi.appendChild(dropdownMenu);
                }
                
                // Toggle dropdown visibility
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    dropdownMenu.style.display = 'block';
                }
            }
        });
    });
    
    // Add dropdown menu CSS for mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 992px) {
            .nav-links .dropdown-menu {
                position: static;
                width: 100%;
                box-shadow: none;
                display: none;
                padding-left: 20px;
            }
            
            .nav-links .dropdown-active > a {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .nav-links .dropdown-menu a {
                padding: 10px 20px;
            }
        }
    `;
    document.head.appendChild(style);
});
