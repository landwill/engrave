import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'

const itemIdStyles = {
  margin: '0'
}

const itemContainerStyles = {
  padding: 'space.100'
}

const itemContentStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'space.100',
  userSelect: 'none'
}

const itemStateStyles = {
  enabled: {
    backgroundColor: 'color.background.accent.green.subtlest'
  },
  disabled: {
    backgroundColor: 'color.background.accent.red.subtlest'
  },
  dragging: {
    opacity: 0.4
  }
}

function Item({
  itemId,
  children
}: {
  itemId: string;
  children?: React.ReactElement | React.ReactElement[];
}) {
  const [isDraggingAllowed, setIsDraggingAllowed] = useState<boolean>(true)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const ref = useRef<HTMLLabelElement | null>(null)
  itemContentStyles
  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error()
    return draggable({
      element,
      canDrag: () => isDraggingAllowed,
      getInitialData: () => ({ itemId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false)
    })
  }, [itemId, isDraggingAllowed])

  return (
    <>
      <div style={itemContentStyles} ref={ref}>
        <div>
          <input
            onChange={() => setIsDraggingAllowed(value => !value)}
            type='checkbox'
            checked={isDraggingAllowed}
          />
          Dragging allowed?
        </div>
        <div style={itemIdStyles}>
          (id: {itemId})
        </div>
      </div>
      {children ? <>{children}</> : null}
    </>
  )
}

const dropTargetStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'color.background.discovery',
  transitionProperty: 'background-color, border-color',
  transitionDuration: `10ms`,
  height: '100%'
}

function DropTarget() {
  const [state, setState] = useState<'idle' | 'is-over'>('idle')
  const ref = useRef<HTMLDivElement | null>(null)
  const [lastDropped, setLastDropped] = useState<string | null>(null)

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error()
    return dropTargetForElements({
      element,
      onDragStart: () => setState('idle'),
      onDragEnter: () => setState('is-over'),
      onDragLeave: () => setState('idle'),
      onDrop: ({ source }) => {
        setState('idle')

        if (typeof source.data.itemId !== 'string') {
          return
        }
        setLastDropped(source.data.itemId)
      }
    })
  }, [])
  return (
    <div style={dropTargetStyles} ref={ref}>
      <div>
        <strong>Drop on me!</strong>
        <em>
          Last dropped: <code>{lastDropped ?? 'none'}</code>
        </em>
      </div>
    </div>
  )
}

export const FileSelectorPragmatic = () => {
  return (
    <div>
      <Item itemId='1'>
        <Item itemId='1-1' />
        <Item itemId='1-2' />
        <Item itemId='1-3' />
      </Item>
      <Item itemId='1-2-1'>
        <Item itemId='1-2-2' />
      </Item>
      <DropTarget />
    </div>
  )
}