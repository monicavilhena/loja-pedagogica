/* =========================================
   ELEMENTOS
========================================= */

const lista = document.getElementById("lista-produtos");

const campoPesquisa = document.getElementById("pesquisar");


/* =========================================
   VISUALIZADOR
========================================= */

const visualizador =
    document.getElementById("visualizador");

const fecharVisualizador =
    document.getElementById("fecharVisualizador");

const tituloVisualizador =
    document.getElementById("tituloVisualizador");

const contadorSlides =
    document.getElementById("contadorSlides");

const numeroSlide =
    document.getElementById("numeroSlide");

const canvas =
    document.getElementById("pdfCanvas");

const contexto =
    canvas.getContext("2d");

const carregandoPDF =
    document.getElementById("carregandoPDF");

const slideAnterior =
    document.getElementById("slideAnterior");

const slideProximo =
    document.getElementById("slideProximo");

const slideAnteriorMobile =
    document.getElementById("slideAnteriorMobile");

const slideProximoMobile =
    document.getElementById("slideProximoMobile");


/* =========================================
   VARIÁVEIS DO PDF
========================================= */

let pdfAtual = null;

let paginaAtual = 1;

let totalPaginas = 0;

let renderizando = false;

let paginaPendente = null;


/* =========================================
   MOSTRAR PRODUTOS
========================================= */

function mostrarProdutos(listaProdutos) {

    lista.innerHTML = "";


    if (listaProdutos.length === 0) {

        lista.innerHTML = `
            <p class="nenhum-produto">
                Nenhum material encontrado.
            </p>
        `;

        return;
    }


    listaProdutos.forEach((produto, index) => {

        const possuiPreview =
            produto.arquivo ? true : false;


        lista.innerHTML += `

        <div class="produto-card">


            <div class="imagem-produto">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

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


                <div class="botoes-produto">


                    ${
                        possuiPreview

                        ?

                        `
<button
    class="botao-preview"
    onclick="abrirApresentacao(${index})"
>
    Ver apresentação
</button>
                        `

                        :

                        ""
                    }


                    <button
                        class="botao-comprar"
                        onclick="comprarProduto('${produto.nome}')"
                    >
                        Comprar
                    </button>


                </div>


            </div>

        </div>

        `;

    });

}


/* =========================================
   MOSTRAR TODOS
========================================= */

mostrarProdutos(produtos);


/* =========================================
   PESQUISA
========================================= */

campoPesquisa.addEventListener(
    "input",
    function () {

        const texto =
            this.value.toLowerCase().trim();


        const filtrados =
            produtos.filter(produto =>

                produto.nome
                    .toLowerCase()
                    .includes(texto)

                ||

                produto.categoria
                    .toLowerCase()
                    .includes(texto)

            );


        mostrarProdutos(filtrados);

    }
);


/* =========================================
   COMPRAR PRODUTO
========================================= */

function comprarProduto(nome) {

    const mensagem =
        `Olá! Tenho interesse no material "${nome}".`;


    const numero =
        "5594988050379";


    window.open(

        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,

        "_blank"

    );

}


/* =========================================
   ABRIR APRESENTAÇÃO
========================================= */

async function abrirApresentacao(index) {

    const produto =
        produtos[index];


    if (!produto.arquivo) {

        return;

    }


    visualizador.classList.add("ativo");

    document.body.classList.add("sem-scroll");


    tituloVisualizador.textContent =
        produto.nome;


    carregandoPDF.style.display =
        "flex";


    canvas.style.display =
        "none";


    paginaAtual = 1;


    contadorSlides.textContent =
        "Carregando...";


    try {

        /*
        PDF.js é carregado como módulo.
        */

        if (!window.pdfjsLib) {

            await carregarPDFJS();

        }


        const loadingTask =
            window.pdfjsLib.getDocument(
                produto.arquivo
            );


        pdfAtual =
            await loadingTask.promise;


        totalPaginas =
            pdfAtual.numPages;


        contadorSlides.textContent =
            `${paginaAtual} / ${totalPaginas}`;


        numeroSlide.textContent =
            `Slide ${paginaAtual}`;


        await renderizarPagina(paginaAtual);


    }

    catch (erro) {

        console.error(
            "Erro ao carregar PDF:",
            erro
        );


        carregandoPDF.textContent =
            "Não foi possível carregar a apresentação.";

    }

}


/* =========================================
   CARREGAR PDF.JS
========================================= */

function carregarPDFJS() {

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement("script");

            script.type =
                "module";


            script.textContent = `

                import * as pdfjsLib

                from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

                window.pdfjsLib = pdfjsLib;

                pdfjsLib.GlobalWorkerOptions.workerSrc =

                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

            `;


            script.onload =
                resolve;

            script.onerror =
                reject;


            document.body.appendChild(
                script
            );

        }
    );

}


