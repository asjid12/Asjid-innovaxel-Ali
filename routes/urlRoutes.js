const express = require('express');
const validUrl = require('valid-url');
const Url = require('../models/url');
const shortid = require('shortid');
const router = express.Router();

// POST /shorten - Create a new short URL
router.post('/', async (req, res) => {
  const { url } = req.body;

  // Validate the URL
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if the URL already exists
    let urlObj = await Url.findOne({ url });
    if (urlObj) {
      return res.status(200).json(urlObj);
    }

    // Generate a short code
    const shortCode = shortid.generate();
    const newUrl = new Url({ url, shortCode });

    // Save to the database
    await newUrl.save();

    // Return the new short URL
    res.status(201).json(newUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// // GET /shorten/:shortCode - Retrieve the original URL
// router.get('/:shortCode', async (req, res) => {
//   const { shortCode } = req.params;

//   try {
//     const urlObj = await Url.findOne({ shortCode });
//     if (!urlObj) {
//       return res.status(404).json({ error: 'Short URL not found' });
//     }

//     // Increment the access count
//     urlObj.accessCount++;
//     await urlObj.save();

//     // Redirect to the original URL
//     res.redirect(urlObj.url);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// GET /shorten/:shortCode - Retrieve the original URL and handle redirection or return URL
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlObj = await Url.findOne({ shortCode });

    if (!urlObj) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment the access count every time the short URL is accessed
    urlObj.accessCount++;
    await urlObj.save();  // Save the updated access count

    // Check if the request is asking for a redirection or the original URL
    if (req.query.redirect === 'true') {
      // If "redirect=true", perform the redirection
      return res.redirect(urlObj.url);
    }

    // Otherwise, return the original URL and access count as JSON (for stats)
    return res.status(200).json({
      shortCode: urlObj.shortCode,
      originalUrl: urlObj.url,
      accessCount: urlObj.accessCount,
      createdAt: urlObj.createdAt,
      updatedAt: urlObj.updatedAt,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /shorten/:shortCode/stats - Get statistics for a short URL
// router.get('/:shortCode/stats', async (req, res) => {
//   const { shortCode } = req.params;

//   try {
//     const urlObj = await Url.findOne({ shortCode });
//     if (!urlObj) {
//       return res.status(404).json({ error: 'Short URL not found' });
//     }

//     res.status(200).json({
//       shortCode: urlObj.shortCode,
//       url: urlObj.url,
//       accessCount: urlObj.accessCount
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// GET /shorten/:shortCode/stats - Get statistics for a short URL
router.get('/:shortCode/stats', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlObj = await Url.findOne({ shortCode });

    if (!urlObj) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Convert the Date objects to strings in a format JavaScript can parse
    const response = {
      shortCode: urlObj.shortCode,
      originalUrl: urlObj.url,
      createdAt: urlObj.createdAt.toISOString(),  // Convert to string in ISO format
      updatedAt: urlObj.updatedAt.toISOString(),  // Convert to string in ISO format
      accessCount: urlObj.accessCount,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /shorten/:shortCode - Update an existing short URL
router.put('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  // Validate the URL
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if the short URL exists
    let urlObj = await Url.findOne({ shortCode });
    if (!urlObj) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Update the original URL
    urlObj.url = url;
    urlObj.updatedAt = Date.now();  // Update the 'updatedAt' timestamp

    // Save the updated URL object
    await urlObj.save();

    // Return the updated URL object
    res.status(200).json(urlObj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /shorten/:shortCode - Delete an existing short URL
router.delete('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Check if the short URL exists
    let urlObj = await Url.findOne({ shortCode });
    if (!urlObj) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Delete the URL object from the database
    await Url.deleteOne({ shortCode });

    // Return a successful response with no content
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
