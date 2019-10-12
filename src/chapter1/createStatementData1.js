import plays from './plays'

export default function createStatementData (invoice, plays) {
  const result = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result
}

function enrichPerformance(aPerformance) {
  const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
  const result = Object.assign({}, aPerformance)
  result.play = calculator.play
  result.amount = calculator.amount
  result.volumeCredits = calculator.volumeCredits
  return result
}

function playFor(aPerformance) {
  return plays[aPerformance.playID]
}

function totalAmount (data) {
  return data.performances.reduce((total, p) => total + p.amount, 0)
}

function totalVolumeCredits (data) {
  return data.performances
    .reduce((total, p) => total + p.volumeCredits, 0)
}

function createPerformanceCalculator (aPerformance, aPlay) {
  switch (aPlay.play) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay)  
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay)  
    default:
      throw new Error(`unknow type: ${aPlay.type}`)
  }
}

// 创建演出计算器 performanceCalculator
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }
  get amount () {
    throw new Error('subclass responsibility')
  }
  get volumeCredits() {
    return Math.max(this.performance.audience -30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 4000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 3000
    if (this.performance.audience > 20) {
      result += 1000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience
    return result
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}





