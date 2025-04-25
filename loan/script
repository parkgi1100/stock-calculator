
function updateRateDisplay() {
  const checked = document.querySelectorAll('.rate-check:checked');
  let total = 0;
  checked.forEach(cb => total += parseFloat(cb.value));
  total = Math.min(total, 1.0);
  const rateText = document.getElementById("rateTotal");
  if (rateText) {
    rateText.innerText = `✅ 현재 적용 중인 우대금리: ${total.toFixed(2)}%p`;
  }
}

document.querySelectorAll('.rate-check').forEach(cb => {
  cb.addEventListener('change', updateRateDisplay);
});
updateRateDisplay();

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    const raw = input.value.replace(/[^\d]/g, '');
    if (!raw) return;
    const formatted = Number(raw).toLocaleString();
    input.value = formatted;
  });
  input.addEventListener('blur', () => {
    input.value = input.value.replace(/[^\d]/g, '');
  });
});

function showResultBox() {
  const box = document.getElementById("resultBox");
  if (box) {
    box.style.display = "block";
    box.classList.add("fade-in");
  }
}

function printResult() {
  const resultContent = document.getElementById("resultBox").innerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write('<html><head><title>대출 결과</title></head><body>' + resultContent + '</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function downloadResultAsText() {
  const content = document.getElementById("resultBox").innerText;
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'didimdol_result.txt';
  link.click();
}
