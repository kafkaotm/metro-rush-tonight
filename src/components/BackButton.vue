<script setup lang="ts">
import PressableButton from './PressableButton.vue'

defineProps<{
  label: string
}>()
</script>

<template>
  <PressableButton variant="pill">
    <span class="text-[12.5px] font-extrabold text-[#4f7182]">← {{ label }}</span>
  </PressableButton>
</template>
