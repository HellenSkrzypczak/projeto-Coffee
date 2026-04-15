export class ProdutoCafe {
    constructor(id, nome, preco, categoria, notas, torra, imagem) {
        this._id = id; // O PouchDB usa _id como chave primária
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.categoria = categoria; // Ex: Grãos, Cápsulas, Acessórios
        this.notas = notas; // Array: ['Chocolate', 'Caramelo']
        this.torra = torra; // Ex: Média, Escura
        this.imagem = imagem; // URL ou String Base64
        this.dataCriacao = new Date().toISOString();
    }
}