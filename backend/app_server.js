/* backend server config */
const app = require('./app');
const http = require('http');
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port);
