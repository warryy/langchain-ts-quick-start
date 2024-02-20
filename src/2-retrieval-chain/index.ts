require("dotenv").config();
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

(async function fn() {
  // 创建一个模型
  const chatModel = new ChatOpenAI({
    // 这是你的OpenAI API密钥，用于验证你的身份并允许你访问OpenAI的服务。如果环境变量里面有, 则不用传
    // openAIApiKey: process.env.OPENAI_API_KEY,
    // 这是你想要使用的模型的名称。在这个例子中，使用的是"gpt-3.5-turbo"模型。
    modelName: "gpt-3.5-turbo",
    // // 这个参数控制生成文本的随机性。值越高（接近1），生成的文本就越随机；值越低（接近0），生成的文本就越确定。
    // temperature: 0.5,
    // // 这个参数限制生成的文本的最大长度。在这个例子中，生成的文本最多包含100个 tokens。
    // maxTokens: 300,
    // // 这是一个用于控制生成文本的随机性的参数，也被称为nucleus sampling。它在每一步选择一个小集合的最可能的tokens，而不是在所有可能的tokens中选择。
    // topP: 1,
    // // 这个参数惩罚新出现的 tokens，使得模型更倾向于使用已经出现过的 tokens。
    // presencePenalty: 0.5,
    // // 这个参数惩罚频繁出现的 tokens，使得模型更倾向于使用不那么常见的 tokens。
    // frequencyPenalty: 0.5,
    // 这个参数定义了生成文本时的停止条件。在这个例子中，当模型生成了一个换行符("\n")时，它会停止生成更多的文本。
    // stop: ["\n"],
  });

  // 创建外部文档加载器
  const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/user_guide"
  );
  // 加载外部文档
  const docs = await loader.load();
  console.log("外部文档docs", docs);

  // 文本分割器
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log("文本分割器", splitDocs[0]);

  // 嵌入模型
  const embeddings = new OpenAIEmbeddings();

  // 向量存储
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
  
    <context>
    {context}
    </context>
  
    Question: {input}`);

  // 创建一个文档链, 传入prompt和model
  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });
  // documentChain 的另一种调用形式:
  // import { Document } from "@langchain/core/documents";
  // const res = await documentChain.invoke({
  //   input: "what is LangSmith?",
  //   context: [
  //     new Document({
  //       pageContent:
  //         "LangSmith is a platform for building production-grade LLM applications.",
  //     }),
  //   ],
  // });

  // 创建一个检索器
  const retriever = vectorstore.asRetriever();

  // 检索链, 传入检索器和文档链
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const res = await retrievalChain.invoke({ input: "what is LangSmith?" });
  // 放开这个log, 可以看到, 最终形式, 还是将文档拆分成块, 当做 context 传给了 model
  // console.log('回答: ', res);
  console.log(res.answer);
})();
