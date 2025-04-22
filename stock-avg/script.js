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
  console.log("🧪 calculateCoin() 실행됨");

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

  let addQty = 0;
  let addTotal = 0;
  if (addOption === "amount") {
    addQty = addInput / price;
    addTotal = addInput;
  } else {
    addQty = addInput;
    addTotal = price * addQty;
  }

  const totalQty = quantity + addQty;
  const totalInvest = (quantity * avgPrice) + addTotal;
  const currentVal = totalQty * price;
  const fees = totalQty * price * feeRate;
  const profit = currentVal - totalInvest - fees;
  const profitRate = (profit / totalInvest) * 100;

  result.innerHTML = `
    <div class="mt-4 p-4 bg-gray-100 rounded-md shadow">
      <p class="font-semibold">📈 총 매입금액: ₩${totalInvest.toLocaleString()}</p>
      <p>➕ 추가 매수 단가: ₩${price.toLocaleString()}</p>
      <p>📦 총 보유 수량: ${totalQty.toFixed(4)} 코인</p>
      <p>📊 물타기 후 평단가: ₩${(totalInvest / totalQty).toLocaleString()}</p>
      <p class="mt-2 font-bold text-${profit >= 0 ? 'red' : 'blue'}-600">
        🔥 평가손익: ₩${profit.toLocaleString()} (${profitRate.toFixed(2)}%)
      </p>
    </div>`;
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

  result.innerHTML = `
    <div class="mt-4 p-4 bg-gray-100 rounded-md shadow">
      <p class="font-semibold">📈 총 매입금액: ₩${totalInvest.toLocaleString()}</p>
      <p>➕ 추가 매수 단가: ₩${price.toLocaleString()}</p>
      <p>📦 총 보유 수량: ${totalQty.toFixed(2)}주</p>
      <p>📊 물타기 후 평단가: ₩${(totalInvest / totalQty).toLocaleString()}</p>
      <p class="mt-2 font-bold text-${profit >= 0 ? 'red' : 'blue'}-600">
        🔥 평가손익: ₩${profit.toLocaleString()} (${profitRate.toFixed(2)}%)
      </p>
    </div>`;
}

// ✅ 주식선물 물타기 계산기
function calculateStockFut() {
  const price = parseFloat(document.getElementById("stockfutPrice").value);
  const entry = parseFloat(document.getElementById("stockfutEntryPrice").value);
  const leverage = parseFloat(document.getElementById("stockfutLeverage").value);
  const quantity = parseFloat(document.getElementById("stockfutQuantity").value);
  const feeRate = parseFloat(document.getElementById("stockfutFeeRate").value) / 100;
  const position = document.getElementById("stockfutPosition").value;
  const result = document.getElementById("stockfutResult");
  const error = document.getElementById("stockfutError");

  if (isNaN(price) || isNaN(entry) || isNaN(leverage) || isNaN(quantity)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }

  let pnl = position === "long" ? (price - entry) : (entry - price);
  pnl *= quantity * leverage;
  const fees = price * quantity * feeRate;
  const profit = pnl - fees;
  const profitRate = (profit / (entry * quantity)) * 100;

  result.innerHTML = `
    <div class="mt-4 p-4 bg-gray-100 rounded-md shadow">
      <p class="font-semibold">💹 레버리지: ${leverage}배</p>
      <p>📊 평가손익: ₩${profit.toLocaleString()} (${profitRate.toFixed(2)}%)</p>
      <p>💸 수수료: ₩${fees.toLocaleString()}</p>
    </div>`;
}

// ✅ 코인선물 물타기 계산기
function calculateCoinFut() {
  const price = parseFloat(document.getElementById("coinfutPrice").value);
  const entry = parseFloat(document.getElementById("coinfutEntryPrice").value);
  const leverage = parseFloat(document.getElementById("coinfutLeverage").value);
  const quantity = parseFloat(document.getElementById("coinfutQuantity").value);
  const feeRate = parseFloat(document.getElementById("coinfutFeeRate").value) / 100;
  const position = document.getElementById("coinfutPosition").value;
  const result = document.getElementById("coinfutResult");
  const error = document.getElementById("coinfutError");

  if (isNaN(price) || isNaN(entry) || isNaN(leverage) || isNaN(quantity)) {
    error.innerText = "입력값을 모두 확인해주세요.";
    result.innerHTML = "";
    return;
  }

  let pnl = position === "long" ? (price - entry) : (entry - price);
  pnl *= quantity * leverage;
  const fees = price * quantity * feeRate;
  const profit = pnl - fees;
  const profitRate = (profit / (entry * quantity)) * 100;

  result.innerHTML = `
    <div class="mt-4 p-4 bg-gray-100 rounded-md shadow">
      <p class="font-semibold">💹 레버리지: ${leverage}배</p>
      <p>📊 평가손익: ₩${profit.toLocaleString()} (${profitRate.toFixed(2)}%)</p>
      <p>💸 수수료: ₩${fees.toLocaleString()}</p>
    </div>`;
}
