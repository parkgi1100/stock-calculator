
// ✅ script.js 로딩 확인용
console.log("✅ script.js 로딩됨");

// ✅ 종목별 누적 물타기 계산기 (다중 종목 + 누적 + 삭제)
const multagiStockMap = {};

function calculateStockOnly() {
  const name = document.getElementById("stockName").value.trim();
  const quantity = parseFloat(document.getElementById("stockQuantity").value);
  const price = parseFloat(document.getElementById("stockCurrentPrice").value);
  const avgPrice = parseFloat(document.getElementById("stockAvgPrice").value);
  const feeRate = parseFloat(document.getElementById("stockFeeRate").value) / 100;
  const addOption = document.getElementById("stockAddOption").value;
  const addInput = parseFloat(document.getElementById("stockAddInput").value);
  const addPrice = parseFloat(document.getElementById("stockAddPrice")?.value);
  const resultArea = document.getElementById("stockResult");
  const error = document.getElementById("stockError");

  if (!name || isNaN(quantity) || isNaN(price) || isNaN(avgPrice) || isNaN(addInput) || isNaN(addPrice)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    return;
  }
  error.innerText = "";

  let addQty = addOption === "amount" ? addInput / addPrice : addInput;
  const addTotal = addQty * addPrice;
  const currentTotalQty = quantity + addQty;
  const currentTotalInvest = (quantity * avgPrice) + addTotal;

  if (!multagiStockMap[name]) {
    multagiStockMap[name] = {
      totalQty: currentTotalQty,
      totalInvest: currentTotalInvest,
      price: price,
      feeRate: feeRate
    };
  } else {
    const prev = multagiStockMap[name];
    multagiStockMap[name] = {
      totalQty: prev.totalQty + addQty,
      totalInvest: prev.totalInvest + addTotal,
      price: price,
      feeRate: feeRate
    };
  }

  renderMultiStockResults();

  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}

