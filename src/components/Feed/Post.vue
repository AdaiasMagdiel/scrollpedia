<template>
	<div class="feed__post w-full h-screen relative cursor-pointer">
		<img :src="post.image" :alt="post.title" class="w-full h-full object-cover absolute" />

		<div class="absolute inset-x-0 bottom-0 p-4 pb-8 post-gradient">
			<h1 class="text-white font-bold text-m lg:text-xl mb-1">{{ post.title }}</h1>
			<p class="text-white text-xs lg:text-m">{{ post.content }}</p>
		</div>
	</div>
</template>

<script setup>
defineProps({
	post: {
		type: Object,
		required: true,
	},
});
</script>
