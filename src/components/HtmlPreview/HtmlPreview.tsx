export default function HtmlPreview({ html }: { html: string }) {
  return (
    <div
      className="prose w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}