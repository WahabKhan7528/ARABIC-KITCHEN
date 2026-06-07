import { useState, useMemo } from 'react';

export default function useOrderFilters(orders, todayStr) {
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const q = orderSearchQuery.toLowerCase();
      
      const itemsMatch = ord.items.some(item => item.name.toLowerCase().includes(q));
      const matchesSearch = 
        ord.name.toLowerCase().includes(q) ||
        ord.phone.includes(q) ||
        (ord.table && ord.table.toLowerCase().includes(q)) ||
        (ord.address && ord.address.toLowerCase().includes(q)) ||
        itemsMatch;

      const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'all' || ord.type === orderTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, orderSearchQuery, orderStatusFilter, orderTypeFilter]);

  const stats = useMemo(() => {
    const todayOrders = orders.filter(ord => {
      const ordDate = ord.createdAt.split('T')[0];
      return ordDate === todayStr;
    });

    const totalOrdersToday = todayOrders.length;
    const activeCooking = orders.filter(ord => ord.status === 'preparing').length;
    
    const totalRevenueToday = todayOrders
      .filter(ord => ord.status === 'completed')
      .reduce((sum, ord) => sum + (ord.total || 0), 0);

    const pendingOrders = orders.filter(ord => ord.status === 'pending').length;

    return { totalOrdersToday, activeCooking, totalRevenueToday, pendingOrders };
  }, [orders, todayStr]);

  return {
    orderSearchQuery,
    setOrderSearchQuery,
    orderStatusFilter,
    setOrderStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    filteredOrders,
    stats
  };
}
