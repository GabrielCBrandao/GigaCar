// ==========================
// ESTADO
// ==========================
let carrinho = [];

// ==========================
// SELETORES
// ==========================
const botoes = document.querySelectorAll('.btn-comprar');
const lista = document.getElementById('lista-carrinho');
const totalElemento = document.getElementById('total');

const abrirCarrinho = document.getElementById('abrir-carrinho');
const modal = document.getElementById('modal-carrinho');
const fecharModal = document.getElementById('fechar-modal');


// ==========================
// EVENTOS - MODAL
// ==========================
abrirCarrinho.addEventListener('click', () => {
  modal.style.display = 'flex';
});

fecharModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});


// ==========================
// EVENTOS - PRODUTOS
// ==========================
botoes.forEach(botao => {
  botao.addEventListener('click', (e) => {

    const card = e.target.closest('.card');

    const nome = card.querySelector('h3').innerText;
    const preco = Number(card.querySelector('.preco').dataset.preco);

    adicionarProduto({ nome, preco });
  });
});


// ==========================
// FUNÇÕES PRINCIPAIS
// ==========================

// Adicionar produto
function adicionarProduto(produto) {
  const produtoExistente = carrinho.find(item => item.nome === produto.nome);

  if (produtoExistente) {
    produtoExistente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }

  atualizarCarrinho();
}

// Remover produto
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// Atualizar UI + salvar
function atualizarCarrinho() {
lista.innerHTML = '';

  let total = 0;

  carrinho.forEach((item, index) => {

    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const li = document.createElement('li');

    li.innerHTML = `
      <div>
        ${item.nome} <br>
        <small>R$ ${item.preco} x ${item.quantidade}</small>
      </div>

      <div>
        <button onclick="diminuirQtd(${index})">➖</button>
        <button onclick="aumentarQtd(${index})">➕</button>
        <button onclick="removerItem(${index})">❌</button>
      </div>
    `;

    lista.appendChild(li);
  });

  totalElemento.innerText = `Total: R$ ${total}`;

  salvarCarrinho();
}
function aumentarQtd(index) {
  carrinho[index].quantidade++;
  atualizarCarrinho();
}

function diminuirQtd(index) {

  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade--;
  } else {
    removerItem(index);
    return;
  }

  atualizarCarrinho();
}
function finalizarCompra() {

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  let mensagem = '🛒 *Pedido GigaShop*%0A%0A';

  let total = 0;

  carrinho.forEach(item => {

    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    mensagem += `🚗 ${item.nome}%0A`;
    mensagem += `Quantidade: ${item.quantidade}%0A`;
    mensagem += `Subtotal: R$ ${subtotal}%0A%0A`;
  });

  mensagem += `💰 *Total: R$ ${total}*`;

  const telefone = '5521974089973';

  const url = `https://wa.me/${telefone}?text=${mensagem}`;

  window.open(url, '_blank');
  carrinho = [];
atualizarCarrinho();
}


// ==========================
// LOCAL STORAGE
// ==========================
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const dados = localStorage.getItem('carrinho');

  if (dados) {
    carrinho = JSON.parse(dados);
    atualizarCarrinho();
  }
}


// ==========================
// INIT
// ==========================
carregarCarrinho();