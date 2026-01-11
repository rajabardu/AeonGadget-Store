// Data Produk Gadget
const products = [
    {
        id: 1,
        name: "Aeon C17",
        category: "smartphone",
        price: 24999000,
        originalPrice: 26999000,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "iPhone 15 Pro Max dengan chip A17 Pro, kamera 48MP, dan desain titanium."
    },
    {
        id: 2,
        name: "Aeon Pe25",
        category: "smartphone",
        price: 22999000,
        originalPrice: 25999000,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Samsung flagship dengan S Pen, kamera 200MP, dan layar Dynamic AMOLED 2X."
    },
    {
        id: 3,
        name: "AeonE13",
        category: "smartphone",
        price: 17999000,
        originalPrice: 19999000,
        image: "https://cdn.topsellbelanja.com/wp-content/uploads/2024/12/iQoo-13-g1-c.webp?_gl=1*17gibaz*_gcl_au*ODI5NjI3OTQ2LjE3Njc5NjczMzc.",
        description: "MacBook Pro dengan chip M3, layar Liquid Retina XDR, dan baterai tahan lama."
    },
];

// Cart state
let cart = JSON.parse(localStorage.getItem('aeonCart')) || [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const subtotalPrice = document.querySelector('.subtotal-price');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderFeaturedProducts();
    setupEventListeners();
    setupSlideshow();
    
    // Check if we're on the products page
    if (document.querySelector('.products-page')) {
        renderAllProducts();
        setupFilters();
    }
    
    // Check if we're on the checkout page
    if (document.querySelector('.checkout-page')) {
        renderOrderSummary();
        setupPaymentForm();
    }
    
    // Check if we're on the detail product page
    if (document.querySelector('.product-detail')) {
        setupProductDetail();
        renderRelatedProducts();
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.', 'warning');
                return;
            }
            window.location.href = 'pembayaran.html';
        });
    }
    
    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchBar) {
        searchBar.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Hamburger menu for mobile
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// Slideshow functionality
function setupSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show the selected slide
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            resetSlideInterval();
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        });
    }
    
    // Previous slide
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            resetSlideInterval();
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        });
    }
    
    // Indicator click
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            resetSlideInterval();
            showSlide(index);
        });
    });
    
    // Reset interval function
    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Next slide function
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Auto slide every 5 seconds
    slideInterval = setInterval(nextSlide, 5000);
}

// Render featured products on homepage
function renderFeaturedProducts() {
    const productsGrid = document.querySelector('.featured-products .products-grid');
    
    if (!productsGrid) return;
    
    // Get first 4 products as featured
    const featuredProducts = products.slice(0, 4);
    
    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">
                    ${product.id <= 3 ? '<span class="badge bestseller">Bestseller</span>' : ''}
                    ${product.id === 1 || product.id === 3 ? '<span class="badge new">Baru</span>' : ''}
                    ${product.originalPrice ? '<span class="badge discount">-'+Math.round((1 - product.price/product.originalPrice)*100)+'%</span>' : ''}
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    ${product.originalPrice ? `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.featured-products .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
        });
    });
}

// Render all products on products page
function renderAllProducts(filteredProducts = products) {
    const productsContainer = document.getElementById('products-container');
    const productsShown = document.getElementById('products-shown');
    const productsTotal = document.getElementById('products-total');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">
                    ${product.id <= 3 ? '<span class="badge bestseller">Bestseller</span>' : ''}
                    ${product.id === 1 || product.id === 3 ? '<span class="badge new">Baru</span>' : ''}
                    ${product.originalPrice ? '<span class="badge discount">-'+Math.round((1 - product.price/product.originalPrice)*100)+'%</span>' : ''}
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    ${product.originalPrice ? `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update product counts
    if (productsShown) {
        productsShown.textContent = filteredProducts.length;
    }
    
    if (productsTotal) {
        productsTotal.textContent = products.length;
    }
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.products-page .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
        });
    });
}

// Setup filters on products page
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const brandFilter = document.getElementById('brand-filter');
    const resetFilter = document.getElementById('reset-filter');
    
    if (!categoryFilter || !priceFilter) return;
    
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    if (brandFilter) brandFilter.addEventListener('change', filterProducts);
    
    if (resetFilter) {
        resetFilter.addEventListener('click', function() {
            categoryFilter.value = 'all';
            priceFilter.value = 'all';
            if (brandFilter) brandFilter.value = 'all';
            renderAllProducts();
        });
    }
}

// Filter products based on selected filters
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    const brand = document.getElementById('brand-filter') ? document.getElementById('brand-filter').value : 'all';
    
    let filtered = products;
    
    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Filter by brand
    if (brand !== 'all') {
        filtered = filtered.filter(product => product.brand === brand);
    }
    
    // Filter by price
    if (price !== 'all') {
        filtered = filtered.filter(product => {
            if (price === 'low') return product.price <= 3000000;
            if (price === 'medium') return product.price > 3000000 && product.price <= 10000000;
            if (price === 'high') return product.price > 10000000;
            return true;
        });
    }
    
    renderAllProducts(filtered);
}

// Setup product detail page
function setupProductDetail() {
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = 1; // Assuming this is for the product shown on detail page
            const quantity = parseInt(qtyInput.value);
            addToCart(productId, quantity);
            showNotification(`${quantity} produk berhasil ditambahkan ke keranjang!`, 'success');
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const productId = 1;
            const quantity = parseInt(qtyInput.value);
            addToCart(productId, quantity);
            window.location.href = 'pembayaran.html';
        });
    }
    
    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(qtyInput.value);
            if (currentValue < 10) {
                qtyInput.value = currentValue + 1;
            }
        });
    }
    
    // Thumbnail image switching
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const imgSrc = this.querySelector('img').src;
            mainImage.src = imgSrc;
        });
    });
}

