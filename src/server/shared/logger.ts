/**
 * Structured console logger — zero external dependencies.
 *
 * Features:
 *  - Log levels: error, warn, info, debug
 *  - ISO timestamps on every line
 *  - JSON-formatted context objects
 *  - LOG_LEVEL env var support (defaults to "debug" in dev, "info" in prod)
 *  - createChildLogger(domain) factory for domain-prefixed logs
 *  - requestLogger middleware for HTTP request logging
 */

import type { Request, Response, NextFunction } from 'express';

// ---------------------------------------------------------------------------
// Level definitions
// ---------------------------------------------------------------------------

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type Level = keyof typeof LEVELS;

const resolveThreshold = (): Level => {
  const env = (process.env.LOG_LEVEL || '').toLowerCase();
  if (env in LEVELS) return env as Level;
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const threshold = LEVELS[resolveThreshold()];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const formatContext = (ctx: Record<string, unknown> | undefined): string => {
  if (!ctx || Object.keys(ctx).length === 0) return '';
  try {
    return ' ' + JSON.stringify(ctx);
  } catch {
    return ' [unserializable context]';
  }
};

const formatArgs = (args: unknown[]): string => {
  if (args.length === 0) return '';
  return (
    ' ' +
    args
      .map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
      .join(' ')
  );
};

// ---------------------------------------------------------------------------
// Core log function
// ---------------------------------------------------------------------------

const log = (
  level: Level,
  prefix: string,
  msgOrCtx: string | Record<string, unknown>,
  rest: unknown[]
) => {
  if (LEVELS[level] > threshold) return;

  const ts = new Date().toISOString();
  const tag = `[${level.toUpperCase()}]`;

  let message: string;
  let context: Record<string, unknown> | undefined;

  if (typeof msgOrCtx === 'string') {
    message = msgOrCtx;
    // If the first rest arg is a plain object, treat it as context
    if (
      rest.length === 1 &&
      rest[0] !== null &&
      typeof rest[0] === 'object' &&
      !Array.isArray(rest[0])
    ) {
      context = rest[0] as Record<string, unknown>;
      rest = [];
    }
  } else {
    // Called as logger.info({ key: val }, "message", ...rest)
    context = msgOrCtx;
    message = typeof rest[0] === 'string' ? (rest.shift() as string) : '';
  }

  const prefixStr = prefix ? ` [${prefix}]` : '';
  const line = `${ts} ${tag}${prefixStr} ${message}${formatContext(context)}${formatArgs(rest)}`;

  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

// ---------------------------------------------------------------------------
// Logger interface
// ---------------------------------------------------------------------------

export interface Logger {
  error(msg: string, ...args: unknown[]): void;
  error(ctx: Record<string, unknown>, msg: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
  warn(ctx: Record<string, unknown>, msg: string, ...args: unknown[]): void;
  info(msg: string, ...args: unknown[]): void;
  info(ctx: Record<string, unknown>, msg: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;
  debug(ctx: Record<string, unknown>, msg: string, ...args: unknown[]): void;
  child(domain: string): Logger;
}

const createLogger = (prefix = ''): Logger => ({
  error: (msgOrCtx: string | Record<string, unknown>, ...rest: unknown[]) =>
    log('error', prefix, msgOrCtx, rest),
  warn: (msgOrCtx: string | Record<string, unknown>, ...rest: unknown[]) =>
    log('warn', prefix, msgOrCtx, rest),
  info: (msgOrCtx: string | Record<string, unknown>, ...rest: unknown[]) =>
    log('info', prefix, msgOrCtx, rest),
  debug: (msgOrCtx: string | Record<string, unknown>, ...rest: unknown[]) =>
    log('debug', prefix, msgOrCtx, rest),
  child: (domain: string) =>
    createLogger(prefix ? `${prefix}:${domain}` : domain),
});

// ---------------------------------------------------------------------------
// Singleton + factory
// ---------------------------------------------------------------------------

const logger = createLogger();
export default logger;

export const createChildLogger = (domain: string): Logger =>
  logger.child(domain);

// ---------------------------------------------------------------------------
// Request logging middleware
// ---------------------------------------------------------------------------

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level: Level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    log(level, 'http', `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, []);
  });

  next();
};
