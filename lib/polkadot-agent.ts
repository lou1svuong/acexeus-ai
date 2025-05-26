import { PolkadotAgentKit } from '@polkadot-agent-kit/sdk';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const SYSTEM_PROMPT = `I am a Web Chat bot powered by PolkadotAgentKit. I can assist you with:
- Transferring tokens between chains using XCM (e.g., "transfer 1 token to westend_asset_hub to 5CSox4ZSN4SGLKUG9NYPtfVK9sByXLtxP4hmoF4UgkM4jgDJ")
- Checking WND balance on Westend (e.g., "check balance")
- Checking proxies (e.g., "check proxies on westend" or "check proxies")

When transferring tokens, please provide:
1. The amount of tokens to transfer (e.g., 1)
2. The name of the destination chain (e.g., westend, westend_asset_hub)
3. The address to receive the tokens (e.g., 5CSox4ZSN4SGLKUG9NYPtfVK9sByXLtxP4hmoF4UgkM4jgDJ)

Suggested syntax: "transfer [amount] token to [chain name] to [address]"

When checking proxies, you can specify the chain (e.g., "check proxies on westend") or 
not specify a chain (the first chain will be used by default)

Please provide instructions, and I will assist you!`;

export class PolkadotAgentService {
  private agent: PolkadotAgentKit;
  private llm: ChatOpenAI;

  constructor(privateKey: string, openAiApiKey: string) {
    this.agent = new PolkadotAgentKit(privateKey, { keyType: 'Sr25519' });
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7,
      openAIApiKey: openAiApiKey,
      streaming: true,
    });
  }

  async initialize() {
    try {
      await this.agent.initializeApi();
      const checkBalance = this.agent.getNativeBalanceTool();
      return { checkBalance };
    } catch (error) {
      console.error("Failed to initialize agent:", error);
      throw error;
    }
  }

  async processMessage(message: string) {
    try {
      const tools = await this.initialize();
      if (!tools) {
        throw new Error("Failed to initialize tools");
      }
      const llmWithTools = this.llm.bindTools(Object.values(tools) as any[]);

      const messages = [
        new SystemMessage({ content: SYSTEM_PROMPT }),
        new HumanMessage({ content: message }),
      ];

      const aiMessage = await llmWithTools.invoke(messages);
      
      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        const responses = [];
        for (const toolCall of aiMessage.tool_calls) {
          const selectedTool = tools[toCamelCase(toolCall.name)];
          if (selectedTool) {
            const toolMessage = await selectedTool.invoke(toolCall);
            if (toolMessage && toolMessage.content) {
              const response = JSON.parse(toolMessage.content || '{}');
              responses.push(response.message || response.content || 'No message from tool.');
            }
          }
        }
        return responses.join('\n');
      }
      
      return String(aiMessage.content || 'No response from LLM.');
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.agent.disconnect();
  }
}

function toCamelCase(snakeStr: string) {
  return snakeStr.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
} 