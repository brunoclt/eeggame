const headImage = document.getElementById('head-image');
const pontosContainer = document.getElementById('pontos-container');
const eletrodos = document.querySelectorAll('.eletrodo');
const gaze = document.getElementById('gaze');
const pasta = document.getElementById('pasta-eeg');

let visaoAtual = 'frente';
let usandoGaze = false;
let eletrodosPreparados = {};
let medicaoTravada = false;
let mostrarSomenteRef = false;
let mostrarSomenteT4 = false;
let mostrarSomenteF4 = false;
let mostrarSomenteF3 = false;
let mostrarSomenteA1 = false;
let linhaC3CzFinalizada = false;
let linhaFp2F4Finalizada = false;
let linhaRefSVG = null;
let sequenciaFinalizada = false;
let medindoLateral = false;

const linhaMedicao = document.getElementById('linha-medicao');
const instrucaoMedicao = document.getElementById('instrucao-medicao');
const resultadoMedicao = document.getElementById('resultado-medicao');
const setaTroca = document.getElementById('seta-troca-visao');

let modoMedicaoAtivo = false;
let pontosMedidos = {
  frente: [],
  atras: [],
  cima: [],
  esquerda: [],
  direita: [],
};

const origemLateralDireita = { x: 150, y: 20 };
const origemlateralDiagonal = { x: 129, y: 160 };

const estadoEletrodos = {
  Fp1: { colocado: false, limpo: false },
  Fp2: { colocado: false, limpo: false },
  Ref: { colocado: false, limpo: false },
  Testa: { colocado: false, limpo: false },
  Fz: { colocado: false, limpo: false },
  Cz: { colocado: false, limpo: false },
  Pz: { colocado: false, limpo: false },
  Oz: { colocado: false, limpo: false },
  C4: { colocado: false, limpo: false },
  T4: { colocado: false, limpo: false },  
  T3: { colocado: false, limpo: false },  
  C3: { colocado: false, limpo: false },  
  F8: { colocado: false, limpo: false },  
  T6: { colocado: false, limpo: false },  
  O2: { colocado: false, limpo: false },  
  F7: { colocado: false, limpo: false },  
  T5: { colocado: false, limpo: false },  
  O1: { colocado: false, limpo: false },  
  F4: { colocado: false, limpo: false },  
  C4: { colocado: false, limpo: false },  
  P4: { colocado: false, limpo: false }, 
  F3: { colocado: false, limpo: false }, 
  P3: { colocado: false, limpo: false }, 
  A1: { colocado: false, limpo: false }, 
  A2: { colocado: false, limpo: false }, 
};

// ======= COORDENADAS POR VISÃO =======
const coordenadasPorVisao = {
  frente: {
    Ref: { x: 178, y: 200 },
    Testa: { x: 178, y: 140 },
    Fz: { x: 178, y: 50 },
    Fp2: { x: 115, y: 130 },
    Fp1: { x: 240, y: 130 },
    F8: { x: 40, y: 170 },
    F7: { x: 315, y: 170 },
    F4: { x: 83, y: 95 },
    F3: { x: 270, y: 95 },
    A1: { x: 30, y: 320 },
    A2: { x: 320, y: 320 },
  },
  cima: {
    Cz: { x: 175, y: 35 },
    Fz: { x: 175, y: 120 },
    Testa: { x: 175, y: 200 },
    Ref: { x: 175, y: 300 },
    C4: { x: 35, y: 100 },
    C3: { x: 320, y: 100 },
    F7: { x: 315, y: 225 },
    F8: { x: 40, y: 225 },
    T3: { x: 340, y: 195 },
    T4: { x: 20, y: 185 },
    P4: { x: 55, y: 45 },
    P3: { x: 310, y: 45 },
    F4: { x: 70, y: 150 }, 
    F3: { x: 290, y: 150 }, 
    Fp2: { x: 115, y: 230 },
    Fp1: { x: 235, y: 230 },
  },
  atras: {
    Cz: { x: 185, y: 0 },
    Pz: { x: 185, y: 55 }, 
    Oz: { x: 185, y: 170 },
    O2: { x: 265, y: 170 },
    O1: { x: 100, y: 170 },
    P3: { x: 265, y: 55 }, 
    P4: { x: 100, y: 55 }, 
  },
  direita: {
    T4: { x: 120, y: 145},
    C4: { x: 120, y: 55},
    Cz: { x: 120, y: 0 },
    Fz: { x: 210, y: 5 },
    F8: { x: 190, y: 145},
    T6: { x: 30, y: 145},
    Fp2: { x: 265, y: 130 },
    F4: { x: 205, y: 70, },
    P4: { x: 35, y: 60 },
  },
  esquerda: {
    T3: { x: 245, y: 145},
    C3: { x: 245, y: 70},
    Cz: { x: 245, y: -5 },
    Fz: { x: 135, y: 0},
    F7: { x: 180, y: 145},
    F3: { x: 160, y: 70},
    T5: { x: 330, y: 145},
    P3: { x: 330, y: 70},
    Fp1: { x: 80, y: 135 }
  },
};

let indiceAtual = 0;

const pontosEsperados = {
  frente: [
    { nome: 'glabela', x: 189, y: 210 },
    { nome: 'occipital', x: 189, y: 20 }
  ],
  atras: [
    { nome: 'inion', x: 191, y: 280 }
  ],
  lateralEsquerda: [
    { nome: 'orelha esquerda', x: 235, y: 250 },
    { nome: 'marcação lateral esquerda', x: 240, y: 20 }
  ],
  lateralDireita: [
    { nome: 'orelha direita', x: 150, y: 250 }
  ],
  frenteDiagonal: [
    { nome: 'Fp1', x: 245, y: 150},
    { nome: 'F3', x: 325, y: 190},
  ],
  lateralDiagonal: [
    { nome: 'segundo', x: 50, y: 160},
    { nome: 'terceiro', x: 15, y: 160},
  ],

};


function mostrarPontoAtual() {
  const container = document.getElementById('pontos-validacao');
  container.innerHTML = '';

  const pontos = pontosEsperados[visaoAtual];
  if (!pontos || indiceAtual >= pontos.length) return;

  console.log(`Renderizando ponto para visão ${visaoAtual}, primeira vez?`, pontosMedidos[visaoAtual].length === 0);
  const ponto = pontos[indiceAtual];

  const div = document.createElement('div');
  div.classList.add('ponto-medicao');
  div.id = `ponto-medicao-${indiceAtual}`;
  div.style.left = `${ponto.x}px`;
  div.style.top = `${ponto.y}px`;
  div.title = ponto.nome;

  container.appendChild(div);

  instrucaoMedicao.textContent = `Clique no ponto: ${ponto.nome}`;
}

