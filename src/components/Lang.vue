<template>
  <div class="fixed top-4 right-4 z-50">
    <button id="language-button" class="uppercase font-bold text-xs cursor-pointer transition-all duration-200" :class="{
      'text-white/60 hover:text-white/100 hover:text-sm': !show,
      'text-white/100 text-sm': show,
    }" @click="toggleShow" @keydown.enter="toggleShow" @keydown.space="toggleShow" aria-haspopup="true"
      :aria-expanded="show" :aria-label="show ? 'Close language menu' : 'Open language menu'">
      Language
    </button>
    <transition name="fade">
      <div v-if="show" class="flex flex-col gap-2 mt-2" role="menu" aria-labelledby="language-button">
        <button v-for="(item, index) in languages" :key="item.code" :ref="index === 0 ? firstLangButton : null"
          class="text-xs cursor-pointer font-bold" @click="setLang(item.code)" @keydown.enter="setLang(item.code)"
          @keydown.space="setLang(item.code)" role="menuitem" :aria-label="`Switch to ${item.label}`">
          {{ item.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue';

const lang = ref('en');
const show = ref(false);
const firstLangButton = ref(null);
const changeLangState = inject('setLang');

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'es', label: 'Spanish' },
];

const toggleShow = () => {
  show.value = !show.value;
};

const setLang = (value) => {
  lang.value = value;
  show.value = false;
};

watch(lang, (value) => {
  changeLangState(value);
  localStorage.setItem('lang', value);
});

watch(show, (isOpen) => {
  if (isOpen && firstLangButton.value) {
    nextTick(() => {
      firstLangButton.value.focus();
    });
  }
});

onMounted(() => {
  const langValue = localStorage.getItem('lang') || 'en';
  lang.value = langValue;

  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    show.value = false;
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
