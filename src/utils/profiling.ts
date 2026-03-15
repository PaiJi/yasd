import { scan } from 'react-scan'

if (import.meta.env.VITE_PROFILE === 'true') {
  scan({
    enabled: true,
    log: false, // logs render info to console (default: false)
  })
}
