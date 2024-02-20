# LangChain 学习 demo

## 开始
1. node 版本 >=18
2. `pnpm i`
3. 想查看 `src` 目录下的第 i 个 demo, 就在终端输入 `pnpm run dev:i`

## demo
### 1-hellow-world
> hello world
- 构建了一个 LLM Chain
- prompt 模板功能
- 结果格式化为字符串

### 2-retrieval-chain
> 加载外部文档, 并以此参考进行问题回答
- 文档加载器: 加载外部文档
- 文本分割: 对文档进行文本分割
- 文档链: 将 prompt 和 model 进行封装, prompt 提供嵌入检索器上线文能力
- 嵌入模型: 用于将文档进行向量存储
- 向量存储: 通过传入切片文档和嵌入模型, 来进行向量存储
- retriver: 检索器, 向量存储暴露出来的能力
- retrieval-chain: 检索链, 传入文档链和向量存储的检索器, 执行 invoke 进行问答操作
