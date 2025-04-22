// Student Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // User dropdown
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userBtn && dropdownMenu) {
        userBtn.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Password change trigger in dropdown
    const passwordChangeTriggerInDropdown = document.querySelector('.dropdown-menu .password-change-trigger');
    if (passwordChangeTriggerInDropdown) {
        passwordChangeTriggerInDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const passwordChangeModal = document.getElementById('passwordChangeModal');
            if (passwordChangeModal) {
                passwordChangeModal.style.display = 'flex';
                
                // Pre-fill username
                const usernameInput = document.getElementById('username');
                const headerUserName = document.getElementById('headerUserName');
                
                if (usernameInput && headerUserName) {
                    usernameInput.value = headerUserName.textContent;
                }
            }
            
            // Hide dropdown after clicking
            dropdownMenu.classList.remove('show');
        });
    }
    
    // Initialize student data
    initializeStudentData();
});

// Function to initialize student data
function initializeStudentData() {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Student information
    const studentInfo = {
        id: "SV001",
        name: "Phan Thị Ái Ái",
        email: "ai.phan@example.com",
        phone: "0987654321",
        dateOfBirth: "15/05/2000",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        enrollmentDate: "10/01/2025"
    };
    
    // Update student name in header and sidebar if needed
    const headerUserName = document.getElementById('headerUserName');
    const sidebarUserName = document.getElementById('sidebarUserName');
    
    if (headerUserName) {
        headerUserName.textContent = studentInfo.name;
    }
    
    if (sidebarUserName) {
        sidebarUserName.textContent = studentInfo.name;
    }
    
    // Add event listeners for announcement read more links
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const announcementTitle = this.closest('.announcement-card').querySelector('h3').textContent;
            alert(`Xem chi tiết thông báo: ${announcementTitle}`);
        });
    });
}

// Handle responsive sidebar for mobile devices
function handleResponsiveSidebar() {
    const width = window.innerWidth;
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (width < 992 && sidebar && mainContent) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else if (sidebar && mainContent) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// Call responsive handler on load and resize
window.addEventListener('load', handleResponsiveSidebar);
window.addEventListener('resize', handleResponsiveSidebar);
