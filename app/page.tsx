"use client";

import Image from "next/image";

import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from "@/components/ui/chat/ai/message";

const messages: {
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
}[] = [
  {
    from: "user",
    content: "Hello, how are you?",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
  },
  {
    from: "assistant",
    content: "I am fine, thank you!",
    avatar: "https://github.com/openai.png",
    name: "OpenAI",
  },
  {
    from: "user",
    content: "What is the weather in Tokyo?",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
  },
  {
    from: "assistant",
    content: "The weather in Tokyo is sunny.",
    avatar: "https://github.com/openai.png",
    name: "OpenAI",
  },
];

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from "@/components/ui/chat/code-block";
import type { BundledLanguage } from "@/components/ui/chat/code-block";
import { useEffect } from "react";
import { AIResponse } from "@/components/ui/chat/ai/response";

import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/chat/ai/input";
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";
import { ModeToggle } from "@/components/theme/theme-toggle";
const code = [
  {
    language: "jsx",
    filename: "MyComponent.jsx",
    code: `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`,
  },
  {
    language: "tsx",
    filename: "MyComponent.tsx",
    code: `function MyComponent(props: { name: string }) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`,
  },
];

const tokens = [
  "### Hello",
  " World",
  "\n\n",
  "This",
  " is",
  " a",
  " **",
  "markdown",
  "**",
  " response",
  " from",
  " an",
  " AI",
  " model",
  ".",
  "\n\n",
  "```",
  "javascript",
  "\n",
  "const",
  " greeting",
  " = ",
  "'Hello, world!'",
  ";",
  "\n",
  "console",
  ".",
  "log",
  "(",
  "greeting",
  ")",
  ";",
  "\n",
  "```",
  "\n\n",
  "Here's",
  " a",
  " [",
  "link",
  "](",
  "https://example.com",
  ")",
  " and",
  " some",
  " more",
  " text",
  " with",
  " a",
  " list",
  ":",
  "\n\n",
  "-",
  " Item",
  " one",
  "\n",
  "-",
  " Item",
  " two",
  "\n",
  "-",
  " Item",
  " three",
];

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

export default function Home() {
  const [content, setContent] = useState("");
  const [model, setModel] = useState<string>(models[0].id);

  useEffect(() => {
    let currentContent = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < tokens.length) {
        currentContent += tokens[index];
        setContent(currentContent);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    console.log("Submitted message:", message);
  };
  return (
    <>
      <ModeToggle />
      <AIResponse>{content}</AIResponse>;
      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <MicIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </AIInputButton>
            <AIInputModelSelect value={model} onValueChange={setModel}>
              <AIInputModelSelectTrigger>
                <AIInputModelSelectValue />
              </AIInputModelSelectTrigger>
              <AIInputModelSelectContent>
                {models.map((model) => (
                  <AIInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit>
            <SendIcon size={16} />
          </AIInputSubmit>
        </AIInputToolbar>
      </AIInput>
      {messages.map(({ content, ...message }, index) => (
        <AIMessage key={index} from={message.from}>
          <AIMessageContent>{content}</AIMessageContent>
          <AIMessageAvatar src={message.avatar} name={message.name} />
        </AIMessage>
      ))}
      <div className="flex flex-col gap-4">
        <CodeBlock data={code} defaultValue={code[0].language}>
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
                  <CodeBlockSelectItem
                    key={item.language}
                    value={item.language}
                  >
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
      </div>
    </>
  );
}
