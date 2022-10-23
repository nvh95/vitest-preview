<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ count: number }>();

const times = ref(2);
const result = computed(() => props.count * times.value);

defineExpose(props);
</script>

<template>
  <div class="count-text">{{ count }} x {{ times }} = {{ result }}</div>
  <button class="counter" @click="times += 1">+1</button>
</template>

<style>
.count-text {
  font-size: 2rem;
  font-weight: bold;
}
.counter {
  padding: 16px;
}
</style>
