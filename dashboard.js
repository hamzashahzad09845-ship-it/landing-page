// Dashboard Script

// DOM elements
const totalOrdersEl = document.getElementById('total-orders');
const totalRevenueEl = document.getElementById('total-revenue');
const totalItemsEl = document.getElementById('total-items');
const avgOrderEl = document.getElementById('avg-order');
const ordersListEl = document.getElementById('orders-list');

// Load orders from localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    displayDashboardStats();
    displayOrders();
});

// Display dashboard statistics
function displayDashboardStats() {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    totalOrdersEl.textContent = totalOrders;
    totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
    totalItemsEl.textContent = totalItems;
    avgOrderEl.textContent = `$${avgOrder.toFixed(2)}`;
}

// Display orders
function displayOrders() {
    if (orders.length === 0) {
        ordersListEl.innerHTML = '<p class="text-center text-muted">No orders yet.</p>';
        return;
    }
    
    ordersListEl.innerHTML = '';
    
    // Sort orders by date (most recent first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersListEl.appendChild(orderCard);
    });
}

// Create order card
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'card mb-3 animate-slide-up';
    
    const itemsList = order.items.map(item => 
        `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.name} (x${item.quantity})
            <span class="badge bg-primary rounded-pill">$${ (item.price * item.quantity).toFixed(2) }</span>
        </li>`
    ).join('');
    
    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Order #${order.id}</h6>
            <small class="text-muted">${order.date}</small>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush mb-3">
                ${itemsList}
            </ul>
            <div class="d-flex justify-content-between align-items-center">
                <strong>Total: $${order.total.toFixed(2)}</strong>
                <span class="badge bg-success">Completed</span>
            </div>
        </div>
    `;
    
    return card;
}