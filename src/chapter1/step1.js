// 提炼函数 将计算价格的函数提炼出来
// 命名aPerformance 用不定冠词修饰，跟踪变量的类型

import plays from './plays'
import invoices from './invoices'

function amountFor(aPerformance, play) {
  let result = 0
  switch (play.type) {
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
      throw new Error(`unknow type: ${play.type}`)
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
    const play = plays[perf.playID]
    let thisAmount = amountFor(perf, play)
    volumeCredits += Math.max(perf.audience -30, 0)
    if (play.type === 'comedy') volumeCredits += Math.floor(perf.audience / 5)
    result += `  ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`
    totalAmount += thisAmount
  }
  result += `Amount owed is ${format(totalAmount/100)}\n}`
  result += `You earned ${volumeCredits} credits \n`
  return result
}

invoices.forEach(item => {
  console.log(statement(item, plays))
})