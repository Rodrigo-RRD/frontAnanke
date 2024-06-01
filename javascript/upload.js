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



});
