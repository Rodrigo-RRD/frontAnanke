import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {
  selectedFile: File | null = null;
  fileName: string = '';
  fileSize: string = '';
  fileIcon: string = '';
  tituloProjeto: string = '';
  descricaoProjeto: string = '';
  fileInfoVisible: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const extensao = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extensao)) {
        this.handleFiles(file);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('dragover');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name || '';
      const extensao = (fileName.split('.').pop() || '').toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(extensao)) {
        this.handleFiles(file);
      }
    }
  }

  handleFiles(file: File): void {
    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSize = (file.size / (1024 * 1024)).toFixed(2) + 'MB';
    const fileName = file.name || '';
    const fileExtension = (fileName.split('.').pop() || '').toLowerCase();

    if (fileExtension === 'pdf') {
      this.fileIcon = '../../../assets/img/pdf_icon.svg';
    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      this.fileIcon = '../../../assets/img/docx_icon.svg';
    }

    this.fileInfoVisible = true;
  }
}
