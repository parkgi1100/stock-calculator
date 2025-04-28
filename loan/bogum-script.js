document.addEventListener("DOMContentLoaded", function () {
  const loanForm = document.getElementById("bogumForm");
  const resultArea = document.getElementById("resultArea");
  const summaryArea = document.getElementById("summaryArea");
  const checkboxes = document.querySelectorAll('input[name="discount"]');
  const totalDiscount = document.getElementById('totalDiscount');

  function updateDiscountDisplay() {
    let sum = 0;
    checkboxes.forEach(box => {
      if (box.checked) sum += parseFloat(box.value);
    });
    if (sum > 1.0) sum = 1.0;
    totalDiscount.textContent = `${sum.toFixed(2)}%`;
    return sum;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateDiscountDisplay);
  });

  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loanAmountInput = parseFloat(document.getElementById('loanAmount').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const baseRateInput = parseFloat(document.getElementById('baseRate')?.value);
    const baseRate = isNaN(baseRateInput) ? 3.0 : baseRateInput;

    if (isNaN(loanAmountInput) || isNaN(loanTerm)) {
      resultArea.innerHTML = "<p class='text-red-500'>❗ 모든 항목을 올바르게 입력해 주세요.</p>";
      return;
    }

    const discountSum = updateDiscountDisplay();
    const finalRate = Math.max(baseRate - discountSum, 1.2);
    const monthlyRate = finalRate / 100 / 12;

    const totalMonths = loanTerm * 12;
    let remainingLoan = loanAmountInput;
    let schedule = [];

    const annuity = remainingLoan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalMonths));

    for (let i = 1; i <= totalMonths; i++) {
      let interest = remainingLoan * monthlyRate;
      let principal = annuity - interest;
      remainingLoan -= principal;
      schedule.push({ month: i, principal, interest, total: principal + interest });
    }

    const totalPrincipal = schedule.reduce((sum, r) => sum + r.principal, 0);
    const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0);

    summaryArea.innerHTML = `
      총 원금: ${Math.floor(totalPrincipal).toLocaleString()}원 / 
      총 이자: ${Math.floor(totalInterest).toLocaleString()}원 / 
      총 납입금: ${(Math.floor(totalPrincipal + totalInterest)).toLocaleString()}원
    `;

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
});
