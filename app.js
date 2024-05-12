const express = require('express');
const crypto = require('crypto');
const app = express();
const path = require('path');
require('dotenv').config()

const GalleryController = require('./controllers/gallery.controller');
const TokenStore = require('./store/token-store');

const imageFolderPathes = process.env.SHARED_FOLDERS.split(';') || []
imageFolderPathes.forEach((folder) => {
  app.use(express.static(folder));

  const token = crypto.randomBytes(5).toString('hex');
  TokenStore.putInStore({ token, folder })
})

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Обробник маршруту для основної сторінки
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(GalleryController)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
    const HOST = process.env.EXTERNAL_HOST || 'localhost';
    const EXTERNAL_PORT = process.env.EXTERNAL_PORT || PORT;
    TokenStore.getAll().forEach(({ folder, token }) => {
      console.log(`Доступ до "${folder}" - http://${HOST}:${EXTERNAL_PORT}?token=${token}`);
    })
});