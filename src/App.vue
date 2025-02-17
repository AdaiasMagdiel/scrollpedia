<script setup>
import { reactive, provide } from 'vue';
import Feed from "./components/Feed";
import Lang from "./components/Lang.vue";

const state = reactive({
  currentLang: 'en',
});

const setLang = (lang) => {
  state.currentLang = lang;
};

provide('langState', state);
provide('setLang', setLang);
</script>

<template>
  <Lang></Lang>
  <Feed></Feed>
</template>
