# Vitest Preview Dashboard

Vitest Preview Dashboard 是一个用于显示测试中捕获的 DOM 快照的 Web 服务器。虽然大多数用户会通过 CLI 命令（`vitest-preview`）与仪表板交互，但您也可以使用 Node.js API 以编程方式控制仪表板服务器。

## Node.js API

Vitest Preview 提供了三个主要函数，用于以编程方式控制仪表板服务器：

### `startServer`

启动 Vitest Preview Dashboard 服务器。

```ts
import { startServer } from 'vitest-preview/node';

// 使用默认选项启动服务器
const server = await startServer();

// 或使用自定义选项
const serverWithOptions = await startServer({
  open: false // 不自动打开浏览器
});
```

#### 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|-------|------|
| `open` | boolean | `true` | 服务器启动时是否自动打开浏览器 |

#### 返回值

返回一个具有以下属性的 `ServerInstance` 对象：

```ts
interface ServerInstance {
  httpServer: http.Server; // Node.js HTTP 服务器实例
  vite: ViteDevServer;     // Vite 开发服务器实例
}
```

### `stopServer`

停止正在运行的 Vitest Preview Dashboard 服务器。

```ts
import { startServer, stopServer } from 'vitest-preview/node';

// 启动服务器
const server = await startServer();

// 之后，停止服务器
stopServer(server);
```

#### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `serverInstance` | ServerInstance | 由 `startServer` 返回的服务器实例 |

### `registerCleanup`

注册事件处理程序，以在进程退出时清理缓存文件夹。这会由 `startServer` 自动调用，但如果需要，您也可以手动调用它。

```ts
import { registerCleanup } from 'vitest-preview/node';

// 注册清理处理程序
registerCleanup();
```

此函数为以下事件设置处理程序：
- `exit`：正常进程退出
- `SIGINT`：中断信号（Ctrl+C）
- `SIGTERM`：终止信号
- `uncaughtException`：未捕获的异常

## 使用场景

### 测试中的编程控制

您可以使用 Node.js API 在测试设置和拆卸过程中启动和停止仪表板服务器：

```ts
import { startServer, stopServer } from 'vitest-preview/node';
import { beforeAll, afterAll } from 'vitest';

let server;

beforeAll(async () => {
  server = await startServer({ open: false });
});

afterAll(() => {
  stopServer(server);
});
```

通过这种方式，您不需要[单独](/zh/guide/getting-started#step-3-usage)运行 `vitest-preview` 命令。

### 自定义集成

您可以将 Vitest Preview Dashboard 集成到您自己的工具或工作流程中：

```ts
import { startServer, stopServer } from 'vitest-preview/node';
import express from 'express';

async function setupDevEnvironment() {
  const app = express();
  
  // 设置您自己的路由
  app.get('/api/tests', (req, res) => {
    // 您的 API 逻辑
  });
  
  // 启动 Vitest Preview Dashboard
  const previewServer = await startServer({ open: false });
  
  // 您自己的服务器设置
  const server = app.listen(3000, () => {
    console.log('开发环境已准备就绪，访问 http://localhost:3000');
  });
  
  // 设置清理
  process.on('SIGINT', () => {
    stopServer(previewServer);
    server.close();
    process.exit(0);
  });
}

setupDevEnvironment();
```

## 注意事项

- 仪表板服务器默认在端口 5006 上运行，但如果 5006 已被占用，则会查找可用端口
- 服务器会监视快照 HTML 文件的更改，并在文件更改时自动刷新浏览器
- 配置中指定的外部 CSS 文件会被处理并注入到 HTML 中
