// ✅ 우대금리 합산 + 상한 적용 (0.7%)
// ※ 우대금리는 최대 0.7%까지만 적용됩니다.
const checkboxes = document.querySelectorAll('input[name="discount"]');
const totalDiscount = document.getElementById('totalDiscount');

function updateDiscountDisplay() {
  let sum = 0;
  checkboxes.forEach(box => {
    if (box.checked) sum += parseFloat(box.value);
  });
  if (sum > 0.7) sum = 0.7;
  totalDiscount.textContent = `${sum.toFixed(2)}%`;
  return sum;
}

checkboxes.forEach(cb => {
  cb.addEventListener('change', updateDiscountDisplay);
});

// ✅ 디딤돌 대출 계산 로직
const loanForm = document.getElementById('loanForm');
const resultArea = document.getElementById('resultArea');

loanForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const loanAmountInput = parseFloat(document.getElementById('loanAmount').value);
  let loanAmount = loanAmountInput; // 원본 유지용
  const loanTerm = parseInt(document.getElementById('loanTerm').value);
  const gracePeriod = parseInt(document.getElementById('gracePeriod').value);
  const repayType = document.getElementById('repayType').value;
  const discountRate = updateDiscountDisplay();

  let baseRate = 3.0;
  let finalRate = Math.max(baseRate - discountRate, 1.2);
  const monthlyRate = finalRate / 100 / 12;

  const totalMonths = loanTerm * 12;
  const graceMonths = gracePeriod * 12;

  let schedule = [];

  if (repayType === 'equalPrincipalAndInterest') {
    const annuity = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -(totalMonths - graceMonths)));

    for (let i = 1; i <= totalMonths; i++) {
      let interest = loanAmount * monthlyRate;
      let principal = gracePeriod && i <= graceMonths ? 0 : annuity - interest;
      if (!(gracePeriod && i <= graceMonths)) loanAmount -= principal;
      schedule.push({
        month: i,
        principal: principal,
        interest: interest,
        total: principal + interest
      });
    }
  } else if (repayType === 'equalPrincipal') {
    const principalPerMonth = loanAmount / (totalMonths - graceMonths);

    for (let i = 1; i <= totalMonths; i++) {
      let interest = loanAmount * monthlyRate;
      let principal = gracePeriod && i <= graceMonths ? 0 : principalPerMonth;
      if (!(gracePeriod && i <= graceMonths)) loanAmount -= principal;
      schedule.push({
        month: i,
        principal: principal,
        interest: interest,
        total: principal + interest
      });
    }
  }

  resultArea.innerHTML = `
    <h3 class="text-lg font-bold mb-2">📅 월별 상환 내역</h3>
    <table class="w-full text-sm border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-1">월</th>
          <th class="border p-1">원금</th>
          <th class="border p-1">이자</th>
          <th class="border p-1">합계</th>
        </tr>
      </thead>
      <tbody>
        ${schedule.map(row => `
          <tr>
            <td class="border text-center">${row.month}</td>
            <td class="border text-right">${Math.floor(row.principal).toLocaleString()}</td>
            <td class="border text-right">${Math.floor(row.interest).toLocaleString()}</td>
            <td class="border text-right">${Math.floor(row.total).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});
