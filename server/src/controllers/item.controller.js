/**
 * @fileoverview Menu item controller — CRUD operations for the restaurant menu.
 *
 * Handles listing, retrieval, creation, update, and deletion of menu items.
 * Image uploads are received as multipart form-data via multer (memory storage)
 * and stored as Base64-encoded data URIs directly in MongoDB.
 *
 * @module controllers/item
 */

const { validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * List all menu items, optionally filtered by category.
 *
 * @route   GET /api/items
 * @access  Public
 * @query   {string} [category] - Filter by menu category slug
 * @returns {{ count: number, items: MenuItem[] }}
 */
exports.getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const items = await MenuItem.find(filter)
    .populate('createdBy', 'name employeeId')
    .sort({ createdAt: -1 });

  res.json({ count: items.length, items });
});

/**
 * Retrieve a single menu item by its MongoDB ID.
 *
 * @route   GET /api/items/:id
 * @access  Public
 * @returns {{ item: MenuItem }}
 */
exports.getOne = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id)
    .populate('createdBy', 'name employeeId');

  if (!item) {
    return res.status(404).json({ message: 'Menu item not found.' });
  }

  res.json({ item });
});

/**
 * Create a new menu item with optional image upload.
 *
 * If a file is attached (`req.file`), it is converted to a Base64 data URI
 * and stored in the `image` field. This avoids external storage dependencies
 * at the cost of larger MongoDB documents.
 *
 * @route   POST /api/items
 * @access  Private — staff, admin
 * @body    {string}  name        - English dish name
 * @body    {string}  [nameArabic] - Arabic dish name
 * @body    {string}  [category]  - Category slug
 * @body    {string}  [description]
 * @body    {number}  price       - Price in PKR
 * @body    {boolean} [isAvailable]
 * @file    image                 - Optional image file (max 5 MB)
 * @returns {{ message: string, item: MenuItem }}
 */
exports.create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, nameArabic, category, description, price, isAvailable } = req.body;

  const itemData = {
    name,
    nameArabic,
    category,
    description,
    price,
    isAvailable,
    createdBy: req.user.id,
  };

  // Convert uploaded file buffer to a Base64 data URI for MongoDB storage
  if (req.file) {
    const base64String = req.file.buffer.toString('base64');
    itemData.image = `data:${req.file.mimetype};base64,${base64String}`;
  }

  const item = await MenuItem.create(itemData);

  res.status(201).json({ message: 'Menu item created successfully.', item });
});

/**
 * Update an existing menu item. Supports partial updates — only the fields
 * present in the request body are modified.
 *
 * @route   PUT /api/items/:id
 * @access  Private — staff, admin
 * @body    Partial MenuItem fields (see create for full list)
 * @file    image - Optional replacement image
 * @returns {{ message: string, item: MenuItem }}
 */
exports.update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found.' });
  }

  // Apply only the fields that were sent in the request
  const { name, nameArabic, category, description, price, isAvailable } = req.body;
  if (name !== undefined) item.name = name;
  if (nameArabic !== undefined) item.nameArabic = nameArabic;
  if (category !== undefined) item.category = category;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = price;
  if (isAvailable !== undefined) item.isAvailable = isAvailable;

  // Replace image if a new file was uploaded
  if (req.file) {
    const base64String = req.file.buffer.toString('base64');
    item.image = `data:${req.file.mimetype};base64,${base64String}`;
  }

  await item.save();

  res.json({ message: 'Menu item updated successfully.', item });
});

/**
 * Permanently delete a menu item.
 *
 * @route   DELETE /api/items/:id
 * @access  Private — staff, admin
 * @returns {{ message: string }}
 */
exports.remove = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found.' });
  }

  await item.deleteOne();

  res.json({ message: 'Menu item deleted successfully.' });
});
