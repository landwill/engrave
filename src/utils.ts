import { DARK_MODE_LOCALSTORAGE_KEY } from './consts.ts'

export enum Theme {
  LIGHT,
  DARK
}

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