<template>
	<section class="feed flex flex-col">
		<Post v-for="post in posts" :key="post.id" :post="post"></Post>
	</section>
</template>

<script setup>
import { reactive, onMounted, inject, watch } from "vue";
import Post from "./Post.vue";

const posts = reactive([]);
const state = inject('langState');

async function fetchFeed(lang) {
	const fallbackLang = "en";
	let formattedDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

	function getPreviousDate(dateString) {
		const date = new Date(dateString);
		date.setDate(date.getDate() - 1);
		return date.toISOString().split("T")[0].replace(/-/g, "/");
	}

	async function tryFetch(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error("Erro na resposta do servidor");
			const data = await response.json();
			if (!data || !data.mostread) throw new Error("Dados inválidos ou ausentes");
			return data;
		} catch (error) {
			return null;
		}
	}

	let url = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/featured/${formattedDate}`;
	let data = await tryFetch(url);

	if (!data) {
		formattedDate = getPreviousDate(formattedDate);
		url = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/featured/${formattedDate}`;
		data = await tryFetch(url);
	}

	if (!data) {
		url = `https://api.wikimedia.org/feed/v1/wikipedia/${fallbackLang}/featured/${formattedDate}`;
		data = await tryFetch(url);
	}

	return data || { error: "Não foi possível obter os dados" };
}

async function populate(lang) {
	const data = await fetchFeed(lang);
	data.mostread.articles.forEach((res) => {
		if (res?.originalimage?.source) {
			posts.push({
				id: res.tid,
				image: res.originalimage.source,
				title: res.titles.normalized,
				content:
					res.extract.length > 150
						? `${res.extract.slice(0, 150)}...`
						: res.extract,
			});
		}
	});
}


watch(() => state.currentLang, (newLang) => {
	posts.length = 0;
	populate(newLang);
}, { immediate: true });

onMounted(async () => {
	populate(state.currentLang);
});

</script>
