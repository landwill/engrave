import { DARK_MODE_LOCALSTORAGE_KEY } from '../consts.ts'

export enum Theme {
  LIGHT,
  DARK
}

const DEFAULT_THEME = Theme.DARK

const getOldAndNewClassNames = (newMode: Theme) => {
  return newMode === Theme.LIGHT ? { newClassName: 'light-mode', oldClassName: 'dark-mode' } : { newClassName: 'dark-mode', oldClassName: 'light-mode' }
}

export const setRootTheme = (theme: Theme) => {
  const { newClassName, oldClassName } = getOldAndNewClassNames(theme)
  document.documentElement.classList.add(newClassName)
  document.documentElement.classList.remove(oldClassName)
  try {
    localStorage.setItem(DARK_MODE_LOCALSTORAGE_KEY, theme == Theme.DARK ? 'true' : 'false')
  } catch (error) {
    console.warn(error)
  }
}

const getCurrentLightDarkMode = (): Theme => {
  const localStorageDarkMode = localStorage.getItem(DARK_MODE_LOCALSTORAGE_KEY)
  if (localStorageDarkMode == null) {
    return DEFAULT_THEME
  }
  return localStorageDarkMode === 'true' ? Theme.DARK : Theme.LIGHT
}

export const toggleDarkMode = () => {
  const currentMode = getCurrentLightDarkMode()
  setRootTheme(currentMode === Theme.DARK ? Theme.LIGHT : Theme.DARK)
}

function getThemeFromDarkModePreference(darkModePreference: string | null) {
  switch (darkModePreference) {
    case 'false':
      return Theme.LIGHT
    case 'true':
      return Theme.DARK
    default:
      return DEFAULT_THEME
  }
}

export const lazyDarkModeRetrieve = () => {
  try {
    const darkModePreference = localStorage.getItem(DARK_MODE_LOCALSTORAGE_KEY)
    const theme = getThemeFromDarkModePreference(darkModePreference)
    setRootTheme(theme)
  } catch (error) {
    console.warn('Failed to fetch your light/dark mode preferences.')
  }
}

// Extracted primarily to silence ESLint's issue with the otherwise lack of 'unknown' typing.
export const lazyErrorHandler = (error: unknown) => {
  console.error(error)
}