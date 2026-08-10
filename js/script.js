function comprar(codigo) {
    const linkFormulario = "https://docs.google.com/forms/d/e/1FAIpQLSe3gB-oiU73jU7yL_h-owlpu9C-2IngVhNG2P_XBsPvtWT6Yg/viewform?usp=header";

    // Copia o código automaticamente
    navigator.clipboard.writeText(codigo);

    // Abre o formulário
    window.open(linkFormulario, "_blank");

    // Mensagem para o cliente
    alert("Código " + codigo + " copiado! Cole esse código no formulário.");
}