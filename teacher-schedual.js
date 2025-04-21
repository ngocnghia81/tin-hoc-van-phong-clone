document.addEventListener('DOMContentLoaded', function() {
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
    
    // Quick access cards
    const quickCards = document.querySelectorAll('.quick-card');
    
    quickCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the card title
            const cardTitle = this.querySelector('h3').textContent;
            
            // Show notification for card click
            showNotification(`Đang chuyển đến ${cardTitle}`, 'info');
            
            // In a real application, you would navigate to the appropriate page or show the relevant content
        });
    });
    
    // Sidebar navigation
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav li a');
    
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default for the active page link
            if (this.closest('li').classList.contains('active')) {
                return;
            }
            
            e.preventDefault();
            
            // Get the menu item text
            const menuText = this.querySelector('span').textContent;
            
            // Show notification for navigation
            showNotification(`Đang chuyển đến ${menuText}`, 'info');
            
            // In a real application, you would navigate to the appropriate page
        });
    });
    
    // Class action buttons
    const attendanceButtons = document.querySelectorAll('.class-actions .btn-primary');
    const detailButtons = document.querySelectorAll('.class-actions .btn-secondary');
    
    attendanceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the class name from the parent card
            const className = this.closest('.class-card').querySelector('h3').textContent;
            
            // Show notification
            showNotification(`Đang mở điểm danh cho lớp "${className}"`, 'info');
            
            // In a real application, you would open the attendance form for this class
        });
    });
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the class name from the parent card
            const className = this.closest('.class-card').querySelector('h3').textContent;
            
            // Show class details in modal
            showClassDetails(className);
            
            // Show notification
            showNotification(`Đang xem chi tiết lớp "${className}"`, 'info');
        });
    });
    
    // View all buttons
    const viewAllButtons = document.querySelectorAll('.view-all-btn');
    
    viewAllButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section title
            const sectionTitle = this.closest('.section-header').querySelector('h2').textContent;
            
            // Show notification
            showNotification(`Đang xem tất cả ${sectionTitle}`, 'info');
            
            // In a real application, you would navigate to the full list page
        });
    });
    
    // Notification items
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the notification title
            const notificationTitle = this.querySelector('h3').textContent;
            
            // Remove unread class if present
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                
                // Show notification
                showNotification(`Đã đánh dấu "${notificationTitle}" là đã đọc`, 'success');
            } else {
                // Show notification
                showNotification(`Đang xem thông báo "${notificationTitle}"`, 'info');
            }
            
            // In a real application, you would show the full notification details
        });
    });
    
    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            editProfileModal.classList.add('active');
        });
    }
    
    // Upload Avatar Button
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const uploadAvatarModal = document.getElementById('uploadAvatarModal');
    
    if (uploadAvatarBtn) {
        uploadAvatarBtn.addEventListener('click', function() {
            uploadAvatarModal.classList.add('active');
        });
    }
    
    // Set up modal close button
    document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the closest modal parent
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
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
    
    // Save Profile Button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            // Get form values
            const phoneNumber = document.getElementById('editPhoneNumber').value;
            const email = document.getElementById('editEmail').value;
            const address = document.getElementById('editAddress').value;
            
            // In a real application, you would send this data to the server
            // For now, update the UI with the new values
            document.getElementById('phoneNumber').textContent = phoneNumber;
            document.getElementById('email').textContent = email;
            document.getElementById('address').textContent = address;
            
            // Show success notification
            showNotification('Đã cập nhật thông tin cá nhân thành công!', 'success');
            
            // Close the modal
            editProfileModal.classList.remove('active');
        });
    }
    
    // Avatar File Input
    const avatarFile = document.getElementById('avatarFile');
    const avatarPreview = document.getElementById('avatarPreview');
    
    if (avatarFile) {
        avatarFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Save Avatar Button
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const teacherAvatar = document.getElementById('teacherAvatar');
    
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', function() {
            // In a real application, you would upload the image to the server
            // For now, just update the avatar in the UI
            if (avatarPreview.src) {
                teacherAvatar.src = avatarPreview.src;
            }
            
            // Show success notification
            showNotification('Đã cập nhật ảnh đại diện thành công!', 'success');
            
            // Close the modal
            uploadAvatarModal.classList.remove('active');
        });
    }
});

// Function to get user data from localStorage
function getUserData() {
    // In a real application, you would get this from a server or localStorage
    // For now, return a mock user object
    return {
        name: 'Trần Trọng Hải',
        role: 'Giảng viên',
        id: '14917012034178'
    };
}

// Function to update user info in the UI
function updateUserInfo(userData) {
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    const headerUserName = document.getElementById('headerUserName');
    
    if (sidebarUserName && userData.name) {
        sidebarUserName.textContent = userData.name;
    }
    
    if (sidebarUserRole && userData.role) {
        sidebarUserRole.textContent = userData.role;
    }
    
    if (headerUserName && userData.name) {
        headerUserName.textContent = userData.name;
    }
}

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already in the document
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .notification {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 300px;
                    max-width: 100%;
                    animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
                    position: relative;
                }
                
                .notification.info {
                    border-left: 4px solid #36b9cc;
                }
                
                .notification.success {
                    border-left: 4px solid #1cc88a;
                }
                
                .notification.warning {
                    border-left: 4px solid #f6c23e;
                }
                
                .notification.error {
                    border-left: 4px solid #e74a3b;
                }
                
                .notification-icon {
                    font-size: 20px;
                }
                
                .notification.info .notification-icon {
                    color: #36b9cc;
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
                
                .notification-message {
                    margin: 0;
                    color: #333;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #aaa;
                    cursor: pointer;
                    font-size: 16px;
                    transition: color 0.3s ease;
                }
                
                .notification-close:hover {
                    color: #666;
                }
                
                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background-color: rgba(0, 0, 0, 0.1);
                    width: 100%;
                }
                
                .notification-progress::before {
                    content: '';
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    background-color: currentColor;
                    animation: progress 3s linear forwards;
                }
                
                .notification.info .notification-progress::before {
                    background-color: #36b9cc;
                }
                
                .notification.success .notification-progress::before {
                    background-color: #1cc88a;
                }
                
                .notification.warning .notification-progress::before {
                    background-color: #f6c23e;
                }
                
                .notification.error .notification-progress::before {
                    background-color: #e74a3b;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-content">
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Automatically remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to show class details in modal
function showClassDetails(className) {
    // Get the modal element
    const modal = document.getElementById('classModal');
    
    // Update modal content
    document.getElementById('modalTitle').textContent = className;
    document.getElementById('modalTime').textContent = '8:00 - 10:00';
    document.getElementById('modalDate').textContent = '21/04/2025';
    document.getElementById('modalRoom').textContent = 'Phòng 101';
    document.getElementById('modalStudents').textContent = '15 học viên';
    document.getElementById('modalDescription').textContent = 
        'Khóa học ' + className + ' dành cho người mới bắt đầu. Học viên sẽ được hướng dẫn các kỹ năng cơ bản để sử dụng ' + 
        className + ' hiệu quả trong công việc.';
    
    // Show the modal
    modal.classList.add('active');
}
