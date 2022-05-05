type Executor = (resolve: Function, reject: Function) => void
export default class Hd {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  public status: string
  public value: any
  constructor(executor: Executor) {
    this.status = Hd.PENDING
    this.value = null
    executor(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve(value: any) {
    this.status = Hd.FULFILLED
    this.value = value
  }

  reject(reason: any) {
    this.status = Hd.REJECTED
    this.value = reason
  }
}

const promise = new Hd((resolve, reject) => {
  resolve('hdcms.com')
})
console.log(promise)
