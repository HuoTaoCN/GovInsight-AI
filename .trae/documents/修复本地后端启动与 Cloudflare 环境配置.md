我已经修复了本地开发环境的配置，现在可以同时支持 **本地 Express 后端** 和 **Cloudflare Wrangler** 模式。

### 问题原因
1. **“后端未启动”报错**：前端尝试请求 `/api/analyze`，但由于配置问题无法连接到有效的后端服务。
2. **Cloudflare 模式失效**：Wrangler 启动时缺少 `web/.dev.vars` 环境变量文件，导致 Functions 无法调用 AI 模型，返回错误。
3. **本地 Express 未联通**：Vite 的代理配置指向了 8788 (Wrangler)，导致即使本地 Express (3000) 启动了，前端也不会去请求它。

### 修复内容
1. **自动同步环境变量**：修改了 `setup_and_run.sh`，启动时自动读取 `server/.env` 中的 `QWEN_API_KEY` 并生成 `web/.dev.vars`。这修复了 Cloudflare 模式。
2. **修正 Vite 代理**：修改了 `web/vite.config.ts`，将开发服务器的代理目标改为 `http://localhost:3000`。这确保了通过 `http://localhost:5173` 访问时能连接到本地 Express 后端。

### 现在的运行方式
运行 `./setup_and_run.sh` 后，你会看到两个可用的地址：

| 访问地址 | 后端服务 | 特点 |
| :--- | :--- | :--- |
| **http://localhost:5173** | **Express (Port 3000)** | 适合传统 Node.js 开发，调试方便 |
| **http://localhost:8788** | **Cloudflare Functions** | 适合预览 Cloudflare 真实部署效果 |

**注意**：如果你还没有配置 Key，请先在 `server/.env` 中填入 `QWEN_API_KEY`，然后重启脚本即可。