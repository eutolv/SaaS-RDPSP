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
// Utilitários
// =============================================================
function classifyRisk(description = '') {
  const txt = description.toLowerCase();
  // palavras-chaves simples para classificar risco
  const high = ['risco', 'grave', 'sangramento', 'tox', 'toxic', 'síndrome serotonin', 'serotoninérgica', 'síndrome serotoninérgica'];
  const moderate = ['pode', 'reduz', 'aumenta', 'ligeir', 'leve', 'potencial'];
  for (const k of high) if (txt.includes(k)) return 'alto';
  for (const k of moderate) if (txt.includes(k)) return 'moderado';
  return 'baixo';
}

function recommendationByRisk(risco) {
  if (risco === 'alto') {
    return 'Encaminhar ao farmacêutico. Avaliar suspensão/ajuste e monitorar sinais de alerta (sangramentos, sedação intensa, sintomas neurológicos).';
  } else if (risco === 'moderado') {
    return 'Orientar o paciente sobre sinais a observar e monitorar; considerar revisão de esquema quando pertinente.';
  } else {
    return 'Sem ação imediata recomendada. Orientar observação e adesão correta.';
  }
}

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

  // salvar medicamentos selecionados em chave amigável para o resumo
  localStorage.setItem('medicamentosSelecionados', JSON.stringify(listaMed));

  if (listaMed.length < 2) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = 'Nenhuma interação detectada.';
    interactionsContainer.appendChild(p);

    // garantir que a chave de interações esteja vazia
    localStorage.setItem('interacoesEncontradas', JSON.stringify([]));
    return;
  }

  fetch('../data/interacoes.json')
    .then(response => {
      if (!response.ok) throw new Error('JSON interacoes não encontrado');
      return response.json();
    })
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
            const risco = classifyRisk(interacao.descricao);
            const recomendacao = recommendationByRisk(risco);

            // armazenar objeto estruturado
            interacoesEncontradas.push({
              medicamentoA: medA,
              medicamentoB: medB,
              descricao: interacao.descricao,
              risco,
              recomendacao
            });
          }
        }
      }

      // Persistir as interações estruturadas para o resumo
      localStorage.setItem('interacoesEncontradas', JSON.stringify(interacoesEncontradas));

      // Exibir na página
      if (interacoesEncontradas.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty-state';
        p.textContent = 'Nenhuma interação detectada.';
        interactionsContainer.appendChild(p);
      } else {
        interacoesEncontradas.forEach(obj => {
          const div = document.createElement('div');
          div.className = 'brutal-box';
          div.style.marginBottom = '10px';
          div.innerHTML = `<strong>${obj.medicamentoA} + ${obj.medicamentoB}</strong>: ${obj.descricao} <br><em>Risco:</em> ${obj.risco}`;
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

      // garantir que a chave de interações esteja vazia ao falhar
      localStorage.setItem('interacoesEncontradas', JSON.stringify([]));
    });
}

// =============================================================
// Inicializar página
// =============================================================
renderMedList();
detectInteractions();
