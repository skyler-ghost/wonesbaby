import { useState } from 'react'
import PageHero from '../components/PageHero'
import { assets } from '../assets/assets'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet'

const EMAIL = 'wonesbaby@gmail.com'

const info = [
  {
    icon: 'fa-envelope',
    title: 'Email Us',
    lines: [EMAIL],
    note: 'We usually reply within 24 hours.',
    bg: 'bg-blush',
    iconBg: 'bg-primary/15 text-primary',
  },
  {
    icon: 'fa-phone',
    title: 'Call Us',
    lines: ['+234 901 234 5678'],
    note: 'Mon – Fri, 8am – 5pm (WAT)',
    bg: 'bg-mint',
    iconBg: 'bg-leaf/30 text-leaf',
  },
  {
    icon: 'fa-location-dot',
    title: 'Canada Pickup Location',
    lines: ['Halifax, Nova Scotia', 'Calgary, Alberta', 'Cambridge, Ontario'],
    bg: 'bg-red-50',
    iconBg: 'bg-red-200 text-[#D80621]',
  },
  {
    icon: 'fa-location-dot',
    title: 'Nigeria Pickup Location',
    lines: ['Surulere, Lagos', 'Ikorodu, Lagos'],
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-200 text-[#008751]',
  },
  {
    icon: 'fa-clock',
    title: 'Business Hours',
    lines: ['Mon – Fri: 8:00am – 5:30pm'],
    bg: 'bg-lilac',
    iconBg: 'bg-white text-plum',
  },
]

const socials = [
  'fa-instagram',
  'fa-tiktok',
  'fa-youtube',
  'fa-whatsapp',
]

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'

const pickupLocations = [
  {
    country: 'Canada',
    city: 'Halifax, Nova Scotia',
    coordinates: [44.6488, -63.5752],
  },
  {
    country: 'Canada',
    city: 'Calgary, Alberta',
    coordinates: [51.0447, -114.0719],
  },
  {
    country: 'Canada',
    city: 'Cambridge, Ontario',
    coordinates: [43.3616, -80.3144],
  },
  {
    country: 'Nigeria',
    city: 'Surulere, Lagos',
    coordinates: [6.4969, 3.3538],
  },
  {
    country: 'Nigeria',
    city: 'Ikorodu, Lagos',
    coordinates: [6.6194, 3.5105],
  },
]

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setSent(false)
  }

  // Opens the visitor's default email app; this does not send the email automatically.
  const onSubmit = (event) => {
    event.preventDefault()

    const subject = encodeURIComponent(
      form.subject || 'Message from website'
    )
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name} (${form.email})`
    )

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="px-4 pb-10 md:px-8 lg:px-16 xl:px-24">
      <PageHero
        crumb="Contact"
        title="Contact Us"
        accent="We'd love to hear from you!"
        smallAccent
        script={
          <>
            Let's stay <br />
            connected!{' '}
            <i className="fa-solid fa-heart text-xl text-primary" />
          </>
        }
        text="Have a question, need assistance, or want to share your experience? We’re here to help."
        image={assets.heroBaby}
      />

      {/* Contact information and message form */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {info.map((item) => (
            <div
              key={item.title}
              className={`flex items-center gap-4 rounded-2xl p-4 ${item.bg}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${item.iconBg}`}
              >
                <i className={`fa-solid ${item.icon}`} />
              </div>

              <div>
                <p className="font-baloo font-bold text-plum">
                  {item.title}
                </p>

                {item.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm leading-snug text-gray-800"
                  >
                    {line}
                  </p>
                ))}

                {item.note && (
                  <p className="text-xs text-gray-500">{item.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] md:p-6"
        >
          <h2 className="font-baloo text-xl font-bold text-plum md:text-2xl">
            Send Us a Message
          </h2>
          <p className="mb-4 text-xs text-gray-500 md:text-sm">
            Fill out the form below and we'll get back to you shortly.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Your Name *"
              className={inputClass}
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="Your Email *"
              className={inputClass}
            />
          </div>

          <select
            name="subject"
            value={form.subject}
            onChange={onChange}
            className={`${inputClass} mt-3`}
          >
            <option value="">Subject</option>
            <option value="Product question">Product question</option>
            <option value="Order help">Order help</option>
            <option value="Shipping & pickup">Shipping & pickup</option>
            <option value="Returns & refunds">Returns & refunds</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            required
            rows={4}
            placeholder="Your Message *"
            className={`${inputClass} mt-3 resize-none`}
          />

          <button
            type="submit"
            className="mt-4 w-full cursor-pointer rounded-full bg-primary py-3 font-bold text-white transition-all hover:bg-primary-dark"
          >
            <i className="fa-solid fa-paper-plane mr-2" />
            Send Message
          </button>

          {sent && (
            <p className="mt-3 text-center text-sm font-semibold text-leaf">
              Your email app should open with your message ready. Please send
              the email from there.
            </p>
          )}
        </form>
      </div>

      {/* One map showing all pickup locations, alongside social links */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-100">
          <MapContainer
            bounds={pickupLocations.map((location) => location.coordinates)}
            boundsOptions={{ padding: [30, 30] }}
            scrollWheelZoom={false}
            className="z-0 h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickupLocations.map((location) => (
              <CircleMarker
                key={location.city}
                center={location.coordinates}
                radius={8}
                pathOptions={{
                  color: '#ffffff',
                  weight: 2,
                  fillColor: '#FF7A94',
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-plum">
                      Wones Baby Pickup
                    </p>
                    <p className="mt-1 text-gray-600">{location.city}</p>
                    <p className="text-xs text-gray-500">
                      {location.country}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${location.city}, ${location.country}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-semibold text-primary"
                    >
                      Get Directions →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          <div className="absolute left-4 top-4 z-[1000] rounded-xl bg-white px-4 py-3 shadow">
            <p className="text-sm font-bold text-plum">
              <i className="fa-solid fa-location-dot mr-2 text-primary" />
              Wones Baby Pickup Points
            </p>
            <p className="text-xs text-gray-500">Canada & Nigeria</p>
          </div>
        </div>

        <div className="relative flex h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-linear-to-r from-blush to-peach p-5 md:p-6">
          <img
            src={assets.blobGreen}
            alt=""
            className="absolute -right-8 -top-8 w-28 opacity-70"
          />

          <h3 className="relative font-baloo text-xl font-bold text-plum md:text-2xl">
            Follow Our Journey
          </h3>
          <p className="relative mt-1 max-w-[220px] text-sm text-gray-700">
            Stay updated on new products, special offers and more!
          </p>

          <div className="relative mt-4 flex gap-3">
            {socials.map((social) => (
              <a
                key={social}
                href="#"
                aria-label={social.replace('fa-', '')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-white transition-colors hover:bg-primary"
              >
                <i className={`fa-brands ${social}`} />
              </a>
            ))}
          </div>

          <img
            src={assets.products.teetherElephant}
            alt=""
            className="absolute bottom-3 right-3 hidden h-32 rotate-6 rounded-2xl shadow sm:block"
          />
        </div>
      </div>
    </div>
  )
}

export default Contact