function renderMultiStockResults() {
  const resultArea = document.getElementById("stockResult");
  resultArea.innerHTML = "";

  resultArea.innerHTML = Object.entries(multagiStockMap).map(([name, data]) => {
    const currentVal = data.totalQty * data.price;
    const fees = data.totalQty * data.price * data.feeRate;
    const profit = currentVal - data.totalInvest - fees;
    const profitRate = (profit / data.totalInvest) * 100;
    const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';
    const formattedProfit = (profit < 0 ? '-' : '') + Math.abs(Math.floor(profit)).toLocaleString();

    return `
      <div class="mt-4 border rounded shadow p-3 bg-white">
        <div class="flex justify-between items-center">
          <strong class="text-lg">${name}</strong>
          <button onclick="deleteStockResult('${name}')" class="text-sm text-red-500 font-semibold">❌ 삭제</button>
        </div>
        <table class="w-full text-sm mt-2">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-2 py-1">현재가</th>
              <th class="border px-2 py-1">평단가</th>
              <th class="border px-2 py-1">보유수량</th>
              <th class="border px-2 py-1">평가금액</th>
              <th class="border px-2 py-1">평가손익</th>
              <th class="border px-2 py-1">수익률</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-2 py-1 text-right">${data.price.toLocaleString()}</td>
              <td class="border px-2 py-1 text-right">${(data.totalInvest / data.totalQty).toFixed(1).toLocaleString()}</td>
              <td class="border px-2 py-1 text-center">${data.totalQty.toFixed(2)}</td>
              <td class="border px-2 py-1 text-right">${currentVal.toLocaleString()}</td>
              <td class="border px-2 py-1 text-right ${profitColor}">${formattedProfit}</td>
              <td class="border px-2 py-1 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}

function deleteStockResult(name) {
  delete multagiStockMap[name];
  renderMultiStockResults();
}





// ✅ 코인 전용 물타기 계산기
const coinMap = {};

function calculateCoinOnly() {
  const name = document.getElementById("coinName").value.trim();
  const quantity = parseFloat(document.getElementById("coinQuantity").value);
  const price = parseFloat(document.getElementById("coinPrice").value);
  const avgPrice = parseFloat(document.getElementById("coinAvgPrice").value);
  const feeRate = parseFloat(document.getElementById("coinFeeRate").value) / 100;
  const addOption = document.getElementById("coinAddOption").value;
  const addInput = parseFloat(document.getElementById("coinAddInput").value);
  const addPrice = parseFloat(document.getElementById("coinAddPrice")?.value);
  const resultArea = document.getElementById("coinResult");
  const error = document.getElementById("coinError");

  if (!name || isNaN(quantity) || isNaN(price) || isNaN(avgPrice) || isNaN(addInput) || isNaN(addPrice)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    return;
  }
  error.innerText = "";

  let addQty = addOption === "amount" ? addInput / addPrice : addInput;
  const addTotal = addQty * addPrice;
  const currentTotalQty = quantity + addQty;
  const currentTotalInvest = (quantity * avgPrice) + addTotal;

  if (!coinMap[name]) {
    coinMap[name] = {
      totalQty: currentTotalQty,
      totalInvest: currentTotalInvest,
      price: price,
      feeRate: feeRate
    };
  } else {
    const prev = coinMap[name];
    coinMap[name] = {
      totalQty: prev.totalQty + addQty,
      totalInvest: prev.totalInvest + addTotal,
      price: price,
      feeRate: feeRate
    };
  }

  renderCoinResults();
  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}

function renderCoinResults() {
  const resultArea = document.getElementById("coinResult");
  resultArea.innerHTML = "";

  resultArea.innerHTML = Object.entries(coinMap).map(([name, data]) => {
    const currentVal = data.totalQty * data.price;
    const fees = data.totalQty * data.price * data.feeRate;
    const profit = currentVal - data.totalInvest - fees;
    const profitRate = (profit / data.totalInvest) * 100;
    const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';
    const formattedProfit = (profit < 0 ? '-' : '') + Math.abs(Math.floor(profit)).toLocaleString();

    return `
      <div class="mt-4 border rounded shadow p-3 bg-white">
        <div class="flex justify-between items-center">
          <strong class="text-lg">${name}</strong>
          <button onclick="deleteCoinResult('${name}')" class="text-sm text-red-500 font-semibold">❌ 삭제</button>
        </div>
        <table class="w-full text-sm mt-2">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-2 py-1">현재가</th>
              <th class="border px-2 py-1">평단가</th>
              <th class="border px-2 py-1">보유수량</th>
              <th class="border px-2 py-1">평가금액</th>
              <th class="border px-2 py-1">평가손익</th>
              <th class="border px-2 py-1">수익률</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-2 py-1 text-right">${data.price.toLocaleString()}</td>
              <td class="border px-2 py-1 text-right">${(data.totalInvest / data.totalQty).toFixed(1).toLocaleString()}</td>
              <td class="border px-2 py-1 text-center">${data.totalQty.toFixed(8)}</td>
              <td class="border px-2 py-1 text-right">${currentVal.toLocaleString()}</td>
              <td class="border px-2 py-1 text-right ${profitColor}">${formattedProfit}</td>
              <td class="border px-2 py-1 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }).join('');
}

function deleteCoinResult(name) {
  delete coinMap[name];
  renderCoinResults();
}



// ✅ 코인선물 계산기 로직 (레버리지 기반, USDT 기준 - 바이낸스 구조 반영)

let coinfutState = {
  name: '',
  quantity: 0,
  entryPrice: 0,
  leverage: 0,
  feeRate: 0,
  position: '',
  currentPrice: 0,
  realizedProfit: 0,
  totalFee: 0,
  totalProfit: 0
};

function calculateCoinFutInitial() {
  const name = document.getElementById('coinfutName').value.trim();
  const quantity = parseFloat(document.getElementById('coinfutQuantity').value);
  const entryPrice = parseFloat(document.getElementById('coinfutEntryPrice').value);
  const leverage = parseFloat(document.getElementById('coinfutLeverage').value);
  const feeRate = parseFloat(document.getElementById('coinfutFeeRate').value) / 100;
  const position = document.getElementById('coinfutPosition').value;

  if (!name || isNaN(quantity) || isNaN(entryPrice) || isNaN(leverage) || isNaN(feeRate)) {
    document.getElementById('coinfutError').innerText = '❗ 모든 값을 올바르게 입력해주세요.';
    return;
  }

  coinfutState = {
    name,
    quantity,
    entryPrice,
    leverage,
    feeRate,
    position,
    currentPrice: 0,
    realizedProfit: 0,
    totalFee: 0,
    totalProfit: 0
  };

  renderCoinFutTable();
  document.getElementById('coinfutError').innerText = '';
}

function updateCoinFutPrice() {
  const price = parseFloat(document.getElementById('coinfutPrice').value);
  if (isNaN(price)) return;

  coinfutState.currentPrice = price;
  renderCoinFutTable();
}

function calculateCoinFutAdd() {
  const addPrice = parseFloat(document.getElementById('coinfutAddEntryPrice').value);
  const addQty = parseFloat(document.getElementById('coinfutAddQuantity').value);
  const addPosition = document.getElementById('coinfutAddPosition').value;

  if (isNaN(addPrice) || isNaN(addQty)) {
    document.getElementById('coinfutError').innerText = '❗ 추가 진입값을 정확히 입력해주세요.';
    return;
  }

  let realizedProfit = 0;
  if (coinfutState.position !== addPosition) {
    const offsetQty = Math.min(addQty, coinfutState.quantity);
    const remainingQty = Math.abs(coinfutState.quantity - addQty);
    const entry = coinfutState.entryPrice;
    const fee = (addPrice + entry) * offsetQty * coinfutState.feeRate;

    if (coinfutState.position === 'long') {
      realizedProfit = (addPrice - entry) * offsetQty - fee;
    } else {
      realizedProfit = (entry - addPrice) * offsetQty - fee;
    }

    coinfutState.quantity = coinfutState.quantity - offsetQty;
    coinfutState.totalProfit += realizedProfit;
    coinfutState.totalFee += fee;

    if (addQty > offsetQty) {
      coinfutState.entryPrice = addPrice;
      coinfutState.quantity = remainingQty;
      coinfutState.position = addPosition;
    } else if (coinfutState.quantity === 0) {
      coinfutState.entryPrice = 0;
    }
  } else {
    const totalCost = (coinfutState.entryPrice * coinfutState.quantity) + (addPrice * addQty);
    coinfutState.quantity += addQty;
    coinfutState.entryPrice = totalCost / coinfutState.quantity;
    const fee = addPrice * addQty * coinfutState.feeRate * 2;
    coinfutState.totalFee += fee;
  }

  renderCoinFutTable();
  document.getElementById('coinfutError').innerText = '';
}

function renderCoinFutTable() {
  const { name, quantity, entryPrice, leverage, currentPrice, totalProfit, totalFee } = coinfutState;
  if (!name || quantity === 0 || entryPrice === 0 || !currentPrice) return;

  const position = coinfutState.position;
  let unrealized = 0;

  if (position === 'long') {
    unrealized = (currentPrice - entryPrice) * quantity;
  } else {
    unrealized = (entryPrice - currentPrice) * quantity;
  }

  const margin = (entryPrice * quantity) / leverage;
  const totalUnrealized = unrealized - totalFee;
  const profitRate = margin ? (totalUnrealized / margin) * 100 : 0;

  const resultHTML = `
    <table class="w-full text-sm mt-4 border-collapse border shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-3 py-2">코인명</th>
          <th class="border px-3 py-2">총 계약수</th>
          <th class="border px-3 py-2">평균 진입가</th>
          <th class="border px-3 py-2">현재가</th>
          <th class="border px-3 py-2">레버리지</th>
          <th class="border px-3 py-2">미실현 손익 (USDT)</th>
          <th class="border px-3 py-2">수익률 (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border px-3 py-2 text-center">${name}</td>
          <td class="border px-3 py-2 text-center">${quantity}</td>
          <td class="border px-3 py-2 text-center">${entryPrice.toLocaleString()}</td>
          <td class="border px-3 py-2 text-center">${currentPrice.toLocaleString()}</td>
          <td class="border px-3 py-2 text-center">${leverage}x</td>
          <td class="border px-3 py-2 text-center">${totalUnrealized.toFixed(2)}</td>
          <td class="border px-3 py-2 text-center">${profitRate.toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>`;

  document.getElementById('coinfutInitialResult').innerHTML = resultHTML;
}

function resetCoinFutData() {
  coinfutState = {
    name: '',
    quantity: 0,
    entryPrice: 0,
    leverage: 0,
    feeRate: 0,
    position: '',
    currentPrice: 0,
    realizedProfit: 0,
    totalFee: 0,
    totalProfit: 0
  };
  document.getElementById('coinfutInitialResult').innerHTML = '';
  document.getElementById('coinfutError').innerText = '';
}
