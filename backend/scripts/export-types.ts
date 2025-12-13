/**
 * Exports Payload types to the frontend application.
 * Strips the `declare module 'payload'` block which isn't needed in the frontend.
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

mkdirSync(dirname(DEST), { recursive: true })
writeFileSync(DEST, cleaned)

console.log('✓ Exported types to frontend/src/types/payload-types.ts')
