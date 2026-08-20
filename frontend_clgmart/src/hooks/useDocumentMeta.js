import { useEffect } from 'react'

/**
 * Dynamically updates document title and meta tags for SEO (Issue #25)
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} [options.ogImage] - Open Graph image URL
 * @param {string} [options.ogType] - Open Graph type (default: 'website')
 */
export default function useDocumentMeta({ title, description, ogImage, ogType = 'website' }) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = `${title} | CollegeMart`
    }

    // Meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    // OG Title
    if (title) {
      setMetaProperty('og:title', title)
    }

    // OG Description
    if (description) {
      setMetaProperty('og:description', description)
    }

    // OG Image
    if (ogImage) {
      setMetaProperty('og:image', ogImage)
    }

    // OG Type
    setMetaProperty('og:type', ogType)

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = 'CollegeMart - Buy & Sell Within Your Campus'
    }
  }, [title, description, ogImage, ogType])
}

function setMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.content = content
}
