// =============================================================
// Elementos da página
// =============================================================
const medListContainer = document.getElementById('medList');
const interactionsContainer = document.getElementById('interactions');

// =============================================================
// Carregar lista de medicamentos do localStorage
// =============================================================
let listaMed = JSON.parse(localStorage.getItem('listaMed')) || [];

// =============================================================
// Renderizar lista de medicamentos adicionados
// =============================================================
function renderMedList() {
  medListContainer.innerHTML = '';

  if (listaMed.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = 'Nenhum medicamento adicionado.';
    medListContainer.appendChild(p);
    return;
  }

  listaMed.forEach(med => {
    const div = document.createElement('div');
    div.className = 'brutal-box';
    div.style.marginBottom = '10px';
    div.textContent = `${med.nome} | ${med.dose} | ${med.frequencia}`;
    medListContainer.appendChild(div);
  });
}

// =============================================================
// Detectar interações usando interacoes.json
// =============================================================
function detectInteractions() {
  interactionsContainer.innerHTML = '';

  if (listaMed.length < 2) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = 'Nenhuma interação detectada.';
    interactionsContainer.appendChild(p);
    return;
  }

  fetch('../data/interacoes.json')
    .then(response => response.json())
    .then(interacoes => {
      const interacoesEncontradas = [];

      // Comparar todos os pares de medicamentos adicionados
      for (let i = 0; i < listaMed.length; i++) {
        for (let j = i + 1; j < listaMed.length; j++) {
          const medA = listaMed[i].nome;
          const medB = listaMed[j].nome;

          const interacao = interacoes.find(item =>
            (item.med1 === medA && item.med2 === medB) ||
            (item.med1 === medB && item.med2 === medA)
          );

          if (interacao) {
            interacoesEncontradas.push(`${medA} + ${medB}: ${interacao.descricao}`);
          }
        }
      }

      if (interacoesEncontradas.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty-state';
        p.textContent = 'Nenhuma interação detectada.';
        interactionsContainer.appendChild(p);
      } else {
        interacoesEncontradas.forEach(txt => {
          const div = document.createElement('div');
          div.className = 'brutal-box';
          div.style.marginBottom = '10px';
          div.textContent = txt;
          interactionsContainer.appendChild(div);
        });
      }
    })
    .catch(err => {
      console.error('Erro ao carregar interações:', err);
      const p = document.createElement('p');
      p.className = 'empty-state';
      p.textContent = 'Erro ao carregar interações.';
      interactionsContainer.appendChild(p);
    });
}

// =============================================================
// Inicializar página
// =============================================================
renderMedList();
detectInteractions();
