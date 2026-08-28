import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NovoLivro, StatusLivro } from '../../models/livro';

@Component({
  selector: 'app-livro-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './livro-formulario.html',
  styleUrl: './livro-formulario.css',
})
export class LivroFormulario {
  private readonly formBuilder = inject(FormBuilder);

  readonly salvar = output<NovoLivro>();
  readonly cancelar = output<void>();

  readonly formulario = this.formBuilder.nonNullable.group({
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
    categoria: ['', Validators.required],
    ano: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
    status: ['disponivel' as StatusLivro, Validators.required],
    descricao: [''],
    url_capa: [''],
  });

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();
    this.salvar.emit({
      titulo: dados.titulo.trim(),
      autor: dados.autor.trim(),
      categoria: dados.categoria.trim(),
      ano: Number(dados.ano),
      status: dados.status,
      descricao: dados.descricao?.trim() || undefined,
      url_capa: dados.url_capa?.trim() || undefined,
    });
  }

  campoInvalido(campo: 'titulo' | 'autor' | 'categoria' | 'ano' | 'descricao'): boolean {
    const controle = this.formulario.controls[campo];
    return controle.invalid && controle.touched;
  }
}
