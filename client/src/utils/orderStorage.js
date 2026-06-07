const CART_KEY = 'arabic_kitchen_cart';
const ORDERS_KEY = 'arabic_kitchen_orders_v2';

// Utility to clean price string to number
export const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  return parseInt(priceStr.replace(/,/g, ''), 10) || 0;
};

// ----------------------------------------------------
// CART UTILITIES
// ----------------------------------------------------
export const getCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading cart', e);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    console.error('Error saving cart', e);
  }
};

export const addToCart = (item) => {
  const cart = getCart();
  const existing = cart.find(i => i.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1
    });
  }
  saveCart(cart);
};

export const updateCartQuantity = (name, change) => {
  let cart = getCart();
  cart = cart.map(item => {
    if (item.name === name) {
      const newQty = item.quantity + change;
      return newQty > 0 ? { ...item, quantity: newQty } : null;
    }
    return item;
  }).filter(Boolean);
  saveCart(cart);
};

export const removeFromCart = (name) => {
  const cart = getCart().filter(item => item.name !== name);
  saveCart(cart);
};

export const clearCart = () => {
  saveCart([]);
};

// ----------------------------------------------------
// ORDERS UTILITIES
// ----------------------------------------------------
const getRelativeDate = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const INITIAL_MOCK_ORDERS = [];

export const getOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
      return INITIAL_MOCK_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading orders', e);
    return [];
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('ordersUpdated'));
  } catch (e) {
    console.error('Error saving orders', e);
  }
};

export const addOrder = (order) => {
  const orders = getOrders();
  const newOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...order
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrderStatus = (id, status) => {
  const orders = getOrders();
  const updated = orders.map(ord => {
    if (ord.id === id) {
      // Auto pay cash orders when they are completed
      const paymentStatus = status === 'completed' ? 'Paid' : ord.paymentStatus;
      return { ...ord, status, paymentStatus };
    }
    return ord;
  });
  saveOrders(updated);
  return updated;
};

export const deleteOrder = (id) => {
  const orders = getOrders();
  const filtered = orders.filter(ord => ord.id !== id);
  saveOrders(filtered);
  return filtered;
};

export const resetOrdersToMockData = () => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
  window.dispatchEvent(new Event('ordersUpdated'));
  return INITIAL_MOCK_ORDERS;
};
