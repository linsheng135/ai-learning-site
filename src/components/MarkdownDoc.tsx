import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownDocProps {
  content: string;
}

export default function MarkdownDoc({ content }: MarkdownDocProps) {
  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        点击「生成文档」开始学习
      </div>
    );
  }

  return (
    <div className="prose max-w-none px-6 py-6 overflow-y-auto h-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
