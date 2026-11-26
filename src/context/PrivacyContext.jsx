import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { policyMeta, policySections } from '../lib/privacyPolicy'

const STORAGE_KEY = 'wones_cookie_consent' // 'all' | 'essential'

const PrivacyContext = createContext({ openPolicy: () => {} })
export const usePrivacy = () => useContext(PrivacyContext)

const readConsent = () => {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}
const saveConsent = (value) => {
  try { localStorage.setItem(STORAGE_KEY, value) } catch { /* private mode: just don't remember */ }
}

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const PolicyBody = () => (
  <div className='text-[13px] md:text-sm leading-relaxed text-gray-600 space-y-8'>
    {policySections.map((section) => (
      <section key={section.title} id={`privacy-${slug(section.title)}`} className='scroll-mt-4'>
        <h3 className='font-baloo text-lg md:text-xl text-plum mb-2'>{section.title}</h3>
        <div className='space-y-3'>
          {section.blocks.map((b, i) => {
            if (b.sub) return <h4 key={i} className='font-bold text-gray-800 pt-1'>{b.sub}</h4>
            if (b.ul) {
              return (
                <ul key={i} className='space-y-1.5'>
                  {b.ul.map((li) => (
                    <li key={li} className='flex gap-2'>
                      <i className='fa-solid fa-circle text-primary text-[5px] mt-2 shrink-0'></i>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )
            }
            return <p key={i}>{b.p}</p>
          })}
        </div>
      </section>
    ))}
  </div>
)

export const PrivacyProvider = ({ children }) => {
  const [consent, setConsent] = useState(() => readConsent())
  const [bannerVisible, setBannerVisible] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const closeRef = useRef(null)

  // Show the cookie notice shortly after load, only if no choice has been made yet.
  useEffect(() => {
    if (consent) return
    const t = setTimeout(() => setBannerVisible(true), 800)
    return () => clearTimeout(t)
  }, [consent])

  const choose = useCallback((value) => {
    saveConsent(value)
    setConsent(value)
    setBannerVisible(false)
    setPolicyOpen(false)
  }, [])

  const openPolicy = useCallback(() => setPolicyOpen(true), [])
  const closePolicy = useCallback(() => setPolicyOpen(false), [])

  // Modal: lock page scroll, close on Escape, focus the close button.
  useEffect(() => {
    if (!policyOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setPolicyOpen(false) }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [policyOpen])

  return (
    <PrivacyContext.Provider value={{ openPolicy }}>
      {children}

      {/* Cookie notice */}
      {bannerVisible && !policyOpen && (
        <div
          role='dialog'
          aria-label='Cookie notice'
          className='fixed z-60 left-3 right-3 bottom-20 md:left-6 md:right-auto md:bottom-6 md:max-w-md rounded-3xl bg-white shadow-2xl shadow-plum/20 border border-lilac p-5 animate-[cookie-in_.35s_ease-out]'
        >
          <div className='flex items-start gap-3'>
            <span className='shrink-0 w-10 h-10 rounded-full bg-peach text-orange-400 flex items-center justify-center text-lg'>
              <i className='fa-solid fa-cookie-bite'></i>
            </span>
            <div>
              <h2 className='font-baloo text-xl text-plum leading-tight'>We value your privacy</h2>
              <p className='text-xs md:text-[13px] text-gray-600 mt-1.5 leading-relaxed'>
                We use session, preference and security cookies, and similar tracking technologies, to run our store, remember your settings and improve our website.
                If you do not accept cookies, you may not be able to use some portions of our Service.{' '}
                <button type='button' onClick={openPolicy} className='font-bold text-primary hover:text-primary-dark underline underline-offset-2 cursor-pointer'>
                  Read our Privacy Policy
                </button>
              </p>
            </div>
          </div>
          <div className='flex flex-col-reverse sm:flex-row gap-2 mt-4'>
            <button type='button' onClick={() => choose('essential')} className='flex-1 px-4 py-2.5 rounded-full bg-lilac hover:bg-lilac/70 text-plum text-xs md:text-sm font-bold transition-all cursor-pointer'>
              Essential only
            </button>
            <button type='button' onClick={() => choose('all')} className='flex-1 px-4 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-bold shadow-lg shadow-primary/30 transition-all cursor-pointer'>
              Accept all
            </button>
          </div>
        </div>
      )}

      {/* Full Privacy Policy */}
      {policyOpen && (
        <div className='fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-6'>
          <div className='absolute inset-0 bg-plum/50 backdrop-blur-sm' onClick={closePolicy} aria-hidden='true'></div>
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='privacy-title'
            className='relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-[cookie-in_.3s_ease-out]'
          >
            <header className='flex items-start justify-between gap-4 px-5 md:px-8 py-4 md:py-5 bg-linear-to-r from-[#eaf7ef] via-[#dff2e6] to-[#d5ecdc]'>
              <div>
                <h2 id='privacy-title' className='font-baloo text-2xl md:text-3xl text-plum leading-tight'>{policyMeta.title}</h2>
                <p className='text-[11px] md:text-xs text-gray-600 mt-1'>Effective date: {policyMeta.effectiveDate}</p>
              </div>
              <button ref={closeRef} type='button' onClick={closePolicy} aria-label='Close privacy policy' className='shrink-0 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-plum flex items-center justify-center transition-all cursor-pointer'>
                <i className='fa-solid fa-xmark'></i>
              </button>
            </header>

            <div className='flex-1 overflow-y-auto px-5 md:px-8 py-6'>
              <PolicyBody />
            </div>

            <footer className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 md:px-8 py-4 border-t border-gray-100 bg-white'>
              {consent ? (
                <button type='button' onClick={closePolicy} className='px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all cursor-pointer'>
                  Close
                </button>
              ) : (
                <>
                  <button type='button' onClick={() => choose('essential')} className='px-6 py-2.5 rounded-full bg-lilac hover:bg-lilac/70 text-plum text-sm font-bold transition-all cursor-pointer'>
                    Essential only
                  </button>
                  <button type='button' onClick={() => choose('all')} className='px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all cursor-pointer'>
                    Accept all &amp; continue
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}
    </PrivacyContext.Provider>
  )
}