/* =========================================
   RENDERIZAR PÁGINA
========================================= */

async function renderizarPagina(numero) {

    if (!pdfAtual) {

        return;

    }


    if (renderizando) {

        paginaPendente =
            numero;

        return;

    }


    renderizando =
        true;


    try {

        const pagina =
            await pdfAtual.getPage(numero);


        const viewportOriginal =
            pagina.getViewport({
                scale: 1
            });


        const larguraDisponivel =
            document.querySelector(
                ".slide-container"
            ).clientWidth;


        const alturaDisponivel =
            window.innerHeight * 0.70;


        const escalaLargura =
            larguraDisponivel /
            viewportOriginal.width;


        const escalaAltura =
            alturaDisponivel /
            viewportOriginal.height;


        const escala =
            Math.min(
                escalaLargura,
                escalaAltura
            );


        const viewport =
            pagina.getViewport({
                scale: escala
            });


        canvas.width =
            viewport.width;


        canvas.height =
            viewport.height;


        await pagina.render({

            canvasContext:
                contexto,

            viewport:
                viewport

        }).promise;


        carregandoPDF.style.display =
            "none";


        canvas.style.display =
            "block";


        contadorSlides.textContent =
            `${numero} / ${totalPaginas}`;


        numeroSlide.textContent =
            `Slide ${numero}`;


        atualizarBotoes();


    }

    catch (erro) {

        console.error(
            "Erro ao renderizar página:",
            erro
        );

    }


    renderizando =
        false;


    if (paginaPendente !== null) {

        const proxima =
            paginaPendente;


        paginaPendente =
            null;


        renderizarPagina(proxima);

    }

}


/* =========================================
   PRÓXIMO SLIDE
========================================= */

function proximoSlide() {

    if (!pdfAtual) {

        return;

    }


    if (paginaAtual >= totalPaginas) {

        return;

    }


    paginaAtual++;


    renderizarPagina(
        paginaAtual
    );

}


/* =========================================
   SLIDE ANTERIOR
========================================= */

function anteriorSlide() {

    if (!pdfAtual) {

        return;

    }


    if (paginaAtual <= 1) {

        return;

    }


    paginaAtual--;


    renderizarPagina(
        paginaAtual
    );

}


/* =========================================
   BOTÕES
========================================= */

slideProximo.addEventListener(
    "click",
    proximoSlide
);


slideAnterior.addEventListener(
    "click",
    anteriorSlide
);


slideProximoMobile.addEventListener(
    "click",
    proximoSlide
);


slideAnteriorMobile.addEventListener(
    "click",
    anteriorSlide
);


/* =========================================
   ATUALIZAR BOTÕES
========================================= */

function atualizarBotoes() {

    const inicio =
        paginaAtual === 1;


    const fim =
        paginaAtual === totalPaginas;


    slideAnterior.disabled =
        inicio;


    slideProximo.disabled =
        fim;


    slideAnteriorMobile.disabled =
        inicio;


    slideProximoMobile.disabled =
        fim;

}


/* =========================================
   FECHAR VISUALIZADOR
========================================= */

function fecharApresentacao() {

    visualizador.classList.remove(
        "ativo"
    );


    document.body.classList.remove(
        "sem-scroll"
    );


    pdfAtual =
        null;


    paginaAtual =
        1;


    totalPaginas =
        0;


    contexto.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


fecharVisualizador.addEventListener(
    "click",
    fecharApresentacao
);


/* =========================================
   CLICAR FORA
========================================= */

visualizador.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target ===
            visualizador
        ) {

            fecharApresentacao();

        }

    }
);


/* =========================================
   TECLADO
========================================= */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !visualizador.classList.contains(
                "ativo"
            )
        ) {

            return;

        }


        if (evento.key === "ArrowRight") {

            proximoSlide();

        }


        if (evento.key === "ArrowLeft") {

            anteriorSlide();

        }


        if (evento.key === "Escape") {

            fecharApresentacao();

        }

    }
);


/* =========================================
   CATEGORIAS
========================================= */

const categorias =
    document.querySelectorAll(
        ".categoria-card"
    );


categorias.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const categoria =
                card.dataset.categoria;


            if (
                categoria === "Todos"
            ) {

                mostrarProdutos(
                    produtos
                );

                return;

            }


            const filtrados =
                produtos.filter(
                    produto =>
                        produto.categoria ===
                        categoria
                );


            mostrarProdutos(
                filtrados
            );

        }
    );

});


/* =========================================
   REDIMENSIONAR
========================================= */

window.addEventListener(
    "resize",
    function () {

        if (pdfAtual) {

            renderizarPagina(
                paginaAtual
            );

        }

    }
);