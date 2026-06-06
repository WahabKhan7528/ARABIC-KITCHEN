const CART_KEY = 'arabic_kitchen_cart';
const ORDERS_KEY = 'arabic_kitchen_orders';

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

const INITIAL_MOCK_ORDERS = [
  {
    id: 'ord_mock_1',
    name: 'Zainab Fatima',
    phone: '03001234567',
    type: 'delivery',
    table: '',
    address: 'Gulzar-e-Sadiq, St 3, House 14-A, Bahawalpur',
    items: [
      {
        name: 'Al-Mandi Royal (Lamb)',
        price: '2,850',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Royal Mint Margarita',
        price: '420',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    subtotal: 3690,
    deliveryFee: 200,
    total: 3890,
    status: 'preparing',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() // 1.5 hours ago
  },
  {
    id: 'ord_mock_2',
    name: 'Usman Ali',
    phone: '03214455667',
    type: 'dine-in',
    table: 'Table 7',
    address: '',
    items: [
      {
        name: 'Mixed Royal Grill',
        price: '2,450',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Hummus Beiruti Platter',
        price: '680',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'cash',
    paymentStatus: 'Pending',
    subtotal: 3130,
    deliveryFee: 0,
    total: 3130,
    status: 'pending',
    createdAt: new Date(Date.now() - 1200000).toISOString() // 20 mins ago
  },
  {
    id: 'ord_mock_3',
    name: 'Sarah Khan',
    phone: '03129876543',
    type: 'takeaway',
    table: '',
    address: '',
    items: [
      {
        name: 'Kunafa Al-Sultani',
        price: '1,100',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'easypaisa',
    paymentStatus: 'Paid',
    subtotal: 2200,
    deliveryFee: 0,
    total: 2200,
    status: 'served', // ready for pickup
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
  },
  {
    id: 'ord_mock_4',
    name: 'Faraz Ahmad',
    phone: '03458887766',
    type: 'delivery',
    table: '',
    address: 'One Unit Staff Colony, Bahawalpur',
    items: [
      {
        name: 'The Royal Truffle Burger',
        price: '1,150',
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'cash',
    paymentStatus: 'Paid',
    subtotal: 3450,
    deliveryFee: 200,
    total: 3650,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 1.2).toISOString() // Yesterday
  }
];

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
