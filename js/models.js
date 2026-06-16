export class ProdutoCafe {
    constructor(id, nome, preco, categoria, notas, torra, imagem) {
        this._id = id;
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.categoria = categoria;
        this.notas = notas;
        this.torra = torra;
        this.imagem = imagem;
        this.dataCriacao = new Date().toISOString();
    }
}

export class Usuario {
    constructor(email, nome, senha, role = 'user') {
        this._id = email;
        this.nome = nome;
        this.email = email;
        this.senha = senha; 
        this.role = role;
        this.dataCriacao = new Date().toISOString();
    }
}