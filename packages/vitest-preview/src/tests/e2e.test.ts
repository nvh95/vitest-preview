import { startServer, stopServer } from '../node';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { spawnSync } from 'child_process';
import { AddressInfo } from 'net';

describe('Vitest Preview Server', () => {
  let server: Awaited<ReturnType<typeof startServer>>;

  beforeAll(async () => {
    server = await startServer({open: false});
  });

  afterAll(() => {
    stopServer(server);
  });

  it('should show empty page', async () => {
    expect(server).toBeDefined();
    expect(server.httpServer).toBeDefined();
    expect(server.vite).toBeDefined();
    const host = server.vite.config.server.host?.toString()
    const port = (server.httpServer.address() as AddressInfo)?.port

    const response = await fetch(`http://${host}:${port}`);
    const html = await response.text();
    expect(html).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html lang="en" class="dark h-full"><head>
          <script type="module" src="/@vite/client"></script>

          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vitest Preview Dashboard</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="h-full bg-slate-200">
          <div class="p-10 m-auto">
            No previews found.<br>
            Please add following lines to your test: <br>
            <br>
            <div class="bg-slate-400 p-4 w-fit rounded">
              <code>
                import { debug } from 'vitest-preview';
                <br>
                <br>
                // Inside your tests
                <br>
                describe('my test', () =&gt; {
                <br>
                &nbsp;&nbsp;render(&lt;MyComponent /&gt;);
                <br>
                &nbsp;&nbsp;debug(); // 👈 Add this line
                <br>
                }
              </code>
            </div>
            <br>
            Then rerun your tests.
          </div>
        

      </body></html>"
    `);
  });

  it('should show preview page', async () => {
    expect(server).toBeDefined();
    expect(server.httpServer).toBeDefined();
    expect(server.vite).toBeDefined();
    const host = server.vite.config.server.host?.toString()
    const port = (server.httpServer.address() as AddressInfo)?.port

    spawnSync('npx', ['vitest', 'run', 'simpleHtml.test.ts', '--environment', 'jsdom']);

    const response = await fetch(`http://${host}:${port}`);
    const html = await response.text();
    expect(html).toMatchInlineSnapshot(`
      "<html><head>
        <script type="module" src="/@vite/client"></script>
      </head><body><h1>Hello World</h1></body></html>"
    `);
  });
});
