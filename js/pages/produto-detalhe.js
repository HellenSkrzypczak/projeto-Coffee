import { buscarProdutoPorId } from '../db.js';

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

async function renderizarDetalhesDoProduto() {
    const parametrosURL = new URLSearchParams(window.location.search);
    const idDoProduto = parametrosURL.get('id');

    if (!idDoProduto) {
        window.location.href = 'index.html';
        return;
    }

    const produto = await buscarProdutoPorId(idDoProduto);
    if (!produto) {
        document.getElementById('prod-nome').innerText = "Café não encontrado!";
        return;
    }

    document.getElementById('bread-produto-nome').innerText = produto.nome;
    document.getElementById('prod-nome').innerText = produto.nome;
    document.getElementById('prod-preco').innerText = formatarMoeda(produto.preco);
    
    const elementoImagem = document.getElementById('prod-img');
    elementoImagem.src = produto.imagem;
    elementoImagem.alt = produto.nome;

    let descricaoCompleta = `Origem e seleção exclusiva de Café da categoria ${produto.categoria}.`;
    
    if (produto.torra) {
        descricaoCompleta += ` Este lote passou por um processo cuidadoso de torra ${produto.torra.toLowerCase()}, preservando ao máximo as propriedades do grão.`;
    }
    
    if (produto.notas && produto.notas.length > 0) {
        descricaoCompleta += ` Em boca, destaca-se pelo seu perfil sensorial único, apresentando notas marcantes de: ${produto.notas.join(', ')}.`;
    }

    document.getElementById('prod-desc').innerText = descricaoCompleta;

    const containerNotas = document.getElementById('prod-notas-container');
    if (containerNotas && produto.notas && produto.notas.length > 0) {
        containerNotas.innerHTML = produto.notas
            .map(nota => `<span class="tag-sensorial">${nota}</span>`)
            .join('');
    }

    const containerEspecificacoes = document.getElementById('prod-especificacoes');
    if (containerEspecificacoes) {
        containerEspecificacoes.innerHTML = `
            <div class="especificacao-item">
                <strong>Categoria</strong>
                <span>${produto.categoria}</span>
            </div>
            <div class="especificacao-item">
                <strong>Torra</strong>
                <span>${produto.torra || 'Não informado'}</span>
            </div>
        `;
    }
}

renderizarDetalhesDoProduto();