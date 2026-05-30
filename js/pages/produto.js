import { buscarTodosProdutos } from '../db.js';

function criarCardProduto(produto) {
    return `
        <div class="card-produto">
            <div class="container-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="info-produto">
                <div>
                    <h3>${produto.nome}</h3>
                    <p class="preco">${formatarMoeda(produto.preco)}</p>
                </div>
                <button class="btn-comprar">ADICIONAR AO CARRINHO</button>
            </div>
        </div>
    `;
}

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

async function loadCards() {
  const container = document.getElementById('container-cards');
  const listaDeProdutos = await buscarTodosProdutos();
  console.log('Produtos:', listaDeProdutos)
  
  if(listaDeProdutos){
    listaDeProdutos.forEach(prod => {
        container.innerHTML += criarCardProduto(prod);
    });
  }
}

loadCards();