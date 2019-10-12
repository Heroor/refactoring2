import plays from './plays'
import invoices from './invoices'

// 移除play临时变量
// 移除thisAmount变脸--内联变量
function playFor(aPerformance) {
  return plays[aPerformance.playID]
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
    // 修改点 --start-- play=> playFor(perf)
    // const play = playFor(perf)
    // let thisAmount = amountFor(perf)
    volumeCredits += Math.max(perf.audience -30, 0)
    if (playFor(perf).type === 'comedy') volumeCredits += Math.floor(perf.audience / 5)
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