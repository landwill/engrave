export const CHEVRON_WIDTH = 16

export const FolderIndentLine = () => <svg style={{ flexShrink: 0, lineHeight: 0 }} className='lucide lucide-chevron-right' strokeLinejoin='round'
                                           strokeLinecap='round' strokeWidth='1'
                                           stroke='currentColor' fill='none' height='30px' width={CHEVRON_WIDTH} xmlns='http://www.w3.org/2000/svg'>
  <line style={{ color: 'var(--color)' }} x1='7.5' y1='0' x2='7.5' y2='100%' strokeWidth='1' opacity='0.3'></line>
</svg>