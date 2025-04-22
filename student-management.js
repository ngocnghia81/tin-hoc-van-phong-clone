document.addEventListener("DOMContentLoaded", function () {
    // Initialize user data
    const userData = getUserData();
    if (userData) {
        updateUserInfo(userData);
    }

    // Toggle sidebar on mobile
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

    // Tab navigation
    const tabButtons = document.querySelectorAll(".tab-btn");

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all tabs
            tabButtons.forEach((btn) => btn.classList.remove("active"));

            // Add active class to clicked tab
            this.classList.add("active");

            // Handle specific tab actions
            const tabType = this.dataset.tab;

            if (tabType === "refresh") {
                showNotification("Đang làm mới dữ liệu...", "info");

                // Simulate refresh delay
                setTimeout(() => {
                    showNotification("Dữ liệu đã được cập nhật!", "success");
                }, 1000);
            }
        });
    });

    // Student row selection
    const studentRows = document.querySelectorAll(".student-table tbody tr");

    studentRows.forEach((row) => {
        row.addEventListener("click", function () {
            // Remove selected class from all rows
            studentRows.forEach((r) => r.classList.remove("selected"));

            // Add selected class to clicked row
            this.classList.add("selected");

            // Update student details panel with selected student data
            const studentName =
                this.querySelector("td:nth-child(3)").textContent;
            const studentId = this.querySelector("td:nth-child(2)").textContent;
            const studentEmail =
                this.querySelector("td:nth-child(5)").textContent;
            const studentPhone =
                this.querySelector("td:nth-child(4)").textContent;
            const statusBadge = this.querySelector(".status-badge");
            const status = statusBadge.textContent;
            const statusClass = statusBadge.classList.contains("active")
                ? "active"
                : statusBadge.classList.contains("inactive")
                ? "inactive"
                : "completed";

            // Update profile section
            document.querySelector(".student-name").textContent = studentName;
            document.querySelector(
                ".student-id"
            ).textContent = `Mã HV: ${studentId}`;
            document.querySelector(
                ".status-dot"
            ).className = `status-dot ${statusClass}`;
            document.querySelector(".status-text").textContent = status;

            // Update form fields
            document.getElementById("studentName").value = studentName;
            document.getElementById("studentEmail").value = studentEmail;
            document.getElementById("studentPhone").value = studentPhone;

            // Show notification
            showNotification(`Đã chọn học viên: ${studentName}`, "info");
        });
    });

    // Search functionality
    const studentSearch = document.getElementById("studentSearch");

    if (studentSearch) {
        studentSearch.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();

            studentRows.forEach((row) => {
                const studentName = row
                    .querySelector("td:nth-child(3)")
                    .textContent.toLowerCase();
                const studentId = row
                    .querySelector("td:nth-child(2)")
                    .textContent.toLowerCase();
                const studentEmail = row
                    .querySelector("td:nth-child(5)")
                    .textContent.toLowerCase();
                const studentPhone = row
                    .querySelector("td:nth-child(4)")
                    .textContent.toLowerCase();

                // Show/hide rows based on search term
                if (
                    studentName.includes(searchTerm) ||
                    studentId.includes(searchTerm) ||
                    studentEmail.includes(searchTerm) ||
                    studentPhone.includes(searchTerm)
                ) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // Filter functionality
    const filterStudents = document.getElementById("filterStudents");

    if (filterStudents) {
        filterStudents.addEventListener("change", function () {
            const filterValue = this.value;

            studentRows.forEach((row) => {
                const statusCell = row.querySelector("td:last-child");
                const statusBadge = statusCell.querySelector(".status-badge");

                if (filterValue === "") {
                    // Show all rows
                    row.style.display = "";
                } else if (
                    filterValue === "active" &&
                    statusBadge.classList.contains("active")
                ) {
                    row.style.display = "";
                } else if (
                    filterValue === "inactive" &&
                    statusBadge.classList.contains("inactive")
                ) {
                    row.style.display = "";
                } else if (
                    filterValue === "completed" &&
                    statusBadge.classList.contains("completed")
                ) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // Add Student Button
    const addStudentBtn = document.getElementById("addStudentBtn");
    const addStudentModal = document.getElementById("addStudentModal");
    const closeModalBtns = document.querySelectorAll(
        ".close-modal, .cancel-btn"
    );

    if (addStudentBtn) {
        addStudentBtn.addEventListener("click", function () {
            addStudentModal.classList.add("active");
        });
    }

    // Close modals
    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            // Find the closest modal parent
            const modal = this.closest(".modal");
            if (modal) {
                modal.classList.remove("active");
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    });

    // Add Student Form Submission
    const addStudentForm = document.getElementById("addStudentForm");

    if (addStudentForm) {
        addStudentForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById("newStudentName").value;
            const phone = document.getElementById("newStudentPhone").value;
            const email = document.getElementById("newStudentEmail").value;
            const course =
                document.getElementById("newStudentCourse").options[
                    document.getElementById("newStudentCourse").selectedIndex
                ].text;

            // In a real application, you would send this data to the server
            // For now, just show a success message and simulate adding a new row

            // Create a new row in the table (in a real app, this would come from the server)
            const tableBody = document.querySelector(".student-table tbody");
            const newRow = document.createElement("tr");

            // Generate a random ID for demo purposes
            const randomId =
                Math.floor(Math.random() * 10000000000) + 14900000000;

            newRow.innerHTML = `
                <td>${tableBody.children.length + 1}</td>
                <td>${randomId}</td>
                <td>${name}</td>
                <td>${phone}</td>
                <td>${email}</td>
                <td><span class="status-badge active">Đang học</span></td>
            `;

            // Add event listener to the new row
            newRow.addEventListener("click", function () {
                studentRows.forEach((r) => r.classList.remove("selected"));
                this.classList.add("selected");

                // Update student details (simplified for demo)
                document.querySelector(".student-name").textContent = name;
                document.querySelector(
                    ".student-id"
                ).textContent = `Mã HV: ${randomId}`;
                document.getElementById("studentName").value = name;
                document.getElementById("studentEmail").value = email;
                document.getElementById("studentPhone").value = phone;

                showNotification(`Đã chọn học viên: ${name}`, "info");
            });

            // Add the new row to the table
            tableBody.appendChild(newRow);

            // Update studentRows collection
            const updatedStudentRows = document.querySelectorAll(
                ".student-table tbody tr"
            );

            // Show success message
            showNotification(`Đã thêm học viên ${name} thành công!`, "success");

            // Close the modal
            addStudentModal.classList.remove("active");

            // Reset the form
            this.reset();
        });
    }

    // Update Button
    const updateBtn = document.getElementById("updateBtn");

    if (updateBtn) {
        updateBtn.addEventListener("click", function () {
            // Get updated values
            const updatedName = document.getElementById("studentName").value;
            const updatedEmail = document.getElementById("studentEmail").value;
            const updatedPhone = document.getElementById("studentPhone").value;
            const updatedStatus =
                document.getElementById("studentStatus").value;

            // Get the selected row
            const selectedRow = document.querySelector(
                ".student-table tbody tr.selected"
            );

            if (selectedRow) {
                // Update the row data
                selectedRow.querySelector("td:nth-child(3)").textContent =
                    updatedName;
                selectedRow.querySelector("td:nth-child(4)").textContent =
                    updatedPhone;
                selectedRow.querySelector("td:nth-child(5)").textContent =
                    updatedEmail;

                // Update status badge
                const statusBadge = selectedRow.querySelector(".status-badge");
                statusBadge.className = `status-badge ${updatedStatus}`;

                if (updatedStatus === "active") {
                    statusBadge.textContent = "Đang học";
                } else if (updatedStatus === "inactive") {
                    statusBadge.textContent = "Tạm nghỉ";
                } else if (updatedStatus === "completed") {
                    statusBadge.textContent = "Đã tốt nghiệp";
                }

                // Update profile section
                document.querySelector(".student-name").textContent =
                    updatedName;
                document.querySelector(
                    ".status-dot"
                ).className = `status-dot ${updatedStatus}`;
                document.querySelector(".status-text").textContent =
                    statusBadge.textContent;

                // Show success message
                showNotification(
                    "Đã cập nhật thông tin học viên thành công!",
                    "success"
                );
            } else {
                showNotification(
                    "Vui lòng chọn học viên để cập nhật!",
                    "warning"
                );
            }
        });
    }

    // Delete Button
    const deleteBtn = document.getElementById("deleteBtn");
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmBtn = document.querySelector(".confirm-btn");

    if (deleteBtn) {
        deleteBtn.addEventListener("click", function () {
            const selectedRow = document.querySelector(
                ".student-table tbody tr.selected"
            );

            if (selectedRow) {
                confirmationModal.classList.add("active");
            } else {
                showNotification("Vui lòng chọn học viên để xóa!", "warning");
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            const selectedRow = document.querySelector(
                ".student-table tbody tr.selected"
            );

            if (selectedRow) {
                // Get the student name for the notification
                const studentName =
                    selectedRow.querySelector("td:nth-child(3)").textContent;

                // Remove the row
                selectedRow.remove();

                // Reset the student details panel
                document.querySelector(".student-name").textContent =
                    "Chưa chọn học viên";
                document.querySelector(".student-id").textContent = "Mã HV: ";
                document.getElementById("studentName").value = "";
                document.getElementById("studentEmail").value = "";
                document.getElementById("studentPhone").value = "";

                // Show success message
                showNotification(
                    `Đã xóa học viên ${studentName} thành công!`,
                    "success"
                );

                // Close the confirmation modal
                confirmationModal.classList.remove("active");

                // Update row numbers
                const rows = document.querySelectorAll(
                    ".student-table tbody tr"
                );
                rows.forEach((row, index) => {
                    row.querySelector("td:first-child").textContent = index + 1;
                });
            }
        });
    }

    // Print Button
    const printBtn = document.getElementById("printBtn");

    if (printBtn) {
        printBtn.addEventListener("click", function () {
            const selectedRow = document.querySelector(
                ".student-table tbody tr.selected"
            );

            if (selectedRow) {
                showNotification("Đang chuẩn bị in thông tin...", "info");

                // In a real application, you would open a print dialog
                setTimeout(() => {
                    showNotification("Đã gửi lệnh in đến máy in!", "success");
                }, 1500);
            } else {
                showNotification(
                    "Vui lòng chọn học viên để in thông tin!",
                    "warning"
                );
            }
        });
    }

    // History Button
    const historyBtn = document.getElementById("historyBtn");

    if (historyBtn) {
        historyBtn.addEventListener("click", function () {
            const selectedRow = document.querySelector(
                ".student-table tbody tr.selected"
            );

            if (selectedRow) {
                const studentName =
                    selectedRow.querySelector("td:nth-child(3)").textContent;
                showNotification(
                    `Đang tải lịch sử hoạt động của học viên ${studentName}...`,
                    "info"
                );

                // In a real application, you would load the history data
                setTimeout(() => {
                    showNotification(
                        "Chức năng này sẽ được cập nhật trong phiên bản tới!",
                        "warning"
                    );
                }, 1500);
            } else {
                showNotification(
                    "Vui lòng chọn học viên để xem lịch sử!",
                    "warning"
                );
            }
        });
    }

    // Upload Image Button
    const uploadImageBtn = document.getElementById("uploadImageBtn");

    if (uploadImageBtn) {
        uploadImageBtn.addEventListener("click", function () {
            // In a real application, you would open a file dialog
            showNotification(
                "Chức năng tải ảnh sẽ được cập nhật trong phiên bản tới!",
                "info"
            );
        });
    }

    // Function to get user data from localStorage
    function getUserData() {
        const userData = localStorage.getItem("userData");
        return userData ? JSON.parse(userData) : null;
    }

    // Function to update user info in the UI
    function updateUserInfo(userData) {
        const sidebarUserName = document.getElementById("sidebarUserName");
        const sidebarUserRole = document.getElementById("sidebarUserRole");
        const headerUserName = document.getElementById("headerUserName");

        if (sidebarUserName && userData.name) {
            sidebarUserName.textContent = userData.name;
        }

        if (sidebarUserRole && userData.role) {
            sidebarUserRole.textContent = userData.role;
        }

        if (headerUserName && userData.name) {
            headerUserName.textContent = userData.name;
        }
    }

    // Function to show notification
    function showNotification(message, type = "info") {
        // Check if notification container exists
        let notificationContainer = document.querySelector(
            ".notification-container"
        );

        // If not, create it
        if (!notificationContainer) {
            notificationContainer = document.createElement("div");
            notificationContainer.className = "notification-container";
            document.body.appendChild(notificationContainer);

            // Add styles if not already in CSS
            const style = document.createElement("style");
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .notification {
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                    max-width: 350px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.info {
                    background-color: #36b9cc;
                }
                
                .notification.success {
                    background-color: #1cc88a;
                }
                
                .notification.warning {
                    background-color: #f6c23e;
                }
                
                .notification.error {
                    background-color: #e74a3b;
                }
                
                .notification-icon {
                    font-size: 18px;
                }
                
                .notification-message {
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // Create notification element
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;

        // Set icon based on type
        let icon;
        switch (type) {
            case "success":
                icon = "fas fa-check-circle";
                break;
            case "warning":
                icon = "fas fa-exclamation-triangle";
                break;
            case "error":
                icon = "fas fa-times-circle";
                break;
            default:
                icon = "fas fa-info-circle";
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

        // Add to container
        notificationContainer.appendChild(notification);

        // Show notification with a slight delay for animation
        setTimeout(() => {
            notification.classList.add("show");
        }, 10);

        // Add close button functionality
        const closeBtn = notification.querySelector(".notification-close");
        closeBtn.addEventListener("click", () => {
            notification.classList.remove("show");

            // Remove after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove("show");

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});
