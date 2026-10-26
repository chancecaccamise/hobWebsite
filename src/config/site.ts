export const siteConfig = {
  name: "House of Butts",
  eyebrow: "Launching Soon",

  // Placeholder copy — swap in final messaging when it's ready.
  headline: {
    serif: "Take a seat,",
    sans: "stay a while",
  },
  subtext:
    "Something special is on its way. Sign up and be the first to know when we open our doors.",
  description:
    "House of Butts is launching soon. Sign up to be the first to know when we open our doors.",

  // Override with NEXT_PUBLIC_LAUNCH_DATE in .env.local. Include a timezone offset.
  launchDate: process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2027-01-01T00:00:00-05:00",

  // Links with an empty href are hidden.
  social: {
    instagram: "https://www.instagram.com/hausofbutts/",
    tiktok: "https://www.tiktok.com/@hausofbutts",
    facebook: "",
  },
};

export type SocialNetwork = keyof typeof siteConfig.social;
