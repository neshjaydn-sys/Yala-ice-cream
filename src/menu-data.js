// Authentic brand photography used only for general YOLO imagery.
export const YOLO_PRODUCT_IMAGE =
  "https://pub-5bcc3edf34304d04b59dc91e1ad9d2fd.r2.dev/kenya.tortoisepath.com/uploads/2024/04/13133608/Yolo-Ice-Cream-Nairobi-Kenya-TortoisePathcom-2-jpeg.webp";

export const YOLO_INTERIOR_IMAGE =
  "https://nairobieats.co.ke/yolo04_11603537048629923755_hua65463613f75fd2b4667c1a7a05e5faa_144825_1600x1600_fit_q50_box.jpg";

// The supplied menu identifies prices for ten items. No exact product photos
// or product descriptions were verified. Each card carries a representative
// stock photograph (free-to-use Pexels licence) matched to the item's mood —
// it illustrates the category, never the exact YOLO creation, so
// `exactProductImage` stays false and the interface says "representative".
const menuItem = (name, category, slug, price = null) => ({
  name,
  category,
  price,
  image: `/assets/images/menu/${slug}.jpg`,
  imageType: "representative",
  exactProductImage: false,
  verifiedPrice: price !== null
});

export const menuItems = [
  menuItem("Sugar Lips", "Premiums", "sugar-lips", "KES 1,490"),
  menuItem("Hot Shot", "Premiums", "hot-shot", "KES 1,490"),
  menuItem("Rocket Fuel", "Premiums", "rocket-fuel", "KES 1,490"),
  menuItem("Muscle Man", "Premiums", "muscle-man", "KES 1,490"),
  menuItem("Almost Paradise", "Premiums", "almost-paradise", "KES 1,490"),
  menuItem("Hubba Bubba", "Premiums", "hubba-bubba", "KES 1,490"),
  menuItem("Tazan", "Premiums", "tazan", "KES 1,490"),
  menuItem("Therapy", "Other favourites", "therapy", "KES 590"),
  menuItem("Minty", "Other favourites", "minty", "KES 530"),
  menuItem("Tobby on a Boat", "Other favourites", "tobby-boat", "KES 1,020"),
  menuItem("Frozen Feast", "Other favourites", "frozen-feast", "KES 800"),
  menuItem("Familiar Stranger", "Other favourites", "familiar-stranger"),
  menuItem("Time Keeper", "Other favourites", "time-keeper"),
  menuItem("My Ex", "Other favourites", "my-ex")
];
