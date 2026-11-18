import { useEffect, useState } from 'react'
import { api } from './api'

// GET a path and keep { data, loading, error } in state. Pass null to skip the request.
export const useApi = (path) => {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: '' })

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: '' })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: '' }))
    api(path)
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: err.message, status: err.status }))
    return () => {
      cancelled = true
    }
  }, [path])

  return state
}
