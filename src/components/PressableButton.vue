<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'card' | 'row' | 'pill'
  }>(),
  {
    type: 'button',
    variant: 'card',
  },
)

// From the design handoff: "card" is the line-selection grid tile, "row" is
// the station-list row, "pill" is a small inline action (back button,
// favorite toggle). Same press feel, different shadow/radius/padding/size/
// hover recipe per variant.
const variantClasses = {
  card: 'w-full text-left rounded-[20px] p-[16px_14px_15px] shadow-[0_3px_0_rgba(16,40,55,.12),0_8px_18px_rgba(16,40,55,.07),inset_0_1px_0_#fff] duration-[130ms] hover:bg-[#f1f2f3] active:translate-y-[3px] active:bg-[#e4e5e6] active:shadow-[inset_0_3px_7px_rgba(16,40,55,.18)]',
  row: 'w-full text-left rounded-[15px] p-[13px_14px] shadow-[0_2px_0_rgba(16,40,55,.1),inset_0_1px_0_#fff] duration-[120ms] hover:bg-[#f1f2f3] active:translate-y-[2px] active:bg-[#e4e5e6] active:shadow-[inset_0_2px_6px_rgba(16,40,55,.18)]',
  pill: 'inline-flex items-center rounded-[12px] p-[8px_13px] shadow-[0_2px_0_rgba(16,40,55,.1)] duration-[120ms] hover:bg-[#f0f0f0] active:translate-y-[2px] active:shadow-[inset_0_2px_5px_rgba(16,40,55,.16)]',
}
</script>

<template>
  <button
    :type="type"
    :class="[
      'cursor-pointer bg-white transition-[transform,background-color,box-shadow] [transition-timing-function:ease]',
      variantClasses[variant],
    ]"
  >
    <slot />
  </button>
</template>
