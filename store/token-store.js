const TokenStore = [];

module.exports = {
  getAll: () => TokenStore,

  getByToken: (token) => {
    const index = TokenStore.findIndex((val) => val.token === token.trim())
    return TokenStore[index];
  },

  putInStore: ({token, folder}) => {
    TokenStore.push({ token, folder });
  }
}