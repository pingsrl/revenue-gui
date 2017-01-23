const revenue = require('revenue-core');

let configurator = (db) => {
  let config = db.get('config').value();
  return config;
};

let getData = (name) => {
  let cache = {};

  return new Promise((ok, fail) => {
    if (cache[name]) {
      return ok(cache[name]);
    }
    revenue({}, configurator, (db, lastUpdate, options) => {
      let data = db.get(name).value();
      cache[name] = data;
      ok(cache[name]);
    });
  });
};

module.exports = {
  getData: getData,
};
