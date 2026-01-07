// SevenSeas E-Commerce Script

// Product data
const products = [
    { id: 1, name: "Wireless Headphones", price: 99.99, image: "images/wireless-headphones.jpg", category: "Electronics" },
    { id: 2, name: "Smart Watch", price: 199.99, image: "images/smart-watch.jpg", category: "Electronics" },
    { id: 3, name: "Laptop", price: 899.99, image: "images/laptop.jpg", category: "Electronics" },
    { id: 4, name: "Tablet", price: 349.99, image: "images/tablet.jpg", category: "Electronics" },
    { id: 5, name: "Smartphone", price: 699.99, image: "images/smartphone.jpg", category: "Electronics" },
    { id: 6, name: "Bluetooth Speaker", price: 79.99, image: "images/bluetooth-speaker.webp", category: "Electronics" },
    { id: 7, name: "Gaming Mouse", price: 49.99, image: "images/gaming-mouse.webp", category: "Electronics" },
    { id: 8, name: "Mechanical Keyboard", price: 129.99, image: "images/mechanical-keyboard.jpg", category: "Electronics" },
    { id: 9, name: "Monitor", price: 299.99, image: "images/monitor.jpg", category: "Electronics" },
    { id: 10, name: "External Hard Drive", price: 89.99, image: "images/external-hard-drive.jpg", category: "Electronics" },
    { id: 11, name: "Coffee Maker", price: 149.99, image: "images/coffee-maker.jpg", category: "Home & Kitchen" },
    { id: 12, name: "Blender", price: 79.99, image: "images/blender.jpg", category: "Home & Kitchen" },
    { id: 13, name: "Air Fryer", price: 199.99, image: "images/air-fryer.jpg", category: "Home & Kitchen" },
    { id: 14, name: "Vacuum Cleaner", price: 249.99, image: "images/vacuum-cleaner.jpg", category: "Home & Kitchen" },
    { id: 15, name: "Microwave Oven", price: 179.99, image: "images/microwave-oven.jpg", category: "Home & Kitchen" },
    { id: 16, name: "Running Shoes", price: 119.99, image: "images/running-shoes.jpg", category: "Sports & Outdoors" },
    { id: 17, name: "Yoga Mat", price: 39.99, image: "images/yoga-mat.jpg", category: "Sports & Outdoors" },
    { id: 18, name: "Dumbbells Set", price: 89.99, image: "images/dumbbells-set.jpg", category: "Sports & Outdoors" },
    { id: 19, name: "Tennis Racket", price: 159.99, image: "images/tennis-racket.jpg", category: "Sports & Outdoors" },
    { id: 20, name: "Camping Tent", price: 199.99, image: "images/camping-tent.jpg", category: "Sports & Outdoors" },
    { id: 21, name: "Leather Wallet", price: 49.99, image: "images/leather-wallet.jpg", category: "Fashion" },
    { id: 22, name: "Sunglasses", price: 79.99, image: "images/sunglasses.jpg", category: "Fashion" },
    { id: 23, name: "Backpack", price: 69.99, image: "images/backpack.jpg", category: "Fashion" },
    { id: 24, name: "Watch", price: 149.99, image: "images/watch.jpg", category: "Fashion" },
    // { id: 25, name: "Perfume", price: 89.99, image: "https://via.placeholder.com/300x200?text=Perfume", category: "Fashion" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM elements
const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartLink = document.getElementById('cart-link');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartCount();
    setupEventListeners();
    initNavbarScroll();
    initSmoothScrolling();
    initAnimations();

    // Hide preloader after page loads
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .card, section > .container').forEach(el => {
        observer.observe(el);
    });
}

// Display products
function displayProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4 animate-fade-in';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-muted">${product.category}</p>
                <p class="card-text fw-bold">$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    return col;
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
    
    // Cart link
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        showCart();
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        checkout();
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show cart modal
function showCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        checkoutBtn.style.display = 'none';
    } else {
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded';
            cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                </div>
                <div>
                    <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'text-end fw-bold fs-5';
        totalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
        cartItems.appendChild(totalDiv);
        
        checkoutBtn.style.display = 'block';
        
        // Remove item event listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                removeFromCart(productId);
            });
        });
    }
    
    cartModal.show();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCart();
    showCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    cartModal.hide();
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slideOutRight animation to CSS
const style = document.createElement('style');
style.textContent = `
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);