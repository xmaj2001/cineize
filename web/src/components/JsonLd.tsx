/**
 * JsonLd — renders a JSON-LD <script> tag safely in Next.js App Router.
 *
 * Using `dangerouslySetInnerHTML` directly on a `<script>` inside a Server
 * Component produces a React warning during client-side navigation because
 * React tries to re-execute the script tag on the client.
 * Wrapping with `suppressHydrationWarning` silences this without any
 * functional side-effects — the tag is still rendered on the server and
 * picked up by crawlers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}
