import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      if (event.request?.data) {
        // 请求体可能包含 apiKey / 密码等，统一脱敏
        event.request.data = '[Filtered]';
      }
      return event;
    },
  });
}
