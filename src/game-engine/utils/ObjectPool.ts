export class ObjectPool<T> {
  private readonly create: () => T
  private readonly available: T[] = []

  constructor(create: () => T) {
    this.create = create
  }

  acquire(): T {
    return this.available.pop() ?? this.create()
  }

  release(item: T): void {
    this.available.push(item)
  }

  clear(): void {
    this.available.length = 0
  }
}
