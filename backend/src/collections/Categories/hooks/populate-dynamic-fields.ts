import type { CollectionBeforeChangeHook } from 'payload'
import type { Category } from '@/payload-types'

const generateFullTitle = (breadcrumbs: Category['breadcrumbs']): string | undefined => {
  if (Array.isArray(breadcrumbs)) {
    return breadcrumbs.reduce((title, breadcrumb, index) => {
      if (index === 0) return `${breadcrumb.label}`
      return `${title} > ${breadcrumb.label}`
    }, '')
  }

  return undefined
}

const generateUrl = (fullTitle: string): string => {
  if (fullTitle && fullTitle.length > 0) {
    return `/blog/category/${fullTitle.replace(/ > /g, '--').toLowerCase().replace(/\s+/g, '-')}`
  }

  return ''
}

const generateSlug = (fullTitle: string): string | undefined => {
  return fullTitle ? fullTitle.replace(/ > /g, '--').toLowerCase().replace(/\s+/g, '-') : undefined
}

const populateDynamicFields: CollectionBeforeChangeHook<Category> = ({ data, originalDoc }) => {
  if (!data) return data

  const fullTitle = generateFullTitle(data.breadcrumbs || originalDoc?.breadcrumbs)
  const url = generateUrl(fullTitle || '')
  const slug = generateSlug(fullTitle || '')

  data.fullTitle = fullTitle
  data.url = url
  data.slug = slug

  return data
}

export default populateDynamicFields
