$(document).ready(function() {

//======= Funções e eventos relacionados à inserção do arquivo =======//
    $('#btnSelArquivo').on('click', function(event) {
        event.preventDefault();
        $('#fileInput').click();
    });

    $('#fileInput').on('change', function(event) {
        if(event.target.files[0]){
            let extensao = event.target.files[0].name.split('.').pop().toLowerCase();

            if(extensao !== 'pdf' && extensao !== 'doc' && extensao !== 'docx'){
                return;
            }
        }

        handleFiles(event.target.files);
    });

    $('#dropBox').on('dragover', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragover');
    });

    $('#dropBox').on('dragleave', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragover');
    });

    $('#dropBox').on('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragover');
        const files = event.originalEvent.dataTransfer.files;

        if(files){
            let extensao = files[0].name.split('.').pop().toLowerCase();

            if(extensao !== 'pdf' && extensao !== 'doc' && extensao !== 'docx'){
                return;
            }
        }

        $('#fileInput')[0].files = files;
        handleFiles(files);
    });

    function handleFiles(files) {
        const file = files[0];
        if (file) {
            const fileName = file.name;
            const fileSize = (file.size / (1024 * 1024)).toFixed(2) + 'MB';
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                $('#file-icon').attr("src","/img/pdf_icon.svg");
            } else if (fileExtension === 'doc' || fileExtension === 'docx') {
                $('#file-icon').attr("src","/img/docx_icon.svg");
            }

            $('.file-name').text(fileName);
            $('.file-size').text(fileSize);
            $('#fileDetails').show();
            $('#fileDetails').css('display', 'flex');;
        }
    }
//=================================================================================//

//======= Funções e eventos relacionados ao envio das informações para a API =======//

$('#btnEnviar').on('click', function(event) {
    event.preventDefault();
    const file = $('#fileInput')[0].files[0];
    if (file) {
        const formData = new FormData();

        // Formatar a data no formato dd/MM/yyyy HH:mm:ss
        const now = new Date();
        const dataFormatada = now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(',', '');

        formData.append('arquivo', file);
        formData.append('nome', $('#titulo_projeto').val());
        formData.append('dataCriacao', dataFormatada);
        formData.append('resumo', $('#descricao_projeto').val());

        $.ajax({
            url: 'http://localhost:8080/v1/documentos/salvar2',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('Arquivo enviado com sucesso!');

                // Redirecionando
                window.location.replace("http://localhost:8080/v1/documentos");
            },
            error: function(xhr, status, error) {
                alert('Erro ao enviar o arquivo.');
                console.error(xhr, status, error);
            }
        });
    } else {
        alert('Por favor, selecione um arquivo primeiro.');
    }
});

//==================================================================================//
});
