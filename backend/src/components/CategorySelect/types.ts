export type SelectItem = {
  label: string
  fullTitle?: string
  value: string | number
  children: SelectItem[]
}

export type CategorySelectValue = string | number

export type CategorySelectClientProps = {
  path: string
  categories: SelectItem[]
  initialData?: CategorySelectValue
  collectionSlug: string
  currentId?: string | number
}
