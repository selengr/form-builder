'use client';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      <h2>مشکلی پیش آمد</h2>
      <p>Digest: {error.digest}</p>
      <p>Digest: {error.message}</p>
    </div>
  );
}
