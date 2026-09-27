/**
 * Piyush Cloth Collection - Feedback App Configuration
 * Easily update the Google Review URL and suggested review comments here.
 */

// 📍 Piyush Cloth Collection Kathera - Direct Google Review Links
// Mobile direct review link (opens review modal directly on iOS & Android browsers)
const GOOGLE_REVIEW_MOBILE_URL = "https://search.google.com/local/writereview?placeid=ChIJ3zoA0iBGDTkRw4rfeKkNgPs";

// Desktop search review modal link
const GOOGLE_REVIEW_DESKTOP_URL = "https://www.google.com/search?q=piyush+cloth+collection+kathera+review#lrd=0x39094620d2003a4f:0xfb800da978df8ac3,3,,,,";

// Fallback primary URL
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ3zoA0iBGDTkRw4rfeKkNgPs";



// 🛍️ Shop Details
const SHOP_CONFIG = {
  name: "Piyush Cloth Collection",
  tagline: "Fashion & Quality Apparel",
  subtitle: "How was your shopping experience with us today?",
  googleBusinessName: "Piyush Cloth Collection on Google"
};

// 💬 Suggested Comments grouped by star rating (1 to 5)
const SUGGESTED_COMMENTS = {
  5: [
    "Excellent collection and top quality clothes! Really happy with my purchase.",
    "Amazing shopping experience! Great collection of ethnic and modern wear with very helpful staff.",
    "Loved the fabric quality and wide variety of options. Highly recommended!",
    "Best cloth shop in town! Great prices, friendly staff, and premium fashion quality."
  ],
  4: [
    "Great cloth collection and good overall shopping experience.",
    "Nice products and polite staff. Had a smooth and pleasant shopping experience.",
    "Good quality clothing and variety. Will definitely visit again!"
  ],
  3: [
    "Decent experience. Good collection of clothes, but there is room for improvement.",
    "Good variety of apparel, though waiting time at the counter could be improved.",
    "Average shopping experience. Quality is okay for the price."
  ],
  2: [
    "The shopping experience was okay, but several areas need improvement.",
    "Did not find enough variety in my preferred size.",
    "Staff assistance could have been better during busy hours."
  ],
  1: [
    "I was not satisfied with my shopping experience today.",
    "Faced issues with sizing availability and service assistance.",
    "Needs significant improvement in customer service and stock organization."
  ]
};

// Ratings threshold for Google Review redirection
const GOOGLE_REVIEW_THRESHOLD = 4;
