import { ProdutoCafe } from "./models.js";

const dbProdutos = new PouchDB('coffee_produtos');
const dbUsuarios = new PouchDB('coffee_usuarios');

async function popularBancoInicial() {
    // Verifica se já existem produtos para não duplicar toda vez que atualizar a página
    const info = await dbProdutos.info();
    
    if (info.doc_count === 0) {
        const cafesIniciais = [
            new ProdutoCafe('1', 'Java Roast Especial', 45.90, 'Grãos', ['Nozes', 'Cacau'], 'Média', 'assets/img/cafe1.png'),
            new ProdutoCafe('2', 'Arabica Gold', 52.00, 'Grãos', ['Frutado', 'Cítrico'], 'Clara', 'assets/img/cafe2.png'),
            new ProdutoCafe('3', 'Expresso Intenso', 38.00, 'Cápsulas', ['Caramelo'], 'Escura', 'assets/img/cafe3.png')
        ];

        try {
            await dbProdutos.bulkDocs(cafesIniciais);
            console.log("Produtos iniciais cadastrados!");
        } catch (err) {
            console.error("Erro ao popular banco:", err);
        }
    }
}

async function buscarTodosProdutos() {
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


popularBancoInicial();