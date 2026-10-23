import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Countdown } from "@/components/Countdown";
import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/SignupForm";
import { SocialLinks } from "@/components/SocialLinks";
import hero from "@/assets/hero.jpg";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.background} aria-hidden="true">
        <Image
          src={hero}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </div>

      <main className={styles.main}>
        <Logo />

        <div className={styles.hero}>
          <p className={styles.eyebrow}>{siteConfig.eyebrow}</p>
          <h1 className={styles.headline}>
            <span className={styles.serif}>{siteConfig.headline.serif}</span>
            <span className={styles.sans}>
              {siteConfig.headline.sans}
              <svg
                className={styles.swash}
                viewBox="0 0 300 16"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M4 11 C 60 4, 140 3, 200 6 S 280 10, 296 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className={styles.subtext}>{siteConfig.subtext}</p>
        </div>

        <Countdown launchDate={siteConfig.launchDate} />
        <SignupForm />
        <SocialLinks />
      </main>
    </>
  );
}
