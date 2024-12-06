const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const botaoTema = document.getElementById('botao-tema');
const corpo = document.body;

// Função para formatar a resposta do chatbot
function formatResponse(text) {
  const formattedText = text
    .replace(/(\*\*.*?\*\*)/g, '<strong>$1</strong>') // Negrito
    .replace(/(\* )/g, '<li>') // Listas
    .replace(/(\n)/g, '<br>'); // Quebras de linha

  return formattedText;
}

// Enviar mensagem do usuário
function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, 'user');
    userInput.value = '';
    fetchChatbotReply(userMessage);
  }
}

function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(sender);

  // Adicionar a mensagem formatada
  messageDiv.innerHTML += formatResponse(message); // Usar innerHTML para permitir HTML

  if (sender === 'bot') {
    // Criar o ícone de copiar
    // Criar o ícone de copiar
const copyIcon = document.createElement('img');
copyIcon.src = 'copia-de.png'; // Caminho para a imagem do ícone de copiar
copyIcon.alt = 'Copiar';
copyIcon.classList.add('copy-icon'); // Adiciona a classe copy-icon
copyIcon.style.width = '20px'; // Ajuste o tamanho da imagem
copyIcon.style.height = '20px'; // Ajuste o tamanho da imagem
copyIcon.style.cursor = 'pointer'; // Muda o cursor para indicar que é clicável
copyIcon.onclick = () => copyToClipboard(message); // Adiciona a função de copiar
    // Criar um contêiner para a mensagem e o ícone
    const containerDiv = document.createElement('div');
    containerDiv.appendChild(copyIcon); // Adiciona o ícone ao contêiner
    containerDiv.appendChild(messageDiv); // Adiciona a mensagem ao contêiner

    chatBox.appendChild(containerDiv); // Adiciona o contêiner ao chat
  } else {
    chatBox.appendChild(messageDiv); // Adiciona a mensagem do usuário diretamente
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Buscar resposta do chatbot
function fetchChatbotReply(message) {
  fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.reply) {
        const formattedReply = formatResponse(data.reply); // Formatar a resposta
        appendMessage(formattedReply, 'bot'); // Adicionar a mensagem formatada
      }
    })
    .catch((error) => {
      console.error('Erro ao se comunicar com o backend:', error);
      appendMessage('Erro ao se comunicar com o servidor.', 'bot');
    });
}

// Função para copiar a mensagem do bot
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Mensagem copiada: " + text);
  }).catch(err => {
    console.error("Erro ao copiar: ", err);
  });
}

// Evento de clique no botão de enviar
sendButton.addEventListener('click', sendMessage);

// Evento de pressionar a tecla Enter
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Alternar tema
botaoTema.addEventListener('change', () => {
  corpo.dataset.tema = corpo.dataset.tema === 'claro' ? 'escuro' : 'claro';
});