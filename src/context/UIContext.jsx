/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

/**
 * Small UI state shared across the shell: the cart drawer and the mobile menu.
 * Lifting these out of Header lets the "added to cart" toast (and any page) open
 * the cart, and lets route changes close the menu.
 */
const UIContext = createContext()

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const openCart = useCallback(() => { setMenuOpen(false); setCartOpen(true) }, [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const toggleCart = useCallback(() => setCartOpen(o => !o), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])

  // Lock body scroll while either overlay is open
  useEffect(() => {
    const locked = cartOpen || menuOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen, menuOpen])

  // Close overlays on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setCartOpen(false); setMenuOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <UIContext.Provider value={{ cartOpen, openCart, closeCart, toggleCart, menuOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  return useContext(UIContext)
}
