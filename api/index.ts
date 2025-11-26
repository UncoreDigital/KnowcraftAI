import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic, log } from '../server/vite';
import path from 'path';

// Set NODE_ENV for production
process.env.NODE_ENV = 'production';

const app = express();

// Add request parsing middleware
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const urlPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (urlPath.startsWith("/api")) {
      let logLine = `${req.method} ${urlPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Initialize routes
let server: any;
const initializeApp = async () => {
  if (!server) {
    server = await registerRoutes(app);
    
    // Error handling middleware
    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files in production
    try {
      // For Vercel, we'll handle static files differently
      const distPath = path.resolve(process.cwd(), 'dist', 'public');
      app.use(express.static(distPath));
      app.use('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } catch (error) {
      console.warn('Static files not available, serving API only');
      // Fallback to serve a simple message
      app.get('*', (_req, res) => {
        res.send('KnowCraftAI API is running');
      });
    }
  }
  return app;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await initializeApp();
  return app(req, res);
}