<template>
	<section class="feed flex flex-col">
		<Post v-for="post in posts" :key="post.id" :post="post"></Post>
	</section>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, inject, watch } from "vue";
import Post from "./Post.vue";
import { fetchRandom } from "@/utils/api";

const posts = reactive([]);
const state = inject('langState');
let loading = false

function handleScroll() {
	if (
		window.innerHeight + window.scrollY >=
		document.body.offsetHeight - window.innerHeight * 3 && !loading
	) {
		loading = true;
		populate(state.currentLang);
	}
}

async function populate(lang) {
	const data = await fetchRandom(lang, 10);
	data.forEach(res => {
		if (res.image !== null && res.lang === state.currentLang)
			posts.push(res);
	})
	loading = false;
}

watch(() => state.currentLang, (newLang) => {
	posts.length = 0;
	populate(newLang);
}, { immediate: true });

onMounted(async () => {
	populate(state.currentLang);
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

</script>
