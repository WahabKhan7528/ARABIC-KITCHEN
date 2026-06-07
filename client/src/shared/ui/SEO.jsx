import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description = "Authentic Arabic and Lebanese Cuisine", 
  url = "https://arabickitchen.com", 
  image = "https://arabickitchen.com/default-hero.jpg" 
}) {
  return (
    <Helmet>
      <title>{title} | Arabic Kitchen</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
