import { createFileRoute } from "@tanstack/react-router"
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  Leaf,
  Mail,
  MapPin,
  PartyPopper,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react"
import { FormEvent, useEffect, useMemo, useState } from "react"

export const Route = createFileRoute("/")({
  component: Home,
})

const categories = [
  { name: "All", icon: SlidersHorizontal },
  { name: "Cleaning", icon: Sparkles },
  { name: "Tutoring", icon: BriefcaseBusiness },
  { name: "Gardening", icon: Leaf },
  { name: "Repairs", icon: Wrench },
  { name: "Events", icon: PartyPopper },
]

const providers = [
  {
    id: "mara-clean",
    name: "Mara Dlamini",
    service: "Deep home cleaning",
    category: "Cleaning",
    area: "Rosebank",
    rating: 4.9,
    reviews: 86,
    hourlyRate: 220,
    verified: true,
    response: "Usually replies in 12 min",
    availability: "Today, 15:00",
    skills: ["move-in cleans", "eco products", "laundry"],
  },
  {
    id: "lwazi-maths",
    name: "Lwazi Khumalo",
    service: "Maths and science tutoring",
    category: "Tutoring",
    area: "Sandton",
    rating: 4.8,
    reviews: 54,
    hourlyRate: 280,
    verified: true,
    response: "Usually replies in 25 min",
    availability: "Tomorrow morning",
    skills: ["grade 8-12", "exam prep", "online lessons"],
  },
  {
    id: "themba-fix",
    name: "Themba Mokoena",
    service: "Appliance and fixture repairs",
    category: "Repairs",
    area: "Randburg",
    rating: 4.7,
    reviews: 63,
    hourlyRate: 260,
    verified: true,
    response: "Usually replies in 40 min",
    availability: "Friday afternoon",
    skills: ["plumbing", "lights", "small appliances"],
  },
  {
    id: "naledi-garden",
    name: "Naledi Jacobs",
    service: "Garden refresh and maintenance",
    category: "Gardening",
    area: "Parktown",
    rating: 4.9,
    reviews: 41,
    hourlyRate: 210,
    verified: false,
    response: "Usually replies in 1 hour",
    availability: "Saturday",
    skills: ["lawn care", "indigenous plants", "pruning"],
  },
  {
    id: "zara-events",
    name: "Zara Patel",
    service: "Small event setup assistant",
    category: "Events",
    area: "Melville",
    rating: 4.8,
    reviews: 37,
    hourlyRate: 240,
    verified: true,
    response: "Usually replies in 30 min",
    availability: "Weekend slots",
    skills: ["table styling", "guest flow", "supplier runs"],
  },
  {
    id: "sihle-clean",
    name: "Sihle Ndlovu",
    service: "Weekly apartment cleaning",
    category: "Cleaning",
    area: "Braamfontein",
    rating: 4.6,
    reviews: 29,
    hourlyRate: 190,
    verified: false,
    response: "Usually replies same day",
    availability: "Mon and Wed",
    skills: ["apartments", "ironing", "pet-friendly"],
  },
]

const initialRequests = [
  {
    id: 1,
    title: "Once-off clean after renovations",
    category: "Cleaning",
    area: "Greenside",
    budget: 950,
    timeframe: "This week",
    description: "Dust removal, windows, and two bathrooms before family arrives.",
    status: "Open",
  },
  {
    id: 2,
    title: "Grade 10 physics catch-up",
    category: "Tutoring",
    area: "Illovo",
    budget: 450,
    timeframe: "Two evenings",
    description: "Needs help with electricity and magnetism before a test.",
    status: "Matching",
  },
]

type ClientRequest = (typeof initialRequests)[number]

type BookingRecord = {
  id?: number
  providerName: string
  serviceDate: string
  serviceTime: string
  addressArea: string
  status: string
}

