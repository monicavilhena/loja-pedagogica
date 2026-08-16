const produtos = [
    {
        nome: "Mapa Mental Ondulatória",
        categoria: "Ciências",
        preco: "R$ 3,50",
        descricao: "Mapa mental simples sobre ondulatória.",
        imagem: "assets/imagens/ondulatoria.png"
    },

    {
        nome: "Flash das Férias",
        categoria: "Matemática",
        preco: "R$ 24,90",
        descricao: "Atividades para desenvolver o raciocínio lógico.",
        imagem: "assets/imagens/flashdasferias.png"
    },

    {
        nome: "Experimentos de Ciências",
        categoria: "Ciências",
        preco: "R$ 34,90",
        descricao: "Experimentos simples para sala de aula.",
        imagem: "assets/imagens/ondulatoria.png"
    },

    {
        nome: "Apresentação de Gravitação",
        categoria: "Apresentações",
        preco: "R$ 19,90",
        descricao: "Apresentação com 20 páginas sobre Gravitação Universal e Movimento dos Corpos.",
        imagem: "assets/imagens/gravitacao.png",
        arquivo: "materiais/apresentacoes/gravitacao.pdf"
    }
];

const lista = document.getElementById("lista-produtos");

function mostrarProdutos(listaProdutos){

    lista.innerHTML = "";

    listaProdutos.forEach(produto => {

        lista.innerHTML += `

        <div class="produto-card">

            <div class="imagem-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>

            <div class="produto-info">

                <span class="categoria">
                    ${produto.categoria}
                </span>

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    ${produto.descricao}
                </p>

                <div class="preco">
                    ${produto.preco}
                </div>

                <button onclick="comprarProduto('${produto.nome}')">
                    Comprar
                </button>

            </div>

        </div>

        `;

    });

}

mostrarProdutos(produtos);

const campoPesquisa = document.getElementById("pesquisar");

campoPesquisa.addEventListener("input", function(){

    const texto = this.value.toLowerCase();

    const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto) ||
        produto.categoria.toLowerCase().includes(texto)
    );

    mostrarProdutos(filtrados);

});

function comprarProduto(nome){

    const mensagem =
    `Olá! Tenho interesse no material "${nome}".`;

    const numero = "5594988050379";

    window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
        "_blank"
    );

}

const categorias = document.querySelectorAll(".categoria-card");

categorias.forEach(card => {

    card.addEventListener("click", () => {

        const categoria = card.dataset.categoria;

        if (categoria === "Todos") {
            mostrarProdutos(produtos);
            return;
        }

        const filtrados = produtos.filter(produto =>
            produto.categoria === categoria
        );

        mostrarProdutos(filtrados);

    });

});