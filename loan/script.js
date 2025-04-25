// ✅ 우대금리 합산 (기존 유지)
const checkboxes = document.querySelectorAll('input[name="discount"]');
const totalDiscount = document.getElementById('totalDiscount');

checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    let sum = 0;
    checkboxes.forEach(box => {
      if (box.checked) sum += parseFloat(box.value);
    });
    totalDiscount.textContent = `${sum.toFixed(2)}%`;
  });
});

// ✅ 디딤돌 대출 계산 로직 시작
const loanForm = document.getElementById('loanForm');
const resultArea = document.getElementById('resultArea');

loanForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // 입력값 가져오기
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const loanTerm = parseInt(document.getElementById('loanTerm').value);
  const gracePeriod = parseInt(document.getElementById('gracePeriod').value);
  const repayType = document.getElementById('repayType').value;
  const discountRate = parseFloat(totalDiscount.textContent);

  // 기준금리 설정 (예시)
  let baseRate = 3.0;
  let finalRate = Math.max(baseRate - discountRate, 1.2); // 최저금리 제한 적용
  const monthlyRate = finalRate / 100 / 12;

  const totalMonths = loanTerm * 12;
  const graceMonths = gracePeriod * 12;

  let schedule = [];

  if (repayType === 'equalPrincipalAndInterest') {
    // 원리금 균등
    const annuity = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -(totalMonths - graceMonths)));

    for (let i = 1; i <= totalMonths; i++) {
      let interest = loanAmount * monthlyRate;
      let principal = annuity - interest;
      loanAmount -= gracePeriod && i <= graceMonths ? 0 : principal;
      schedule.push({
        month: i,
        principal: gracePeriod && i <= graceMonths ? 0 : principal,
        interest: interest,
        total: gracePeriod && i <= graceMonths ? interest : annuity
      });
    }
  } else if (repayType === 'equalPrincipal') {
    // 원금 균등
    const principalPerMonth = loanAmount / (totalMonths - graceMonths);

    for (let i = 1; i <= totalMonths; i++) {
      let interest = loanAmount * monthlyRate;
      let principal = gracePeriod && i <= graceMonths ? 0 : principalPerMonth;
      loanAmount -= principal;
      schedule.push({
        month: i,
        principal: principal,
        interest: interest,
        total: principal + interest
      });
    }
  }

  // 결과 출력
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
            <td class="border text-right">${row.principal.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td class="border text-right">${row.interest.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td class="border text-right">${row.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});
