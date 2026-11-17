import fs from 'node:fs';
// The deploy package is self-contained. No Python or database connection at build time.
for(const file of ['public/index.html','public/app.js','server/api.js','server/verification.js'])if(!fs.existsSync(file))throw Error('Paquete incompleto: '+file);
console.log('Linux Lab listo para Vercel. La conexión PostgreSQL se utiliza solo en el servidor.');
