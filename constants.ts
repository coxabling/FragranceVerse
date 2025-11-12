import { Perfume, ScentFamily } from './types';

export const featuredPerfumes: Perfume[] = [
  // Floral
  {
    name: 'No. 5',
    brand: 'Chanel',
    description: 'The iconic, timeless floral-aldehyde fragrance, a symbol of elegant femininity. A complex bouquet built around May rose and jasmine.',
    topNotes: ['Aldehydes', 'Ylang-Ylang', 'Neroli', 'Bergamot'],
    middleNotes: ['Iris', 'Jasmine', 'Rose', 'Lily-of-the-Valley'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Amber', 'Musk'],
    family: 'Floral',
    longevity: 4,
    sillage: 4,
    likes: 489,
    dislikes: 52,
    isVerified: true,
    amazonSearchTerm: 'Chanel No 5 Eau de Parfum',
    affiliate: { provider: 'amazon', tag: 'chanelbeauty-21' },
    reviews: [
        { author: 'ClassicGal', rating: 5, comment: 'An absolute masterpiece. It makes me feel so elegant and timeless. Not for everyone, but iconic for a reason.', date: '2023-10-15' },
        { author: 'ScentExplorer', rating: 4, comment: 'The aldehydes are very strong at first, but the dry down is a beautiful powdery floral. A must-try for any collector.', date: '2023-09-22' },
    ]
  },
  {
    name: "J'adore",
    brand: 'Dior',
    description: 'A grand floral fragrance that balances sensuous curves and vibrant fruit notes. It celebrates the essence of ylang-ylang and Damascus rose.',
    topNotes: ['Ylang-Ylang', 'Pear', 'Melon', 'Peach'],
    middleNotes: ['Jasmine', 'Damascus Rose', 'Tuberose', 'Freesia'],
    baseNotes: ['Musk', 'Vanilla', 'Cedar', 'Blackberry'],
    family: 'Floral',
    longevity: 5,
    sillage: 4,
    likes: 832,
    dislikes: 31,
    isVerified: true,
    amazonSearchTerm: 'Dior J\'adore Eau de Parfum',
    affiliate: { provider: 'amazon', tag: 'diorfragrance-21' },
    reviews: [
        { author: 'LilyPetals', rating: 5, comment: 'This is my signature scent! It\'s so feminine, classy, and versatile. I get compliments every time I wear it.', date: '2023-11-01' },
    ],
    clones: [
        { brand: 'Zara', name: 'Wonder Rose' },
        { brand: 'Maison Alhambra', name: 'Jardin De Paris' },
    ]
  },
  // Oriental
  {
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    description: 'An addictive gourmand floral with a shot of adrenaline-rich coffee. It is a vibrant, sensual and addictive contrast of light and dark.',
    topNotes: ['Pink Pepper', 'Orange Blossom', 'Pear'],
    middleNotes: ['Coffee', 'Jasmine', 'Almond', 'Licorice'],
    baseNotes: ['Vanilla', 'Patchouli', 'Cedar', 'Cashmere Wood'],
    family: 'Oriental',
    longevity: 5,
    sillage: 5,
    likes: 1205,
    dislikes: 88,
    isVerified: false,
    amazonSearchTerm: 'Yves Saint Laurent Black Opium',
    reviews: [
        { author: 'NightOwl', rating: 5, comment: 'The coffee and vanilla combination is intoxicating. Perfect for a night out. It\'s sexy, dark, and sweet all at once.', date: '2023-10-28' },
        { author: 'GourmandLover', rating: 4, comment: 'Very sweet but the coffee note gives it a nice edge. Lasts forever on my skin.', date: '2023-09-10' },
    ],
    clones: [
        { brand: 'Lovali', name: 'Black Addiction' },
    ]
  },
  {
    name: 'Shalimar',
    brand: 'Guerlain',
    description: 'A legendary fragrance with a sensual, spellbinding amber and vanilla trail. Inspired by the passionate love story between an emperor and an Indian princess.',
    topNotes: ['Bergamot', 'Lemon', 'Mandarin Orange'],
    middleNotes: ['Iris', 'Jasmine', 'Rose', 'Patchouli'],
    baseNotes: ['Vanilla', 'Tonka Bean', 'Incense', 'Sandalwood'],
    family: 'Oriental',
    longevity: 5,
    sillage: 4,
    likes: 642,
    dislikes: 75,
    isVerified: true,
    amazonSearchTerm: 'Guerlain Shalimar Eau de Parfum',
    reviews: [
        { author: 'VintageVibes', rating: 5, comment: 'Shalimar is a legend. The smoky vanilla and citrus opening is pure magic. It feels like wearing a piece of history.', date: '2023-08-19' },
    ]
  },
  // Woody
  {
    name: 'Santal 33',
    brand: 'Le Labo',
    description: 'An iconic woody aromatic that captures the spirit of the American West. A defining image of the spirit of the American West and its personal freedom.',
    topNotes: ['Violet Accord', 'Cardamom'],
    middleNotes: ['Iris', 'Ambrox'],
    baseNotes: ['Sandalwood', 'Cedarwood', 'Leather', 'Papyrus'],
    family: 'Woody',
    longevity: 5,
    sillage: 5,
    likes: 1530,
    dislikes: 110,
    isVerified: false,
    amazonSearchTerm: 'Le Labo Santal 33',
    reviews: [
        { author: 'HikerChic', rating: 5, comment: 'Smells like a cozy, sophisticated campfire. The sandalwood and leather are incredible. It\'s unique and instantly recognizable.', date: '2023-10-05' },
    ],
    clones: [
      { brand: 'Le Monde Gourmand', name: 'Santal Supreme' },
    ]
  },
  {
    name: "Terre d'Hermès",
    brand: 'Hermès',
    description: 'A narrative of earth and sky, blending mineral flint with vibrant citrus and spices. The scent of earth, lying on your back, eyes to the heavens.',
    topNotes: ['Orange', 'Grapefruit'],
    middleNotes: ['Pepper', 'Pelargonium', 'Flint'],
    baseNotes: ['Vetiver', 'Cedar', 'Patchouli', 'Benzoin'],
    family: 'Woody',
    longevity: 4,
    sillage: 3,
    likes: 980,
    dislikes: 40,
    isVerified: true,
    amazonSearchTerm: 'Hermès Terre d\'Hermès',
    reviews: [
        { author: 'MrGentleman', rating: 5, comment: 'The perfect masculine scent. Earthy, citrusy, and incredibly classy. It is my go-to for the office and special occasions.', date: '2023-11-02' },
    ],
    clones: [
        { brand: 'Armaf', name: 'Eternia Man' },
        { brand: 'Rasasi', name: 'Fattan' },
        { brand: 'Maison Alhambra', name: 'Toro by Maison Alhambra' },
    ]
  },
  // Citrus
  {
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    description: 'A fresh, fruity-floral scent that evokes the spirit of a Sicilian summer. A tribute to the scorching sun, the sea, and the sensuality of the Mediterranean.',
    topNotes: ['Sicilian Lemon', 'Apple', 'Cedar', 'Bellflower'],
    middleNotes: ['Bamboo', 'Jasmine', 'White Rose'],
    baseNotes: ['Cedar', 'Musk', 'Amber'],
    family: 'Citrus',
    longevity: 3,
    sillage: 3,
    likes: 789,
    dislikes: 25,
    isVerified: false,
    amazonSearchTerm: 'Dolce & Gabbana Light Blue',
    reviews: [
        { author: 'SummerBreeze', rating: 4, comment: 'The ultimate summer fragrance. It\'s so fresh and clean. Doesn\'t last very long on me, but I love reapplying it throughout the day.', date: '2023-07-20' },
    ],
    clones: [
        { brand: 'La Ree Fragrances', name: 'Shades of Blue' },
        { brand: 'Lattafa', name: '24k White Gold' },
        { brand: 'Santalys', name: 'Invocation' },
    ]
  },
  {
    name: 'Colonia',
    brand: 'Acqua di Parma',
    description: 'The quintessential Italian scent, a timeless blend of Sicilian citrus and aromatic herbs. A fresh, refined, and timeless fragrance for a pragmatic and successful man.',
    topNotes: ['Lemon', 'Sweet Orange', 'Calabrian Bergamot'],
    middleNotes: ['Lavender', 'Bulgarian Rose', 'Verbena', 'Rosemary'],
    baseNotes: ['Vetiver', 'Sandalwood', 'Patchouli'],
    family: 'Citrus',
    longevity: 3,
    sillage: 2,
    likes: 550,
    dislikes: 18,
    isVerified: true,
    amazonSearchTerm: 'Acqua di Parma Colonia',
    reviews: [
        { author: 'ItalianStyle', rating: 5, comment: 'Pure class in a bottle. A beautiful, natural-smelling citrus cologne that never goes out of style.', date: '2023-06-15' },
    ]
  },
  // Fresh
  {
    name: 'Acqua di Giò',
    brand: 'Giorgio Armani',
    description: 'A scent of freedom, full of wind and water, capturing Mediterranean freshness. A perfect harmony of sweet and salty notes of sea water and nuances of sunny warmth.',
    topNotes: ['Lime', 'Lemon', 'Bergamot', 'Jasmine'],
    middleNotes: ['Sea Notes', 'Calone', 'Peach', 'Freesia'],
    baseNotes: ['White Musk', 'Cedar', 'Oakmoss', 'Patchouli'],
    family: 'Fresh',
    longevity: 4,
    sillage: 3,
    likes: 1890,
    dislikes: 65,
    isVerified: true,
    amazonSearchTerm: 'Giorgio Armani Acqua di Giò',
    reviews: [
         { author: 'OceanLover', rating: 5, comment: 'This IS the smell of the ocean. So refreshing and clean. It has been a classic for decades for a good reason.', date: '2023-08-01' },
    ],
    clones: [
      { brand: 'Perry Ellis', name: '360 Red' },
      { brand: 'Frank Olivier', name: 'Blue Touch' },
      { brand: 'Armaf', name: 'Blur Homme' },
      { brand: 'Ajmal', name: 'Shiro' },
    ]
  },
  {
    name: 'CK One',
    brand: 'Calvin Klein',
    description: 'The revolutionary first unisex fragrance, clean, modern, and universally appealing. A balance between brightness and sensuality.',
    topNotes: ['Lemon', 'Green Notes', 'Bergamot', 'Pineapple'],
    middleNotes: ['Nutmeg', 'Violet', 'Orris Root', 'Jasmine'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk', 'Cedar'],
    family: 'Fresh',
    longevity: 3,
    sillage: 2,
    likes: 995,
    dislikes: 45,
    isVerified: false,
    amazonSearchTerm: 'Calvin Klein CK One',
    reviews: [
        { author: '90sKid', rating: 4, comment: 'Takes me right back to my youth! Still a great, easy-to-wear scent for any day. It\'s just so clean and effortless.', date: '2023-09-05' },
    ]
  },
  // Spicy
  {
    name: 'Spicebomb',
    brand: 'Viktor&Rolf',
    description: 'An explosive concentrate of masculine sensuality with a mix of spices, leather, and tobacco. An instant olfactory detonation.',
    topNotes: ['Pink Pepper', 'Elemi', 'Bergamot', 'Grapefruit'],
    middleNotes: ['Cinnamon', 'Saffron', 'Paprika'],
    baseNotes: ['Tobacco', 'Leather', 'Vetiver'],
    family: 'Spicy',
    longevity: 5,
    sillage: 4,
    likes: 1340,
    dislikes: 92,
    isVerified: false,
    amazonSearchTerm: 'Viktor&Rolf Spicebomb',
    reviews: [
        { author: 'WinterWarmth', rating: 5, comment: 'The perfect winter fragrance. It\'s warm, spicy, and so cozy. The cinnamon and tobacco are incredible together.', date: '2023-11-05' },
    ],
    clones: [
      { brand: 'Remy Latour', name: 'Signature Night Armaf' },
      { brand: 'Cremo', name: 'Spice & Black Vanilla', notes: 'Inspired by Spicebomb Extreme' },
      { brand: 'Bulgari', name: 'Man in Black', notes: 'Inspired by Spicebomb Extreme' },
    ]
  },
  {
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    description: 'A lavish, warm, and iconic fragrance featuring opulent tobacco, vanilla, and spice. Reminiscent of an English Gentleman’s Club.',
    topNotes: ['Tobacco Leaf', 'Spicy Notes'],
    middleNotes: ['Vanilla', 'Cacao', 'Tonka Bean', 'Tobacco Blossom'],
    baseNotes: ['Dried Fruits', 'Woody Notes'],
    family: 'Spicy',
    longevity: 5,
    sillage: 5,
    likes: 2150,
    dislikes: 120,
    isVerified: true,
    amazonSearchTerm: 'Tom Ford Tobacco Vanille',
    reviews: [
        { author: 'LuxuryScents', rating: 5, comment: 'Pure opulence. The tobacco is rich and realistic, and the vanilla is creamy and divine. Worth every penny for its performance and quality.', date: '2023-10-20' },
    ],
    clones: [
        { brand: 'Maison Alhambra', name: 'Tobacco Touch' },
        { brand: 'Al Haramain', name: 'Amber Oud Tobacco Edition' },
    ]
  },
  {
    name: 'Attraction Potion',
    brand: 'Scent Seduction',
    description: 'A revolutionary fragrance engineered with synthetic pheromones designed to enhance your natural allure and create an irresistible magnetic aura. A subtle yet powerful statement.',
    topNotes: ['Iso E Super', 'Pink Pepper'],
    middleNotes: ['Hedione', 'Iris', 'Ambroxan'],
    baseNotes: ['White Musk', 'Cashmeran', 'Vetiver'],
    family: 'Woody',
    longevity: 5,
    sillage: 4,
    likes: 1987,
    dislikes: 155,
    isVerified: false,
    amazonSearchTerm: 'Pheromone Perfume for Attraction',
    reviews: [
        { author: 'DateNightDarling', rating: 5, comment: 'I was skeptical, but wow! I wore this out and the compliments were non-stop. It feels like it amplifies my own scent in the best way possible. Definitely a confidence booster!', date: '2023-11-10' },
        { author: 'TheAlchemist', rating: 4, comment: 'The concept is fascinating. It\'s a very clean, "your-skin-but-better" scent. Whether it\'s the pheromones or just a great composition, it\'s undeniably intriguing and gets noticed.', date: '2023-10-18' },
    ],
    clones: []
  }
];

// In a real application, this data would be dynamically determined by user activity,
// review counts, or recent sales data from a backend service. For this demo,
// we'll select a few popular items to simulate a "trending" list.
const trendingPerfumeNames = ['Black Opium', 'Santal 33', 'Acqua di Giò', 'Attraction Potion'];
export const trendingPerfumes: Perfume[] = featuredPerfumes.filter(p => trendingPerfumeNames.includes(p.name));


export const scentFamilies: ScentFamily[] = [
    {
        name: "Floral",
        description: "From single blossoms to complex bouquets, floral scents are romantic and classic.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Floral'),
        color: "bg-gradient-to-br from-rose-300 to-pink-400",
    },
    {
        name: "Oriental",
        description: "Rich and opulent, oriental fragrances feature notes like vanilla, spices, and resins.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Oriental'),
        color: "bg-gradient-to-br from-amber-400 to-orange-500",
    },
    {
        name: "Woody",
        description: "Warm and earthy, these scents are grounded in notes of cedar, sandalwood, and vetiver.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Woody'),
        color: "bg-gradient-to-br from-yellow-700 to-lime-800",
    },
    {
        name: "Citrus",
        description: "Light, zesty, and refreshing, citrus scents are perfect for vibrant, energetic moods.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Citrus'),
        color: "bg-gradient-to-br from-yellow-300 to-orange-300",
    },
    {
        name: "Fresh",
        description: "Clean and invigorating, with notes of aquatic, green, or aromatic elements.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Fresh'),
        color: "bg-gradient-to-br from-sky-300 to-cyan-400",
    },
    {
        name: "Spicy",
        description: "Warm and comforting, featuring notes like cinnamon, clove, and pepper.",
        perfumes: featuredPerfumes.filter(p => p.family === 'Spicy'),
        color: "bg-gradient-to-br from-red-500 to-orange-600",
    },
];

export const commonNotes: string[] = [
    "Vanilla", "Sandalwood", "Rose", "Jasmine", "Bergamot", "Cedarwood",
    "Patchouli", "Musk", "Amber", "Vetiver", "Lavender", "Lemon",
    "Orange Blossom", "Oud", "Tobacco", "Leather", "Iris", "Gardenia"
];

export const occasions: { name: string; id: 'everyday' | 'office' | 'night' | 'event' }[] = [
    { name: 'Everyday', id: 'everyday' },
    { name: 'Office', id: 'office' },
    { name: 'Date Night', id: 'night' },
    { name: 'Special Event', id: 'event' },
];