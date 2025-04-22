// Attendance Tracking JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const classSelect = document.getElementById('classSelect');
    const searchBtn = document.getElementById('searchBtn');
    const attendanceTable = document.querySelector('.attendance-table');
    const prevPageBtn = document.querySelector('.pagination-btn.prev');
    const nextPageBtn = document.querySelector('.pagination-btn.next');
    const pageNumbers = document.querySelector('.page-numbers');
    
    // State
    let currentPage = 1;
    let totalPages = 3;
    let currentClass = '';
    let editMode = false;
    
    // Initialize tooltips for attendance statuses
    initTooltips();
    
    // Event Listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            if (classSelect.value) {
                loadAttendanceData(classSelect.value);
            } else {
                showNotification('Vui lòng chọn lớp học', 'warning');
            }
        });
    }
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                navigateToPage(currentPage - 1);
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                navigateToPage(currentPage + 1);
            }
        });
    }
    
    // Page number clicks
    if (pageNumbers) {
        pageNumbers.addEventListener('click', function(e) {
            if (e.target.classList.contains('page')) {
                const pageNum = parseInt(e.target.textContent);
                navigateToPage(pageNum);
            }
        });
    }
    
    // Toggle edit mode for attendance statuses
    document.addEventListener('click', function(e) {
        if (e.target.closest('.attendance-status') && editMode) {
            const statusCell = e.target.closest('.attendance-status');
            toggleStatusDropdown(statusCell);
        } else if (!e.target.closest('.status-dropdown')) {
            // Close any open dropdowns when clicking outside
            closeAllDropdowns();
        }
    });
    
    // Add edit mode toggle button to the actions
    const actionsDiv = document.querySelector('.schedule-actions');
    if (actionsDiv) {
        const editBtn = document.createElement('button');
        editBtn.className = 'schedule-btn warning';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
        editBtn.addEventListener('click', function() {
            toggleEditMode();
        });
        actionsDiv.appendChild(editBtn);
    }
    
    // Functions
    function loadAttendanceData(classId) {
        currentClass = classId;
        
        // In a real application, this would be an API call
        // For demo purposes, we'll use the existing data
        
        // Show loading state
        showNotification('Đang tải dữ liệu điểm danh...', 'info');
        
        // Simulate API delay
        setTimeout(() => {
            // Update table header with class info
            updateTableHeader(classId);
            
            // Show success message
            showNotification('Dữ liệu điểm danh đã được tải thành công', 'success');
            
            // Reset pagination to page 1
            navigateToPage(1);
        }, 500);
    }
    
    function updateTableHeader(classId) {
        // Update table header based on class
        const headerText = document.querySelector('.attendance-details h3');
        if (headerText) {
            headerText.textContent = `Chi tiết điểm danh - ${getClassName(classId)}`;
        }
    }
    
    function getClassName(classId) {
        // Get class name from class ID
        const classNames = {
            'ttms': 'Lớp TT MS',
            'cb01': 'Lớp CB01',
            'cb02': 'Lớp CB02'
        };
        
        return classNames[classId] || 'Lớp không xác định';
    }
    
    function navigateToPage(page) {
        // Update current page
        currentPage = page;
        
        // Update active page in pagination
        const pageElements = document.querySelectorAll('.page');
        pageElements.forEach(el => {
            if (parseInt(el.textContent) === page) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // In a real application, this would load data for the specific page
        // For demo purposes, we'll just update the UI
        
        // Update pagination buttons state
        updatePaginationState();
    }
    
    function updatePaginationState() {
        // Disable/enable prev button
        if (prevPageBtn) {
            if (currentPage === 1) {
                prevPageBtn.classList.add('disabled');
                prevPageBtn.setAttribute('disabled', true);
            } else {
                prevPageBtn.classList.remove('disabled');
                prevPageBtn.removeAttribute('disabled');
            }
        }
        
        // Disable/enable next button
        if (nextPageBtn) {
            if (currentPage === totalPages) {
                nextPageBtn.classList.add('disabled');
                nextPageBtn.setAttribute('disabled', true);
            } else {
                nextPageBtn.classList.remove('disabled');
                nextPageBtn.removeAttribute('disabled');
            }
        }
    }
    
    function toggleEditMode() {
        editMode = !editMode;
        
        // Toggle edit mode class on table
        if (attendanceTable) {
            if (editMode) {
                attendanceTable.classList.add('edit-mode');
                showNotification('Chế độ chỉnh sửa đã được bật', 'info');
            } else {
                attendanceTable.classList.remove('edit-mode');
                showNotification('Chế độ chỉnh sửa đã được tắt', 'info');
            }
        }
    }
    
    function toggleStatusDropdown(statusCell) {
        // Close any open dropdowns first
        closeAllDropdowns();
        
        // Create dropdown if it doesn't exist
        let dropdown = statusCell.querySelector('.status-dropdown');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'status-dropdown';
            dropdown.innerHTML = `
                <div class="status-option present" data-status="present">Có mặt</div>
                <div class="status-option absent" data-status="absent">Vắng mặt</div>
                <div class="status-option excused" data-status="excused">Nghỉ có phép</div>
                <div class="status-option" data-status="none">Xóa trạng thái</div>
            `;
            
            // Add event listeners to options
            dropdown.querySelectorAll('.status-option').forEach(option => {
                option.addEventListener('click', function() {
                    updateAttendanceStatus(statusCell, this.dataset.status);
                    closeAllDropdowns();
                });
            });
            
            statusCell.appendChild(dropdown);
        }
        
        // Show dropdown
        dropdown.classList.add('show');
    }
    
    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.status-dropdown.show');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
    
    function updateAttendanceStatus(cell, status) {
        // Clear current status
        cell.innerHTML = '';
        
        // Add new status
        if (status === 'present') {
            cell.innerHTML = '<span class="status-present">Có</span>';
        } else if (status === 'absent') {
            cell.innerHTML = '<span class="status-absent">Vắng</span>';
        } else if (status === 'excused') {
            cell.innerHTML = '<span class="status-excused">Nghỉ có phép</span>';
        }
        
        // In a real application, this would save the status to the server
        console.log('Attendance status updated:', {
            student: cell.closest('tr').querySelector('.student-name').textContent.trim(),
            session: getSessionInfo(cell),
            status: status
        });
        
        // Re-initialize tooltips
        initTooltips();
    }
    
    function getSessionInfo(cell) {
        // Get session info from column index
        const rowIndex = cell.parentNode.rowIndex;
        const cellIndex = cell.cellIndex;
        
        // Get session header
        const headerCell = attendanceTable.rows[0].cells[Math.floor(cellIndex / 2)];
        if (headerCell) {
            const sessionName = headerCell.querySelector('.session-header span:first-child')?.textContent || '';
            const sessionDate = headerCell.querySelector('.session-date')?.textContent || '';
            return `${sessionName} (${sessionDate})`;
        }
        
        return 'Unknown session';
    }
    
    function initTooltips() {
        // Add tooltips to attendance status cells
        const statusCells = document.querySelectorAll('.attendance-status');
        statusCells.forEach(cell => {
            const statusEl = cell.querySelector('span');
            if (statusEl) {
                const status = statusEl.textContent;
                const studentName = cell.closest('tr').querySelector('.student-name').textContent.trim();
                const sessionInfo = getSessionInfo(cell);
                
                // Set tooltip text
                cell.setAttribute('data-tooltip', `${studentName}: ${status} - ${sessionInfo}`);
            } else {
                cell.setAttribute('data-tooltip', 'Chưa điểm danh');
            }
        });
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Initialize pagination state
    updatePaginationState();
});
