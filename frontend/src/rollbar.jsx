import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  ignoredMessages: [/ResizeObserver loop limit exceeded/i],
}

export function withRollbar(children) {
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </RollbarProvider>
  )
}
