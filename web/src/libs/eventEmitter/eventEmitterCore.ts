export class EventEmitter {
  private listener: Map<string, Set<(event: CustomEvent) => Promise<void> | void>>

  constructor() {
    this.listener = new Map()
  }

  on(event: string, callback: (event: CustomEvent) => Promise<void> | void): void {
    if (!this.listener.has(event)) {
      this.listener.set(event, new Set())
    }
    this.listener.get(event)!.add(callback)
  }

  off(event: string, callback: (event: CustomEvent) => Promise<void> | void): void {
    this.listener.get(event)?.delete(callback)
  }

  dispatch(event: string, detail?: unknown): void {
    const listeners = this.listener.get(event)
    if (listeners) {
      const customEvent = new CustomEvent(event, { detail })
      for (const listener of listeners) {
        listener(customEvent)
      }
    }
  }
}
