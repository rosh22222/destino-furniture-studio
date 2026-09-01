import Image from "next/image";
import { Briefcase, PenTool, GraduationCap, Home, Utensils, LayoutDashboard, Layers, ShieldCheck, Tag, UserCheck, MapPin, Target } from "lucide-react";
import { LogoCloud } from "@/components/logo-cloud";
import { getBrands } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "The Destino Story",
  description:
    "Learn about Destino Furniture Studio, a unit of Manidivya Enterprises, serving furniture buyers in Visakhapatnam, Kakinada and Bengaluru.",
  path: "/about",
  image: "/images/about/about1.png",
});

export default async function AboutPage() {
  const brands = await getBrands();

  return (
    <main className="min-h-screen bg-[#FFF9F5] pb-24 pt-12 md:pt-20">
      {/* Top Section */}
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C56545]">
          Our Journey
        </span>
        <h1 className="mt-4 flex flex-col items-center justify-center gap-1 text-4xl text-[#1E3A8A] sm:gap-2 sm:text-5xl lg:text-6xl">
          <span className="font-extrabold uppercase tracking-tight">The Destino</span>
          <span className="font-light italic text-[#4F4B4A]">Story.</span>
        </h1>

        <div className="relative mt-12 h-[300px] w-full overflow-hidden rounded-[2rem] sm:h-[400px] lg:h-[500px]">
          <Image
            src="/images/about/about1.png"
            alt="Destino Furniture Studio"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mx-auto mt-16 max-w-4xl space-y-6 text-justify text-[15px] font-medium leading-relaxed text-[#4F4B4A] sm:text-base">
          <p>
            <strong className="font-bold text-[#202238]">Destino Furniture Studio</strong>, a unit of{" "}
            <strong className="font-bold text-[#202238]">Manidivya Enterprises</strong>, is established in two
            of Andhra Pradesh’s prominent smart cities —{" "}
            <strong className="font-bold text-[#202238]">Kakinada and Visakhapatnam</strong>. We are supported
            by manufacturing partners across some of India’s leading cities, including{" "}
            <strong className="font-bold text-[#202238]">Bangalore, Mumbai, Delhi</strong>, and other major
            locations.
          </p>
          <p>
            Destino Furniture Studio is a well-recognized furniture destination, associated with multiple
            reputed multinational <strong className="font-bold text-[#202238]">home and office furniture brands</strong>{" "}
            in India. With a strong presence in the furniture industry for nearly{" "}
            <strong className="font-bold text-[#202238]">9 years</strong>, we have successfully supplied
            furniture solutions to several leading multinational companies throughout our journey.
          </p>
          <p>
            We believe in working with companies that operate{" "}
            <strong className="font-bold text-[#202238]">state-of-the-art manufacturing facilities in India</strong>,
            rather than simply trading imported products. This enables us to offer products that reflect
            superior craftsmanship, reliable quality, thoughtful design, and dependable manufacturing
            standards.
          </p>
          <p>
            We sincerely request the opportunity to showcase our strengths and demonstrate the quality,
            design, and capabilities of our product range. We look forward to building lasting relationships
            through dependable products, professional service, and a commitment to excellence.
          </p>
        </div>
      </div>

      {/* Mission/Vision Section */}
      <div className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative w-full overflow-hidden rounded-[2.5rem]">
            <Image
              src="/images/about/about2.png"
              alt="Our Vision and Mission"
              width={1000}
              height={1000}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A] sm:text-3xl">Our Vision</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#4F4B4A] sm:text-base">
                To be the preferred office furniture destination in Visakhapatnam, Kakinada, and beyond.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A] sm:text-3xl">Our Mission</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#4F4B4A] sm:text-base">
                Furnishing large-scale office spaces with exceptional quality, refined style, and lasting value.
              </p>
            </div>

            <div className="space-y-6 border-t border-[#F5F1EA] pt-8">
              <div>
                <h3 className="text-sm font-bold text-[#1E3A8A] sm:text-[15px]">Quality</h3>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#4F4B4A] sm:text-sm">
                  We use only the finest materials and time-tested craftsmanship techniques.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E3A8A] sm:text-[15px]">Sustainability</h3>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#4F4B4A] sm:text-sm">
                  Our commitment to environmental responsibility guides every decision we make.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E3A8A] sm:text-[15px]">Innovation</h3>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#4F4B4A] sm:text-sm">
                  We continuously explore new designs and manufacturing technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C56545]">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#1E3A8A] sm:text-4xl">
            Our Services
          </h2>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-[#C56545]" />
        </div>
        
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {[
            {
              title: "Office Furniture",
              description: "Ergonomic and stylish office furniture designed for productivity and comfort.",
              icon: Briefcase,
            },
            {
              title: "Customized Furniture",
              description: "Tailor-made furniture solutions to match your unique style and space needs.",
              icon: PenTool,
            },
            {
              title: "Institutional Furniture",
              description: "Durable and functional furniture for schools, colleges, and institutions.",
              icon: GraduationCap,
            },
            {
              title: "Domestic Furniture",
              description: "Elegant and sturdy home furniture to enhance your living spaces.",
              icon: Home,
            },
            {
              title: "Restaurant Furniture",
              description: "Trendy and durable furniture that complements your restaurant’s ambiance.",
              icon: Utensils,
            },
            {
              title: "Office Space Management",
              description: "Efficient space planning and furniture solutions for a well-optimized workspace.",
              icon: LayoutDashboard,
            }
          ].map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.title}
                className="group relative border-l-[3px] border-gray-200 pl-8 py-2 transition-colors duration-500 hover:border-[#C56545]"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-[#1E3A8A] transition-all duration-500 group-hover:bg-[#C56545] group-hover:text-white group-hover:shadow-md">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-[#202238] transition-colors duration-300 group-hover:text-[#C56545]">
                  {service.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#625f5a]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands We Deal With */}
      <div className="mt-32 w-full border-t border-[#F5F1EA] bg-[#FCFBF8] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C56545]">
            Partnerships
          </p>
          <h2 className="mt-3 text-2xl font-bold text-[#1E3A8A] sm:text-3xl">
            Brands We Deal With
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-12 sm:gap-24">
            {brands.map((brand) => (
              <div key={brand.slug} className="flex items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={160}
                    height={60}
                    className="max-h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#202238]">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-[#FBF8F3] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#1E3A8A] sm:text-4xl">
              Why Choose Destino
            </h2>
            <div className="mx-auto mt-6 h-0.5 w-16 bg-[#C56545]" />
          </div>
          
          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Diverse Selection",
                description: "From modern minimalist designs to classic, timeless pieces, we have furniture to suit every taste and office space.",
                icon: Layers,
              },
              {
                title: "Quality & Durability",
                description: "We are committed to providing furniture crafted with high-quality materials and built to last.",
                icon: ShieldCheck,
              },
              {
                title: "Affordable Prices",
                description: "We believe everyone deserves comfortable and stylish office furniture without breaking the bank, offering competitive prices and promotional offers.",
                icon: Tag,
              },
              {
                title: "Expert Guidance",
                description: "Our knowledgeable staff is here to help you find the perfect pieces to enhance your living spaces.",
                icon: UserCheck,
              },
              {
                title: "Convenient Location",
                description: "Situated in the heart of Visakhapatnam, Kakinada.",
                icon: MapPin,
              },
              {
                title: "Our Focus",
                description: "We aim to be your trusted source for furniture, providing a positive and enjoyable shopping experience.",
                icon: Target,
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C56545] shadow-sm border border-[#E6DDD1]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3A8A]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#625f5a]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
