import type { Category } from '@/payload-types'
import type { SelectItem } from '@/components/CategorySelect/types'

const convertCategory = (categories: Category[]): SelectItem[] =>
  categories.map((category) => ({
    label: category.title || '',
    fullTitle: category.fullTitle || '',
    value: category.id,
    children: [],
  }))

const getParentId = (category: Category): string | number | undefined => {
  if (!category.parentId) return undefined
  if (typeof category.parentId === 'object') return category.parentId.id
  return category.parentId
}

const getChildren = (current: SelectItem, categories: Category[]): SelectItem[] | null => {
  const children = categories.filter((category) => {
    const parentId = getParentId(category)
    if (parentId === undefined || parentId === null) return false
    return String(parentId) === String(current.value)
  })
  if (!children.length) return null

  const result = convertCategory(children)
  result.forEach((child) => {
    const grandchildren = getChildren(child, categories)
    child.children = grandchildren ?? []
  })

  return result
}

const formatCategories = (categories: Category[]): SelectItem[] => {
  const roots = categories.filter((node) => !getParentId(node))
  const convertedRoots = convertCategory(roots)

  convertedRoots.forEach((root) => {
    const children = getChildren(root, categories)
    root.children = children ?? []
  })

  return convertedRoots
}

export default formatCategories
