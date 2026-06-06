const STORAGE_KEY = 'arabic_kitchen_reservations';

// Generate dynamic dates relative to today
const getRelativeDate = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const INITIAL_MOCK_DATA = [
  {
    id: 'res_mock_1',
    name: 'Muhammad Bilal',
    phone: '03001234567',
    date: getRelativeDate(0), // Today
    time: '19:00',
    guests: '4',
    requests: 'Prefer a window table if possible',
    status: 'pending',
    table: '',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'res_mock_2',
    name: 'Ayesha Siddiqui',
    phone: '03219876543',
    date: getRelativeDate(0), // Today
    time: '20:30',
    guests: '2',
    requests: 'Anniversary celebration setup',
    status: 'confirmed',
    table: 'Table 5',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'res_mock_3',
    name: 'Zainab Ahmed',
    phone: '03334567890',
    date: getRelativeDate(0), // Today
    time: '18:15',
    guests: '6',
    requests: 'Family dinner, needs wheelchair access',
    status: 'seated',
    table: 'Majlis B',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'res_mock_4',
    name: 'Hamza Khan',
    phone: '03451122334',
    date: getRelativeDate(1), // Tomorrow
    time: '21:00',
    guests: '8',
    requests: 'Corporate team dinner',
    status: 'confirmed',
    table: 'Table 12',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'res_mock_5',
    name: 'Dr. Tariq Mahmood',
    phone: '03005556677',
    date: getRelativeDate(-1), // Yesterday
    time: '20:00',
    guests: '4',
    requests: 'None',
    status: 'completed',
    table: 'Table 3',
    createdAt: new Date(Date.now() - 86400000 - 3600000).toISOString()
  },
  {
    id: 'res_mock_6',
    name: 'Sarah Fatima',
    phone: '03123450987',
    date: getRelativeDate(2), // In 2 days
    time: '19:30',
    guests: '2',
    requests: 'Birthday surprise cake request',
    status: 'pending',
    table: '',
    createdAt: new Date().toISOString()
  }
];

export const getReservations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with mock data if storage is empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reservations from localStorage:', error);
    return [];
  }
};

export const saveReservations = (reservations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    // Dispatch a custom event to notify other components/views in the same tab
    window.dispatchEvent(new Event('reservationsUpdated'));
  } catch (error) {
    console.error('Error saving reservations to localStorage:', error);
  }
};

export const addReservation = (reservation) => {
  const reservations = getReservations();
  const newRes = {
    id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    table: '',
    createdAt: new Date().toISOString(),
    ...reservation
  };
  reservations.unshift(newRes); // Put new bookings at the top
  saveReservations(reservations);
  return newRes;
};

export const updateReservation = (id, updatedFields) => {
  const reservations = getReservations();
  const updated = reservations.map(res => {
    if (res.id === id) {
      return { ...res, ...updatedFields };
    }
    return res;
  });
  saveReservations(updated);
  return updated;
};

export const deleteReservation = (id) => {
  const reservations = getReservations();
  const filtered = reservations.filter(res => res.id !== id);
  saveReservations(filtered);
  return filtered;
};

export const resetToMockData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
  window.dispatchEvent(new Event('reservationsUpdated'));
  return INITIAL_MOCK_DATA;
};
