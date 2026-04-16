import { useEffect, useRef, useState } from 'react'
import logoMark from './assets/HurufJ.png'
import demoImageOne from './assets/demo/prewd1.jpg'
import demoImageTwo from './assets/demo/prewd2.jpg'
import demoImageThree from './assets/demo/prewd3.jpg'
import demoMusicFile from './audio/Kala Cinta Menggoda (Chrisye Cover) - Forte Entertainment [5d3m0fOEWZs].mp3'
import {
  createMidtransTransaction,
  createTestimonial,
  extractAuthToken,
  fetchAdminPaymentHistory,
  fetchMidtransStatus,
  fetchAdminUserDetail,
  fetchAdminUsers,
  fetchTestimonials,
  loginUser,
  registerUser,
} from './lib/api'
import { fetchAuthLogs, writeAuthLog, writePaymentLog } from './lib/adminLogs'
import './App.css'

const navItems = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Tema', href: '#tema' },
  { label: 'Paket', href: '#paket' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Login', href: '#auth' },
]

const themes = [
  {
    id: 'eternal-bloom',
    name: 'Eternal Bloom',
    tag: 'Romantic Floral',
    accent: 'theme-card rose',
    couple: 'Amara & Bima',
    date: 'Sabtu, 21 September 2026',
    venue: 'Glasshouse Garden, Jakarta',
    story:
      'Tema floral lembut untuk acara yang ingin tampil manis, modern, dan penuh detail elegan.',
    palette: 'Palet dusty rose, cream, dan sentuhan champagne gold.',
    image: demoImageOne,
  },
  {
    id: 'golden-vows',
    name: 'Golden Vows',
    tag: 'Classic Luxury',
    accent: 'theme-card gold',
    couple: 'Nadira & Farhan',
    date: 'Minggu, 12 Oktober 2026',
    venue: 'The Manor Ballroom, Bandung',
    story:
      'Tema formal dengan nuansa premium untuk acara yang ingin tampil lebih klasik dan berkelas.',
    palette: 'Palet ivory, warm gold, dan beige champagne.',
    image: demoImageTwo,
  },
  {
    id: 'soft-serenity',
    name: 'Soft Serenity',
    tag: 'Minimal Elegant',
    accent: 'theme-card cream',
    couple: 'Kayla & Reza',
    date: 'Sabtu, 08 November 2026',
    venue: 'Serene Hall, Yogyakarta',
    story:
      'Tema minimalis bersih dengan komposisi editorial yang cocok untuk berbagai acara intimate.',
    palette: 'Palet soft cream, nude sand, dan blush pastel.',
    image: demoImageThree,
  },
]

const packages = [
  {
    name: 'Basic',
    code: 'basic',
    price: 'Rp60.000',
    amount: 60000,
    badge: 'Hemat',
    kicker: 'Mulai simpel, tetap terlihat rapi dan elegan.',
    description:
      'Cocok untuk acara sederhana yang butuh undangan digital siap pakai tanpa proses rumit.',
    idealFor: 'Ideal untuk gathering kecil, syukuran, ulang tahun, atau acara keluarga.',
    ctaLabel: 'Mulai dari Basic',
    features: [
      'Semua fitur Basic',
      'Tema Standart',
      'Cover acara dengan nama host atau acara',
      'Informasi acara utama',
      'Countdown menuju hari acara',
      'RSVP dasar untuk konfirmasi tamu',
      'Share via Link (Manual)',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    code: 'premium',
    price: 'Rp100.000',
    amount: 100000,
    badge: 'Best Value',
    kicker: 'Paling seimbang antara harga, tampilan, dan fitur.',
    description:
      'Pilihan paling populer untuk penyelenggara yang ingin undangan terasa lebih personal, hangat, dan lengkap.',
    idealFor: 'Ideal untuk seminar, acara kantor, ulang tahun, atau perayaan yang ingin tampil lebih berkesan.',
    ctaLabel: 'Pilih Premium',
    features: [
      'Semua fitur Basic',
      'Tema Standart',
      'Cover acara dengan nama host atau acara',
      'Informasi acara utama',
      'Countdown menuju hari acara',
      'Galeri foto atau dokumentasi acara',
      'Musik latar otomatis',
      'Buku tamu digital / ucapan',
      'Highlight acara dan story singkat',
      'RSVP dasar untuk konfirmasi tamu',
      'Tombol share langsung ke WhatsApp'
    ],
    featured: true,
  },
  {
    name: 'Exclusive',
    code: 'exclusive',
    price: 'Rp150.000',
    amount: 150000,
    badge: 'Paling Lengkap',
    kicker: 'Untuk acara yang membutuhkan tampilan premium dan pengalaman yang lebih personal.',
    description:
      'Dirancang untuk kebutuhan acara yang ingin tampil paling mewah, lebih fleksibel, dan punya sentuhan khusus.',
    idealFor: 'Pilihan tepat untuk Anda yang menginginkan tampilan undangan yang lebih mewah, profesional, dan standout.',
    ctaLabel: 'Ambil Exclusive',
    features: [
      'Semua fitur Premium',
      'Tampilan lebih eksklusif untuk dibagikan ke tamu',
      'Cover acara dengan nama host atau acara',
      'Informasi acara utama',
      'Countdown menuju hari acara',
      'Galeri foto atau dokumentasi acara',
      'Musik latar otomatis',
      'Buku tamu digital / ucapan',
      'Highlight acara dan story singkat',
      'Custom domain / link personal',
      'RSVP lanjutan dengan detail tamu',
      'Story timeline acara atau brand',
      'Prioritas revisi lebih cepat',
      'Cocok untuk acara besar dengan kebutuhan presentasi lebih premium',
      'Tombol share langsung ke WhatsApp'
    ],
    featured: false,
  },
]

const features = [
  {
    icon: 'RS',
    title: 'RSVP Otomatis',
    description: 'Konfirmasi kehadiran tamu tercatat real-time dan mudah dipantau.',
  },
  {
    icon: 'MU',
    title: 'Musik Latar',
    description: 'Bangun suasana hangat sejak tamu pertama kali membuka undangan.',
  },
  {
    icon: 'GL',
    title: 'Galeri Foto',
    description: 'Tampilkan momen spesial dalam layout yang bersih dan modern.',
  },
  {
    icon: 'DM',
    title: 'Custom Domain',
    description: 'Gunakan alamat undangan yang lebih personal dan mudah diingat.',
  },
  {
    icon: 'CD',
    title: 'Countdown Acara',
    description: 'Bantu tamu mengingat hari bahagia dengan hitung mundur otomatis.',
  },
  {
    icon: 'WA',
    title: 'Share ke WhatsApp',
    description: 'Sebarkan undangan lebih cepat dengan tombol bagikan instan.',
  },
]

const whatsappLink =
  'https://wa.me/6285270106090?text=%5Bka%5D%20Halo%20joinourday%2C%20saya%20mau%20buat%20undangan%20nih%2C%20mau%20tanya%20dong%20...'

const ADMIN_EMAIL = 'ikiputra876@gmail.com'
const ADMIN_USERS_PAGE_SIZE = 8
const ADMIN_PAYMENTS_PAGE_SIZE = 8

const demoSectionIds = ['demo-cover', 'demo-event', 'demo-gallery', 'demo-gift']

const createInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

const getStoredSessionAuthUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const saved = window.localStorage.getItem('joinourday-auth-user')

  if (!saved) {
    return null
  }

  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

const getPaymentStorageKey = (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!normalizedEmail) {
    return ''
  }

  return `joinourday-latest-payment:${normalizedEmail}`
}

const getStoredLatestPayment = (email) => {
  if (typeof window === 'undefined') {
    return null
  }

  const storageKey = getPaymentStorageKey(email)

  if (!storageKey) {
    return null
  }

  const saved = window.localStorage.getItem(storageKey)

  if (!saved) {
    return null
  }

  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

const getPaymentSuccessSeenStorageKey = (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!normalizedEmail) {
    return ''
  }

  return `joinourday-payment-success-seen:${normalizedEmail}`
}

const getStoredSeenPaymentSuccess = (email) => {
  if (typeof window === 'undefined') {
    return []
  }

  const storageKey = getPaymentSuccessSeenStorageKey(email)

  if (!storageKey) {
    return []
  }

  const saved = window.localStorage.getItem(storageKey)

  if (!saved) {
    return []
  }

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const persistSeenPaymentSuccess = (email, orderIds) => {
  if (typeof window === 'undefined') {
    return
  }

  const storageKey = getPaymentSuccessSeenStorageKey(email)

  if (!storageKey) {
    return
  }

  const uniqueOrderIds = Array.from(
    new Set(orderIds.filter((value) => typeof value === 'string' && value.trim())),
  )

  window.localStorage.setItem(storageKey, JSON.stringify(uniqueOrderIds))
}

const normalizeTestimonialItem = (item, index) => {
  const name = item?.nama?.trim() || item?.name?.trim() || 'Pengguna JOINOURDAY'
  const role =
    item?.peran?.trim() || item?.role?.trim() || item?.status?.trim() || 'Pengguna JOINOURDAY'
  const quote =
    item?.testimoni?.trim() ||
    item?.testimonial?.trim() ||
    item?.quote?.trim() ||
    item?.message?.trim() ||
    ''

  return {
    id: item?.id ?? item?._id ?? `${name}-${role}-${index}`,
    name,
    role,
    quote,
    avatar: createInitials(name),
  }
}

const getAuthSuccessMessage = (payload, fallbackMessage) => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  return fallbackMessage
}

const getAuthIdentity = (payload, fallbackEmail) => {
  const user = payload?.user ?? payload?.data?.user ?? payload?.data

  if (typeof user?.nama === 'string' && user.nama.trim()) {
    return user.nama
  }

  if (typeof user?.name === 'string' && user.name.trim()) {
    return user.name
  }

  if (typeof user?.email === 'string' && user.email.trim()) {
    return user.email
  }

  if (typeof payload?.email === 'string' && payload.email.trim()) {
    return payload.email
  }

  return fallbackEmail
}

const getAuthUser = (payload, fallbackName, fallbackEmail) => {
  const user = payload?.user ?? payload?.data?.user ?? payload?.data ?? {}

  const name =
    (typeof user?.nama === 'string' && user.nama.trim()) ||
    (typeof user?.name === 'string' && user.name.trim()) ||
    fallbackName ||
    ''

  const email =
    (typeof user?.email === 'string' && user.email.trim()) ||
    (typeof payload?.email === 'string' && payload.email.trim()) ||
    fallbackEmail

  return {
    id: user?.id ?? user?._id ?? user?.userId ?? user?.uid ?? payload?.userId ?? '',
    name,
    email,
    role: user?.role ?? user?.user_type ?? payload?.role ?? '',
    token: extractAuthToken(payload),
  }
}

