// Grade Entry JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const courseSelect = document.getElementById('courseSelect');
    const classSelect = document.getElementById('classSelect');
    const studentGradeList = document.getElementById('studentGradeList');
    const confirmGradesBtn = document.getElementById('confirmGrades');
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    // Add event listeners to grade inputs for validation
    gradeInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateGradeInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateGradeInput(this, true);
        });
    });
    
    // Course select change event
    courseSelect.addEventListener('change', function() {
        updateClassOptions();
    });
    
    // Class select change event
    classSelect.addEventListener('change', function() {
        if (this.value) {
            loadStudents(courseSelect.value, this.value);
        }
    });
    
    // Confirm grades button click
    confirmGradesBtn.addEventListener('click', function() {
        saveGrades();
    });
    
    // Functions
    function updateClassOptions() {
        const courseValue = courseSelect.value;
        
        // Clear current options except the first one
        while (classSelect.options.length > 1) {
            classSelect.remove(1);
        }
        
        // Reset class select
        classSelect.value = '';
        
        if (!courseValue) return;
        
        // Add appropriate class options based on course
        let classOptions = [];
        
        switch(courseValue) {
            case 'cb':
                classOptions = [
                    { value: 'cb01', text: 'CB01' },
                    { value: 'cb02', text: 'CB02' }
                ];
                break;
            case 'nc':
                classOptions = [
                    { value: 'nc01', text: 'NC01' },
                    { value: 'nc02', text: 'NC02' }
                ];
                break;
            case 'tt':
                classOptions = [
                    { value: 'online1', text: 'ONLINE1' },
                    { value: 'online2', text: 'ONLINE2' }
                ];
                break;
        }
        
        // Add new options
        classOptions.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.text;
            classSelect.appendChild(newOption);
        });
    }
    
    function loadStudents(course, classId) {
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        
        // Clear current student list
        studentGradeList.innerHTML = '';
        
        // Mock student data
        const students = [
            { id: '15110366', name: 'Hồ Thị Vinh', grade: '13' },
            { id: '15110367', name: 'Nguyễn Văn An', grade: '' },
            { id: '15110368', name: 'Trần Thị Bình', grade: '' },
            { id: '15110369', name: 'Lê Văn Cường', grade: '' },
            { id: '15110370', name: 'Phạm Thị Dung', grade: '' },
            { id: '15110371', name: 'Vũ Văn Em', grade: '' },
            { id: '15110372', name: 'Đỗ Thị Phương', grade: '' },
            { id: '15110373', name: 'Hoàng Văn Giang', grade: '' }
        ];
        
        // Populate student list
        students.forEach(student => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <input type="text" class="grade-input" value="${student.grade}" data-student-id="${student.id}">
                </td>
            `;
            
            studentGradeList.appendChild(row);
        });
        
        // Re-attach event listeners to new inputs
        const newGradeInputs = studentGradeList.querySelectorAll('.grade-input');
        newGradeInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateGradeInput(this);
            });
            
            input.addEventListener('blur', function() {
                validateGradeInput(this, true);
            });
        });
    }
    
    function validateGradeInput(input, isBlur = false) {
        // Remove non-numeric characters
        input.value = input.value.replace(/[^0-9.]/g, '');
        
        // Validate grade range on blur
        if (isBlur && input.value !== '') {
            const grade = parseFloat(input.value);
            
            if (grade < 0) {
                input.value = '0';
            } else if (grade > 20) {
                input.value = '20';
            }
            
            // Format to at most 1 decimal place
            if (input.value.includes('.')) {
                const parts = input.value.split('.');
                if (parts[1].length > 1) {
                    input.value = parseFloat(input.value).toFixed(1);
                }
            }
        }
    }
    
    function saveGrades() {
        // Validate course and class selection
        if (!courseSelect.value || !classSelect.value) {
            showNotification('Vui lòng chọn Khóa học và Lớp học', 'error');
            return;
        }
        
        // Get all grade inputs
        const gradeInputs = document.querySelectorAll('.grade-input');
        const grades = [];
        
        // Collect grades
        gradeInputs.forEach(input => {
            grades.push({
                studentId: input.dataset.studentId || input.closest('tr').cells[0].textContent,
                grade: input.value
            });
        });
        
        // In a real application, this would be an API call to save grades
        console.log('Saving grades:', {
            course: courseSelect.value,
            class: classSelect.value,
            grades: grades
        });
        
        // Show success message
        showSuccessMessage();
    }
    
    function showSuccessMessage() {
        // Check if success message already exists
        let successMessage = document.querySelector('.success-message');
        
        if (!successMessage) {
            // Create success message
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Điểm đã được lưu thành công!';
            
            // Insert before the grade table
            const gradeTableContainer = document.querySelector('.grade-table-container');
            gradeTableContainer.parentNode.insertBefore(successMessage, gradeTableContainer);
        }
        
        // Show the message
        successMessage.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
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
});
