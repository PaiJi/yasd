import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'

export default function ErrorBoundary() {
  const error = useRouteError()

  console.error(error)

  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        {is404 ? '404' : 'Something went wrong'}
      </h1>

      <p className="text-muted-foreground max-w-md text-sm">
        {is404
          ? 'The page you are looking for does not exist.'
          : getErrorMessage(error)}
      </p>

      <div className="mt-2 flex gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    </div>
  )
}

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}

ErrorBoundary.displayName = 'ErrorBoundary'

export { ErrorBoundary }
