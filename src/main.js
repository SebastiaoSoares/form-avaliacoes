import './style.css';
import submitReview from './api.js';
import { questions } from '../data/questions.example.js'; // comente esta linha e descomente a seguinte para usar suas próprias perguntas
// import { questions } from '../data/questions.js';

const userResponses = {};
let currentQuestionIndex = 0; 

function renderScreen() {
  const app = document.querySelector('#app');
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const jaRespondida = userResponses[currentQuestion.question];

  let html = /*html*/`
    <main class="container">
      <h1>Pesquisa de Satisfação</h1>
      <p class="contador">Pergunta ${currentQuestionIndex + 1} de ${questions.length}</p>
      
      <div id="lista-perguntas">
        <div class="bloco-pergunta anima-entrada">
          <p class="titulo-pergunta">${currentQuestion.question}</p>
          <div class="opcoes">
  `;

  currentQuestion.scale.forEach(opcao => {
    const temEmoji = opcao.icon ? true : false;
    const ativoClass = jaRespondida === opcao.value ? 'ativo' : ''; 

    html += /*html*/`
      <button class="btn-opcao ${ativoClass}" data-pergunta="${currentQuestion.question}" data-valor="${opcao.value}">
        ${temEmoji ? `<span class="emoji">${opcao.icon}</span>` : ''}
        <span class="texto-opcao">${opcao.label}</span>
      </button>
    `;
  });

  html += /*html*/`
          </div>
        </div>
      </div>
      
      <div class="botoes-acao">
        ${currentQuestionIndex > 0 ? `<button id="btn-voltar" class="btn-secundario">Voltar</button>` : '<div></div>'}
        
        <button id="btn-avancar" class="btn-enviar" ${!jaRespondida ? 'disabled' : ''}>
          ${isLastQuestion ? 'Enviar Avaliação' : 'Próxima'}
        </button>
      </div>
    </main>
  `;

  app.innerHTML = html;
  configurarCliques(isLastQuestion);
}

function configurarCliques(isLastQuestion) {
  const botoesOpcao = document.querySelectorAll('.btn-opcao');
  const actionButton = document.getElementById('btn-avancar');
  const backButton = document.getElementById('btn-voltar');

  const avancarPergunta = async () => {
    if (!isLastQuestion) {
      currentQuestionIndex++;
      renderScreen();
    } else {
      const respostasFormatadas = Object.keys(userResponses).map(pergunta => ({
        question: pergunta,
        review: userResponses[pergunta]
      }));

      if (actionButton) {
        actionButton.innerText = "Enviando...";
        actionButton.disabled = true;
      }
      if (backButton) backButton.disabled = true;

      const result = await submitReview(respostasFormatadas);

      if (result.status === 'success') {
        mostrarFeedback('sucesso', result.message);
        
        for (let key in userResponses) delete userResponses[key];
        currentQuestionIndex = 0; 
      } else {
        mostrarFeedback('erro', result.message);
        if (actionButton) {
            actionButton.innerText = "Enviar Avaliação";
            actionButton.disabled = false;
        }
        if (backButton) backButton.disabled = false;
      }
    }
  };

  botoesOpcao.forEach(button => {
    button.addEventListener('click', () => {
      const pergunta = button.getAttribute('data-pergunta');
      const valor = button.getAttribute('data-valor');

      const irmaos = button.parentElement.querySelectorAll('.btn-opcao');
      irmaos.forEach(b => b.classList.remove('ativo'));

      button.classList.add('ativo');
      userResponses[pergunta] = valor;
      
      if (actionButton) actionButton.disabled = false; 

      setTimeout(() => {
        avancarPergunta();
      }, 400);
    });
  });

  if (backButton) {
    backButton.addEventListener('click', () => {
      currentQuestionIndex--;
      renderScreen(); 
    });
  }

  if (actionButton) {
      actionButton.addEventListener('click', avancarPergunta);
  }
}

function mostrarFeedback(tipo, mensagem) {
  const app = document.querySelector('#app');
  const isSucesso = tipo === 'sucesso';
  
  app.innerHTML = /*html*/`
    <main class="container anima-entrada feedback-container">
      <div class="feedback-icon ${tipo}">
        ${isSucesso ? '✅' : '❌'}
      </div>
      <h2>${isSucesso ? 'Muito Obrigado!' : 'Atenção'}</h2>
      <p class="feedback-mensagem">${mensagem}</p>
      
      <button id="btn-recomecar" class="btn-enviar" style="margin-top: 30px;">
        ${isSucesso ? 'Nova Avaliação' : 'Tentar Novamente'}
      </button>
    </main>
  `;
  
  document.getElementById('btn-recomecar').addEventListener('click', () => {
      renderScreen(); 
  });
  
  if(isSucesso) {
      setTimeout(() => {
          const iconeSucesso = document.querySelector('.feedback-icon.sucesso');
          if(iconeSucesso) {
              renderScreen();
          }
      }, 5000);
  }
}

renderScreen();
