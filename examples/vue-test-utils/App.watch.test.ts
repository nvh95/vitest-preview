import { mount } from '@vue/test-utils';
import { autoPreviewOnDomChanges } from 'vitest-preview';
import App from './App.vue';

function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

autoPreviewOnDomChanges({
  throttle: null,
});

test('mount component with automatic watching', async () => {
  expect(App).toBeTruthy();

  const wrapper = mount(App, {
    props: {
      count: 4,
    },
    // Mimic the real DOM
    // See 'src/test/setup.ts' for more details.
    attachTo: '#app',
  });

  // The initial render will be automatically captured by the watch function
  expect(wrapper.text()).toContain('4 x 2 = 8');

  // Each DOM change will trigger debug() automatically
  await wrapper.get('button').trigger('click');

  expect(wrapper.text()).toContain('4 x 3 = 12');

  for (let i = 0; i < 10000; i++) {
    await wrapper.get('button').trigger('click');
  }

  expect(wrapper.text()).toContain('4 x 10003 = 40012');
});