function ativarModoMedicao() {
  const botao = document.getElementById('button-medicao');
  if (botao) botao.style.display = 'none';

  modoMedicaoAtivo = true;
  visaoAtual = 'frente';
  pontosMedidos = { frente: [], atras: [] };
  instrucaoMedicao.textContent = 'Clique no primeiro ponto (frente)';
  resultadoMedicao.textContent = '';
  setaTroca.style.display = 'none';
  linhaMedicao.innerHTML = '';
  indiceAtual = 0;
  mostrarPontoAtual();
}

function ativarMedicaoLateral() {
  modoMedicaoAtivo = true;
  medindoLateral = true;
  visaoAtual = 'lateralEsquerda';
  pontosMedidos.lateralEsquerda = [];
  pontosMedidos.lateralDireita = [];
  instrucaoMedicao.textContent = 'Clique na orelha ESQUERDA';
  resultadoMedicao.textContent = '';
  setaTroca.style.display = 'none';
  linhaMedicao.innerHTML = '';
  indiceAtual = 0;

  pontosContainer.innerHTML = ''; 
  mostrarPontoAtual();
}

function ativarMedicaoFp1() {
  modoMedicaoAtivo = true;
  medindoLateral = true;
  visaoAtual = 'frenteDiagonal';
  medicaoTravada = false;
  pontosMedidos.frenteDiagonal = [];
  pontosMedidos.lateralFp1 = [];
  instrucaoMedicao.textContent = 'Clique no ponto FP1';
  resultadoMedicao.textContent = '';
  setaTroca.style.display = 'none';
  linhaMedicao.innerHTML = '';
  indiceAtual = 0;

  pontosContainer.innerHTML = ''; 
  mostrarPontoAtual();
}

headImage.addEventListener('click', (e) => {
  console.log('Clique na imagem', visaoAtual, indiceAtual, pontosMedidos[visaoAtual]);
  if (!modoMedicaoAtivo || medicaoTravada) return;

  const rect = headImage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const esperado = pontosEsperados[visaoAtual][indiceAtual];
  if (!esperado) return;

  const distancia = Math.hypot(x - esperado.x, y - esperado.y);
  if (distancia > 10) return;

  pontosMedidos[visaoAtual].push({ x, y });

  const pontoEl = document.createElement('div');
  pontoEl.classList.add('ponto-medicao');
  pontoEl.style.left = `${x}px`;
  pontoEl.style.top = `${y}px`;
  pontosContainer.appendChild(pontoEl);

  if (visaoAtual === 'frente' && pontosMedidos.frente.length === 2) {
    desenharLinha(pontosMedidos.frente[0], pontosMedidos.frente[1]);
    instrucaoMedicao.textContent = 'Troque para a visão de trás e clique no ponto final';
    setaTroca.style.display = 'block';
    medicaoTravada = true;
    indiceAtual = 0;

    const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
    if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

    return;
  }

  if (visaoAtual === 'atras' && pontosMedidos.atras.length === 1) {
    linhaRefSVG = desenharLinha(pontosMedidos.frente[1], pontosMedidos.atras[0], 'red', 'linha-ref');
    instrucaoMedicao.textContent = 'Volte para a frente para continuar.';
    resultadoMedicao.textContent = 'Medição completa!';
    modoMedicaoAtivo = false;
    medicaoTravada = true;

    setaTroca.style.display = 'block';
    setaTroca.style.top = '77.7%';
    setaTroca.textContent = 'Trocar para frente ➡';

    const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
    if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');

    iniciarSequenciaPontos();

    return;
  }

if (visaoAtual === 'lateralEsquerda' && pontosMedidos.lateralEsquerda.length === 2) {

    desenharLinha(pontosMedidos.lateralEsquerda[0], pontosMedidos.lateralEsquerda[1], 'red');

    instrucaoMedicao.textContent = 'Troque para a visão DIREITA e clique no último ponto.';
    medicaoTravada = true;

    visaoAtual = 'lateralDireita';
    pontosMedidos.lateralDireita = [];
    indiceAtual = 0;

    const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
    if (botaoDireita) botaoDireita.classList.add('piscando-vermelho');
    return;
}

  if (visaoAtual === 'lateralDireita' && pontosMedidos.lateralDireita.length === 1) {
  linhaMedicao.innerHTML = '';
  const linhas = linhaMedicao.querySelectorAll('line');
  linhas.forEach(l => l.remove());

  desenharLinha(origemLateralDireita, pontosMedidos.lateralDireita[0], 'red');

  instrucaoMedicao.textContent = 'Medição lateral completa! Troque para a visão ESQUERDA para continuar.';
  resultadoMedicao.textContent = '';
  modoMedicaoAtivo = false;
  medicaoTravada = true;

  const botaoEsquerda = document.querySelector('button[onclick="changeView(\'esquerda\')"]');
  if (botaoEsquerda) botaoEsquerda.classList.add('piscando-vermelho');

const aguardarEsquerda = setInterval(() => {
  if (visaoAtual === 'esquerda') {
    clearInterval(aguardarEsquerda);
    iniciarSequenciaT3();
  }
}, 500);
}

if (visaoAtual === 'frenteDiagonal' && pontosMedidos.frenteDiagonal.length === 2) {

    desenharLinha(pontosMedidos.frenteDiagonal[0], pontosMedidos.frenteDiagonal[1], 'red');

    instrucaoMedicao.textContent = 'Troque para a visão DIREITA e clique no último ponto.';
    medicaoTravada = true;

    visaoAtual = 'lateralDiagonal';
    pontosMedidos.lateralDiagonal = [];
    indiceAtual = 0;

    const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
    if (botaoDireita) botaoDireita.classList.add('piscando-vermelho');
    return;
}

if (visaoAtual === 'lateralDiagonal' && pontosMedidos.lateralDiagonal.length === 2) {
  linhaMedicao.innerHTML = '';
  const linhas = linhaMedicao.querySelectorAll('line');
  linhas.forEach(l => l.remove());

  desenharLinha(origemlateralDiagonal, pontosMedidos.lateralDiagonal[0], 'red');

  instrucaoMedicao.textContent = 'Troque para a visão Trás para continuar.';
  resultadoMedicao.textContent = '';

  const botaoAtras = document.querySelector('button[onclick="changeView(\'tras\')"]');
  if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');
}

  indiceAtual++;
  mostrarPontoAtual();
});

