export const SINGLETON_KEY = Symbol()

export type Singleton<T extends new (...args: unknown[]) => unknown> = T & {
  [SINGLETON_KEY]: T extends new (...args: unknown[]) => infer I ? I : never
}

/**
 * Singleton decorator
 * See: https://trevoratlas.com/posts/how-to-create-a-typescript-singleton-decorator
 */
export const Singleton = <T extends new (...args: unknown[]) => unknown>(
  type: T
) =>
  new Proxy(type, {
    construct(target: Singleton<T>, argsList, newTarget) {
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, argsList, newTarget)
      }
      if (!target[SINGLETON_KEY]) {
        target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget)
      }
      return target[SINGLETON_KEY]
    },
  })
