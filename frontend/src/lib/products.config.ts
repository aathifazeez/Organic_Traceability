// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change product names, descriptions,
//  ingredients, prices, and images for the 4 Luna Botanica
//  products.  Each product has a unique `slug` that becomes
//  its URL: /products/<slug>
// ─────────────────────────────────────────────────────────────

export interface StaticProduct {
    slug: string;           // URL: /products/<slug>
    name: string;           // Product display name
    category: string;
    price: number;          // LKR
    badge: string;
    image: string;          // path inside /public
    shortDescription: string;
    longDescription: string;
    keyFeatures: string[];
    ingredients: { name: string; note?: string }[];
    batchNumber: string;
    unitsRemaining: number;
}

const PRODUCTS: StaticProduct[] = [
    // ── 1. COFFEE SCRUB ──────────────────────────────────────
    {
        slug: "coffee-scrub",
        name: "Luna Botanica Coffee Scrub for Face",
        category: "Exfoliators",
        price: 2500,
        badge: "Popular",
        image: "/images/product-coffee-scrub.png",
        shortDescription:
            "A luxurious organic coffee face scrub that gently exfoliates dead skin cells, boosts circulation, and leaves your skin radiant and smooth.",
        longDescription:
            "Our Luna Botanica Coffee Scrub for Face is crafted with pure Coffea Arabica seed powder blended with cold-pressed coconut, olive, and jojoba oils. Enriched with nourishing Shea Butter and Vitamin E, this gentle yet effective scrub buffs away dead skin, reduces puffiness, and unveils a bright, energised complexion. Suitable for all skin types. Free from parabens, SLS, and artificial fragrance.",
        keyFeatures: [
            "Gently exfoliates & removes dead skin cells",
            "Boosts blood circulation for a healthy glow",
            "Deeply nourishing with Shea Butter & Vitamin E",
            "100% natural & organic ingredients",
            "Paraben-free, SLS-free, cruelty-free",
        ],
        ingredients: [
            { name: "Coffea Arabica Seed Powder" },
            { name: "Sucrose" },
            { name: "Cocos Nucifera Oil", note: "Coconut Oil" },
            { name: "Olea Europaea Fruit Oil", note: "Olive Oil" },
            { name: "Simmondsia Chinensis Seed Oil", note: "Jojoba Oil" },
            { name: "Butyrospermum Parkii Butter", note: "Shea Butter" },
            { name: "Tocopherol", note: "Vitamin E" },
        ],
        batchNumber: "LB-CS-2024-001",
        unitsRemaining: 50,
    },

    // ── 2. NIACINAMIDE SERUM ─────────────────────────────────
    {
        slug: "niacinamide-serum",
        name: "Luna Botanica Glimmer 10% Niacinamide Serum",
        category: "Serums",
        price: 3500,
        badge: "Best Seller",
        image: "/images/product-serum.png",
        shortDescription:
            "A powerful yet gentle 10% Niacinamide serum that minimises pores, fades dark spots, and delivers an instant luminous glow.",
        longDescription:
            "The Glimmer Niacinamide Serum by Luna Botanica combines a clinical 10% Niacinamide (Vitamin B3) concentration with Hyaluronic Acid and Pro-Vitamin B5 to deliver deep hydration, even out skin tone, and visibly reduce enlarged pores. Aloe Barbadensis Leaf Juice soothes redness while Xanthan Gum gives the formula its smooth, lightweight texture. Dermatologically tested. Suitable for all skin types including sensitive skin.",
        keyFeatures: [
            "10% Niacinamide — minimises pores & evens skin tone",
            "Sodium Hyaluronate for intense 72-hour hydration",
            "Soothes redness and inflammation",
            "Lightweight water-gel texture, absorbs instantly",
            "Suitable for sensitive skin",
        ],
        ingredients: [
            { name: "Aqua" },
            { name: "Aloe Barbadensis Leaf Juice" },
            { name: "Niacinamide", note: "Vitamin B3 (10%)" },
            { name: "Glycerin", note: "Vegetable Glycerin" },
            { name: "Sodium Hyaluronate", note: "Hyaluronic Acid" },
            { name: "Panthenol", note: "Pro-Vitamin B5" },
            { name: "Xanthan Gum", note: "Natural Gum Thickener" },
            { name: "Sodium Benzoate", note: "Preservative System Component" },
            { name: "Citric Acid", note: "pH Adjuster" },
        ],
        batchNumber: "LB-NS-2024-001",
        unitsRemaining: 80,
    },

    // ── 3. LAVENDER BERRY SOAP ───────────────────────────────
    {
        slug: "lavender-berry-soap",
        name: "Luna Botanica Lavender Berry Glow Soap",
        category: "Cleansers",
        price: 2000,
        badge: "Top Rated",
        image: "/images/product-soap.png",
        shortDescription:
            "A handcrafted cold-process soap infused with calming lavender and antioxidant-rich berry powder for a gentle, glowing cleanse.",
        longDescription:
            "Our Lavender Berry Glow Soap is a handmade cold-process bar crafted from saponified olive oil, coconut oil, and shea butter — a classic triple-butter base that cleanses without stripping your skin's natural moisture. Infused with soothing lavender powder and antioxidant-rich berry powder, this bar gently exfoliates, brightens, and relaxes. Finished with purifying Kaolin clay that draws out impurities without over-drying. Vegan. Palm-oil free.",
        keyFeatures: [
            "Cold-process handmade soap",
            "Triple-butter base — gentle & moisturising",
            "Lavender for calm & soothing cleanse",
            "Berry powder for antioxidant brightening",
            "Kaolin clay to draw out impurities",
        ],
        ingredients: [
            { name: "Saponified Olive Oil" },
            { name: "Saponified Coconut Oil" },
            { name: "Saponified Shea Butter" },
            { name: "Aqua" },
            { name: "Lavender Powder" },
            { name: "Berry Powder" },
            { name: "Kaolin", note: "Clay" },
        ],
        batchNumber: "LB-LS-2024-001",
        unitsRemaining: 120,
    },

    // ── 4. VIVID GLOW FACE CREAM ─────────────────────────────
    {
        slug: "vivid-glow-face-cream",
        name: "Luna Botanica Vivid Glow Face Cream",
        category: "Moisturizers",
        price: 3000,
        badge: "New",
        image: "/images/product-face-cream.png",
        shortDescription:
            "A rich daily moisturiser loaded with Aloe Vera, Rosehip Oil, and Vitamin E to plump, brighten, and protect your skin all day.",
        longDescription:
            "The Vivid Glow Face Cream is Luna Botanica's signature everyday moisturiser. Its velvety formula blends Aloe Vera Juice and Vegetable Glycerin for lasting hydration with Jojoba and Rosehip oils that target fine lines and uneven tone. Glyceryl Stearate creates a silky emulsion while Tocopherol (Vitamin E) shields against free-radical damage. Free from mineral oil, synthetic fragrances, and parabens. Suitable for normal to dry skin.",
        keyFeatures: [
            "Deep 24-hour moisturisation with Aloe Vera & Glycerin",
            "Rosehip Oil — brightens & reduces fine lines",
            "Jojoba Oil — balances skin's natural oil production",
            "Vitamin E antioxidant protection",
            "Free from mineral oil & synthetic fragrance",
        ],
        ingredients: [
            { name: "Aqua" },
            { name: "Aloe Vera Juice" },
            { name: "Glycerin", note: "Vegetable Glycerin" },
            { name: "Glyceryl Stearate", note: "Emulsifier" },
            { name: "Shea Butter" },
            { name: "Jojoba Oil" },
            { name: "Rosehip Oil" },
            { name: "Tocopherol", note: "Vitamin E" },
            { name: "Sodium Benzoate", note: "Preservative System Component" },
        ],
        batchNumber: "LB-VG-2024-001",
        unitsRemaining: 65,
    },
];

export default PRODUCTS;

// Helper: find by slug
export const getProductBySlug = (slug: string): StaticProduct | undefined =>
    PRODUCTS.find((p) => p.slug === slug);

// Helper: check if an id is a static slug (not a MongoDB ObjectId)
export const isStaticSlug = (id: string): boolean =>
    PRODUCTS.some((p) => p.slug === id);
