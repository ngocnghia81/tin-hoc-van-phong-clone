// Teacher Schedule JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize current date and week
    const today = new Date();
    let currentWeekStart = getMonday(today);
    
    // Update calendar with current week
    updateCalendar(currentWeekStart);
    
    // Set up navigation buttons
    document.getElementById('prevWeek').addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateCalendar(currentWeekStart);
    });
    
    document.getElementById('nextWeek').addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateCalendar(currentWeekStart);
    });
    
    document.getElementById('todayBtn').addEventListener('click', function() {
        currentWeekStart = getMonday(new Date());
        updateCalendar(currentWeekStart);
    });
    
    // Set up view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Here you would implement view switching logic
        });
    });
    
    // Set up class event clicks
    setupClassEvents();
    
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

    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            document.getElementById('editProfileModal').classList.add('active');
        });
    }
    
    // Upload Avatar Button
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    if (uploadAvatarBtn) {
        uploadAvatarBtn.addEventListener('click', function() {
            document.getElementById('uploadAvatarModal').classList.add('active');
        });
    }
    
    // Save Profile Button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            // Get form values
            const phoneNumber = document.getElementById('editPhoneNumber').value;
            const email = document.getElementById('editEmail').value;
            const address = document.getElementById('editAddress').value;
            
            // Update the UI with the new values
            document.getElementById('phoneNumber').textContent = phoneNumber;
            document.getElementById('email').textContent = email;
            document.getElementById('address').textContent = address;
            
            // Close the modal
            document.getElementById('editProfileModal').classList.remove('active');
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
    
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', function() {
            // Update profile image with the preview image
            document.getElementById('profileImage').src = avatarPreview.src;
            
            // Close the modal
            document.getElementById('uploadAvatarModal').classList.remove('active');
        });
    }
    
    // Update current time indicator
    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000); // Update every minute
});

// Get Monday of the current week
function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date);
    monday.setDate(diff);
    return monday;
}

