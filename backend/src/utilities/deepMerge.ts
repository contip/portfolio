type UnknownRecord = Record<string, unknown>

const isObject = (item: unknown): item is UnknownRecord =>
  typeof item === 'object' && item !== null && !Array.isArray(item)

const isArrayAndDefined = <T = unknown>(item: unknown): item is T[] =>
  Array.isArray(item) && item.every((entry) => entry !== undefined)

const mergeArrays = <T = unknown>(target: T[], source: T[]): T[] =>
  [...target, ...source].filter((entry) => entry !== undefined)

export default function deepMerge<T, R>(target: T, source: R): T {
  if (isArrayAndDefined(target) && isArrayAndDefined(source)) {
    return mergeArrays(target, source) as unknown as T
  }

  if (isObject(target) && isObject(source)) {
    const output: UnknownRecord = { ...target }
    const sourceRecord = source as UnknownRecord

    Object.keys(sourceRecord).forEach((key) => {
      const sourceValue = sourceRecord[key]
      const targetValue = output[key]

      if (isObject(sourceValue)) {
        output[key] =
          typeof targetValue === 'undefined' ? sourceValue : deepMerge(targetValue, sourceValue)
        return
      }

      if (isArrayAndDefined(sourceValue)) {
        output[key] = isArrayAndDefined(targetValue)
          ? mergeArrays(targetValue, sourceValue)
          : mergeArrays([], sourceValue)
        return
      }

      output[key] = sourceValue
    })

    return output as T
  }

  return source as unknown as T
}
