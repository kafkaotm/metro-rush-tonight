<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'card' | 'row'
  }>(),
  {
    type: 'button',
    variant: 'card',
  },
)

// From the design handoff: "card" is the line-selection grid tile,
// "row" is the station-list row. Same press feel, different shadow/
// radius/padding/travel-distance recipe per variant.
const variantClasses = {
  card: 'rounded-[20px] p-[16px_14px_15px] shadow-[0_3px_0_rgba(16,40,55,.12),0_8px_18px_rgba(16,40,55,.07),inset_0_1px_0_#fff] duration-[130ms] active:translate-y-[3px] active:shadow-[inset_0_3px_7px_rgba(16,40,55,.18)]',
  row: 'rounded-[15px] p-[13px_14px] shadow-[0_2px_0_rgba(16,40,55,.1),inset_0_1px_0_#fff] duration-[120ms] active:translate-y-[2px] active:shadow-[inset_0_2px_6px_rgba(16,40,55,.18)]',
}
</script>

<template>
  <button
    :type="type"
    :class="[
      'w-full cursor-pointer bg-white text-left transition-[transform,background-color,box-shadow] [transition-timing-function:ease] hover:bg-[#f1f2f3] active:bg-[#e4e5e6]',
      variantClasses[variant],
    ]"
  >
    <slot />
  </button>
</template>
