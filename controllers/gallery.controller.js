const router = require('express').Router();
const fs = require('fs').promises;
const sharp = require('sharp');
const path = require('path');
const { STATUS_CODES } = require('http');

const NODE_ENV = process.env.NODE_ENV;

const { tokenCheck } = require('../middlewares/token-check.middleware');

router.get(`/photos`, tokenCheck, async (req, res) => {
  try {
      const imageFolderPath = req.params.folder;
      if (!imageFolderPath) res.status(STATUS_CODES(500)).json({ message: 'Помилка сервера' });

      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;
      const quality = NODE_ENV === 'local' ? 100 : 50;
      const files = await fs.readdir(imageFolderPath);
      const photos = files.filter(file => file.endsWith('.JPG') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.PNG'));
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      const paginatedPhotos = photos.slice(startIndex, endIndex);
      const photoBlobPromises = paginatedPhotos.map(async (photoPath) => {
        const metaProm = sharp(path.join(imageFolderPath, photoPath)).metadata();
        const bufferProm = sharp(path.join(imageFolderPath, photoPath)).resize(1000).withMetadata().jpeg({ quality }).toBuffer();
        const [meta, buffer] = await Promise.all([metaProm, bufferProm]);

        return {
          data: buffer.toString('base64'),
          mimetype: `image/${meta.format}`,
          originalName: photoPath
        }
      });
      const photoBlobs = await Promise.all(photoBlobPromises)
      res.json(photoBlobs);
  } catch (error) {
      console.error('Помилка отримання списку фотографій:', error);
      res.status(500).send('Помилка сервера');
  }
});

router.get('/photo', tokenCheck, async (req, res) => {
  try {
    const imageFolderPath = req.params.folder;
    if (!imageFolderPath) res.status(STATUS_CODES(500)).json({ message: 'Помилка сервера' });

      const reqPath = req.query['photo-path'];
      if (!reqPath) return res.send();

      const photoPath = path.join(imageFolderPath, reqPath);
      const isExist = await fs.access(photoPath, fs.constants.F_OK).then(() => true).catch(() => false)
      if (!isExist) return res.send();

      const metaProm = sharp(photoPath).metadata();
      const bufferProm = sharp(photoPath).withMetadata().toBuffer();
      const [meta, buffer] = await Promise.all([metaProm, bufferProm]);

      res.json({
        data: buffer.toString('base64'),
        mimetype: `image/${meta.format}`,
        originalName: reqPath
      });
  } catch (error) {
      console.error('Помилка отримання списку фотографій:', error);
      res.status(500).send('Помилка сервера');
  }
});

module.exports = router;