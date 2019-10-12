import plays from './plays'

export default function createStatementData (invoice, plays) {
  const result = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result
}

// 创建演出计算器 performanceCalculator
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }
  get amount () {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 4000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 3000
        if (this.performance.audience > 20) {
          result += 1000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`unknow type: ${this.type}`)
    }
    return result
  }
}

function enrichPerformance(aPerformance) {
  const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
  const result = Object.assign({}, aPerformance)
  result.play = calculator.play
  result.amount = amountFor(result)
  result.volumeCredits = volumeCreditsFor(result)
  return result
}

function playFor(aPerformance) {
  return plays[aPerformance.playID]
}

function amountFor(aPerformance) {
  return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount
}

function volumeCreditsFor(aPerformance) {
  let result = 0
  result += Math.max(aPerformance.audience -30, 0)
  if (aPerformance.play.type === 'comedy') result += Math.floor(aPerformance.audience / 5)
  return result
}

function totalAmount (data) {
  return data.performances.reduce((total, p) => total + p.amount, 0)
}

function totalVolumeCredits (data) {
  return data.performances
    .reduce((total, p) => total + p.volumeCredits, 0)
}




