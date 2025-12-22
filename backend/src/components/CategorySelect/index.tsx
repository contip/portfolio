import type { UIFieldServerComponent } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import formatCategories from '@/utilities/formatCategories'
import type { Category } from '@/payload-types'
import CategorySelectClient from './Client'

const CategorySelectServer: UIFieldServerComponent = async ({
  clientField: _clientField,
  collectionSlug,
  data,
  id,
}) => {
  try {
    const payloadClient = await getPayload({ config })

    const { docs: categories } = await payloadClient.find({
      collection: 'categories',
      depth: 0,
      limit: 500,
    })

    const formattedCategories = formatCategories(categories as Category[])
    const clientPath = collectionSlug === 'categories' ? 'parentId' : 'category'
    const extractId = (value?: unknown) => {
      if (!value) return undefined
      if (typeof value === 'object' && value && 'id' in value) {
        return (value as { id: string | number }).id
      }
      return value as string | number
    }
    const initialData =
      collectionSlug === 'categories' ? extractId(data?.parentId) : extractId(data?.category)

    const currentId = typeof id === 'string' || typeof id === 'number' ? id : undefined

    return (
      <CategorySelectClient
        path={clientPath}
        initialData={initialData}
        categories={formattedCategories}
        collectionSlug={collectionSlug}
        currentId={currentId}
      />
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return <div>Error loading categories. Please try again later.</div>
  }
}

export default CategorySelectServer