const buildOrderId = (packageCode) =>
  `JOD-${packageCode.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

const getPaymentTransaction = (payload) =>
  payload?.transaction ?? payload?.data?.transaction ?? payload?.data ?? payload

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  const date =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : typeof value === 'object' &&
          value !== null &&
          Number.isFinite(value.seconds ?? value._seconds)
        ? new Date(Number(value.seconds ?? value._seconds) * 1000)
      : value instanceof Date
        ? value
        : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const normalizePaymentLifecycleStatus = (value) => {
  if (typeof value !== 'string') {
    return 'pending'
  }

  const normalized = value.trim().toLowerCase()

  return normalized || 'pending'
}

const isTerminalPaymentStatus = (value) => {
  const status = normalizePaymentLifecycleStatus(value)

  return ['settlement', 'capture', 'deny', 'cancel', 'expire', 'failed', 'failure', 'error'].includes(
    status,
  )
}

const isSuccessfulPaymentStatus = (value) => {
  const status = normalizePaymentLifecycleStatus(value)

  return status === 'settlement' || status === 'capture'
}

const getPaymentStatusLabel = (value) => {
  const status = normalizePaymentLifecycleStatus(value)

  if (status === 'settlement') {
    return 'Pembayaran berhasil'
  }

  if (status === 'capture') {
    return 'Pembayaran terverifikasi'
  }

  if (status === 'pending') {
    return 'Menunggu pembayaran'
  }

  if (status === 'deny') {
    return 'Pembayaran ditolak'
  }

  if (status === 'cancel') {
    return 'Pembayaran dibatalkan'
  }

  if (status === 'expire') {
    return 'Pembayaran kedaluwarsa'
  }

  if (status === 'failed' || status === 'failure' || status === 'error') {
    return 'Pembayaran gagal'
  }

  return status.replace(/_/g, ' ')
}

const swallowLogError = (scope) => (error) => {
  console.error(`Gagal mencatat ${scope}:`, error)
}

const normalizeCollectionPayload = (payload, keys = []) => {
  if (Array.isArray(payload)) {
    return payload
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key]
    }

    if (Array.isArray(payload?.data?.[key])) {
      return payload.data[key]
    }
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

const normalizeAdminUsers = (payload) =>
  normalizeCollectionPayload(payload, ['users', 'results']).map((item, index) => ({
    id: item?.id ?? item?._id ?? item?.userId ?? item?.uid ?? `user-${index}`,
    name: item?.nama ?? item?.name ?? item?.fullName ?? '-',
    email: item?.email ?? '-',
    role: item?.role ?? item?.user_type ?? '-',
    createdAt: item?.createdAt ?? item?.created_at ?? item?.registeredAt ?? '',
    updatedAt: item?.updatedAt ?? item?.updated_at ?? '',
    lastLoginAt:
      item?.lastLoginAt ??
      item?.last_login_at ??
      item?.loggedInAt ??
      item?.loginAt ??
      item?.login_at ??
      item?.lastSeenAt ??
      item?.last_seen_at ??
      item?.lastSeen ??
      item?.last_seen ??
      '',
  }))

const normalizeAuthLogs = (payload) =>
  (Array.isArray(payload) ? payload : []).map((item, index) => ({
    id: item?.id ?? `auth-log-${index}`,
    type: item?.type ?? '',
    userEmail: String(item?.userEmail ?? item?.email ?? '').trim().toLowerCase(),
    loggedInAt:
      item?.loggedInAt ??
      item?.logged_in_at ??
      item?.loginAt ??
      item?.login_at ??
      item?.createdAt ??
      item?.created_at ??
      '',
  }))

const mergeUsersWithLastLogin = (users, authLogs) => {
  const latestLoginByEmail = new Map()

  normalizeAuthLogs(authLogs).forEach((item) => {
    if (!item.userEmail || item.type !== 'login' || !item.loggedInAt) {
      return
    }

    if (!latestLoginByEmail.has(item.userEmail)) {
      latestLoginByEmail.set(item.userEmail, item.loggedInAt)
    }
  })

  return users.map((user) => {
    if (user.lastLoginAt) {
      return user
    }

    const email = String(user.email || '').trim().toLowerCase()

    return {
      ...user,
      lastLoginAt: latestLoginByEmail.get(email) ?? '',
    }
  })
}

const normalizeAdminPayments = (payload) =>
  normalizeCollectionPayload(payload, ['payments', 'transactions', 'results', 'history']).map(
    (item, index) => ({
      id: item?.id ?? item?._id ?? item?.orderId ?? `payment-${index}`,
      orderId: item?.orderId ?? item?.order_id ?? '-',
      userId: item?.userId ?? item?.user_id ?? '',
      loggedInUser: item?.loggedInUser ?? item?.userEmail ?? item?.email ?? '-',
      customerName:
        item?.customerName ??
        item?.customer_name ??
        item?.customerDetails?.first_name ??
        item?.customer_details?.first_name ??
        item?.name ??
        '',
      customerEmail: item?.customerEmail ?? item?.customer_email ?? item?.email ?? '',
      packageName:
        item?.packageName ??
        item?.package_name ??
        item?.package ??
        item?.packageCode ??
        item?.package_code ??
        item?.itemDetails?.[0]?.name ??
        item?.item_details?.[0]?.name ??
        '-',
      amount: Number(item?.amount ?? item?.grossAmount ?? item?.gross_amount ?? 0),
      paymentStatus:
        item?.paymentStatus ?? item?.status ?? item?.transactionStatus ?? item?.transaction_status ?? '-',
      createdAt:
        item?.createdAt ??
        item?.created_at ??
        item?.transactionTime ??
        item?.transaction_time ??
        item?.settlementTime ??
        item?.settlement_time ??
        item?.time ??
        item?.timestamp ??
        item?.date ??
        '',
      updatedAt: item?.updatedAt ?? item?.updated_at ?? '',
    }),
  )

const loadMidtransSnap = () => {
  if (window.snap) {
    return Promise.resolve(window.snap)
  }

  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY

  if (!clientKey) {
    return Promise.reject(new Error('VITE_MIDTRANS_CLIENT_KEY belum diatur.'))
  }

  const existingScript = document.querySelector('script[data-midtrans-snap="true"]')

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.snap), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Gagal memuat Midtrans Snap.')),
        { once: true },
      )
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src =
      import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.midtrans.com/snap/snap.js'
    script.dataset.midtransSnap = 'true'
    script.dataset.clientKey = clientKey
    script.onload = () => resolve(window.snap)
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.'))
    document.body.appendChild(script)
  })
}

function DemoPage({ theme }) {
  const [isInvitationOpened, setIsInvitationOpened] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)
  const [activeSection, setActiveSection] = useState('demo-cover')
  const autoScrollRef = useRef(null)
  const audioRef = useRef(null)
  const galleryItems = [
    {
      id: 'gallery-cover',
      label: 'Portrait Cover',
      image: theme.image,
      className: 'large tall',
    },
    {
      id: 'gallery-1',
      label: 'Prewedding One',
      image: demoImageOne,
      className: 'wide',
    },
    {
      id: 'gallery-2',
      label: 'Prewedding Two',
      image: demoImageTwo,
      className: 'square',
    },
    {
      id: 'gallery-3',
      label: 'Prewedding Three',
      image: demoImageThree,
      className: 'square',
    },
  ]

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      window.clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }

  useEffect(() => {
    if (!isInvitationOpened) {
      stopAutoScroll()
      return undefined
    }

    if (isAutoScrollEnabled) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      stopAutoScroll()
      autoScrollRef.current = window.setInterval(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (window.scrollY >= maxScroll - 4) {
          stopAutoScroll()
          return
        }

        window.scrollBy({ top: 1, behavior: 'auto' })
      }, 22)
    } else {
      stopAutoScroll()
    }

    return () => {
      stopAutoScroll()
    }
  }, [isAutoScrollEnabled, isInvitationOpened])

  useEffect(() => {
    if (!isInvitationOpened) {
      return undefined
    }

    const handleScroll = () => {
      let currentSection = demoSectionIds[0]

      demoSectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId)
        if (!section) {
          return
        }

        const top = section.getBoundingClientRect().top
        if (top <= 160) {
          currentSection = sectionId
        }
      })

      setActiveSection(currentSection)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isInvitationOpened])

  useEffect(() => {
    if (!isInvitationOpened) {
      return undefined
    }

    const elements = Array.from(document.querySelectorAll('.demo-animate'))

    if (!elements.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [isInvitationOpened])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return undefined
    }

    if (isMusicPlaying) {
      const playPromise = audio.play()

      if (playPromise?.catch) {
        playPromise.catch(() => {
          setIsMusicPlaying(false)
        })
      }
    } else {
      audio.pause()
    }

    return undefined
  }, [isMusicPlaying])

  useEffect(() => {
    const audio = audioRef.current

    return () => {
      if (audio) {
        audio.pause()
      }

      if (autoScrollRef.current) {
        window.clearInterval(autoScrollRef.current)
      }
    }
  }, [])

  const openInvitation = () => {
    setIsInvitationOpened(true)
    setIsMusicPlaying(true)
  }

  const goToSection = (sectionId) => {
    if (isAutoScrollEnabled) {
      stopAutoScroll()
      setIsAutoScrollEnabled(false)
    }
    const section = document.getElementById(sectionId)
    if (section) {
      setActiveSection(sectionId)
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleMusic = () => {
    setIsMusicPlaying((value) => !value)
  }

  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled((value) => !value)
  }

  return (
    <div className={`demo-page demo-${theme.id}`}>
      {!isInvitationOpened ? (
        <section
          className="invitation-gate"
          style={{ '--demo-gate-image': `url(${theme.image})` }}
        >
          <div className="gate-particles" aria-hidden="true" />
          <div className="invitation-gate-card">
            <span className="eyebrow">{theme.tag}</span>
            <p className="gate-kicker">The Wedding Invitation</p>
            <h1>{theme.couple}</h1>
            <p className="gate-guest">Kepada Bapak/Ibu/Saudara/i</p>
            <strong className="gate-guest-name">Tamu Undangan</strong>
            <p className="gate-note">
              Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di
              hari bahagia kami.
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={openInvitation}
            >
              Buka Undangan
            </button>
          </div>
        </section>
      ) : null}

      <main className={`demo-layout${isInvitationOpened ? ' demo-layout-visible' : ''}`}>
        <div className="demo-youtube-audio" aria-hidden="true">
          <audio ref={audioRef} src={demoMusicFile} loop preload="auto" />
        </div>

        <div className="demo-phone-frame">
          <section
            className="demo-mobile-hero"
            id="demo-cover"
            style={{ '--demo-hero-image': `url(${theme.image})` }}
          >
            <div className="demo-mobile-overlay" />
            <div className="demo-mobile-top">Undangan Pernikahan</div>
            <div className="demo-mobile-content">
              <span className="demo-mobile-tag demo-animate demo-fade-up">{theme.tag}</span>
              <h1 className="demo-animate demo-fade-up demo-delay-1">{theme.couple}</h1>
              <p className="demo-date demo-animate demo-fade-up demo-delay-2">{theme.date}</p>
              <div className="demo-mini-countdown demo-animate demo-fade-up demo-delay-3">
                <article><strong>21</strong><span>Hari</span></article>
                <article><strong>21</strong><span>Jam</span></article>
                <article><strong>56</strong><span>Menit</span></article>
                <article><strong>29</strong><span>Detik</span></article>
              </div>
              <p className="demo-guest-inline demo-animate demo-fade-up demo-delay-4">
                Kepada:
                <strong>Caca</strong>
              </p>
            </div>
          </section>

          <section className="demo-paper">
            <section className="demo-section-block demo-animate demo-fade-up" id="demo-opening">
              <span className="demo-section-label">Pembuka</span>
              <h2>Dengan penuh sukacita kami mengundang Anda untuk hadir di hari bahagia kami.</h2>
              <p>
                Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk
                menjadi bagian dari momen pernikahan kami. Kehadiran dan doa restu Anda
                akan menjadi kebahagiaan yang sangat berarti bagi kami.
              </p>
            </section>

            <div className="demo-info-grid" id="demo-couple">
              <article className="demo-animate demo-rise demo-delay-1">
                <span>Venue</span>
                <strong>{theme.venue}</strong>
              </article>
              <article className="demo-animate demo-rise demo-delay-2">
                <span>Style</span>
                <strong>{theme.palette}</strong>
              </article>
              <article className="demo-animate demo-rise demo-delay-3">
                <span>Fitur</span>
                <strong>RSVP, galeri, musik, countdown</strong>
              </article>
            </div>

            <section className="demo-section-block demo-animate demo-fade-up" id="demo-event">
              <span className="demo-section-label">Detail Acara</span>
              <div className="demo-event-grid">
                <article className="demo-event-card demo-animate demo-rise demo-delay-1">
                  <span>Akad Nikah</span>
                  <strong>{theme.date}</strong>
                  <p>09.00 WIB - Selesai</p>
                  <small>{theme.venue}</small>
                </article>
                <article className="demo-event-card demo-animate demo-rise demo-delay-2">
                  <span>Resepsi</span>
                  <strong>{theme.date}</strong>
                  <p>18.30 WIB - 21.00 WIB</p>
                  <small>{theme.venue}</small>
                </article>
              </div>
            </section>

            <section className="demo-section-block demo-animate demo-fade-up">
              <span className="demo-section-label">Countdown</span>
              <div className="demo-countdown">
                <article className="demo-animate demo-pop demo-delay-1">
                  <strong>128</strong>
                  <span>Hari</span>
                </article>
                <article className="demo-animate demo-pop demo-delay-2">
                  <strong>08</strong>
                  <span>Jam</span>
                </article>
                <article className="demo-animate demo-pop demo-delay-3">
                  <strong>24</strong>
                  <span>Menit</span>
                </article>
                <article className="demo-animate demo-pop demo-delay-4">
                  <strong>16</strong>
                  <span>Detik</span>
                </article>
              </div>
            </section>

            <section className="demo-section-block demo-animate demo-fade-up" id="demo-gallery">
              <span className="demo-section-label">Galeri</span>
              <div className="demo-gallery-wrap">
                <div className="demo-gallery">
                  {galleryItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`demo-gallery-item ${item.className} demo-animate demo-zoom-in demo-delay-${Math.min(index + 1, 4)}`}
                      style={{ '--gallery-image': `url(${item.image})` }}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="demo-section-block demo-animate demo-fade-up" id="demo-story">
              <span className="demo-section-label">Love Story</span>
              <div className="demo-timeline">
                <article className="demo-animate demo-slide-left demo-delay-1">
                  <strong>First Meet</strong>
                  <p>Kami pertama kali bertemu dalam sebuah momen sederhana yang kemudian menjadi awal kisah panjang kami.</p>
                </article>
                <article className="demo-animate demo-slide-left demo-delay-2">
                  <strong>Relationship</strong>
                  <p>Perjalanan kami dipenuhi banyak cerita, pertumbuhan, dan keyakinan untuk melangkah bersama.</p>
                </article>
                <article className="demo-animate demo-slide-left demo-delay-3">
                  <strong>Engagement</strong>
                  <p>Dengan restu keluarga, kami memutuskan merayakan cinta ini dalam ikatan pernikahan.</p>
                </article>
              </div>
            </section>

            <section className="demo-section-block demo-animate demo-fade-up" id="demo-rsvp">
              <span className="demo-section-label">RSVP & Ucapan</span>
              <div className="demo-wishes">
                <article className="demo-animate demo-rise demo-delay-1">
                  <strong>Rina K.</strong>
                  <p>Selamat menempuh hidup baru. Semoga selalu diberi kebahagiaan dan keberkahan.</p>
                </article>
                <article className="demo-animate demo-rise demo-delay-2">
                  <strong>Danu & Siska</strong>
                  <p>Turut berbahagia atas hari spesial kalian. Semoga acaranya lancar dan penuh kehangatan.</p>
                </article>
              </div>
            </section>

            <section className="demo-section-block demo-animate demo-fade-up" id="demo-gift">
              <span className="demo-section-label">Hadiah Digital</span>
              <div className="demo-gift-card demo-animate demo-pop demo-delay-1">
                <strong>BCA - 1234567890</strong>
                <p>a.n. JOINOURDAY Couple Demo</p>
                <a className="button button-secondary" href="#auth">
                  Salin Rekening
                </a>
              </div>
            </section>

            <section className="demo-section-block demo-closing demo-animate demo-fade-up">
              <span className="demo-section-label">Penutup</span>
              <h2>Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.</h2>
              <p>
                Atas kehadiran dan doa restunya kami ucapkan terima kasih. Sampai
                jumpa di hari bahagia kami.
              </p>
            </section>

            <div className="demo-actions demo-animate demo-fade-up demo-delay-2">
              <a className="button button-primary" href="#auth">
                Gunakan Tema Ini
              </a>
              <a className="button button-secondary" href="#tema">
                Lihat Tema Lain
              </a>
            </div>
          </section>
        </div>
      </main>

      {isInvitationOpened ? (
        <div className="demo-bottom-toolbar">
          <button
            className={activeSection === 'demo-cover' ? 'active' : ''}
            type="button"
            onClick={() => goToSection('demo-cover')}
            aria-label="Buka beranda demo"
            title="Beranda"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3.1 3 10.2V21h6v-5.5h6V21h6V10.2l-9-7.1Zm0 2.56 7 5.53V19h-2v-5.5H7V19H5v-7.81l7-5.53Z"
              />
            </svg>
          </button>
          <button
            className={activeSection === 'demo-event' ? 'active' : ''}
            type="button"
            onClick={() => goToSection('demo-event')}
            aria-label="Buka detail acara"
            title="Acara"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
              />
            </svg>
          </button>
          <button
            className={activeSection === 'demo-gallery' ? 'active' : ''}
            type="button"
            onClick={() => goToSection('demo-gallery')}
            aria-label="Buka galeri demo"
            title="Galeri"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v9.59l3.3-3.3a1 1 0 0 1 1.4 0l2.8 2.8 2.3-2.3a1 1 0 0 1 1.4 0L19 14.59V5H5Zm14 12v-.59l-3.5-3.5-2.3 2.3a1 1 0 0 1-1.4 0L9 12.41 5 16.41V19h14ZM8.5 7A1.5 1.5 0 1 0 8.5 10 1.5 1.5 0 0 0 8.5 7Z"
              />
            </svg>
          </button>
          <button
            className={activeSection === 'demo-gift' ? 'active' : ''}
            type="button"
            onClick={() => goToSection('demo-gift')}
            aria-label="Buka hadiah digital"
            title="Gift"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 7h-2.18A3 3 0 0 0 18 6a3 3 0 0 0-5.5-1.66L12 5l-.5-.66A3 3 0 0 0 6 6c0 .35.06.69.18 1H4a2 2 0 0 0-2 2v3h1v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8h1V9a2 2 0 0 0-2-2ZM15 5a1 1 0 1 1 0 2h-2.25l1.45-1.93A1 1 0 0 1 15 5ZM9 5a1 1 0 0 1 .8.4L11.25 7H9A1 1 0 1 1 9 5Zm11 5h-7v10h6V10h1ZM5 20h6V10H4v10a1 1 0 0 0 1 1Z"
              />
            </svg>
          </button>
          <button
            className={isMusicPlaying ? 'active' : ''}
            type="button"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
            title={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isMusicPlaying ? (
                <path
                  fill="currentColor"
                  d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.7 17H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3.7l4.66-4.54A1 1 0 0 1 14 3.23Zm3.54 3.05a1 1 0 0 1 1.41 0 8 8 0 0 1 0 11.32 1 1 0 0 1-1.41-1.42 6 6 0 0 0 0-8.48 1 1 0 0 1 0-1.42Zm-2.83 2.83a1 1 0 0 1 1.41 0 4 4 0 0 1 0 5.66 1 1 0 1 1-1.41-1.42 2 2 0 0 0 0-2.82 1 1 0 0 1 0-1.42Z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.7 17H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3.7l4.66-4.54A1 1 0 0 1 14 3.23Zm6.48 4.36a1 1 0 0 1 0 1.41L17.9 11.6l2.58 2.59a1 1 0 1 1-1.41 1.41L16.48 13l-2.6 2.6a1 1 0 0 1-1.41-1.42l2.6-2.59-2.6-2.59A1 1 0 1 1 13.88 7.6l2.6 2.58 2.59-2.58a1 1 0 0 1 1.41 0Z"
                />
              )}
            </svg>
          </button>
          <button
            className={isAutoScrollEnabled ? 'active' : ''}
            type="button"
            onClick={toggleAutoScroll}
            aria-label={isAutoScrollEnabled ? 'Matikan scroll otomatis' : 'Nyalakan scroll otomatis'}
            title={isAutoScrollEnabled ? 'Scroll otomatis aktif' : 'Scroll otomatis nonaktif'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isAutoScrollEnabled ? (
                <path
                  fill="currentColor"
                  d="M12 2a1 1 0 0 1 1 1v13.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42l2.3 2.3V3a1 1 0 0 1 1-1Zm-7 18a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M12 2a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 20a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-6-3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm9 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1Z"
                />
              )}
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
}

function LandingPage({
  activeTab,
  handleNavClick,
  isMobileNavOpen,
  setActiveTab,
  setIsMobileNavOpen,
}) {
  const testimonialSectionRef = useRef(null)
  const testimonialRailRef = useRef(null)
  const [userTestimonials, setUserTestimonials] = useState([])
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [authStatus, setAuthStatus] = useState({
    submitting: false,
    error: '',
    success: '',
  })
  const [authIdentity, setAuthIdentity] = useState('')
  const [authUser, setAuthUser] = useState(() => {
    const saved = window.localStorage.getItem('joinourday-auth-user')

    if (!saved) {
      return null
    }

    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  })
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    quote: '',
  })
  const [testimonialStatus, setTestimonialStatus] = useState({
    loading: true,
    submitting: false,
    error: '',
    success: '',
  })
  const [selectedPackageCode, setSelectedPackageCode] = useState(() => {
    const featuredPackage = packages.find((item) => item.featured)
    return featuredPackage?.code || packages[0]?.code || ''
  })
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false)
  const [isPaymentSuccessPopupOpen, setIsPaymentSuccessPopupOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState(() => ({
    customerName: authUser?.name || '',
    email: authUser?.email || '',
    phone: '',
    notes: '',
  }))
  const [latestPayment, setLatestPayment] = useState(() => getStoredLatestPayment(authUser?.email))
  const [seenPaymentSuccessOrderIds, setSeenPaymentSuccessOrderIds] = useState(() =>
    getStoredSeenPaymentSuccess(authUser?.email),
  )
  const [paymentStatus, setPaymentStatus] = useState({
    submitting: false,
    checking: false,
    error: '',
    success: '',
  })
  const latestPaymentAttemptRef = useRef(0)
  const paymentStatusSyncRef = useRef(false)
  const snapEmbedContainerId = 'joinourday-snap-embed'

  const selectedPackage = packages.find((item) => item.code === selectedPackageCode) ?? packages[0]
  const activePaymentStorageKey = getPaymentStorageKey(authUser?.email)
  const latestPaymentStatus = normalizePaymentLifecycleStatus(latestPayment?.status)
  const latestPaymentStatusLabel = getPaymentStatusLabel(latestPaymentStatus)

  const persistLatestPayment = (payment) => {
    setLatestPayment(payment)

    if (!activePaymentStorageKey) {
      return
    }

    if (payment) {
      window.localStorage.setItem(activePaymentStorageKey, JSON.stringify(payment))
      return
    }

    window.localStorage.removeItem(activePaymentStorageKey)
  }

  useEffect(() => {
    setLatestPayment(getStoredLatestPayment(authUser?.email))
  }, [authUser?.email])

  useEffect(() => {
    setSeenPaymentSuccessOrderIds(getStoredSeenPaymentSuccess(authUser?.email))
  }, [authUser?.email])

  useEffect(() => {
    if (!latestPayment?.orderId || !isSuccessfulPaymentStatus(latestPayment.status)) {
      return
    }

    if (seenPaymentSuccessOrderIds.includes(latestPayment.orderId)) {
      return
    }

    const nextSeenOrderIds = [...seenPaymentSuccessOrderIds, latestPayment.orderId]
    setSeenPaymentSuccessOrderIds(nextSeenOrderIds)
    persistSeenPaymentSuccess(authUser?.email, nextSeenOrderIds)
    setIsPaymentSuccessPopupOpen(true)
  }, [authUser?.email, latestPayment?.orderId, latestPayment?.status, seenPaymentSuccessOrderIds])

  const syncLatestPaymentStatus = async ({
    payment = latestPayment,
    silent = true,
    source = 'auto',
    showChecking = false,
  } = {}) => {
    if (!payment?.orderId || paymentStatusSyncRef.current) {
      return null
    }

    paymentStatusSyncRef.current = true

    if (showChecking) {
      setPaymentStatus((current) => ({
        ...current,
        checking: true,
        error: '',
        success: silent ? current.success : '',
      }))
    }

    try {
      const payload = await fetchMidtransStatus(payment.orderId)
      const status =
        payload?.transaction_status ||
        payload?.status ||
        payload?.paymentStatus ||
        payload?.data?.transaction_status ||
        payload?.data?.status ||
        payment.status

      const normalizedStatus = normalizePaymentLifecycleStatus(status)
      const redirectUrl =
        payload?.redirect_url ||
        payload?.redirectUrl ||
        payload?.data?.redirect_url ||
        payload?.data?.redirectUrl ||
        payment.redirectUrl ||
        ''

      const syncedPayment = {
        ...payment,
        status: normalizedStatus,
        redirectUrl,
      }
      const previousStatus = normalizePaymentLifecycleStatus(payment.status)
      const statusChanged = previousStatus !== normalizedStatus

      persistLatestPayment(syncedPayment)
      setPaymentStatus((current) => ({
        ...current,
        checking: false,
        error: '',
        success: silent
          ? current.success
          : `Status pembayaran order ${payment.orderId}: ${getPaymentStatusLabel(normalizedStatus)}.`,
      }))

      if (source === 'manual' || statusChanged || isTerminalPaymentStatus(normalizedStatus)) {
        writePaymentLog({
          orderId: payment.orderId,
          type: source === 'manual' ? 'payment_status_checked' : 'payment_status_auto_synced',
          paymentStatus: normalizedStatus,
          packageName: payment.packageName || '',
          amount: payment.amount || 0,
          customerName: payment.customerName || '',
          customerEmail: payment.customerEmail || '',
          customerPhone: payment.customerPhone || '',
          loggedInUser: authUser?.email || payment.loggedInUser || null,
          redirectUrl,
        }).catch(
          swallowLogError(source === 'manual' ? 'pengecekan status pembayaran' : 'sinkronisasi status pembayaran'),
        )
      }

      return syncedPayment
    } catch (error) {
      setPaymentStatus((current) => ({
        ...current,
        checking: false,
        error:
          error instanceof Error
            ? error.message
            : 'Gagal memeriksa status pembayaran.',
        success: silent ? current.success : '',
      }))

      return null
    } finally {
      paymentStatusSyncRef.current = false
    }
  }

  useEffect(() => {
    const { body } = document
    const isAnyModalOpen = isPaymentModalOpen || isSnapModalOpen || isPaymentSuccessPopupOpen

    body.style.overflow = isAnyModalOpen ? 'hidden' : ''

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPaymentModalOpen(false)
        setIsSnapModalOpen(false)
        setIsPaymentSuccessPopupOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPaymentModalOpen, isPaymentSuccessPopupOpen, isSnapModalOpen])

  useEffect(() => {
    if (!latestPayment?.orderId || isTerminalPaymentStatus(latestPayment.status)) {
      return undefined
    }

    syncLatestPaymentStatus({
      payment: latestPayment,
      silent: true,
      source: 'auto',
    }).catch(() => null)

    const intervalId = window.setInterval(() => {
      syncLatestPaymentStatus({
        payment: latestPayment,
        silent: true,
        source: 'auto',
      }).catch(() => null)
    }, 10000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [
    authUser?.email,
    latestPayment?.amount,
    latestPayment?.customerEmail,
    latestPayment?.customerName,
    latestPayment?.customerPhone,
    latestPayment?.loggedInUser,
    latestPayment?.orderId,
    latestPayment?.packageName,
    latestPayment?.redirectUrl,
    latestPayment?.status,
  ])

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const items = await fetchTestimonials()

        setUserTestimonials(
          items
            .map((item, index) => normalizeTestimonialItem(item, index))
            .filter((item) => item.quote),
        )
        setTestimonialStatus((current) => ({
          ...current,
          loading: false,
          error: '',
        }))
      } catch {
        setTestimonialStatus((current) => ({
          ...current,
          loading: false,
          error: 'Gagal memuat testimoni dari API.',
        }))
      }
    }

    loadTestimonials()
  }, [])

  useEffect(() => {
    if (!isSnapModalOpen || !latestPayment?.token) {
      return undefined
    }

    let isActive = true

    const embedSnap = async () => {
      try {
        const snap = await loadMidtransSnap()

        if (!isActive) {
          return
        }

        const container = document.getElementById(snapEmbedContainerId)

        if (!container) {
          return
        }

        container.innerHTML = ''

        if (typeof snap.embed === 'function') {
          snap.embed(latestPayment.token, {
            embedId: snapEmbedContainerId,
            onSuccess: (result) => {
              const paidPayment = {
                ...latestPayment,
                status: result?.transaction_status || 'settlement',
              }

              persistLatestPayment(paidPayment)
              setIsSnapModalOpen(false)
              setPaymentStatus({
                submitting: false,
                checking: false,
                error: '',
                success: 'Pembayaran berhasil diselesaikan.',
              })
              syncLatestPaymentStatus({
                payment: paidPayment,
                silent: true,
                source: 'callback',
              }).catch(() => null)
            },
            onPending: (result) => {
              const pendingPayment = {
                ...latestPayment,
                status: result?.transaction_status || 'pending',
              }

              persistLatestPayment(pendingPayment)
              setPaymentStatus({
                submitting: false,
                checking: false,
                error: '',
                success: 'Pembayaran masih menunggu penyelesaian.',
              })
              syncLatestPaymentStatus({
                payment: pendingPayment,
                silent: true,
                source: 'callback',
              }).catch(() => null)
            },
            onError: () => {
              setPaymentStatus({
                submitting: false,
                checking: false,
                error: 'Snap pembayaran gagal dimuat di dalam modal.',
                success: '',
              })
            },
            onClose: () => {
              setIsSnapModalOpen(false)
              setPaymentStatus({
                submitting: false,
                checking: false,
                error: '',
                success:
                  'Popup ditutup. Anda masih bisa lanjut bayar atau cek status dari kartu transaksi terakhir.',
              })
            },
          })

          return
        }

        setIsSnapModalOpen(false)
        snap.pay(latestPayment.token, {
          onSuccess: (result) => {
            const paidPayment = {
              ...latestPayment,
              status: result?.transaction_status || 'settlement',
            }

            persistLatestPayment(paidPayment)
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success: 'Pembayaran berhasil diselesaikan.',
            })
            syncLatestPaymentStatus({
              payment: paidPayment,
              silent: true,
              source: 'callback',
            }).catch(() => null)
          },
          onPending: (result) => {
            const pendingPayment = {
              ...latestPayment,
              status: result?.transaction_status || 'pending',
            }

            persistLatestPayment(pendingPayment)
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success: 'Pembayaran masih menunggu penyelesaian.',
            })
            syncLatestPaymentStatus({
              payment: pendingPayment,
              silent: true,
              source: 'callback',
            }).catch(() => null)
          },
          onError: () => {
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: 'Popup pembayaran gagal dibuka atau transaksi bermasalah.',
              success: '',
            })
          },
          onClose: () => {
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success:
                'Popup ditutup. Anda masih bisa lanjut bayar atau cek status dari kartu transaksi terakhir.',
            })
          },
        })
      } catch (error) {
        setIsSnapModalOpen(false)
        setPaymentStatus({
          submitting: false,
          checking: false,
          error: error instanceof Error ? error.message : 'Gagal memuat Snap pembayaran.',
          success: '',
        })
      }
    }

    embedSnap()

    return () => {
      isActive = false

      if (window.snap?.hide) {
        window.snap.hide()
      }
    }
  }, [isSnapModalOpen, latestPayment, snapEmbedContainerId])

  useEffect(() => {
    const section = testimonialSectionRef.current
    const rail = testimonialRailRef.current

    if (!section || !rail || userTestimonials.length < 2) {
      return undefined
    }

    let intervalId = null
    let resumeTimeoutId = null

    const stopAutoSwipe = () => {
      if (intervalId) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    const startAutoSwipe = () => {
      stopAutoSwipe()

      intervalId = window.setInterval(() => {
        const maxScrollLeft = rail.scrollWidth - rail.clientWidth
        const card = rail.querySelector('.testimonial-card')
        const step = card ? card.getBoundingClientRect().width + 16 : 320
        const nextScrollLeft = rail.scrollLeft + step

        if (nextScrollLeft >= maxScrollLeft - 8) {
          rail.scrollTo({ left: 0, behavior: 'smooth' })
          return
        }

        rail.scrollTo({ left: nextScrollLeft, behavior: 'smooth' })
      }, 2600)
    }

    const pauseAndResumeAutoSwipe = () => {
      stopAutoSwipe()

      if (resumeTimeoutId) {
        window.clearTimeout(resumeTimeoutId)
      }

      resumeTimeoutId = window.setTimeout(() => {
        startAutoSwipe()
      }, 2400)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAutoSwipe()
          } else {
            stopAutoSwipe()
          }
        })
      },
      {
        threshold: 0.45,
      },
    )

    observer.observe(section)
    rail.addEventListener('pointerdown', pauseAndResumeAutoSwipe)
    rail.addEventListener('touchstart', pauseAndResumeAutoSwipe, { passive: true })
    rail.addEventListener('wheel', pauseAndResumeAutoSwipe, { passive: true })

    return () => {
      observer.disconnect()
      stopAutoSwipe()
      if (resumeTimeoutId) {
        window.clearTimeout(resumeTimeoutId)
      }
      rail.removeEventListener('pointerdown', pauseAndResumeAutoSwipe)
      rail.removeEventListener('touchstart', pauseAndResumeAutoSwipe)
      rail.removeEventListener('wheel', pauseAndResumeAutoSwipe)
    }
  }, [userTestimonials.length])

  const handleTestimonialChange = (event) => {
    const { name, value } = event.target
    setTestimonialForm((current) => ({ ...current, [name]: value }))
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setAuthForm((current) => ({ ...current, [name]: value }))
  }

  const handlePaymentInputChange = (event) => {
    const { name, value } = event.target
    setPaymentForm((current) => ({ ...current, [name]: value }))
  }

  const handleSelectPackage = (packageCode) => {
    setSelectedPackageCode(packageCode)

    if (!authUser) {
      setIsPaymentModalOpen(false)
      setActiveTab('login')
      setAuthStatus({
        submitting: false,
        error: 'Silakan login terlebih dahulu sebelum memilih paket.',
        success: '',
      })
      document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setIsPaymentModalOpen(true)
  }

  const handleLogout = () => {
    const previousUser = authUser

    window.localStorage.removeItem('joinourday-auth-user')
    setAuthUser(null)
    setAuthIdentity('')
    setPaymentForm((current) => ({
      ...current,
      customerName: '',
      email: '',
    }))
    setAuthStatus({
      submitting: false,
      error: '',
      success: 'Anda sudah logout.',
    })
    setActiveTab('login')

    if (previousUser?.email) {
      writeAuthLog({
        type: 'logout',
        userEmail: previousUser.email,
        userName: previousUser.name || '',
        loggedInAt: previousUser.loggedInAt || null,
      }).catch(swallowLogError('logout'))
    }
  }

  const handleTestimonialSubmit = async (event) => {
    event.preventDefault()

    const name = testimonialForm.name.trim()
    const role = testimonialForm.role.trim() || 'Pengguna JOINOURDAY'
    const quote = testimonialForm.quote.trim()

    if (!name || !quote) {
      setTestimonialStatus((current) => ({
        ...current,
        error: 'Nama dan testimoni wajib diisi.',
        success: '',
      }))
      return
    }

    try {
      setTestimonialStatus((current) => ({
        ...current,
        submitting: true,
        error: '',
        success: '',
      }))

      await createTestimonial({
        nama: name,
        peran: role,
        testimoni: quote,
      })

      setUserTestimonials((current) => [
        {
          id: `local-${Date.now()}`,
          name,
          role,
          quote,
          avatar: createInitials(name),
        },
        ...current,
      ])
      setTestimonialForm({
        name: '',
        role: '',
        quote: '',
      })
      setTestimonialStatus((current) => ({
        ...current,
        submitting: false,
        success: 'Testimoni berhasil dikirim.',
      }))
    } catch {
      setTestimonialStatus((current) => ({
        ...current,
        submitting: false,
        success: '',
        error: 'Gagal mengirim testimoni ke API.',
      }))
    }
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    const name = authForm.name.trim()
    const email = authForm.email.trim()
    const password = authForm.password.trim()

    if (!email || !password || (activeTab === 'register' && !name)) {
      setAuthStatus({
        submitting: false,
        error: activeTab === 'register'
          ? 'Nama, email, dan password wajib diisi.'
          : 'Email dan password wajib diisi.',
        success: '',
      })
      return
    }

    try {
      setAuthStatus({
        submitting: true,
        error: '',
        success: '',
      })

      const payload = activeTab === 'register'
        ? await registerUser({ nama: name, email, password })
        : await loginUser({ email, password })

      const identity = getAuthIdentity(payload, email)

      setAuthIdentity(identity)

      if (activeTab === 'register') {
        setAuthStatus({
          submitting: false,
          error: '',
          success: `${getAuthSuccessMessage(payload, 'Registrasi berhasil.')} Silakan login.`,
        })
        setAuthForm({
          name: '',
          email,
          password: '',
        })
        setActiveTab('login')
        return
      }

      const nextAuthUser = {
        ...getAuthUser(payload, '', email),
        loggedInAt: new Date().toISOString(),
      }

      window.localStorage.setItem('joinourday-auth-user', JSON.stringify(nextAuthUser))
      setAuthUser(nextAuthUser)
      setPaymentForm((current) => ({
        ...current,
        customerName: current.customerName || nextAuthUser.name || '',
        email: current.email || nextAuthUser.email || '',
      }))
      setAuthStatus({
        submitting: false,
        error: '',
        success: getAuthSuccessMessage(payload, 'Login berhasil.'),
      })
      setAuthForm((current) => ({
        ...current,
        password: '',
      }))

      writeAuthLog({
        type: 'login',
        userEmail: nextAuthUser.email || email,
        userName: nextAuthUser.name || '',
        loggedInAt: nextAuthUser.loggedInAt,
      }).catch(swallowLogError('login'))
    } catch (error) {
      setAuthStatus({
        submitting: false,
        error: error instanceof Error ? error.message : 'Autentikasi gagal.',
        success: '',
      })
    }
  }

  const handlePaymentSubmit = async (event) => {
    event.preventDefault()

    if (paymentStatus.submitting) {
      return
    }

    const customerName = paymentForm.customerName.trim()
    const email = paymentForm.email.trim()
    const phone = paymentForm.phone.trim()

    if (!selectedPackage || !customerName || !email || !phone) {
      setPaymentStatus({
        submitting: false,
        checking: false,
        error: 'Paket, nama, email, dan nomor WhatsApp wajib diisi.',
        success: '',
      })
      return
    }

    const orderId = buildOrderId(selectedPackage.code)
    const paymentAttemptId = latestPaymentAttemptRef.current + 1
    latestPaymentAttemptRef.current = paymentAttemptId
    const isLatestPaymentAttempt = () => latestPaymentAttemptRef.current === paymentAttemptId

    try {
      setPaymentStatus({
        submitting: true,
        checking: false,
        error: '',
        success: '',
      })

      const response = await createMidtransTransaction({
        orderId,
        order_id: orderId,
        packageCode: selectedPackage.code,
        packageName: selectedPackage.name,
        amount: selectedPackage.amount,
        grossAmount: selectedPackage.amount,
        gross_amount: selectedPackage.amount,
        itemDetails: [
          {
            id: selectedPackage.code,
            name: selectedPackage.name,
            price: selectedPackage.amount,
            quantity: 1,
          },
        ],
        item_details: [
          {
            id: selectedPackage.code,
            name: selectedPackage.name,
            price: selectedPackage.amount,
            quantity: 1,
          },
        ],
        transactionDetails: {
          orderId,
          grossAmount: selectedPackage.amount,
        },
        transaction_details: {
          order_id: orderId,
          gross_amount: selectedPackage.amount,
        },
        customerDetails: {
          first_name: customerName,
          email,
          phone,
        },
        customer_details: {
          first_name: customerName,
          email,
          phone,
        },
        metadata: {
          notes: paymentForm.notes.trim(),
          source: 'joinourday-web',
          loggedInUser: authUser?.email || null,
        },
      })

      if (!isLatestPaymentAttempt()) {
        return
      }

      const transaction = getPaymentTransaction(response)
      const token = transaction?.token ?? response?.token
      const redirectUrl = transaction?.redirectUrl ?? transaction?.redirect_url ?? response?.redirectUrl
      const nextPayment = {
        orderId,
        packageName: selectedPackage.name,
        amount: selectedPackage.amount,
        customerName,
        customerEmail: email,
        customerPhone: phone,
        loggedInUser: authUser?.email || null,
        token: token || '',
        redirectUrl: redirectUrl || '',
        status: 'pending',
      }

      persistLatestPayment(nextPayment)
      setPaymentStatus({
        submitting: false,
        checking: false,
        error: '',
        success: `Token pembayaran berhasil dibuat untuk order ${orderId}.`,
      })

      writePaymentLog({
        orderId,
        type: 'token_created',
        paymentStatus: 'pending',
        packageCode: selectedPackage.code,
        packageName: selectedPackage.name,
        amount: selectedPackage.amount,
        customerName,
        customerEmail: email,
        customerPhone: phone,
        notes: paymentForm.notes.trim(),
        loggedInUser: authUser?.email || null,
        redirectUrl: redirectUrl || '',
      }).catch(swallowLogError('token pembayaran'))

      if (token) {
        const snap = await loadMidtransSnap()

        if (!isLatestPaymentAttempt()) {
          return
        }

        snap.pay(token, {
          onSuccess: (result) => {
            if (!isLatestPaymentAttempt()) {
              return
            }

            const paidPayment = {
              ...nextPayment,
              status: result?.transaction_status || 'settlement',
            }
            persistLatestPayment(paidPayment)
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success: 'Pembayaran berhasil diselesaikan.',
            })

            writePaymentLog({
              orderId,
              type: 'payment_success',
              paymentStatus: result?.transaction_status || 'settlement',
              fraudStatus: result?.fraud_status || '',
              packageCode: selectedPackage.code,
              packageName: selectedPackage.name,
              amount: selectedPackage.amount,
              customerName,
              customerEmail: email,
              customerPhone: phone,
              loggedInUser: authUser?.email || null,
              transactionId: result?.transaction_id || '',
            }).catch(swallowLogError('status pembayaran sukses'))

            syncLatestPaymentStatus({
              payment: paidPayment,
              silent: true,
              source: 'callback',
            }).catch(() => null)
          },
          onPending: (result) => {
            if (!isLatestPaymentAttempt()) {
              return
            }

            const pendingPayment = {
              ...nextPayment,
              status: result?.transaction_status || 'pending',
            }
            persistLatestPayment(pendingPayment)
            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success: 'Pembayaran masih menunggu penyelesaian.',
            })

            writePaymentLog({
              orderId,
              type: 'payment_pending',
              paymentStatus: result?.transaction_status || 'pending',
              fraudStatus: result?.fraud_status || '',
              packageCode: selectedPackage.code,
              packageName: selectedPackage.name,
              amount: selectedPackage.amount,
              customerName,
              customerEmail: email,
              customerPhone: phone,
              loggedInUser: authUser?.email || null,
              transactionId: result?.transaction_id || '',
            }).catch(swallowLogError('status pembayaran pending'))

            syncLatestPaymentStatus({
              payment: pendingPayment,
              silent: true,
              source: 'callback',
            }).catch(() => null)
          },
          onError: () => {
            if (!isLatestPaymentAttempt()) {
              return
            }

            setPaymentStatus({
              submitting: false,
              checking: false,
              error: 'Popup pembayaran gagal dibuka atau transaksi bermasalah.',
              success: '',
            })

            writePaymentLog({
              orderId,
              type: 'payment_error',
              paymentStatus: 'error',
              packageCode: selectedPackage.code,
              packageName: selectedPackage.name,
              amount: selectedPackage.amount,
              customerName,
              customerEmail: email,
              customerPhone: phone,
              loggedInUser: authUser?.email || null,
            }).catch(swallowLogError('status pembayaran error'))
          },
          onClose: () => {
            if (!isLatestPaymentAttempt()) {
              return
            }

            setPaymentStatus({
              submitting: false,
              checking: false,
              error: '',
              success:
                'Popup ditutup. Anda masih bisa lanjut bayar atau cek status dari kartu transaksi terakhir.',
            })

            writePaymentLog({
              orderId,
              type: 'payment_popup_closed',
              paymentStatus: 'pending',
              packageCode: selectedPackage.code,
              packageName: selectedPackage.name,
              amount: selectedPackage.amount,
              customerName,
              customerEmail: email,
              customerPhone: phone,
              loggedInUser: authUser?.email || null,
            }).catch(swallowLogError('penutupan popup pembayaran'))
          },
        })

        return
      }

      if (redirectUrl) {
        if (!isLatestPaymentAttempt()) {
          return
        }

        window.location.assign(redirectUrl)
        return
      }

      setPaymentStatus({
        submitting: false,
        checking: false,
        error: 'Backend tidak mengembalikan token atau redirectUrl pembayaran.',
        success: '',
      })
    } catch (error) {
      if (!isLatestPaymentAttempt()) {
        return
      }

      setPaymentStatus({
        submitting: false,
        checking: false,
        error: error instanceof Error ? error.message : 'Gagal membuat transaksi pembayaran.',
        success: '',
      })

      writePaymentLog({
        orderId,
        type: 'payment_request_failed',
        paymentStatus: 'failed',
        packageCode: selectedPackage?.code || '',
        packageName: selectedPackage?.name || '',
        amount: selectedPackage?.amount || 0,
        customerName,
        customerEmail: email,
        customerPhone: phone,
        notes: paymentForm.notes.trim(),
        loggedInUser: authUser?.email || null,
        errorMessage: error instanceof Error ? error.message : 'Gagal membuat transaksi pembayaran.',
      }).catch(swallowLogError('pembuatan transaksi'))
    }
  }

  const handleResumePayment = () => {
    if (!latestPayment?.orderId) {
      return
    }

    setPaymentStatus({
      submitting: false,
      checking: false,
      error: '',
      success: '',
    })

    if (latestPayment.token) {
      setIsSnapModalOpen(true)
      return
    }

    if (latestPayment.redirectUrl) {
      window.location.assign(latestPayment.redirectUrl)
      return
    }

    if (!latestPayment.token) {
      setPaymentStatus({
        submitting: false,
        checking: false,
        error: 'Redirect pembayaran tidak tersedia untuk transaksi terakhir ini.',
        success: '',
      })
    }
  }

  const handleCheckLatestPaymentStatus = async () => {
    if (!latestPayment?.orderId || paymentStatus.checking) {
      return
    }

    await syncLatestPaymentStatus({
      payment: latestPayment,
      silent: false,
      source: 'manual',
      showChecking: true,
    })
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#beranda">
          <span className="brand-mark">
            <img src={logoMark} alt="JOINOURDAY logo" />
          </span>
          <span className="brand-text">
            <strong>JOINOURDAY</strong>
            <small>Digital Invitation Studio</small>
          </span>
        </a>

        <button
          className={`menu-toggle${isMobileNavOpen ? ' active' : ''}`}
          type="button"
          aria-expanded={isMobileNavOpen}
          aria-controls="primary-navigation"
          aria-label={isMobileNavOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          onClick={() => setIsMobileNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`nav${isMobileNavOpen ? ' nav-open' : ''}`}
          id="primary-navigation"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={handleNavClick}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-section" id="beranda">
          <div className="hero-copy reveal">
            <span className="eyebrow">Undangan Digital untuk Hari Spesial</span>
            <h1>Buat Undangan Digital Spesialmu dengan JOINOURDAY</h1>
            <p>
              Platform undangan digital modern untuk berbagai kebutuhan acara
              dengan desain elegan, fitur lengkap, dan pengalaman yang mudah untuk
              Anda maupun tamu.
            </p>
            <div className="hero-event-meta">
              <strong>Jakarta, Indonesia</strong>
              <span>Undangan digital elegan dengan RSVP otomatis dan tema siap pakai.</span>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="#tema">
                Lihat Tema
              </a>
              <a className="button button-secondary" href="#auth">
                Mulai Sekarang
              </a>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>1200+</strong>
                <span>Undangan dibuat</span>
              </div>
              <div>
                <strong>3 tema populer</strong>
                <span>Siap pakai dan mudah disesuaikan</span>
              </div>
              <div>
                <strong>Template premium</strong>
                <span>Tampilan rapi untuk desktop dan mobile</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay">
            <div className="hero-phone-stack">
              <div className="phone-mockup phone-mockup-left">
                <div className="mockup-notch" />
                <div className="mockup-screen mockup-screen-cover">
                  <div
                    className="mockup-photo mockup-photo-cover"
                    style={{ '--mockup-image': `url(${demoImageOne})` }}
                  >
                    <div className="mockup-cover-copy">
                      <h2>Amara &amp; Bima</h2>
                      <p>Saturday, 21 September 2026</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone-mockup phone-mockup-right">
                <div className="mockup-notch" />
                <div className="mockup-screen mockup-screen-editorial">
                  <div
                    className="mockup-photo mockup-photo-editorial"
                    style={{ '--mockup-image': `url(${demoImageTwo})` }}
                  />
                  <div className="mockup-card">
                    <span>Event Invitation</span>
                    <strong>Jakarta, Indonesia</strong>
                    <p>Desain bersih, modern, dan mudah disesuaikan untuk hari spesial.</p>
                  </div>
                </div>
              </div>
              <div className="floating-card card-one">
                <strong>RSVP 186 tamu</strong>
                <span>Konfirmasi hadir masuk otomatis</span>
              </div>
              <div className="floating-card card-two">
                <strong>3 tema populer</strong>
                <span>Siap pakai dan mudah disesuaikan</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="tentang">
          <div className="section-heading reveal">
            <span className="eyebrow">Tentang JOINOURDAY</span>
            <h2>Undangan digital yang ringkas, berkelas, dan relevan untuk momen spesial.</h2>
          </div>

          <div className="about-grid">
            <article className="info-card reveal">
              <h3>Apa itu JOINOURDAY</h3>
              <p>
                JOINOURDAY adalah layanan pembuatan undangan digital untuk
                seminar, ulang tahun, gathering, syukuran, peluncuran produk,
                dan acara spesial lainnya
                dengan pendekatan desain modern dan pengalaman pengguna yang rapi.
              </p>
            </article>
            <article className="info-card reveal">
              <h3>Praktis &amp; Modern</h3>
              <p>
                Bagikan undangan hanya lewat link, kelola tamu lebih cepat, dan
                tampilkan identitas acara secara lebih personal.
              </p>
            </article>
            <article className="info-card reveal">
              <h3>Hemat Biaya</h3>
              <p>
                Kurangi biaya cetak dan distribusi tanpa mengorbankan kesan
                elegan pada undangan Anda.
              </p>
            </article>
            <article className="info-card reveal">
              <h3>Ramah Lingkungan</h3>
              <p>
                Solusi yang lebih berkelanjutan karena meminimalkan penggunaan
                kertas untuk acara yang tetap berkesan.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="tema">
          <div className="section-heading reveal">
            <span className="eyebrow">Template Undangan</span>
            <h2>Pilih tema yang sesuai dengan karakter acara Anda.</h2>
          </div>

          <div className="theme-grid">
            {themes.map((theme) => (
              <article key={theme.name} className="theme-panel reveal">
                <div
                  className={theme.accent}
                  style={{ '--theme-preview-image': `url(${theme.image})` }}
                >
                  <div className="theme-frame">
                    <span>{theme.tag}</span>
                    <strong>{theme.name}</strong>
                  </div>
                </div>
                <div className="theme-content">
                  <div>
                    <h3>{theme.name}</h3>
                    <p>{theme.tag}</p>
                  </div>
                  <a className="button button-secondary" href={`#demo/${theme.id}`}>
                    Lihat Demo
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section" id="paket">
          <div className="section-heading reveal">
            <span className="eyebrow">Harga &amp; Paket</span>
            <h2>Paket fleksibel untuk kebutuhan acara yang berbeda.</h2>
          </div>

          <div className="pricing-grid">
            {packages.map((item) => (
              <article
                key={item.name}
                className={`pricing-card reveal${item.featured ? ' featured' : ''}`}
              >
                {item.badge ? <span className="pricing-badge">{item.badge}</span> : null}
                <h3>{item.name}</h3>
                <p className="pricing-kicker">{item.kicker}</p>
                <div className="price">{item.price}</div>
                <p>{item.description}</p>
                <p className="pricing-ideal">{item.idealFor}</p>
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`button ${item.featured ? 'button-primary' : 'button-secondary'}`}
                  type="button"
                  onClick={() => handleSelectPackage(item.code)}
                >
                  {item.ctaLabel}
                </button>
              </article>
            ))}
          </div>
          <div className="pricing-swipe-indicator" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          {latestPayment?.orderId ? (
            <article className="payment-card reveal">
              <div className="payment-card-header">
                <div>
                  <span className="auth-user-label">Transaksi Terakhir</span>
                  <h3>Pembayaran terakhir akun ini.</h3>
                  <p>
                    Order ID: {latestPayment.orderId}. Gunakan tombol lanjut bayar jika transaksi
                    belum selesai, atau perbarui status jika Anda sudah membayar di popup/bank.
                  </p>
                </div>
                <span className={`status-chip ${latestPaymentStatus}`}>
                  {latestPaymentStatusLabel}
                </span>
              </div>

              <div className="payment-card-meta">
                <div>
                  <span className="payment-package-name">Paket</span>
                  <strong>{latestPayment.packageName || '-'}</strong>
                </div>
                <div>
                  <span className="payment-package-name">Total</span>
                  <strong>{formatCurrency(latestPayment.amount)}</strong>
                </div>
                <div>
                  <span className="payment-package-name">Atas nama</span>
                  <strong>{latestPayment.customerName || latestPayment.customerEmail || '-'}</strong>
                </div>
              </div>

              <div className="payment-modal-actions payment-card-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={handleResumePayment}
                  disabled={paymentStatus.checking || latestPaymentStatus === 'settlement'}
                >
                  {latestPaymentStatus === 'settlement' ? 'Sudah Dibayar' : 'Lanjut Bayar'}
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={handleCheckLatestPaymentStatus}
                  disabled={paymentStatus.checking}
                >
                  {paymentStatus.checking ? 'Memeriksa...' : 'Perbarui Status'}
                </button>
              </div>
            </article>
          ) : null}
        </section>

        <section className="section" id="fitur">
          <div className="section-heading reveal">
            <span className="eyebrow">Fitur Unggulan</span>
            <h2>Fungsionalitas penting yang membuat undangan lebih hidup.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card reveal">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section ref={testimonialSectionRef} className="section" id="testimoni">
          <div className="section-heading reveal">
            <span className="eyebrow">Testimoni</span>
            <h2>Pengalaman pengguna yang merasa proses undangannya jadi lebih mudah.</h2>
          </div>

          <div className="testimonial-form-wrap reveal">
            <form className="testimonial-form" onSubmit={handleTestimonialSubmit}>
              <div className="testimonial-form-grid">
                <label>
                  <span>Nama</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Nama Anda"
                    value={testimonialForm.name}
                    onChange={handleTestimonialChange}
                  />
                </label>
                <label>
                  <span>Status / Peran</span>
                  <input
                    name="role"
                    type="text"
                    placeholder="Contoh: Pengantin"
                    value={testimonialForm.role}
                    onChange={handleTestimonialChange}
                  />
                </label>
              </div>
              <label>
                <span>Testimoni</span>
                <textarea
                  name="quote"
                  rows="4"
                  placeholder="Tulis pengalaman Anda menggunakan JOINOURDAY"
                  value={testimonialForm.quote}
                  onChange={handleTestimonialChange}
                />
              </label>
              <button
                className="button button-primary"
                type="submit"
                disabled={testimonialStatus.submitting}
              >
                {testimonialStatus.submitting ? 'Mengirim...' : 'Kirim Testimoni'}
              </button>
              {testimonialStatus.loading ? (
                <p className="testimonial-feedback">Memuat testimoni dari API...</p>
              ) : null}
              {testimonialStatus.success ? (
                <p className="testimonial-feedback success">{testimonialStatus.success}</p>
              ) : null}
              {testimonialStatus.error ? (
                <p className="testimonial-feedback error">{testimonialStatus.error}</p>
              ) : null}
            </form>
          </div>

          <div className="testimonial-rail-head reveal">
            <span className="eyebrow">Swipe Testimoni</span>
            <p>Geser ke samping atau tunggu rail bergerak otomatis saat bagian ini terlihat.</p>
          </div>

          <div ref={testimonialRailRef} className="testimonial-rail" aria-label="Daftar testimoni">
            {userTestimonials.map((testimonial, index) => (
              <article
                key={testimonial.id ?? `${testimonial.name}-${testimonial.role}`}
                className={`testimonial-card testimonial-card-rail testimonial-card-tone-${index % 3}`}
              >
                <div className="testimonial-head">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div>
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </article>
            ))}
            {!testimonialStatus.loading && !testimonialStatus.error && !userTestimonials.length ? (
              <article className="testimonial-card reveal">
                <div className="testimonial-head">
                  <div className="avatar">--</div>
                  <div>
                    <h3>Belum ada testimoni</h3>
                    <p>Jadilah yang pertama mengirimkan pengalaman Anda.</p>
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="section cta-section reveal">
          <div>
            <span className="eyebrow">Mulai Hari Spesialmu</span>
            <h2>Wujudkan undangan digital yang elegan, praktis, dan siap dibagikan hari ini.</h2>
          </div>
          <a className="button button-primary" href="#auth">
            Buat Undangan Sekarang
          </a>
        </section>

        <section className="section auth-section" id="auth">
          <div className="section-heading reveal">
            <span className="eyebrow">Registrasi &amp; Login</span>
            <h2>Mulai kelola undangan Anda dalam beberapa langkah sederhana.</h2>
          </div>

          <div className="auth-wrapper reveal">
            <div className="auth-intro">
              <h3>Kelola semua kebutuhan undangan dalam satu tempat.</h3>
              <p>
                Buat akun untuk mulai memilih tema, menyesuaikan detail acara,
                dan membagikan undangan ke tamu Anda dengan lebih cepat.
              </p>
              <ul>
                <li>Desain modern yang siap pakai</li>
                <li>Setup cepat untuk acara pribadi maupun profesional</li>
                <li>Optimalkan undangan untuk tampilan mobile</li>
              </ul>
            </div>

            <div className="auth-card">
              <div className={`auth-user-panel${authUser ? ' logged-in' : ''}`}>
                <span className="auth-user-label">
                  {authUser ? 'Status Login Aktif' : 'Status Login'}
                </span>
                {authUser ? (
                  <>
                    <strong>{authUser.name || 'Pengguna JOINOURDAY'}</strong>
                    <p>{authUser.email}</p>
                    <button className="button button-secondary" type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <strong>Belum login</strong>
                    <p>Daftar lalu masuk ke akun untuk mulai kelola undangan Anda.</p>
                  </>
                )}
              </div>

              <div className="tab-switch" role="tablist" aria-label="Registrasi dan login">
                <button
                  className={activeTab === 'register' ? 'active' : ''}
                  type="button"
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
                <button
                  className={activeTab === 'login' ? 'active' : ''}
                  type="button"
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {activeTab === 'register' ? (
                  <label>
                    <span>Nama</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={authForm.name}
                      onChange={handleAuthChange}
                    />
                  </label>
                ) : null}

                <label>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={authForm.email}
                    onChange={handleAuthChange}
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                  />
                </label>

                <button
                  className="button button-primary"
                  type="submit"
                  disabled={authStatus.submitting}
                >
                  {activeTab === 'register' ? 'Daftar Sekarang' : 'Masuk ke Akun'}
                </button>
                {authStatus.success ? (
                  <p className="auth-feedback success">
                    {authStatus.success}
                    {authIdentity && !authUser ? ` (${authIdentity})` : ''}
                  </p>
                ) : null}
                {authStatus.error ? (
                  <p className="auth-feedback error">{authStatus.error}</p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <a className="brand footer-brand" href="#beranda">
            <span className="brand-mark">
              <img src={logoMark} alt="JOINOURDAY logo" />
            </span>
            <span className="brand-text">
              <strong>JOINOURDAY</strong>
              <small>Elegant digital invitations</small>
            </span>
          </a>
          <p>
            Solusi undangan digital modern untuk berbagai acara personal maupun
            profesional.
          </p>
        </div>

        <div className="footer-links">
          <a href="#tentang">Tentang</a>
          <a href="#tema">Tema</a>
          <a href="#paket">Paket</a>
          <a href="#fitur">Fitur</a>
        </div>

        <div className="footer-social">
          <a href="/">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM17.5 6.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z"
                />
              </svg>
            </span>
            Instagram
          </a>
          <a href="/">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M13.5 21v-7h2.34l.35-2.73H13.5V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.76a19.4 19.4 0 0 0-2.1-.11c-2.08 0-3.5 1.27-3.5 3.6v2.02H8.33V14h2.36v7h2.81Z"
                />
              </svg>
            </span>
            Facebook
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M19.11 17.29c-.29-.15-1.71-.84-1.98-.93-.27-.1-.46-.15-.66.14-.2.29-.76.93-.93 1.12-.17.2-.34.22-.64.08-.29-.15-1.23-.45-2.35-1.43-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.16-.24-.58-.49-.49-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.29-1.03 1-1.03 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.14 4.99 4.41.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.71-.7 1.95-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z"
                />
                <path
                  fill="currentColor"
                  d="M27.29 4.69A15.88 15.88 0 0 0 16 0C7.18 0 .01 7.17 0 16c0 2.82.74 5.58 2.13 8L0 32l8.22-2.09A15.93 15.93 0 0 0 16 32c8.82 0 15.99-7.17 16-16 0-4.27-1.66-8.28-4.71-11.31ZM16 29.29a13.2 13.2 0 0 1-6.72-1.84l-.48-.28-4.88 1.24 1.3-4.75-.31-.49A13.18 13.18 0 0 1 2.71 16C2.71 8.67 8.67 2.71 16 2.71c3.55 0 6.88 1.38 9.39 3.89A13.19 13.19 0 0 1 29.29 16c0 7.33-5.96 13.29-13.29 13.29Z"
                />
              </svg>
            </span>
            WhatsApp
          </a>
          <a href="/">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14.5 3c.47 1.8 1.52 3.08 3.2 3.85A5.88 5.88 0 0 0 21 7.4v2.73a8.52 8.52 0 0 1-3.62-.84v5.17c0 3.6-2.77 6.54-6.38 6.54A6.45 6.45 0 0 1 4.5 14.6a6.46 6.46 0 0 1 8.17-6.24v2.86a3.74 3.74 0 1 0 1.83 3.23V3h0Z"
                />
              </svg>
            </span>
            TikTok
          </a>
        </div>

        <p className="footer-copy">(c) 2026 JOINOURDAY. All rights reserved.</p>
        <p className="footer-made-by">
          Made by{' '}
          <a
            href="https://riskisembiring.github.io/Portfolio/"
            target="_blank"
            rel="noreferrer"
          >
            Riski Sembiring
          </a>
        </p>
      </footer>

      <a
        className="floating-whatsapp"
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp JOINOURDAY"
      >
        <span className="floating-whatsapp-text">
          <span>Butuh bantuan?</span>
          <span>Chat admin</span>
        </span>
        <svg
          className="floating-whatsapp-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M19.11 17.29c-.29-.15-1.71-.84-1.98-.93-.27-.1-.46-.15-.66.14-.2.29-.76.93-.93 1.12-.17.2-.34.22-.64.08-.29-.15-1.23-.45-2.35-1.43-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.16-.24-.58-.49-.49-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.29-1.03 1-1.03 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.14 4.99 4.41.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.71-.7 1.95-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z"
          />
          <path
            fill="currentColor"
            d="M27.29 4.69A15.88 15.88 0 0 0 16 0C7.18 0 .01 7.17 0 16c0 2.82.74 5.58 2.13 8L0 32l8.22-2.09A15.93 15.93 0 0 0 16 32c8.82 0 15.99-7.17 16-16 0-4.27-1.66-8.28-4.71-11.31ZM16 29.29a13.2 13.2 0 0 1-6.72-1.84l-.48-.28-4.88 1.24 1.3-4.75-.31-.49A13.18 13.18 0 0 1 2.71 16C2.71 8.67 8.67 2.71 16 2.71c3.55 0 6.88 1.38 9.39 3.89A13.19 13.19 0 0 1 29.29 16c0 7.33-5.96 13.29-13.29 13.29Z"
          />
        </svg>
      </a>

      {isPaymentModalOpen ? (
        <div
          className="payment-modal-overlay"
          role="presentation"
          onClick={() => setIsPaymentModalOpen(false)}
        >
          <div
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <span className="auth-user-label">Checkout Paket</span>
                <h3 id="payment-modal-title">Pembayaran {selectedPackage?.name || 'Paket'}</h3>
                <p>{selectedPackage?.description}</p>
              </div>
              <button
                className="payment-modal-close"
                type="button"
                aria-label="Tutup modal pembayaran"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="payment-modal-summary">
              <div>
                <span className="payment-package-name">Paket dipilih</span>
                <strong>{selectedPackage?.name || '-'}</strong>
              </div>
              <strong>{selectedPackage?.price || '-'}</strong>
            </div>

            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <label>
                <span>Nama lengkap</span>
                <input
                  name="customerName"
                  type="text"
                  placeholder="Nama pembeli"
                  value={paymentForm.customerName}
                  onChange={handlePaymentInputChange}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={paymentForm.email}
                  onChange={handlePaymentInputChange}
                  disabled
                />
              </label>

              <label>
                <span>No. WhatsApp</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={paymentForm.phone}
                  onChange={handlePaymentInputChange}
                />
              </label>

              <label>
                <span>Catatan order</span>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Contoh: ingin tema golden untuk gathering kantor atau ulang tahun"
                  value={paymentForm.notes}
                  onChange={handlePaymentInputChange}
                />
              </label>

              <div className="payment-modal-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Nanti Saja
                </button>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={paymentStatus.submitting}
                >
                  {paymentStatus.submitting ? 'Membuat token...' : 'Bayar Sekarang'}
                </button>
              </div>

              {paymentStatus.success ? (
                <p className="auth-feedback success">{paymentStatus.success}</p>
              ) : null}
              {paymentStatus.error ? (
                <p className="auth-feedback error">{paymentStatus.error}</p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      {isSnapModalOpen ? (
        <div
          className="payment-modal-overlay payment-snap-overlay"
          role="presentation"
          onClick={() => setIsSnapModalOpen(false)}
        >
          <div
            className="payment-modal payment-snap-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-snap-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <span className="auth-user-label">Lanjutkan Pembayaran</span>
                <h3 id="payment-snap-title">Snap Checkout</h3>
                <p>
                  Selesaikan pembayaran untuk order {latestPayment?.orderId || '-'}
                </p>
              </div>
              <button
                className="payment-modal-close"
                type="button"
                aria-label="Tutup modal Snap"
                onClick={() => setIsSnapModalOpen(false)}
              >
                x
              </button>
            </div>

            <div className="payment-snap-shell">
              <div className="payment-snap-summary">
                <strong>{latestPayment?.packageName || 'Paket'}</strong>
                <span>{formatCurrency(latestPayment?.amount)}</span>
              </div>
              <div id={snapEmbedContainerId} className="payment-snap-container" />
            </div>
          </div>
        </div>
      ) : null}

      {isPaymentSuccessPopupOpen ? (
        <div
          className="payment-modal-overlay payment-success-overlay"
          role="presentation"
          onClick={() => setIsPaymentSuccessPopupOpen(false)}
        >
          <div
            className="payment-modal payment-success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <span className="auth-user-label">Pembayaran Berhasil</span>
                <h3 id="payment-success-title">Transaksi Anda sudah diterima</h3>
                <p>
                  Pembayaran untuk order {latestPayment?.orderId || '-'} berhasil diproses.
                </p>
              </div>
              <button
                className="payment-modal-close"
                type="button"
                aria-label="Tutup popup pembayaran berhasil"
                onClick={() => setIsPaymentSuccessPopupOpen(false)}
              >
                x
              </button>
            </div>

            <div className="payment-modal-summary payment-success-summary">
              <div>
                <span className="auth-user-label">Paket</span>
                <strong>{latestPayment?.packageName || '-'}</strong>
              </div>
              <div>
                <span className="auth-user-label">Total</span>
                <strong>{formatCurrency(latestPayment?.amount)}</strong>
              </div>
              <div>
                <span className="auth-user-label">Status</span>
                <strong>{latestPaymentStatusLabel}</strong>
              </div>
            </div>

            <div className="payment-success-body">
              <p>
                Terima kasih. Pembayaran sudah berhasil dan data transaksi Anda sudah tersimpan.
              </p>
            </div>

            <div className="payment-modal-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setIsPaymentSuccessPopupOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  )
}

function AdminPage() {
  const authUser = getStoredSessionAuthUser()
  const authEmail = String(authUser?.email || '').trim().toLowerCase()
  const isAuthorizedAdmin = authEmail === ADMIN_EMAIL
  const [isAdminNavOpen, setIsAdminNavOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [paymentLogs, setPaymentLogs] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedUserDetail, setSelectedUserDetail] = useState(null)
  const [usersPage, setUsersPage] = useState(1)
  const [paymentsPage, setPaymentsPage] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    limit: 20,
  })
  const [adminStatus, setAdminStatus] = useState({
    loading: true,
    loadingUserDetail: false,
    error: '',
  })

  useEffect(() => {
    if (!authUser) {
      window.location.hash = '#auth'
      return
    }

    if (!isAuthorizedAdmin) {
      window.location.hash = '#beranda'
    }
  }, [authUser, isAuthorizedAdmin])

  const loadAdminData = async (nextFilters = filters, nextUserId = selectedUserId) => {
    try {
      setAdminStatus({
        loading: true,
        loadingUserDetail: false,
        error: '',
      })

      const [usersPayload, paymentsPayload, authLogsPayload] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminPaymentHistory({
          status: nextFilters.status || undefined,
          limit: nextFilters.limit || undefined,
        }),
        fetchAuthLogs(200).catch(() => []),
      ])

      setUsers(mergeUsersWithLastLogin(normalizeAdminUsers(usersPayload), authLogsPayload))
      setPaymentLogs(normalizeAdminPayments(paymentsPayload))
      setAdminStatus((current) => ({
        ...current,
        loading: false,
        error: '',
      }))
    } catch (error) {
      setAdminStatus({
        loading: false,
        loadingUserDetail: false,
        error:
          error instanceof Error
            ? error.message
            : 'Gagal memuat data admin.',
      })
    }
  }

  useEffect(() => {
    if (!isAuthorizedAdmin) {
      return
    }

    loadAdminData()
  }, [isAuthorizedAdmin])

  useEffect(() => {
    if (!isAuthorizedAdmin) {
      return
    }

    if (!selectedUserId) {
      setSelectedUserDetail(null)
      return
    }

    const loadUserDetail = async () => {
      try {
        setAdminStatus((current) => ({
          ...current,
          loadingUserDetail: true,
          error: '',
        }))

        const payload = await fetchAdminUserDetail(selectedUserId)
        const user =
          payload?.user ??
          payload?.data?.user ??
          payload?.data ??
          payload

        setSelectedUserDetail(user)
        setAdminStatus((current) => ({
          ...current,
          loadingUserDetail: false,
        }))
      } catch (error) {
        setSelectedUserDetail(null)
        setAdminStatus((current) => ({
          ...current,
          loadingUserDetail: false,
          error: error instanceof Error ? error.message : 'Gagal memuat detail user.',
        }))
      }
    }

    loadUserDetail()
  }, [isAuthorizedAdmin, selectedUserId])

  if (!authUser) {
    return null
  }

  if (!isAuthorizedAdmin) {
    return null
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({
      ...current,
      [name]: name === 'limit' ? Number(value) : value,
    }))
  }

  const handleSelectedUserChange = (event) => {
    const nextUserId = event.target.value

    setSelectedUserId(nextUserId)
    setUsersPage(1)
    setPaymentsPage(1)
  }

  const handleApplyFilters = (event) => {
    event.preventDefault()
    setUsersPage(1)
    setPaymentsPage(1)
    loadAdminData(filters, selectedUserId)
  }

  const handleAdminNavAction = () => {
    setIsAdminNavOpen(false)
  }

  const displayedUsers = selectedUserId
    ? users.filter((item) => item.id === selectedUserId)
    : users

  const selectedUserRecord = users.find((item) => item.id === selectedUserId) || null
  const selectedUserEmailValue = String(
    selectedUserDetail?.email || selectedUserRecord?.email || '',
  ).toLowerCase()

  const displayedPaymentLogs = paymentLogs.filter((item) => {
    const itemUserId = String(item.userId || '')
    const loggedInUser = String(item.loggedInUser || '').toLowerCase()
    const customerEmail = String(item.customerEmail || '').toLowerCase()

    const matchesSelectedUser = !selectedUserId
      ? true
      : itemUserId === selectedUserId ||
        (selectedUserEmailValue
          ? loggedInUser === selectedUserEmailValue ||
            customerEmail === selectedUserEmailValue
          : false)

    return matchesSelectedUser
  })

  const totalUsersPages = Math.max(1, Math.ceil(displayedUsers.length / ADMIN_USERS_PAGE_SIZE))
  const totalPaymentsPages = Math.max(
    1,
    Math.ceil(displayedPaymentLogs.length / ADMIN_PAYMENTS_PAGE_SIZE),
  )
  const safeUsersPage = Math.min(usersPage, totalUsersPages)
  const safePaymentsPage = Math.min(paymentsPage, totalPaymentsPages)
  const paginatedUsers = displayedUsers.slice(
    (safeUsersPage - 1) * ADMIN_USERS_PAGE_SIZE,
    safeUsersPage * ADMIN_USERS_PAGE_SIZE,
  )
  const paginatedPaymentLogs = displayedPaymentLogs.slice(
    (safePaymentsPage - 1) * ADMIN_PAYMENTS_PAGE_SIZE,
    safePaymentsPage * ADMIN_PAYMENTS_PAGE_SIZE,
  )

  const selectedUserName =
    selectedUserDetail?.nama ||
    selectedUserDetail?.name ||
    selectedUserRecord?.name ||
    '-'

  const selectedUserEmail =
    selectedUserDetail?.email ||
    selectedUserRecord?.email ||
    '-'

  const successfulPaymentsCount = displayedPaymentLogs.filter((item) =>
    isSuccessfulPaymentStatus(item.paymentStatus),
  ).length
  const pendingPaymentsCount = displayedPaymentLogs.filter(
    (item) => normalizePaymentLifecycleStatus(item.paymentStatus) === 'pending',
  ).length
  const totalRevenue = displayedPaymentLogs.reduce((sum, item) => {
    if (!isSuccessfulPaymentStatus(item.paymentStatus)) {
      return sum
    }

    return sum + (Number(item.amount) || 0)
  }, 0)

  return (
    <div className="page-shell admin-shell">
      <header className="topbar">
        <a className="brand" href="#beranda">
          <span className="brand-mark">
            <img src={logoMark} alt="JOINOURDAY logo" />
          </span>
          <span className="brand-text">
            <strong>JOINOURDAY</strong>
            <small>Admin Monitor</small>
          </span>
        </a>

        <button
          className={`menu-toggle${isAdminNavOpen ? ' active' : ''}`}
          type="button"
          aria-expanded={isAdminNavOpen}
          aria-controls="admin-navigation"
          aria-label={isAdminNavOpen ? 'Tutup menu admin' : 'Buka menu admin'}
          onClick={() => setIsAdminNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`nav admin-nav${isAdminNavOpen ? ' nav-open' : ''}`}
          id="admin-navigation"
        >
          <a href="#beranda" onClick={handleAdminNavAction}>Landing</a>
          <a href="#auth" onClick={handleAdminNavAction}>Login</a>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              handleAdminNavAction()
              loadAdminData()
            }}
          >
            Refresh
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <section className="section admin-hero">
          <div className="admin-hero-panel reveal">
            <div className="admin-hero-copy">
              <span className="eyebrow">Admin Dashboard</span>
              <h2>Monitoring user dan transaksi dalam satu tampilan yang lebih rapi.</h2>
              <p>
                Ringkasan akun, status pembayaran, dan detail pengguna disusun ulang agar lebih
                cepat dipindai di desktop maupun mobile.
              </p>
            </div>

            <div className="admin-hero-highlight">
              <span className="admin-hero-highlight-label">User aktif dipilih</span>
              <strong>{selectedUserId ? selectedUserName : 'Semua user'}</strong>
              <p>
                {selectedUserId
                  ? selectedUserEmail
                  : `${displayedUsers.length} akun sedang ditampilkan di dashboard.`}
              </p>
            </div>
          </div>
        </section>

        <section className="admin-metrics reveal" aria-label="Ringkasan admin">
          <article className="admin-metric-card">
            <span>Total User</span>
            <strong>{displayedUsers.length}</strong>
            <p>Akun yang cocok dengan filter aktif.</p>
          </article>
          <article className="admin-metric-card admin-metric-card-success">
            <span>Pembayaran Sukses</span>
            <strong>{successfulPaymentsCount}</strong>
            <p>Transaksi dengan status settlement atau capture.</p>
          </article>
          <article className="admin-metric-card admin-metric-card-warn">
            <span>Menunggu Bayar</span>
            <strong>{pendingPaymentsCount}</strong>
            <p>Perlu dipantau untuk follow up atau refresh status.</p>
          </article>
          <article className="admin-metric-card admin-metric-card-accent">
            <span>Revenue Terkonfirmasi</span>
            <strong>{formatCurrency(totalRevenue)}</strong>
            <p>Total nominal dari transaksi yang sudah berhasil.</p>
          </article>
        </section>

        <section className="admin-toolbar">
          <div className="admin-toolbar-shell">
            <div className="admin-toolbar-heading">
              <span className="auth-user-label">Filter Dashboard</span>
              <h3>Atur data yang ingin ditampilkan</h3>
              <p>Pilih user, status transaksi, dan jumlah data untuk mempercepat pencarian.</p>
            </div>

            <form className="admin-filter-form" onSubmit={handleApplyFilters}>
              <label>
                <span>User</span>
                <select name="selectedUserId" value={selectedUserId} onChange={handleSelectedUserChange}>
                  <option value="">Semua user</option>
                  {users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.email}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">Semua status</option>
                  <option value="pending">pending</option>
                  <option value="settlement">settlement</option>
                  <option value="capture">capture</option>
                  <option value="deny">deny</option>
                  <option value="cancel">cancel</option>
                  <option value="expire">expire</option>
                  <option value="failed">failed</option>
                </select>
              </label>
              <label>
                <span>Limit</span>
                <select name="limit" value={filters.limit} onChange={handleFilterChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
              <button className="button button-primary" type="submit" disabled={adminStatus.loading}>
                {adminStatus.loading ? 'Memuat...' : 'Terapkan'}
              </button>
            </form>
          </div>
        </section>

        {adminStatus.error ? <p className="auth-feedback error">{adminStatus.error}</p> : null}

        <section className="admin-grid">
          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="auth-user-label">Akun</span>
                <h3>Daftar User</h3>
              </div>
              <strong>{displayedUsers.length}</strong>
            </div>

            {adminStatus.loading ? (
              <p className="admin-empty">Memuat data user...</p>
            ) : displayedUsers.length ? (
              <>
                <div className="admin-table-wrap">
                  <p className="admin-table-hint">Geser tabel ke samping untuk melihat kolom lainnya.</p>
                  <table className="admin-table admin-table-users">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((item) => (
                        <tr
                          key={item.id}
                          className={selectedUserId === item.id ? 'admin-row-selected' : ''}
                          onClick={() => setSelectedUserId(item.id)}
                        >
                          <td data-label="User ID">{item.id}</td>
                          <td data-label="Nama">{item.name || '-'}</td>
                          <td data-label="Email">{item.email || '-'}</td>
                          <td data-label="Role">{item.role || '-'}</td>
                          <td data-label="Last Login">{formatDateTime(item.lastLoginAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-pagination">
                  <p className="admin-pagination-info">
                    Menampilkan {(safeUsersPage - 1) * ADMIN_USERS_PAGE_SIZE + 1}-
                    {Math.min(safeUsersPage * ADMIN_USERS_PAGE_SIZE, displayedUsers.length)} dari{' '}
                    {displayedUsers.length} user
                  </p>
                  <div className="admin-pagination-controls">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => setUsersPage((current) => Math.max(1, current - 1))}
                      disabled={safeUsersPage === 1}
                    >
                      Sebelumnya
                    </button>
                    <span className="admin-pagination-page">
                      Halaman {safeUsersPage} / {totalUsersPages}
                    </span>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        setUsersPage((current) => Math.min(totalUsersPages, current + 1))
                      }
                      disabled={safeUsersPage === totalUsersPages}
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="admin-empty">Tidak ada user yang cocok dengan filter.</p>
            )}
          </article>

          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="auth-user-label">Pembayaran</span>
                <h3>History Transaksi</h3>
                <p className="admin-subtitle">
                  Menampilkan data pembayaran backend sesuai filter yang aktif.
                </p>
              </div>
              <strong>{displayedPaymentLogs.length}</strong>
            </div>

            {adminStatus.loading ? (
              <p className="admin-empty">Memuat data pembayaran...</p>
            ) : displayedPaymentLogs.length ? (
              <>
                <div className="admin-table-wrap">
                  <p className="admin-table-hint">Geser tabel ke samping untuk melihat kolom lainnya.</p>
                  <table className="admin-table admin-table-payments">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Order ID</th>
                        <th>Akun Login</th>
                        <th>Pembeli</th>
                        <th>Paket</th>
                        <th>Total</th>
                        <th>Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPaymentLogs.map((item) => (
                        <tr key={item.id}>
                          <td data-label="Status">
                            <span className={`status-chip ${item.paymentStatus || item.type || 'info'}`}>
                              {item.paymentStatus || item.type || '-'}
                            </span>
                          </td>
                          <td data-label="Order ID">{item.orderId || '-'}</td>
                          <td data-label="Akun Login">{item.loggedInUser || item.userId || '-'}</td>
                          <td data-label="Pembeli">{item.customerName || item.customerEmail || '-'}</td>
                          <td data-label="Paket">{item.packageName || '-'}</td>
                          <td data-label="Total">{item.amount ? `Rp${item.amount.toLocaleString('id-ID')}` : '-'}</td>
                          <td data-label="Waktu">{formatDateTime(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-pagination">
                  <p className="admin-pagination-info">
                    Menampilkan {(safePaymentsPage - 1) * ADMIN_PAYMENTS_PAGE_SIZE + 1}-
                    {Math.min(
                      safePaymentsPage * ADMIN_PAYMENTS_PAGE_SIZE,
                      displayedPaymentLogs.length,
                    )}{' '}
                    dari {displayedPaymentLogs.length} transaksi
                  </p>
                  <div className="admin-pagination-controls">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => setPaymentsPage((current) => Math.max(1, current - 1))}
                      disabled={safePaymentsPage === 1}
                    >
                      Sebelumnya
                    </button>
                    <span className="admin-pagination-page">
                      Halaman {safePaymentsPage} / {totalPaymentsPages}
                    </span>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        setPaymentsPage((current) => Math.min(totalPaymentsPages, current + 1))
                      }
                      disabled={safePaymentsPage === totalPaymentsPages}
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="admin-empty">Tidak ada history transaksi yang cocok dengan filter.</p>
            )}
          </article>
        </section>

        <section className="admin-grid admin-grid-single">
          <article className="admin-card">
            <div className="admin-card-header">
              <div>
                <span className="auth-user-label">Detail</span>
                <h3>User Terpilih</h3>
                {selectedUserId ? (
                  <p className="admin-subtitle">
                    {selectedUserName} ({selectedUserEmail})
                  </p>
                ) : null}
              </div>
            </div>

            {!selectedUserId ? (
              <p className="admin-empty">Pilih user dari tabel untuk melihat detail.</p>
            ) : adminStatus.loadingUserDetail ? (
              <p className="admin-empty">Memuat detail user...</p>
            ) : selectedUserDetail ? (
              <div className="admin-table-wrap">
                <p className="admin-table-hint">Geser tabel ke samping bila isi detail belum terlihat penuh.</p>
                <table className="admin-table admin-table-compact">
                  <tbody>
                    <tr>
                      <th>User ID</th>
                      <td data-label="User ID">{selectedUserDetail?.id || selectedUserDetail?._id || selectedUserId}</td>
                    </tr>
                    <tr>
                      <th>Nama</th>
                      <td data-label="Nama">{selectedUserDetail?.nama || selectedUserDetail?.name || '-'}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td data-label="Email">{selectedUserDetail?.email || '-'}</td>
                    </tr>
                    <tr>
                      <th>Role</th>
                      <td data-label="Role">{selectedUserDetail?.role || selectedUserDetail?.user_type || '-'}</td>
                    </tr>
                    <tr>
                      <th>Dibuat</th>
                      <td data-label="Dibuat">{formatDateTime(selectedUserDetail?.createdAt || selectedUserDetail?.created_at)}</td>
                    </tr>
                    <tr>
                      <th>Last Login</th>
                      <td data-label="Last Login">
                        {formatDateTime(
                          selectedUserDetail?.lastLoginAt ||
                            selectedUserDetail?.last_login_at ||
                            selectedUserDetail?.loggedInAt ||
                            selectedUserDetail?.loginAt ||
                            selectedUserDetail?.login_at ||
                            selectedUserDetail?.lastSeenAt ||
                            selectedUserDetail?.last_seen_at ||
                            selectedUserDetail?.lastSeen ||
                            selectedUserDetail?.last_seen,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="admin-empty">Detail user tidak tersedia.</p>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('register')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [routeHash, setRouteHash] = useState(() => window.location.hash || '#')
  const authUser = getStoredSessionAuthUser()
  const authEmail = String(authUser?.email || '').trim().toLowerCase()
  const isAuthorizedAdmin = authEmail === ADMIN_EMAIL

  useEffect(() => {
    const handleHashChange = () => {
      const nextHash = window.location.hash || '#'
      const targetId = decodeURIComponent(nextHash.replace(/^#/, ''))
      const shouldResetScroll =
        !targetId ||
        targetId === 'admin' ||
        targetId.startsWith('demo/') ||
        !document.getElementById(targetId)

      setRouteHash(nextHash)
      setIsMobileNavOpen(false)

      if (shouldResetScroll) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (routeHash !== '#admin') {
      return
    }

    if (!authUser) {
      setActiveTab('login')
      window.location.hash = '#auth'
      return
    }

    if (!isAuthorizedAdmin) {
      window.location.hash = '#beranda'
    }
  }, [authUser, isAuthorizedAdmin, routeHash])

  const navigateToHash = (hash, options = {}) => {
    const { behavior = 'smooth', fallbackToTop = false } = options
    const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`
    const targetId = decodeURIComponent(normalizedHash.replace(/^#/, ''))
    const targetElement = targetId ? document.getElementById(targetId) : null

    setIsMobileNavOpen(false)

    if (window.location.hash !== normalizedHash) {
      window.history.pushState(null, '', normalizedHash)
    }

    setRouteHash(normalizedHash)

    if (targetElement) {
      targetElement.scrollIntoView({ behavior, block: 'start' })
      return true
    }

    if (fallbackToTop) {
      window.scrollTo({ top: 0, behavior })
      return true
    }

    return false
  }

  const handleNavClick = (event) => {
    const href = event.currentTarget.getAttribute('href') || ''

    if (!href.startsWith('#')) {
      setIsMobileNavOpen(false)
      return
    }

    event.preventDefault()
    navigateToHash(href)
  }

  const demoId = routeHash.startsWith('#demo/') ? routeHash.replace('#demo/', '') : null
  const selectedTheme = demoId ? themes.find((theme) => theme.id === demoId) : null

  if (selectedTheme) {
    return <DemoPage theme={selectedTheme} />
  }

  if (routeHash === '#admin' && isAuthorizedAdmin) {
    return <AdminPage />
  }

  return (
    <LandingPage
      activeTab={activeTab}
      handleNavClick={handleNavClick}
      isMobileNavOpen={isMobileNavOpen}
      setActiveTab={setActiveTab}
      setIsMobileNavOpen={setIsMobileNavOpen}
    />
  )
}

export default App
