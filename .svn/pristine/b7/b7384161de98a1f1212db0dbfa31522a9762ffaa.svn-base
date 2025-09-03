import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();

  // ================== HOST HEADER VALIDATION ==================
  server.use((req, res, next) => {
    const validHosts = [
      'nyaysetu.nic.in',
      '10.194.163.69',
      'localhost',
      `localhost:${process.env['PORT'] || 4000}`
    ];

    const hostHeader = req.headers.host;
    const host = hostHeader ? hostHeader.split(':')[0] : null;

    if (!host || !validHosts.includes(host)) {
      console.warn(`Blocked request with invalid Host: ${hostHeader}`);
      res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid Host Header'
      });
      return; // Explicit return to terminate middleware
    }
    next(); // Explicitly call next() for valid hosts
    return; // Explicit return for TypeScript
  });

  // ================== SECURITY HEADERS ==================
  server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
    return; // Explicit return for TypeScript
  });

  // Serve static files
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    immutable: true
  }));

  // Angular SSR
  server.get('*', (req, res, next) => {
    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      })
      .then(html => res.send(html))
      .catch(err => next(err));
    return; // Explicit return for TypeScript
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

run();