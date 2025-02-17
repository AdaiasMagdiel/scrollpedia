<template>
	<section class="feed flex flex-col">
		<Post v-for="post in posts" :key="post.id" :post="post"></Post>
	</section>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, inject, watch } from "vue";
import Post from "./Post.vue";
import { fetchRandom, fetchPopular, fetchCategory } from "@/utils/api";
import { getCategoryEncoded } from "@/utils/categories"
import LSKeys from "@/utils/localStorageKeys";

const posts = reactive([]);
const state = inject('langState');
const initialTotal = 5;
const defaultTotal = 10;
let loading = false

watch(() => state.currentLang, (newLang) => {
	posts.length = 0;
	populate(fetchRandom, newLang, defaultTotal);
}, { immediate: true });

async function populate(action, lang, total) {
	const data = await action(lang, total);
	data.forEach(res => {
		if (res.image !== null && res.lang === state.currentLang)
			posts.push(res);
	})
	loading = false;
}

function handleScroll() {
	if (
		window.innerHeight + window.scrollY >=
		document.body.offsetHeight - window.innerHeight * 3 &&
		!loading
	) {
		loading = true;
		populate(fetchRandom, state.currentLang, defaultTotal);
	}
}

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

	populate(fetchFunction, state.currentLang, initialTotal);
	localStorage.setItem(LSKeys.feedInfo, today.toISOString());

	const categories = Array.from({ length: 5 }).map(() => getCategoryEncoded());
	console.log(categories);

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	const articles = [];

	try {
		const allArticles = await Promise.all(
			categories.map(async (category) => {
				const res = await fetchCategory(state.currentLang, defaultTotal, category);
				return res;
			})
		);

		articles.push(...allArticles.flat());
		shuffleArray(articles);
		articles.forEach((article) => posts.push(article));
	} catch (error) {
		console.error("Unable to load articles:", error);
	}
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

</script>
