document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cocomoForm");
  const results = document.getElementById("results");

  const effortResult = document.getElementById("effortResult");
  const durationResult = document.getElementById("durationResult");
  const teamSizeResult = document.getElementById("teamSizeResult");
  const productivityResult = document.getElementById("productivityResult");
  const salaryDisplay = document.getElementById("salaryDisplay");
  const totalCostResult = document.getElementById("totalCostResult");

  const effortInterpretation = document.getElementById("effortInterpretation");
  const durationInterpretation = document.getElementById("durationInterpretation");
  const teamSizeInterpretation = document.getElementById("teamSizeInterpretation");
  const costInterpretation = document.getElementById("costInterpretation");

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const parent = tab.closest(".tabs");
      const activeTab = parent.querySelector(".tab.active");
      const activePane = parent.querySelector(".tab-pane.active");
      const newTab = tab.dataset.tab;
      const newPane = parent.querySelector(`#${newTab}Tab`);

      activeTab.classList.remove("active");
      activePane.classList.remove("active");
      tab.classList.add("active");
      newPane.classList.add("active");

      if (newTab === "teamSize") {
        document.getElementById("duration").value = "";
      } else {
        document.getElementById("teamSize").value = "";
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const kloc = parseFloat(document.getElementById("kloc").value);
    const teamSizeInput = document.getElementById("teamSize").value.trim();
    const durationInput = document.getElementById("duration").value.trim();
    const monthlySalary = parseFloat(document.getElementById("monthlySalary").value);

    if (!isPositiveNumber(kloc) || !isPositiveNumber(monthlySalary)) {
      alert("KLOC y salario deben ser valores numéricos mayores que cero.");
      return;
    }

    if (teamSizeInput && durationInput) {
      alert("Por favor, llena solo uno: tamaño de equipo o duración.");
      return;
    }

    const eaf = getEAF();
    const effort = calculateEffort(kloc, eaf);

    let duration, teamSize;

    if (teamSizeInput) {
      teamSize = parseFloat(teamSizeInput);
      duration = effort / teamSize;
    } else if (durationInput) {
      duration = parseFloat(durationInput);
      teamSize = effort / duration;
    } else {
      duration = 2.5 * Math.pow(effort, 0.38);
      teamSize = effort / duration;
    }

    const productivity = kloc / effort;
    const { costs: yearlyCosts, totalCost } = calculateCostOverYears(effort, monthlySalary, teamSize);

    displayResults({
      effort,
      duration,
      teamSize,
      productivity,
      monthlySalary,
      totalCost,
      yearlyCosts
    });
  });

  function isPositiveNumber(value) {
    return !isNaN(value) && value > 0;
  }

  function getEAF() {
    const factors = [
      "rely", "data", "cplx", "time", "stor", "virt", "turn",
      "acap", "aexp", "pcap", "vexp", "lexp", "modp", "tool", "sced"
    ];
    return factors.reduce((acc, id) => {
      const value = parseFloat(document.getElementById(id).value);
      return acc * (isNaN(value) ? 1 : value); // default to 1 ("ninguno") if invalid
    }, 1);
  }

  function calculateEffort(kloc, eaf) {
    const a = 2.4;
    const b = 1.05;
    return a * Math.pow(kloc, b) * eaf;
  }

  function calculateCostOverYears(effort, salary, teamSize) {
    const costs = [];
    let remainingEffort = effort;
    let currentYear = 1;
    let monthlyCost = salary * teamSize;
    let totalCost = 0;

    while (remainingEffort > 0) {
      const months = Math.min(12, remainingEffort / teamSize);
      const yearlyCost = months * monthlyCost;
      costs.push({ year: currentYear, cost: yearlyCost });
      totalCost += yearlyCost;
      remainingEffort -= months * teamSize;
      monthlyCost *= 1.05;
      currentYear++;
    }

    return { costs, totalCost };
  }

  function displayResults({ effort, duration, teamSize, productivity, monthlySalary, totalCost, yearlyCosts }) {
    effortResult.textContent = `${effort.toFixed(2)} persona-meses`;
    durationResult.textContent = `${duration.toFixed(2)} meses`;
    teamSizeResult.textContent = `${teamSize.toFixed(2)} personas`;
    productivityResult.textContent = `${productivity.toFixed(2)} KLOC/persona-mes`;
    salaryDisplay.textContent = `$${monthlySalary.toFixed(2)}`;
    totalCostResult.textContent = `$${totalCost.toFixed(2)}`;

    effortInterpretation.textContent = effort.toFixed(2);
    durationInterpretation.textContent = duration.toFixed(2);
    teamSizeInterpretation.textContent = teamSize.toFixed(2);
    costInterpretation.textContent = `$${totalCost.toFixed(2)}`;

    results.classList.remove("hidden");

    document.getElementById("effortAnalysis").innerHTML = yearlyCosts.map(y =>
      `<div>Año ${y.year}: ${(y.cost / monthlySalary).toFixed(2)} persona-meses</div>`
    ).join("");

    document.getElementById("costByYear").innerHTML = yearlyCosts.map(y =>
      `<div>Año ${y.year}: $${y.cost.toFixed(2)}</div>`
    ).join("");
  }
});
