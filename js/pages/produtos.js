import { buscarTodosProdutos } from '../db.js';

let todosProdutosDoBanco = [];

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

function criarCardCatalogo(produto) {
    const tagsNotas = produto.notas && produto.notas.length > 0 
        ? produto.notas.map(nota => `<span class="tag-nota-mini">${nota}</span>`).join('') 
        : '';

    return `
        <div class="card-produto">
            <a href="produto.html?id=${produto._id}" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                <div class="container-imagem" style="position: relative;">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <span class="badge-categoria-card">${produto.categoria}</span>
                </div>
                <div class="info-produto">
                    <div style="width: 100%;">
                        <span class="info-torra-card">Torra ${produto.torra || 'Média'}</span>
                        <h3 class="titulo-produto-card">${produto.nome}</h3>
                        
                        <div class="container-tags-mini">${tagsNotas}</div>
                        
                        <p class="preco" style="color: var(--accent-color); font-weight: 600; font-size: 1.25rem; margin-top: 0.8rem;">
                            ${formatarMoeda(produto.preco)}
                        </p>
                    </div>
                </div>
            </a>
            <button class="btn-comprar" data-id="${produto._id}" style="margin-top: auto; margin-bottom: 1rem; width: 100%;">
                ADICIONAR AO CARRINHO
            </button>
        </div>
    `;
}

async function inicializarPagina() {
    todosProdutosDoBanco = await buscarTodosProdutos() || [];
    
    const params = new URLSearchParams(window.location.search);
    const categoriaUrl = params.get('categoria');

    if (categoriaUrl) {
        configurarFiltroInicialUrl(categoriaUrl);
    }

    executarFiltragem();
    configurarEventosFiltros();
}

function configurarFiltroInicialUrl(categoria) {
    const checkboxes = document.querySelectorAll('.filtro-categoria');
    const checkTodos = document.getElementById('check-todos');

    checkboxes.forEach(cb => {
        if (cb.value.toLowerCase() === categoria.toLowerCase()) {
            cb.checked = true;
            checkTodos.checked = false;
        }
    });
}

function configurarEventosFiltros() {
    const checkTodos = document.getElementById('check-todos');
    const checkboxesCategoria = document.querySelectorAll('.filtro-categoria');

    checkTodos.addEventListener('change', () => {
        if (checkTodos.checked) {
            checkboxesCategoria.forEach(cb => cb.checked = false);
        }
        executarFiltragem();
    });

    checkboxesCategoria.forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) {
                checkTodos.checked = false;
            }
            
            const algumAtivo = Array.from(checkboxesCategoria).some(c => c.checked);
            if (!algumAtivo) {
                checkTodos.checked = true;
            }

            executarFiltragem();
        });
    });
}

function executarFiltragem() {
    const container = document.getElementById('container-catalogo');
    const tituloPagina = document.getElementById('titulo-categoria-atual');
    const checkTodos = document.getElementById('check-todos').checked;
    
    const categoriasSelecionadas = Array.from(document.querySelectorAll('.filtro-categoria'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    let produtosFiltrados = todosProdutosDoBanco;

    if (!checkTodos) {
        produtosFiltrados = todosProdutosDoBanco.filter(prod => 
            categoriasSelecionadas.includes(prod.categoria)
        );
        tituloPagina.innerText = `Cafés / ${categoriasSelecionadas.join(' & ')}`;
    } else {
        tituloPagina.innerText = "Todos os Cafés";
    }

    container.innerHTML = '';
    if (produtosFiltrados.length === 0) {
        container.innerHTML = `<p style="color: #ffffff8a; padding: 2rem;">Nenhum café encontrado para os filtros selecionados.</p>`;
        return;
    }

    produtosFiltrados.forEach(prod => {
        container.innerHTML += criarCardCatalogo(prod);
    });
}

inicializarPagina();