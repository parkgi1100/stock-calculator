<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>디딤돌 대출 계산기</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .ad-container {
      display: none;
      margin: 20px 0;
      text-align: center;
      min-height: 90px;
      background-color: #f9f9f9;
      border: 1px dashed #ccc;
      color: #999;
      font-size: 13px;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body class="bg-white text-gray-800 p-4">
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- 계산기 본문 -->
    <div class="lg:col-span-2">
      <h1 class="text-2xl font-bold mb-4">🏠 디딤돌 대출 계산기 <span class="text-sm text-gray-500">(2025년 4월 11일 기준 최신 개정안 적용)</span></h1>

      <div id="adsense-top" class="ad-container">[광고 자리 - 상단 배너]</div>

      <form id="loanForm" class="space-y-4 bg-gray-50 p-4 rounded-xl shadow">
        <div>
          <label for="annualIncome" class="block font-semibold">연소득 (부부합산, 원)</label>
          <input type="text" id="annualIncome" class="w-full border p-2 rounded" placeholder="예: 50000000">
        </div>

        <div>
          <label for="loanAmount" class="block font-semibold">대출 신청 금액 (원)</label>
          <input type="text" id="loanAmount" class="w-full border p-2 rounded" placeholder="예: 100000000">
        </div>

        <div>
          <label for="loanTerm" class="block font-semibold">대출 만기</label>
          <select id="loanTerm" class="w-full border p-2 rounded">
            <option value="10">10년</option>
            <option value="15">15년</option>
            <option value="20">20년</option>
            <option value="30">30년</option>
          </select>
        </div>

        <div>
          <label for="gracePeriod" class="block font-semibold">거치기간</label>
          <select id="gracePeriod" class="w-full border p-2 rounded">
            <option value="0">없음</option>
            <option value="1">1년</option>
          </select>
        </div>

        <div>
          <label for="repayType" class="block font-semibold">상환방식</label>
          <select id="repayType" class="w-full border p-2 rounded">
            <option value="equalPrincipalAndInterest">원리금 균등</option>
            <option value="equalPrincipal">원금 균등</option>
          </select>
        </div>

        <div>
       <label class="block font-semibold">
  우대금리 조건 (해당 시 체크)<br>
  <span class="text-xs text-gray-500">※ 우대금리는 최대 0.7%까지만 적용됩니다.</span>
</label>
          <div class="grid grid-cols-2 gap-2">
            <label><input type="checkbox" class="mr-1" value="0.7" name="discount"> 다자녀(0.7%)</label>
            <label><input type="checkbox" class="mr-1" value="0.5" name="discount"> 2자녀(0.5%)</label>
            <label><input type="checkbox" class="mr-1" value="0.3" name="discount"> 1자녀(0.3%)</label>
            <label><input type="checkbox" class="mr-1" value="0.2" name="discount"> 신혼가구(0.2%)</label>
            <label><input type="checkbox" class="mr-1" value="0.2" name="discount"> 생애최초(0.2%)</label>
            <label><input type="checkbox" class="mr-1" value="0.3" name="discount"> 청약저축(0.3~0.5%)</label>
          </div>
          <p class="mt-2 text-right text-sm text-gray-600">현재 적용 우대금리: <span id="totalDiscount">0.0%</span></p>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">계산하기</button>
      </form>

      <div id="resultArea" class="mt-6"></div>
      <div id="adsense-bottom" class="ad-container">[광고 자리 - 하단 배너]</div>
    </div>

    <!-- 우측 메모영역 -->
    <aside class="bg-yellow-50 p-4 rounded-xl shadow text-sm leading-relaxed">
      <h2 class="text-lg font-semibold mb-4">📌 참고메모 (2025.04.11. 개정안 적용)</h2>

      <div class="mb-4">
        <h3 class="font-bold text-gray-700 mb-2">✅ 디딤돌 대출 대상자 요건</h3>
        <ul class="list-disc list-inside space-y-1">
          <li>부부합산 연소득 6천만 원 이하</li>
          <li class="whitespace-nowrap">신혼가구 8천5백만 원, 생애최초·다자녀가구 7천만 원 이하</li>
          <li>세대원 전원이 무주택자여야 함</li>
          <li>신청자와 배우자는 대한민국 국적 소지자</li>
          <li>만 30세 이상 단독세대주 또는 일정 조건 만족 시 가능</li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold text-gray-700 mb-2">📌 우대금리 요약</h3>
        <ul class="list-disc list-inside space-y-1">
          <li>최종 우대금리는 최대 <strong>0.5%p</strong>까지 적용 가능</li>
          <li>다자녀의 경우 <strong>0.7%p</strong>까지 별도 허용</li>
          <li>우대금리는 대출 실행일로부터 <strong>5년간 적용</strong></li>
          <li>일부 조건은 중복 적용 불가 (예: 생애최초 + 신혼)</li>
          <li>생애최초 신혼가구의 경우 <strong>최저 금리 1.2%</strong>까지 가능</li>
          <li>실제 금리는 심사 및 기금 기준에 따라 달라질 수 있음</li>
          <li>본 계산기는 2025년 4월 11일 개정 기준 반영</li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold text-gray-700 mb-2">📌 LTV / DTI 기준</h3>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>LTV</strong>: 최대 70% (생애최초 주택구입자는 80%)</li>
          <li>소득추정 적용 시 LTV는 60% 이하 제한</li>
          <li><strong>DTI</strong>: 총부채상환비율 60% 이하 원칙</li>
          <li>DTI 계산 시 모든 주택담보대출의 원리금 포함</li>
        </ul>
      </div>
    </aside>
  </div>

  <footer class="mt-12 w-full border-t pt-6 pb-8 text-center text-sm text-gray-600 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <p class="mb-1">※ 본 사이트는 디딤돌 대출 계산기를 포함한 참고용 도구를 제공하며, 실제 금융기관이 아닙니다.</p>
      <p class="mb-1">※ 모든 결과는 심사 및 정책 변경에 따라 달라질 수 있습니다.</p>
      <p>📬 비즈니스 및 건의사항 문의: <a href="mailto:pb8911@naver.com" class="text-blue-500 underline">pb8911@naver.com</a></p>
    </div>
  </footer>

  
  <script>
  const checkboxes = document.querySelectorAll('input[name="discount"]');
  const totalDiscount = document.getElementById('totalDiscount');
  const loanForm = document.getElementById("loanForm");
  const resultArea = document.getElementById("resultArea");

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

    if (isNaN(loanAmountInput) || isNaN(loanTerm) || isNaN(gracePeriod)) {
      resultArea.innerHTML = "<p class='text-red-500'>❗ 모든 항목을 올바르게 입력해 주세요.</p>";
      return;
    }
    
    e.preventDefault();

    const loanAmountInput = parseFloat(document.getElementById('loanAmount').value);
    let remainingLoan = loanAmountInput;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const gracePeriod = parseInt(document.getElementById('gracePeriod').value);
    const repayType = document.getElementById('repayType').value;

    const discountSum = updateDiscountDisplay();
    const baseRate = 3.0;
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
</script>

</body>
</html>
