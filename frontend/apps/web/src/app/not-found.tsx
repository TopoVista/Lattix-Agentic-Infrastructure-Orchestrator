import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg p-8 text-text">
      <div className="mx-auto max-w-2xl rounded-lg border border-line bg-panel p-6">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">The workspace route you requested is not available in this phase.</p>
        <Link className="mt-4 inline-block rounded-md border border-line px-4 py-2" href="/">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
