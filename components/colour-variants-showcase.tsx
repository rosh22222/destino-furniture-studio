"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";

import { cn } from "@/lib/utils";

import styles from "./colour-variants-showcase.module.css";

type Variant = {
  alt: string;
  color: string;
  image: string;
  name: string;
  rgb: string;
};

type AccentStyle = CSSProperties & {
  "--accent-rgb": string;
};

const chairVariants: Variant[] = [
  { name: "Ivory", color: "#eee5ce", rgb: "238,229,206", image: "/images/varients/varient1.png", alt: "Ivory chair" },
  { name: "Slate Grey", color: "#536171", rgb: "83,97,113", image: "/images/varients/varient2.png", alt: "Slate grey chair" },
  { name: "Tan", color: "#bd684a", rgb: "189,104,74", image: "/images/varients/varient3.png", alt: "Tan chair" },
  { name: "Orange", color: "#df4e13", rgb: "223,78,19", image: "/images/varients/varient4.png", alt: "Orange chair" },
  { name: "Plum", color: "#583257", rgb: "88,50,87", image: "/images/varients/varient5.png", alt: "Plum chair" },
  { name: "Royal Blue", color: "#17438b", rgb: "23,67,139", image: "/images/varients/varient6.png", alt: "Royal blue chair" },
  { name: "Navy", color: "#172f4b", rgb: "23,47,75", image: "/images/varients/varient7.png", alt: "Navy chair" },
  { name: "Lavender", color: "#aa93be", rgb: "170,147,190", image: "/images/varients/varient8.png", alt: "Lavender chair" },
  { name: "Graphite", color: "#55575a", rgb: "85,87,90", image: "/images/varients/varient9.png", alt: "Graphite chair" },
  { name: "Teal", color: "#245f61", rgb: "36,95,97", image: "/images/varients/varient10.png", alt: "Teal chair" },
  { name: "Brown", color: "#684b3e", rgb: "104,75,62", image: "/images/varients/varient11.png", alt: "Brown chair" },
  { name: "Deep Blue", color: "#123862", rgb: "18,56,98", image: "/images/varients/varient12.png", alt: "Deep blue chair" },
  { name: "Burgundy", color: "#6e2637", rgb: "110,38,55", image: "/images/varients/varient13.png", alt: "Burgundy chair" },
];

const sofaVariants: Variant[] = [
  { name: "Taupe", color: "#aa9b91", rgb: "170,155,145", image: "/images/varients/sofav1.png", alt: "Taupe sofa" },
  { name: "Emerald", color: "#0f5d42", rgb: "15,93,66", image: "/images/varients/sofav2.png", alt: "Emerald sofa" },
  { name: "Blush Pink", color: "#d59198", rgb: "213,145,152", image: "/images/varients/sofav3.png", alt: "Blush pink sofa" },
  { name: "Powder Blue", color: "#9fb5c9", rgb: "159,181,201", image: "/images/varients/sofav4.png", alt: "Powder blue sofa" },
  { name: "Burgundy", color: "#6d2831", rgb: "109,40,49", image: "/images/varients/sofav5.png", alt: "Burgundy sofa" },
  { name: "Lavender", color: "#9d78b7", rgb: "157,120,183", image: "/images/varients/sofav6.png", alt: "Lavender sofa" },
  { name: "Coffee Brown", color: "#4b3025", rgb: "75,48,37", image: "/images/varients/sofav7.png", alt: "Coffee brown sofa" },
  { name: "Charcoal", color: "#404247", rgb: "64,66,71", image: "/images/varients/sofav8.png", alt: "Charcoal sofa" },
  { name: "Olive", color: "#62633f", rgb: "98,99,63", image: "/images/varients/sofav9.png", alt: "Olive sofa" },
  { name: "Navy", color: "#142d50", rgb: "20,45,80", image: "/images/varients/sofav10.png", alt: "Navy sofa" },
  { name: "Mustard", color: "#d6971e", rgb: "214,151,30", image: "/images/varients/sofav11.png", alt: "Mustard sofa" },
  { name: "Deep Teal", color: "#17485a", rgb: "23,72,90", image: "/images/varients/sofav12.png", alt: "Deep teal sofa" },
  { name: "Terracotta", color: "#c85843", rgb: "200,88,67", image: "/images/varients/sofav13.png", alt: "Terracotta sofa" },
];

function SwatchButton({
  active,
  onClick,
  variant,
}: {
  active: boolean;
  onClick: () => void;
  variant: Variant;
}) {
  return (
    <button
      aria-label={variant.name}
      aria-pressed={active}
      className={cn(styles.swatch, active && styles.activeSwatch)}
      onClick={onClick}
      type="button"
    >
      <span style={{ background: variant.color }} />
    </button>
  );
}

