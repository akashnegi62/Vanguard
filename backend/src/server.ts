import { app } from './app';
import { config } from './config/env';
import { initDatabaseConnection, prisma } from './config/database';
import http from 'http';

async function bootstrap() {
  console.log('🚀 Starting Vanguard Men\'s Fashion API server...');

  // Initialize Database connection
  await initDatabaseConnection();

  let targetPort = config.port;

  const startServer = (port: number) => {
    const server = http.createServer(app);

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is in use (e.g., by macOS ControlCenter/AirPlay). Trying alternative port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    server.listen(port, () => {
      console.log(`====================================================`);
      console.log(`💎 Vanguard REST API Server running successfully!`);
      console.log(`📡 URL: http://localhost:${port}`);
      console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
      console.log(`❤️  Health Check: http://localhost:${port}/health`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`====================================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Vanguard API Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  };

  startServer(targetPort);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
