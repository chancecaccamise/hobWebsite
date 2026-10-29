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

  contact: {
    eyebrow: "Before we open",
    heading: "Pull up a chair",
    text: "Got a question, an idea, or just can't wait to say hello? Leave us a note and we'll get back to you personally.",
    button: "Send note",
  },

  // Override with NEXT_PUBLIC_LAUNCH_DATE in .env.local. Include a timezone offset.
  launchDate: process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2027-01-01T00:00:00-05:00",

  // Time zone for dates shown in the admin dashboard.
  timeZone: "America/New_York",

  // Links with an empty href are hidden.
  social: {
    instagram: "https://www.instagram.com/hausofbutts/",
    tiktok: "https://www.tiktok.com/@hausofbutts",
    facebook: "",
  },
};

export type SocialNetwork = keyof typeof siteConfig.social;
