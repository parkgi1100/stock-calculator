// 보금자리론 대출 계산기 스크립트 (체증식: 원금 점진 증가 방식 적용)
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

  // 나머지 계산 로직은 그대로 두시면 됩니다.


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
      const baseMonthlyPrincipal = loanAmount / (totalMonths - graceMonths);
      const totalIncreaseFactor = Math.pow(1 + annualIncreaseRate, (totalMonths - graceMonths) / 12);
      let basePayment = baseMonthlyPrincipal / totalIncreaseFactor;
      let month = 0;
      let year = 0;

      while (month < totalMonths && remainingLoan > 0.01) {
        year = Math.floor((month - graceMonths) / 12);
        if (month >= graceMonths) {
          basePayment *= (1 + annualIncreaseRate);
        }

        let interest = remainingLoan * monthlyRate;
        let principal = month < graceMonths ? 0 : Math.min(basePayment, remainingLoan);
        if (month >= graceMonths) remainingLoan -= principal;

        schedule.push({
          month: month + 1,
          principal: Math.max(0, principal),
          interest: Math.max(0, interest),
          total: Math.max(0, principal + interest)
        });

        month++;
        if (remainingLoan <= 0.01) break;
      }
