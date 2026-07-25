import './htmlpreview.css'

export default function HtmlPreview({ html }: { html: string }) {
  return (
    <div
      className="prose w-full htmlpreview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}