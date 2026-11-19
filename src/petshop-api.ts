export type Tutor = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

export type Especie = "Cachorro" | "Gato" | "Outro";
export type Porte = "Pequeno" | "Medio" | "Grande";

export type Pet = {
  id: number;
  tutorId: number;
  nome: string;
  especie: Especie;
  raca: string;
  porte: Porte;
  dataNascimento: string | null;
};

export type Servico = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
};

export type HorarioDisponivel = {
  inicio: string;
  fim: string;
};

export type Agendamento = {
  id: number;
  petId: number;
  petNome: string;
  servicoId: number;
  servicoNome: string;
  dataHora: string;
  status: "Agendado" | "Cancelado" | "Concluido";
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5080").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${apiBaseUrl}. Confira se a API e o banco estão em execução.`);
  }

  const responseText = await response.text();
  let data: unknown;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    if (typeof data === "object" && data !== null) {
      const problem = data as ProblemDetails;
      const validationErrors = problem.errors
        ? Object.values(problem.errors).flat().join(" ")
        : "";
      throw new Error(problem.detail || validationErrors || problem.title || `A API respondeu com o status ${response.status}.`);
    }
    throw new Error(typeof data === "string" && data ? data : `A API respondeu com o status ${response.status}.`);
  }

  return data as T;
}

function jsonBody(value: unknown): RequestInit {
  return { method: "POST", body: JSON.stringify(value) };
}

export const petShopApi = {
  cadastrarTutor: (tutor: Omit<Tutor, "id">) =>
    request<Tutor>("/tutores", jsonBody(tutor)),

  obterTutor: (id: number) => request<Tutor>(`/tutores/${id}`),

  atualizarTutor: (id: number, tutor: Pick<Tutor, "nome" | "telefone" | "email">) =>
    request<Tutor>(`/tutores/${id}`, { method: "PUT", body: JSON.stringify(tutor) }),

  listarPets: (tutorId: number) => request<Pet[]>(`/tutores/${tutorId}/pets`),

  cadastrarPet: (tutorId: number, pet: Omit<Pet, "id" | "tutorId">) =>
    request<Pet>(`/tutores/${tutorId}/pets`, jsonBody(pet)),

  obterPet: (id: number) => request<Pet>(`/pets/${id}`),

  historicoPet: (id: number) => request<Agendamento[]>(`/pets/${id}/historico`),

  listarServicos: () => request<Servico[]>("/servicos"),

  horariosDisponiveis: (data: string) =>
    request<HorarioDisponivel[]>(`/horarios-disponiveis?data=${encodeURIComponent(data)}`),

  proximosAgendamentos: (tutorId: number) =>
    request<Agendamento[]>(`/agendamentos/proximos?tutorId=${tutorId}`),

  criarAgendamento: (agendamento: { petId: number; servicoId: number; dataHora: string }) =>
    request<Agendamento>("/agendamentos", jsonBody(agendamento)),

  cancelarAgendamento: (id: number) =>
    request<Agendamento>(`/agendamentos/${id}/cancelar`, { method: "PATCH" }),

  reagendar: (id: number, novaDataHora: string) =>
    request<Agendamento>(`/agendamentos/${id}/reagendar`, {
      method: "PATCH",
      body: JSON.stringify({ novaDataHora }),
    }),
};
