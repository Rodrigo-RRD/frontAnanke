
$(document).ready(function () {

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
            formData.append('area', $("#campo-area-conhecimento").val());
            formData.append('nome', $('#titulo_projeto').val());
            formData.append('dataCriacao', dataFormatada);
            formData.append('resumo', $('#descricao_projeto').val());
            $.ajax({
                url: 'http://localhost:8080/v1/documentos/salvar',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    $(".modal-body").text("Salvo com sucesso.")
                    var bol = true;
                    modalAlert(bol);
                },
                error: function (xhr, status, error) {
                    var bol = false;
                    modalAlert(bol);
                    $(".modal-body").text("Verifique os campos e tente novamente.")
                }
            });
        } else {
            $('.notificacaoConfirme').modal('show');
            // alert('Por favor, selecione um arquivo primeiro.');
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
        window.location.href = 'trabalhos.html'; // Substitua 'pagina_anterior.html' pelo URL desejado.
    });
});

function modalAlert(boolean) {

    $('.notificacaoConfirme').modal('show');

    $(".confirmModalBtn").remove();
    $(".cancelModalBtn").remove();

    $(".modal-footer").append($("<button>", { class: "btn btn-primary confirmModalBtn", type: "button", text: "Ok" }));

    $('.btn-close').click(function () {
        $('.notificacaoConfirme').modal('hide'); // Oculta o modal
    });

    $('.confirmModalBtn').click(function () {
        $('.notificacaoConfirme').modal('hide'); // Oculta o modal
        if (boolean) {
            redirect(true);
        }
    });

    $('.cancelModalBtn').click(function () {
        $('.notificacaoConfirme').modal('hide'); // Oculta o modal
    });
}

function redirect(bolean) {
    if (bolean === true) {
        window.location.replace("http://127.0.0.1:5501/trabalhos.html");
    }
}
