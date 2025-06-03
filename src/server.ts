import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`RemoteIntegrity Server is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (reason: any) => {
  console.log(`😈 unhandledRejection is detected, shutting down ...`);
  console.error('Reason:', reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


process.on('uncaughtException', (err) => {
  console.error('😈 uncaughtException is detected, shutting down...');
  console.error('Error:', err);
  process.exit(1);
});

