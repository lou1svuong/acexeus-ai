"use client";

import { cn } from "@/lib/utils";
import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  type CodeBlockProps,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from "@/components/ui/chat/code-block";
import { memo } from "react";
import type { HTMLAttributes } from "react";
import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";

export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options["children"];
};

const components: Options["components"] = {
  pre: ({ children }) => <div>{children}</div>,
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn("py-1", className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn("font-semibold", className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn("font-medium text-primary underline", className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1
      className={cn("mt-6 mb-2 font-semibold text-3xl", className)}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2
      className={cn("mt-6 mb-2 font-semibold text-2xl", className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn("mt-6 mb-2 font-semibold text-xl", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn("mt-6 mb-2 font-semibold text-lg", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5
      className={cn("mt-6 mb-2 font-semibold text-base", className)}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn("mt-6 mb-2 font-semibold text-sm", className)} {...props}>
      {children}
    </h6>
  ),
  code: ({ node, className, children }) => {
    if (!className) {
      return (
        <code className={cn("rounded bg-muted px-1 py-0.5", className)}>
          {children}
        </code>
      );
    }

    const language = className.replace(/^language-/, "");
    const code = String(children).replace(/\n$/, "");

    const languageMap: Record<string, BundledLanguage> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      rs: "rust",
      md: "markdown",
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      html: "html",
      css: "css",
      json: "json",
      yml: "yaml",
      yaml: "yaml",
      xml: "xml",
      sql: "sql",
      graphql: "graphql",
    };

    const mappedLanguage = languageMap[language] || "typescript";

    const data: CodeBlockProps["data"] = [
      {
        language: mappedLanguage,
        filename: `index.${language}`,
        code,
      },
    ];

    return (
      <CodeBlock
        className={cn("my-4", className)}
        data={data}
        defaultValue={mappedLanguage}
      >
        <CodeBlockHeader>
          <CodeBlockFiles>
            {(item) => (
              <CodeBlockFilename key={item.language} value={item.language}>
                {item.filename}
              </CodeBlockFilename>
            )}
          </CodeBlockFiles>
          <CodeBlockSelect>
            <CodeBlockSelectTrigger>
              <CodeBlockSelectValue />
            </CodeBlockSelectTrigger>
            <CodeBlockSelectContent>
              {(item) => (
                <CodeBlockSelectItem key={item.language} value={item.language}>
                  {item.language}
                </CodeBlockSelectItem>
              )}
            </CodeBlockSelectContent>
          </CodeBlockSelect>
          <CodeBlockCopyButton
            onCopy={() => console.log("Copied code to clipboard")}
            onError={() => console.error("Failed to copy code to clipboard")}
          />
        </CodeBlockHeader>
        <CodeBlockBody>
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent language={item.language as BundledLanguage}>
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    );
  },
};

export const AIResponse = memo(
  ({ className, options, children, ...props }: AIResponseProps) => (
    <div
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        {...options}
      >
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
