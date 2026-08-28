import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { FiltroLivros } from '../../components/filtro-livros/filtro-livros';
import { LivroFormulario } from '../../components/livro-formulario/livro-formulario';
import { ListaLivros } from '../../components/lista-livros/lista-livros';
import { Livro, NovoLivro, StatusLivro } from '../../models/livro';
import { LivrosService } from '../../services/livros.service';

@Component({
  selector: 'app-livros-page',
  standalone: true,
  imports: [FiltroLivros, ListaLivros, LivroFormulario],
  templateUrl: './livros-page.html',
  styleUrl: './livros-page.css',
})
export class LivrosPage implements OnInit {
  private readonly livrosService = inject(LivrosService);

  readonly pesquisa = signal('');
  readonly filtroStatus = signal<'todos' | StatusLivro>('todos');

  readonly livros = signal<Livro[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly exibindoFormulario = signal(false);
  readonly salvando = signal(false);
  readonly erroAoSalvar = signal<string | null>(null);

  readonly livrosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();
    const status = this.filtroStatus();

    return this.livros().filter((livro) => {
      const atendePesquisa =
        !termo ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo);

      const atendeStatus =
        status === 'todos' || livro.status === status;

      return atendePesquisa && atendeStatus;
    });
  });

  abrirFormulario(): void {
    this.exibindoFormulario.set(true);
  }

  fecharFormulario(): void {
    this.exibindoFormulario.set(false);
    this.erroAoSalvar.set(null);
  }

  async adicionarLivro(dados: NovoLivro): Promise<void> {
    this.salvando.set(true);
    this.erroAoSalvar.set(null);

    try {
      const novoLivro = await this.livrosService.adicionar(dados);
      this.livros.update((livros) => [...livros, novoLivro]);
      this.fecharFormulario();
    } catch {
      this.erroAoSalvar.set('Não foi possível adicionar o livro.');
    } finally {
      this.salvando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(valor: StatusLivro | 'todos'): void {
    this.filtroStatus.set(valor);
  }

  ngOnInit(): void {
    this.carregar();
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);
    try {
      const livros = await this.livrosService.listar();
      this.livros.set(livros);
    } catch (e) {
      this.erro.set('Falha ao carregar livros');
      console.error(e);
    } finally {
      this.carregando.set(false);
    }
  }
}
