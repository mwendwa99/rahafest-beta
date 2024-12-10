export const products = [
  {
    id: "1",
    name: "White Raha T-shirt",
    price: "1,000",
    image: require("./assets/test-merch.png"),
  },
  {
    id: "2",
    name: "Black Raha T-shirt",
    price: "1,200",
    image: require("./assets/test-merch-2.png"),
  },
  {
    id: "3",
    name: "Black Raha Trouser",
    price: "3,000",
    image: require("./assets/test-merch-3.png"),
  },
  {
    id: "4",
    name: "Black Raha Office Pants",
    price: "2,500",
    image: require("./assets/test-merch-4.png"),
  },
  {
    id: "5",
    name: "Grey Raha Sweatpants",
    price: "1,500",
    image: require("./assets/test-merch-5.png"),
  },
  {
    id: "6",
    name: "Yellow Raha T-shirt",
    price: "1,000",
    image: require("./assets/test-merch-6.png"),
  },
];

export const clothes = [
  {
    id: 1,
    is_active: true,
    name: "Classic Denim Jacket",
    price: 45.99,
    images: [
      { id: 1, url: "https://picsum.photos/200/300" },
      { id: 2, url: "https://picsum.photos/200/300" },
    ],
    rating: 4.5,
    quantity: 20,
    merchant: "Denim Co.",
    created_at: new Date(),
    discount_rate: 10,
    is_rahaclub_vip: true,
    attribute: {
      color: [
        { id: 1, name: "Blue", image: "https://picsum.photos/200/300" },
        {
          id: 2,
          name: "Black",
          // image:
          //   "https://constantlycreateshop.com/cdn/shop/products/shady-black-denim-washed-jacket-constantly-create-shop-1.jpg?v=1683558032",
          image: null,
        },
      ],
      size: [
        { id: 1, name: "M" },
        { id: 2, name: "L" },
      ],
      material: [{ id: 1, name: "Denim" }],
    },
    category: {
      id: 1,
      name: "Jackets",
    },
  },
  {
    id: 2,
    is_active: true,
    name: "Floral Summer Dress",
    price: 29.99,
    images: [
      { id: 3, url: "https://picsum.photos/200/300" },
      { id: 4, url: "https://picsum.photos/200/300" },
    ],
    rating: 4.8,
    quantity: 15,
    merchant: "Sunshine Apparel",
    created_at: new Date(),
    discount_rate: 15,
    is_rahaclub_vip: false,
    attribute: {
      color: [
        {
          id: 3,
          name: "Yellow",
          image: "https://picsum.photos/200/300",
        },
        { id: 4, name: "Pink", image: "https://picsum.photos/200/300" },
      ],
      size: [
        { id: 3, name: "S" },
        { id: 4, name: "M" },
      ],
      material: [{ id: 2, name: "Cotton" }],
    },
    category: {
      id: 2,
      name: "Dresses",
    },
  },
  {
    id: 3,
    is_active: true,
    name: "Men's Running Shoes",
    price: 60.0,
    images: [
      { id: 5, url: "https://picsum.photos/200/300" },
      { id: 6, url: "https://picsum.photos/200/300" },
    ],
    rating: 4.6,
    quantity: 30,
    merchant: "Sportify",
    created_at: new Date(),
    discount_rate: 20,
    is_rahaclub_vip: true,
    attribute: {
      color: [
        { id: 5, name: "Red", image: "https://picsum.photos/200/300" },
        { id: 6, name: "Gray", image: "https://picsum.photos/200/300" },
      ],
      size: [
        { id: 5, name: "9" },
        { id: 6, name: "10" },
      ],
      material: [
        { id: 3, name: "Mesh" },
        { id: 4, name: "Rubber" },
      ],
    },
    category: {
      id: 3,
      name: "Footwear",
    },
  },
];
