const loanAmountInput = document.querySelector(".loan-amount");
const downPaymentInput = document.querySelector(".down-payment");
const loanTenureInput = document.querySelector(".loan-tenure");
const interestRateInput = document.querySelector(".interest-rate");

const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");

const calculateBtn = document.querySelector(".calculate-btn");

let myChart;

const validateInputs = () => {
  const inputs = [loanAmountInput, downPaymentInput, loanTenureInput, interestRateInput];
  inputs.forEach(input => {
    if (!input.value || isNaN(input.value) || Number(input.value) < 0) {
      alert("Please enter valid numeric values for all fields.");
      throw new Error("Invalid input detected");
    }
  });
};

const calculateEMI = () => {
  validateInputs();

  const loanAmount = parseFloat(loanAmountInput.value);
  const downPayment = parseFloat(downPaymentInput.value);
  const loanTenure = parseFloat(loanTenureInput.value);
  const annualInterestRate = parseFloat(interestRateInput.value);

  const principal = loanAmount - downPayment;
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  const emi = principal * monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, loanTenure) / 
             (Math.pow(1 + monthlyInterestRate, loanTenure) - 1));
  
  const totalAmount = emi * loanTenure;
  const totalInterest = totalAmount - principal;

  return { emi, totalAmount, totalInterest, principal };
};

const updateUI = ({ emi, totalAmount, totalInterest, principal }) => {
  loanEMIValue.textContent = emi.toFixed(2);
  totalAmountValue.textContent = totalAmount.toFixed(2);
  totalInterestValue.textContent = totalInterest.toFixed(2);

  if (myChart) {
    myChart.data.datasets[0].data = [totalInterest, principal];
    myChart.update();
  } else {
    const ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Total Interest", "Principal Loan Amount"],
        datasets: [
          {
            data: [totalInterest, principal],
            backgroundColor: ["#e63946", "#14213d"],
          },
        ],
      },
    });
  }
};

calculateBtn.addEventListener("click", () => {
  try {
    const results = calculateEMI();
    updateUI(results);
  } catch (error) {
    console.error(error.message);
  }
});
