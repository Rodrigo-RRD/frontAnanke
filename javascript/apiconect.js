$(document).ready(function () {
    consultarProjetoAPI();
});

function consultarProjetoAPI() {

    $.ajax({
        url: "http://localhost:8080/v1/projetos/listar",
        type: "get",
        success: function (response) {
            criarLitaProjetos(response);
        }
    });
}

function criarLitaProjetos(response) {

    var projetos = response;

    $.each(projetos, function (b, projeto) {

        var cards = $("<div>").addClass("cardN" + b).append(
            $("<div>").addClass("card-body").append(
                $("<img>").addClass("img-card" + b).attr({
                    src: "/img/javaImage.png",
                    alt: "Image description"
                }),
                $("<div>").addClass("textCard").append(
                    $("<h5>").addClass("textAreaConhecimento").text(projeto.areaConhecimento).append(
                        $("<p>").addClass("card-text").text("Tema: " + projeto.tema),
                        $("<p>").addClass("card-text").text("Status: " + projeto.status.toLowerCase())
                    )))
        );
        cards.appendTo(".criarCards");
    });
}

