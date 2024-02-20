# LangChain 学习 demo

## 开始
1. node 版本 >=18
2. `pnpm i`
3. 想查看 `src` 目录下的第 i 个 demo, 就在终端输入 `pnpm run dev:i`

## demo
### 1-hellow-world
- hello world
- 构建了一个 LLM Chain
- prompt 模板功能
- 结果格式化为字符串

### 2-retrieval-chain
- Retrieval Chain (检索链)
- 增加检索链, 也就是相当于增加私域知识, 可以外挂文档
- 对外挂文档进行文本分割(文本分割)
- 将加载的文档进行向量存储(嵌入模型&向量存储)
