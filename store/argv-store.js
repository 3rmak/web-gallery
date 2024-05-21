const args = process.argv.slice(2);
const params = {};
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    params[key] = value;
  }
});

module.exports = {
  getArgvParamByKey: (key) => {
    return params[key];
  }
}