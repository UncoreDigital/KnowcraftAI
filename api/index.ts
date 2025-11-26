import { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

// Simple in-memory storage for demo
const storage = new Map();

// Simple logging function
function log(message: string) {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} [api] ${message}`);
}

// Helper function to get MIME type
function getMimeType(filepath: string): string {
  const ext = path.extname(filepath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { method, url } = req;
    log(`${method} ${url}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Handle API routes
    if (url?.startsWith('/api/knowledge-base')) {
      if (method === 'GET') {
        const items = Array.from(storage.values());
        return res.json(items);
      }
      
      if (method === 'POST') {
        const id = randomUUID();
        const now = new Date();
        const item = {
          id,
          name: req.body?.name || 'Sample Knowledge Base Item',
          type: req.body?.type || 'text',
          source: req.body?.source || null,
          content: req.body?.content || 'Sample content',
          status: 'ready',
          fileSize: req.body?.fileSize || null,
          category: req.body?.category || null,
          accessLevel: req.body?.accessLevel || 'private',
          createdAt: now,
          updatedAt: now
        };
        storage.set(id, item);
        return res.status(201).json(item);
      }
    }

    // Handle static files - serve the React app
    if (method === 'GET') {
      const distPath = path.join(process.cwd(), 'dist', 'public');
      
      // Handle specific static asset requests
      if (url && url !== '/') {
        const filePath = path.join(distPath, url);
        
        try {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const content = fs.readFileSync(filePath);
            const mimeType = getMimeType(filePath);
            res.setHeader('Content-Type', mimeType);
            
            // Add cache headers for static assets
            if (url.includes('/assets/')) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            
            return res.send(content);
          }
        } catch (error) {
          console.warn('Error serving static file:', error);
        }
      }
      
      // Serve index.html for root and SPA routes
      const indexPath = path.join(distPath, 'index.html');
      try {
        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf-8');
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Cache-Control', 'no-cache');
          return res.send(html);
        }
      } catch (error) {
        console.warn('Could not serve index.html:', error);
      }
      
      // Fallback to simple message if no static files
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>KnowCraftAI</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
              .container { max-width: 600px; margin: 0 auto; }
              .status { color: #28a745; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🤖 KnowCraftAI</h1>
              <p class="status">✅ API is running successfully!</p>
              <p>Building React frontend... Please wait a moment and refresh.</p>
              <p><strong>API Endpoints:</strong></p>
              <ul style="text-align: left; display: inline-block;">
                <li>GET /api/knowledge-base - List knowledge items</li>
                <li>POST /api/knowledge-base - Create knowledge item</li>
              </ul>
            </div>
          </body>
        </html>
      `);
    }

    return res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}