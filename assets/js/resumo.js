// resumo.js
// Gera Resumo Rápido + Resumo Clínico Detalhado para o atendente

// --- Leitura das chaves salvas ---
const medicamentosSelecionados = JSON.parse(localStorage.getItem('medicamentosSelecionados')) || JSON.parse(localStorage.getItem('listaMed')) || [];
const interacoesEncontradas = JSON.parse(localStorage.getItem('interacoesEncontradas')) || [];

// --- Base clínica interna (expansível) ---
const clinicalDB = {
  "Paracetamol": {
    classe: "Analgésico / Antipirético",
    indicacao: "Dor de intensidade leve a moderada; febre",
    mecanismo: "Inibe vias de síntese de prostaglandinas no SNC",
    observacoes: "Evitar overdose; atenção em uso concomitante com álcool ou hepatotóxicos",
    ajuste: "Avaliar função hepática em uso prolongado ou doses altas"
  },
  "Ibuprofeno": {
    classe: "AINE (anti-inflamatório não esteroidal)",
    indicacao: "Dor, inflamação, febre",
    mecanismo: "Inibição das COX-1 e COX-2",
    observacoes: "Pode causar desconforto gástrico; risco aumentado de sangramento com anticoagulantes",
    ajuste: "Evitar em úlcera ativa; cautela em idosos ou insuficiência renal"
  },
  "Amoxicilina": {
    classe: "Antibiótico β-lactâmico",
    indicacao: "Infecções bacterianas sensíveis (vias respiratórias, otites, etc.)",
    mecanismo: "Inibe síntese da parede bacteriana",
    observacoes: "Alergia à penicilina é contra-indicação; ajuste renal em insuficiência",
    ajuste: "Reduzir dose em insuficiência renal grave"
  },
  "Omeprazol": {
    classe: "Inibidor da bomba de prótons",
    indicacao: "Doença ácido-péptica, prevenção de gastrite por AINEs",
    mecanismo: "Inibe a H+/K+-ATPase das células parietais",
    observacoes: "Interações com fármacos que dependem de pH; uso seguro na maioria",
    ajuste: "Geralmente sem ajuste em dose padrão; avaliar interações via pH"
  }
};

// --- Helpers para DOM ---
function q(selector) { return document.querySelector(selector); }
function create(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }

// --- Montar Resumo Rápido ---
function buildQuickSummary() {
  const container = q('#quickSummary');
  container.innerHTML = '';

  const totalMeds = medicamentosSelecionados.length;
  const totalInter = interacoesEncontradas.length;
  const temAlto = interacoesEncontradas.some(i => i.risco === 'alto');
  const sugestaoEncaminhar = temAlto ? 'Recomenda-se encaminhar ao farmacêutico.' : (totalInter > 0 ? 'Monitorar e orientar conforme riscos identificados.' : 'Nenhuma interação significativa.');

  const box = create('div', 'card quick-card');
  box.innerHTML = `
    <h3>Resumo Rápido</h3>
    <p><strong>Medicamentos:</strong> ${totalMeds}</p>
    <p><strong>Interações detectadas:</strong> ${totalInter}</p>
    <p><strong>Risco alto presente:</strong> ${temAlto ? 'Sim' : 'Não'}</p>
    <p><strong>Ação recomendada:</strong> ${sugestaoEncaminhar}</p>
  `;
  container.appendChild(box);
}

// --- Montar lista de medicamentos (detalhada) ---
function buildMedicationList() {
  const ul = q('#medListResumo');
  ul.innerHTML = '';
  if (medicamentosSelecionados.length === 0) {
    const li = create('li'); li.textContent = 'Nenhum medicamento selecionado.'; ul.appendChild(li); return;
  }

  medicamentosSelecionados.forEach(m => {
    const li = create('li', 'med-item');
    const db = clinicalDB[m.nome] || null;
    li.innerHTML = `<strong>${m.nome}</strong> — ${m.dose} — ${m.frequencia}`;
    if (db) {
      const small = create('div', 'med-info');
      small.innerHTML = `<em>${db.classe}</em> • ${db.indicacao}`;
      li.appendChild(small);
    }
    ul.appendChild(li);
  });
}

// --- Montar Resumo Clínico Detalhado por medicamento ---
function buildClinicalDetails() {
  const container = q('#clinicalDetails');
  container.innerHTML = '';

  medicamentosSelecionados.forEach(m => {
    const db = clinicalDB[m.nome] || null;
    const card = create('div', 'card clinical-card');
    if (db) {
      card.innerHTML = `
        <h4>${m.nome} <small>${m.dose}</small></h4>
        <p><strong>Classe:</strong> ${db.classe}</p>
        <p><strong>Indicação:</strong> ${db.indicacao}</p>
        <p><strong>Mecanismo:</strong> ${db.mecanismo}</p>
        <p><strong>Observações:</strong> ${db.observacoes}</p>
        <p><strong>Ajustes/Precauções:</strong> ${db.ajuste}</p>
      `;
    } else {
      card.innerHTML = `<h4>${m.nome}</h4><p>Informações clínicas não disponíveis. Usar julgamento clínico e consultar farmacêutico se necessário.</p>`;
    }
    container.appendChild(card);
  });
}

