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
    
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.user-dropdown')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Handle refresh tab
            if (this.dataset.tab === 'refresh') {
                location.reload();
            }
        });
    });
    
    // Course table row selection
    const courseTableRows = document.querySelectorAll('.course-table tbody tr');
    
    courseTableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selected class from all rows
            courseTableRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Update course details panel with selected course data
            updateCourseDetails(this);
        });
    });
    
    // Function to update course details panel
    function updateCourseDetails(row) {
        const cells = row.cells;
        
        // Get data from selected row
        const courseId = cells[1].textContent;
        const courseName = cells[2].textContent;
        const courseFee = cells[3].textContent;
        const courseSessions = cells[4].textContent;
        const courseField = cells[5].textContent;
        
        // Update course details in the right panel
        document.querySelector('.course-title h2').textContent = courseName;
        document.querySelector('.course-id').textContent = `Mã khóa học: ${courseId}`;
        
        // Update info grid values
        const infoValues = document.querySelectorAll('.info-value');
        infoValues[0].textContent = courseName;
        infoValues[1].textContent = courseId;
        infoValues[2].textContent = courseFee;
        infoValues[3].textContent = courseSessions;
        infoValues[4].textContent = courseField;
    }
    
    // Search functionality
    const courseSearch = document.getElementById('courseSearch');
    
    if (courseSearch) {
        courseSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            courseTableRows.forEach(row => {
                const courseName = row.cells[2].textContent.toLowerCase();
                const courseId = row.cells[1].textContent.toLowerCase();
                
                if (courseName.includes(searchTerm) || courseId.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Filter functionality
    const filterCourses = document.getElementById('filterCourses');
    
    if (filterCourses) {
        filterCourses.addEventListener('change', function() {
            const filterValue = this.value;
            
            if (filterValue === '') {
                // Show all courses
                courseTableRows.forEach(row => {
                    row.style.display = '';
                });
            } else {
                // Filter courses by status
                courseTableRows.forEach(row => {
                    const courseStatus = row.dataset.status || 'active'; // Default to active if not set
                    
                    if (courseStatus === filterValue) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Add Course Modal
    const addCourseBtn = document.getElementById('addCourseBtn');
    const addCourseModal = document.getElementById('addCourseModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (addCourseBtn && addCourseModal) {
        addCourseBtn.addEventListener('click', function() {
            addCourseModal.classList.add('show');
        });
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                addCourseModal.classList.remove('show');
                document.getElementById('confirmationModal').classList.remove('show');
            });
        });
    }
    
    // Save Course Button
    const saveCourseBtn = document.getElementById('saveCourseBtn');
    
    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', function() {
            // Validate form
            const courseNameInput = document.getElementById('courseName');
            const courseIdInput = document.getElementById('courseId');
            
            if (!courseNameInput.value || !courseIdInput.value) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }
            
            // Here you would typically send the data to a server
            // For demo purposes, we'll just close the modal and show a success message
            alert('Đã thêm khóa học thành công!');
            addCourseModal.classList.remove('show');
        });
    }
    
    // Delete Course Button
    const deleteCourseBtn = document.querySelector('.action-btn.delete');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    
    if (deleteCourseBtn && confirmationModal) {
        deleteCourseBtn.addEventListener('click', function() {
            document.getElementById('confirmationMessage').textContent = 'Bạn có chắc chắn muốn xóa khóa học này?';
            confirmationModal.classList.add('show');
        });
        
        confirmActionBtn.addEventListener('click', function() {
            // Here you would typically send a delete request to the server
            // For demo purposes, we'll just close the modal and show a success message
            alert('Đã xóa khóa học thành công!');
            confirmationModal.classList.remove('show');
        });
    }
    
    // Pagination
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Remove active class from all pagination buttons
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically load the corresponding page of data
            // For demo purposes, we'll just log the page number
            console.log('Loading page:', this.textContent);
        });
    });
    
    // Editor toolbar functionality
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Here you would typically implement the corresponding editor action
            // For demo purposes, we'll just log the action
            console.log('Editor action:', this.getAttribute('title'));
        });
    });
    
    // Save content button
    const saveContentBtn = document.querySelector('.action-btn.save');
    
    if (saveContentBtn) {
        saveContentBtn.addEventListener('click', function() {
            // Here you would typically save the editor content
            // For demo purposes, we'll just show a success message
            alert('Nội dung đã được lưu thành công!');
        });
    }
});
