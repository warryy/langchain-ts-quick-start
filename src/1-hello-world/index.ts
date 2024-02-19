require('dotenv').config()
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  // 这是你的OpenAI API密钥，用于验证你的身份并允许你访问OpenAI的服务。如果环境变量里面有, 则不用传
  // openAIApiKey: process.env.OPENAI_API_KEY,
  // 这是你想要使用的模型的名称。在这个例子中，使用的是"gpt-3.5-turbo"模型。
  modelName: "gpt-3.5-turbo",
  // 这个参数控制生成文本的随机性。值越高（接近1），生成的文本就越随机；值越低（接近0），生成的文本就越确定。
  temperature: 0.5,
  // 这个参数限制生成的文本的最大长度。在这个例子中，生成的文本最多包含100个 tokens。
  maxTokens: 300,
  // 这是一个用于控制生成文本的随机性的参数，也被称为nucleus sampling。它在每一步选择一个小集合的最可能的tokens，而不是在所有可能的tokens中选择。
  topP: 1,
  // 这个参数惩罚新出现的 tokens，使得模型更倾向于使用已经出现过的 tokens。
  presencePenalty: 0.5,
  // 这个参数惩罚频繁出现的 tokens，使得模型更倾向于使用不那么常见的 tokens。
  frequencyPenalty: 0.5,
  // 这个参数定义了生成文本时的停止条件。在这个例子中，当模型生成了一个换行符("\n")时，它会停止生成更多的文本。
  // stop: ["\n"],
});

const selfExecutingFn = async () => {
  const res = await chatModel.invoke("what is LangSmith?");
  console.log("%j", res);
};
selfExecutingFn();
