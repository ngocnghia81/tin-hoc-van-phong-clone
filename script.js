// Preloader
window.addEventListener("load", () => {
    // Simulate loading time to ensure smooth transition
    setTimeout(() => {
        document.querySelector(".preloader").classList.add("fade-out");
        // Enable scrolling after preloader is hidden
        document.body.style.overflow = "auto";
    }, 500);
});

// Disable scrolling while preloader is visible
document.body.style.overflow = "hidden";

document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mainNav = document.querySelector(".main-nav");
    let mobileMenuOverlay;

    function createMobileMenuOverlay() {
        mobileMenuOverlay = document.createElement("div");
        mobileMenuOverlay.className = "mobile-menu-overlay";
        document.body.appendChild(mobileMenuOverlay);

        const closeBtn = document.createElement("button");
        closeBtn.className = "mobile-menu-close";
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mainNav.appendChild(closeBtn);

        closeBtn.addEventListener("click", closeMobileMenu);
        mobileMenuOverlay.addEventListener("click", closeMobileMenu);
    }

    function toggleMobileMenu() {
        if (!mobileMenuOverlay) {
            createMobileMenuOverlay();
        }

        mainNav.classList.toggle("active");
        mobileMenuOverlay.classList.toggle("active");
        document.body.style.overflow = mainNav.classList.contains("active")
            ? "hidden"
            : "";
    }

    function closeMobileMenu() {
        mainNav.classList.remove("active");
        mobileMenuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                closeMobileMenu();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector("a");
        link.addEventListener("click", function (e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                this.closest(".dropdown").classList.toggle("active");
            }
        });
    });

    // Hiệu ứng số đếm cho stats
    const stats = document.querySelectorAll(".stat-number");
    const statsOptions = {
        threshold: 1,
        rootMargin: "0px 0px -100px 0px",
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                animateNumber(target, 0, finalNumber, 2000);
                observer.unobserve(target);
            }
        });
    }, statsOptions);

    stats.forEach((stat) => {
        stat.style.counterReset = "stat 0";
        statsObserver.observe(stat);
    });

    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = Math.min((currentTime - startTime) / duration, 1);
            const current = Math.floor(start + easeOutQuart(elapsed) * range);
            element.textContent = current.toLocaleString();

            if (elapsed < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end.toLocaleString() + "+";
            }
        }

        requestAnimationFrame(updateNumber);
    }

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    // Hiệu ứng xuất hiện cho các thành phần khi scroll
    const animatedElements = document.querySelectorAll(
        ".advantage-item, .testimonial-item, .course-item"
    );

    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    animationObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    animatedElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition =
            "opacity 0.6s ease-out, transform 0.6s ease-out";
        animationObserver.observe(element);
    });

    // Course filtering functionality
    const courseList = document.querySelector(".course-list");
    const searchBox = document.createElement("div");
    searchBox.className = "search-box";
    searchBox.innerHTML = `
        <div class="search-filters">
            <div class="search-input-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Tìm kiếm khóa học..." id="searchInput">
            </div>
            <select id="locationFilter">
                <option value="">Tất cả địa điểm</option>
                <option value="227 Nguyễn Văn Cừ">227 Nguyễn Văn Cừ</option>
                <option value="153 Nguyễn Chí Thanh">153 Nguyễn Chí Thanh</option>
                <option value="Online">Online</option>
            </select>
            <select id="levelFilter">
                <option value="">Tất cả trình độ</option>
                <option value="basic">Cơ bản</option>
                <option value="advanced">Nâng cao</option>
                <option value="online">Online</option>
            </select>
        </div>
        <div class="active-filters"></div>
    `;
    courseList.parentNode.insertBefore(searchBox, courseList);

    const searchInput = document.getElementById("searchInput");
    const locationFilter = document.getElementById("locationFilter");
    const levelFilter = document.getElementById("levelFilter");
    const activeFilters = document.querySelector(".active-filters");

    function updateActiveFilters() {
        const filters = [];
        if (searchInput.value) {
            filters.push(`<span class="filter-tag" data-type="search">
                ${searchInput.value}
                <i class="fas fa-times" data-clear="search"></i>
            </span>`);
        }
        if (locationFilter.value) {
            filters.push(`<span class="filter-tag" data-type="location">
                ${locationFilter.value}
                <i class="fas fa-times" data-clear="location"></i>
            </span>`);
        }
        if (levelFilter.value) {
            filters.push(`<span class="filter-tag" data-type="level">
                ${levelFilter.options[levelFilter.selectedIndex].text}
                <i class="fas fa-times" data-clear="level"></i>
            </span>`);
        }

        activeFilters.innerHTML = filters.length ? filters.join("") : "";
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const location = locationFilter.value;
        const level = levelFilter.value;

        courseList.classList.add("loading");

        setTimeout(() => {
            document.querySelectorAll(".course-item").forEach((item) => {
                const courseText = item.textContent.toLowerCase();
                const courseLocation = item.querySelector(
                    ".info-row:last-child .value"
                ).textContent;
                const courseLevel = item
                    .querySelector(".course-type-badge")
                    .classList.contains(level);

                const matchesSearch = courseText.includes(searchTerm);
                const matchesLocation =
                    !location || courseLocation.includes(location);
                const matchesLevel = !level || courseLevel;

                item.style.display =
                    matchesSearch && matchesLocation && matchesLevel
                        ? "block"
                        : "none";
            });

            courseList.classList.remove("loading");
            updateActiveFilters();
        }, 300);
    }

    // Event listeners for filters
    searchInput.addEventListener("input", debounce(filterCourses, 300));
    locationFilter.addEventListener("change", filterCourses);
    levelFilter.addEventListener("change", filterCourses);

    // Clear individual filters
    activeFilters.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-times")) {
            const filterType = e.target.dataset.clear;
            if (filterType === "search") searchInput.value = "";
            if (filterType === "location") locationFilter.value = "";
            if (filterType === "level") levelFilter.value = "";
            filterCourses();
        }
    });

    // Registration modal handling
    document.querySelectorAll(".register-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const courseInfo = this.closest(".course-item");
            const courseName = courseInfo.querySelector(
                ".info-row:first-child .value"
            ).textContent;
            const courseTime = courseInfo.querySelector(
                ".info-row:nth-child(2) .value"
            ).textContent;
            const startDate = courseInfo.querySelector(
                ".info-row:nth-child(3) .value"
            ).textContent;
            const courseLocation = courseInfo.querySelector(
                ".info-row:last-child .value"
            ).textContent;
            const coursePrice =
                courseInfo.querySelector(".course-price").textContent;

            const modal = document.createElement("div");
            modal.className = "modal";
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Đăng ký khóa học</h3>
                        <button class="close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="course-summary">
                            <div class="summary-item">
                                <i class="fas fa-graduation-cap"></i>
                                <div>
                                    <label>Khóa học:</label>
                                    <span>${courseName}</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <label>Thời gian học:</label>
                                    <span>${courseTime}</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <i class="fas fa-calendar"></i>
                                <div>
                                    <label>Ngày khai giảng:</label>
                                    <span>${startDate}</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <label>Địa điểm:</label>
                                    <span>${courseLocation}</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <i class="fas fa-tag"></i>
                                <div>
                                    <label>Học phí:</label>
                                    <span>${coursePrice}</span>
                                </div>
                            </div>
                        </div>
                        <div class="contact-options">
                            <a href="tel:02838354409" class="contact-btn call">
                                <i class="fas fa-phone"></i> Gọi ngay
                            </a>
                            <a href="https://zalo.me/02838354409" target="_blank" class="contact-btn zalo">
                                <i class="fas fa-comment"></i> Chat Zalo
                            </a>
                            <button class="contact-btn register">
                                <i class="fas fa-user-plus"></i> Đăng ký online
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal functionality
            const closeBtn = modal.querySelector(".close-btn");
            closeBtn.addEventListener("click", () => modal.remove());

            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.remove();
            });

            // Register button handling
            const registerBtn = modal.querySelector(".contact-btn.register");
            registerBtn.addEventListener("click", () => {
                modal.querySelector(".modal-body").innerHTML = `
                    <form class="registration-form">
                        <div class="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại:</label>
                            <input type="tel" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Mật khẩu:</label>
                            <input type="password" id="registerPassword" required>
                        </div>
                        <div class="form-group">
                            <label>Xác nhận mật khẩu:</label>
                            <input type="password" id="confirmPassword" required>
                        </div>
                        <div class="form-group">
                            <label>Vai trò:</label>
                            <div class="role-selection">
                                <input type="radio" name="registerRole" value="student" id="studentRole" checked>
                                <label for="studentRole">Học viên</label>
                                <input type="radio" name="registerRole" value="teacher" id="teacherRole">
                                <label for="teacherRole">Giảng viên</label>
                                <input type="radio" name="registerRole" value="admin" id="adminRole">
                                <label for="adminRole">Quản lý</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Ghi chú:</label>
                            <textarea></textarea>
                        </div>
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-paper-plane"></i> Gửi đăng ký
                        </button>
                    </form>
                `;

                const form = modal.querySelector(".registration-form");
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    modal.querySelector(".modal-body").innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h4>Đăng ký thành công!</h4>
                            <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                        </div>
                    `;
                    setTimeout(() => modal.remove(), 2000);
                });
            });
        });
    });

    // Menu active state
    const menuItems = document.querySelectorAll(".main-nav a");
    menuItems.forEach((item) => {
        item.addEventListener("click", function () {
            menuItems.forEach((i) => i.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Authentication System
    const authSystem = {
        // DOM Elements
        elements: {
            loginBtn: document.getElementById("loginBtn"),
            registerBtn: document.getElementById("registerBtn"),
            loginModal: document.getElementById("loginModal"),
            registerModal: document.getElementById("registerModal"),
            forgotPasswordModal: document.getElementById("forgotPasswordModal"),
            loginForm: document.getElementById("loginForm"),
            registerForm: document.getElementById("registerForm"),
            forgotPasswordForm: document.getElementById("forgotPasswordForm"),
            forgotPasswordLink: document.getElementById("forgotPasswordLink"),
            switchToRegister: document.getElementById("switchToRegister"),
            switchToLogin: document.getElementById("switchToLogin"),
            backToLogin: document.getElementById("backToLogin"),
            logoutBtn: document.getElementById("logoutBtn"),
            userProfile: document.querySelector(".user-profile"),
            usernameDisplay: document.getElementById("username"),
            closeModalBtns: document.querySelectorAll(".close-modal"),
        },

        // Initialize authentication system
        init() {
            this.setupEventListeners();
            this.checkAuthStatus();
            this.createToastContainer();
        },

        // Set up event listeners for auth elements
        setupEventListeners() {
            const { elements } = this;

            // Open modals
            elements.loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.openModal(elements.loginModal);
            });

            elements.registerBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.openModal(elements.registerModal);
            });

            // Role tabs in login form
            const loginRoleTabs = document.querySelectorAll('#loginForm .role-tab');
            const selectedRoleInput = document.getElementById('selectedRole');
            
            loginRoleTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    loginRoleTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Update hidden input value
                    selectedRoleInput.value = tab.dataset.role;
                });
            });
            
            // Close modals
            elements.closeModalBtns.forEach((btn) => {
                btn.addEventListener("click", () => {
                    this.closeAllModals();
                });
            });

            // Close modal when clicking outside
            window.addEventListener("click", (e) => {
                if (e.target.classList.contains("modal")) {
                    this.closeAllModals();
                }
            });

            // Switch between auth modals
            elements.switchToRegister.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeModal(elements.loginModal);
                this.openModal(elements.registerModal);
            });

            elements.switchToLogin.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeModal(elements.registerModal);
                this.openModal(elements.loginModal);
            });

            // Forgot password
            elements.forgotPasswordLink.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeModal(elements.loginModal);
                this.openModal(elements.forgotPasswordModal);
            });

            elements.backToLogin.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeModal(elements.forgotPasswordModal);
                this.openModal(elements.loginModal);
            });

            // Form submissions
            elements.loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            elements.registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleRegistration();
            });

            elements.forgotPasswordForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });

            // Logout
            elements.logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        },

        // Open a modal
        openModal(modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        },

        // Close a modal
        closeModal(modal) {
            modal.style.display = "none";
        },

        // Close all modals
        closeAllModals() {
            const { elements } = this;
            elements.loginModal.style.display = "none";
            elements.registerModal.style.display = "none";
            elements.forgotPasswordModal.style.display = "none";
            document.body.style.overflow = "";
        },

        // Handle login form submission
        handleLogin() {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const selectedRole = document.getElementById("selectedRole").value;

            // Basic validation
            if (!email || !password) {
                this.showToast("error", "Lỗi đăng nhập", "Vui lòng nhập đầy đủ thông tin");
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // For demo purposes, any login succeeds
                const userData = {
                    id: "user123",
                    name: email.split("@")[0],
                    email: email,
                    role: selectedRole
                };

                // Save user data to localStorage
                this.setUserData(userData);
                
                // Update UI
                this.updateAuthUI(true);
                
                // Close modal
                this.closeAllModals();
                
                // Show success message with role information
                let roleText = "";
                switch(selectedRole) {
                    case "student":
                        roleText = "Học viên";
                        break;
                    case "teacher":
                        roleText = "Giảng viên";
                        break;
                    case "admin":
                        roleText = "Quản lý";
                        break;
                }
                
                this.showToast(
                    "success", 
                    "Đăng nhập thành công", 
                    `Chào mừng ${roleText} ${userData.name} đã quay trở lại!`
                );
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1500);
            }, 1000);
        },

        // Handle registration form submission
        handleRegistration() {
            const fullName = document.getElementById("registerFullName").value;
            const email = document.getElementById("registerEmail").value;
            const phone = document.getElementById("registerPhone").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const selectedRole = document.getElementById("selectedRegisterRole").value;

            // Basic validation
            if (!fullName || !email || !phone || !password || !confirmPassword) {
                this.showToast("error", "Lỗi đăng ký", "Vui lòng nhập đầy đủ thông tin");
                return;
            }

            if (password !== confirmPassword) {
                this.showToast("error", "Lỗi đăng ký", "Mật khẩu xác nhận không khớp");
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // For demo purposes, registration always succeeds
                const userData = {
                    id: "user" + Math.floor(Math.random() * 1000),
                    name: fullName,
                    email: email,
                    phone: phone,
                    role: selectedRole
                };

                // Save user data to localStorage
                this.setUserData(userData);
                
                // Update UI
                this.updateAuthUI(true);
                
                // Close modal
                this.closeAllModals();
                
                // Show success message with role information
                this.showToast(
                    "success", 
                    "Đăng ký thành công", 
                    `Tài khoản Sinh Viên của bạn đã được tạo thành công!`
                );
            }, 1000);
        },

        // Handle forgot password form submission
        handleForgotPassword() {
            const email = document.getElementById("resetEmail").value;

            // Basic validation
            if (!email) {
                this.showToast("error", "Lỗi", "Vui lòng nhập địa chỉ email");
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // Close modal
                this.closeAllModals();
                
                // Show success message
                this.showToast(
                    "info", 
                    "Yêu cầu đã được gửi", 
                    "Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn"
                );
            }, 1000);
        },

        // Handle logout
        handleLogout() {
            // Clear user data
            localStorage.removeItem("userData");
            
            // Update UI
            this.updateAuthUI(false);
            
            // Show message
            this.showToast("info", "Đăng xuất thành công", "Hẹn gặp lại bạn!");
        },

        // Check authentication status on page load
        checkAuthStatus() {
            const userData = this.getUserData();
            this.updateAuthUI(!!userData);
        },

        // Update UI based on auth status
        updateAuthUI(isLoggedIn) {
            const { elements } = this;
            
            if (isLoggedIn) {
                // User is logged in
                elements.loginBtn.style.display = "none";
                elements.registerBtn.style.display = "none";
                elements.userProfile.style.display = "block";
                
                // Update username display
                const userData = this.getUserData();
                if (userData) {
                    let roleIcon = "user";
                    let roleLabel = "";
                    
                    switch(userData.role) {
                        case "student":
                            roleIcon = "user-graduate";
                            roleLabel = "Học viên";
                            break;
                        case "teacher":
                            roleIcon = "chalkboard-teacher";
                            roleLabel = "Giảng viên";
                            break;
                        case "admin":
                            roleIcon = "user-shield";
                            roleLabel = "Quản lý";
                            break;
                    }
                    
                    elements.usernameDisplay.textContent = userData.name;
                    
                    // Update the icon in the user profile button
                    const userProfileIcon = elements.userProfile.querySelector("a i:first-child");
                    if (userProfileIcon) {
                        userProfileIcon.className = `fas fa-${roleIcon}`;
                    }
                    
                    // Add role label if it doesn't exist
                    const roleSpan = document.getElementById("userRoleLabel");
                    if (!roleSpan && roleLabel) {
                        const newRoleSpan = document.createElement("span");
                        newRoleSpan.id = "userRoleLabel";
                        newRoleSpan.className = "role-badge";
                        newRoleSpan.textContent = roleLabel;
                        elements.userProfile.querySelector("a").insertBefore(
                            newRoleSpan, 
                            elements.userProfile.querySelector("a i:last-child")
                        );
                    } else if (roleSpan && roleLabel) {
                        roleSpan.textContent = roleLabel;
                    }
                }
            } else {
                // User is logged out
                elements.loginBtn.style.display = "block";
                elements.registerBtn.style.display = "block";
                elements.userProfile.style.display = "none";
            }
        },

        // Get user data from localStorage
        getUserData() {
            const userDataStr = localStorage.getItem("userData");
            return userDataStr ? JSON.parse(userDataStr) : null;
        },

        // Save user data to localStorage
        setUserData(userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        },

        // Create toast container
        createToastContainer() {
            const container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        },

        // Show toast notification
        showToast(type, title, message) {
            const container = document.querySelector(".toast-container");
            
            // Create toast element
            const toast = document.createElement("div");
            toast.className = `toast ${type}`;
            
            // Set icon based on type
            let icon = "";
            switch (type) {
                case "success":
                    icon = "check-circle";
                    break;
                case "error":
                    icon = "exclamation-circle";
                    break;
                case "info":
                    icon = "info-circle";
                    break;
                default:
                    icon = "bell";
            }
            
            // Toast content
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add to container
            container.appendChild(toast);
            
            // Close button functionality
            const closeBtn = toast.querySelector(".toast-close");
            closeBtn.addEventListener("click", () => {
                toast.remove();
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(20px)";
                toast.style.transition = "all 0.3s ease";
                
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 5000);
        }
    };

    // Initialize authentication system
    authSystem.init();

    // Back to top button
    const backToTopButton = document.createElement("a");
    backToTopButton.href = "#";
    backToTopButton.className = "back-to-top";
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopButton);

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    });

    backToTopButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
});
