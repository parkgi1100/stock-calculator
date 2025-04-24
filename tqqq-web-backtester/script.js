document.getElementById("runTest").addEventListener("click", runBacktest);

function runBacktest() {
  fetch("data/tqqq.csv")
    .then(res => res.text())
    .then(csv => Papa.parse(csv, { header: true, complete: processData }));
}

function processData(result) {
  const data = result.data;

  let totalInvest = 0;
  let totalShares = 0;
  const labels = [];
  const avgPrices = [];
  const closePrices = [];

  let lastMonth = "";

  data.forEach(row => {
    const date = row["Date"];
    const close = parseFloat(row["Close"]);
    if (isNaN(close)) return;

    const month = date.slice(0, 7);  // YYYY-MM
    const day = date.slice(8, 10);   // DD

    if (day === "01" && month !== lastMonth) {
      const invest = 1000;
      const shares = invest / close;
      totalInvest += invest;
      totalShares += shares;
      const avg = totalInvest / totalShares;

      labels.push(date);
      avgPrices.push(avg);
      closePrices.push(close);

      lastMonth = month;
    }
  });

  const finalClose = closePrices.at(-1);
  const avgCost = totalInvest / totalShares;
  const returnRate = ((finalClose / avgCost - 1) * 100).toFixed(2);

  document.getElementById("result").textContent = `
총 투자금: ${totalInvest.toFixed(2)} USD
총 보유수량: ${totalShares.toFixed(4)} 주
평단가: ${avgCost.toFixed(2)} USD
최종 종가: ${finalClose.toFixed(2)} USD
수익률: ${returnRate}%
`;

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "평단가", data: avgPrices, borderColor: "blue", borderWidth: 2 },
        { label: "종가", data: closePrices, borderColor: "green", borderWidth: 2 }
      ]
    }
  });
}
