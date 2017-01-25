const revenue = require('revenue-core');


let getData = (name) => {
  let cache = {};

  return new Promise((ok, fail) => {
    if (cache[name]) {
      return ok(cache[name]);
    }
    revenue({}, (db) => {
      return db.get('config').first().value();
    }, (db, lastUpdate, options) => {
      let data = db.get(name).value();
      cache[name] = data;
      ok(cache[name]);
    });
  });
};

module.exports = {
  getData: getData,
};
