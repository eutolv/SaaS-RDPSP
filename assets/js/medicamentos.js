// =============================================================
// Variáveis e elementos
// =============================================================
const searchMed = document.getElementById('searchMed');
const autocompleteList = document.getElementById('autocomplete-list');
const doseSelect = document.getElementById('dose');
const frequencySelect = document.getElementById('frequency');
const addMedBtn = document.getElementById('addMedBtn');
const medList = document.getElementById('medList');
const analyzeBtn = document.getElementById('analyzeBtn');

let medicamentos = [];
let listaAdicionados = JSON.parse(localStorage.getItem('listaMed')) || [];
let selectedMed = null;

// =============================================================
// Carregar medicamentos do JSON
// =============================================================
fetch('../data/medicamentos.json')
  .then(response => response.json())
  .then(data => { medicamentos = data; })
  .catch(err => console.error('Erro ao carregar medicamentos:', err));

// =============================================================
// Função de autocomplete
// =============================================================
searchMed.addEventListener('input', () => {
  const val = searchMed.value.trim().toLowerCase();
  autocompleteList.innerHTML = '';

  if (!val) {
    doseSelect.innerHTML = '<option value="">Selecione um medicamento primeiro</option>';
    doseSelect.disabled = true;
    doseSelect.classList.add('disabled');
    addMedBtn.disabled = true;
    return;
  }

  const filtrados = medicamentos.filter(m => 
    m.nome.toLowerCase().includes(val)
  );

  filtrados.forEach(med => {
    const div = document.createElement('div');
    div.textContent = med.nome;
    div.addEventListener('click', () => selectMedication(med));
    autocompleteList.appendChild(div);
  });
});

// =============================================================
// Selecionar medicamento do autocomplete
// =============================================================
function selectMedication(med) {
  selectedMed = med;
  searchMed.value = med.nome;
  autocompleteList.innerHTML = '';

  // Popular doses
  doseSelect.innerHTML = '';
  med.doses.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    doseSelect.appendChild(option);
  });

  doseSelect.disabled = false;
  doseSelect.classList.remove('disabled');
  addMedBtn.disabled = false;
}

// =============================================================
// Adicionar medicamento à lista (versão FINAL e correta)
// =============================================================
addMedBtn.addEventListener('click', () => {
  if (!selectedMed || !doseSelect.value) return;

  const medObj = {
    nome: selectedMed.nome,
    dose: doseSelect.value,
    frequencia: frequencySelect.value
  };

  listaAdicionados.push(medObj);

  // SALVAR NO LOCALSTORAGE
  localStorage.setItem('listaMed', JSON.stringify(listaAdicionados));

  renderLista();
  
  // Resetar campos
  searchMed.value = '';
  doseSelect.innerHTML = '<option value="">Selecione um medicamento primeiro</option>';
  doseSelect.disabled = true;
  doseSelect.classList.add('disabled');
  addMedBtn.disabled = true;
  selectedMed = null;
});

// =============================================================
// Renderizar lista de medicamentos adicionados
// =============================================================
function renderLista() {
  medList.innerHTML = '';

  if (listaAdicionados.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = 'Nenhum medicamento adicionado ainda';
    medList.appendChild(p);
    analyzeBtn.style.display = 'none';
    return;
  }

  listaAdicionados.forEach((med, index) => {
    const div = document.createElement('div');
    div.className = 'brutal-box';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.marginBottom = '10px';

    div.innerHTML = `
      <span>${med.nome} - ${med.dose} - ${med.frequencia}</span>
      <button style="padding:4px 8px; border:2px solid black; background:white; cursor:pointer;">❌</button>
    `;

    // Remover medicamento
    div.querySelector('button').addEventListener('click', () => {
      listaAdicionados.splice(index, 1);

      // Atualizar localStorage
      localStorage.setItem('listaMed', JSON.stringify(listaAdicionados));

      renderLista();
    });

    medList.appendChild(div);
  });

  analyzeBtn.style.display = 'block';
}

// =============================================================
// Inicializar lista ao abrir página
// =============================================================
renderLista();
