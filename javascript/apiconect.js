
$(document).ready(function () {
    var page = 0;
    consultarProjetoAPI(page);
});

function consultarProjetoAPI(page) {

    $.ajax({
        url: "http://localhost:8080/v1/projetos/listar",
        type: "get",
        data: {
            page: page,
            size: 3
        },
        success: function (response) {
            criarLitaProjetos(response);
        },error: function(jqXHR, textStatus, errorThrown) {
            // Aqui você pode lidar com o erro da maneira que preferir
            console.error("Erro na requisição AJAX:", textStatus, errorThrown);
        }
    });
}

function criarLitaProjetos(response) {
    var projetos = response.content;

    $(".containerCards").remove();
    $("#currentUsuario").text(response.number + 1);
    $("#totalPages").text(response.totalPages);
    $("#currentPage").text(response.number);

    $.each(projetos, function (b, projeto) {

        var cards =
            $("<div>").addClass("containerCards").append(
                $("<div>").addClass("cardN" + b).append(
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
                ));

        cards.appendTo(".criarCards");

        // Paginação
        var totalPages = response.totalPages; // Número total de páginas
        var page = response.number;
        var elementN = response.numberOfElements;


        if (page < totalPages - 1) {
            $('#btn-next').prop('disabled', false); // Habilita o botão de próxima página
        } else {
            $('#btn-next').prop('disabled', true); // Desabilita o botão de próxima página
        }
        if (page > 0) {
            $('#btn-prev').prop('disabled', false); // Habilita o botão de página anterior
        } else {
            $('#btn-prev').prop('disabled', true); // Desabilita o botão de página anterior
        }
        if (elementN === 0) {
            $('#btn-next').prop('disabled', true); // Desabilita o botão de próxima página
            $('#btn-prev').prop('disabled', true); // Desabilita o botão de página anterior
        }
    });
}


$('#btn-next').click(function () {
    var currentPage = parseInt($("#currentPage").text());
    consultarProjetoAPI(currentPage + 1);
});

$('#btn-prev').click(function () {
    var currentPage = parseInt($('#currentPage').text());
    consultarProjetoAPI(currentPage - 1);
});
