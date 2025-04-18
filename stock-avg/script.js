// HTML 로딩 끝난 뒤에 실행되게 함
document.addEventListener('DOMContentLoaded', () => {
  // 사팔사팔 계산기 HTML 불러오기
  fetch('sapal-calculator.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('sapal-container').innerHTML = html;
    })
    .catch(err => console.error('사팔사팔 HTML 불러오기 실패:', err));

  // 물타기 계산기(표) HTML 불러오기
  fetch('multagi-table.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('multagi-container').innerHTML = html;
    })
    .catch(err => console.error('물타기표 HTML 불러오기 실패:', err));
});

// 사팔사팔 계산기 동작
function calculateSapal() {
  const amount = parseFloat(document.getElementById('sapalAmount').value);
  const price = parseFloat(document.getElementById('sapalPrice').value);

  if (isNaN(amount) || isNaN(price)) {
    document.getElementById('sapal-result').innerText = '❗숫자를 정확히 입력해주세요.';
    return;
  }

  const qty = amount / price;
  document.getElementById('sapal-result').innerText = `🟢 구매 가능 수량: ${qty.toFixed(2)}주`;
}

// 물타기 계산기(표) 동작
function calculateMultagi() {
  const amount1 = parseFloat(document.getElementById('amount-1').value);
  const price1 = parseFloat(document.getElementById('price-1').value);

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
