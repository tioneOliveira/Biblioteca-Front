export type Prioridade = 'baixa' | 'media' | 'alta';
export type StatusLivro = 'disponivel' | 'emprestado' | 'extraviado' | 'danificado' | 'reservado';

export interface NovoLivro {
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  status: StatusLivro;
  descricao?: string;
  url_capa?: string;
}

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  status: StatusLivro;
  descricao?: string;
  url_capa?: string;

}
