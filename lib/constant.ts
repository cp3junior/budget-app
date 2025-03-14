import { SystemName } from "sweet-sfsymbols/src/SweetSFSymbols.types";

export const TAB_ICON_SIZE = 40;

export const COLLECTION_USER = "users";
export const COLLECTION_REQUESTS = "requests";
export const COLLECTION_LOCATIONS = "locations";
export const COLLECTION_PRODUCTS = "products";
export const COLLECTION_TRANSACTIONS = "transactions";
export const COLLECTION_WISHLISTS = "wishlists";
export const COLLECTION_WALLETS = "wallets";
export const COLLECTION_EXPENSES = "expenses";

export const tabsScreens = ["home", "bills", "analytics", "wishlist"];
export const withHeaderScreens = [
  "profile",
  "about",
  "categories",
  "locations",
  "products",
  "account-sharing",
  "product-details",
  "wishlist-details",
  "bills-details",
  "transactions",
  "transaction-details",
];
export const modalScreens = [
  "add-transaction",
  "profile-edit",
  "product-price",
  "wishlist-edit",
  "bills-edit",
  "transaction-filter",
];

export const transactionDirections = ["Expense", "Income"];
export const activeTabsValues = ["Active", "Completed"];

export const transactionDirectionsDropdown: DropdownItem[] = [
  {
    id: 2,
    label: "All",
    icon: "timelapse",
  },
  {
    id: 0,
    label: "Expense",
    icon: "minus.square",
  },
  {
    id: 1,
    label: "Income",
    icon: "plus.square",
  },
];

export const transactionTypes: DropdownItem[] = [
  {
    id: 1,
    label: "Credit",
    icon: "creditcard.and.123",
  },
  {
    id: 2,
    label: "Debit",
    icon: "creditcard.fill",
  },
];

export const frequencyList: DropdownItem[] = [
  {
    id: 1,
    label: "Monthly",
    icon: "calendar",
  },
  {
    id: 2,
    label: "Bi-weekly",
    icon: "2.brakesignal",
  },
  {
    id: 3,
    label: "Weekly",
    icon: "1.brakesignal",
  },
];

export const frequencyItem = {
  month: 1,
  "2weeks": 2,
  week: 3,
};

export const baseExpenses: DropdownItem = {
  id: 0,
  label: "Extra spending",
  icon: "creditcard.trianglebadge.exclamationmark",
  value: "",
};

export const dayOfWeek: DropdownItem[] = [
  {
    id: 1,
    label: "Monday",
    icon: "sun.min.fill",
  },
  {
    id: 2,
    label: "Tuesday",
    icon: "sun.min.fill",
  },
  {
    id: 3,
    label: "Wednesday",
    icon: "sun.min.fill",
  },
  {
    id: 4,
    label: "Thursday",
    icon: "sun.min.fill",
  },
  {
    id: 5,
    label: "Friday",
    icon: "sun.min.fill",
  },
  {
    id: 6,
    label: "Saturday",
    icon: "sun.min.fill",
  },
  {
    id: 0,
    label: "Sunday",
    icon: "sun.min.fill",
  },
];