export function ColourVariantsShowcase() {
  const [chairIndex, setChairIndex] = useState(0);
  const [sofaIndex, setSofaIndex] = useState(0);
  const [showAllChairs, setShowAllChairs] = useState(false);
  const [showAllSofas, setShowAllSofas] = useState(false);
  const activeChair = chairVariants[chairIndex];
  const activeSofa = sofaVariants[sofaIndex];

  return (
    <section className={styles.showcase} id="colour-variants">
      <div className={styles.shell}>
        <section
          aria-labelledby="chair-colour-title"
          className={styles.chairLayout}
          style={{ "--accent-rgb": activeChair.rgb } as AccentStyle}
        >
          <div className={styles.chairVisual}>
            <div className={styles.chairFrame}>
              {chairVariants.map((variant, index) => (
                <Image
                  alt={variant.alt}
                  className={cn(
                    styles.productImage,
                    index === chairIndex && styles.activeChairImage,
                  )}
                  fill
                  key={variant.name}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 560px, 94vw"
                  src={variant.image}
                  unoptimized
                />
              ))}
            </div>
            <div
              aria-label="Chair colour options"
              className={cn(styles.swatches, styles.chairSwatches)}
            >
              {(showAllChairs ? chairVariants : chairVariants.slice(0, 5)).map(
                (variant, index) => (
                  <SwatchButton
                    active={index === chairIndex}
                    key={variant.name}
                    onClick={() => setChairIndex(index)}
                    variant={variant}
                  />
                ),
              )}
              <button
                className={styles.moreButton}
                onClick={() => setShowAllChairs((value) => !value)}
                type="button"
              >
                {showAllChairs ? "Show Less" : "More +8"}
              </button>
            </div>
          </div>

          <div className={styles.variantPanel}>
            <div className={cn(styles.kicker, styles.chairKicker)}>
              Custom Chair Collection
            </div>
            <div className={styles.matterCard}>
              <h2 className={styles.matterHeading} id="chair-colour-title">
                Designed Your Way.
                <br />
                <span className={styles.highlight}>
                  Finished in Your Shade.
                </span>
              </h2>
              <p className={cn(styles.matterText, styles.chairDescription)}>
                Personalise your seating with a wide selection of premium colour
                shades. Choose the chair design you love and customise it in
                multiple colours to perfectly match your workspace, interiors,
                or brand aesthetic.
              </p>
              <div className={styles.chairSignature}>
                One Design. Multiple Shades. Crafted to Your Choice.
              </div>
            </div>
          </div>
        </section>

        <div aria-hidden="true" className={styles.divider} />

        <section
          aria-labelledby="sofa-colour-title"
          className={styles.sofaLayout}
          style={{ "--accent-rgb": activeSofa.rgb } as AccentStyle}
        >
          <div className={styles.sofaContent}>
            <div className={cn(styles.kicker, styles.chairKicker)}>
              Custom Sofa Collection
            </div>
            <h2 className={styles.matterHeading} id="sofa-colour-title">
              Designed Your Way.
              <br />
              <span className={styles.highlight}>Finished in Your Shade.</span>
            </h2>

            <p className={cn(styles.sofaLead, styles.sofaDescription)}>
              Create a sofa that reflects your space and style. From elegant
              colours and rich fabrics to refined finishes and custom
              configurations, every detail can be tailored to your preference.
            </p>

            <div className={styles.sofaSignature}>
              Designed for Your Space. Styled for Your Lifestyle.
            </div>

            <div className={styles.sofaColourArea}>
              <div aria-label="Sofa colour options" className={styles.swatches}>
                {(showAllSofas ? sofaVariants : sofaVariants.slice(0, 5)).map(
                  (variant, index) => (
                    <SwatchButton
                      active={index === sofaIndex}
                      key={variant.name}
                      onClick={() => setSofaIndex(index)}
                      variant={variant}
                    />
                  ),
                )}
                <button
                  className={styles.moreButton}
                  onClick={() => setShowAllSofas((value) => !value)}
                  type="button"
                >
                  {showAllSofas ? "Show Less" : "More +8"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.sofaVisual}>
            <div className={styles.sofaStage}>
              {sofaVariants.map((variant, index) => (
                <Image
                  alt={variant.alt}
                  className={cn(
                    styles.productImage,
                    index === sofaIndex && styles.activeSofaImage,
                  )}
                  fill
                  key={variant.name}
                  sizes="(min-width: 1024px) 560px, 94vw"
                  src={variant.image}
                  unoptimized
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
