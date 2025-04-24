// Shopping Cart System
window.shoppingCart = {
        // Cart data
        items: [],
        promoCode: null,
        discountAmount: 0,
        selectedPaymentMethod: null,

        // Initialize shopping cart
        init() {
            this.loadCartFromStorage();
            this.updateCartUI();
            this.setupEventListeners();
        },

        // Set up event listeners
        setupEventListeners() {
            // Apply promo code
            const applyPromoBtn = document.getElementById("apply-promo");
            if (applyPromoBtn) {
                applyPromoBtn.addEventListener("click", () => {
                    this.applyPromoCode();
                });
            }

            // Checkout button
            const checkoutBtn = document.getElementById("checkout-btn");
            if (checkoutBtn) {
                checkoutBtn.addEventListener("click", () => {
                    this.openPaymentModal();
                });
            }

            // Close modal buttons
            document.querySelectorAll(".close-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const modal = e.target.closest(".modal");
                    if (modal) {
                        modal.style.display = "none";
                    }
                });
            });

            // Close modal when clicking outside
            window.addEventListener("click", (e) => {
                if (e.target.classList.contains("modal")) {
                    e.target.style.display = "none";
                }
            });

            // Payment method selection
            const paymentOptions = document.querySelectorAll(".payment-option");
            paymentOptions.forEach(option => {
                option.addEventListener("click", () => {
                    paymentOptions.forEach(opt => opt.classList.remove("selected"));
                    option.classList.add("selected");
                    this.selectedPaymentMethod = option.dataset.method;
                    this.showPaymentDetails(this.selectedPaymentMethod);
                    
                    // Enable confirm button
                    document.getElementById("confirm-payment").disabled = false;
                });
            });

            // Confirm payment
            const confirmPaymentBtn = document.getElementById("confirm-payment");
            if (confirmPaymentBtn) {
                confirmPaymentBtn.addEventListener("click", () => {
                    this.processPayment();
                });
            }
        },

        // Load cart from localStorage
        loadCartFromStorage() {
            const cartData = localStorage.getItem("shoppingCart");
            if (cartData) {
                const parsedData = JSON.parse(cartData);
                this.items = parsedData.items || [];
                this.promoCode = parsedData.promoCode || null;
                this.discountAmount = parsedData.discountAmount || 0;
            }
        },

        // Save cart to localStorage
        saveCartToStorage() {
            localStorage.setItem("shoppingCart", JSON.stringify({
                items: this.items,
                promoCode: this.promoCode,
                discountAmount: this.discountAmount
            }));
        },

        // Add item to cart
        addItem(item) {
            // Check if item already exists in cart
            const existingItemIndex = this.items.findIndex(i => i.id === item.id);
            
            if (existingItemIndex !== -1) {
                // Item already exists, show notification
                this.showToast("info", "Thông báo", "Khóa học này đã có trong giỏ hàng");
            } else {
                // Add new item
                this.items.push(item);
                this.saveCartToStorage();
                this.updateCartUI();
                this.showToast("success", "Thành công", "Đã thêm khóa học vào giỏ hàng");
            }
        },

        // Remove item from cart
        removeItem(itemId) {
            this.items = this.items.filter(item => item.id !== itemId);
            this.saveCartToStorage();
            this.updateCartUI();
            this.showToast("info", "Đã xóa", "Khóa học đã được xóa khỏi giỏ hàng");
        },

        // Clear cart
        clearCart() {
            this.items = [];
            this.promoCode = null;
            this.discountAmount = 0;
            this.saveCartToStorage();
            this.updateCartUI();
        },

        // Calculate total price
        calculateTotal() {
            return this.items.reduce((total, item) => total + item.price, 0);
        },

        // Apply promo code
        applyPromoCode() {
            const promoInput = document.getElementById("promo-code-input");
            const promoCode = promoInput.value.trim();
            
            if (!promoCode) {
                this.showToast("error", "Lỗi", "Vui lòng nhập mã giảm giá");
                return;
            }
            
            // Simulate promo code validation
            // In a real application, this would be validated through an API
            const validPromoCodes = {
                "WELCOME10": 0.1,  // 10% discount
                "SUMMER25": 0.25,  // 25% discount
                "SPECIAL50": 0.5   // 50% discount
            };
            
            if (validPromoCodes[promoCode]) {
                const discount = validPromoCodes[promoCode];
                const subtotal = this.calculateTotal();
                this.discountAmount = subtotal * discount;
                this.promoCode = promoCode;
                this.saveCartToStorage();
                this.updateCartUI();
                this.showToast("success", "Thành công", `Đã áp dụng mã giảm giá ${promoCode}`);
            } else {
                this.showToast("error", "Lỗi", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
            }
        },

        // Update cart UI
        updateCartUI() {
            // Update cart count in navigation
            const cartCountNav = document.getElementById("cart-count-nav");
            if (cartCountNav) {
                cartCountNav.textContent = this.items.length;
            }
            
            // If we're on the cart page, update the cart items list
            const cartItemsList = document.getElementById("cart-items-list");
            const emptyCartMessage = document.getElementById("empty-cart-message");
            
            if (cartItemsList && emptyCartMessage) {
                if (this.items.length === 0) {
                    cartItemsList.style.display = "none";
                    emptyCartMessage.style.display = "block";
                    document.getElementById("checkout-btn").disabled = true;
                } else {
                    cartItemsList.style.display = "block";
                    emptyCartMessage.style.display = "none";
                    document.getElementById("checkout-btn").disabled = false;
                    
                    // Render cart items
                    cartItemsList.innerHTML = this.items.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="cart-item-image">
                                <i class="${item.icon || 'fas fa-graduation-cap'}"></i>
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-info">
                                    <p><i class="fas fa-calendar"></i> Khai giảng: ${item.startDate}</p>
                                    <p><i class="fas fa-clock"></i> Thời gian: ${item.schedule}</p>
                                    <p><i class="fas fa-map-marker-alt"></i> Địa điểm: ${item.location}</p>
                                </div>
                                <div class="cart-item-price">${this.formatCurrency(item.price)}</div>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('');
                    
                    // Add event listeners to remove buttons
                    document.querySelectorAll(".remove-item").forEach(btn => {
                        btn.addEventListener("click", (e) => {
                            const itemId = e.currentTarget.dataset.id;
                            this.removeItem(itemId);
                        });
                    });
                }
                
                // Update summary
                const subtotal = this.calculateTotal();
                const total = subtotal - this.discountAmount;
                
                document.getElementById("total-courses").textContent = this.items.length;
                document.getElementById("subtotal").textContent = this.formatCurrency(subtotal);
                document.getElementById("total-amount").textContent = this.formatCurrency(total);
                
                // Show/hide discount row
                const discountRow = document.getElementById("discount-row");
                if (this.discountAmount > 0) {
                    discountRow.style.display = "flex";
                    document.getElementById("discount-amount").textContent = `- ${this.formatCurrency(this.discountAmount)}`;
                } else {
                    discountRow.style.display = "none";
                }
            }
        },

        // Format currency
        formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                maximumFractionDigits: 0
            }).format(amount).replace('₫', 'VNĐ');
        },

        // Open payment modal
        openPaymentModal() {
            const modal = document.getElementById("payment-modal");
            if (!modal) return;
            
            // Update payment summary
            const totalCourses = document.getElementById("modal-total-courses");
            const totalAmount = document.getElementById("modal-total-amount");
            
            if (totalCourses && totalAmount) {
                totalCourses.textContent = this.items.length;
                const total = this.calculateTotal() - this.discountAmount;
                totalAmount.textContent = this.formatCurrency(total);
            }
            
            // Reset payment method selection
            this.selectedPaymentMethod = null;
            document.querySelectorAll(".payment-option").forEach(opt => opt.classList.remove("selected"));
            document.getElementById("payment-details").style.display = "none";
            document.getElementById("confirm-payment").disabled = true;
            
            // Show modal
            modal.style.display = "flex";
        },

        // Show payment details based on selected method
        showPaymentDetails(method) {
            const paymentDetails = document.getElementById("payment-details");
            if (!paymentDetails) return;
            
            const total = this.calculateTotal() - this.discountAmount;
            const formattedTotal = this.formatCurrency(total);
            
            let detailsHTML = '';
            
            switch (method) {
                case 'momo':
                    detailsHTML = `
                        <div class="momo-details">
                            <h5>Thanh toán qua MoMo</h5>
                            <div class="qr-code">
                                <p>Quét mã QR để thanh toán</p>
                                <div class="qr-code-placeholder">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                            </div>
                            <div class="payment-note">
                                <p><strong>Lưu ý:</strong> Sau khi quét mã, vui lòng nhập số tiền ${formattedTotal} và ghi chú "Thanh toán khóa học"</p>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'vnpay':
                    detailsHTML = `
                        <div class="vnpay-details">
                            <h5>Thanh toán qua VNPay</h5>
                            <p>Khi bạn nhấn "Xác nhận thanh toán", hệ thống sẽ chuyển bạn đến cổng thanh toán VNPay để hoàn tất giao dịch.</p>
                            <div class="payment-note">
                                <p><strong>Lưu ý:</strong> Bạn cần có tài khoản ngân hàng đã đăng ký dịch vụ VNPay để thực hiện thanh toán.</p>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'bank':
                    detailsHTML = `
                        <div class="bank-details">
                            <h5>Chuyển khoản ngân hàng</h5>
                            <div class="bank-account-info">
                                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                                <p><strong>Số tài khoản:</strong> 1234567890</p>
                                <p><strong>Chủ tài khoản:</strong> TRUNG TÂM TIN HỌC ABC</p>
                                <p><strong>Số tiền:</strong> ${formattedTotal}</p>
                                <p><strong>Nội dung chuyển khoản:</strong> [Họ tên] thanh toan khoa hoc</p>
                            </div>
                            <div class="payment-note">
                                <p><strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng nhấn "Xác nhận thanh toán" để hoàn tất đơn hàng. Chúng tôi sẽ xác nhận thanh toán của bạn trong vòng 24 giờ.</p>
                            </div>
                        </div>
                    `;
                    break;
            }
            
            paymentDetails.innerHTML = detailsHTML;
            paymentDetails.style.display = "block";
        },

        // Process payment
        processPayment() {
            if (!this.selectedPaymentMethod) {
                this.showToast("error", "Lỗi", "Vui lòng chọn phương thức thanh toán");
                return;
            }
            
            // Simulate payment processing
            // In a real application, this would involve API calls to payment gateways
            
            // Close payment modal
            document.getElementById("payment-modal").style.display = "none";
            
            // Generate order ID
            const orderId = "ORD" + Date.now().toString().slice(-6);
            document.getElementById("order-id").textContent = orderId;
            
            // Show success modal
            document.getElementById("success-modal").style.display = "flex";
            
            // Clear cart after successful payment
            this.clearCart();
        },

        // Show toast notification
        showToast(type, title, message) {
            // Check if toast container exists, if not create it
            let container = document.querySelector(".toast-container");
            if (!container) {
                container = document.createElement("div");
                container.className = "toast-container";
                document.body.appendChild(container);
            }
            
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

// Initialize shopping cart when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Initialize shopping cart
    window.shoppingCart.init();
    
    // Add "Add to Cart" functionality to course registration buttons
    const registerButtons = document.querySelectorAll(".register-btn");
    registerButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            // Prevent default action (opening registration modal)
            e.stopPropagation();
            
            // Get course information
            const courseInfo = this.closest(".course-item");
            const courseId = courseInfo.dataset.course;
            const courseName = courseInfo.querySelector(".info-row:first-child .value").textContent;
            const courseSchedule = courseInfo.querySelector(".info-row:nth-child(3) .value").textContent;
            const courseStartDate = courseInfo.querySelector(".info-row:nth-child(4) .value").textContent;
            const courseLocation = courseInfo.querySelector(".info-row:last-child .value").textContent;
            const coursePriceText = courseInfo.querySelector(".course-price").textContent;
            const coursePrice = parseInt(coursePriceText.replace(/[^\d]/g, ''));
            
            // Determine icon based on course type
            let courseIcon = 'fas fa-graduation-cap';
            if (courseInfo.querySelector(".course-type-badge.online")) {
                courseIcon = 'fas fa-video';
            } else if (courseInfo.querySelector(".course-type-badge.advanced")) {
                courseIcon = 'fas fa-laptop-code';
            }
            
            // Create cart item
            const cartItem = {
                id: courseId,
                name: courseName,
                schedule: courseSchedule,
                startDate: courseStartDate,
                location: courseLocation,
                price: coursePrice,
                icon: courseIcon
            };
            
            // Add to cart
            shoppingCart.addItem(cartItem);
        });
    });
});
