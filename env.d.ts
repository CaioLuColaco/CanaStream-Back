declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      NODE_ENV: 'dev' | 'prod';
      PORT?: string;
    }
  }
}

export {};
