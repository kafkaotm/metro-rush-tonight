<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="mx-auto min-h-screen w-full max-w-[440px] bg-[#eef7fd]">
    <AppHeader />
    <main class="px-[18px] py-[18px]">
      <RouterView />
    </main>
  </div>
</template>
