import { ProdutoCafe } from "./models.js";

const dbProdutos = new PouchDB('coffee_produtos');
const dbUsuarios = new PouchDB('coffee_usuarios');

async function popularBancoInicial() {
    // DESCOMENTE A LINHA ABAIXO PARA RESETAR O BANCO UMA VEZ:
    //await dbProdutos.destroy();
    // Verifica se já existem produtos para não duplicar toda vez que atualizar a página
    const info = await dbProdutos.info();
    
    if (info.doc_count === 0) {
        const cafesIniciais = [
            new ProdutoCafe('1', 'Coffee Java Roast Especial 250g', 45.90, 'Grãos', ['Nozes', 'Cacau'], 'Média', 'assets/img/cafe.jpg'),
            new ProdutoCafe('2', 'Coffee Arabica Gold 250g', 52.00, 'Grãos', ['Frutado', 'Cítrico'], 'Clara', 'assets/img/cafe.jpg'),
            new ProdutoCafe('3', 'Coffee Expresso Intenso 250g', 38.00, 'Cápsulas', ['Caramelo'], 'Escura', 'assets/img/cafe.jpg')
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


popularBancoInicial();