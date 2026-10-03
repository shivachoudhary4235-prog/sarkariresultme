import { createServer } from 'vite';

async function start() {
  const server = await createServer({
    configFile: './vite.config.ts',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  });

  await server.listen();
  console.log('Vite server running on http://localhost:3000');

  // Keep event loop active indefinitely
  setInterval(() => {}, 1000 * 60 * 60);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