headImage.addEventListener('mousemove', (e) => {
  if (!modoMedicaoAtivo || medicaoTravada) return;

  const rect = headImage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let origem = null;

  if (visaoAtual === 'frente' && pontosMedidos.frente.length > 0) {
    origem = pontosMedidos.frente[pontosMedidos.frente.length - 1];
  }
  if (visaoAtual === 'atras') {
    if (pontosMedidos.atras.length === 1) {
      origem = pontosMedidos.atras[0];
    } else if (pontosMedidos.frente.length === 2) {
      origem = pontosMedidos.frente[1];
    }
  }
  if ((visaoAtual === 'lateralEsquerda' && pontosMedidos.lateralEsquerda.length > 0)) { 
  origem = pontosMedidos.lateralEsquerda[pontosMedidos.lateralEsquerda.length - 1];
}

if (visaoAtual === 'lateralDireita') { 
  if (pontosMedidos.lateralDireita.length > 0) {
    origem = pontosMedidos.lateralDireita[pontosMedidos.lateralDireita.length - 1];
  } else {
    origem = origemLateralDireita; 
  }
}

if ((visaoAtual === 'frenteDiagonal' && pontosMedidos.frenteDiagonal.length > 0)) { 
  origem = pontosMedidos.frenteDiagonal[pontosMedidos.frenteDiagonal.length - 1];
}

if (visaoAtual === 'lateralDiagonal') { 
  if (pontosMedidos.lateralDiagonal.length > 0) {
    origem = pontosMedidos.lateralDiagonal[pontosMedidos.lateralDiagonal.length - 1];
  } else {
    origem = origemlateralDiagonal; 
  }
}

  if (!origem) return;

  linhaMedicao.innerHTML = `
    <line x1="${origem.x}" y1="${origem.y}" 
          x2="${x}" y2="${y}" 
          stroke="red" stroke-dasharray="4" stroke-width="2" />
  `;
});

function desenharLinha(p1, p2, cor = 'red', id = null) {
  if (!p1 || !p2) return;

  const deslocamentoAzul = (cor === 'blue') ? 11 : 0;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", p1.x + deslocamentoAzul);
  line.setAttribute("y1", p1.y);
  line.setAttribute("x2", p2.x + deslocamentoAzul);
  line.setAttribute("y2", p2.y);
  line.setAttribute("stroke", cor);
  line.setAttribute("stroke-width", "2");
  if (id) line.setAttribute("id", id);

  linhaMedicao.appendChild(line);
  return line;
}

function desenharTodasLinhas() {
  linhaMedicao.innerHTML = '';
  const coords = coordenadasPorVisao[visaoAtual];
  if (!coords) return;

  const estado = estadoEletrodos;

  if (!sequenciaFinalizada) {

    // Frente
    if (visaoAtual === 'frente') {
      if (estado.Ref.colocado && !estado.Testa.colocado) {
        desenharLinha(coords.Ref, coords.Testa, 'blue');
      } 
      else if (estado.Testa.colocado && !estado.Fz.colocado) {
        desenharLinha(coords.Testa, coords.Fz, 'blue');
      }
      else if (estado.Fp2.colocado && !estado.F8.colocado) {
        desenharLinha(coords.Fp2, coords.F8, 'blue');
      }
      else if (estado.Fp1.colocado && !estado.F7.colocado) {
        desenharLinha(coords.Fp1, coords.F7, 'blue');
      }
      else if (estado.Fp2.colocado && !linhaFp2F4Finalizada) {
        desenharLinha(coords.Fp2, coords.F4, 'blue');
      }
    }

    // Cima
    else if (visaoAtual === 'cima') {
      if (estado.Fz.colocado && !estado.Cz.colocado) {
        desenharLinha(coords.Fz, coords.Cz, 'blue');
      }
    }

    // Atrás
    else if (visaoAtual === 'atras') {
      if (estado.Cz.colocado && !estado.Pz.colocado) {
        desenharLinha(coords.Cz, coords.Pz, 'blue');
      } 
      else if (estado.Pz.colocado && !estado.Oz.colocado) {
        desenharLinha(coords.Pz, coords.Oz, 'blue');
      }
    }

    // Esquerda
    else if (visaoAtual === 'esquerda') {
      // --- Sequência superior ---
      if (estado.T3.colocado && !estado.C3.colocado && !estado.F8.colocado) {
        // Só desenha T4 → C4 se F8 ainda não foi colocado
        desenharLinha(coords.T3, coords.C3, 'blue');
      } 
      else if (estado.C3.colocado && !linhaC3CzFinalizada) {
        desenharLinha(coords.C3, coords.Cz, 'blue');
      }
      else if (estado.T3.colocado && !estado.T5.colocado && estado.F7.colocado) {
        // Só desenha T4 → T6 se viemos da sequência inferior
        desenharLinha(coords.T3, coords.T5, 'blue');
      }
      else if (estado.T5.colocado && !estado.O1.colocado) {
        desenharLinha(coords.T5, coords.O1, 'blue');
      }
    }

    // Direita
    else if (visaoAtual === 'direita') {
      // --- Sequência lateral inferior ---
      if (estado.F8.colocado && !estado.T4.colocado) {
        desenharLinha(coords.F8, coords.T4, 'blue');
      } 
      else if (estado.T4.colocado && !estado.T6.colocado && estado.F8.colocado) {
        // Só desenha T4 → T6 se viemos da sequência inferior
        desenharLinha(coords.T4, coords.T6, 'blue');
      }
      else if (estado.T6.colocado && !estado.O2.colocado) {
        desenharLinha(coords.T6, coords.O2, 'blue');
      }
      // --- Sequência superior ---
      else if (estado.T4.colocado && !estado.C4.colocado && !estado.F8.colocado) {
        // Só desenha T4 → C4 se F8 ainda não foi colocado
        desenharLinha(coords.T4, coords.C4, 'blue');
      } 
      else if (estado.C4.colocado && !estado.Cz.colocado) {
        desenharLinha(coords.C4, coords.Cz, 'blue');
      }
    }
  }
}




