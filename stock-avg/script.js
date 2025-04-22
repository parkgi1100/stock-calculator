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

// ✅ 코인 물타기 계산기
function calculateCoin() {
  const name = document.getElementById("coinName").value.trim();
  const quantity = parseFloat(document.getElementById("coinQuantity").value);
  const price = parseFloat(document.getElementById("coinPrice").value);
  const avgPrice = parseFloat(document.getElementById("coinAvgPrice").value);
  const feeRate = parseFloat(document.getElementById("coinFeeRate").value) / 100;
  const addOption = document.getElementById("coinAddOption").value;
  const addInput = parseFloat(document.getElementById("coinAddInput").value);
  const result = document.getElementById("coinResult");
  const error = document.getElementById("coinError");

  if (!name || isNaN(quantity) || isNaN(price) || isNaN(avgPrice) || isNaN(addInput)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }
  error.innerText = "";

  let addQty = addOption === "amount" ? addInput / price : addInput;
  let addTotal = addOption === "amount" ? addInput : price * addInput;

  const totalQty = quantity + addQty;
  const totalInvest = (quantity * avgPrice) + addTotal;
  const currentVal = totalQty * price;
  const fees = totalQty * price * feeRate;
  const profit = currentVal - totalInvest - fees;
  const profitRate = (profit / totalInvest) * 100;

  const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';
  const formattedProfit = (profit < 0 ? '-' : '') + Math.abs(Math.floor(profit)).toLocaleString();

  result.innerHTML = `
  <table class="w-full table-auto border-collapse text-sm shadow rounded overflow-hidden mt-4">
    <thead class="bg-gray-100 text-gray-700 font-semibold">
      <tr>
        <th class="border px-4 py-2">코인명</th>
        <th class="border px-4 py-2">현재가</th>
        <th class="border px-4 py-2">평단가</th>
        <th class="border px-4 py-2">보유수량</th>
        <th class="border px-4 py-2">평가금액</th>
        <th class="border px-4 py-2">평가손익</th>
        <th class="border px-4 py-2">수익률</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-gray-50">
        <td class="border px-4 py-2 text-left">${name}</td>
        <td class="border px-4 py-2 text-right">${price.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right">${(totalInvest / totalQty).toFixed(1).toLocaleString()}</td>
        <td class="border px-4 py-2 text-center">${totalQty.toFixed(4)}</td>
        <td class="border px-4 py-2 text-right">${currentVal.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${formattedProfit}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
      </tr>
    </tbody>
  </table>`;

  // ✅ 계산 후 iframe 높이 조정
  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}


// ✅ 주식 물타기 계산기
function calculateStock() {
  const name = document.getElementById("stockName").value.trim();
  const quantity = parseFloat(document.getElementById("stockQuantity").value);
  const price = parseFloat(document.getElementById("stockCurrentPrice").value);
  const avgPrice = parseFloat(document.getElementById("stockAvgPrice").value);
  const feeRate = parseFloat(document.getElementById("stockFeeRate").value) / 100;
  const addOption = document.getElementById("stockAddOption").value;
  const addInput = parseFloat(document.getElementById("stockAddInput").value);
  const result = document.getElementById("stockResult");
  const error = document.getElementById("stockError");

  if (!name || isNaN(quantity) || isNaN(price) || isNaN(avgPrice) || isNaN(addInput)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }
  error.innerText = "";

  let addQty = addOption === "amount" ? addInput / price : addInput;
  let addTotal = addOption === "amount" ? addInput : price * addInput;

  const totalQty = quantity + addQty;
  const totalInvest = (quantity * avgPrice) + addTotal;
  const currentVal = totalQty * price;
  const fees = totalQty * price * feeRate;
  const profit = currentVal - totalInvest - fees;
  const profitRate = (profit / totalInvest) * 100;

  const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';
  const formattedProfit = (profit < 0 ? '-' : '') + Math.abs(Math.floor(profit)).toLocaleString();

  result.innerHTML = `
  <table class="w-full table-auto border-collapse text-sm shadow rounded overflow-hidden mt-4">
    <thead class="bg-gray-100 text-gray-700 font-semibold">
      <tr>
        <th class="border px-4 py-2">종목명</th>
        <th class="border px-4 py-2">현재가</th>
        <th class="border px-4 py-2">평단가</th>
        <th class="border px-4 py-2">보유수량</th>
        <th class="border px-4 py-2">평가금액</th>
        <th class="border px-4 py-2">평가손익</th>
        <th class="border px-4 py-2">수익률</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-gray-50">
        <td class="border px-4 py-2 text-left">${name}</td>
        <td class="border px-4 py-2 text-right">${price.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right">${(totalInvest / totalQty).toFixed(1).toLocaleString()}</td>
        <td class="border px-4 py-2 text-center">${totalQty.toFixed(2)}주</td>
        <td class="border px-4 py-2 text-right">${currentVal.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${formattedProfit}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
      </tr>
    </tbody>
  </table>`;
 // ✅ 계산 후 iframe 높이 조정
  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}


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
}

// ✅ 코인 물타기 계산기
function calculateCoin() {
  const name = document.getElementById("coinName").value.trim();
  const quantity = parseFloat(document.getElementById("coinQuantity").value);
  const price = parseFloat(document.getElementById("coinPrice").value);
  const avgPrice = parseFloat(document.getElementById("coinAvgPrice").value);
  const feeRate = parseFloat(document.getElementById("coinFeeRate").value) / 100;
  const addOption = document.getElementById("coinAddOption").value;
  const addInput = parseFloat(document.getElementById("coinAddInput").value);
  const result = document.getElementById("coinResult");
  const error = document.getElementById("coinError");

  if (!name || isNaN(quantity) || isNaN(price) || isNaN(avgPrice) || isNaN(addInput)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }
  error.innerText = "";

  let addQty = addOption === "amount" ? addInput / price : addInput;
  let addTotal = addOption === "amount" ? addInput : price * addInput;

  const totalQty = quantity + addQty;
  const totalInvest = (quantity * avgPrice) + addTotal;
  const currentVal = totalQty * price;
  const fees = totalQty * price * feeRate;
  const profit = currentVal - totalInvest - fees;
  const profitRate = (profit / totalInvest) * 100;

  const profitColor = profit >= 0 ? 'text-red-500' : 'text-blue-500';
  const formattedProfit = (profit < 0 ? '-' : '') + Math.abs(Math.floor(profit)).toLocaleString();

  result.innerHTML = `
  <table class="w-full table-auto border-collapse text-sm shadow rounded overflow-hidden mt-4">
    <thead class="bg-gray-100 text-gray-700 font-semibold">
      <tr>
        <th class="border px-4 py-2">코인명</th>
        <th class="border px-4 py-2">현재가</th>
        <th class="border px-4 py-2">평단가</th>
        <th class="border px-4 py-2">보유수량</th>
        <th class="border px-4 py-2">평가금액</th>
        <th class="border px-4 py-2">평가손익</th>
        <th class="border px-4 py-2">수익률</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-gray-50">
        <td class="border px-4 py-2 text-left">${name}</td>
        <td class="border px-4 py-2 text-right">${price.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right">${(totalInvest / totalQty).toFixed(1).toLocaleString()}</td>
        <td class="border px-4 py-2 text-center">${totalQty.toFixed(4)}</td>
        <td class="border px-4 py-2 text-right">${currentVal.toLocaleString()}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${formattedProfit}</td>
        <td class="border px-4 py-2 text-right ${profitColor}">${profitRate.toFixed(2)}%</td>
      </tr>
    </tbody>
  </table>`;

  const updatedHeight = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height: updatedHeight }, '*');
}
