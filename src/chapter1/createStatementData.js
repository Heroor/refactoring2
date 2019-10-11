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
  const result = Object.assign({}, aPerformance)
  result.play = playFor(result)
  result.amount = amountFor(result)
  result.volumeCredits = volumeCreditsFor(result)
  return result
}

function playFor(aPerformance) {
  return plays[aPerformance]
}

function amountFor(aPerformance) {
  let result = 0
  switch (aPerformance.play.type) {
    case 'tragedy':
      result = 4000
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30)
      }
      break
    case 'comedy':
      result = 3000
      if (aPerformance.audience > 20) {
        result += 1000 + 500 * (aPerformance.audience - 20)
      }
      result += 300 * aPerformance.audience
      break
    default:
      throw new Error(`unknow type: ${playFor(aPerformance).type}`)
  }
  return result
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




