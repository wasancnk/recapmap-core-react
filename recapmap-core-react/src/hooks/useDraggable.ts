/**
 * useDraggable.ts - Custom hook for making elements draggable
 * Provides drag functionality for floating panels
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface DraggableOptions {
  initialPosition: Position
  onPositionChange?: (position: Position) => void
  disabled?: boolean
}

export const useDraggable = ({ 
  initialPosition, 
  onPositionChange, 
  disabled = false 
}: DraggableOptions) => {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }, [position, disabled])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return

    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }    // Keep panel within viewport bounds with margin
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const panelWidth = dragRef.current?.offsetWidth || 400 // Default with margin
    const panelHeight = dragRef.current?.offsetHeight || 620
    const margin = 10 // Minimum margin from screen edges

    // Constrain position to keep panel visible with margin
    newPosition.x = Math.max(margin, Math.min(newPosition.x, viewport.width - panelWidth - margin))
    newPosition.y = Math.max(margin, Math.min(newPosition.y, viewport.height - panelHeight - margin))

    setPosition(newPosition)
    onPositionChange?.(newPosition)
  }, [isDragging, dragStart, disabled, onPositionChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Change cursor when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  return {
    position,
    isDragging,
    dragRef,
    dragHandleProps: {
      onMouseDown: handleMouseDown,
      style: { 
        cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab') 
      },
    },
  }
}
