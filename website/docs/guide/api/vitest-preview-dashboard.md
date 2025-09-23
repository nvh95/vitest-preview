# Vitest Preview Dashboard

The Vitest Preview Dashboard is a web server that displays the captured DOM snapshots from your tests. While most users will interact with the dashboard through the CLI command (`vitest-preview`), you can also programmatically control the dashboard server using the Node.js API.

## Node.js API

Vitest Preview provides three main functions for programmatically controlling the dashboard server:

### `startServer`

Starts the Vitest Preview Dashboard server.

```ts
import { startServer } from 'vitest-preview/node';

// Start the server with default options
const server = await startServer();

// Or with custom options
const serverWithOptions = await startServer({
  open: false // Don't automatically open browser
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `open` | boolean | `true` | Whether to automatically open the browser when the server starts |

#### Return Value

Returns a `ServerInstance` object with the following properties:

```ts
interface ServerInstance {
  httpServer: http.Server; // Node.js HTTP server instance
  vite: ViteDevServer;     // Vite dev server instance
}
```

### `stopServer`

Stops a running Vitest Preview Dashboard server.

```ts
import { startServer, stopServer } from 'vitest-preview/node';

// Start the server
const server = await startServer();

// Later, stop the server
stopServer(server);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `serverInstance` | ServerInstance | The server instance returned by `startServer` |

### `registerCleanup`

Registers event handlers to clean up the cache folder when the process exits. This is automatically called by `startServer`, but you can call it manually if you need to.

```ts
import { registerCleanup } from 'vitest-preview/node';

// Register cleanup handlers
registerCleanup();
```

This function sets up handlers for the following events:
- `exit`: Normal process exit
- `SIGINT`: Interrupt signal (Ctrl+C)
- `SIGTERM`: Termination signal
- `uncaughtException`: Uncaught exceptions

## Use Cases

### Programmatic Control in Tests

You can use the Node.js API to start and stop the dashboard server as part of your test setup and teardown:

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

By doing this, you don't need to run `vitest-preview` command [separately](/guide/getting-started#step-3-usage).


### Custom Integration

You can integrate the Vitest Preview Dashboard into your own tools or workflows:

```ts
import { startServer, stopServer } from 'vitest-preview/node';
import express from 'express';

async function setupDevEnvironment() {
  const app = express();
  
  // Set up your own routes
  app.get('/api/tests', (req, res) => {
    // Your API logic
  });
  
  // Start Vitest Preview Dashboard
  const previewServer = await startServer({ open: false });
  
  // Your own server setup
  const server = app.listen(3000, () => {
    console.log('Development environment ready at http://localhost:3000');
  });
  
  // Setup cleanup
  process.on('SIGINT', () => {
    stopServer(previewServer);
    server.close();
    process.exit(0);
  });
}

setupDevEnvironment();
```

## Notes

- The dashboard server runs on port 5006 by default, but will find an available port if 5006 is in use
- The server watches for changes to the snapshot HTML file and automatically refreshes the browser when it changes
- External CSS files specified in the configuration are processed and injected into the HTML
