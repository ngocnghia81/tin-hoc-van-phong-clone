document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = getUserData();
    if (userData) {
        // Update user display names
        updateUserInfo(userData);
    } else {
        // Redirect to login page if not logged in
        // window.location.href = 'index.html';
    }
    
    // Toggle sidebar on mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const clickedInsideSidebar = sidebar.contains(e.target);
        const clickedOnMenuToggle = menuToggle.contains(e.target);
        
        if (!clickedInsideSidebar && !clickedOnMenuToggle && window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        }
    });
    
    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default only if it's a placeholder link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // If on mobile, close the sidebar
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
    
    // Dashboard item click handler
    const dashboardItems = document.querySelectorAll('.dashboard-item');
    dashboardItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const itemLabel = this.querySelector('.item-label').textContent;
            
            // Show a message for now
            showNotification(`Chức năng "${itemLabel}" đang được phát triển.`, 'info');
        });
    });
    
    // Calendar navigation
    const calendarNavBtns = document.querySelectorAll('.calendar-nav');
    calendarNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // This would normally update the calendar, but for demo just show notification
            showNotification('Tính năng lịch đang được phát triển.', 'info');
        });
    });
    
    // Calendar day click
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove active class from all days
            calendarDays.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked day
            this.classList.add('active');
            
            // If it's an event day, show details
            if (this.classList.contains('event')) {
                const date = this.textContent.trim();
                showNotification(`Xem sự kiện ngày ${date}/04/2025`, 'info');
            }
        });
    });
    
    // Widget action buttons
    const widgetActions = document.querySelectorAll('.widget-action');
    widgetActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const widgetTitle = this.closest('.widget-header').querySelector('h2').textContent;
            showNotification(`Tùy chỉnh widget "${widgetTitle}"`, 'info');
        });
    });
    
    // Function to get user data from localStorage
    function getUserData() {
        const userDataStr = localStorage.getItem('userData');
        return userDataStr ? JSON.parse(userDataStr) : null;
    }
    
    // Function to update user info in the UI
    function updateUserInfo(userData) {
        // Update sidebar user info
        const sidebarUserName = document.getElementById('sidebarUserName');
        const sidebarUserRole = document.getElementById('sidebarUserRole');
        
        if (sidebarUserName) {
            sidebarUserName.textContent = userData.name;
        }
        
        if (sidebarUserRole) {
            let roleText = '';
            switch(userData.role) {
                case 'student':
                    roleText = 'Học viên';
                    break;
                case 'teacher':
                    roleText = 'Giảng viên';
                    break;
                case 'admin':
                    roleText = 'Quản trị viên';
                    break;
                default:
                    roleText = 'Người dùng';
            }
            sidebarUserRole.textContent = roleText;
        }
        
        // Update header user info
        const headerUserName = document.getElementById('headerUserName');
        if (headerUserName) {
            headerUserName.textContent = userData.name;
        }
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = '';
        switch(type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'error':
                icon = 'exclamation-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            default:
                icon = 'info-circle';
        }
        
        // Set content
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Create container if it doesn't exist
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Add to container
        container.appendChild(notification);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
                
                // Remove container if empty
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('closing');
                setTimeout(() => {
                    notification.remove();
                    
                    // Remove container if empty
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Add notification styles
    addNotificationStyles();
    
    // Function to add notification styles
    function addNotificationStyles() {
        // Create style element if it doesn't exist
        let style = document.getElementById('notification-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 350px;
                }
                
                .notification {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    animation: slideIn 0.3s ease forwards;
                    transition: all 0.3s ease;
                }
                
                .notification.closing {
                    opacity: 0;
                    transform: translateX(20px);
                }
                
                .notification-icon {
                    font-size: 20px;
                }
                
                .notification.info .notification-icon {
                    color: #4e73df;
                }
                
                .notification.success .notification-icon {
                    color: #1cc88a;
                }
                
                .notification.warning .notification-icon {
                    color: #f6c23e;
                }
                
                .notification.error .notification-icon {
                    color: #e74a3b;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-content p {
                    margin: 0;
                    font-size: 14px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 14px;
                    color: #888;
                    cursor: pointer;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
