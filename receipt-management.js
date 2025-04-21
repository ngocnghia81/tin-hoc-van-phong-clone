document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const receiptRows = document.querySelectorAll('.receipt-table tbody tr');
    const addReceiptBtn = document.getElementById('addReceiptBtn');
    const addReceiptModal = document.getElementById('addReceiptModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const deleteReceiptBtn = document.getElementById('deleteReceiptBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const editReceiptBtn = document.getElementById('editReceiptBtn');
    const saveReceiptBtn = document.getElementById('saveReceiptBtn');
    const refreshReceiptBtn = document.getElementById('refreshReceiptBtn');
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const receiptSearch = document.getElementById('receiptSearch');
    const filterReceipts = document.getElementById('filterReceipts');

    // Toggle sidebar
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Handle refresh tab
            if (this.dataset.tab === 'refresh') {
                // Remove active class after animation
                setTimeout(() => {
                    this.classList.remove('active');
                    tabButtons[0].classList.add('active');
                }, 500);
                
                // Refresh data
                refreshReceiptData();
            }
        });
    });

    // Select receipt row
    receiptRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selected class from all rows
            receiptRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Load receipt details
            loadReceiptDetails(this);
        });
    });

    // Add receipt button
    addReceiptBtn.addEventListener('click', function() {
        openModal(addReceiptModal);
        
        // Set today's date as default
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('newReceiptDate').value = formattedDate;
    });

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Delete receipt button
    deleteReceiptBtn.addEventListener('click', function() {
        openModal(confirmationModal);
    });

    // Edit receipt button
    editReceiptBtn.addEventListener('click', function() {
        toggleReceiptFormEditing(true);
    });

    // Save receipt button
    saveReceiptBtn.addEventListener('click', function() {
        saveReceiptChanges();
    });

    // Refresh receipt button
    refreshReceiptBtn.addEventListener('click', function() {
        refreshCurrentReceipt();
    });

    // Print receipt button
    printReceiptBtn.addEventListener('click', function() {
        printReceipt();
    });

    // Export PDF button
    exportPdfBtn.addEventListener('click', function() {
        exportReceiptToPdf();
    });

    // Search functionality
    receiptSearch.addEventListener('input', function() {
        searchReceipts(this.value);
    });

    // Filter functionality
    filterReceipts.addEventListener('change', function() {
        filterReceiptsByDate(this.value);
    });

    // Initialize with the first receipt selected
    if (receiptRows.length > 0) {
        loadReceiptDetails(receiptRows[0]);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active');
            openModals.forEach(modal => closeModal(modal));
        }
    });

    // Functions
    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    function loadReceiptDetails(row) {
        // Get data from the selected row
        const cells = row.querySelectorAll('td');
        
        // Update the form with the data
        document.getElementById('receiptNumber').value = cells[1].textContent;
        
        // Format the date for the date input (yyyy-mm-dd)
        const dateParts = cells[6].textContent.split('-');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        document.getElementById('receiptDate').value = formattedDate;
        
        document.getElementById('receiptAmount').value = cells[5].textContent.replace(' vnđ', '');
        document.getElementById('receiptPayer').value = cells[4].textContent;
        document.getElementById('receiptContent').value = cells[2].textContent;
        document.getElementById('receiptCashier').value = cells[3].textContent;
        
        // Disable form editing by default
        toggleReceiptFormEditing(false);
    }

    function toggleReceiptFormEditing(editable) {
        // Get all form inputs except the receipt number (which should remain readonly)
        const formInputs = document.querySelectorAll('.receipt-form input:not(#receiptNumber), .receipt-form textarea');
        
        formInputs.forEach(input => {
            input.readOnly = !editable;
        });
        
        // Show/hide save button
        saveReceiptBtn.style.display = editable ? 'flex' : 'none';
        editReceiptBtn.style.display = editable ? 'none' : 'flex';
    }

    function saveReceiptChanges() {
        // Get the updated values
        const receiptNumber = document.getElementById('receiptNumber').value;
        const receiptDate = document.getElementById('receiptDate').value;
        const receiptAmount = document.getElementById('receiptAmount').value;
        const receiptPayer = document.getElementById('receiptPayer').value;
        const receiptContent = document.getElementById('receiptContent').value;
        const receiptCashier = document.getElementById('receiptCashier').value;
        
        // Find the selected row
        const selectedRow = document.querySelector('.receipt-table tbody tr.selected');
        if (selectedRow) {
            const cells = selectedRow.querySelectorAll('td');
            
            // Update the row with the new values
            cells[1].textContent = receiptNumber;
            cells[2].textContent = receiptContent;
            cells[3].textContent = receiptCashier;
            cells[4].textContent = receiptPayer;
            cells[5].textContent = receiptAmount + ' vnđ';
            
            // Format the date for display (dd-mm-yyyy)
            const dateParts = receiptDate.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            cells[6].textContent = formattedDate;
        }
        
        // Disable editing
        toggleReceiptFormEditing(false);
        
        // Show success message
        showNotification('Phiếu thu đã được cập nhật thành công!', 'success');
    }

    function refreshCurrentReceipt() {
        const selectedRow = document.querySelector('.receipt-table tbody tr.selected');
        if (selectedRow) {
            loadReceiptDetails(selectedRow);
        }
        
        // Show notification
        showNotification('Đã làm mới thông tin phiếu thu!', 'info');
    }

    function refreshReceiptData() {
        // Simulate data refresh
        showNotification('Đã làm mới dữ liệu phiếu thu!', 'info');
    }

    function printReceipt() {
        // Simulate printing
        showNotification('Đang in phiếu thu...', 'info');
    }

    function exportReceiptToPdf() {
        // Simulate PDF export
        showNotification('Đang xuất PDF...', 'info');
    }

    function searchReceipts(query) {
        query = query.toLowerCase();
        
        receiptRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function filterReceiptsByDate(filter) {
        // Reset display
        receiptRows.forEach(row => {
            row.style.display = '';
        });
        
        if (!filter) return;
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        receiptRows.forEach(row => {
            const dateCell = row.querySelectorAll('td')[6].textContent;
            const dateParts = dateCell.split('-');
            const receiptDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            
            let show = false;
            
            switch (filter) {
                case 'today':
                    show = receiptDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    show = receiptDate >= weekAgo && receiptDate <= today;
                    break;
                case 'month':
                    show = receiptDate.getMonth() === currentMonth && 
                           receiptDate.getFullYear() === currentYear;
                    break;
                default:
                    show = true;
            }
            
            row.style.display = show ? '' : 'none';
        });
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${getIconForType(type)}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to the DOM
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto close after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    function getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }

    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            padding: 15px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1100;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-icon {
            margin-right: 15px;
            font-size: 20px;
        }
        
        .notification.success .notification-icon {
            color: #28a745;
        }
        
        .notification.error .notification-icon {
            color: #dc3545;
        }
        
        .notification.warning .notification-icon {
            color: #ffc107;
        }
        
        .notification.info .notification-icon {
            color: #17a2b8;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content p {
            margin: 0;
            color: #343a40;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            font-size: 14px;
            transition: color 0.3s;
        }
        
        .notification-close:hover {
            color: #343a40;
        }
    `;
    document.head.appendChild(notificationStyles);
});
