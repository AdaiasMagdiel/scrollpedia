<template>
	<section class="feed flex flex-col">
		<Post v-for="post in posts" :key="post.id" :post="post"></Post>
	</section>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, inject, watch } from "vue";
import Post from "./Post.vue";
import { fetchRandom, fetchPopular } from "@/utils/api";
import LSKeys from "@/utils/localStorageKeys";

const posts = reactive([]);
const state = inject('langState');
const defaultTotal = 10;
let loading = false

function handleScroll() {
	if (
		window.innerHeight + window.scrollY >=
		document.body.offsetHeight - window.innerHeight * 3 && !loading
	) {
		loading = true;
		populate(fetchRandom, state.currentLang, defaultTotal);
	}
}

async function populate(action, lang, total) {
	const data = await action(lang, total);
	data.forEach(res => {
		if (res.image !== null && res.lang === state.currentLang)
			posts.push(res);
	})
	loading = false;
}

watch(() => state.currentLang, (newLang) => {
	posts.length = 0;
	populate(fetchRandom, newLang, defaultTotal);
}, { immediate: true });

onMounted(async () => {
	window.addEventListener("scroll", handleScroll);

	const info = localStorage.getItem(LSKeys.feedInfo) || "";
	let fetchFunction = fetchPopular;
	const today = new Date();

	if (info.length > 0) {
		const infoDate = new Date(info);
		if (!isNaN(infoDate.getTime()) &&
			infoDate.getDate() === today.getDate() &&
			infoDate.getMonth() === today.getMonth() &&
			infoDate.getFullYear() === today.getFullYear()) {
			fetchFunction = fetchRandom;
		}
	}

	populate(fetchFunction, state.currentLang, defaultTotal);

	localStorage.setItem(LSKeys.feedInfo, today.toISOString());
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

</script>
