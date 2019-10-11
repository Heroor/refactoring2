import plays from './plays'
import invoices from './invoices'

// 处理volumeCredits变量
function volumeCreditsFor(aPerformance) {
  let result = 0
  result += Math.max(aPerformance.audience -30, 0)
  if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5)
  return result
}
function playFor(aPerformance) {
  return plays[aPerformance]
}

function amountFor(aPerformance) {
  let result = 0
  switch (playFor(aPerformance).type) {
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

const statement = function (invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`
  const format = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, 
  }).format
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf)
    result += `  ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`
    totalAmount += amountFor(perf)
  }
  result += `Amount owed is ${format(totalAmount/100)}\n}`
  result += `You earned ${volumeCredits} credits \n`
  return result
}

invoices.forEach(item => {
  console.log(statement(item, plays))
})