document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
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
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Handle tab content switching if needed
            const tabId = this.getAttribute('data-tab');
            
            // Example: Refresh tab functionality
            if (tabId === 'refresh') {
                location.reload();
            }
        });
    });
    
    // Exam table row selection
    const examRows = document.querySelectorAll('.exam-table tbody tr');
    
    examRows.forEach(row => {
        row.addEventListener('click', function() {
            examRows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update exam details panel based on selected row
            updateExamDetails(this);
        });
    });
    
    // Search functionality
    const examSearch = document.getElementById('examSearch');
    
    if (examSearch) {
        examSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            examRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Filter functionality
    const filterExams = document.getElementById('filterExams');
    
    if (filterExams) {
        filterExams.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            
            if (filterValue === '') {
                // Show all rows
                examRows.forEach(row => {
                    row.style.display = '';
                });
                return;
            }
            
            // In a real application, you would have a status column to filter by
            // For this demo, we'll just filter based on the exam date
            examRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const dateCell = cells[4].textContent; // Date is in the 5th column (index 4)
                
                // Simple logic for demo purposes
                const date = new Date(dateCell.split('-').reverse().join('-'));
                const today = new Date();
                
                if (filterValue === 'upcoming' && date > today) {
                    row.style.display = '';
                } else if (filterValue === 'completed' && date < today) {
                    row.style.display = '';
                } else if (filterValue === 'cancelled') {
                    // For demo, we don't have cancelled exams
                    row.style.display = 'none';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Add Exam Modal
    const addExamBtn = document.getElementById('addExamBtn');
    const addExamModal = document.getElementById('addExamModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (addExamBtn && addExamModal) {
        addExamBtn.addEventListener('click', function() {
            addExamModal.style.display = 'block';
        });
    }
    
    // Delete Exam Confirmation
    const deleteExamBtn = document.getElementById('deleteExamBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    
    if (deleteExamBtn && confirmationModal) {
        deleteExamBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'block';
        });
    }
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Save new exam
    const saveNewExamBtn = document.getElementById('saveNewExam');
    
    if (saveNewExamBtn) {
        saveNewExamBtn.addEventListener('click', function() {
            // Get form values
            const examCode = document.getElementById('examCode').value;
            const examName = document.getElementById('examName').value;
            const examCategory = document.getElementById('examCategory').value;
            const examDate = document.getElementById('examDate').value;
            const examFee = document.getElementById('examFee').value;
            
            // Validate form
            if (!examCode || !examName || !examCategory || !examDate || !examFee) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll just add a new row to the table
            addNewExamRow(examCode, examName, examCategory, examDate, examFee);
            
            // Close modal
            addExamModal.style.display = 'none';
            
            // Clear form
            document.getElementById('examCode').value = '';
            document.getElementById('examName').value = '';
            document.getElementById('examCategory').value = '';
            document.getElementById('examDate').value = '';
            document.getElementById('examFee').value = '';
            document.getElementById('examDetails').value = '';
        });
    }
    
    // Confirm delete
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            // Get selected row
            const selectedRow = document.querySelector('.exam-table tbody tr.selected');
            
            if (selectedRow) {
                // Remove row
                selectedRow.remove();
                
                // Select first row if available
                const firstRow = document.querySelector('.exam-table tbody tr');
                if (firstRow) {
                    firstRow.classList.add('selected');
                    updateExamDetails(firstRow);
                }
            }
            
            // Close modal
            confirmationModal.style.display = 'none';
        });
    }
    
    // Save exam changes
    const saveExamBtn = document.getElementById('saveExamBtn');
    
    if (saveExamBtn) {
        saveExamBtn.addEventListener('click', function() {
            alert('Thông tin lịch thi đã được lưu thành công!');
        });
    }
    
    // Helper function to update exam details panel
    function updateExamDetails(row) {
        const cells = row.querySelectorAll('td');
        
        // Update exam details in the right panel
        const examCodeValue = document.querySelector('.exam-details .info-item:nth-child(1) .value');
        const examNameValue = document.querySelector('.exam-details .info-item:nth-child(2) .value');
        const examCategorySelect = document.querySelector('.exam-details .info-item:nth-child(3) .value select');
        const examDateInput = document.querySelector('.exam-details .info-item:nth-child(4) .value input');
        const examFeeInput = document.querySelector('.exam-details .info-item:nth-child(5) .value input');
        
        if (examCodeValue) examCodeValue.textContent = cells[1].textContent;
        if (examNameValue) examNameValue.textContent = cells[2].textContent;
        
        if (examCategorySelect) {
            const category = cells[3].textContent;
            for (let i = 0; i < examCategorySelect.options.length; i++) {
                if (examCategorySelect.options[i].text === category) {
                    examCategorySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        if (examDateInput) {
            const dateParts = cells[4].textContent.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            examDateInput.value = formattedDate;
        }
        
        if (examFeeInput) examFeeInput.value = cells[5].textContent;
    }
    
    // Helper function to add a new exam row
    function addNewExamRow(code, name, category, date, fee) {
        const tbody = document.querySelector('.exam-table tbody');
        
        if (!tbody) return;
        
        // Get category text
        let categoryText = '';
        const categorySelect = document.getElementById('examCategory');
        if (categorySelect) {
            categoryText = categorySelect.options[categorySelect.selectedIndex].text;
        }
        
        // Format date for display (YYYY-MM-DD to DD-MM-YYYY)
        const dateParts = date.split('-');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        // Create new row
        const newRow = document.createElement('tr');
        
        // Get row count for STT
        const rowCount = tbody.querySelectorAll('tr').length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>${code}</td>
            <td>${name}</td>
            <td>${categoryText}</td>
            <td>${formattedDate}</td>
            <td>${fee}</td>
        `;
        
        // Add click event to new row
        newRow.addEventListener('click', function() {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            updateExamDetails(this);
        });
        
        // Add row to table
        tbody.appendChild(newRow);
        
        // Select new row
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(r => r.classList.remove('selected'));
        newRow.classList.add('selected');
        updateExamDetails(newRow);
    }
});
