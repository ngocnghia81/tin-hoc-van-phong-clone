// Password Change JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const passwordChangeModal = document.getElementById('passwordChangeModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const usernameInput = document.getElementById('username');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const passwordRequirements = document.querySelectorAll('.password-requirements li');
    
    // ONLY open password modal when explicitly clicking on the password change button
    const passwordChangeTriggers = document.querySelectorAll('.password-change-trigger');
    if (passwordChangeTriggers.length > 0) {
        passwordChangeTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Stop event from bubbling up
                openPasswordModal();
            });
        });
    }
    
    // Close modal when clicking the close button
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling up
            closeModal(passwordChangeModal);
        });
    }
    
    // Close modal when clicking outside the modal content
    if (passwordChangeModal) {
        passwordChangeModal.addEventListener('click', function(e) {
            if (e.target === passwordChangeModal) {
                closeModal(passwordChangeModal);
            }
        });
    }
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Password validation
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', validatePassword);
    }
    
    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validateConfirmPassword();
        });
    }
    
    // Change password button click
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling up
            submitPasswordChange();
        });
    }
    
    // Functions
    function openPasswordModal() {
        if (!passwordChangeModal) return;
        
        // Pre-fill username if available
        const sidebarUserName = document.getElementById('sidebarUserName');
        if (sidebarUserName && usernameInput) {
            usernameInput.value = sidebarUserName.textContent;
        }
        
        // Show modal
        passwordChangeModal.style.display = 'flex';
        
        // Focus on current password field
        if (currentPasswordInput) {
            setTimeout(() => {
                currentPasswordInput.focus();
            }, 100);
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            
            // Reset form
            resetPasswordForm();
        }
    }
    
    function resetPasswordForm() {
        // Clear password fields
        if (currentPasswordInput) currentPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        
        // Reset password visibility
        const passwordInputs = document.querySelectorAll('.password-input-container input');
        const eyeIcons = document.querySelectorAll('.toggle-password i');
        
        passwordInputs.forEach(input => {
            input.type = 'password';
        });
        
        eyeIcons.forEach(icon => {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        });
        
        // Reset validation
        passwordRequirements.forEach(item => {
            item.classList.remove('valid', 'invalid');
        });
        
        // Remove any error/success messages
        removeMessages();
    }
    
    function validatePassword() {
        const password = newPasswordInput.value;
        
        // Validate length
        validateRequirement(0, password.length >= 8);
        
        // Validate uppercase
        validateRequirement(1, /[A-Z]/.test(password));
        
        // Validate lowercase
        validateRequirement(2, /[a-z]/.test(password));
        
        // Validate number
        validateRequirement(3, /[0-9]/.test(password));
    }
    
    function validateRequirement(index, isValid) {
        if (index < passwordRequirements.length) {
            const requirement = passwordRequirements[index];
            const icon = requirement.querySelector('i');
            
            if (isValid) {
                requirement.classList.add('valid');
                requirement.classList.remove('invalid');
                icon.classList.remove('fa-times-circle');
                icon.classList.add('fa-check-circle');
            } else {
                requirement.classList.add('invalid');
                requirement.classList.remove('valid');
                icon.classList.remove('fa-check-circle');
                icon.classList.add('fa-times-circle');
            }
        }
    }
    
    function validateConfirmPassword() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword && newPassword !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp');
        } else {
            removeMessages();
        }
    }
    
    function isPasswordValid() {
        // Check if all requirements are met
        const allValid = Array.from(passwordRequirements).every(item => 
            item.classList.contains('valid')
        );
        
        // Check if passwords match
        const passwordsMatch = newPasswordInput.value === confirmPasswordInput.value;
        
        return allValid && passwordsMatch;
    }
    
    function submitPasswordChange() {
        // Remove any existing messages
        removeMessages();
        
        // Validate form
        if (!usernameInput.value) {
            showError('Vui lòng nhập tên tài khoản');
            return;
        }
        
        if (!currentPasswordInput.value) {
            showError('Vui lòng nhập mật khẩu hiện tại');
            return;
        }
        
        if (!newPasswordInput.value) {
            showError('Vui lòng nhập mật khẩu mới');
            return;
        }
        
        if (!confirmPasswordInput.value) {
            showError('Vui lòng xác nhận mật khẩu mới');
            return;
        }
        
        if (newPasswordInput.value === currentPasswordInput.value) {
            showError('Mật khẩu mới không được trùng với mật khẩu cũ');
            return;
        }
        
        if (!isPasswordValid()) {
            showError('Mật khẩu mới không đáp ứng các yêu cầu hoặc không khớp');
            return;
        }
        
        // In a real application, this would be an API call to change the password
        console.log('Changing password for:', usernameInput.value);
        
        // Simulate API call
        changePasswordBtn.textContent = 'Đang xử lý...';
        changePasswordBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            showSuccess('Đổi mật khẩu thành công!');
            
            // Reset button
            changePasswordBtn.textContent = 'SUBMIT';
            changePasswordBtn.disabled = false;
            
            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal(passwordChangeModal);
            }, 2000);
        }, 1000);
    }
    
    function showError(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'password-error show';
        errorDiv.textContent = message;
        
        // Insert before the form
        const passwordForm = document.querySelector('.password-form');
        if (passwordForm) {
            passwordForm.insertBefore(errorDiv, passwordForm.firstChild);
        }
    }
    
    function showSuccess(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'password-success show';
        successDiv.textContent = message;
        
        // Insert before the form
        const passwordForm = document.querySelector('.password-form');
        if (passwordForm) {
            passwordForm.insertBefore(successDiv, passwordForm.firstChild);
        }
    }
    
    function removeMessages() {
        // Remove error messages
        const errorMessages = document.querySelectorAll('.password-error');
        errorMessages.forEach(msg => msg.remove());
        
        // Remove success messages
        const successMessages = document.querySelectorAll('.password-success');
        successMessages.forEach(msg => msg.remove());
    }
});
