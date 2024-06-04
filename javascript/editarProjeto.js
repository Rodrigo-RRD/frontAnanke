
$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const idProjeto = urlParams.get('idProjeto');
    
    if(idProjeto == null){
        alert("Projeto a ser editado não encontrado!");
        window.location.replace("http://127.0.0.1:5501/trabalhos.html");
    }

    consultarProjetoAPI(idProjeto);

    // https://www.svgrepo.com
    var pdfIconPath = 'icons/extensaoarquivos/pdf.svg';
    var wordIconPath = 'icons/extensaoarquivos/doc.svg';

    //======= Funções e eventos relacionados à inserção do arquivo =======//
    $('#btnSelArquivo').on('click', function (event) {
        event.preventDefault();
        $('#fileInput').click();
    });

    $('#fileInput').on('change', function (event) {
        if (event.target.files[0]) {
            let extensao = event.target.files[0].name.split('.').pop().toLowerCase();

            if (extensao !== 'pdf' && extensao !== 'doc' && extensao !== 'docx') {
                return;
            }
        }

        handleFiles(event.target.files);
    });

    $('#dropBox').on('dragover', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragover');
    });

    $('#dropBox').on('dragleave', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragover');
    });

    $('#dropBox').on('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragover');
        const files = event.originalEvent.dataTransfer.files;

        if (files) {
            let extensao = files[0].name.split('.').pop().toLowerCase();

            if (extensao !== 'pdf' && extensao !== 'doc' && extensao !== 'docx') {
                return;
            }
        }

        $('#fileInput')[0].files = files;
        handleFiles(files);
    });

    // Função para mostrar ou ocultar o botão de cancelar
    function toggleCancelarButton(show) {
        if (show) {
            $('#btnCancelar').show();
        } else {
            $('#btnCancelar').hide();
        }
    }
    function handleFiles(files) {
        const file = files[0];
        if (file) {
            const fileName = file.name;
            const minFileName = fileName.substring(0, 25);
            const fileSize = (file.size / (1024 * 1024)).toFixed(2) + 'MB';
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                $('#file-icon').attr("src", pdfIconPath);
            } else if (fileExtension === 'doc' || fileExtension === 'docx') {
                $('#file-icon').attr("src", wordIconPath);
            }

            $('.file-name').text(minFileName + "...");
            $('.file-size').text(fileSize);
            $('#fileDetails').show();
            $('#fileDetails').css('display', 'flex');

            toggleCancelarButton(true); // Mostra o botão de cancelar
        }
    }
    //=================================================================================//

    //======= Funções e eventos relacionados ao envio das informações para a API =======//

    $('#btnEnviar').on('click', function (event) {
        event.preventDefault();
        const file = $('#fileInput')[0].files[0];
        if (file) {
            const formData = new FormData();

            formData.append('arquivo', file);
            formData.append('area', $("#campo-area-conhecimento").val());
            formData.append('nome', $('#titulo_projeto').val());
            formData.append('resumo', $('#descricao_projeto').val());
            formData.append('idProjeto', idProjeto);

            $.ajax({
                url: 'http://localhost:8080/v1/documentos/atualizar',
                type: 'PUT',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    window.location.replace("http://127.0.0.1:5501/trabalhos.html");
                    alert('Projeto atualizado com sucesso!');
                },
                error: function (xhr, status, error) {
                    alert('Erro ao atualizar o projeto.');
                    console.error(xhr, status, error);
                }
            });
        } else {
            alert('Por favor, selecione um arquivo primeiro.');
        }
    });

    //==================================================================================//
    // Cancelar upload
    $('#btnCancelar').on('click', function (event) {
        event.preventDefault();
        $('#fileInput').val('');
        $('#fileDetails').hide();
        toggleCancelarButton(false); // Oculta o botão de cancelar
    });

    // Sair da página
    $('#btnSair').on('click', function (event) {
        event.preventDefault();
        window.location.href = 'trabalhos.html';
    });
});

function consultarProjetoAPI(idProjeto) {
    $.ajax({
        url: "http://localhost:8080/v1/projetos/" + idProjeto,
        type: "GET",
        success: function (projeto) {
            $('#titulo_projeto').val(projeto.nome);
            $('#descricao_projeto').val(projeto.tema);
            $('.optionSelect').each(function(){
                if($(this).text().toUpperCase() == projeto.areaConhecimento) {
                    $('#campo-area-conhecimento').val($(this).val()).change();
                }
            })
        }, error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição AJAX:", textStatus, errorThrown);
        }
    });
}
