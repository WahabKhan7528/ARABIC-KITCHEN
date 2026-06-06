const STORAGE_KEY = 'arabic_kitchen_menu_items';

const INITIAL_MOCK_DATA = [
  // 1. Grills & Kebabs
  {
    id: 'menu_mock_1',
    category: "Grills & Kebabs",
    name: "Mixed Royal Grill",
    arabicName: "مشويات مشكلة",
    price: "2,450",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "An opulent assortment of seekh kebabs, malai boti, lamb chops, and beef tikka, charred to smoky perfection."
  },
  {
    id: 'menu_mock_2',
    category: "Grills & Kebabs",
    name: "Seekh Kabab Arabic Kitchen",
    arabicName: "سيخ كباب",
    price: "1,250",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80",
    description: "Minced beef infused with aromatic house coriander, green chilies, onion, and warm charcoal smoked ghee."
  },
  // 2. Arabian Mains
  {
    id: 'menu_mock_3',
    category: "Arabian Mains",
    name: "Al-Mandi Royal (Lamb)",
    arabicName: "مندي لحم",
    price: "2,850",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80",
    description: "Slow-roasted lamb shoulder served on a bed of long-grain basmati saffron rice, finished with toasted nuts."
  },
  {
    id: 'menu_mock_4',
    category: "Arabian Mains",
    name: "Royal Mutton Madhbi",
    arabicName: "مضبي لحم",
    price: "2,950",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80",
    description: "Lamb cooked over hot lava stones, seasoned lightly with Hadramout spices, resulting in incredibly tender meat."
  },
  // 3. Mezze & Starters
  {
    id: 'menu_mock_5',
    category: "Mezze & Starters",
    name: "Hummus Beiruti Platter",
    arabicName: "حمص بيروتي",
    price: "680",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    description: "Silky smooth chickpea purée with fresh garlic, parsley, lemon juice, topped with extra virgin olive oil and pine nuts."
  },
  {
    id: 'menu_mock_6',
    category: "Mezze & Starters",
    name: "Kibbeh Nabulsieh (3pcs)",
    arabicName: "كبة مقلية",
    price: "790",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    description: "Crispy outer shells of cracked bulgur wheat filled with spiced minced lamb, pine nuts, and sumac."
  },
  // 4. Burgers & Fast Food
  {
    id: 'menu_mock_7',
    category: "Burgers & Fast Food",
    name: "The Royal Truffle Burger",
    arabicName: "برجر ترافل",
    price: "1,150",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    description: "Juicy wagyu beef blend patty, glazed brioche bun, house black truffle aioli, and mature cheddar melt."
  },
  {
    id: 'menu_mock_8',
    category: "Burgers & Fast Food",
    name: "Shawarma Wrap Arabic Kitchen",
    arabicName: "شاورما دجاج",
    price: "750",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
    description: "House-marinated chicken breast shavings wrapped in soft saj bread, slathered in authentic toum garlic paste."
  },
  // 5. Desserts & Drinks
  {
    id: 'menu_mock_9',
    category: "Desserts & Drinks",
    name: "Kunafa Al-Sultani",
    arabicName: "كنافة سلطانية",
    price: "1,100",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    description: "Crispy shredded kataifi pastry, layered with warm melted sweet akkawi cheese, soaked in orange-blossom syrup."
  },
  {
    id: 'menu_mock_10',
    category: "Desserts & Drinks",
    name: "Royal Mint Margarita",
    arabicName: "مارجريتا النعناع",
    price: "420",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    description: "Refreshing crushed ice drink with muddled garden mint leaves, fresh lime zest, and mineral seltzer."
  }
];

export const getMenuItems = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading menu items from localStorage:', error);
    return [];
  }
};

export const saveMenuItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('menuItemsUpdated'));
  } catch (error) {
    console.error('Error saving menu items to localStorage:', error);
  }
};

export const addMenuItem = (item) => {
  const items = getMenuItems();
  const newItem = {
    id: `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...item
  };
  items.push(newItem);
  saveMenuItems(items);
  return newItem;
};

export const updateMenuItem = (id, updatedFields) => {
  const items = getMenuItems();
  const updated = items.map(item => {
    if (item.id === id) {
      return { ...item, ...updatedFields };
    }
    return item;
  });
  saveMenuItems(updated);
  return updated;
};

export const deleteMenuItem = (id) => {
  const items = getMenuItems();
  const filtered = items.filter(item => item.id !== id);
  saveMenuItems(filtered);
  return filtered;
};

export const resetMenuItemsToMockData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
  window.dispatchEvent(new Event('menuItemsUpdated'));
  return INITIAL_MOCK_DATA;
};
