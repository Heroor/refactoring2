class Province {
  constructor (doc) {
    this._name = doc.name
    this._producers = []
    this._totalProduction = 0
    this._demand = doc.demand
    this._price = doc.price
    doc.producers.forEach(d => {
      this.addProducer(new Producer(this, d))
    })
  }

  get name () {
    return this._name
  }
  get producers () {
    return this._producers.slice()
  }
  get totalProduction () {
    return this._totalProduction
  }
  set totalProduction (arg) {
    this._totalProduction = arg
  }
  get demand () {
    return this._demand
  }
  set demand (arg) {
    this._demand = arg
  }
  get price () {
    return this._price
  }
  set price (arg) {
    this._price = parseInt(arg)
  }
  get shortfall () {
    return this._demand - this.totalProduction
  }

  get satisfiedDemand () {
    return Math.min(this._demand, this.totalProduction)
  }
  get demandValue () {
    return this.satisfiedDemand * this.price
  }
  get demandCost () {
    let remainingDemand = this.demand
    let result = 0
    this.producers.sort((a, b) => a.cost - b.cost).forEach(p => {
      const contribution = Math.min(remainingDemand, p.production)
      remainingDemand -= contribution
      result += contribution * p.cost
    })
    return result
  }
  get profit () {
    return this.demandValue - this.demandCost
  }

  addProducer (arg) {
    this._producers.push(arg)
    this._totalProduction += arg.production
  }
}