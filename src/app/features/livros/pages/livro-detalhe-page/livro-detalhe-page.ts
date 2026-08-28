import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Livro, StatusLivro } from '../../models/livro';
import { LivrosService } from '../../services/livros.service';
@Component({
  selector: 'app-livro-detalhe-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './livro-detalhe-page.html',
  styleUrl: './livro-detalhe-page.css',
})
export class LivroDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(LivrosService);
  readonly livro = signal<Livro | undefined>(undefined);
  readonly carregando = signal(true);
  readonly erro = signal(false);
  readonly alterandoStatus = signal(false);
  readonly excluindo = signal(false);
  readonly confirmandoExclusao = signal(false);
  readonly mensagemAcao = signal<string | null>(null);
  readonly erroAcao = signal<string | null>(null);

  ngOnInit(): void {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const livro = await this.service.buscarPorId(id);
      this.livro.set(livro);
    } catch {
      this.erro.set(true);
    } finally {
      this.carregando.set(false);
    }
  }

  async alterarStatus(event: Event): Promise<void> {
    const livro = this.livro();
    const status = (event.target as HTMLSelectElement).value as StatusLivro;

    if (!livro || status === livro.status) {
      return;
    }

    this.alterandoStatus.set(true);
    this.mensagemAcao.set(null);
    this.erroAcao.set(null);

    try {
      const livroAtualizado = await this.service.atualizarStatus(livro.id, status);
      this.livro.set(livroAtualizado);
      this.mensagemAcao.set('Status atualizado com sucesso.');
    } catch {
      this.erroAcao.set('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      this.alterandoStatus.set(false);
    }
  }

  solicitarExclusao(): void {
    this.confirmandoExclusao.set(true);
    this.mensagemAcao.set(null);
    this.erroAcao.set(null);
  }

  cancelarExclusao(): void {
    this.confirmandoExclusao.set(false);
  }

  async excluirLivro(): Promise<void> {
    const livro = this.livro();
    if (!livro) {
      return;
    }

    this.excluindo.set(true);
    this.erroAcao.set(null);

    try {
      await this.service.excluir(livro.id);
      await this.router.navigate(['/livros']);
    } catch {
      this.erroAcao.set('Não foi possível excluir o livro. Tente novamente.');
      this.confirmandoExclusao.set(false);
    } finally {
      this.excluindo.set(false);
    }
  }
}
