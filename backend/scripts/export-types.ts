/**
 * Exports Payload types to the frontend application.
 * Strips the `declare module 'payload'` block which isn't needed in the frontend.
 * Also includes utility types like Where for query building.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SOURCE = join(__dirname, '../src/payload-types.ts')
const DEST = join(__dirname, '../../frontend/src/types/payload-types.ts')

const content = readFileSync(SOURCE, 'utf-8')

// Remove the `declare module 'payload' { ... }` block at the end
const cleaned = content.replace(/\n*declare module ['"]payload['"] \{[\s\S]*?\}\s*$/, '\n')

// Payload query types for frontend use
const payloadQueryTypes = `
// Payload query types (re-exported for frontend use)
type Operator =
  | 'contains'
  | 'equals'
  | 'exists'
  | 'greater_than'
  | 'greater_than_equal'
  | 'in'
  | 'less_than'
  | 'less_than_equal'
  | 'like'
  | 'not_equals'
  | 'not_in'
  | 'near'
  | 'within'
  | 'intersects'
  | 'all'

type WhereField = {
  [key in Operator]?: unknown
}

export type Where = {
  [key: string]: Where[] | WhereField | undefined
}
`

mkdirSync(dirname(DEST), { recursive: true })
writeFileSync(DEST, cleaned + payloadQueryTypes)

console.log('✓ Exported types to frontend/src/types/payload-types.ts')
