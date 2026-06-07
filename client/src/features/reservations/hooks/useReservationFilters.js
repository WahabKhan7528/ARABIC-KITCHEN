import { useState, useMemo } from 'react';

export default function useReservationFilters(reservations, todayStr, tomorrowStr) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        res.guestName?.toLowerCase().includes(q) ||
        res.phone?.includes(q) ||
        (res.tableNumber && res.tableNumber.toLowerCase().includes(q)) ||
        (res.specialRequests && res.specialRequests.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = res.reservationDate === todayStr;
      } else if (dateFilter === 'tomorrow') {
        matchesDate = res.reservationDate === tomorrowStr;
      } else if (dateFilter === 'custom') {
        matchesDate = customDate ? res.reservationDate === customDate : true;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter, customDate, todayStr, tomorrowStr]);

  const stats = useMemo(() => {
    const todayBookings = reservations.filter(res => res.reservationDate === todayStr);
    const totalToday = todayBookings.length;
    const guestsToday = todayBookings.reduce((sum, res) => sum + parseInt(res.partySize || 0, 10), 0);
    const pendingActions = reservations.filter(res => res.status === 'pending').length;
    const activeSeated = todayBookings.filter(res => res.status === 'seated').length;
    return { totalToday, guestsToday, pendingActions, activeSeated };
  }, [reservations, todayStr]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    filteredReservations,
    stats
  };
}
