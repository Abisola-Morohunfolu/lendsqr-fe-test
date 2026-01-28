/// <reference types="vite/client" />

/**
 * Type declarations for Vite environment
 * Provides type safety for asset imports and environment variables
 */

// SCSS Module declarations
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// SVG imports as React components
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// Image imports
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

