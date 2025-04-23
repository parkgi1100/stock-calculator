// ✅ script.js 로딩 확인용
console.log("✅ script.js 로딩됨");

// ✅ 사팔사팔 계산기
function calculateSapal() {
  const amount = parseFloat(document.getElementById('sapalAmount')?.value);
  const price = parseFloat(document.getElementById('sapalPrice')?.value);

  if (isNaN(amount) || isNaN(price)) {
    document.getElementById('sapal-result').innerText = '❗숫자를 정확히 입력해주세요.';
    return;
  }

  const qty = amount / price;
  document.getElementById('sapal-result').innerText = `🟢 구매 가능 수량: ${qty.toFixed(2)}주`;
}

// ✅ 물타기 계산기 (표)
function calculateMultagi() {
  const amount1 = parseFloat(document.getElementById('amount-1')?.value);
  const price1 = parseFloat(document.getElementById('price-1')?.value);

  if (isNaN(amount1) || isNaN(price1)) {
    alert('❗숫자를 정확히 입력해주세요.');
    return;
  }

  const qty1 = amount1 / price1;
  const totalAmount1 = amount1;
  const avgPrice1 = price1;
  const profit1 = 0;

  document.getElementById('qty-1').innerText = qty1.toFixed(2);
  document.getElementById('total-amount-1').innerText = totalAmount1.toFixed(2);
  document.getElementById('avg-price-1').innerText = avgPrice1.toFixed(2);
  document.getElementById('profit-1').innerText = `${profit1.toFixed(2)}%`;
}

// ✅ script.js 로딩 확인용
console.log("✅ script.js 로딩됨");

// ✅ 사팔사팔 계산기
function calculateSapal() {
  const amount = parseFloat(document.getElementById('sapalAmount')?.value);
  const price = parseFloat(document.getElementById('sapalPrice')?.value);

  if (isNaN(amount) || isNaN(price)) {
    document.getElementById('sapal-result').innerText = '❗숫자를 정확히 입력해주세요.';
    return;
  }

  const qty = amount / price;
  document.getElementById('sapal-result').innerText = `🟢 구매 가능 수량: ${qty.toFixed(2)}주`;
}

// ✅ 물타기 계산기 (표)
function calculateMultagi() {
  const amount1 = parseFloat(document.getElementById('amount-1')?.value);
  const price1 = parseFloat(document.getElementById('price-1')?.value);

  if (isNaN(amount1) || isNaN(price1)) {
    alert('❗숫자를 정확히 입력해주세요.');
    return;
  }

  const qty1 = amount1 / price1;
  const totalAmount1 = amount1;
  const avgPrice1 = price1;
  const profit1 = 0;

  document.getElementById('qty-1').innerText = qty1.toFixed(2);
  document.getElementById('total-amount-1').innerText = totalAmount1.toFixed(2);
  document.getElementById('avg-price-1').innerText = avgPrice1.toFixed(2);
  document.getElementById('profit-1').innerText = `${profit1.toFixed(2)}%`;
}

// ✅ 종목별 주식 누적 물타기 계산기 (다중 종목 + 누적 + 삭제)
// ✅ 종목별 누적 물타기 계산기 (다중 종목 + 누적 + 삭제)
const multagiStockMap = {};

function calculateStock() {
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




// ✅ 주식선물 계산기 리디자인
function calculateStockFut() {
  const name = document.getElementById("stockfutName")?.value || '-';
  const quantity = parseFloat(document.getElementById("stockfutQuantity")?.value);
  const price = parseFloat(document.getElementById("stockfutPrice")?.value);
  const entry = parseFloat(document.getElementById("stockfutEntryPrice")?.value);
  const leverage = parseFloat(document.getElementById("stockfutLeverage")?.value);
  const feeRate = parseFloat(document.getElementById("stockfutFeeRate")?.value) / 100;
  const position = document.getElementById("stockfutPosition")?.value;
  const result = document.getElementById("stockfutResult");
  const error = document.getElementById("stockfutError");

  if (isNaN(price) || isNaN(entry) || isNaN(leverage) || isNaN(quantity)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }
  error.innerText = "";

  let pnl = position === "long" ? (price - entry) : (entry - price);
  pnl *= quantity * leverage;
  const fees = price * quantity * feeRate;
  const profit = pnl - fees;
  const profitRate = (profit / (entry * quantity)) * 100;

  const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';

  result.innerHTML = `
  <table class="w-full table-auto border-collapse text-sm shadow rounded overflow-hidden mt-4">
    <thead class="bg-gray-100 text-gray-700 font-semibold">
      <tr>
        <th class="border px-4 py-2">종목명</th>
        <th class="border px-4 py-2">포지션</th>
        <th class="border px-4 py-2">레버리지</th>
        <th class="border px-4 py-2">수익률</th>
        <th class="border px-4 py-2">손익</th>
        <th class="border px-4 py-2">수수료</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-gray-50">
        <td class="border px-4 py-2 text-left">${name}</td>
        <td class="border px-4 py-2 text-center">${position}</td>
        <td class="border px-4 py-2 text-center">${leverage}배</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profit.toFixed(0).toLocaleString()}</td>
        <td class="border px-4 py-2 text-right">${fees.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>`;
 // ✅ 계산 후 iframe 높이 조정
  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}

// ✅ 코인선물 계산기 리디자인
function calculateCoinFut() {
  const name = document.getElementById("coinfutName")?.value || '-';
  const quantity = parseFloat(document.getElementById("coinfutQuantity")?.value);
  const price = parseFloat(document.getElementById("coinfutPrice")?.value);
  const entry = parseFloat(document.getElementById("coinfutEntryPrice")?.value);
  const leverage = parseFloat(document.getElementById("coinfutLeverage")?.value);
  const feeRate = parseFloat(document.getElementById("coinfutFeeRate")?.value) / 100;
  const position = document.getElementById("coinfutPosition")?.value;
  const result = document.getElementById("coinfutResult");
  const error = document.getElementById("coinfutError");

  if (isNaN(price) || isNaN(entry) || isNaN(leverage) || isNaN(quantity)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }
  error.innerText = "";

  let pnl = position === "long" ? (price - entry) : (entry - price);
  pnl *= quantity * leverage;
  const fees = price * quantity * feeRate;
  const profit = pnl - fees;
  const profitRate = (profit / (entry * quantity)) * 100;

  const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';

  result.innerHTML = `
  <table class="w-full table-auto border-collapse text-sm shadow rounded overflow-hidden mt-4">
    <thead class="bg-gray-100 text-gray-700 font-semibold">
      <tr>
        <th class="border px-4 py-2">코인명</th>
        <th class="border px-4 py-2">포지션</th>
        <th class="border px-4 py-2">레버리지</th>
        <th class="border px-4 py-2">수익률</th>
        <th class="border px-4 py-2">손익</th>
        <th class="border px-4 py-2">수수료</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-gray-50">
        <td class="border px-4 py-2 text-left">${name}</td>
        <td class="border px-4 py-2 text-center">${position}</td>
        <td class="border px-4 py-2 text-center">${leverage}배</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profit.toFixed(0).toLocaleString()}</td>
        <td class="border px-4 py-2 text-right">${fees.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>`;
 // ✅ 계산 후 iframe 높이 조정
  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}
