/**
 * @fileoverview Multer file upload middleware.
 *
 * Configured with memory storage so uploaded files are available as
 * in-memory buffers (`req.file.buffer`). The item controller then
 * converts these buffers to Base64 data URIs for MongoDB storage.
 *
 * @module middleware/upload
 */

const multer = require('multer');

/** Store uploaded files in memory (no disk writes). */
const storage = multer.memoryStorage();

/**
 * Multer instance with memory storage and a 5 MB file size limit.
 * Use as middleware: `upload.single('image')` for single file upload.
 */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
