import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  Agendamento,
  Especie,
  HorarioDisponivel,
  Pet,
  Porte,
  Servico,
  Tutor,
  petShopApi,
} from "./petshop-api";

type AuthMode = "login" | "register";

export function AccountScreen({
  mode,
  onBack,
  onRegistered,
  onModeChange,
}: {
  mode: AuthMode;
  onBack: () => void;
  onRegistered: (tutor: Tutor) => void;
  onModeChange: (mode: AuthMode) => void;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const tutor = await petShopApi.cadastrarTutor({
        nome: String(form.get("nome")),
        cpf: String(form.get("cpf")),
        telefone: String(form.get("telefone")),
        email: String(form.get("email")),
      });
      onRegistered(tutor);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível concluir o cadastro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <button className="public-brand inverse" onClick={onBack}>
          <span className="brand-mark">🐾</span>
          <span>Casa do Bicho<small>Pet care</small></span>
        </button>
        <div>
          <span className="landing-eyebrow">BEM-VINDO À NOSSA CASA</span>
          <h2>Cuidar ficou ainda mais simples.</h2>
          <p>Cadastre seus dados, seus pets e organize os próximos cuidados em um só lugar.</p>
        </div>
        <small>Casa do Bicho · Pet care</small>
      </div>
      <div className="auth-content">
        <button className="back-auth" onClick={onBack}>← Voltar para o site</button>
        {mode === "register" ? (
          <form className="auth-card" onSubmit={submit}>
            <div className="auth-heading">
              <span className="auth-paw">🐾</span>
              <h1>Cadastre-se como tutor</h1>
              <p>Use seus dados para cadastrar seus pets e agendar serviços.</p>
            </div>
            <label className="field"><span>Nome completo</span><input name="nome" autoComplete="name" required maxLength={150} /></label>
            <label className="field"><span>CPF</span><input name="cpf" placeholder="000.000.000-00" required maxLength={14} /></label>
            <label className="field"><span>Telefone</span><input name="telefone" type="tel" autoComplete="tel" required maxLength={20} /></label>
            <label className="field"><span>E-mail</span><input name="email" type="email" autoComplete="email" required maxLength={150} /></label>
            {error && <p className="api-error" role="alert">{error}</p>}
            <p className="api-session-note">A API ainda não oferece senha ou autenticação. Após o cadastro, esta sessão fica disponível somente nesta aba do navegador.</p>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Cadastrando..." : "Criar cadastro"}</button>
          </form>
        ) : (
          <div className="auth-card">
            <div className="auth-heading">
              <span className="auth-paw">🔒</span>
              <h1>Acesso à sua conta</h1>
              <p>O cadastro e o gerenciamento de serviços já podem ser usados.</p>
            </div>
            <p className="api-info" role="status">Esta versão da API ainda não possui login nem busca de tutores por e-mail. Para começar, faça um cadastro; depois poderemos integrar a autenticação.</p>
            <button className="button button-primary" onClick={() => onModeChange("register")}>
              Fazer cadastro
            </button>
            <button className="account-back-link" onClick={onBack}>Voltar para o site</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dialog({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal api-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={event => event.stopPropagation()}>
        <div className="modal-heading">
          <div><h2 id="dialog-title">{title}</h2><p>{subtitle}</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function displayDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function displayDateTime(value: string) {
  return `${displayDate(value)} às ${value.slice(11, 16)}`;
}

function localDateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function speciesLabel(species: Especie) {
  return species === "Cachorro" ? "Cão" : species;
}

function sizeLabel(size: Porte) {
  return size === "Medio" ? "Médio" : size;
}

function priceLabel(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

type BookingMode = { type: "create" } | { type: "reschedule"; appointment: Agendamento };

export function PetShopPortal({
  tutor,
  onTutorChange,
  onLogout,
}: {
  tutor: Tutor;
  onTutorChange: (tutor: Tutor) => void;
  onLogout: () => void;
}) {
  const [page, setPage] = useState<"overview" | "pets" | "agenda" | "profile">("overview");
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Servico[]>([]);
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petHistory, setPetHistory] = useState<Agendamento[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [bookingDate, setBookingDate] = useState(localDateAfter(1));
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState<HorarioDisponivel[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setLoadError("");
    try {
      const [currentTutor, currentPets, currentServices, currentAppointments] = await Promise.all([
        petShopApi.obterTutor(tutor.id),
        petShopApi.listarPets(tutor.id),
        petShopApi.listarServicos(),
        petShopApi.proximosAgendamentos(tutor.id),
      ]);
      onTutorChange(currentTutor);
      setPets(currentPets);
      setServices(currentServices);
      setAppointments(currentAppointments);
    } catch (reason) {
      setLoadError(reason instanceof Error ? reason.message : "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [tutor.id]);

  useEffect(() => {
    if (!selectedPet) return;
    let active = true;
    setHistoryLoading(true);
    setHistoryError("");
    Promise.all([petShopApi.obterPet(selectedPet.id), petShopApi.historicoPet(selectedPet.id)])
      .then(([pet, history]) => {
        if (active) {
          setSelectedPet(pet);
          setPetHistory(history);
        }
      })
      .catch(reason => {
        if (active) setHistoryError(reason instanceof Error ? reason.message : "Não foi possível carregar o histórico.");
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });
    return () => { active = false; };
  }, [selectedPet?.id]);

  useEffect(() => {
    if (!bookingMode || !bookingDate) return;
    let active = true;
    setSlotsLoading(true);
    setSlotsError("");
    setSlots([]);
    setSelectedSlot("");
    petShopApi.horariosDisponiveis(bookingDate)
      .then(result => {
        if (active) setSlots(result);
      })
      .catch(reason => {
        if (active) setSlotsError(reason instanceof Error ? reason.message : "Não foi possível consultar os horários.");
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });
    return () => { active = false; };
  }, [bookingMode, bookingDate]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function openBooking(mode: BookingMode) {
    setFormError("");
    setBookingDate(localDateAfter(1));
    setSelectedSlot("");
    setSelectedPetId(mode.type === "create" ? String(pets[0]?.id ?? "") : String(mode.appointment.petId));
    setSelectedServiceId(mode.type === "create" ? String(services[0]?.id ?? "") : String(mode.appointment.servicoId));
    setBookingMode(mode);
  }

  async function submitPet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const form = new FormData(event.currentTarget);
    try {
      await petShopApi.cadastrarPet(tutor.id, {
        nome: String(form.get("nome")),
        especie: String(form.get("especie")) as Especie,
        raca: String(form.get("raca")),
        porte: String(form.get("porte")) as Porte,
        dataNascimento: String(form.get("dataNascimento")) || null,
      });
      setPetDialogOpen(false);
      await loadData();
      notify("Pet cadastrado com sucesso.");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Não foi possível cadastrar o pet.");
    } finally {
      setSaving(false);
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      setFormError("Selecione um horário disponível.");
      return;
    }
    setSaving(true);
    setFormError("");
    const dataHora = `${bookingDate}T${selectedSlot}:00`;
    try {
      if (bookingMode?.type === "reschedule") {
        await petShopApi.reagendar(bookingMode.appointment.id, dataHora);
      } else {
        await petShopApi.criarAgendamento({
          petId: Number(selectedPetId),
          servicoId: Number(selectedServiceId),
          dataHora,
        });
      }
      setBookingMode(null);
      setPage("agenda");
      await loadData();
      notify(bookingMode?.type === "reschedule" ? "Agendamento reagendado." : "Agendamento criado com sucesso.");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Não foi possível salvar o agendamento.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelBooking(appointment: Agendamento) {
    if (!window.confirm(`Deseja cancelar o agendamento de ${appointment.petNome} em ${displayDateTime(appointment.dataHora)}?`)) return;
    try {
      await petShopApi.cancelarAgendamento(appointment.id);
      await loadData();
      notify("Agendamento cancelado.");
    } catch (reason) {
      notify(reason instanceof Error ? reason.message : "Não foi possível cancelar o agendamento.");
    }
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const form = new FormData(event.currentTarget);
    try {
      const updatedTutor = await petShopApi.atualizarTutor(tutor.id, {
        nome: String(form.get("nome")),
        telefone: String(form.get("telefone")),
        email: String(form.get("email")),
      });
      onTutorChange(updatedTutor);
      notify("Dados atualizados com sucesso.");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Não foi possível atualizar os dados.");
    } finally {
      setSaving(false);
    }
  }

  const pageTitles = {
    overview: ["Início", "Acompanhe os cuidados dos seus pets."],
    pets: ["Meus pets", "Perfis e histórico de cuidados."],
    agenda: ["Minha agenda", "Consulte e gerencie seus agendamentos."],
    profile: ["Meu perfil", "Mantenha seus dados de contato atualizados."],
  } as const;

  return (
    <div className="client-shell">
      <header className="client-header">
        <button className="public-brand" onClick={() => { setPage("overview"); setSelectedPet(null); }}>
          <span className="brand-mark">🐾</span><span>Casa do Bicho<small>Área do cliente</small></span>
        </button>
        <nav>
          {([
            ["overview", "Início"],
            ["pets", "Meus pets"],
            ["agenda", "Minha agenda"],
            ["profile", "Meu perfil"],
          ] as const).map(([id, label]) => (
            <button key={id} className={page === id && !selectedPet ? "active" : ""} onClick={() => { setPage(id); setSelectedPet(null); }}>
              {label}
            </button>
          ))}
        </nav>
        <div className="client-user">
          <div><strong>{tutor.nome}</strong><small>Sessão local</small></div>
          <button onClick={onLogout} aria-label="Sair">Sair</button>
        </div>
      </header>

      <main className="client-main">
        {selectedPet ? (
          <section className="api-page-section">
            <div className="client-page-heading">
              <div><span className="landing-eyebrow">PERFIL DO PET</span><h1>{selectedPet.nome}</h1><p>{speciesLabel(selectedPet.especie)} · {selectedPet.raca}</p></div>
              <button className="button button-secondary" onClick={() => setSelectedPet(null)}>Voltar para meus pets</button>
            </div>
            <div className="profile-form">
              <h2>Informações</h2>
              <p>Espécie: {speciesLabel(selectedPet.especie)} · Porte: {sizeLabel(selectedPet.porte)}</p>
              <p>Data de nascimento: {selectedPet.dataNascimento ? displayDate(selectedPet.dataNascimento) : "Não informada"}</p>
              <h2>Histórico de atendimentos</h2>
              {historyLoading ? <p>Carregando histórico...</p> : historyError ? <p className="api-error" role="alert">{historyError}</p> : petHistory.length === 0 ? <p>Este pet ainda não possui atendimentos concluídos ou cancelados.</p> : (
                <div className="api-list">
                  {petHistory.map(item => <article key={item.id}>
                    <strong>{item.servicoNome}</strong>
                    <span>{displayDateTime(item.dataHora)} · {item.status === "Concluido" ? "Concluído" : "Cancelado"}</span>
                  </article>)}
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <div className="api-page-heading">
              <div><span className="landing-eyebrow">CASA DO BICHO</span><h1>{pageTitles[page][0]}</h1><p>{pageTitles[page][1]}</p></div>
              {page === "pets" && <button className="button button-primary" onClick={() => { setFormError(""); setPetDialogOpen(true); }}>Cadastrar pet</button>}
              {page === "agenda" && <button className="button button-primary" disabled={pets.length === 0 || services.length === 0} onClick={() => openBooking({ type: "create" })}>Novo agendamento</button>}
            </div>

            {loading ? <div className="profile-form">Carregando seus dados...</div> : loadError ? (
              <div className="profile-form"><p className="api-error" role="alert">{loadError}</p><button className="button button-secondary" onClick={() => void loadData()}>Tentar novamente</button></div>
            ) : (
              <>
                {page === "overview" && (
                  <>
                    <section className="client-welcome">
                      <div><span className="landing-eyebrow">OLÁ, {tutor.nome.split(" ")[0].toLocaleUpperCase("pt-BR")}</span><h1>Cuidados com carinho, em um só lugar.</h1><p>Cadastre seus companheiros e marque o próximo cuidado.</p><button className="button button-primary" disabled={pets.length === 0 || services.length === 0} onClick={() => openBooking({ type: "create" })}>Agendar um serviço</button></div>
                      <div className="welcome-pet"><span>Seus companheiros</span><strong>{pets.length} {pets.length === 1 ? "pet cadastrado" : "pets cadastrados"}</strong></div>
                    </section>
                    <div className="client-summary">
                      <article><span>🐾</span><div><small>Pets cadastrados</small><strong>{pets.length}</strong><p>Na sua família</p></div><button onClick={() => setPage("pets")}>›</button></article>
                      <article><span>◷</span><div><small>Próximos cuidados</small><strong>{appointments.length}</strong><p>Agendamentos ativos</p></div><button onClick={() => setPage("agenda")}>›</button></article>
                      <article><span>✂</span><div><small>Serviços disponíveis</small><strong>{services.length}</strong><p>Escolha seu próximo cuidado</p></div><button onClick={() => openBooking({ type: "create" })}>›</button></article>
                    </div>
                    <section className="profile-form">
                      <h2>Serviços disponíveis</h2>
                      {services.length === 0 ? <p>Nenhum serviço está disponível no momento.</p> : <div className="api-service-grid">{services.map(service => (
                        <article key={service.id}><h3>{service.nome}</h3><p>{service.descricao}</p><strong>{priceLabel(service.preco)}</strong><small>{service.duracaoMinutos} min · duração informativa</small></article>
                      ))}</div>}
                    </section>
                    {appointments.length > 0 && <section className="profile-form"><h2>Próximo agendamento</h2><p><strong>{appointments[0].servicoNome}</strong> · {appointments[0].petNome} · {displayDateTime(appointments[0].dataHora)}</p><button className="account-back-link" onClick={() => setPage("agenda")}>Ver minha agenda</button></section>}
                  </>
                )}

                {page === "pets" && (
                  pets.length === 0 ? <section className="profile-form"><h2>Você ainda não cadastrou pets</h2><p>Cadastre um pet para poder agendar serviços.</p><button className="button button-primary" onClick={() => setPetDialogOpen(true)}>Cadastrar primeiro pet</button></section> :
                  <div className="owned-pets">{pets.map(pet => (
                    <article key={pet.id}>
                      <div><span className="species">{speciesLabel(pet.especie)}</span><h2>{pet.nome}</h2><p>{pet.raca}</p></div>
                      <div className="owned-data"><span><small>Porte</small><strong>{sizeLabel(pet.porte)}</strong></span><span><small>Nascimento</small><strong>{pet.dataNascimento ? displayDate(pet.dataNascimento) : "—"}</strong></span></div>
                      <button className="button button-secondary" onClick={() => { setPetHistory([]); setHistoryError(""); setSelectedPet(pet); }}>Ver perfil e histórico</button>
                    </article>
                  ))}</div>
                )}

                {page === "agenda" && (
                  pets.length === 0 ? <section className="profile-form"><p>Cadastre um pet antes de agendar um serviço.</p><button className="button button-primary" onClick={() => { setPage("pets"); setPetDialogOpen(true); }}>Cadastrar pet</button></section> :
                  appointments.length === 0 ? <section className="profile-form"><h2>Nenhum agendamento próximo</h2><p>Quando você marcar um serviço, ele aparecerá aqui.</p><button className="button button-primary" onClick={() => openBooking({ type: "create" })}>Agendar um serviço</button></section> :
                  <div className="client-bookings">{appointments.map(appointment => (
                    <article key={appointment.id}>
                      <div className="booking-date"><span>{displayDateTime(appointment.dataHora)}</span></div>
                      <div className="booking-body"><span className="badge confirmed">Agendado</span><h3>{appointment.servicoNome}</h3><p><strong>{appointment.petNome}</strong></p></div>
                      <div className="booking-actions">
                        <button className="button button-ghost" onClick={() => openBooking({ type: "reschedule", appointment })}>Reagendar</button>
                        <button className="button button-danger" onClick={() => void cancelBooking(appointment)}>Cancelar</button>
                      </div>
                    </article>
                  ))}</div>
                )}

                {page === "profile" && (
                  <form className="profile-form" onSubmit={submitProfile}>
                    <div className="form-grid">
                      <label className="field"><span>Nome completo</span><input name="nome" defaultValue={tutor.nome} required maxLength={150} /></label>
                      <label className="field"><span>CPF (não editável)</span><input value={tutor.cpf} readOnly /></label>
                      <label className="field"><span>E-mail</span><input name="email" type="email" defaultValue={tutor.email} required maxLength={150} /></label>
                      <label className="field"><span>Telefone</span><input name="telefone" type="tel" defaultValue={tutor.telefone} required maxLength={20} /></label>
                    </div>
                    {formError && <p className="api-error" role="alert">{formError}</p>}
                    <div className="modal-actions"><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button></div>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </main>

      {petDialogOpen && <Dialog title="Cadastrar pet" subtitle="Informe os dados do seu companheiro." onClose={() => setPetDialogOpen(false)}>
        <form onSubmit={submitPet}>
          <div className="form-grid">
            <label className="field"><span>Nome do pet</span><input name="nome" required maxLength={100} /></label>
            <label className="field"><span>Espécie</span><select name="especie" defaultValue="Cachorro"><option value="Cachorro">Cão</option><option value="Gato">Gato</option><option value="Outro">Outro</option></select></label>
            <label className="field"><span>Raça</span><input name="raca" required maxLength={100} /></label>
            <label className="field"><span>Porte</span><select name="porte" defaultValue="Medio"><option value="Pequeno">Pequeno</option><option value="Medio">Médio</option><option value="Grande">Grande</option></select></label>
            <label className="field"><span>Data de nascimento (opcional)</span><input name="dataNascimento" type="date" max={localDateAfter(0)} /></label>
          </div>
          {formError && <p className="api-error" role="alert">{formError}</p>}
          <div className="modal-actions"><button className="button button-ghost" type="button" onClick={() => setPetDialogOpen(false)}>Cancelar</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Cadastrar pet"}</button></div>
        </form>
      </Dialog>}

      {bookingMode && <Dialog title={bookingMode.type === "reschedule" ? "Reagendar atendimento" : "Agendar um cuidado"} subtitle="Consulte os horários disponíveis para a data escolhida." onClose={() => setBookingMode(null)}>
        <form onSubmit={submitBooking}>
          {bookingMode.type === "create" ? <div className="form-grid">
            <label className="field"><span>Pet</span><select value={selectedPetId} onChange={event => setSelectedPetId(event.target.value)} required>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.nome}</option>)}</select></label>
            <label className="field"><span>Serviço</span><select value={selectedServiceId} onChange={event => setSelectedServiceId(event.target.value)} required>{services.map(service => <option key={service.id} value={service.id}>{service.nome} · {priceLabel(service.preco)}</option>)}</select></label>
          </div> : <p><strong>{bookingMode.appointment.servicoNome}</strong> · {bookingMode.appointment.petNome}</p>}
          <div className="form-grid api-slot-form">
            <label className="field"><span>Data</span><input type="date" value={bookingDate} min={localDateAfter(0)} required onChange={event => setBookingDate(event.target.value)} /></label>
            <label className="field"><span>Horário disponível</span><select value={selectedSlot} onChange={event => setSelectedSlot(event.target.value)} required disabled={slotsLoading || slots.length === 0}><option value="">{slotsLoading ? "Consultando..." : "Selecione um horário"}</option>{slots.map(slot => <option key={slot.inicio} value={slot.inicio.slice(11, 16)}>{slot.inicio.slice(11, 16)}</option>)}</select></label>
          </div>
          {slotsError && <p className="api-error" role="alert">{slotsError}</p>}
          {!slotsLoading && !slotsError && slots.length === 0 && <p className="api-info">Não há horários disponíveis nesta data. Escolha outro dia.</p>}
          {formError && <p className="api-error" role="alert">{formError}</p>}
          <div className="modal-actions"><button className="button button-ghost" type="button" onClick={() => setBookingMode(null)}>Cancelar</button><button className="button button-primary" type="submit" disabled={saving || slotsLoading || !selectedSlot}>{saving ? "Salvando..." : bookingMode.type === "reschedule" ? "Confirmar novo horário" : "Confirmar agendamento"}</button></div>
        </form>
      </Dialog>}

      {toast && <div className="toast api-toast" role="status">{toast}</div>}
    </div>
  );
}
