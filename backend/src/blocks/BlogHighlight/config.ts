import { type Block } from 'payload'

const BlogHighlight: Block = {
  slug: 'blogHighlight',
  interfaceName: 'BlogHighlightBlock',
  labels: {
    singular: 'Blog Highlight',
    plural: 'Blog Highlights',
  },
  fields: [
    {
      name: 'title',
      label: 'Section Title',
      type: 'text',
      defaultValue: 'From the blog',
    },
    {
      name: 'subtitle',
      label: 'Section Subtitle',
      type: 'text',
      defaultValue:
        'Read exciting articles in the fields of technology, web development, cloud infrastructure, security, and more!',
    },
    {
      name: 'featuredPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxDepth: 3,
      maxRows: 3,
      label: 'Featured Posts',
      admin: {
        description: 'Select up to 3 posts to highlight',
      },
    },
  ],
}

export default BlogHighlight
