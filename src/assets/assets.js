import logo from "./wones-baby-logo-reference.png";
import heroBaby from "./hero-baby-with-elephant-teether.png";
import heroProducts from "./hero-product-arrangement.png";
import heroBanner from "./hero-banner-reference.png";
import catNewborn from "./category-newborn-elephant.png";
import catFeeding from "./category-feeding-set.png";
import catBathTime from "./category-bath-time-duck.png";
import catToysPlay from "./category-toys-and-play.png";
import catOnTheGo from "./category-on-the-go-cup.png";
import teetherElephant from "./teether-elephant-blue.jpeg";
import teetherCat from "./teether-cat-pink.jpeg";
import teetherBear from "./teether-bear-black.jpeg";
import bottle1 from "./feeding-1.jpeg";
import bottle2 from "./feeding-2.jpeg";
import bottle3 from "./feeding-3.jpeg";
import bottle4 from "./feeding-4.jpeg";
import bottle6 from "./feeding-6.jpeg";
import bottle7 from "./feeding-7.jpeg";
import bottle8 from "./feeding-8.jpeg";
import bottle9 from "./feeding-9.jpeg";
import bottle10 from "./feeding-10.jpeg";
import bottle11 from "./feeding-11.jpeg";
import storyBaby from "./our-story-baby.png";
import videoThumbnail from "./story-video-thumbnail.jpg";
import blobGreen from "./blob-green.svg";
import heartOutline from "./heart-outline.svg";
import heartFill from "./heart-fill.svg";
import sparkle from "./sparkle.svg";
import questionMark from "./question-mark.svg";
import starFace from "./star-face.svg";
export const assets = {
  logo,
  heroBaby,
  heroProducts,
  heroBanner,
  blobGreen,
  heartOutline,
  heartFill,
  sparkle,
  questionMark,
  starFace,
  categories: {
    newborn: catNewborn,
    feeding: catFeeding,
    bathTime: catBathTime,
    toysPlay: catToysPlay,
    onTheGo: catOnTheGo,
  },
  products: {
    teetherElephant,
    teetherCat,
    teetherBear,
    bottle1,
    bottle2,
    bottle3,
    bottle4,
    bottle6,
    bottle7,
    bottle8,
    bottle9,
    bottle10,
    bottle11,
  },
  story: { baby: storyBaby, videoThumbnail },
};
export const features = [
  {
    icon: "fa-leaf",
    title: "100% Silicone",
    text: "BPA, PVC, Lead & Phthalate Free",
    bg: "bg-mint",
    color: "text-leaf",
  },
  {
    icon: "fa-truck-fast",
    title: "Fast Shipping",
    text: "Within 3 Business Days",
    bg: "bg-peach",
    color: "text-orange-400",
  },
  {
    icon: "fa-shield-halved",
    title: "Secure Checkout",
    text: "Multiple Payment Options",
    bg: "bg-mint",
    color: "text-leaf",
  },
  {
    icon: "fa-heart",
    title: "Loved by Parents",
    text: "High Quality & Safe for Your Baby",
    bg: "bg-blush",
    color: "text-primary",
  },
];
export const categories = [
  { name: "Newborn", image: assets.categories.newborn },
  { name: "Feeding", image: assets.categories.feeding },
  { name: "Bath Time", image: assets.categories.bathTime },
  { name: "Toys & Play", image: assets.categories.toysPlay },
  { name: "On The Go", image: assets.categories.onTheGo },
];
export const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];
export const faqTopics = [
  { name: "General", icon: "fa-house" },
  { name: "Orders", icon: "fa-box" },
  { name: "Shipping", icon: "fa-truck-fast" },
  { name: "Products", icon: "fa-tag" },
  { name: "Returns & Refunds", icon: "fa-rotate" },
  { name: "Account", icon: "fa-user" },
  { name: "Payments", icon: "fa-credit-card" },
];
// "General" shows every question. Edit these answers to match your real policies.
export const faqs = [
  {
    topic: "Products",
    q: "How do you sterilize wonesbaby products?",
    a: "Always sterilize before first use. We recommend boiling in hot water for 5 minutes or a sterilizer 2 minutes.",
  },
  {
    topic: "Products",
    q: "Are you products 100% made of silicone?",
    a: "We focus on silicone in our products because silicone is one of the safest material for baby products. Silicone is BPA, PVC, Lead and Phthalate free.",
  },
  {
    topic: "General",
    q: "Do you have a physical store?",
    a: "We dont currently have a physical store.",
  },
  {
    topic: "Account",
    q: "How do I contact customer service?",
    a: "You can contact us by emailing wonesbaby@gmail.com",
  },
  {
    topic: "Orders",
    q: "Do you offer local pick up for orders?",
    a: "We offer local pickup from our warehouses at Surulere, lagos state & Gonin-Gora, Kaduna State. Please, contact us to arrange a suitable time for pickup.",
  },
  {
    topic: "Products",
    q: "How do I know if a product is out of stock?",
    a: "If a product is no longer available online it will be marked as “Sorry currently out of stock” on the website. You will also have the option of entering your email if you would like to be notified when the item is back in stock.",
  },
  {
    topic: "Shipping",
    q: "How long after i place my order will it be shipped??",
    a: "We will endeavour to dispatch orders within 3 business days. Express post orders get priority and will be shipped the next business day.",
  },
  {
    topic: "Shipping",
    q: "Do you ship internationally?",
    a: "We're currently sending internationally to the countries which are available for us to do so; Please be aware that there may be unforeseen delays with international delivery. Any delays caused by the delivery company are outside of our control and we cannot be held responsible for any delays; however we will do our best to assist with any issues that do arise.",
  },
  {
    topic: "Returns & Refund",
    q: "My order arrived damaged or faulty. Do you process refunds?",
    a: "If there is a fault with the product please contact us at wonesbaby@gmail.com within 7 days of receiving your item, to notify us of an intended return or exchange, and we can help you with the process. We will happily replace the product (stock allowing) free of charge, or provide a full refund. All goods must arrive back to Wones in their original condition with the original labels and tags attached. Any goods that have been damaged or altered from their original condition are not eligible for return. We recommend obtaining tracking on your return parcel, and keep a copy of your receipt or proof of shipment, as we cannot process a return without physical goods or proof of delivery. We aim to process returns within 3 business days of your order arriving back to us.",
  },
];
export const promises = [
  {
    icon: "fa-shield-halved",
    color: "text-leaf",
    title: "Safe & Non-Toxic",
    text: "BPA, PVC, Lead & Phthalate Free",
  },
  {
    icon: "fa-gem",
    color: "text-primary",
    title: "Durable & Flexible",
    text: "Built for everyday use and play",
  },
  {
    icon: "fa-heart",
    color: "text-primary",
    title: "Easy to Clean",
    text: "Dishwasher safe & travel friendly",
  },
  {
    icon: "fa-face-smile",
    color: "text-orange-400",
    title: "Designed for Development",
    text: "Supports motor skills & coordination",
  },
];

export const footerLinks = {
  quick: [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
    { name: "Track Order", path: "/track" },
  ],
  care: ["Shipping & Returns", "Privacy Policy", "Terms & Conditions"],
};
