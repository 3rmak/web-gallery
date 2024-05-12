const TokenStore = require('../store/token-store');

module.exports = {
  tokenCheck: (req, res, next) => {

    delete req.params.folder;

    const token = req.query.token;
    const storeItem = TokenStore.getByToken(token);
    if (!token || !storeItem) res.status(401).json({ message: 'Not registerd token' });

    req.params = {}
    req.params.folder = storeItem.folder;
    next();
  }
}