const fs = require('fs');
let text = fs.readFileSync('components/colour-variants-showcase.tsx', 'utf8');

text = text.replace(
  `            <div className={styles.sofaSignature}>\n              Designed for Your Space. Styled for Your Lifestyle.\n            </div>\n                      key={variant.name}`,
  `            <div className={styles.sofaSignature}>
              Designed for Your Space. Styled for Your Lifestyle.
            </div>

            <div className={styles.sofaColourArea}>
              <div aria-label="Sofa colour options" className={styles.swatches}>
                {(showAllSofas ? sofaVariants : sofaVariants.slice(0, 5)).map(
                  (variant, index) => (
                    <SwatchButton
                      active={index === sofaIndex}
                      key={variant.name}`
);

fs.writeFileSync('components/colour-variants-showcase.tsx', text);
