import { Link } from "react-router-dom";

const ContactBanner = ({ title, text, icon, image }) => {
  return (
    <section className="relative overflow-hidden mt-8 rounded-3xl bg-linear-to-r from-peach via-blush to-sunny px-5 md:px-10 py-5 flex items-center gap-4 md:gap-8">
      {icon && (
        <i className={`fa-regular ${icon} text-4xl md:text-5xl text-plum`}></i>
      )}
      <div className="flex-1">
        <h3 className="font-baloo text-lg md:text-2xl font-bold text-plum">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-gray-700">{text}</p>
      </div>
      <Link
        to="/contact"
        className="shrink-0 inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-plum hover:bg-primary text-white text-xs md:text-sm font-bold transition-all"
      >
        Contact Us <i className="fa-solid fa-arrow-right"></i>
      </Link>
      {image && (
        <img src={image} alt="" className="hidden md:block h-20 rounded-xl" />
      )}
    </section>
  );
};

export default ContactBanner;
