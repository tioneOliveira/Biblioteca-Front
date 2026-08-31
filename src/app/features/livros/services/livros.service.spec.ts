import { beforeEach, describe, expect, it } from "vitest";
import { Livro, NovoLivro, StatusLivro } from "../models/livro";

class FakeLivrosService {
  private data: Livro[] = [
    {
      id: 1,
      titulo: "Livro 1",
      autor: "Autor A",
      categoria: "Ficcao",
      ano: 2001,
      status: "disponivel",
      descricao: "D1",
    },
    {
      id: 2,
      titulo: "Livro 2",
      autor: "Autor B",
      categoria: "Historia",
      ano: 2005,
      status: "emprestado",
      descricao: "D2",
    },
    {
      id: 3,
      titulo: "Livro 3",
      autor: "Autor C",
      categoria: "Tecnico",
      ano: 2010,
      status: "disponivel",
      descricao: "D3",
    },
  ];

  async listar(): Promise<Livro[]> {
    return [...this.data];
  }

  async buscarPorId(id: number): Promise<Livro | undefined> {
    return this.data.find((d) => d.id === id);
  }

  async adicionar(livro: NovoLivro): Promise<Livro> {
    const id = this.data.length + 1;
    const novo: Livro = { id, ...livro } as Livro;
    this.data.push(novo);
    return novo;
  }

  async atualizarStatus(id: number, status: StatusLivro): Promise<Livro> {
    const item = this.data.find((d) => d.id === id)!;
    item.status = status;
    return item;
  }

  async excluir(id: number): Promise<void> {
    this.data = this.data.filter((d) => d.id !== id);
  }
}

describe("LivrosService (fake)", () => {
  let service: FakeLivrosService;
  beforeEach(() => {
    service = new FakeLivrosService();
  });

  it("deve listar os livros", async () => {
    const livros = await service.listar();
    expect(livros).toHaveLength(3);
  });

  it("deve buscar um livro por id", async () => {
    const livro = await service.buscarPorId(1);
    expect(livro?.titulo).toBe("Livro 1");
  });

  it("deve retornar undefined ao buscar id inexistente", async () => {
    const livro = await service.buscarPorId(999);
    expect(livro).toBeUndefined();
  });

  it("deve adicionar um novo livro", async () => {
    const antes = await service.listar();

    const novo: NovoLivro = {
      titulo: "Novo livro",
      autor: "Autor X",
      categoria: "Teste",
      ano: 2024,
      status: "disponivel",
      descricao: "Teste",
    };

    const criado = await service.adicionar(novo);
    expect(criado.id).toBeGreaterThan(0);

    const depois = await service.listar();
    expect(depois.length).toBe(antes.length + 1);
  });

  it("deve atualizar status do livro", async () => {
    const atualizado = await service.atualizarStatus(1, "emprestado");
    expect(atualizado.status).toBe("emprestado");
    const livro = await service.buscarPorId(1);
    expect(livro?.status).toBe("emprestado");
  });

  it("deve excluir um livro", async () => {
    const antes = await service.listar();
    await service.excluir(2);
    const depois = await service.listar();
    expect(depois.length).toBe(antes.length - 1);
    const apagado = await service.buscarPorId(2);
    expect(apagado).toBeUndefined();
  });
});
