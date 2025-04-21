document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    updateCurrentDate();
    
    // Initialize user data
    const userData = getUserData();
    if (userData) {
        updateUserInfo(userData);
    }
    
    // Toggle sidebar on mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            editProfileModal.classList.add('active');
        });
    }
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the closest modal parent
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Save Profile Button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            // Get form values
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;
            
            // Update profile info (in a real app, you would send this to the server)
            const profileItems = document.querySelectorAll('.profile-info-item');
            profileItems.forEach(item => {
                const label = item.querySelector('label').textContent;
                if (label === 'Email') {
                    item.querySelector('p').textContent = email;
                } else if (label === 'Số điện thoại') {
                    item.querySelector('p').textContent = phone;
                }
            });
            
            // Close modal
            editProfileModal.classList.remove('active');
            
            // Show success notification
            showNotification('Thông tin cá nhân đã được cập nhật!', 'success');
        });
    }
    
    // Mark notification as read
    const markReadBtns = document.querySelectorAll('.mark-read-btn');
    
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.remove('unread');
            showNotification('Đã đánh dấu thông báo là đã đọc', 'info');
        });
    });
    
    // Schedule action buttons
    const attendanceBtn = document.querySelector('.schedule-actions .primary');
    const detailsBtn = document.querySelector('.schedule-actions .secondary');
    
    if (attendanceBtn) {
        attendanceBtn.addEventListener('click', function() {
            showNotification('Đang mở trang điểm danh...', 'info');
            // In a real app, you would redirect to the attendance page
        });
    }
    
    if (detailsBtn) {
        detailsBtn.addEventListener('click', function() {
            showNotification('Đang mở chi tiết lớp học...', 'info');
            // In a real app, you would redirect to the class details page
        });
    }
});

// Function to update current date
function updateCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const day = days[now.getDay()];
        const date = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        
        currentDateElement.textContent = `${day}, ${date}/${month}/${year}`;
    }
}

// Function to get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Function to update user info in the UI
function updateUserInfo(userData) {
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    const headerUserName = document.getElementById('headerUserName');
    
    if (sidebarUserName) {
        sidebarUserName.textContent = userData.name;
    }
    
    if (sidebarUserRole) {
        sidebarUserRole.textContent = userData.role;
    }
    
    if (headerUserName) {
        headerUserName.textContent = userData.name;
    }
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for notification container
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .notification {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 15px 20px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                width: 300px;
                max-width: 100%;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                margin: 0 0 5px 0;
                color: #333;
            }
            
            .notification-message {
                font-size: 13px;
                color: #666;
                margin: 0;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                margin-left: 10px;
                transition: color 0.2s ease;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.1);
            }
            
            .notification-progress-bar {
                height: 100%;
                width: 100%;
                transform-origin: left;
                animation: progress 5s linear forwards;
            }
            
            .notification.info .notification-icon {
                color: #3498db;
            }
            
            .notification.success .notification-icon {
                color: #2ecc71;
            }
            
            .notification.warning .notification-icon {
                color: #f39c12;
            }
            
            .notification.error .notification-icon {
                color: #e74c3c;
            }
            
            .notification.info .notification-progress-bar {
                background-color: #3498db;
            }
            
            .notification.success .notification-progress-bar {
                background-color: #2ecc71;
            }
            
            .notification.warning .notification-progress-bar {
                background-color: #f39c12;
            }
            
            .notification.error .notification-progress-bar {
                background-color: #e74c3c;
            }
            
            @keyframes progress {
                0% {
                    transform: scaleX(1);
                }
                100% {
                    transform: scaleX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = 'info-circle';
    let title = 'Thông báo';
    
    if (type === 'success') {
        icon = 'check-circle';
        title = 'Thành công';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
        title = 'Cảnh báo';
    } else if (type === 'error') {
        icon = 'times-circle';
        title = 'Lỗi';
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress">
            <div class="notification-progress-bar"></div>
        </div>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification with a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// Function to close notification
function closeNotification(notification) {
    notification.classList.remove('show');
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}
