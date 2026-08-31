<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    class="w-full cursor-pointer rounded-[20px] bg-white p-[16px_14px_15px] text-left shadow-[0_3px_0_rgba(16,40,55,.12),0_8px_18px_rgba(16,40,55,.07),inset_0_1px_0_#fff] transition-[transform,background-color,box-shadow] duration-[130ms] [transition-timing-function:ease] hover:bg-[#f1f2f3] active:translate-y-[3px] active:bg-[#e4e5e6] active:shadow-[inset_0_3px_7px_rgba(16,40,55,.18)]"
  >
    <slot />
  </button>
</template>
