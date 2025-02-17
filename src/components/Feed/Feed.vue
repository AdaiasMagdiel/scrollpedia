<template>
	<section class="feed flex flex-col">
		<Post v-for="post in posts" :key="post.id" :post="post"></Post>
	</section>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import Post from "./Post.vue";

async function fetchFeed(lang) {
	const fallbackLang = "en";

	const formattedDate = new Date()
		.toISOString()
		.split("T")[0]
		.replace(/-/g, "/");

	let url = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/featured/${formattedDate}`;
	let response = await fetch(url);
	let data = await response.json();

	if (!data || !data.mostread) {
		url = `https://api.wikimedia.org/feed/v1/wikipedia/${fallbackLang}/featured/${formattedDate}`;
		response = await fetch(url);
		data = await response.json();
	}

	return data;
}

const posts = reactive([]);

onMounted(async () => {
	const data = await fetchFeed("pt");
	console.log(data);

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
});

</script>