let mouseGaze = document.createElement('img');
mouseGaze.src = './assets/gaze.png';
mouseGaze.id = 'mouse-gaze';
Object.assign(mouseGaze.style, {
  position: 'fixed',
  width: '60px',
  height: '60px',
  pointerEvents: 'none',
  zIndex: '1000',
  display: 'none'
});
document.body.appendChild(mouseGaze);

document.addEventListener('mousemove', (e) => {
  if (usandoGaze) {
    mouseGaze.style.left = `${e.clientX - 20}px`;
    mouseGaze.style.top = `${e.clientY - 20}px`;
  }
});

const pontosPorVisao = {
  frente: [
    { id: 'Fp1', x: 245, y: 150, colocado: false, limpo: false },
    { id: 'Fp2', x: 130, y: 150, colocado: false, limpo: false },
    { id: 'Ref', x: 178, y: 200, colocado: false, limpo: false },
    { id: 'Testa', x: 178, y: 140, colocado: false, limpo: false },
    { id: 'Fz', x: 178, y: 50, colocado: false, limpo: false },
    { id: 'F4', x: 83, y: 95, colocado: false, limpo: false },
    { id: 'F3', x: 270, y: 95, colocado: false, limpo: false },
    { id: 'F8', x: 35, y: 170, colocado: false, limpo: false },
    { id: 'F7', x: 320, y: 170, colocado: false, limpo: false },
    { id: 'A1', x: 320, y: 320, colocado: false, limpo: false },
    { id: 'A2', x: 32, y: 320, colocado: false, limpo: false },
  ],
  direita: [
    { id: 'T4', x: 120, y: 145, colocado: false, limpo: false },
    { id: 'C4', x: 120, y: 55, colocado: false, limpo: false },
    { id: 'F4', x: 185, y: 60, colocado: false, limpo: false },
    { id: 'P4', x: 40, y: 55, colocado: false, limpo: false },
  ],
  esquerda: [
    { id: 'T3', x: 245, y: 150, colocado: false, limpo: false },
    { id: 'C3', x: 245, y: 50, colocado: false, limpo: false },
  ],
  cima: [
    { id: 'Cz', x: 170, y: 20, colocado: false, limpo: false },
  ],
  atras: [
    { id: 'Cz', x: 180, y: 0, colocado: false, limpo: false },
    { id: 'Pz', x: 180, y: 55, colocado: false, limpo: false },
    { id: 'Oz', x: 180, y: 170, colocado: false, limpo: false},
  ]
};

function renderizarPontos(visao) {
  pontosContainer.innerHTML = '';

  // Se estamos medindo lateral, não renderizamos os eletrodos normais
 // if (medindoLateral && !mostrarSomenteT3) return;

  const coords = coordenadasPorVisao[visao];
  if (!coords) return;

  Object.keys(coords).forEach(id => {
    const estado = estadoEletrodos[id];
    if (!estado) return;

    //if (!estado.visivelTemporariamente && id !== 'Ref') return;

    if (!estado.colocado && !estado.visivelTemporariamente && id !== 'Ref') return;

    const coord = coords[id];
    const el = document.createElement('div');
    el.classList.add('ponto');
    el.dataset.id = id;
    if (estado.colocado) el.classList.add('colocado');
    if (estado.limpo) el.classList.add('limpo');

    el.style.left = `${coord.x}px`;
    el.style.top = `${coord.y}px`;

    const cabelo = document.createElement('div');
    cabelo.classList.add('cabelo');
    if (estado.limpo) cabelo.style.opacity = 0;

    cabelo.addEventListener('mousemove', () => {
      if (usandoGaze && !estado.limpo) {
        cabelo.style.opacity = 0;
        estado.limpo = true;
      }
    });

    el.appendChild(cabelo);

    el.addEventListener('dragover', (e) => {
      if (estado.limpo) {
        e.preventDefault();
        el.classList.add('valid-drop');
      }
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('valid-drop');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('valid-drop');
      const idEletrodo = e.dataTransfer.getData('text/plain');

      if (!estado.limpo) {
        alert('Você precisa limpar o local antes de colocar o eletrodo!');
        return;
      }

      if (!eletrodosPreparados[idEletrodo]) {
        alert('Você precisa passar o eletrodo na pasta de EEG antes de usá-lo!');
        return;
      }

      if (idEletrodo === id) {
        estado.colocado = true;
        renderizarPontos(visaoAtual);
        linhaMedicao.innerHTML = '';
        desenharTodasLinhas();
      } else {
        alert(`Eletrodo ${idEletrodo} não pertence à posição ${id}`);
      }
    });

    pontosContainer.appendChild(el);
  });
}

