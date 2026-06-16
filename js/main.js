import { buscarTodosProdutos } from './db.js';
import { initCarrinho } from './pages/carrinho.js';

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

function criarCardHtml(produto) {
    return `
        <div class="card-produto">
            <a href="produto.html?id=${produto._id}" style="color: inherit; text-decoration: none; display: block; width: 100%;">
                <div class="container-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="info-produto">
                    <div>
                        <h3>${produto.nome}</h3>
                        <p class="preco">${formatarMoeda(produto.preco)}</p>
                    </div>
                </div>
            </a>
            <button class="btn-comprar" data-id="${produto._id}">ADICIONAR AO CARRINHO</button>
        </div>
    `;
}

function carregarHeader() {
    const headerHTML = `
    <header id="main-header">
        <nav class="container-nav">
            <div class="nav-group">
                <div class="dropdown">
                    <a href="produtos.html" class="nav-link">Cafés <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 3px;"></i></a>
                    <div class="dropdown-content">
                        <a href="produtos.html?categoria=Grãos">Torrados em Grãos</a>
                        <a href="produtos.html?categoria=Cápsulas">Cápsulas</a>
                        <a href="produtos.html?categoria=Torrados e Moídos">Torrados e Moídos</a>
                        <a href="produtos.html?categoria=Drip Coffee">Drip Coffee</a>
                    </div>
                </div>
                <a href="assinaturas.html" class="nav-link">Assinaturas</a>
                <a href="acessorios.html" class="nav-link">Acessórios</a>
            </div>
      
            <div class="nav-logo">
                <a href="index.html">
                    <img src="assets/img/icon.png" alt="Logo Coffee" style="height: 50px; cursor: pointer;">
                </a>
            </div>
      
            <div class="nav-group">
                <a href="index.html#sobre" class="nav-link">Sobre</a>
                <a href="login.html" id="login" class="nav-link">Login</a>
            
                <div class="cart-container" style="position: relative; display: inline-block;">
                    <a href="#" class="nav-link nav-carrinho-icone">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span id="contador-carrinho" style="display: none;">0</span>
                    </a>
                    
                    <div class="cart-dropdown" id="cart-dropdown">
                        <div class="cart-dropdown-items" id="cart-dropdown-items"></div>
                        <div class="cart-dropdown-footer">
                            <div class="cart-total">Total: <span id="cart-dropdown-total">R$ 0,00</span></div>
                            <a href="#" class="btn-primary" style="display: block; text-align: center; padding: 10px; font-size: 0.9rem; text-decoration: none;">VER CARRINHO</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
      </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    configurarEfeitosHeader();
}

function configurarEfeitosHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

async function inicializarHome() {
    const listaDeProdutos = await buscarTodosProdutos();
    if (!listaDeProdutos || listaDeProdutos.length === 0) return;

    const produtosEmbaralhados = [...listaDeProdutos];
    for (let i = produtosEmbaralhados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [produtosEmbaralhados[i], produtosEmbaralhados[j]] = [produtosEmbaralhados[j], produtosEmbaralhados[i]];
    }

    const destaquesContainer = document.getElementById('container-destaques'); 
    if (destaquesContainer) {
        destaquesContainer.innerHTML = '';
        produtosEmbaralhados.slice(0, 3).forEach(prod => {
            destaquesContainer.innerHTML += criarCardHtml(prod);
        });
    }

    const carrosselContainer = document.getElementById('container-carrossel');
    if (carrosselContainer) {
        carrosselContainer.innerHTML = '';
        listaDeProdutos.forEach(prod => {
            carrosselContainer.innerHTML += criarCardHtml(prod);
        });
        
        configurarNavegacaoCarrossel();
    }
}

function configurarNavegacaoCarrossel() {
    const track = document.getElementById('container-carrossel');
    const btnPrev = document.querySelector('.carrossel-btn.prev');
    const btnNext = document.querySelector('.carrossel-btn.next');

    if (!track || !btnPrev || !btnNext) return;

    const scrollAmount = 340; 

    btnNext.addEventListener('click', () => {
        track.scrollLeft += scrollAmount;
    });

    btnPrev.addEventListener('click', () => {
        track.scrollLeft -= scrollAmount;
    });
}

function init() {
  carregarHeader();
  initCarrinho();
  inicializarHome();
}

document.addEventListener('DOMContentLoaded', init)