// --- Montar blocos de interações agrupadas por risco ---
function buildInteractionsGroups() {
  const gAlto = q('#grupoAlto'), gModerado = q('#grupoModerado'), gBaixo = q('#grupoBaixo');
  gAlto.innerHTML = ''; gModerado.innerHTML = ''; gBaixo.innerHTML = '';

  if (interacoesEncontradas.length === 0) {
    q('#noInteractions').style.display = 'block';
    return;
  } else {
    q('#noInteractions').style.display = 'none';
  }

  interacoesEncontradas.forEach(item => {
    const div = create('div', `interaction-card risk-${item.risco}`);
    div.innerHTML = `
      <h3>${item.medicamentoA} × ${item.medicamentoB}</h3>
      <p class="desc">${item.descricao}</p>
      <p class="rec"><strong>Recomendação:</strong> ${item.recomendacao}</p>
    `;

    if (item.risco === 'alto') gAlto.appendChild(div);
    else if (item.risco === 'moderado') gModerado.appendChild(div);
    else gBaixo.appendChild(div);
  });
}

// --- Bloco: O que observar (sinais e sintomas) ---
function buildWhatToObserve() {
  const container = q('#whatToObserve');
  container.innerHTML = '';

  const symptoms = {
    alto: ['Sangramento incomum (gengivas, hemorragia), confusão, sonolência excessiva, desmaios, alterações neurológicas'],
    moderado: ['Náuseas, tontura, desconforto abdominal, cefaleia leve'],
    baixo: ['Sem sinais clínicos específicos — orientar observação']
  };

  const present = {
    alto: interacoesEncontradas.some(i => i.risco === 'alto'),
    moderado: interacoesEncontradas.some(i => i.risco === 'moderado'),
    baixo: interacoesEncontradas.some(i => i.risco === 'baixo')
  };

  if (present.alto) {
    const c = create('div', 'card obs-card');
    c.innerHTML = `<h4>O que observar — Risco Alto</h4><ul>${symptoms.alto.map(s => `<li>${s}</li>`).join('')}</ul>`;
    container.appendChild(c);
  }
  if (present.moderado) {
    const c = create('div', 'card obs-card');
    c.innerHTML = `<h4>O que observar — Risco Moderado</h4><ul>${symptoms.moderado.map(s => `<li>${s}</li>`).join('')}</ul>`;
    container.appendChild(c);
  }
  if (!present.alto && !present.moderado) {
    const c = create('div', 'card obs-card');
    c.innerHTML = `<h4>O que observar</h4><p>${symptoms.baixo.join('; ')}</p>`;
    container.appendChild(c);
  }
}

// --- Bloco: Quando encaminhar ao farmacêutico ---
function buildWhenRefer() {
  const container = q('#whenRefer');
  container.innerHTML = '';
  const reasons = [
    'Qualquer interação classificada como **alto** risco.',
    'Paciente idoso (acima de 65 anos) ou com polifarmácia (≥5 medicamentos).',
    'Uso crônico de AINEs ou anticoagulantes.',
    'Sinais clínicos de alarme relatados pelo paciente.'
  ];
  const card = create('div', 'card refer-card');
  card.innerHTML = `<h4>Quando encaminhar ao farmacêutico</h4><ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul>`;
  container.appendChild(card);
}

// --- Bloco: Educação do paciente ---
function buildPatientEducation() {
  const container = q('#patientEducation');
  container.innerHTML = '';
  const tips = [
    'Não misturar medicamentos com o mesmo princípio ativo.',
    'Tomar conforme prescrito e não exceder a dose.',
    'Evitar álcool quando em uso de paracetamol ou outros hepatotóxicos.',
    'Voltar à drogaria ou procurar o farmacêutico se surgirem sintomas inesperados.'
  ];
  const card = create('div', 'card edu-card');
  card.innerHTML = `<h4>Educação do paciente (não clínica)</h4><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
  container.appendChild(card);
}

// --- Montagem completa ---
function buildFullResumo() {
  buildQuickSummary();
  buildMedicationList();
  buildClinicalDetails();
  buildInteractionsGroups();
  buildWhatToObserve();
  buildWhenRefer();
  buildPatientEducation();
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  buildFullResumo();
});
