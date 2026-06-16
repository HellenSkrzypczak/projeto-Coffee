import { buscarProdutoPorId, buscarCarrinhoDoBanco, salvarCarrinhoNoBanco } from '../db.js';


export async function salvarCarrinho(cart) {
    await salvarCarrinhoNoBanco(cart);
    await atualizarContadorCarrinho();
    await renderizarMiniCarrinho();
}

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};


export async function adicionarAoCarrinho(idProduto) {
    try {
        const produto = await buscarProdutoPorId(idProduto);
        if (!produto) return;

        const carrinho = await buscarCarrinhoDoBanco();
        const index = carrinho.findIndex(item => item._id === idProduto);

        if (index !== -1) {
            carrinho[index].quantidade += 1;
        } else {
            produto.quantidade = 1;
            carrinho.push(produto);
        }

        await salvarCarrinho(carrinho);
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
    }
}


export async function removerDoCarrinho(idProduto) {
    try {
        let carrinho = await buscarCarrinhoDoBanco();
        carrinho = carrinho.filter(item => item._id !== idProduto);
        await salvarCarrinho(carrinho);
    } catch (error) {
        console.error("Erro ao remover do carrinho:", error);
    }
}

export async function atualizarContadorCarrinho() {
    const carrinho = await buscarCarrinhoDoBanco();
    const totalItens = carrinho.reduce((acumulador, item) => acumulador + item.quantidade, 0);
    
    const contadorElement = document.getElementById('contador-carrinho');
    if (contadorElement) {
        contadorElement.innerText = totalItens;
        contadorElement.style.display = totalItens > 0 ? 'flex' : 'none';
    }
}

export async function renderizarMiniCarrinho() {
    const carrinho = await buscarCarrinhoDoBanco();
    const containerItems = document.getElementById('cart-dropdown-items');
    const containerTotal = document.getElementById('cart-dropdown-total');
    
    if (!containerItems || !containerTotal) return;

    if (carrinho.length === 0) {
        containerItems.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding: 20px 0;">Seu carrinho está vazio.</p>';
        containerTotal.innerText = 'R$ 0,00';
        return;
    }

    let html = '';
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        html += `
            <div class="mini-cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="mini-cart-img">
                <div class="mini-cart-info">
                    <h4>${item.nome}</h4>
                    <p>${item.quantidade}x ${formatarMoeda(item.preco)}</p>
                </div>
                <button class="btn-remover-mini" data-id="${item._id}" title="Remover item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    containerItems.innerHTML = html;
    containerTotal.innerText = formatarMoeda(total);
}


export function initCarrinho() {
    document.addEventListener('click', async (e) => {

        const btnComprar = e.target.closest('.btn-comprar');
        if (btnComprar) {
            e.preventDefault(); 
            const idProduto = btnComprar.getAttribute('data-id');
            if (idProduto) await adicionarAoCarrinho(idProduto);
        }

        const btnRemover = e.target.closest('.btn-remover-mini');
        if (btnRemover) {
            e.preventDefault();
            const idProduto = btnRemover.getAttribute('data-id');
            if (idProduto) await removerDoCarrinho(idProduto);
        }
    });
    
    atualizarContadorCarrinho();
    renderizarMiniCarrinho();
}