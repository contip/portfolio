import fs from 'node:fs/promises'
import path from 'node:path'

const packageJsonPath = path.resolve(
  'node_modules',
  '@ai-stack',
  'payloadcms',
  'package.json',
)

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const patchPayloadCmsPackageJson = async () => {
  if (!(await fileExists(packageJsonPath))) return

  const packageDir = path.dirname(packageJsonPath)
  const srcEntrypoint = path.join(packageDir, 'src', 'index.ts')
  const distEntrypoint = path.join(packageDir, 'dist', 'index.js')
  const distTypes = path.join(packageDir, 'dist', 'index.d.ts')

  if (await fileExists(srcEntrypoint)) return
  if (!(await fileExists(distEntrypoint)) || !(await fileExists(distTypes))) {
    throw new Error(
      '@ai-stack/payloadcms appears to be installed without src/ and without dist/ outputs.',
    )
  }

  const raw = await fs.readFile(packageJsonPath, 'utf8')
  const pkg = JSON.parse(raw)

  const currentlyPointsAtSrc =
    pkg?.main === './src/index.ts' ||
    pkg?.types === './src/index.ts' ||
    pkg?.exports?.['.']?.import === './src/index.ts'

  if (!currentlyPointsAtSrc) return

  pkg.main = './dist/index.js'
  pkg.types = './dist/index.d.ts'
  pkg.exports = {
    '.': {
      import: './dist/index.js',
      types: './dist/index.d.ts',
      default: './dist/index.js',
    },
    './client': {
      import: './dist/exports/client.js',
      types: './dist/exports/client.d.ts',
      default: './dist/exports/client.js',
    },
    './types': {
      import: './dist/exports/types.js',
      types: './dist/exports/types.d.ts',
      default: './dist/exports/types.js',
    },
    './fields': {
      import: './dist/exports/fields.js',
      types: './dist/exports/fields.d.ts',
      default: './dist/exports/fields.js',
    },
  }

  pkg.typesVersions = {
    '*': {
      client: ['dist/exports/client.d.ts'],
      types: ['dist/exports/types.d.ts'],
      fields: ['dist/exports/fields.d.ts'],
      '*': ['dist/*'],
    },
  }

  await fs.writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
  console.log(
    'Patched @ai-stack/payloadcms package.json to point exports at dist/ (upstream package ships without src/).',
  )
}

try {
  await patchPayloadCmsPackageJson()
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