function Home() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [query, setQuery] = useState("")
  const [area, setArea] = useState("")
  const [selectedProvider, setSelectedProvider] = useState(providers[0])
  const [saved, setSaved] = useState<string[]>(["mara-clean"])
  const [requests, setRequests] = useState<ClientRequest[]>(initialRequests)
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [notice, setNotice] = useState("Ready to match a local service.")

  useEffect(() => {
    Promise.all([
      fetch("/api/marketplace").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/marketplace?resource=saved").then((res) =>
        res.ok ? res.json() : [],
      ),
      fetch("/api/marketplace?resource=bookings").then((res) =>
        res.ok ? res.json() : [],
      ),
    ])
      .then(([remoteRequests, remoteSaved, remoteBookings]) => {
        if (Array.isArray(remoteRequests) && remoteRequests.length) {
          setRequests(remoteRequests)
        }
        if (Array.isArray(remoteSaved) && remoteSaved.length) {
          setSaved(remoteSaved.map((item) => item.providerId))
        }
        if (Array.isArray(remoteBookings)) {
          setBookings(remoteBookings)
        }
      })
      .catch(() => {
        setNotice("Using demo data until the marketplace API is available.")
      })
  }, [])

  const filteredProviders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedArea = area.trim().toLowerCase()

    return providers.filter((provider) => {
      const matchesCategory =
        activeCategory === "All" || provider.category === activeCategory
      const searchable = [
        provider.name,
        provider.service,
        provider.category,
        provider.area,
        ...provider.skills,
      ]
        .join(" ")
        .toLowerCase()
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery)
      const matchesArea =
        !normalizedArea || provider.area.toLowerCase().includes(normalizedArea)

      return matchesCategory && matchesQuery && matchesArea
    })
  }, [activeCategory, area, query])

  function chooseProvider(provider: (typeof providers)[number]) {
    setSelectedProvider(provider)
    setNotice(`${provider.name} is selected for booking.`)
  }

  async function toggleSaved(provider: (typeof providers)[number]) {
    const isSaved = saved.includes(provider.id)
    setSaved((current) =>
      isSaved
        ? current.filter((providerId) => providerId !== provider.id)
        : [...current, provider.id],
    )

    if (!isSaved) {
      await postResource("saved", {
        providerId: provider.id,
        providerName: provider.name,
        service: provider.service,
        area: provider.area,
        hourlyRate: provider.hourlyRate,
        verified: provider.verified,
      })
    }
  }

  async function postResource(resource: string, body: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/marketplace?resource=${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Request failed")
      return await res.json()
    } catch {
      setNotice("Saved locally. Connect Netlify Database to persist it.")
      return null
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      clientName: String(form.get("clientName")),
      clientEmail: String(form.get("clientEmail")),
      serviceDate: String(form.get("serviceDate")),
      serviceTime: String(form.get("serviceTime")),
      addressArea: String(form.get("addressArea")),
      details: String(form.get("details")),
      budget: Number(form.get("budget")) || selectedProvider.hourlyRate,
      status: "Pending review",
    }

    const stored = await postResource("bookings", payload)
    setBookings((current) => [stored ?? payload, ...current].slice(0, 8))
    setNotice(`Booking request sent to ${selectedProvider.name}.`)
    event.currentTarget.reset()
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      title: String(form.get("title")),
      category: String(form.get("category")),
      area: String(form.get("area")),
      budget: Number(form.get("budget")) || 0,
      timeframe: String(form.get("timeframe")),
      description: String(form.get("description")),
      status: "Open",
    }

    const stored = await postResource("requests", payload)
    setRequests((current) => [stored ?? { id: Date.now(), ...payload }, ...current])
    setNotice("Client service request published.")
    event.currentTarget.reset()
  }

  async function submitProvider(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await postResource("providers", {
      fullName: String(form.get("fullName")),
      email: String(form.get("email")),
      service: String(form.get("service")),
      category: String(form.get("category")),
      area: String(form.get("area")),
      hourlyRate: Number(form.get("hourlyRate")) || 0,
      experience: String(form.get("experience")),
    })
    setNotice("Provider onboarding profile submitted.")
    event.currentTarget.reset()
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#24231f]">
      <nav className="market-nav">
        <div>
          <p className="eyebrow">Neighbourhood marketplace</p>
          <h1>Local Hands</h1>
        </div>
        <a href="#onboard">Become a provider</a>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Book trusted help nearby</p>
          <h2>Find cleaning, tutoring, repairs, gardens, and event support in minutes.</h2>
          <p>
            Search vetted local providers, save favourites, request a booking,
            or publish a job for providers to respond to.
          </p>
        </div>
        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label>
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search service or skill"
            />
          </label>
          <label>
            <MapPin size={18} />
            <input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Area"
            />
          </label>
        </form>
      </section>

      <section className="category-strip" aria-label="Service categories">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              className={activeCategory === category.name ? "active" : ""}
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              type="button"
            >
              <Icon size={18} />
              {category.name}
            </button>
          )
        })}
      </section>

      <section className="market-layout">
        <div className="market-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{filteredProviders.length} providers found</p>
              <h2>Available providers</h2>
            </div>
            <span>{notice}</span>
          </div>

          <div className="provider-grid">
            {filteredProviders.map((provider) => (
              <article
                className={`provider-card ${
                  selectedProvider.id === provider.id ? "selected" : ""
                }`}
                key={provider.id}
              >
                <div className="provider-topline">
                  <div className="avatar">{provider.name.slice(0, 1)}</div>
                  <button
                    aria-label="Save provider"
                    className={saved.includes(provider.id) ? "icon-btn saved" : "icon-btn"}
                    onClick={() => toggleSaved(provider)}
                    type="button"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <div>
                  <h3>{provider.name}</h3>
                  <p>{provider.service}</p>
                </div>
                <div className="meta-row">
                  <span>
                    <Star size={15} fill="currentColor" /> {provider.rating} (
                    {provider.reviews})
                  </span>
                  <span>
                    <MapPin size={15} /> {provider.area}
                  </span>
                </div>
                <div className="skill-row">
                  {provider.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <strong>R{provider.hourlyRate}/hr</strong>
                  <button onClick={() => chooseProvider(provider)} type="button">
                    Select
                  </button>
                </div>
                <p className="microcopy">
                  {provider.verified && <BadgeCheck size={15} />} {provider.response}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="booking-panel">
          <div className="provider-summary">
            <div className="avatar large">{selectedProvider.name.slice(0, 1)}</div>
            <div>
              <p className="eyebrow">Booking with</p>
              <h2>{selectedProvider.name}</h2>
              <span>{selectedProvider.availability}</span>
            </div>
          </div>
          <form onSubmit={submitBooking}>
            <input name="clientName" placeholder="Your name" required />
            <input name="clientEmail" placeholder="Email" required type="email" />
            <div className="form-grid">
              <input name="serviceDate" required type="date" />
              <input name="serviceTime" required type="time" />
            </div>
            <input name="addressArea" placeholder="Area or suburb" required />
            <input name="budget" placeholder="Budget in rand" type="number" />
            <textarea
              name="details"
              placeholder="What do you need done?"
              required
              rows={4}
            />
            <button className="primary-btn" type="submit">
              <CalendarDays size={18} /> Request booking
            </button>
          </form>

          {bookings.length > 0 && (
            <div className="mini-list">
              <h3>Recent bookings</h3>
              {bookings.slice(0, 3).map((booking, index) => (
                <p key={booking.id ?? index}>
                  {booking.providerName} · {booking.serviceDate || "new date"} ·{" "}
                  {booking.status}
                </p>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="dashboard-band">
        <div className="market-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Client dashboard</p>
              <h2>Open service requests</h2>
            </div>
          </div>
          <div className="request-list">
            {requests.map((request) => (
              <article key={request.id}>
                <div>
                  <h3>{request.title}</h3>
                  <p>{request.description}</p>
                  <span>
                    {request.category} · {request.area} · {request.timeframe}
                  </span>
                </div>
                <strong>R{request.budget}</strong>
              </article>
            ))}
          </div>
        </div>

        <form className="market-panel stack-form" onSubmit={submitRequest}>
          <p className="eyebrow">Post a request</p>
          <h2>Tell providers what you need</h2>
          <input name="title" placeholder="Request title" required />
          <div className="form-grid">
            <select name="category" required>
              {categories.slice(1).map((category) => (
                <option key={category.name}>{category.name}</option>
              ))}
            </select>
            <input name="area" placeholder="Area" required />
          </div>
          <div className="form-grid">
            <input name="budget" placeholder="Budget" required type="number" />
            <input name="timeframe" placeholder="Timeframe" required />
          </div>
          <textarea
            name="description"
            placeholder="Describe the work"
            required
            rows={4}
          />
          <button className="primary-btn" type="submit">
            <Send size={18} /> Publish request
          </button>
        </form>
      </section>

      <section className="onboarding-section" id="onboard">
        <form className="market-panel stack-form" onSubmit={submitProvider}>
          <p className="eyebrow">Provider onboarding</p>
          <h2>Offer your service on Local Hands</h2>
          <div className="form-grid">
            <input name="fullName" placeholder="Full name" required />
            <input name="email" placeholder="Email" required type="email" />
          </div>
          <div className="form-grid">
            <input name="service" placeholder="Primary service" required />
            <select name="category" required>
              {categories.slice(1).map((category) => (
                <option key={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-grid">
            <input name="area" placeholder="Main area" required />
            <input
              name="hourlyRate"
              placeholder="Hourly rate"
              required
              type="number"
            />
          </div>
          <textarea
            name="experience"
            placeholder="Experience, tools, and availability"
            required
            rows={4}
          />
          <button className="primary-btn" type="submit">
            <Mail size={18} /> Submit profile
          </button>
        </form>
      </section>
    </main>
  )
}
