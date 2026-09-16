"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./testimonials-section.module.css";

type Testimonial = {
  name: string;
  role: string;
  project: string;
  image: string;
  imageAlt: string;
  review: string;
  logo?: string;
  logoAlt?: string;
  initials?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sanjay Nemani",
    role: "Client Experience",
    project: "Office Furniture Project",
    image: "/images/testimonial/testimonial1.png",
    imageAlt: "Destino Furniture office project",
    logo: "/images/testimonial/clientimage1.png",
    logoAlt: "Sanjay Nemani company logo",
    review:
      "We recently purchased furniture for our new ad agency office from Destino Furniture, and the entire experience was excellent. Mr. Pradeep Garu guided us throughout the process and gave valuable suggestions that perfectly suited our office requirements. After exploring multiple options in Hyderabad and other cities, we finally found Destino Furniture in Vizag and Kakinada, and we are so glad we did. They provided high-quality furniture at a very reasonable price, with great service and timely delivery. Thank you, Pradeep Garu and the Destino Furniture team, for making our new office setup smooth and successful.",
  },
  {
    name: "Anand Potti",
    role: "Client Experience",
    project: "Outlet Transformation",
    image: "/images/testimonial/testimonial2.png",
    imageAlt: "Destino Furniture outlet project",
    initials: "AP",
    review:
      "Destino Furniture changed my outlet look completely. It enhanced the look. I am very much impressed with Pradeep about his suggestion and outstanding delivery commitments.",
  },
  {
    name: "Swarna Kanth",
    role: "Higher IT",
    project: "Higher IT Workspace",
    image: "/images/testimonial/testimonial3.png",
    imageAlt: "Higher IT office furnished by Destino Furniture Studio",
    logo: "/images/testimonial/clientimage3.png",
    logoAlt: "Higher IT logo",
    review:
      "We at Higher IT are extremely happy with the furniture provided by Destino Furniture Studio. The office setup looks very modern, professional, and visually appealing. The quality of the furniture is excellent, with great finishing and durability. Every piece perfectly matches our workspace needs and enhances the overall environment. Their design sense and attention to detail truly stand out. We highly recommend Destino Furniture Studio for anyone looking for stylish and high-quality office furniture. Great work and thank you for making our office look amazing.",
  },
  {
    name: "N.S Developers",
    role: "Client Experience",
    project: "Showroom Experience",
    image: "/images/pages/about/hero-office-lounge.jpeg",
    imageAlt: "Destino Furniture Studio showroom lounge and office display",
    initials: "NS",
    review:
      "I recently visited Destino Furniture Studio, and I must say it was an excellent experience. The showroom is beautifully maintained, showcasing a wide range of stylish and comfortable furniture pieces. The quality of the products is top-notch, with attention to detail evident in every design. The staff were extremely courteous and knowledgeable, helping me choose the perfect pieces for my home without any pressure. They also provided useful tips about maintenance and styling, which I really appreciated. Overall, Destino Furniture Studio offers a great combination of quality, design, and customer service, making it a highly recommended place for anyone looking to elevate their home decor.",
  },
  {
    name: "Absolin",
    role: "Client Experience",
    project: "Office Chair Upgrade",
    image: "/images/products/chairs/ergonomic/img1.png",
    imageAlt: "Ergonomic back chair supplied by Destino Furniture Studio",
    logo: "/images/testimonial/absolin-logo.svg",
    logoAlt: "Absolin logo",
    review:
      "The experience with Destino Furniture Studio, particularly with Manikanta Pradeep, was wonderful. They were the closest vendor I have ever dealt with. Manikanta Pradeep intently listened to all our requirements and expertly provided suggestions on cost-saving measures. With Destino Furniture Studio, we have been able to furnish our office comprehensively. On our 10th anniversary, Destino Furniture Studio helped us replace all our 50+ chairs with the amazing Back Chairs, which tremendously increased productivity in our company.",
  },
];

export function TestimonialsSection() {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  return (
    <section className={styles.testimonials}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Client Experiences</div>
            <h2 className={styles.title}>
              Spaces We Furnished.
              <br />
              <span>Stories They Shared.</span>
            </h2>
          </div>

          <p className={styles.headerCopy}>
            Thoughtfully designed furniture. Professionally delivered spaces.
            Discover genuine experiences from clients who chose{" "}
            <strong>Destino Furniture Studio.</strong>
          </p>
        </header>

        <div
          aria-label="Client testimonials carousel"
          className={styles.row}
          tabIndex={0}
        >
          {testimonials.map((testimonial) => {
            const canExpand = testimonial.name !== "Anand Potti";
            const isExpanded = expandedReview === testimonial.name;

            return (
              <article className={styles.card} key={testimonial.name}>
                <div className={styles.imageWrap}>
                  <Image
                    alt={testimonial.imageAlt}
                    className={styles.projectImage}
                    height={600}
                    sizes="(min-width: 1024px) 33vw, 88vw"
                    src={testimonial.image}
                    width={900}
                  />
                  <div className={styles.projectBadge}>
                    {testimonial.project}
                  </div>
                </div>

                <div className={styles.body}>
                  <div className={styles.ratingRow}>
                    <div aria-label="5 star rating" className={styles.stars}>
                      {"\u2605\u2605\u2605\u2605\u2605"}
                    </div>
                    <div className={styles.ratingLabel}>Verified Review</div>
                  </div>

                  <blockquote
                    className={
                      !canExpand || isExpanded
                        ? styles.review
                        : styles.collapsedReview
                    }
                  >
                    {testimonial.review}
                  </blockquote>

                  {canExpand ? (
                    <button
                      className={styles.seeMore}
                      onClick={() =>
                        setExpandedReview(isExpanded ? null : testimonial.name)
                      }
                      type="button"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  ) : null}

                  <div className={styles.client}>
                    {testimonial.logo ? (
                      <div className={styles.clientLogo}>
                        <Image
                          alt={testimonial.logoAlt ?? testimonial.name}
                          className={styles.logoImage}
                          height={116}
                          src={testimonial.logo}
                          width={116}
                        />
                      </div>
                    ) : (
                      <div className={styles.clientMonogram}>
                        {testimonial.initials}
                      </div>
                    )}

                    <div className={styles.clientInfo}>
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.role}</p>
                    </div>

                    <div className={styles.google}>
                      <span className={styles.googleDot} />
                      Google
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
