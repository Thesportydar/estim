require('dotenv').config();

const app = require('./app');
const http = require('http');

// Configuración del servidor
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Crea el servidor HTTP
const server = http.createServer(app);

// Escucha en el puerto configurado
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Manejo de errores del servidor
server.on('error', onError);

// Normaliza el puerto (número, cadena o falso)
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// Maneja errores comunes en el servidor
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Muestra mensajes amigables según el error
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
