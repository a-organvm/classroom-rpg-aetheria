import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useTheme as useThemeHook, useRole as useRoleHook } from '@/hooks/use-theme'
import { Theme, Role, ThemeConfig, THEME_CONFIGS } from '@/lib/types'
import { toast } from 'sonner'

interface ThemeContextValue {
  theme: Theme
  role: Role
  themeConfig: ThemeConfig
  setTheme: (theme: Theme) => void
  setRole: (role: Role) => void
  cycleTheme: () => void
  toggleRole: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useThemeHook()
  const [role, setRole] = useRoleHook()

  const currentTheme = theme || 'fantasy'
  const currentRole = role || 'student'
  const themeConfig = THEME_CONFIGS[currentTheme]

  const cycleTheme = () => {
    const themes: Theme[] = ['fantasy', 'scifi', 'medieval', 'modern']
    const currentIndex = themes.indexOf(currentTheme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    toast.success(`Reality shifted to ${THEME_CONFIGS[nextTheme].name}`)
  }

  const toggleRole = () => {
    const newRole = currentRole === 'teacher' ? 'student' : 'teacher'
    setRole(newRole)
  }

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: currentTheme,
      role: currentRole,
      themeConfig,
      setTheme,
      setRole,
      cycleTheme,
      toggleRole,
    }),
    [currentTheme, currentRole, themeConfig, setTheme, setRole]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