// Render related products on detail page
function renderRelatedProducts() {
    const relatedGrid = document.querySelector('.related-products .products-grid');
    
    if (!relatedGrid) return;
    
    // Get random 4 products as related (excluding the current one)
    const shuffled = [...products].filter(p => p.id !== 1).sort(() => 0.5 - Math.random()).slice(0, 4);
    
    relatedGrid.innerHTML = shuffled.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">
                    ${product.id <= 3 ? '<span class="badge bestseller">Bestseller</span>' : ''}
                    ${product.id === 1 || product.id === 3 ? '<span class="badge new">Baru</span>' : ''}
                    ${product.originalPrice ? '<span class="badge discount">-'+Math.round((1 - product.price/product.originalPrice)*100)+'%</span>' : ''}
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    ${product.originalPrice ? `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.related-products .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
        });
    });
}

// Cart functions
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('aeonCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // If cart is open, update cart display
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('aeonCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update cart display
    renderCartItems();
    
    showNotification('Produk dihapus dari keranjang', 'info');
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
        }
        
        // Save to localStorage
        localStorage.setItem('aeonCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Update cart display
        renderCartItems();
    }
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang belanja Anda kosong.</p>';
        if (subtotalPrice) subtotalPrice.textContent = 'Rp 0';
        if (totalPrice) totalPrice.textContent = 'Rp 0';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Calculate subtotal and total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalPrice) subtotalPrice.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (totalPrice) totalPrice.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    
    // Add event listeners to cart controls
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Search functionality
function performSearch() {
    if (!searchBar) return;
    
    const query = searchBar.value.trim().toLowerCase();
    
    if (query === '') {
        showNotification('Silakan masukkan kata kunci pencarian', 'warning');
        return;
    }
    
    // Check if we're on products page
    if (window.location.pathname.includes('produk.html')) {
        // Filter products on products page
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        
        renderAllProducts(filtered);
        
        if (filtered.length === 0) {
            showNotification('Tidak ada produk yang ditemukan dengan kata kunci: ' + query, 'info');
        }
    } else {
        // Redirect to products page with search query
        window.location.href = `produk.html?search=${encodeURIComponent(query)}`;
    }
}

// Setup payment form
function setupPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const bankDetails = document.getElementById('bank-details');
    const transferAmount = document.getElementById('transfer-amount');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderTotal = document.getElementById('order-total');
    const shippingCost = document.getElementById('shipping-cost');
    const tax = document.getElementById('tax');
    const discount = document.getElementById('discount');
    const modalTotal = document.getElementById('modal-total');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.close-modal');
    const backToHome = document.getElementById('back-to-home');
    const trackOrder = document.getElementById('track-order');
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoCodeInput = document.getElementById('promo-code');
    
    if (!paymentForm) return;
    
    // Calculate order totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 25000;
    const taxAmount = 0;
    const total = subtotal + shipping;
    
    // Update order summary
    if (orderSubtotal) orderSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (shippingCost) shippingCost.textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
    if (tax) tax.textContent = `Rp ${taxAmount.toLocaleString('id-ID')}`;
    if (orderTotal) orderTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    if (transferAmount) transferAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Render order items
    renderOrderItems();
    
    // Show/hide bank details based on payment method
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'bank-transfer') {
                bankDetails.style.display = 'block';
            } else {
                bankDetails.style.display = 'none';
            }
        });
    });
    
    // Apply promo code
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = promoCodeInput.value.trim().toUpperCase();
            if (promoCode === 'AEON20') {
                // Apply 10% discount
                const discountAmount = Math.round(subtotal * 0.1);
                const newTotal = total - discountAmount;
                
                if (discount) discount.textContent = `-Rp ${discountAmount.toLocaleString('id-ID')}`;
                if (orderTotal) orderTotal.textContent = `Rp ${newTotal.toLocaleString('id-ID')}`;
                if (transferAmount) transferAmount.textContent = `Rp ${newTotal.toLocaleString('id-ID')}`;
                
                showNotification('Kode promo berhasil diterapkan! Diskon 10%', 'success');
                promoCodeInput.value = '';
            } else if (promoCode === '') {
                showNotification('Masukkan kode promo terlebih dahulu', 'warning');
            } else {
                showNotification('Kode promo tidak valid', 'error');
            }
        });
    }
    
    // Form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success modal
        if (successModal) {
            const finalTotal = orderTotal ? orderTotal.textContent : `Rp ${total.toLocaleString('id-ID')}`;
            if (modalTotal) modalTotal.textContent = finalTotal;
            successModal.style.display = 'flex';
            
            // Clear cart after successful payment
            cart = [];
            localStorage.setItem('aeonCart', JSON.stringify(cart));
            updateCartCount();
        }
    });
    
    // Modal controls
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    if (backToHome) {
        backToHome.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (trackOrder) {
        trackOrder.addEventListener('click', function() {
            showNotification('Fitur pelacakan pesanan akan segera tersedia!', 'info');
            successModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

// Render order items in checkout page
function renderOrderItems() {
    const orderItemsContainer = document.querySelector('.order-items');
    
    if (!orderItemsContainer) return;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Keranjang belanja Anda kosong.</p>';
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <p class="order-item-qty">Jumlah: ${item.quantity}</p>
            </div>
            <div class="order-item-price">
                Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
            </div>
        </div>
    `).join('');
}

// Render order summary in checkout page
function renderOrderSummary() {
    // This function is called in DOMContentLoaded for checkout page
    // The actual rendering is done in setupPaymentForm
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
    `;
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .notification-close {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            margin-left: 15px;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
        style.remove();
    });
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            style.remove();
        }
    }, 3000);
}