// Format date as DD/MM/YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Update calendar with the given week start date
function updateCalendar(weekStart) {
    // Update period text
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    document.getElementById('currentPeriod').textContent = 
        `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    
    // Update day headers
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const dayColumns = document.querySelectorAll('.day-column');
    
    dayColumns.forEach((column, index) => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + index);
        
        const dayNameElement = column.querySelector('.day-name');
        const dayDateElement = column.querySelector('.day-date');
        
        dayNameElement.textContent = dayNames[index];
        dayDateElement.textContent = formatDate(currentDate);
        
        // Highlight today
        const todayIndicator = column.querySelector('.today-indicator');
        if (todayIndicator) {
            todayIndicator.remove();
        }
        
        if (isToday(currentDate)) {
            const indicator = document.createElement('div');
            indicator.className = 'today-indicator';
            column.appendChild(indicator);
        }
    });
    
    // Clear existing class events
    const daySlots = document.querySelectorAll('.day-slots');
    daySlots.forEach(daySlot => {
        const events = daySlot.querySelectorAll('.class-event');
        events.forEach(event => event.remove());
    });
    
    // Add class events for the week
    addClassEvents(weekStart);
}

// Check if date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Add class events to the calendar
function addClassEvents(weekStart) {
    // This would typically fetch data from a server
    // For demo purposes, we'll use static data
    const classes = [
        {
            id: 1,
            title: 'Excel cơ bản',
            day: 0, // Monday
            startTime: '08:00',
            endTime: '10:00',
            room: 'Phòng 101',
            type: 'excel',
            students: 15,
            description: 'Giới thiệu về Microsoft Excel và các tính năng cơ bản.'
        },
        {
            id: 2,
            title: 'Word nâng cao',
            day: 1, // Tuesday
            startTime: '13:00',
            endTime: '15:00',
            room: 'Phòng 102',
            type: 'word',
            students: 12,
            description: 'Học các kỹ năng nâng cao trong Microsoft Word.'
        },
        {
            id: 3,
            title: 'PowerPoint',
            day: 2, // Wednesday
            startTime: '10:00',
            endTime: '12:00',
            room: 'Phòng 103',
            type: 'powerpoint',
            students: 18,
            description: 'Tạo bài thuyết trình chuyên nghiệp với PowerPoint.'
        },
        {
            id: 4,
            title: 'Photoshop cơ bản',
            day: 3, // Thursday
            startTime: '15:00',
            endTime: '17:00',
            room: 'Phòng 104',
            type: 'photoshop',
            students: 10,
            description: 'Giới thiệu về Adobe Photoshop và các công cụ cơ bản.'
        },
        {
            id: 5,
            title: 'Lập trình Python',
            day: 4, // Friday
            startTime: '09:00',
            endTime: '12:00',
            room: 'Phòng 105',
            type: 'programming',
            students: 8,
            description: 'Học lập trình Python từ cơ bản đến nâng cao.'
        },
        {
            id: 6,
            title: 'Excel nâng cao',
            day: 0, // Monday
            startTime: '14:00',
            endTime: '16:00',
            room: 'Phòng 101',
            type: 'excel',
            students: 12,
            description: 'Học các tính năng nâng cao trong Excel như PivotTable, Macro và VBA.'
        }
    ];
    
    classes.forEach(classItem => {
        const daySlot = document.querySelectorAll('.day-slots')[classItem.day];
        
        // Calculate position and height
        const startHour = parseInt(classItem.startTime.split(':')[0]);
        const startMinute = parseInt(classItem.startTime.split(':')[1]);
        const endHour = parseInt(classItem.endTime.split(':')[0]);
        const endMinute = parseInt(classItem.endTime.split(':')[1]);
        
        const startPosition = (startHour - 7) * 60 + startMinute;
        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
        
        const top = (startPosition / 60) * 60; // 60px per hour
        const height = (duration / 60) * 60;
        
        // Create class event element
        const classEvent = document.createElement('div');
        classEvent.className = `class-event ${classItem.type}`;
        classEvent.style.top = `${top}px`;
        classEvent.style.height = `${height}px`;
        classEvent.dataset.id = classItem.id;
        
        classEvent.innerHTML = `
            <div class="class-title">${classItem.title}</div>
            <div class="class-details">
                <span class="class-time">${classItem.startTime} - ${classItem.endTime}</span>
                <span class="class-room">${classItem.room}</span>
            </div>
        `;
        
        daySlot.appendChild(classEvent);
    });
    
    // Re-setup event listeners
    setupClassEvents();
}

// Set up class event click handlers
function setupClassEvents() {
    const classEvents = document.querySelectorAll('.class-event');
    classEvents.forEach(event => {
        event.addEventListener('click', function() {
            const classId = this.dataset.id;
            showClassDetails(classId);
        });
    });
}

// Show class details in modal
function showClassDetails(classId) {
    // This would typically fetch data from a server
    // For demo purposes, we'll use static data
    const classes = [
        {
            id: 1,
            title: 'Excel cơ bản',
            day: 'Thứ 2',
            date: '21/04/2025',
            startTime: '08:00',
            endTime: '10:00',
            room: 'Phòng 101',
            students: '15 học viên',
            description: 'Khóa học Excel cơ bản dành cho người mới bắt đầu. Học viên sẽ được hướng dẫn các kỹ năng cơ bản để sử dụng Excel hiệu quả trong công việc.'
        },
        {
            id: 2,
            title: 'Word nâng cao',
            day: 'Thứ 2',
            date: '21/04/2025',
            startTime: '13:30',
            endTime: '15:30',
            room: 'Phòng 203',
            students: '12 học viên',
            description: 'Khóa học Word nâng cao giúp học viên làm chủ các tính năng nâng cao của Microsoft Word như tạo mục lục tự động, quản lý tài liệu dài, và tạo các biểu mẫu chuyên nghiệp.'
        },
        {
            id: 3,
            title: 'PowerPoint cơ bản',
            day: 'Thứ 2',
            date: '21/04/2025',
            startTime: '18:00',
            endTime: '20:00',
            room: 'Phòng 105',
            students: '18 học viên',
            description: 'Khóa học PowerPoint cơ bản giúp học viên nắm vững các kỹ năng cần thiết để tạo các bài thuyết trình chuyên nghiệp và hiệu quả.'
        },
        {
            id: 4,
            title: 'Photoshop cơ bản',
            day: 'Thứ 3',
            date: '22/04/2025',
            startTime: '09:00',
            endTime: '12:00',
            room: 'Phòng 302',
            students: '10 học viên',
            description: 'Khóa học Photoshop cơ bản giúp học viên làm quen với giao diện và các công cụ cơ bản trong Photoshop để xử lý hình ảnh.'
        },
        {
            id: 5,
            title: 'Lập trình Python',
            day: 'Thứ 4',
            date: '23/04/2025',
            startTime: '09:00',
            endTime: '12:00',
            room: 'Phòng 401',
            students: '8 học viên',
            description: 'Khóa học lập trình Python cơ bản giúp học viên nắm vững cú pháp và các khái niệm cơ bản trong lập trình Python.'
        }
    ];
    
    // Find the class with the given ID
    const classInfo = classes.find(c => c.id === parseInt(classId)) || classes[0];
    
    // Update modal content
    document.getElementById('modalTitle').textContent = classInfo.title;
    document.getElementById('modalTime').textContent = `${classInfo.startTime} - ${classInfo.endTime}`;
    document.getElementById('modalDate').textContent = classInfo.date;
    document.getElementById('modalRoom').textContent = classInfo.room;
    document.getElementById('modalStudents').textContent = classInfo.students;
    document.getElementById('modalDescription').textContent = classInfo.description;
    
    // Show modal
    document.getElementById('classModal').classList.add('active');
}

// Update current time indicator
function updateCurrentTimeIndicator() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Only show indicator for current day and if it's a weekday (1-5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Only show during school hours (7:00 - 18:00)
        if (hours >= 7 && hours < 18) {
            const dayIndex = dayOfWeek - 1; // Adjust to 0-based index for Monday
            const daySlots = document.querySelectorAll('.day-slots')[dayIndex];
            
            // Remove existing indicator
            const existingIndicator = document.querySelector('.current-time-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Calculate position
            const timePosition = (hours - 7) * 60 + minutes;
            const top = (timePosition / 60) * 60; // 60px per hour
            
            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'current-time-indicator';
            indicator.style.top = `${top}px`;
            
            daySlots.appendChild(indicator);
        }
    }
}
