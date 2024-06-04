
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
        }, error: function (jqXHR, textStatus, errorThrown) {
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

    let sub = 0;
    $.each(projetos, function (b, projeto) {

        if(projeto.status == 'CANCELADO'){
            sub++;
            return;
        }
        b = b - sub;

        var areaCC = {
            "CIENCIAS_EXATAS_E_TERRA": "Ciências Exatas",
            "CIENCIAS_DA_SAUDE": "Saúde",
            "ENGENHARIAS": "Engenharias",
            "CIENCIAS_BIOLOGICAS": "Ciencias Biologica",
            "CIENCIAS_HUMANAS": "Ciencias Humanas",
            "CIENCIAS_DA_COMPUTACAO_E_TECNOLOGIA_DA_INFORMACAO": "Ciência da Computação e Tecnologia da Informação",
            "INTERDICIPLINAR": "Interdiciplinar",
            "OUTRAS": "Outras áreas"
        };

        var cards =
            $("<div>").addClass("containerCards").append(
                $("<div>").addClass("cardN" + b).append(
                    $("<div>").addClass("card-body").append(
                        $("<img>").addClass("img-card" + b).attr({
                            src: "/img/javaImage.png",
                            alt: "Image description"
                        }),
                        $("<div>").addClass("textCard").append(
                            $("<h5>").addClass("textAreaConhecimento").text(projeto.nome).append(
                                $("<p>").addClass("card-text").text("Área: " + areaCC[projeto.areaConhecimento]),
                                $("<p>").addClass("card-text").text("Status: " + projeto.status.toLowerCase())
                            ))).append(
                                $("<div>").addClass("actionButtons").append(
                                    $("<button>").addClass("btnDownload").addClass("btnDownload" + projeto.id).append(
                                        $("<img>").addClass("imgDownload").attr(
                                            {
                                                src: "/icons/download.svg",
                                                alt: "Botão download"
                                            }
                                        )
                                    ).append(
                                        $("<span>").addClass("tooltipDownload").text("Baixar Arquivo")
                                    ).click(function(){
                                        baixarArquivo(projeto.id, projeto.nome);
                                    })
                                ).append(
                                    $("<button>").addClass("btnEditar").addClass("btnEditar" + projeto.id).append(
                                        $("<img>").addClass("imgEditar").attr(
                                            {
                                                src: "/icons/edit.svg",
                                                alt: "Botão editar"
                                            }
                                        )
                                    ).append(
                                        $("<span>").addClass("tooltipEditar").text("Editar Projeto")
                                    )
                                ).append(
                                    $("<button>").addClass("btnExcluir").addClass("btnExcluir" + projeto.id).append(
                                        $("<img>").addClass("imgExcluir").attr(
                                            {
                                                src: "/icons/trash.svg",
                                                alt: "Botão excluir"
                                            }
                                        )
                                    ).append(
                                        $("<span>").addClass("tooltipExcluir").text("Excluir Projeto")
                                    ).click(function(){
                                        msgBoxExcluir(projeto.id);
                                    })
                                )
                            )
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

$(".btnExcluir").click(function() {
    
});

function msgBoxExcluir(idProjeto){
    $("#confirmDialog").dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Sim": function() {
            $(this).dialog("close");
            $.ajax({
                url: 'http://localhost:8080/v1/projetos/deletar/' + idProjeto,
                type: 'POST',
                data: null,
                processData: false,
                contentType: false,
                success: function (response) {
                    window.location.replace("http://127.0.0.1:5501/trabalhos.html");
                    alert('Projeto excluído com sucesso!');
                },
                error: function (xhr, status, error) {
                    alert('Erro ao excluir o projeto.');
                    console.error(xhr, status, error);
                }
            });
        },
        "Não": function() {
          $(this).dialog("close");
        }
      }
    });
}

function baixarArquivo(idProjeto, nomeArquivo) {
    $.ajax({
        url: 'http://localhost:8080/v1/projetos/download/' + idProjeto,
        method: "POST",
        xhr: function() {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            return xhr;
        },
        success: function(data) {
            var blob = new Blob([data], {type: "application/octet-stream"});
            var fileName = nomeArquivo + ".pdf";
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }
    });
}
