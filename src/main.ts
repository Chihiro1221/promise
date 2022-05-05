type Executor = (resolve: PromiseResolver, reject: PromiseResolver) => void
type PromiseResolver = (value?: any) => void | Hd
interface Callback {
  onFulfilled: PromiseResolver
  onRejected: PromiseResolver
}
export default class Hd {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  public status: string
  public value: any
  private callbacks: Callback[] = []

  constructor(executor: Executor) {
    this.status = Hd.PENDING
    this.value = null
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  private resolve(value: any) {
    if (this.status !== Hd.PENDING) return
    this.status = Hd.FULFILLED
    this.value = value
    setTimeout(() => {
      this.callbacks.forEach(callback => {
        callback.onFulfilled(this.value)
      })
    })
  }

  private reject(reason: any) {
    if (this.status !== Hd.PENDING && !(reason instanceof Error)) return
    this.status = Hd.REJECTED
    this.value = reason
    setTimeout(() => {
      this.callbacks.forEach(callback => {
        callback.onRejected(this.value)
      })
    })
  }

  public then(onFulfilled?: PromiseResolver | null, onRejected?: PromiseResolver | null) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = () => this.value
    }
    if (typeof onRejected !== 'function') {
      onRejected = () => this.value
    }
    const promise = new Hd((resolve, reject) => {
      if (this.status === Hd.PENDING) {
        this.callbacks.push({
          onFulfilled: (value: any) => {
            this.parse(promise, onFulfilled?.(value), resolve, reject)
          },
          onRejected: (reason: any) => {
            this.parse(promise, onRejected?.(reason), resolve, reject)
          },
        })
      }
      if (this.status === Hd.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled?.(this.value), resolve, reject)
        })
      }
      if (this.status === Hd.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected?.(this.value), resolve, reject)
        })
      }
    })

    return promise
  }

  // 封装统一处理函数
  private parse(promise: Hd, result: Hd | any, resolve: PromiseResolver, reject: PromiseResolver) {
    // 若是返回的promise与当前promise相同，则抛出异常
    if (promise === result) {
      throw new TypeError('Chaining cycle detected')
    }
    try {
      if (result instanceof Hd) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    } catch (error: any) {
      reject(error)
    }
  }

  static resolve(value: any) {
    return new Hd((resolve, reject) => {
      if (value instanceof Hd) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject(value: any) {
    return new Hd((resolve, reject) => {
      if (value instanceof Hd) {
        value.then(resolve, reject)
      } else {
        reject(value)
      }
    })
  }

  static all(promises: Hd[]) {
    return new Hd((resolve, reject) => {
      const resolves: any[] = []
      promises.forEach(promise => {
        promise.then(
          value => {
            resolves.push(value)
            if (promises.length === resolves.length) {
              resolve(resolves)
            }
          },
          reason => {
            reject('Error Hd(promise) in:' + reason)
          }
        )
      })
    })
  }

  static race(promises: Hd[]) {
    return new Hd((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolve(value)
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }
}
