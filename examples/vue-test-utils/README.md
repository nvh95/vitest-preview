# Example with @vue/test-utils

## Instruction

- Install the dependencies:

```bash
pnpm install
```

- Open **Vitest Preview Dashboard**:

```bash
pnpm vitest-preview
```

- Run tests:

```bash
pnpm test
```

- Modify [App.test.ts](./App.test.ts) to see the changes reflects in **Vitest Preview Dashboard** immediately.

## Caveats

By default, `mount` from `@vue/test-utils` does not attach the component to the DOM. To make it work with `vitest-preview`, you need to attach it to the DOM by passing `attachTo` option. For example:

```js
// Simulate the structure of `index.html`
const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);

test('mount component', async () => {
  const wrapper = mount(App, {
    attachTo: '#app', // <--- attach to the DOM
  });
});
```

Read more about `attachTo` property at <https://v1.test-utils.vuejs.org/api/options.html#attachto>
