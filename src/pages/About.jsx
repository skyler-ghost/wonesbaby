import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { assets, promises } from "../assets/assets";

const About = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 pb-10">
      <PageHero
        crumb="About Us"
        title="Our Story"
        accent="At Wones Baby"
        text="Born from love, made for little ones."
        image={assets.heroBaby}
      />

      {/* Our Beginning */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Left: Image */}
        <div className="relative">
          <img
            src={assets.heroProducts}
            alt="Wones Baby products"
            className="w-full h-56 md:h-[260px] object-cover rounded-3xl"
          />
        </div>

        {/* Right: Content */}
        <div className="py-2">
          <span className="text-xs font-semibold uppercase tracking-[3px] text-plum/70">
            Our Story
          </span>

          <h2 className="font-baloo text-2xl md:text-3xl font-bold text-plum mt-1">
            Our Beginning
          </h2>

          <div className="w-12 h-1 bg-[#FF7A94] rounded-full mt-2 mb-4"></div>

          <div className="space-y-3 text-sm md:text-[14px] leading-relaxed text-gray-600">
            <p>
              Wones Baby started in 2022 during my pregnancy with my first
              child, Fay. What began as a personal journey quickly grew into a
              mission — to create safe, beautiful and practical baby products
              that parents can trust and children will love.
            </p>

            <p>
              Wones Baby is committed to providing{" "}
              <b>100% food-grade silicone</b>, non-toxic and free of phthalates,
              BPA, lead, and cadmium baby products.
            </p>

            <p>
              Designed with convenience and sustainability in mind, every
              product is dishwasher and microwave-safe, easy to wipe clean after
              messy meals, and durable enough to survive being knocked over,
              thrown, or dropped. All our products are long-lasting and
              eco-friendly, so you can be confident that your family has only
              the best.
            </p>

            <p>
              Wones Baby truly understands a mother's love, and we take all
              appropriate actions to measure up to that special love.
            </p>

            <p>
              Thank you for choosing this brand and including us on your little
              one's journey. Your friend in the school of Motherhood,
            </p>
          </div>

          <p className="mt-4 font-baloo font-bold text-plum text-base">
            'Wonu ❤️
          </p>
        </div>
      </section>

      {/* Our Promise */}
      <section className="relative overflow-hidden mt-8 rounded-3xl bg-linear-to-r from-mint to-[#d9ecb4] p-5 md:p-8">
        <h2 className="font-baloo text-xl md:text-2xl font-bold text-plum">
          Our Promise
        </h2>
        <p className="text-xs md:text-sm text-gray-700">
          At Wones Baby, we are committed to:
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 lg:w-[75%]">
          {promises.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-white/80 p-3 text-center"
            >
              <i className={`fa-solid ${p.icon} text-2xl ${p.color}`}></i>
              <p className="text-xs md:text-sm font-bold text-gray-800 mt-2 leading-tight">
                {p.title}
              </p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                {p.text}
              </p>
            </div>
          ))}
        </div>
        <img
          src={assets.story.baby}
          alt=""
          className="hidden lg:block absolute right-0 bottom-0 h-full w-[28%] object-cover mask-l-from-60%"
        />
      </section>

      {/* Healthier, Happier Childhood */}
      <section className="relative overflow-hidden mt-8 rounded-3xl bg-linear-to-r from-blush to-peach p-5 md:p-8">
        <div className="md:w-[60%]">
          <h2 className="font-baloo text-xl md:text-2xl font-bold text-plum">
            A Healthier, Happier Childhood
          </h2>
          <p className="text-xs md:text-sm text-gray-700 mt-1">
            We're more than just products — we're a part of your parenting
            journey. Thank you for choosing Wones Baby.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-bold transition-all"
          >
            Shop Our Products <i className="fa-solid fa-arrow-right"></i>
          </Link>
    </div>
        <img
          src={assets.products.teetherCat}
          alt=""
          className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 h-36 rounded-2xl"
        />
      </section>
    </div>
  );
};

export default About;
