import React from 'react';

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Arabic Kitchen",
    "image": "https://arabickitchen.com/assets/hero.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Culinary Way",
      "addressLocality": "Food City",
      "addressRegion": "FC",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "servesCuisine": "Middle Eastern, Lebanese, Arabic",
    "priceRange": "$$",
    "telephone": "+1-555-0123",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      }
    ],
    "menu": "https://arabickitchen.com/#menu"
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