function changeView(view) {

  if (visaoAtual === 'esquerda' && estadoEletrodos.C3.colocado) {
    linhaC3CzFinalizada = true;
  }
  if (visaoAtual === 'frente' && estadoEletrodos.Fp2.colocado) {
    linhaFp2F4Finalizada = true;
  }

  visaoAtual = view;

  if (view === 'cima' && estadoEletrodos.Fz.colocado && !estadoEletrodos.Cz.colocado) {
    const fzCoords = coordenadasPorVisao.cima.Fz;
    const czCoords = coordenadasPorVisao.cima.Cz;
    desenharLinha(fzCoords, czCoords, 'blue');
  }

  const todosPontos = document.querySelectorAll('.ponto-medicao');
  todosPontos.forEach(p => p.remove());

  headImage.style.opacity = 0;
  headImage.onload = () => {
    headImage.style.opacity = 1;

    if (modoMedicaoAtivo && pontosMedidos[view] && pontosMedidos[view].length < (pontosEsperados[view]?.length || 0)) {
      indiceAtual = pontosMedidos[view].length;
      instrucaoMedicao.textContent = `Clique no ponto: ${pontosEsperados[view][indiceAtual].nome}`;
      console.log('Mostrando ponto atual na visão', view, 'índice', indiceAtual);
      mostrarPontoAtual();
    }

    desenharTodasLinhas();
    renderizarPontos(view);
  };
  headImage.src = `./assets/${view}.png`;

  if (view === 'cima') {
    const botaoCima = document.querySelector('button[onclick="changeView(\'cima\')"]');
    if (botaoCima) botaoCima.classList.remove('piscando-vermelho');
  }

  if (view === 'frente') {
    setaTroca.style.display = 'none';
    setaTroca.textContent = '';

    const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
    if (botaoFrente) botaoFrente.classList.remove('piscando-vermelho');
  }

  if (view === 'atras' && medicaoTravada && pontosMedidos.atras.length === 0) {
    medicaoTravada = false;
    setaTroca.style.display = 'none';

    const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
    if (botaoAtras) botaoAtras.classList.remove('piscando-vermelho');
  }

  if (view === 'esquerda') {
  const botaoEsquerda = document.querySelector('button[onclick="changeView(\'esquerda\')"]');
  if (botaoEsquerda) botaoEsquerda.classList.remove('piscando-vermelho');
  }
  if (view === 'direita') {
  const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
  if (botaoDireita) botaoDireita.classList.remove('piscando-vermelho');
  }

  if (
    view === 'atras' &&
    pontosMedidos.frente.length === 2 &&
    pontosMedidos.atras.length === 0
  ) {
    setaTroca.textContent = 'Trocar para frente ➡';
  }

  if (view === 'direita' && medicaoTravada && pontosMedidos.lateralDireita.length === 0) {
    medicaoTravada = false;
    visaoAtual = 'lateralDireita';
    indiceAtual = 0;
    mostrarPontoAtual();
    setaTroca.textContent = ''

    const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
    if (botaoDireita) botaoDireita.classList.remove('piscando-vermelho');
}

if (view === 'frente' && medicaoTravada && pontosMedidos.frenteDiagonal && pontosMedidos.frenteDiagonal.length === 0) {
  medicaoTravada = false;
  visaoAtual = 'frenteDiagonal';
  indiceAtual = pontosMedidos['frenteDiagonal'].length || 0;
  mostrarPontoAtual();
  setaTroca.textContent = '';

  const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
  if (botaoFrente) botaoFrente.classList.remove('piscando-vermelho');
}

if (view === 'direita' && medicaoTravada && pontosMedidos.lateralDiagonal && pontosMedidos.lateralDiagonal.length === 0) {
    medicaoTravada = false;
    visaoAtual = 'lateralDiagonal';
    indiceAtual = 0;
    mostrarPontoAtual();
    setaTroca.textContent = ''

    const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
    if (botaoDireita) botaoDireita.classList.remove('piscando-vermelho');
}

}

eletrodos.forEach(eletrodo => {
  eletrodo.addEventListener('dragstart', (e) => {
    const id = eletrodo.dataset.id;
    e.dataTransfer.setData('text/plain', id);
  });
});

if (pasta) {
  pasta.addEventListener('dragover', (e) => {
    e.preventDefault();
    pasta.classList.add('ativo');
  });

  pasta.addEventListener('dragleave', () => {
    pasta.classList.remove('ativo');
  });

  pasta.addEventListener('drop', (e) => {
    e.preventDefault();
    pasta.classList.remove('ativo');
    const idEletrodo = e.dataTransfer.getData('text/plain');
    eletrodosPreparados[idEletrodo] = true;

    const eletrodoEl = document.querySelector(`.eletrodo[data-id="${idEletrodo}"]`);
    if (eletrodoEl) {
      eletrodoEl.classList.add('preparado');
    }

    alert(`Eletrodo ${idEletrodo} preparado com pasta de EEG!`);
  });
}

if (gaze) {
  gaze.addEventListener('click', () => {
    usandoGaze = !usandoGaze;
    gaze.classList.toggle('ativo', usandoGaze);
    mouseGaze.style.display = usandoGaze ? 'block' : 'none';
    document.body.style.cursor = usandoGaze ? 'none' : 'default';
  });
}

