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
    
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  
    // Tabs
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
  
        // Resetear campos cuando se cambia de modo
        if (newTab === "teamSize") {
          document.getElementById("duration").value = "";
        } else {
          document.getElementById("teamSize").value = "";
        }
      });
    });
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      // Obtener valores del formulario
      const kloc = parseFloat(document.getElementById("kloc").value);
      const teamSizeInput = document.getElementById("teamSize").value.trim();
      const durationInput = document.getElementById("duration").value.trim();
      const monthlySalary = parseFloat(document.getElementById("monthlySalary").value);
  
      const rely = parseFloat(document.getElementById("rely").value);
      const aexp = parseFloat(document.getElementById("aexp").value);
      const tool = parseFloat(document.getElementById("tool").value);
      const eaf = rely * aexp * tool;
  
      const a = 2.4;
      const b = 1.05;
      const effort = a * Math.pow(kloc, b) * eaf;
  
      let duration, teamSize;
  
      if (teamSizeInput && durationInput) {
        alert("Por favor, llena solo uno: tamaño de equipo o duración, no ambos.");
        return;
      }
  
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
  
      let totalCost = 0;
      const yearlyCosts = [];
      let remainingEffort = effort;
      let currentYear = 1;
      let monthlyCost = monthlySalary * teamSize;
  
      while (remainingEffort > 0) {
        let months = Math.min(12, remainingEffort / teamSize);
        const yearlyCost = months * monthlyCost;
        yearlyCosts.push({ year: currentYear, cost: yearlyCost });
        totalCost += yearlyCost;
        remainingEffort -= months * teamSize;
        monthlyCost *= 1.05;
        currentYear++;
      }
  
      // Mostrar resultados
      effortResult.textContent = `${effort.toFixed(2)} persona-meses`;
      durationResult.textContent = `${duration.toFixed(2)} meses`;
      teamSizeResult.textContent = `${teamSize.toFixed(2)} personas`;
      productivityResult.textContent = `${productivity.toFixed(2)} KLOC/persona-mes`;
      salaryDisplay.textContent = `$${monthlySalary.toFixed(2)}`;
      totalCostResult.textContent = `$${totalCost.toFixed(2)}`;
  
      // Interpretación
      effortInterpretation.textContent = effort.toFixed(2);
      durationInterpretation.textContent = duration.toFixed(2);
      teamSizeInterpretation.textContent = teamSize.toFixed(2);
      costInterpretation.textContent = `$${totalCost.toFixed(2)}`;
  
      // Mostrar resultados
      results.classList.remove("hidden");
  
      // Distribución y costos
      const effortAnalysis = document.getElementById("effortAnalysis");
      const costByYear = document.getElementById("costByYear");
      effortAnalysis.innerHTML = yearlyCosts.map(y =>
        `<div>Año ${y.year}: ${(y.cost / monthlySalary).toFixed(2)} persona-meses</div>`
      ).join("");
  
      costByYear.innerHTML = yearlyCosts.map(y =>
        `<div>Año ${y.year}: $${y.cost.toFixed(2)}</div>`
      ).join("");
    });
  });
  