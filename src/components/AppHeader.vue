<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { lang, setLang } = useLanguage()
</script>

<template>
  <header
    class="rounded-b-[26px] bg-[#22b0f5] p-[62px_20px_12px] text-white shadow-[0_6px_18px_rgba(34,176,245,.28)]"
  >
    <div class="flex items-center justify-between gap-[10px]">
      <div>
        <div class="text-[19px] font-black tracking-[-.3px]">
          Metro Rush Tonight
        </div>
        <div class="text-[12.5px] font-medium opacity-90">
          趕捷運
        </div>
      </div>
      <div class="flex gap-[4px]">
        <button
          type="button"
          data-testid="lang-zh"
          class="rounded-[9px] p-[4px_9px] text-[10.5px] font-black tracking-[.3px] transition-transform duration-[120ms] active:translate-y-[2px]"
          :style="{
            backgroundColor: lang === 'zh' ? '#fff' : 'rgba(255,255,255,.2)',
            color: lang === 'zh' ? '#0f89c9' : '#fff',
          }"
          @click="setLang('zh')"
        >
          中
        </button>
        <button
          type="button"
          data-testid="lang-en"
          class="rounded-[9px] p-[4px_9px] text-[10.5px] font-black tracking-[.3px] transition-transform duration-[120ms] active:translate-y-[2px]"
          :style="{
            backgroundColor: lang === 'en' ? '#fff' : 'rgba(255,255,255,.2)',
            color: lang === 'en' ? '#0f89c9' : '#fff',
          }"
          @click="setLang('en')"
        >
          EN
        </button>
      </div>
    </div>
  </header>
</template>
