"use client"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f0f0f',
                    color: '#fff',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#999', marginBottom: '2rem' }}>
                        An unexpected error has occurred.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    )
}
