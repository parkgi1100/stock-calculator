
document.addEventListener("DOMContentLoaded", function () {
  const loanForm = document.getElementById("bogumForm");
  const resultArea = document.getElementById("resultArea");
  const summaryArea = document.getElementById("summaryArea");
  const checkboxes = document.querySelectorAll('input[name="discount"]');
  const totalDiscount = document.getElementById('totalDiscount');

  if (!loanForm) return;

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
    resultArea.innerHTML = "";
    summaryArea.innerHTML = "";

    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const gracePeriod = parseInt(document.getElementById('gracePeriod')?.value || 0);
    const repayType = document.getElementById('repayType').value;
    const baseRateInput = parseFloat(document.getElementById('baseRate').value);
    const baseRate = isNaN(baseRateInput) ? 3.0 : baseRateInput;

    if (isNaN(loanAmount) || isNaN(loanTerm)) {
      resultArea.innerHTML = "<p class='text-red-500 text-center'>❗ 모든 항목을 올바르게 입력해 주세요.</p>";
      return;
    }

    const discountSum = updateDiscountDisplay();
    const finalRate = Math.max(baseRate - discountSum, 1.2);
    const monthlyRate = finalRate / 100 / 12;

    const totalMonths = loanTerm * 12;
    const graceMonths = gracePeriod * 12;
    let remainingLoan = loanAmount;
    let schedule = [];

    if (repayType === 'equalPrincipalAndInterest') {
      const annuity = remainingLoan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -(totalMonths - graceMonths)));
      for (let i = 1; i <= totalMonths; i++) {
        if (i <= graceMonths) {
          let interest = remainingLoan * monthlyRate * 1.05;
          schedule.push({ month: i, principal: 0, interest, total: interest });
        } else {
          let interest = remainingLoan * monthlyRate;
          let principal = annuity - interest;
          remainingLoan -= principal;
          schedule.push({ month: i, principal, interest, total: principal + interest });
        }
      }
    } else if (repayType === 'equalPrincipal') {
      const principalPerMonth = remainingLoan / (totalMonths - graceMonths);
      for (let i = 1; i <= totalMonths; i++) {
        if (i <= graceMonths) {
          let interest = remainingLoan * monthlyRate;
          schedule.push({ month: i, principal: 0, interest, total: interest });
        } else {
          let interest = remainingLoan * monthlyRate;
          let principal = principalPerMonth;
          remainingLoan -= principal;
          schedule.push({ month: i, principal, interest, total: principal + interest });
        }
      }
    } else if (repayType === 'graduatedPayment') {
      const annualIncreaseRate = 0.02;
      const monthlyIncreaseRate = Math.pow(1 + annualIncreaseRate, 1 / 12) - 1;
      const repayMonths = totalMonths - graceMonths;

      // 체증률 누적 계수로 basePayment 역산
      let cumulativeFactor = 0;
      for (let i = 0; i < repayMonths; i++) {
        cumulativeFactor += Math.pow(1 + monthlyIncreaseRate, i);
      }
      let basePayment = loanAmount / cumulativeFactor;

      let month = 0;
      while (month < totalMonths && remainingLoan > 0.01) {
        let interest = remainingLoan * monthlyRate;
        let principal = 0;

        if (month >= graceMonths) {
          let factor = Math.pow(1 + monthlyIncreaseRate, month - graceMonths);
          principal = Math.min(basePayment * factor, remainingLoan);
          remainingLoan -= principal;
        }

        schedule.push({
          month: month + 1,
          principal: Math.max(0, principal),
          interest: Math.max(0, interest),
          total: Math.max(0, principal + interest)
        });

        month++;
      }
    }

    const totalPrincipal = schedule.reduce((sum, r) => sum + (r.principal || 0), 0);
    const totalInterest = schedule.reduce((sum, r) => sum + (r.interest || 0), 0);

    summaryArea.innerHTML = `
      <div class="bg-blue-100 p-4 rounded-lg shadow mb-6 text-center">
        <p class="text-lg font-bold text-gray-900 mb-2">📋 대출 요약</p>
        <p class="text-base text-gray-700">총 원금: ${Math.floor(totalPrincipal).toLocaleString()}원</p>
        <p class="text-base text-gray-700">총 이자: ${Math.floor(totalInterest).toLocaleString()}원</p>
        <p class="text-base text-gray-700">총 납입금: ${(Math.floor(totalPrincipal + totalInterest)).toLocaleString()}원</p>
         <!-- ✅ 안내 문구 추가 -->
  <p class="text-sm text-gray-600 mt-4">
    보다 정확한 계산을 위해서는 해당 금융기관의 공식 계산기를 이용하시거나, 금융 상담을 받으시는 것을 권장드립니다.
  </p>
      </div>
    `;

    resultArea.innerHTML = `
      <h3 class="text-lg font-bold mb-4 text-center">📅 월별 상환 내역</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border">
          <thead>
            <tr class="bg-gray-200">
              <th class="border p-2">월</th>
              <th class="border p-2">원금</th>
              <th class="border p-2">이자</th>
              <th class="border p-2">합계</th>
            </tr>
          </thead>
          <tbody>
            ${schedule.map(row => `
              <tr>
                <td class="border text-center">${row.month}</td>
                <td class="border text-right">${Math.floor(row.principal || 0).toLocaleString()}</td>
                <td class="border text-right">${Math.floor(row.interest || 0).toLocaleString()}</td>
                <td class="border text-right">${Math.floor(row.total || 0).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });
});
