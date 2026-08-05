import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const code = String(children).replace(/\n$/, '') || '';
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'text';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  if (inline) return <code className={className}>{children}</code>;

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 px-2 py-1 rounded bg-slate-800/70 text-slate-200 text-xs hover:bg-slate-800"
        title="Copy code"
      >
        Copy
      </button>
      <SyntaxHighlighter language={lang} style={oneDark} wrapLongLines={true} showLineNumbers={false}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
