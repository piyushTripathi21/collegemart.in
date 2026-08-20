import { useEffect } from 'react'

export default function useDocumentMeta({ title, description, ogImage, ogType = 'website' }) {
  useEffect(() => {

    if (title) {
      document.title = `${title} | CollegeMart`
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    if (title) {
      setMetaProperty('og:title', title)
    }

    if (description) {
      setMetaProperty('og:description', description)
    }

    if (ogImage) {
      setMetaProperty('og:image', ogImage)
    }

    setMetaProperty('og:type', ogType)

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