function iniciarSequenciaPontos() {
  const instrucao = document.getElementById('instrucao-medicao');

  mostrarSomenteRef = true;
  sequenciaFinalizada = false;
  estadoEletrodos.Ref.visivelTemporariamente = true;
  renderizarPontos('frente');
  desenharTodasLinhas();
  instrucao.textContent = 'Coloque o eletrodo na posição REF.';

  const intervalo = setInterval(() => {
    if (estadoEletrodos.Ref.colocado) {
      clearInterval(intervalo);
      mostrarSomenteRef = false;

      estadoEletrodos.Testa.visivelTemporariamente = true;
      renderizarPontos('frente');
      desenharTodasLinhas();
      instrucao.textContent = 'Coloque o eletrodo na posição Testa (10% do REF).';

      const intervaloTesta = setInterval(() => {
        if (estadoEletrodos.Testa.colocado) {
          clearInterval(intervaloTesta);

          estadoEletrodos.Fz.visivelTemporariamente = true;
          renderizarPontos('frente');
          desenharTodasLinhas();
          instrucao.textContent = 'Coloque o eletrodo na posição Fz (20% do Testa).';

          const intervaloFz = setInterval(() => {
            if (estadoEletrodos.Fz.colocado) {
              clearInterval(intervaloFz);

              medicaoTravada = true;
              estadoEletrodos.Cz.visivelTemporariamente = true;
              instrucao.textContent = 'Troque para a visão de CIMA para continuar.';

              const botaoCima = document.querySelector('button[onclick="changeView(\'cima\')"]');
              if (botaoCima) botaoCima.classList.add('piscando-vermelho');

              const intervaloCz = setInterval(() => {
                if (estadoEletrodos.Cz.colocado) {
                  clearInterval(intervaloCz);
                  instrucao.textContent = 'Troque para a visão de TRÁS para continuar.';

                  const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
                  if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

                  estadoEletrodos.Pz.visivelTemporariamente = true;

                  const intervaloPz = setInterval(() => {
                    if (estadoEletrodos.Pz.colocado) {
                      clearInterval(intervaloPz);

                      // ---- NOVO: Mostrar Oz ----
                      estadoEletrodos.Oz.visivelTemporariamente = true;
                      renderizarPontos('atras');
                      desenharTodasLinhas();
                      instrucao.textContent = 'Coloque o eletrodo Oz (final da linha).';

                      const intervaloOz = setInterval(() => {
                        if (estadoEletrodos.Oz.colocado) {
                          clearInterval(intervaloOz);
                          instrucao.textContent = 'Agora vamos medir lateralmente. Troque para a visão LATERAL.';

                          const botaoLateral = document.querySelector('button[onclick="changeView(\'esquerda\')"]');
                          if (botaoLateral) botaoLateral.classList.add('piscando-vermelho');

                          // Chama a medição lateral depois que mudar a visão
                          const esperaTroca = setInterval(() => {
                            if (visaoAtual === 'esquerda') {
                              clearInterval(esperaTroca);
                              ativarMedicaoLateral();
                            }
                          }, 500);
                        }
                      }, 500);
                    }
                  }, 500);
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaT3() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo na posição T3.';

  mostrarSomenteT3 = true;
  sequenciaLateralFinalizada = false;
  estadoEletrodos.Cz.visivelTemporariamente = false;

  // Garante que o ponto T3 seja mostrado
  estadoEletrodos.T3.visivelTemporariamente = true;

  // Espera até a visão estar correta antes de renderizar os pontos
  const aguardarEsquerda = setInterval(() => {
    if (visaoAtual === 'esquerda') {
      clearInterval(aguardarEsquerda);
      setTimeout(() => {
        renderizarPontos('esquerda');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // Sequência em cadeia, igual à do topo
  const intervaloT3 = setInterval(() => {
    if (estadoEletrodos.T3.colocado) {
      clearInterval(intervaloT3);

      estadoEletrodos.Cz.visivelTemporariamente = false;

      instrucao.textContent = 'Coloque o eletrodo na posição C3.';
      estadoEletrodos.C3.visivelTemporariamente = true;
      renderizarPontos('esquerda');
      desenharTodasLinhas();

        const intervaloC3 = setInterval(() => {
  if (estadoEletrodos.C3.colocado) {
  clearInterval(intervaloC3);

  estadoEletrodos.Cz.visivelTemporariamente = true;
  renderizarPontos('esquerda');
  desenharTodasLinhas();

  instrucao.textContent = 'Após o posicionamento C3 verifique se ele está na mesma linha do eletrodo Cz.';

  // NOVO: Destaca botão da visão direita
  const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
  if (botaoDireita) botaoDireita.classList.add('piscando-vermelho');

  // Aguarda o jogador trocar para a direita
  const esperarDireita = setInterval(() => {
    if (visaoAtual === 'direita') {
      clearInterval(esperarDireita);
      iniciarSequenciaT4();
    }
  }, 500);
}

      }, 500);
    }
  }, 500);
}

function iniciarSequenciaT4() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo na posição T4.';

  mostrarSomenteT4 = true;
  estadoEletrodos.T4.visivelTemporariamente = true;
  estadoEletrodos.Cz.visivelTemporariamente = true;

  const aguardarDireita = setInterval(() => {
    if (visaoAtual === 'direita') {
      clearInterval(aguardarDireita);

      setTimeout(() => {
        renderizarPontos('direita');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  const intervaloT4 = setInterval(() => {
    if (estadoEletrodos.T4.colocado) {
      clearInterval(intervaloT4);

      mostrarSomenteT4 = false;
      estadoEletrodos.C4.visivelTemporariamente = true;

      instrucao.textContent = 'Coloque o eletrodo na posição C4.';
      renderizarPontos('direita');
      desenharTodasLinhas();

      const intervaloC4 = setInterval(() => {
        if (estadoEletrodos.C4.colocado) {
          clearInterval(intervaloC4);

          instrucao.textContent = 'Verifique se C4 está na mesma linha de Cz.';
          desenharTodasLinhas();

          const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
          if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');

          // Aguarda o jogador trocar para a frente
          const esperarFrente = setInterval(() => {
            if (visaoAtual === 'frente') {
              clearInterval(esperarFrente);
              iniciarSequenciaFp2();
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaFp2() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo Fp2.';

  mostrarSomenteFp2 = true;
  sequenciaLateralDireitaFinalizada = false;
  estadoEletrodos.Fp2.visivelTemporariamente = true;

  const aguardarFrente = setInterval(() => {
    if (visaoAtual === 'frente') {
      clearInterval(aguardarFrente);
      setTimeout(() => {
        renderizarPontos('frente');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // 1️⃣ Fp2
  const intervaloFp2 = setInterval(() => {
    if (estadoEletrodos.Fp2.colocado) {
      clearInterval(intervaloFp2);

      mostrarSomenteFp2 = false;
      estadoEletrodos.F8.visivelTemporariamente = true;
      instrucao.textContent = 'Coloque o eletrodo F8.';
      renderizarPontos('frente');
      desenharTodasLinhas();

      // 2️⃣ F8
      const intervaloF8 = setInterval(() => {
        if (estadoEletrodos.F8.colocado) {
          clearInterval(intervaloF8);

          // Pede troca para lateral direita
          instrucao.textContent = 'Troque para a visão DIREITA para continuar.';
          const botaoDireita = document.querySelector('button[onclick="changeView(\'direita\')"]');
          if (botaoDireita) botaoDireita.classList.add('piscando-vermelho');

          const aguardarDireita = setInterval(() => {
            if (visaoAtual === 'direita') {
              clearInterval(aguardarDireita);

              // Mostra T6 (T4 já posicionado)
              instrucao.textContent = 'Coloque o eletrodo T6 (entre T4 e O2).';
              estadoEletrodos.T6.visivelTemporariamente = true;
              renderizarPontos('direita');
              desenharTodasLinhas();

              // 3️⃣ T6
              const intervaloT6 = setInterval(() => {
                if (estadoEletrodos.T6.colocado) {
                  clearInterval(intervaloT6);

                  // Troca para trás
                  instrucao.textContent = 'Troque para a visão TRÁS para continuar.';
                  const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
                  if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

                  const aguardarAtras = setInterval(() => {
                    if (visaoAtual === 'atras') {
                      clearInterval(aguardarAtras);

                      // Mostra O2
                      instrucao.textContent = 'Coloque o eletrodo O2.';
                      estadoEletrodos.O2.visivelTemporariamente = true;
                      renderizarPontos('atras');
                      desenharTodasLinhas();

                      // 4️⃣ O2
                      const intervaloO2 = setInterval(() => {
                        if (estadoEletrodos.O2.colocado) {
                          clearInterval(intervaloO2);
                          instrucao.textContent = 'Sequência lateral direita! Mude para FRENTE para continuarmos. ';
                          sequenciaLateralDireitaFinalizada = true;
                          const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
                          if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');
                        }
                        const esperarFrente = setInterval(() => {
                          if (visaoAtual === 'frente') {
                          clearInterval(esperarFrente);
                          iniciarSequenciaFp1();
                          }
                        }, 500);
                      }, 500);
                    }
                  }, 500);
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaFp1() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo Fp1.';

  mostrarSomenteFp1 = true;
  sequenciaLateralDireitaFinalizada = false;
  estadoEletrodos.Fp1.visivelTemporariamente = true;

  const aguardarFrente = setInterval(() => {
    if (visaoAtual === 'frente') {
      clearInterval(aguardarFrente);
      setTimeout(() => {
        renderizarPontos('frente');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // 1️⃣ Fp1
  const intervaloFp1 = setInterval(() => {
    if (estadoEletrodos.Fp1.colocado) {
      clearInterval(intervaloFp1);

      mostrarSomenteFp1 = false;
      estadoEletrodos.F7.visivelTemporariamente = true;
      instrucao.textContent = 'Coloque o eletrodo F7.';
      renderizarPontos('frente');
      desenharTodasLinhas();

      // 2️⃣ F7
      const intervaloF7 = setInterval(() => {
        if (estadoEletrodos.F7.colocado) {
          clearInterval(intervaloF7);

          // Pede troca para lateral esquerda
          instrucao.textContent = 'Troque para a visão ESQUERDA para continuar.';
          const botaoEsquerda = document.querySelector('button[onclick="changeView(\'esquerda\')"]');
          if (botaoEsquerda) botaoEsquerda.classList.add('piscando-vermelho');

          const aguardarEsquerda = setInterval(() => {
            if (visaoAtual === 'esquerda') {
              clearInterval(aguardarEsquerda);

              // Mostra T5 (T3 já posicionado)
              instrucao.textContent = 'Coloque o eletrodo T5.';
              estadoEletrodos.T5.visivelTemporariamente = true;
              renderizarPontos('esquerda');
              desenharTodasLinhas();

              // 3️⃣ T5
              const intervaloT5 = setInterval(() => {
                if (estadoEletrodos.T5.colocado) {
                  clearInterval(intervaloT5);

                  // Troca para trás
                  instrucao.textContent = 'Troque para a visão TRÁS para continuar.';
                  const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
                  if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

                  const aguardarAtras = setInterval(() => {
                    if (visaoAtual === 'atras') {
                      clearInterval(aguardarAtras);
                      if (botaoAtras) botaoAtras.classList.remove('piscando-vermelho');

                      // Mostra O1
                      instrucao.textContent = 'Coloque o eletrodo O1.';
                      estadoEletrodos.O1.visivelTemporariamente = true;
                      renderizarPontos('atras');
                      desenharTodasLinhas();

                      // 4️⃣ O1
                      const intervaloO1 = setInterval(() => {
                        if (estadoEletrodos.O1.colocado) {
                          clearInterval(intervaloO1);
                          instrucao.textContent = 'Sequência concluída! Mude para FRENTE para continuar.';
                          sequenciaLateralDireitaFinalizada = true;
                          const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
                          if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');

                          const esperarFrente = setInterval(() => {
                            if (visaoAtual === 'frente') {
                            clearInterval(esperarFrente);
                            if (botaoFrente) botaoFrente.classList.remove('piscando-vermelho');
                            iniciarSequenciaF4();
                          }
                        }, 500);
                        }
                      }, 500);
                    }
                  }, 500);
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaF4() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo F4.';

  mostrarSomenteF4 = true;
  sequenciaLateralDireitaFinalizada = false;
  estadoEletrodos.F4.visivelTemporariamente = true;

  const aguardarFrente = setInterval(() => {
    if (visaoAtual === 'frente') {
      clearInterval(aguardarFrente);
      setTimeout(() => {
        renderizarPontos('frente');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // 1️⃣ F4
  const intervaloF4 = setInterval(() => {
    if (estadoEletrodos.F4.colocado) {
      clearInterval(intervaloF4);

      mostrarSomenteF4 = false;
      estadoEletrodos.F4.visivelTemporariamente = true;
      instrucao.textContent = 'Coloque o eletrodo C4.';
      renderizarPontos('frente');
      desenharTodasLinhas();

      // 2️⃣ C4
      const intervaloC4 = setInterval(() => {
        if (estadoEletrodos.C4.colocado) {
          clearInterval(intervaloC4);

          // Pede troca para lateral direita
          instrucao.textContent = 'Troque para a visão ATRAS para continuar.';
          const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
          if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

          const aguardarAtras = setInterval(() => {
            if (visaoAtual === 'atras') {
              clearInterval(aguardarAtras);

              // Mostra P4
              instrucao.textContent = 'Coloque o eletrodo P4.';
              estadoEletrodos.P4.visivelTemporariamente = true;
              renderizarPontos('atras');
              desenharTodasLinhas();
              if (botaoAtras) botaoAtras.classList.remove('piscando-vermelho');

              // 3️⃣ P4
              const intervaloP4 = setInterval(() => {
                if (estadoEletrodos.P4.colocado) {
                  clearInterval(intervaloP4);
                  instrucao.textContent = 'Sequência concluída! Mude para FRENTE para continuar.';
                  const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
                  if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');
                  sequenciaLateralDireitaFinalizada = true;

                 const esperarFrente = setInterval(() => {
                    if (visaoAtual === 'frente') {
                    clearInterval(esperarFrente);
                    if (botaoFrente) botaoFrente.classList.remove('piscando-vermelho')
                    iniciarSequenciaF3();
                    }
                  }, 500);
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaF3() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo F3.';

  mostrarSomenteF3 = true;
  sequenciaLateralDireitaFinalizada = false;
  estadoEletrodos.F3.visivelTemporariamente = true;

  const aguardarFrente = setInterval(() => {
    if (visaoAtual === 'frente') {
      clearInterval(aguardarFrente);
      setTimeout(() => {
        renderizarPontos('frente');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // 1️⃣ F4
  const intervaloF3 = setInterval(() => {
    if (estadoEletrodos.F3.colocado) {
      clearInterval(intervaloF3);

      mostrarSomenteF3 = false;
      estadoEletrodos.F3visivelTemporariamente = true;
      instrucao.textContent = 'Coloque o eletrodo C3.';
      renderizarPontos('frente');
      desenharTodasLinhas();

      // 2️⃣ C4
      const intervaloC3 = setInterval(() => {
        if (estadoEletrodos.C3.colocado) {
          clearInterval(intervaloC3);

          // Pede troca para lateral direita
          instrucao.textContent = 'Troque para a visão ATRAS para continuar.';
          const botaoAtras = document.querySelector('button[onclick="changeView(\'atras\')"]');
          if (botaoAtras) botaoAtras.classList.add('piscando-vermelho');

          const aguardarAtras = setInterval(() => {
            if (visaoAtual === 'atras') {
              clearInterval(aguardarAtras);

              // Mostra P3
              instrucao.textContent = 'Coloque o eletrodo P3.';
              estadoEletrodos.P3.visivelTemporariamente = true;
              renderizarPontos('atras');
              desenharTodasLinhas();
              if (botaoAtras) botaoAtras.classList.remove('piscando-vermelho');

              // 3️⃣ P3
              const intervaloP3 = setInterval(() => {
                if (estadoEletrodos.P3.colocado) {
                  clearInterval(intervaloP3);
                  instrucao.textContent = 'Sequência concluída! Mude para FRENTE para continuar.';
                  const botaoFrente = document.querySelector('button[onclick="changeView(\'frente\')"]');
                  if (botaoFrente) botaoFrente.classList.add('piscando-vermelho');
                  sequenciaLateralDireitaFinalizada = true;

                 const esperarFrente = setInterval(() => {
                    if (visaoAtual === 'frente') {
                    clearInterval(esperarFrente);
                    if (botaoFrente) botaoFrente.classList.remove('piscando-vermelho')
                    iniciarSequenciaA1();
                    }
                  }, 500);
                }
              }, 500);
            }
          }, 500);
        }
      }, 500);
    }
  }, 500);
}

function iniciarSequenciaA1() {
  const instrucao = document.getElementById('instrucao-medicao');
  const resultado = document.getElementById('resultado-medicao');

  resultado.textContent = '';
  instrucao.textContent = 'Coloque o eletrodo A1.';

  mostrarSomenteA1 = true;
  sequenciaLateralDireitaFinalizada = false;
  estadoEletrodos.A1.visivelTemporariamente = true;

  const aguardarFrente = setInterval(() => {
    if (visaoAtual === 'frente') {
      clearInterval(aguardarFrente);
      setTimeout(() => {
        renderizarPontos('frente');
        desenharTodasLinhas();
      }, 300);
    }
  }, 300);

  // 1️⃣ F4
  const intervaloA1 = setInterval(() => {
    if (estadoEletrodos.A1.colocado) {
      clearInterval(intervaloA1);

      mostrarSomenteA1 = false;
      estadoEletrodos.F3visivelTemporariamente = true;
      instrucao.textContent = 'Coloque o eletrodo A2.';
      renderizarPontos('frente');
      desenharTodasLinhas();

      // 2️⃣ C4
      const intervaloA2 = setInterval(() => {
        if (estadoEletrodos.A2.colocado) {
          clearInterval(intervaloA2);
          instrucao.textContent = 'Sequencia finalizada, parabéns!';
        }
      }, 500);
    }
  }, 500);
}

pontosContainer.innerHTML = '';










const modoDEV = true;

let mostrarTodosPontosDEV = false; 

function colocarPastaTodos() {
  if (!modoDEV) return;

  Object.keys(estadoEletrodos).forEach(key => {
    eletrodosPreparados[key] = true;
    const eletrodoEl = document.querySelector(`.eletrodo[data-id="${key}"]`);
    if (eletrodoEl) eletrodoEl.classList.add('preparado');
  });

  instrucaoMedicao.textContent = 'Pasta aplicada em todos os eletrodos (modo DEV).';
}

function limparTodosPontos() {
  if (!modoDEV) return;

  Object.keys(estadoEletrodos).forEach(key => {
    estadoEletrodos[key].limpo = true;
    estadoEletrodos[key].colocado = false;
  });

  pontosMedidos = { frente: [], atras: [] };
  indiceAtual = 0;
  pontosContainer.innerHTML = '';
  linhaMedicao.innerHTML = '';

  renderizarPontos(visaoAtual);
  desenharTodasLinhas();

  instrucaoMedicao.textContent = 'Todos os pontos marcados como limpos (modo DEV).';
}

function posicionarProximoEletrodo() {
  if (!modoDEV) return;

  const chaves = Object.keys(estadoEletrodos);
  for (let i = 0; i < chaves.length; i++) {
    const key = chaves[i];
    if (!estadoEletrodos[key].colocado) {
      estadoEletrodos[key].colocado = true;
      renderizarPontos(visaoAtual);
      desenharTodasLinhas();
      instrucaoMedicao.textContent = `Eletrodo ${key} posicionado automaticamente (modo DEV).`;
      return;
    }
  }
  instrucaoMedicao.textContent = 'Todos os eletrodos já estão posicionados.';
}

function voltarPosicionamento() {
  if (!modoDEV) return;

  const chaves = Object.keys(estadoEletrodos).reverse();
  for (let i = 0; i < chaves.length; i++) {
    const key = chaves[i];
    if (estadoEletrodos[key].colocado) {
      estadoEletrodos[key].colocado = false;
      renderizarPontos(visaoAtual);
      desenharTodasLinhas();
      instrucaoMedicao.textContent = `Posicionamento do eletrodo ${key} removido (modo DEV).`;
      return;
    }
  }
  instrucaoMedicao.textContent = 'Nenhum eletrodo está posicionado.';
}

// NOVO: Posicionar todos os eletrodos ao mesmo tempo (modo DEV)
function dev() {
  if (!modoDEV) return;

  Object.keys(estadoEletrodos).forEach(key => {
    estadoEletrodos[key].colocado = true;
  });

  renderizarPontos(visaoAtual);
  desenharTodasLinhas();
  instrucaoMedicao.textContent = 'Todos os eletrodos posicionados automaticamente (modo DEV).';
}

// Listener do teclado no MODO DEV
document.addEventListener('keydown', (e) => {
  if (!modoDEV) return;

  if (e.ctrlKey && e.shiftKey) {
    switch (e.key.toLowerCase()) {
      case 'z': // Ctrl+Shift+Z
        e.preventDefault();
        colocarPastaTodos();
        break;
      case 'x': // Ctrl+Shift+X
        e.preventDefault();
        limparTodosPontos();
        break;
      case 'd': // Ctrl+Shift+D
        e.preventDefault();
        posicionarProximoEletrodo();
        break;
      case 'v': // Ctrl+Shift+V
        e.preventDefault();
        voltarPosicionamento();
        break;
      case 'm': // Ctrl+Shift+P (novo) — posicionar todos de uma vez
        e.preventDefault();
        dev();
        break;
    }
  }
});





