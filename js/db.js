import { ProdutoCafe } from "./models.js";
import { Usuario } from "./models.js";

const dbProdutos = new PouchDB('coffee_produtos');
const dbUsuarios = new PouchDB('coffee_usuarios');
const dbCarrinho = new PouchDB('coffee_carrinho');

async function popularBancoInicial() {
    // await dbProdutos.destroy();

    const info = await dbProdutos.info();
    if (info.doc_count === 0) {
        const cafesIniciais = [
            new ProdutoCafe('1', 'Coffee Java Roast Especial 250g', 45.90, 'Grãos', ['Nozes', 'Cacau'], 'Média', 'assets/img/cafe.jpg'),
            new ProdutoCafe('2', 'Coffee Arabica Gold 250g', 52.00, 'Grãos', ['Frutado', 'Cítrico'], 'Clara', 'assets/img/cafe.jpg'),
            new ProdutoCafe('3', 'Coffee Bourbon Amarelo em Grãos 250g', 58.50, 'Grãos', ['Chocolate', 'Caramelo', 'Mel'], 'Média', 'assets/img/cafe.jpg'),
            new ProdutoCafe('4', 'Coffee Microlote Geisha Raro 250g', 89.90, 'Grãos', ['Florais', 'Jasmim', 'Chá Verde'], 'Clara', 'assets/img/cafe.jpg'),
            new ProdutoCafe('5', 'Coffee Expresso Intenso (10 Cápsulas)', 32.00, 'Cápsulas', ['Caramelo', 'Especiarias'], 'Escura', 'assets/img/cafe.jpg'),
            new ProdutoCafe('6', 'Coffee Lungo Suave (10 Cápsulas)', 34.00, 'Cápsulas', ['Cereja', 'Avelã'], 'Clara', 'assets/img/cafe.jpg'),
            new ProdutoCafe('7', 'Coffee Descafeinado Velvet (10 Cápsulas)', 35.50, 'Cápsulas', ['Malte', 'Cereal'], 'Média', 'assets/img/cafe.jpg'),
            new ProdutoCafe('8', 'Coffee Moído Clássico do Lar 250g', 38.90, 'Torrados e Moídos', ['Rapadura', 'Frutas Secas'], 'Média', 'assets/img/cafe.jpg'),
            new ProdutoCafe('9', 'Coffee Moído Dark Roast Intenso 250g', 39.90, 'Torrados e Moídos', ['Chocolate Amargo', 'Tostado'], 'Escura', 'assets/img/cafe.jpg'),
            new ProdutoCafe('10', 'Drip Coffee Pocket Orgânico (10 Sachês)', 44.00, 'Drip Coffee', ['Cítrico', 'Mel', 'Manga'], 'Clara', 'assets/img/cafe.jpg')
        ];

        try {
            await dbProdutos.bulkDocs(cafesIniciais);
            console.log("Produtos iniciais cadastrados!");
        } catch (err) {
            console.error("Erro ao popular banco:", err);
        }
    }
}

export async function buscarTodosProdutos() {
    try {
        const resultado = await dbProdutos.allDocs({ include_docs: true });
        // Mapeia o resultado para retornar apenas os dados do documento
        const listaProdutos = resultado.rows.map(row => row.doc);
        console.table(listaProdutos);
        return listaProdutos;
    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
    }
}

export async function buscarProdutoPorId(id) {
    try {
        const produto = await dbProdutos.get(id);
        return produto;
    } catch (err) {
        console.error("Erro ao buscar produto por ID no PouchDB:", err);
        return null;
    }
}

export async function criarAdminPadrao() {
    try {
        const info = await dbUsuarios.info();
        if (info.doc_count === 0) {
            const admin = new Usuario('admin@coffee.com', 'Administrador', '123456', 'admin');
            await dbUsuarios.put(admin);
        }
    } catch (err) {
        console.error("Erro ao criar admin padrão:", err);
    }
}

export async function salvarUsuario(usuario) {
    try {
        await dbUsuarios.put(usuario);
        return true;
    } catch (err) {
        console.error("Erro ao salvar usuário:", err);
        return false;
    }
}

export async function buscarUsuarioPorEmail(email) {
    try {
        return await dbUsuarios.get(email);
    } catch (err) {
        return null;
    }
}

export async function buscarCarrinhoDoBanco() {
    try {
        const doc = await dbCarrinho.get('carrinho_atual');
        return doc.itens;
    } catch (err) {
        if (err.status === 404) {
            return [];
        }
        console.error("Erro ao buscar carrinho:", err);
        return [];
    }
}

export async function salvarCarrinhoNoBanco(itens) {
    try {
        let doc;
        try {
            doc = await dbCarrinho.get('carrinho_atual');
        } catch (err) {
            if (err.status === 404) {
                doc = { _id: 'carrinho_atual', itens: [] };
            } else {
                throw err;
            }
        }

        doc.itens = itens;
        await dbCarrinho.put(doc);
        return true;
    } catch (err) {
        console.error("Erro ao salvar carrinho:", err);
        return false;
    }
}

criarAdminPadrao();
popularBancoInicial();