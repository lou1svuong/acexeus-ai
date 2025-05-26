"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PolkadotAgentService } from "@/lib/polkadot-agent";

interface PolkadotAgentContextType {
  agent: PolkadotAgentService | null;
  isInitialized: boolean;
  error: string | null;
}

const PolkadotAgentContext = createContext<PolkadotAgentContextType>({
  agent: null,
  isInitialized: false,
  error: null,
});

export function PolkadotAgentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [agent, setAgent] = useState<PolkadotAgentService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
        const openAiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        if (!privateKey || !openAiApiKey) {
          throw new Error("Missing required environment variables");
        }

        const newAgent = new PolkadotAgentService(privateKey, openAiApiKey);
        await newAgent.initialize();
        setAgent(newAgent);
        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize agent"
        );
        console.error("Failed to initialize agent:", err);
      }
    };

    initializeAgent();

    return () => {
      if (agent) {
        agent.disconnect();
      }
    };
  }, []);

  return (
    <PolkadotAgentContext.Provider value={{ agent, isInitialized, error }}>
      {children}
    </PolkadotAgentContext.Provider>
  );
}

export const usePolkadotAgent = () => useContext(PolkadotAgentContext);
