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
    
    // Teacher row selection
    const teacherRows = document.querySelectorAll('.teacher-table tbody tr');
    
    teacherRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selected class from all rows
            teacherRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // In a real application, you would load the teacher details here
            const teacherName = this.querySelector('td:nth-child(3)').textContent;
            showNotification(`Đã chọn giảng viên: ${teacherName}`, 'info');
        });
    });
    
    // Search functionality
    const teacherSearch = document.getElementById('teacherSearch');
    
    if (teacherSearch) {
        teacherSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            teacherRows.forEach(row => {
                const teacherName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const teacherId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const teacherEmail = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                
                // Show/hide rows based on search term
                if (teacherName.includes(searchTerm) || 
                    teacherId.includes(searchTerm) || 
                    teacherEmail.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Filter functionality
    const filterTeachers = document.getElementById('filterTeachers');
    
    if (filterTeachers) {
        filterTeachers.addEventListener('change', function() {
            const filterValue = this.value;
            
            teacherRows.forEach(row => {
                const statusCell = row.querySelector('td:last-child');
                const statusBadge = statusCell.querySelector('.status-badge');
                
                if (filterValue === '') {
                    // Show all rows
                    row.style.display = '';
                } else if (filterValue === 'active' && statusBadge.classList.contains('active')) {
                    row.style.display = '';
                } else if (filterValue === 'inactive' && statusBadge.classList.contains('inactive')) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Add Teacher Button
    const addTeacherBtn = document.getElementById('addTeacherBtn');
    const addTeacherModal = document.getElementById('addTeacherModal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');
    
    if (addTeacherBtn) {
        addTeacherBtn.addEventListener('click', function() {
            addTeacherModal.classList.add('active');
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
    
    // Add Teacher Form Submission
    const addTeacherForm = document.getElementById('addTeacherForm');
    
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('teacherName').value;
            const phone = document.getElementById('teacherPhone').value;
            const email = document.getElementById('teacherEmail').value;
            
            // In a real application, you would send this data to the server
            // For now, just show a success message
            showNotification(`Đã thêm giảng viên ${name} thành công!`, 'success');
            
            // Close the modal
            addTeacherModal.classList.remove('active');
            
            // Reset the form
            this.reset();
        });
    }
    
    // Update Button
    const updateBtn = document.getElementById('updateBtn');
    
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // In a real application, you would send the updated data to the server
            showNotification('Đã cập nhật thông tin giảng viên thành công!', 'success');
        });
    }
    
    // Delete Button
    const deleteBtn = document.getElementById('deleteBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmBtn = document.querySelector('.confirm-btn');
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            confirmationModal.classList.add('active');
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // In a real application, you would send a delete request to the server
            showNotification('Đã xóa giảng viên thành công!', 'success');
            
            // Close the confirmation modal
            confirmationModal.classList.remove('active');
        });
    }
    
    // Print Button
    const printBtn = document.getElementById('printBtn');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            showNotification('Đang chuẩn bị in thông tin...', 'info');
            
            // In a real application, you would open a print dialog
            setTimeout(() => {
                window.print();
            }, 1000);
        });
    }
    
    // Export Button
    const exportBtn = document.getElementById('exportBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showNotification('Đang xuất dữ liệu...', 'info');
            
            // In a real application, you would generate and download a file
            setTimeout(() => {
                showNotification('Đã xuất dữ liệu thành công!', 'success');
            }, 1000);
        });
    }
    
    // Export CSV/Excel Buttons
    const exportFileBtns = document.querySelectorAll('.export-btn');
    
    exportFileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileType = this.textContent.includes('CSV') ? 'CSV' : 'Excel';
            showNotification(`Đang xuất file ${fileType}...`, 'info');
            
            // In a real application, you would generate and download a file
            setTimeout(() => {
                showNotification(`Đã xuất file ${fileType} thành công!`, 'success');
            }, 1000);
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
});
