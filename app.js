const express = require('express');
const crypto = require('crypto');
const app = express();
const path = require('path');
const OSHelper = require('./helpers/os-helper');

const NODE_ENV = process.env.NODE_ENV;
require('dotenv').config({ path: path.resolve(__dirname, NODE_ENV ? `.env_${NODE_ENV}` : '.env') });

const GalleryController = require('./controllers/gallery.controller');
const TokenStore = require('./store/token-store');
const ArgvStore = require('./store/argv-store');

const imageFolderPathes = ArgvStore.getArgvParamByKey(process.env.SHARED_FOLDERS_KEY)?.split(';') || [];
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
const HOST = NODE_ENV === 'local' ? OSHelper.getLocalIP() : '0.0.0.0';
const EXTERNAL_PORT = process.env.EXTERNAL_PORT || PORT;
const RUN_HOST = NODE_ENV === 'local' ? HOST : process.env.EXTERNAL_HOST;
app.listen(PORT, HOST, () => {
    TokenStore.getAll().forEach(({ folder, token }) => {
      console.log(`Доступ до "${folder}" - http://${RUN_HOST}:${EXTERNAL_PORT}?token=${token}`);
    })
});