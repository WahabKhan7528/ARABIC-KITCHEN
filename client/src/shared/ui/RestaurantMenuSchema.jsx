import React from 'react';

export default function RestaurantMenuSchema({ menuItems = [] }) {
  // Build a dynamic menu schema based on the fetched items
  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "Arabic Kitchen Menu",
    "description": "Authentic Arabic and Lebanese cuisine including Mandi, Grills, and more.",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Main Menu",
        "hasMenuItem": menuItems.map(item => ({
          "@type": "MenuItem",
          "name": item.name,
          "description": item.description || `Delicious ${item.name}`,
          "offers": {
            "@type": "Offer",
            "price": item.price,
            "priceCurrency": "USD"
          }
        }))
      }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
