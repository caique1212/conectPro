const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type TipoUsuario = "CLIENTE" | "PRESTADOR" | "ADMIN";
export type StatusSolicitacao = "PENDENTE" | "ACEITO" | "RECUSADO" | "FINALIZADO";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
};

export type Prestador = {
  id: number;
  categoria: string;
  descricao: string;
  cidade: string;
  telefone: string;
  aprovado: boolean;
  nivel: string;
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  mediaAvaliacoes: number;
  quantidadeAvaliacoes: number;
};

export type Solicitacao = {
  id: number;
  descricaoServico: string;
  dataSolicitacao: string;
  status: StatusSolicitacao;
  clienteId: number;
  clienteNome: string;
  prestadorId: number;
  prestadorNome: string;
  prestadorCategoria: string;
};

export type Avaliacao = {
  id: number;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
  clienteId: number;
  clienteNome: string;
  prestadorId: number;
  prestadorNome: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  criarUsuario: (data: { nome: string; email: string; senha: string; tipoUsuario: TipoUsuario }) =>
    request<Usuario>("/usuarios", { method: "POST", body: JSON.stringify(data) }),
  login: (email: string, senha: string) =>
    request<Usuario>("/usuarios/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
  listarUsuarios: () => request<Usuario[]>("/usuarios"),
  atualizarUsuario: (id: string, data: { nome: string; email: string; senha: string; tipoUsuario: TipoUsuario }) =>
    request<Usuario>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletarUsuario: (id: string) => request<void>(`/usuarios/${id}`, { method: "DELETE" }),

  criarPrestador: (data: {
    categoria: string;
    descricao: string;
    cidade: string;
    telefone: string;
    usuarioId: number;
  }) => request<Prestador>("/prestadores", { method: "POST", body: JSON.stringify(data) }),
  listarPrestadores: () => request<Prestador[]>("/prestadores"),
  listarTodosPrestadores: () => request<Prestador[]>("/prestadores/todos"),
  listarPendentes: () => request<Prestador[]>("/prestadores/pendentes"),
  buscarPrestadores: (categoria: string, cidade: string) => {
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (cidade) params.set("cidade", cidade);
    return request<Prestador[]>(`/prestadores/buscar?${params.toString()}`);
  },
  buscarPrestador: (id: string) => request<Prestador>(`/prestadores/${id}`),
  atualizarPrestador: (id: string, data: {
    categoria: string;
    descricao: string;
    cidade: string;
    telefone: string;
    usuarioId: number;
  }) => request<Prestador>(`/prestadores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  aprovarPrestador: (id: number) => request<Prestador>(`/prestadores/${id}/aprovar`, { method: "PUT" }),
  reprovarPrestador: (id: number) => request<Prestador>(`/prestadores/${id}/reprovar`, { method: "PUT" }),
  deletarPrestador: (id: string) => request<void>(`/prestadores/${id}`, { method: "DELETE" }),

  criarSolicitacao: (clienteId: string, prestadorId: string, descricaoServico: string) =>
    request<Solicitacao>(`/solicitacoes?clienteId=${clienteId}&prestadorId=${prestadorId}`, {
      method: "POST",
      body: JSON.stringify({ descricaoServico }),
    }),
  listarSolicitacoes: () => request<Solicitacao[]>("/solicitacoes"),
  listarSolicitacoesCliente: (clienteId: string) => request<Solicitacao[]>(`/solicitacoes/cliente/${clienteId}`),
  listarSolicitacoesPrestador: (prestadorId: string) => request<Solicitacao[]>(`/solicitacoes/prestador/${prestadorId}`),
  deletarSolicitacao: (id: number) => request<void>(`/solicitacoes/${id}`, { method: "DELETE" }),
  alterarStatus: (id: number, status: StatusSolicitacao) =>
    request<Solicitacao>(`/solicitacoes/${id}/status?status=${status}`, { method: "PUT" }),

  criarAvaliacao: (clienteId: string, prestadorId: string, nota: number, comentario: string) =>
    request<Avaliacao>(`/avaliacoes?clienteId=${clienteId}&prestadorId=${prestadorId}`, {
      method: "POST",
      body: JSON.stringify({ nota, comentario }),
    }),
  criarAvaliacaoPorSolicitacao: (solicitacaoId: number, nota: number, comentario: string) =>
    request<Avaliacao>(`/avaliacoes/solicitacao/${solicitacaoId}`, {
      method: "POST",
      body: JSON.stringify({ nota, comentario }),
    }),
  listarAvaliacoes: () => request<Avaliacao[]>("/avaliacoes"),
  listarAvaliacoesPrestador: (prestadorId: string) => request<Avaliacao[]>(`/avaliacoes/prestador/${prestadorId}`),
  deletarAvaliacao: (id: number) => request<void>(`/avaliacoes/${id}`, { method: "DELETE" }),
};
