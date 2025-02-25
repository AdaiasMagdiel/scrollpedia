const categories = [
	"Movies",
	"TV Series",
	"Anime",
	"Books",
	"Literary Genres",
	"Toys",
	"Music",
	"Video Games",
	"Sports",
	"Travel",
	"Food",
	"Cooking",
	"Fitness",
	"Fashion",
	"Technology",
	"Science",
	"History",
	"Art",
	"Photography",
	"DIY Projects",
	"Gardening",
	"Pets",
	"Animals",
	"Nature",
	"Space Exploration",
	"Astrology",
	"Psychology",
	"Philosophy",
	"Languages",
	"Education",
	"Business",
	"Finance",
	"Investing",
	"Cryptocurrency",
	"Entrepreneurship",
	"Marketing",
	"Design",
	"Architecture",
	"Interior Design",
	"Cars",
	"Motorcycles",
	"Aviation",
	"Boats",
	"Hiking",
	"Camping",
	"Fishing",
	"Skiing",
	"Snowboarding",
	"Surfing",
	"Swimming",
	"Dancing",
	"Theater",
	"Comedy",
	"Documentaries",
	"Podcasts",
	"Streaming Services",
	"Social Media",
	"Cybersecurity",
	"Programming",
	"Web Development",
	"Mobile Apps",
	"Robotics",
	"AI and Machine Learning",
	"Virtual Reality",
	"Augmented Reality",
	"Board Games",
	"Card Games",
	"Puzzles",
	"Magic Tricks",
	"Collectibles",
	"Antiques",
	"Vintage Items",
	"Comic Books",
	"Manga",
	"Graphic Novels",
	"Superheroes",
	"Fantasy",
	"Sci-Fi",
	"Horror",
	"Mystery",
	"Thriller",
	"Romance",
	"Poetry",
	"Biographies",
	"Self-Help",
	"Health",
	"Meditation",
	"Yoga",
	"Mindfulness",
	"Parenting",
	"Relationships",
	"Weddings",
	"Parties",
	"Events",
	"Holidays",
	"Cultural Festivals",
	"Mythology",
	"Religion",
	"Spirituality",
	"Conspiracy Theories",
	"True Crime",
	"Politics",
	"Environment",
	"Sustainability",
	"Climate Change",
	"Renewable Energy",
	"Volunteering",
	"Charity",
	"Community Service",
	"Crafts",
	"Painting",
	"Drawing",
	"Sculpture",
	"Calligraphy",
	"Tattoos",
	"Beauty",
	"Makeup",
	"Haircare",
	"Skincare",
	"Jewelry",
	"Watches",
	"Luxury Goods",
	"Shopping",
	"Online Shopping",
	"E-commerce",
];

export function getCategory() {
	return categories[Math.floor(Math.random() * categories.length)];
}

export function getCategoryEncoded() {
	const category = getCategory();
	return encodeURIComponent(category);
}
