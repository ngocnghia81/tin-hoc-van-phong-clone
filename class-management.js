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
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Handle specific tab actions
            const tabType = this.dataset.tab;
            
            if (tabType === 'refresh') {
                showNotification('Đang làm mới dữ liệu...', 'info');
                
                // Simulate refresh delay
                setTimeout(() => {
                    showNotification('Dữ liệu đã được cập nhật!', 'success');
                }, 1000);
            }
        });
    });
    
    // Class row selection
    const classRows = document.querySelectorAll('.class-table tbody tr');
    
    classRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selected class from all rows
            classRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Load class details
            const classId = this.querySelector('td:nth-child(2)').textContent;
            const className = this.querySelector('td:nth-child(3)').textContent;
            const classSchedule = this.querySelector('td:nth-child(4)').textContent;
            const startDate = this.querySelector('td:nth-child(5)').textContent;
            const endDate = this.querySelector('td:nth-child(6)').textContent;
            const statusElement = this.querySelector('td:nth-child(7) .status-badge');
            const status = statusElement.textContent;
            const statusClass = statusElement.classList.contains('active') ? 'active' : 
                               statusElement.classList.contains('ongoing') ? 'ongoing' : 'completed';
            
            // Update the details panel
            document.getElementById('classId').textContent = classId;
            document.getElementById('className').textContent = className;
            document.getElementById('classSchedule').textContent = classSchedule;
            document.getElementById('startDate').textContent = startDate;
            document.getElementById('endDate').textContent = endDate;
            
            const statusBadge = document.getElementById('classStatus').querySelector('.status-badge');
            statusBadge.textContent = status;
            statusBadge.className = 'status-badge ' + statusClass;
            
            showNotification(`Đã chọn lớp học: ${className}`, 'info');
        });
    });
    
    // Search functionality
    const classSearch = document.getElementById('classSearch');
    
    if (classSearch) {
        classSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            classRows.forEach(row => {
                const className = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const classId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                // Show/hide rows based on search term
                if (className.includes(searchTerm) || classId.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Filter functionality
    const filterClasses = document.getElementById('filterClasses');
    
    if (filterClasses) {
        filterClasses.addEventListener('change', function() {
            const filterValue = this.value;
            
            classRows.forEach(row => {
                const statusCell = row.querySelector('td:last-child');
                const statusBadge = statusCell.querySelector('.status-badge');
                
                if (filterValue === '') {
                    // Show all rows
                    row.style.display = '';
                } else if (filterValue === 'active' && statusBadge.classList.contains('active')) {
                    row.style.display = '';
                } else if (filterValue === 'ongoing' && statusBadge.classList.contains('ongoing')) {
                    row.style.display = '';
                } else if (filterValue === 'completed' && statusBadge.classList.contains('completed')) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Add Class Button
    const addClassBtn = document.getElementById('addClassBtn');
    const addClassModal = document.getElementById('addClassModal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    
    if (addClassBtn) {
        addClassBtn.addEventListener('click', function() {
            addClassModal.classList.add('active');
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
    
    // Add Class Form Submission
    const addClassForm = document.getElementById('addClassForm');
    
    if (addClassForm) {
        addClassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('newClassName').value;
            const schedule = document.getElementById('newClassSchedule').value;
            const startDate = document.getElementById('newStartDate').value;
            const endDate = document.getElementById('newEndDate').value;
            
            // Format dates for display
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            
            // In a real application, you would send this data to the server
            // For now, just show a success message
            showNotification(`Đã thêm lớp học ${name} thành công!`, 'success');
            
            // Close the modal
            addClassModal.classList.remove('active');
            
            // Reset the form
            this.reset();
        });
    }
    
    // Update Button
    const updateClassBtn = document.getElementById('updateClassBtn');
    
    if (updateClassBtn) {
        updateClassBtn.addEventListener('click', function() {
            // In a real application, you would send the updated data to the server
            showNotification('Đã cập nhật thông tin lớp học thành công!', 'success');
        });
    }
    
    // Print Button
    const printClassBtn = document.getElementById('printClassBtn');
    
    if (printClassBtn) {
        printClassBtn.addEventListener('click', function() {
            showNotification('Đang chuẩn bị in thông tin...', 'info');
            
            // In a real application, you would open a print dialog
            setTimeout(() => {
                window.print();
                showNotification('Đã gửi lệnh in thành công!', 'success');
            }, 1000);
        });
    }
    
    // Delete Button
    const deleteClassBtn = document.getElementById('deleteClassBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmBtn = document.querySelector('.confirm-btn');
    
    if (deleteClassBtn) {
        deleteClassBtn.addEventListener('click', function() {
            confirmationModal.classList.add('active');
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // In a real application, you would send a delete request to the server
            showNotification('Đã xóa lớp học thành công!', 'success');
            
            // Close the confirmation modal
            confirmationModal.classList.remove('active');
        });
    }
    
    // Pagination
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', function() {
                // Remove active class from all pagination buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real application, you would load the corresponding page of data
                showNotification('Đang tải dữ liệu...', 'info');
                
                setTimeout(() => {
                    showNotification('Đã tải dữ liệu trang mới!', 'success');
                }, 500);
            });
        }
    });
});

// Function to format date from YYYY-MM-DD to DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Function to get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData);
    }
    
    // Default user data if not found in localStorage
    return {
        name: 'Nguyễn Minh Long',
        role: 'Quản trị viên',
        avatar: null
    };
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
                    margin-bottom: 10px;
                    padding: 15px 20px;
                    border-radius: 4px;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 450px;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.info {
                    background-color: #3498db;
                }
                
                .notification.success {
                    background-color: #2ecc71;
                }
                
                .notification.warning {
                    background-color: #f39c12;
                }
                
                .notification.error {
                    background-color: #e74c3c;
                }
                
                .notification-icon {
                    font-size: 1.2rem;
                }
                
                .notification-message {
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1rem;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon based on notification type
    let icon = '';
    switch (type) {
        case 'info':
            icon = 'fas fa-info-circle';
            break;
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
            icon = 'fas fa-bell';
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icon}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        
        // Remove notification after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}
