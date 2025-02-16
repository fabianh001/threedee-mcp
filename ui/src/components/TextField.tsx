import ReactMarkdown from "react-markdown";

export default function MarkdownField({ content = "" }: { content?: string }) {
  if (content == "") {
    return null;
  }
  return (
    <div className="w-1/3 bg-white rounded-lg shadow-sm p-4">
      <div className="prose prose-gray prose-headings:font-semibold prose-h1:text-2xl prose-h1:mb-6 prose-p:my-2 prose-ol:my-2 prose-li:my-2">
        <ReactMarkdown
          components={{
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded-md bg-gray-100 font-mono text-sm">
                {children}
              </code>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-8 space-y-2">{children}</ol>
            ),
            li: ({ children }) => <li className="pl-2">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
