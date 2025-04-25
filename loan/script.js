document.addEventListener("DOMContentLoaded", function () {
  window.toggleMemo = function () {
    const memo = document.getElementById("memoArea");
    if (memo) memo.classList.toggle("hidden");
  };
  const checkboxes = document.querySelectorAll('input[name="discount"]');
  const totalDiscount = document.getElementById('totalDiscount');
  const loanForm = document.getElementById("loanForm");
  const resultArea = document.getElementById("resultArea");
  const summaryArea = document.getElementById("summaryArea");

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
    cb.addEventListener("change", updateDiscountDisplay);
  });

  loanForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loanAmountInput = parseFloat(document.getElementById('loanAmount').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const gracePeriod = parseInt(document.getElementById('gracePeriod').value);
    const repayType = document.getElementById('repayType').value;
    const baseRateInput = parseFloat(document.getElementById('baseRate')?.value);
    const baseRate = isNaN(baseRateInput) ? 3.0 : baseRateInput;

    if (isNaN(loanAmountInput) || isNaN(loanTerm) || isNaN(gracePeriod)) {
      resultArea.innerHTML = "<p class='text-red-500'>❗ 모든 항목을 올바르게 입력해 주세요.</p>";
      return;
    }

    let remainingLoan = loanAmountInput;
    const discountSum = updateDiscountDisplay();
    const finalRate = Math.max(baseRate - discountSum, 1.2);
    const monthlyRate = finalRate / 100 / 12;

    const totalMonths = loanTerm * 12;
    const graceMonths = gracePeriod * 12;
    let schedule = [];

    if (repayType === 'equalPrincipalAndInterest') {
      const annuity = remainingLoan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -(totalMonths - graceMonths)));
      for (let i = 1; i <= totalMonths; i++) {
        let interest = remainingLoan * monthlyRate;
        let principal = gracePeriod && i <= graceMonths ? 0 : annuity - interest;
        if (!(gracePeriod && i <= graceMonths)) remainingLoan -= principal;
        schedule.push({ month: i, principal, interest, total: principal + interest });
      }
    } else if (repayType === 'equalPrincipal') {
      const principalPerMonth = remainingLoan / (totalMonths - graceMonths);
      for (let i = 1; i <= totalMonths; i++) {
        let interest = remainingLoan * monthlyRate;
        let principal = gracePeriod && i <= graceMonths ? 0 : principalPerMonth;
        if (!(gracePeriod && i <= graceMonths)) remainingLoan -= principal;
        schedule.push({ month: i, principal, interest, total: principal + interest });
      }
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
