import plays from './plays'
import invoices from './invoices'

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
    let thisAmount = 0
    switch (play.type) {
      case 'tragedy':
        thisAmount = 4000
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30)
        }
        break
      case 'comedy':
        thisAmount = 3000
        if (perf.audience > 20) {
          thisAmount += 1000 + 500 * (perf.audience - 20)
        }
        result += 300 * perf.audience
        break
      default:
        throw new Error(`unknow type: ${play.type}`)
    }
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