"use client";

import { useState, useRef, useEffect } from "react";
import { AIMessage, AIMessageAvatar, AIMessageContent } from "./ai/message";
import { AIResponse } from "./ai/response";
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
} from "./ai/input";
import {
  GlobeIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  StopCircleIcon,
} from "lucide-react";
import type { FormEventHandler } from "react";

// Mock data types
export type Message = {
  id: string;
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
  timestamp: string;
  codeBlocks?: CodeBlock[];
  isTyping?: boolean;
  tokens?: string[];
};

export type CodeBlock = {
  language: string;
  filename: string;
  code: string;
};

export type Model = {
  id: string;
  name: string;
  description?: string;
};

// Mock data
export const mockModels: Model[] = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient",
  },
  { id: "claude-2", name: "Claude 2", description: "Anthropic's latest model" },
  {
    id: "claude-instant",
    name: "Claude Instant",
    description: "Fast Claude model",
  },
  { id: "palm-2", name: "PaLM 2", description: "Google's latest model" },
  {
    id: "llama-2-70b",
    name: "Llama 2 70B",
    description: "Meta's largest model",
  },
  {
    id: "llama-2-13b",
    name: "Llama 2 13B",
    description: "Meta's efficient model",
  },
  {
    id: "cohere-command",
    name: "Command",
    description: "Cohere's latest model",
  },
  { id: "mistral-7b", name: "Mistral 7B", description: "Efficient open model" },
];

// Mock AI response
const mockAIResponse = `I'll help you with that! Here's a detailed explanation:

### Key Points
1. First point
2. Second point
3. Third point

Here's a code example:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`).then(res => res.json());
}
\`\`\`

You can learn more about this in the [documentation](https://example.com/docs).

Let me know if you need any clarification!`;

export const mockMessages: Message[] = [
  {
    id: "1",
    from: "user",
    content: "Hello, can you help me with React components?",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
    timestamp: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    from: "assistant",
    content: `I'd be happy to help you with React components! Here's a simple example:

\`\`\`tsx
function MyComponent(props: { name: string }) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
\`\`\``,
    avatar: "https://github.com/openai.png",
    name: "OpenAI",
    timestamp: "2024-03-20T10:00:05Z",
    codeBlocks: [
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
    ],
  },
  {
    id: "3",
    from: "user",
    content: "Can you show me how to use hooks?",
    avatar: "https://github.com/haydenbleasel.png",
    name: "Hayden Bleasel",
    timestamp: "2024-03-20T10:01:00Z",
  },
  {
    id: "4",
    from: "assistant",
    content: "Here's an example of using React hooks:",
    avatar: "https://github.com/openai.png",
    name: "OpenAI",
    timestamp: "2024-03-20T10:01:05Z",
    codeBlocks: [
      {
        language: "jsx",
        filename: "useCounter.tsx",
        code: `import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
  };
}`,
      },
    ],
  },
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [model, setModel] = useState<string>(mockModels[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldScrollRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current && shouldScrollRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      shouldScrollRef.current = false;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: "assistant",
        content: currentResponse,
        avatar: "https://github.com/openai.png",
        name: "OpenAI",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    if (!message.trim()) return;

    shouldScrollRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      content: message,
      avatar: "https://github.com/haydenbleasel.png",
      name: "Hayden Bleasel",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setCurrentResponse("");

    // Simulate token streaming
    let currentIndex = 0;
    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < mockAIResponse.length) {
        setCurrentResponse((prev) => prev + mockAIResponse[currentIndex]);
        currentIndex++;
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
        setIsStreaming(false);
        setIsTyping(false);

        // Add the complete response as a message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          content: mockAIResponse,
          avatar: "https://github.com/openai.png",
          name: "OpenAI",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    }, 50);

    // Reset form
    event.currentTarget.reset();
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] w-full space-y-4">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <AIMessage key={message.id} from={message.from}>
            <AIMessageContent>
              <AIResponse>{message.content}</AIResponse>
            </AIMessageContent>
            <AIMessageAvatar src={message.avatar} name={message.name} />
          </AIMessage>
        ))}
        {isStreaming && (
          <AIMessage from="assistant">
            <AIMessageContent>
              <AIResponse>{currentResponse}</AIResponse>
            </AIMessageContent>
            <AIMessageAvatar
              src="https://github.com/openai.png"
              name="OpenAI"
            />
          </AIMessage>
        )}
        {isTyping && !isStreaming && (
          <AIMessage from="assistant">
            <AIMessageContent>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </AIMessageContent>
            <AIMessageAvatar
              src="https://github.com/openai.png"
              name="OpenAI"
            />
          </AIMessage>
        )}
        <div ref={messagesEndRef} />
      </div>

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
                {mockModels.map((model) => (
                  <AIInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit onClick={isStreaming ? stopStreaming : undefined}>
            {isStreaming ? (
              <StopCircleIcon size={16} />
            ) : (
              <SendIcon size={16} />
            )}
          </AIInputSubmit>
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
