import { createContext, useContext, useEffect, useState } from 'react'
import { api, formatMoney } from '../lib/api'

const StoreContext = createContext()

// Store-wide settings from the server (currency, shipping fee), so they are
// configured in one place (server/.env) instead of being hardcoded in the UI.
export const StoreProvider = ({ children }) => {
  const [config, setConfig] = useState({ currency: 'USD', shippingFee: 0, loaded: false })

  useEffect(() => {
    api('/api/config')
      .then((c) => setConfig({ currency: c.currency, shippingFee: c.shippingFee, loaded: true }))
      .catch(() => setConfig((c) => ({ ...c, loaded: true })))
  }, [])

  const money = (n) => formatMoney(n, config.currency)

  return <StoreContext.Provider value={{ ...config, money }}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