export const categories: DropdownItem[] = [
  {
    id: 1,
    label: "Income",
    icon: "creditcard.fill",
    items: [
      {
        id: 11,
        label: "Salary",
        icon: "creditcard",
      },
      {
        id: 12,
        label: "Side Hustle",
        icon: "dollarsign.circle",
      },
      {
        id: 13,
        label: "Investments",
        icon: "dollarsign.arrow.circlepath",
      },
      {
        id: 14,
        label: "Bonuses",
        icon: "dollarsign",
      },
      {
        id: 15,
        label: "Tips",
        icon: "dollarsign.square",
      },
      {
        id: 16,
        label: "Gifts",
        icon: "giftcard",
      },
      {
        id: 17,
        label: "Government Assistance",
        icon: "building.columns",
      },
    ],
  },
  {
    id: 5,
    label: "Lifestyle",
    icon: "figure.2.and.child.holdinghands",
    items: [
      {
        id: 51,
        label: "Charity",
        icon: "gift",
      },
      {
        id: 52,
        label: "Day Care",
        icon: "figure.and.child.holdinghands",
      },
      {
        id: 54,
        label: "Education",
        icon: "graduationcap",
      },
      {
        id: 55,
        label: "Pet",
        icon: "pawprint",
      },
      {
        id: 56,
        label: "Shopping",
        icon: "handbag",
      },
      {
        id: 57,
        label: "Medication",
        icon: "pills",
      },
      {
        id: 58,
        label: "Fashion",
        icon: "tshirt",
      },
      {
        id: 59,
        label: "Cosmetics",
        icon: "theatermask.and.paintbrush",
      },
      {
        id: 501,
        label: "Family Help",
        icon: "figure.2.and.child.holdinghands",
      },
    ],
  },
  {
    id: 3,
    label: "Entertainment",
    icon: "gamecontroller.fill",
    items: [
      {
        id: 31,
        label: "Games",
        icon: "gamecontroller",
      },
      {
        id: 32,
        label: "Hobby",
        icon: "camera",
      },
      {
        id: 33,
        label: "Vacation",
        icon: "beach.umbrella",
      },
      {
        id: 34,
        label: "Cinema",
        icon: "popcorn",
      },
      {
        id: 35,
        label: "Music",
        icon: "music.note.list",
      },
      {
        id: 36,
        label: "Sports",
        icon: "figure.run",
      },
      {
        id: 37,
        label: "Books",
        icon: "books.vertical",
      },
      {
        id: 38,
        label: "Gym",
        icon: "dumbbell",
      },
    ],
  },
  {
    id: 2,
    label: "Food & Drinks",
    icon: "takeoutbag.and.cup.and.straw.fill",
    items: [
      {
        id: 21,
        label: "Food",
        icon: "fork.knife",
      },
      {
        id: 22,
        label: "Alcohol",
        icon: "wineglass",
      },
      {
        id: 23,
        label: "Drinks",
        icon: "waterbottle",
      },
      {
        id: 24,
        label: "Coffee",
        icon: "cup.and.saucer",
      },
      {
        id: 25,
        label: "Groceries",
        icon: "cart",
      },
      {
        id: 26,
        label: "Restaurant",
        icon: "menucard",
      },
      {
        id: 27,
        label: "Takeout",
        icon: "takeoutbag.and.cup.and.straw",
      },
    ],
  },
  {
    id: 7,
    label: "Transportation",
    icon: "car.fill",
    items: [
      {
        id: 71,
        label: "Flight",
        icon: "airplane.departure",
      },
      {
        id: 72,
        label: "Public Transport",
        icon: "bus",
      },
      {
        id: 73,
        label: "Gas",
        icon: "fuelpump",
      },
      {
        id: 74,
        label: "Parking",
        icon: "p.circle",
      },
      {
        id: 75,
        label: "Maintenance",
        icon: "bolt.car",
      },
      {
        id: 76,
        label: "Taxi",
        icon: "car.2",
      },
      {
        id: 77,
        label: "Tolls",
        icon: "road.lanes",
      },
      {
        id: 78,
        label: "Car Registration",
        icon: "gauge.open.with.lines.needle.67percent.and.arrowtriangle.and.car",
      },
    ],
  },
  {
    id: 4,
    label: "Utilities",
    icon: "bolt.fill",
    items: [
      {
        id: 41,
        label: "Electricity",
        icon: "bolt",
      },
      {
        id: 42,
        label: "Internet",
        icon: "wifi",
      },
      {
        id: 43,
        label: "Cable TV",
        icon: "tv",
      },
      {
        id: 44,
        label: "Water",
        icon: "drop",
      },
      {
        id: 45,
        label: "Telephone",
        icon: "phone",
      },
      {
        id: 46,
        label: "Heating",
        icon: "thermometer.medium",
      },
      {
        id: 47,
        label: "Garbage",
        icon: "trash",
      },
      {
        id: 48,
        label: "Security",
        icon: "shield",
      },
      {
        id: 49,
        label: "Laundry",
        icon: "washer",
      },
      {
        id: 410,
        label: "Cooking Gas",
        icon: "cooktop",
      },
    ],
  },
  {
    id: 6,
    label: "Housing",
    icon: "house.fill",
    items: [
      {
        id: 61,
        label: "Rent",
        icon: "house",
      },
      {
        id: 62,
        label: "Home Supplies",
        icon: "lightbulb",
      },
      {
        id: 63,
        label: "Home Maintenance",
        icon: "wrench.and.screwdriver",
      },
      {
        id: 64,
        label: "Furniture & Home Decor",
        icon: "table.furniture",
      },
    ],
  },
  {
    id: 12,
    label: "Health & Wellness",
    icon: "stethoscope.circle",
    items: [
      {
        id: 121,
        label: "Doctor",
        icon: "stethoscope",
      },
      {
        id: 122,
        label: "Dental Care",
        icon: "facemask",
      },
      {
        id: 123,
        label: "Vision Care",
        icon: "eyeglasses",
      },
      {
        id: 124,
        label: "Wellness",
        icon: "figure.stair.stepper",
      },
    ],
  },
  {
    id: 8,
    label: "Banking",
    icon: "building.columns.fill",
    items: [
      {
        id: 81,
        label: "Credit Card",
        icon: "creditcard.and.123",
      },
      {
        id: 82,
        label: "Bank Fees",
        icon: "banknote",
      },
      {
        id: 83,
        label: "Loan",
        icon: "building.columns.circle",
      },
      {
        id: 84,
        label: "Car Loan",
        icon: "car.circle",
      },
      {
        id: 85,
        label: "House Loan",
        icon: "house.circle",
      },
      {
        id: 86,
        label: "Student Loan",
        icon: "graduationcap.circle",
      },
    ],
  },
  {
    id: 9,
    label: "Insurance",
    icon: "shield.lefthalf.filled",
    items: [
      {
        id: 91,
        label: "Car Insurance",
        icon: "car.side.lock",
      },
      {
        id: 92,
        label: "Home Insurance",
        icon: "house.and.flag",
      },
      {
        id: 93,
        label: "Health Insurance",
        icon: "cross.case",
      },
      {
        id: 94,
        label: "Life Insurance",
        icon: "heart.text.square",
      },
      {
        id: 95,
        label: "Other Insurance",
        icon: "staroflife.shield",
      },
    ],
  },
  {
    id: 10,
    label: "Taxes",
    icon: "umbrella.percent.fill",
    items: [
      {
        id: 101,
        label: "Property Tax",
        icon: "house.lodge",
      },
      {
        id: 102,
        label: "Income Tax",
        icon: "australiandollarsign.square",
      },
      {
        id: 103,
        label: "Vehicule Tax",
        icon: "gauge.open.with.lines.needle.67percent.and.arrowtriangle.and.car",
      },
      {
        id: 104,
        label: "Other Tax",
        icon: "percent",
      },
    ],
  },
  {
    id: 11,
    label: "Others",
    icon: "tray.2.fill",
    items: [
      {
        id: 111,
        label: "Unknown",
        icon: "questionmark.circle",
      },
      {
        id: 112,
        label: "Miscellanous",
        icon: "exclamationmark.circle",
      },
    ],
  },
];

const daysOfMonth: DropdownItem[] = new Array(31).fill(0).map((_, i) => {
  const id = i + 1;
  let th = "th";

  if (id === 1 || id === 21 || id === 31) th = "st";
  if (id === 2 || id === 22) th = "nd";
  if (id === 3 || id === 23) th = "rd";

  return {
    id,
    label: `${id}${th} day of the month`,
    icon: `${id}.circle` as SystemName,
  };
});

export const dayOfMonth: DropdownItem[] = [
  ...daysOfMonth,
  {
    id: 32,
    label: "Last day of the month",
    icon: "calendar.circle",
  },
];
