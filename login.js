// Login System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // User accounts database
    const users = [
        {
            username: 'hien',
            password: 'password123',
            fullName: 'Nguyễn Thị Thanh Hiền',
            role: 'admin',
            dashboard: 'dashboard.html'
        },
        {
            username: 'dieu',
            password: 'password123',
            fullName: 'Nguyễn Thị Thanh Diệu',
            role: 'teacher',
            dashboard: 'teacher-dashboard.html'
        },
        {
            username: 'duong',
            password: 'password123',
            fullName: 'Nguyễn Thị Thùy Dương',
            role: 'teacher',
            dashboard: 'teacher-dashboard.html'
        },
        {
            username: 'ai',
            password: 'password123',
            fullName: 'Phan Thị Ái Ái',
            role: 'student',
            dashboard: 'student-dashboard.html'
        }
    ];

    // Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const roleTabs = document.querySelectorAll('.role-tab');
    const selectedRoleInput = document.getElementById('selectedRole');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userProfileDropdown = document.querySelector('.user-profile');
    const usernameDisplay = document.getElementById('username');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const switchToRegisterBtn = document.getElementById('switchToRegister');

    // Check if user is already logged in
    checkLoginStatus();

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterModal();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    if (roleTabs) {
        roleTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                roleTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Update hidden input value
                if (selectedRoleInput) {
                    selectedRoleInput.value = this.dataset.role;
                }
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                hideModals();
            });
        });
    }

    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideModals();
            showRegisterModal();
        });
    }

    // Functions
    function showLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
        }
    }

    function showRegisterModal() {
        if (registerModal) {
            registerModal.style.display = 'flex';
        }
    }

    function hideModals() {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
        if (registerModal) {
            registerModal.style.display = 'none';
        }
    }

    function handleLogin() {
        const username = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const selectedRole = document.getElementById('selectedRole').value;
        
        // Find user by username and password
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            (selectedRole === 'all' || u.role === selectedRole)
        );
        
        if (user) {
            // Login successful
            loginSuccess(user);
        } else {
            // Login failed
            showLoginError('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    }

    function loginSuccess(user) {
        // Save user info to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            fullName: user.fullName,
            role: user.role
        }));
        
        // Hide login modal
        hideModals();
        
        // Show success message
        showNotification('Đăng nhập thành công!', 'success');
        
        // Redirect to appropriate dashboard based on role
        setTimeout(() => {
            window.location.href = user.dashboard;
        }, 1000);
    }

    function handleLogout() {
        // Clear user info from localStorage
        localStorage.removeItem('currentUser');
        
        // Update UI
        updateUIForLoggedOutUser();
        
        // Show success message
        showNotification('Đăng xuất thành công!', 'success');
        
        // Redirect to home page if not already there
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }

    function checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            // User is logged in
            updateUIForLoggedInUser(currentUser);
        } else {
            // User is not logged in
            updateUIForLoggedOutUser();
        }
    }

    function updateUIForLoggedInUser(user) {
        // Hide login/register buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        // Show user profile dropdown
        if (userProfileDropdown) userProfileDropdown.style.display = 'block';
        
        // Update username display
        if (usernameDisplay) usernameDisplay.textContent = user.fullName;
        
        // Update dashboard link based on role
        if (dashboardLink) {
            if (user.role === 'admin') {
                dashboardLink.href = 'dashboard.html';
            } else if (user.role === 'teacher') {
                dashboardLink.href = 'teacher-dashboard.html';
            } else if (user.role === 'student') {
                dashboardLink.href = 'student-dashboard.html';
            }
        }
    }

    function updateUIForLoggedOutUser() {
        // Show login/register buttons
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        
        // Hide user profile dropdown
        if (userProfileDropdown) userProfileDropdown.style.display = 'none';
    }

    function showLoginError(message) {
        // Check if error message element exists
        let errorElement = document.querySelector('.login-error');
        
        // Create error element if it doesn't exist
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'login-error';
            const formGroup = document.querySelector('.form-group');
            if (formGroup) {
                formGroup.parentNode.insertBefore(errorElement, formGroup);
            }
        }
        
        // Set error message
        errorElement.textContent = message;
        errorElement.style.display = 'block';
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

    // Add dropdown functionality for user profile
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-profile')) {
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu && dropdownMenu.classList.contains('show')) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    }
});
