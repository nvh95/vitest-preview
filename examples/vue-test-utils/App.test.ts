import { mount } from '@vue/test-utils';
import { debug } from 'vitest-preview';
import App from './App.vue';

test('mount component', async () => {
  expect(App).toBeTruthy();

  const wrapper = mount(App, {
    props: {
      count: 4,
    },
    // Mimic the real DOM
    // See 'src/test/setup.ts' for more details.
    attachTo: '#app',
  });

  expect(wrapper.text()).toContain('4 x 2 = 8');

  await wrapper.get('button').trigger('click');
  expect(wrapper.text()).toContain('4 x 3 = 12');

  await wrapper.get('button').trigger('click');
  expect(wrapper.text()).toContain('4 x 4 = 16');

  // Run `vitest-preview` then open http://localhost:3336 to see preview
  debug();
});
