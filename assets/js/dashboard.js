// ------------ Dados Fake ------------

// 🔥 Interações detectadas (fake)
const interacoesFake = [
  { nome: "Ibuprofeno × Paracetamol", count: 42 },
  { nome: "Omeprazol × Amoxicilina", count: 31 },
  { nome: "Paracetamol × Amoxicilina", count: 27 },
  { nome: "Ibuprofeno × Omeprazol", count: 24 },
  { nome: "Dipirona × Ibuprofeno", count: 20 },
  { nome: "Losartana × Ibuprofeno", count: 18 },
  { nome: "Ranitidina × Omeprazol", count: 14 },
  { nome: "Prednisona × Ibuprofeno", count: 12 },
  { nome: "Nimesulida × Paracetamol", count: 11 },
  { nome: "AAS × Ibuprofeno", count: 9 }
];

// 🔥 Distribuição de classes (fake)
const classesFake = {
  "Analgesicos": 34,
  "Anti-inflamatórios": 29,
  "Antibióticos": 18,
  "Gastrintestinais": 14,
  "Antihipertensivos": 8
};

// 🔥 Dados fake para lojas
const lojasFake = {
  "Loja 01": 120,
  "Loja 02": 95,
  "Loja 03": 76,
  "Loja 04": 155
};

// ------------ Atualização dos Cards ------------

document.getElementById("statTotalInteracoes").textContent = interacoesFake.reduce((s, i) => s + i.count, 0);
document.getElementById("statRiscoAlto").textContent = 12; // fake
document.getElementById("statMedicamentos").textContent = 48; // fake

// ------------ Gráfico 1 — Top 10 Interações ------------

new Chart(document.getElementById("chartTopInteracoes"), {
  type: "bar",
  data: {
    labels: interacoesFake.map(i => i.nome),
    datasets: [{
      label: "Ocorrências",
      data: interacoesFake.map(i => i.count)
    }]
  }
});

// ------------ Gráfico 2 — Classes Terapêuticas ------------

new Chart(document.getElementById("chartClasse"), {
  type: "pie",
  data: {
    labels: Object.keys(classesFake),
    datasets: [{
      data: Object.values(classesFake)
    }]
  }
});

// ------------ Gráfico 3 — Uso por Loja ------------

new Chart(document.getElementById("chartLojas"), {
  type: "bar",
  data: {
    labels: Object.keys(lojasFake),
    datasets: [{
      label: "Consultas realizadas",
      data: Object.values(lojasFake)
    }]
  }
});
