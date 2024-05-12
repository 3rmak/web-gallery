const TokenStore = [];

module.exports = {
  getAll: () => TokenStore,

  getByToken: (token) => {
    console.log('token', token);
    const index = TokenStore.findIndex((val) => val.token === token.trim())
    return TokenStore[index];
  },

  putInStore: ({token, folder}) => {
    TokenStore.push({ token, folder });
  }
}