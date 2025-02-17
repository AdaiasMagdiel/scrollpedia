export async function fetchPopular(lang, total) {
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
			if (!response.ok) throw new Error("Unable to fetch.");
			const data = await response.json();
			if (!data || !data.mostread) throw new Error("Missing or invalid data.");
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

	if (!data) {
		return { error: "Unable to fetch wikipedia data." };
	}

	const articles = data.mostread.articles.map((res) => {
		return {
			id: res.tid,
			title: res.titles.normalized,
			image: res?.originalimage?.source || res?.thumbnail?.source || null,
			content:
				res.extract.length > 150
					? `${res.extract.slice(0, 150)}...`
					: res.extract,
			url: res.content_urls.desktop.page,
			lang: res.lang || "en",
		};
	});
}

export async function fetchRandom(lang = "en", limit = 10) {
	const randomUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=${limit}&format=json&origin=*`;
	const randomResponse = await fetch(randomUrl);
	const randomData = await randomResponse.json();
	const randomTitles = randomData.query.random.map((article) => article.title);

	const articles = await Promise.all(
		randomTitles.map(async (title) => {
			const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
			const summaryResponse = await fetch(summaryUrl);
			const data = await summaryResponse.json();

			return {
				id: data.wikibase_item || data.tid,
				title: data.title,
				image: data.originalimage?.source || data?.thumbnail?.source || null,
				content:
					data.extract.length > 150
						? `${data.extract.slice(0, 150)}...`
						: data.extract,
				url: data.content_urls.desktop.page,
				lang: data.lang || "en",
			};
		}),
	);

	return articles;
}
