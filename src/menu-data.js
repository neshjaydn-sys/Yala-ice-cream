// src/menu-data.js
// YOLO Ice Cream menu data.
// Product images are representative unless verified as exact product photos.
// Keep unverified prices as null rather than inventing prices.

export const YOLO_PRODUCT_IMAGE =
  "https://pub-5bcc3edf34304d04b59dc91e1ad9d2fd.r2.dev/kenya.tortoisepath.com/uploads/2024/04/13133608/Yolo-Ice-Cream-Nairobi-Kenya-TortoisePathcom-2-jpeg.webp";

export const YOLO_INTERIOR_IMAGE =
  "https://nairobieats.co.ke/yolo04_11603537048629923755_hua65463613f75fd2b4667c1a7a05e5faa_144825_1600x1600_fit_q50_box.jpg";

/**
 * Creates a consistent menu item object.
 *
 * Image files should be stored in:
 * public/assets/images/menu/
 *
 * Example:
 * public/assets/images/menu/therapy.jpg
 *
 * Prices below are retained from the existing project data.
 * Verify them with YOLO before presenting them as current prices.
 */
const menuItem = (
  name,
  category,
  slug,
  price = null,
  description = ""
) => ({
  id: slug,
  name,
  category,
  price,
  description,
  image: `/assets/images/menu/${slug}.jpg`,
  imageType: "representative",
  exactProductImage: false,
  verifiedPrice: false
});

export const menuItems = [
  // Premiums
  menuItem(
    "Sugar Lips",
    "Premiums",
    "sugar-lips",
    "KES 1,490"
  ),
  menuItem(
    "Hot Shot",
    "Premiums",
    "hot-shot",
    "KES 1,490"
  ),
  menuItem(
    "Rocket Fuel",
    "Premiums",
    "rocket-fuel",
    "KES 1,490"
  ),
  menuItem(
    "Muscle Man",
    "Premiums",
    "muscle-man",
    "KES 1,490"
  ),
  menuItem(
    "Almost Paradise",
    "Premiums",
    "almost-paradise",
    "KES 1,490"
  ),
  menuItem(
    "Hubba Bubba",
    "Premiums",
    "hubba-bubba",
    "KES 1,490"
  ),
  menuItem(
    "Tazan",
    "Premiums",
    "tazan",
    "KES 1,490"
  ),

  // Other favourites
  menuItem(
    "Therapy",
    "Other favourites",
    "therapy",
    "KES 590"
  ),
  menuItem(
    "Minty",
    "Other favourites",
    "minty",
    "KES 530"
  ),
  menuItem(
    "Tobby on a Boat",
    "Other favourites",
    "tobby-boat",
    "KES 1,020"
  ),
  menuItem(
    "Frozen Feast",
    "Other favourites",
    "frozen-feast",
    "KES 800"
  ),
  menuItem(
    "Familiar Stranger",
    "Other favourites",
    "familiar-stranger"
  ),
  menuItem(
    "Time Keeper",
    "Other favourites",
    "time-keeper"
  ),
  menuItem(
    "My Ex",
    "Other favourites",
    "my-ex"
  )
];

// Reusable category list for menu filters.
export const menuCategories = [
  "All",
  ...new Set(menuItems.map((item) => item.category))
];

// Look up a menu item by its ID.
export const getMenuItemById = (id) =>
  menuItems.find((item) => item.id === id) ?? null;

// Return menu items for a selected category.
export const getMenuItemsByCategory = (category = "All") =>
  category === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === category);