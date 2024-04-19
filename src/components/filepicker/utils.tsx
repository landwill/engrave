export function getTitleAndClassName(title: string, isActive: boolean) {
  const classNames = []
  let effectiveTitle = title
  if (isActive) classNames.push('active')
  if (title.trim() == '') {
    classNames.push('untitled')
    effectiveTitle = 'Untitled'
  }
  return { effectiveTitle, className: classNames.join(' ') }
}