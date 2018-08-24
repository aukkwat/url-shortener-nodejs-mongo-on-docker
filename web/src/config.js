var config = {};

config.db = {};
// config.webhost = 'http://localhost:3000/';

config.webhost = process.env.LPN_WEB_HOST || 'http://localhost:3000/';

config.db.host = process.env.LPN_MONGO_HOST || 'mongo';
config.db.port = process.env.LPN_MONGO_PORT || '27017';
config.db.name = process.env.LPN_MONGO_DB || 'url_shortener';
config.db.user = process.env.LPN_MONGO_USER || 'root';
config.db.pass = process.env.LPN_MONGO_PASS || 'example';

module.exports = config;
