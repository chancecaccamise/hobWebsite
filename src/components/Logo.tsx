import styles from "./Logo.module.css";

// Placeholder wordmark until the real logo is ready. To swap it in, drop the
// file in public/ and render it here with next/image.
export function Logo() {
  return (
    <div className={styles.logo} aria-label="House of Butts" role="img">
      <span className={styles.monogram} aria-hidden="true">
        HB
      </span>
      <span className={styles.wordmark} aria-hidden="true">
        House <em>of</em> Butts
      </span>
    </div>
  );
}
