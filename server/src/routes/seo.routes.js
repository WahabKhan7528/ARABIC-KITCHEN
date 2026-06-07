const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Generate dynamic sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true }).select('slug updatedAt');
    
    // Base URLs that are always present
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.FRONTEND_URL || 'https://arabickitchen.com'}/</loc>
    <priority>1.0</priority>
  </url>
`;

    // Dynamic item URLs
    items.forEach(item => {
      // If the item doesn't have a slug, skip it (fallback for existing data)
      if (!item.slug) return;
      
      const lastMod = item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString();
      xml += `  <url>
    <loc>${process.env.FRONTEND_URL || 'https://arabickitchen.com'}/#menu/${item.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Serve static robots.txt
router.get('/robots.txt', (req, res) => {
  const sitemapUrl = `${process.env.FRONTEND_URL || 'https://arabickitchen.com'}/api/seo/sitemap.xml`;
  
  const robotsTxt = `User-agent: *
Disallow: /#dashboard
Disallow: /#staff
Disallow: /#checkout
Disallow: /#payment
Disallow: /#confirmation
Allow: /

Sitemap: ${sitemapUrl}
`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;
