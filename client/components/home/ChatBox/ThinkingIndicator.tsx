import React from 'react'
import styles from './ThinkingIndicator.module.css'

interface ThinkingIndicatorProps {
  isGenerating?: boolean
}

export function ThinkingIndicator({
  isGenerating = false,
}: ThinkingIndicatorProps) {
  return (
    <div className="text-muted-foreground absolute -top-6 left-0 flex items-center">
      <span className="mr-1">{isGenerating ? 'Generating' : 'Thinking'}</span>
      <span className={styles.dots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </span>
    </div>
  )
}
