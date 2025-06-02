import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query to check if the screen is mobile
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Listen for changes in the media query
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add the event listener to the media query
    mql.addEventListener("change", onChange)

    // Set the initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup the event listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
