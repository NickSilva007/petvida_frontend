import { FormEvent, ReactNode, useMemo, useState } from "react";
import { AccountScreen, PetShopPortal } from "./PetShopPortal";
import { Tutor } from "./petshop-api";

type IconName =
  | "home"
  | "users"
  | "paw"
  | "scissors"
  | "calendar"
  | "clock"
  | "plus"
  | "search"
  | "chevron"
  | "arrow"
  | "close"
  | "check"
  | "more"
  | "edit"
  | "logout"
  | "bell"
  | "mail"
  | "lock"
  | "phone"
  | "map"
  | "instagram"
  | "star";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    paw: <><ellipse cx="7.2" cy="8" rx="2" ry="2.7" /><ellipse cx="16.8" cy="8" rx="2" ry="2.7" /><ellipse cx="4.5" cy="13.5" rx="1.8" ry="2.4" /><ellipse cx="19.5" cy="13.5" rx="1.8" ry="2.4" /><path d="M12 12c-3 0-6 3.3-6 6 0 2 1.5 3 3.3 3 .9 0 1.8-.5 2.7-.5s1.8.5 2.7.5c1.8 0 3.3-1 3.3-3 0-2.7-3-6-6-6Z" /></>,
    scissors: <><circle cx="6" cy="7" r="3" /><circle cx="6" cy="17" r="3" /><path d="m8.6 8.5 11.4 7.5M8.6 15.5 20 8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="m5 12 14 0m-5-5 5 5-5 5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
    map: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></>,
    star: <path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6.1 20l1.1-6.5-4.7-4.6L9 8Z" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

type Page = "home" | "tutors" | "pets" | "services" | "appointments";
type Appointment = { id: number; pet: string; tutor: string; service: string; date: string; time: string; status: "Confirmado" | "Pendente" };

const initialAppointments: Appointment[] = [
  { id: 1, pet: "Bento", tutor: "Marina Costa", service: "Banho & Tosa", date: "Hoje, 12 Jun", time: "09:30", status: "Confirmado" },
  { id: 2, pet: "Mel", tutor: "Rafael Lima", service: "Consulta veterinária", date: "Hoje, 12 Jun", time: "11:00", status: "Confirmado" },
  { id: 3, pet: "Nina", tutor: "Camila Rocha", service: "Banho", date: "Hoje, 12 Jun", time: "14:30", status: "Pendente" },
  { id: 4, pet: "Theo", tutor: "Lucas Martins", service: "Tosa higiênica", date: "Amanhã, 13 Jun", time: "10:00", status: "Confirmado" },
];

const petData = [
  { name: "Bento", type: "Cão", breed: "Golden Retriever", age: "4 anos", tutor: "Marina Costa", initials: "BE", color: "gold" },
  { name: "Mel", type: "Gato", breed: "Siamês", age: "2 anos", tutor: "Rafael Lima", initials: "ME", color: "rose" },
  { name: "Nina", type: "Cão", breed: "Shih-tzu", age: "6 anos", tutor: "Camila Rocha", initials: "NI", color: "sage" },
  { name: "Theo", type: "Cão", breed: "Spitz Alemão", age: "3 anos", tutor: "Lucas Martins", initials: "TH", color: "clay" },
];

function Button({ children, variant = "primary", icon, onClick, type = "button" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName; onClick?: () => void; type?: "button" | "submit" }) {
  return <button className={`button button-${variant}`} type={type} onClick={onClick}>{icon && <Icon name={icon} size={18} />}{children}</button>;
}

function Field({ label, placeholder, type = "text", required = false, defaultValue }: { label: string; placeholder?: string; type?: string; required?: boolean; defaultValue?: string }) {
  return <label className="field"><span>{label}</span><input name={label} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} /></label>;
}

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return <label className="field"><span>{label}</span><select name={label} defaultValue={defaultValue}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function Modal({ title, subtitle, children, onClose }: { title: string; subtitle: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button></div>
        {children}
      </section>
    </div>
  );
}

function Header({ title, subtitle, onNewAppointment }: { title: string; subtitle: string; onNewAppointment: () => void }) {
  return (
    <header className="topbar">
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="top-actions">
        <button className="notification" aria-label="Notificações"><Icon name="bell" size={20} /><span /></button>
        <Button icon="plus" onClick={onNewAppointment}>Novo agendamento</Button>
      </div>
    </header>
  );
}

function Sidebar({ page, setPage, onLogout }: { page: Page; setPage: (page: Page) => void; onLogout: () => void }) {
  const links: { id: Page; label: string; icon: IconName }[] = [
    { id: "home", label: "Início", icon: "home" },
    { id: "tutors", label: "Tutores", icon: "users" },
    { id: "pets", label: "Pets", icon: "paw" },
    { id: "services", label: "Serviços", icon: "scissors" },
    { id: "appointments", label: "Agendamentos", icon: "calendar" },
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage("home")}><span className="brand-mark"><Icon name="paw" size={22} /></span><span>Casa do Bicho<small>Pet care</small></span></button>
      <nav>{links.map((link) => <button key={link.id} className={page === link.id ? "active" : ""} onClick={() => setPage(link.id)}><Icon name={link.icon} size={20} /><span>{link.label}</span></button>)}</nav>
      <div className="sidebar-footer">
        <div className="profile"><span className="avatar avatar-small">AS</span><div><strong>Ana Silva</strong><small>Administradora</small></div><button aria-label="Mais opções"><Icon name="more" /></button></div>
        <button className="logout" onClick={onLogout}><Icon name="logout" size={18} /> Sair</button>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, note, tone }: { icon: IconName; label: string; value: string; note: string; tone: string }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`}><Icon name={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>;
}

function PetAvatar({ pet, size = "" }: { pet: typeof petData[number]; size?: string }) {
  return <span className={`pet-avatar ${pet.color} ${size}`}>{pet.initials}</span>;
}

function Home({ setPage, appointments }: { setPage: (page: Page) => void; appointments: Appointment[] }) {
  return (
    <>
      <section className="welcome"><div><span className="eyebrow">QUINTA-FEIRA, 12 DE JUNHO</span><h2>Bom dia, Ana.</h2><p>A agenda está tranquila por aqui. Você tem 6 atendimentos para hoje.</p></div><div className="welcome-art"><span className="sun" /><span className="plant">⌇</span><span className="dog"><Icon name="paw" size={32} /></span></div></section>
      <section className="stats-grid">
        <StatCard icon="calendar" label="Agendamentos hoje" value="6" note="2 concluídos" tone="terracotta" />
        <StatCard icon="paw" label="Pets cadastrados" value="128" note="+8 este mês" tone="sage" />
        <StatCard icon="users" label="Tutores ativos" value="96" note="+5 este mês" tone="sand" />
        <StatCard icon="clock" label="Próximo horário" value="09:30" note="Bento · Banho & Tosa" tone="brown" />
      </section>
      <div className="home-grid">
        <section className="panel">
          <div className="panel-title"><div><h3>Próximos agendamentos</h3><p>Atendimentos programados para hoje</p></div><button className="text-button" onClick={() => setPage("appointments")}>Ver agenda <Icon name="arrow" size={16} /></button></div>
          <div className="schedule-list">{appointments.slice(0, 3).map((item) => <div className="schedule-row" key={item.id}><div className="time"><strong>{item.time}</strong><span>Hoje</span></div><span className="row-line" /><span className="mini-paw"><Icon name="paw" size={18} /></span><div className="schedule-main"><strong>{item.pet}</strong><span>{item.service} · {item.tutor}</span></div><span className={`badge ${item.status === "Confirmado" ? "confirmed" : "pending"}`}>{item.status}</span><Icon name="chevron" size={18} /></div>)}</div>
        </section>
        <section className="panel quick-panel">
          <div className="panel-title"><div><h3>Acesso rápido</h3><p>O que você deseja fazer?</p></div></div>
          <div className="quick-grid">
            <button onClick={() => setPage("tutors")}><span><Icon name="users" /></span><strong>Novo tutor</strong><small>Cadastrar cliente</small></button>
            <button onClick={() => setPage("pets")}><span><Icon name="paw" /></span><strong>Novo pet</strong><small>Vincular ao tutor</small></button>
            <button onClick={() => setPage("appointments")}><span><Icon name="calendar" /></span><strong>Ver agenda</strong><small>Todos os horários</small></button>
            <button onClick={() => setPage("services")}><span><Icon name="scissors" /></span><strong>Serviços</strong><small>Consultar catálogo</small></button>
          </div>
        </section>
      </div>
      <section className="panel recent-pets">
        <div className="panel-title"><div><h3>Pets recentes</h3><p>Últimos perfis acessados</p></div><button className="text-button" onClick={() => setPage("pets")}>Ver todos <Icon name="arrow" size={16} /></button></div>
        <div className="pet-strip">{petData.map((pet) => <button className="pet-chip" key={pet.name} onClick={() => setPage("pets")}><PetAvatar pet={pet} /><span><strong>{pet.name}</strong><small>{pet.breed} · {pet.age}</small></span><Icon name="chevron" size={17} /></button>)}</div>
      </section>
    </>
  );
}

function Tutors({ onAdd }: { onAdd: () => void }) {
  const tutors = [
    { name: "Marina Costa", phone: "(11) 98765-4321", email: "marina.costa@email.com", pets: "Bento, Amora", initials: "MC" },
    { name: "Rafael Lima", phone: "(11) 97621-8834", email: "rafael.lima@email.com", pets: "Mel", initials: "RL" },
    { name: "Camila Rocha", phone: "(11) 98814-2270", email: "camila.rocha@email.com", pets: "Nina, Pipoca", initials: "CR" },
    { name: "Lucas Martins", phone: "(11) 96931-4208", email: "lucas.m@email.com", pets: "Theo", initials: "LM" },
  ];
  return <section className="panel page-panel"><div className="page-toolbar"><div className="search"><Icon name="search" size={18} /><input placeholder="Buscar por nome, telefone ou pet..." /></div><Button icon="plus" onClick={onAdd}>Cadastrar tutor</Button></div><div className="table"><div className="table-head"><span>Tutor</span><span>Contato</span><span>Pets vinculados</span><span>Cadastro</span><span /></div>{tutors.map((t, i) => <div className="table-row" key={t.name}><span className="person"><span className="avatar">{t.initials}</span><strong>{t.name}</strong></span><span className="contact">{t.phone}<small>{t.email}</small></span><span>{t.pets}</span><span>0{3 + i}/06/2025</span><button className="icon-button"><Icon name="more" /></button></div>)}</div></section>;
}

function Pets({ onAdd, onSelect }: { onAdd: () => void; onSelect: (pet: typeof petData[number]) => void }) {
  return <><section className="page-toolbar standalone"><div className="search"><Icon name="search" size={18} /><input placeholder="Buscar pet ou tutor..." /></div><div className="filter-group"><select aria-label="Filtrar por espécie"><option>Todas as espécies</option><option>Cães</option><option>Gatos</option></select><Button icon="plus" onClick={onAdd}>Cadastrar pet</Button></div></section><section className="pet-grid">{petData.map((pet) => <article className="pet-card" key={pet.name}><button className="card-more"><Icon name="more" /></button><PetAvatar pet={pet} size="large" /><div><span className="species">{pet.type}</span><h3>{pet.name}</h3><p>{pet.breed} · {pet.age}</p></div><div className="tutor-line"><span className="avatar avatar-small">{pet.tutor.split(" ").map(n => n[0]).join("")}</span><span><small>Tutor</small><strong>{pet.tutor}</strong></span></div><Button variant="secondary" onClick={() => onSelect(pet)}>Ver informações <Icon name="arrow" size={16} /></Button></article>)}</section></>;
}

function PetDetail({ pet, onBack }: { pet: typeof petData[number]; onBack: () => void }) {
  return <><button className="back-link" onClick={onBack}>← Voltar para pets</button><div className="detail-grid"><section className="panel pet-profile"><PetAvatar pet={pet} size="xlarge" /><span className="species">{pet.type}</span><h2>{pet.name}</h2><p>{pet.breed}</p><Button variant="secondary" icon="edit">Editar dados</Button><div className="profile-data"><span><small>Porte</small><strong>Médio</strong></span><span><small>Nascimento</small><strong>18/04/2021</strong></span><span><small>Sexo</small><strong>Macho</strong></span><span><small>Peso</small><strong>24,5 kg</strong></span></div><div className="tutor-box"><small>Tutor responsável</small><strong>{pet.tutor}</strong><span>(11) 98765-4321</span></div></section><section className="panel history"><div className="panel-title"><div><h3>Histórico de atendimentos</h3><p>Serviços e cuidados realizados</p></div><Button variant="secondary" icon="plus">Adicionar registro</Button></div>{["Banho & Tosa|08 Jun 2025|Realizado por Carla", "Consulta veterinária|20 Mai 2025|Dra. Fernanda Alves", "Banho completo|02 Mai 2025|Realizado por João"].map((entry, i) => { const [title, date, by] = entry.split("|"); return <div className="history-row" key={title}><span className={`history-icon ${i === 1 ? "vet" : ""}`}><Icon name={i === 1 ? "paw" : "scissors"} /></span><div><strong>{title}</strong><p>{by}</p></div><time>{date}</time><Icon name="chevron" size={18} /></div>})}<div className="notes"><strong>Observações importantes</strong><p>Pet dócil e tranquilo durante os atendimentos. Possui sensibilidade na região das orelhas. Usar shampoo hipoalergênico.</p></div></section></div></>;
}

function Services({ onSchedule }: { onSchedule: () => void }) {
  const services = [
    ["Banho completo", "Banho com produtos premium, secagem e escovação.", "A partir de R$ 55", "60 min", "scissors"],
    ["Banho & Tosa", "Cuidado completo com banho e tosa personalizada.", "A partir de R$ 90", "90 min", "paw"],
    ["Consulta veterinária", "Avaliação clínica completa com veterinário.", "R$ 120", "45 min", "paw"],
    ["Tosa higiênica", "Cuidados essenciais para conforto e higiene.", "A partir de R$ 45", "40 min", "scissors"],
  ];
  return <section className="service-grid">{services.map(([name, desc, price, time, icon]) => <article className="service-card" key={name}><span className="service-icon"><Icon name={icon as IconName} size={24} /></span><div><h3>{name}</h3><p>{desc}</p></div><div className="service-meta"><strong>{price}</strong><span><Icon name="clock" size={16} />{time}</span></div><Button variant="secondary" onClick={onSchedule}>Consultar horários <Icon name="arrow" size={16} /></Button></article>)}</section>;
}

function Appointments({ appointments, onSchedule, onCancel, onReschedule }: { appointments: Appointment[]; onSchedule: () => void; onCancel: (id: number) => void; onReschedule: (item: Appointment) => void }) {
  return <section className="panel page-panel"><div className="page-toolbar"><div className="date-selector"><button>←</button><strong>12 de junho de 2025</strong><button>→</button></div><Button icon="plus" onClick={onSchedule}>Novo agendamento</Button></div><div className="appointment-list">{appointments.map((item) => <article className="appointment-card" key={item.id}><div className="appointment-date"><strong>{item.time}</strong><span>{item.date}</span></div><span className="appointment-icon"><Icon name="paw" /></span><div className="appointment-info"><strong>{item.pet}</strong><p>{item.service}</p><small>Tutor: {item.tutor}</small></div><span className={`badge ${item.status === "Confirmado" ? "confirmed" : "pending"}`}>{item.status}</span><div className="appointment-actions"><Button variant="ghost" onClick={() => onReschedule(item)}>Reagendar</Button><Button variant="danger" onClick={() => onCancel(item.id)}>Cancelar</Button></div></article>)}</div></section>;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<Page>("home");
  const [modal, setModal] = useState<"appointment" | "tutor" | "pet" | null>(null);
  const [selectedPet, setSelectedPet] = useState<typeof petData[number] | null>(null);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [toast, setToast] = useState("");
  const meta = useMemo(() => ({
    home: ["Visão geral", "Acompanhe a rotina da Casa do Bicho."],
    tutors: ["Tutores", "Gerencie clientes e seus pets vinculados."],
    pets: ["Pets", "Consulte perfis, informações e históricos."],
    services: ["Serviços", "Conheça todos os cuidados disponíveis."],
    appointments: ["Agendamentos", "Organize os atendimentos e horários."],
  }[page]), [page]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2600); }
  function submitAppointment(event: FormEvent) {
    event.preventDefault();
    if (rescheduling) {
      setAppointments(items => items.map(item => item.id === rescheduling.id ? { ...item, date: "18 Jun", time: "15:00", status: "Confirmado" } : item));
      notify("Agendamento atualizado com sucesso.");
    } else {
      setAppointments(items => [...items, { id: Date.now(), pet: "Bento", tutor: "Marina Costa", service: "Banho & Tosa", date: "18 Jun", time: "15:00", status: "Confirmado" }]);
      notify("Novo agendamento criado.");
    }
    setModal(null); setRescheduling(null); setPage("appointments");
  }
  function simpleSubmit(event: FormEvent, message: string) { event.preventDefault(); setModal(null); notify(message); }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={(next) => { setPage(next); setSelectedPet(null); }} onLogout={onLogout} />
      <main>
        <Header title={selectedPet ? `Perfil de ${selectedPet.name}` : meta[0]} subtitle={selectedPet ? "Informações, tutor e histórico de cuidados." : meta[1]} onNewAppointment={() => setModal("appointment")} />
        <div className="content">
          {page === "home" && <Home setPage={setPage} appointments={appointments} />}
          {page === "tutors" && <Tutors onAdd={() => setModal("tutor")} />}
          {page === "pets" && !selectedPet && <Pets onAdd={() => setModal("pet")} onSelect={setSelectedPet} />}
          {page === "pets" && selectedPet && <PetDetail pet={selectedPet} onBack={() => setSelectedPet(null)} />}
          {page === "services" && <Services onSchedule={() => setModal("appointment")} />}
          {page === "appointments" && <Appointments appointments={appointments} onSchedule={() => setModal("appointment")} onCancel={(id) => { setAppointments(items => items.filter(i => i.id !== id)); notify("Agendamento cancelado."); }} onReschedule={(item) => { setRescheduling(item); setModal("appointment"); }} />}
        </div>
      </main>
      {modal === "appointment" && <Modal title={rescheduling ? "Reagendar atendimento" : "Novo agendamento"} subtitle="Escolha o pet, serviço e melhor horário." onClose={() => { setModal(null); setRescheduling(null); }}><form onSubmit={submitAppointment}><div className="form-grid"><SelectField label="Pet" options={petData.map(p => `${p.name} · ${p.tutor}`)} defaultValue={rescheduling ? `${rescheduling.pet} · ${rescheduling.tutor}` : undefined} /><SelectField label="Serviço" options={["Banho & Tosa", "Banho completo", "Consulta veterinária", "Tosa higiênica"]} defaultValue={rescheduling?.service} /><Field label="Data" type="date" required defaultValue="2025-06-18" /><SelectField label="Horário" options={["09:00", "10:30", "13:00", "15:00", "16:30"]} defaultValue="15:00" /></div><div className="availability"><Icon name="check" size={18} /><span><strong>Horário disponível</strong> · profissional: Carla Mendes</span></div><div className="modal-actions"><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">{rescheduling ? "Confirmar novo horário" : "Criar agendamento"}</Button></div></form></Modal>}
      {modal === "tutor" && <Modal title="Cadastrar tutor" subtitle="Adicione os dados básicos do novo cliente." onClose={() => setModal(null)}><form onSubmit={(e) => simpleSubmit(e, "Tutor cadastrado com sucesso.")}><div className="form-grid"><Field label="Nome completo" placeholder="Ex.: Juliana Mendes" required /><Field label="Telefone" placeholder="(00) 00000-0000" required /><Field label="E-mail" type="email" placeholder="nome@email.com" /><Field label="CPF" placeholder="000.000.000-00" /></div><div className="modal-actions"><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Cadastrar tutor</Button></div></form></Modal>}
      {modal === "pet" && <Modal title="Cadastrar pet" subtitle="Vincule o novo pet a um tutor existente." onClose={() => setModal(null)}><form onSubmit={(e) => simpleSubmit(e, "Pet cadastrado e vinculado ao tutor.")}><div className="form-grid"><Field label="Nome do pet" placeholder="Ex.: Cacau" required /><SelectField label="Tutor" options={["Marina Costa", "Rafael Lima", "Camila Rocha", "Lucas Martins"]} /><SelectField label="Espécie" options={["Cão", "Gato", "Ave", "Outro"]} /><Field label="Raça" placeholder="Ex.: Golden Retriever" /><SelectField label="Porte" options={["Pequeno", "Médio", "Grande"]} /><Field label="Data de nascimento" type="date" /></div><div className="modal-actions"><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit">Cadastrar pet</Button></div></form></Modal>}
      {toast && <div className="toast"><span><Icon name="check" size={17} /></span>{toast}</div>}
    </div>
  );
}

const images = {
  hero: "https://images.unsplash.com/photo-1656839631462-1adf96d4320f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  dog: "https://images.unsplash.com/photo-1576033008321-bc748ab54838?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
  carla: "https://images.unsplash.com/photo-1608745250509-01665ff42018?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
  fernanda: "https://images.unsplash.com/photo-1629990941644-45c40aac3d68?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
  joao: "https://images.unsplash.com/photo-1528846104175-4fd300ee59da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=700",
};

function PublicHeader({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return <header className="public-header"><button className="public-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brand-mark"><Icon name="paw" size={21} /></span><span>Casa do Bicho<small>Pet care</small></span></button><nav className="public-nav"><a href="#sobre">Sobre nós</a><a href="#servicos">Serviços</a><a href="#equipe">Nossa equipe</a><a href="#avaliacoes">Avaliações</a><a href="#contato">Contato</a></nav><div className="public-actions"><Button variant="ghost" onClick={onLogin}>Entrar</Button><Button onClick={onRegister}>Criar conta</Button></div></header>;
}

function Landing({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const team = [
    { name: "Dra. Fernanda Alves", role: "Médica veterinária", note: "Clínica geral e cuidados preventivos", image: images.fernanda },
    { name: "Carla Mendes", role: "Especialista em estética", note: "Banho, tosa e bem-estar animal", image: images.carla },
    { name: "João Ribeiro", role: "Cuidador e groomer", note: "Comportamento e manejo gentil", image: images.joao },
  ];
  const reviews = [
    ["Marina e Bento", "O Bento sempre volta feliz e cheiroso. A equipe tem um carinho genuíno e consigo agendar tudo pelo site.", "MB"],
    ["Rafael e Mel", "A Dra. Fernanda é extremamente atenciosa. Ter todo o histórico da Mel no meu perfil facilita muito.", "RM"],
    ["Camila e Nina", "Ambiente acolhedor e serviço impecável. A possibilidade de escolher o profissional é um diferencial.", "CN"],
  ];
  return <div className="public-site">
    <PublicHeader onLogin={onLogin} onRegister={onRegister} />
    <section className="hero" id="sobre"><div className="hero-copy"><span className="landing-eyebrow"><Icon name="paw" size={15} /> CUIDADO QUE ACOLHE</span><h1>O cuidado que seu pet merece, em um só lugar.</h1><p>Banho, tosa, saúde e muito carinho em uma experiência tranquila para você e para o seu melhor amigo.</p><div className="hero-actions"><Button onClick={onRegister}>Agendar um cuidado <Icon name="arrow" size={17} /></Button><a href="#servicos">Conhecer serviços</a></div><div className="hero-trust"><div className="avatar-stack"><span>CA</span><span>JO</span><span>FE</span></div><div><span className="stars">★★★★★</span><small>Mais de 500 famílias felizes</small></div></div></div><div className="hero-image"><img src={images.hero} alt="Cachorro feliz sendo cuidado" /><div className="floating-card"><span><Icon name="check" /></span><div><strong>Cuidado sem pressa</strong><small>Atendimento com hora marcada</small></div></div></div></section>
    <section className="values-strip"><div><strong>8+</strong><span>anos cuidando</span></div><i /><div><strong>2.500</strong><span>pets atendidos</span></div><i /><div><strong>4,9</strong><span>avaliação no Google</span></div><i /><div><strong>100%</strong><span>feito com carinho</span></div></section>
    <section className="landing-section services-section" id="servicos"><div className="section-heading"><span className="landing-eyebrow">NOSSOS CUIDADOS</span><h2>Tudo para o bem-estar do seu pet</h2><p>Serviços pensados para respeitar o tempo, a personalidade e as necessidades de cada bichinho.</p></div><div className="landing-services">
      <article><span><Icon name="scissors" /></span><h3>Banho & Tosa</h3><p>Produtos suaves, manejo gentil e acabamento personalizado.</p><button onClick={onLogin}>Ver horários <Icon name="arrow" size={16} /></button></article>
      <article className="featured-service"><span><Icon name="paw" /></span><h3>Saúde & Prevenção</h3><p>Consultas cuidadosas e acompanhamento completo da saúde.</p><button onClick={onLogin}>Ver horários <Icon name="arrow" size={16} /></button></article>
      <article><span><Icon name="star" /></span><h3>Cuidados especiais</h3><p>Hidratação, higiene e serviços pensados para cada fase.</p><button onClick={onLogin}>Ver horários <Icon name="arrow" size={16} /></button></article>
    </div></section>
    <section className="care-section"><div className="care-image"><img src={images.dog} alt="Cachorro recebendo cuidado atencioso" /><span><Icon name="paw" size={28} /></span></div><div className="care-copy"><span className="landing-eyebrow">NOSSO JEITO DE CUIDAR</span><h2>Carinho também é respeitar o tempo de cada pet.</h2><p>Por aqui, nenhum atendimento é feito com pressa. Conhecemos a rotina, as preferências e o histórico do seu companheiro para criar uma experiência segura e positiva.</p><ul><li><Icon name="check" size={17} /> Manejo gentil e sem estresse</li><li><Icon name="check" size={17} /> Profissionais experientes e apaixonados</li><li><Icon name="check" size={17} /> Histórico de cuidados sempre disponível</li></ul><Button variant="secondary" onClick={onRegister}>Fazer parte da família</Button></div></section>
    <section className="landing-section team-section" id="equipe"><div className="section-heading"><span className="landing-eyebrow">QUEM CUIDA</span><h2>Profissionais de confiança</h2><p>Escolha seu profissional de preferência ao fazer um agendamento.</p></div><div className="team-grid">{team.map(member => <article key={member.name}><div><img src={member.image} alt={member.name} /><span><Icon name="paw" size={18} /></span></div><h3>{member.name}</h3><strong>{member.role}</strong><p>{member.note}</p></article>)}</div></section>
    <section className="reviews-section" id="avaliacoes"><div className="section-heading light"><span className="landing-eyebrow">HISTÓRIAS DE QUEM CONFIA</span><h2>Amor reconhece amor</h2><p>O carinho das nossas famílias é o que faz tudo valer a pena.</p></div><div className="reviews-grid">{reviews.map(([name, review, initials]) => <article key={name}><div className="review-stars">★★★★★</div><p>“{review}”</p><div><span>{initials}</span><strong>{name}</strong></div></article>)}</div></section>
    <section className="cta-section"><span><Icon name="paw" size={27} /></span><div><h2>Seu pet merece esse cuidado.</h2><p>Crie sua conta, cadastre seu companheiro e escolha o melhor horário.</p></div><Button onClick={onRegister}>Criar minha conta <Icon name="arrow" size={17} /></Button></section>
    <footer className="public-footer" id="contato"><div className="footer-main"><div className="footer-about"><div className="public-brand inverse"><span className="brand-mark"><Icon name="paw" size={21} /></span><span>Casa do Bicho<small>Pet care</small></span></div><p>Um espaço feito para cuidar de quem faz parte da sua família.</p><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a><a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="phone" /></a></div></div><div><h3>Visite a gente</h3><p className="contact-line"><Icon name="map" size={18} /> Rua das Acácias, 248<br />Vila Madalena · São Paulo, SP</p><p className="contact-line"><Icon name="clock" size={18} /> Seg a Sex, 8h às 19h<br />Sábados, 8h às 17h</p></div><div><h3>Fale com a gente</h3><p className="contact-line"><Icon name="phone" size={18} /> (11) 98765-4321</p><p className="contact-line"><Icon name="mail" size={18} /> oi@casadobicho.com.br</p><a className="google-link" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Ver perfil no Google <Icon name="arrow" size={15} /></a></div></div><div className="footer-bottom"><span>© 2025 Casa do Bicho. Feito com carinho em São Paulo.</span><span>Privacidade · Termos de uso</span></div></footer>
  </div>;
}

function AuthScreen({ mode, setMode, onBack, onAuth }: { mode: "login" | "register"; setMode: (mode: "login" | "register") => void; onBack: () => void; onAuth: (role: "client" | "admin") => void }) {
  const [teamLogin, setTeamLogin] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); onAuth(teamLogin ? "admin" : "client"); }
  return <div className="auth-page"><div className="auth-visual"><button className="public-brand inverse" onClick={onBack}><span className="brand-mark"><Icon name="paw" size={21} /></span><span>Casa do Bicho<small>Pet care</small></span></button><div><span className="landing-eyebrow">BEM-VINDO À NOSSA CASA</span><h2>Cuidar ficou ainda mais simples.</h2><p>Acompanhe a rotina do seu pet, consulte o histórico e agende novos cuidados quando quiser.</p></div><small>Foto por Yusuf Onuk · Unsplash</small></div><div className="auth-content"><button className="back-auth" onClick={onBack}>← Voltar para o site</button><form className="auth-card" onSubmit={submit}><div className="auth-heading"><span className="auth-paw"><Icon name={mode === "login" ? "lock" : "paw"} /></span><h1>{mode === "login" ? "Que bom ter você de volta" : "Crie sua conta"}</h1><p>{mode === "login" ? "Acesse sua conta para cuidar da rotina do seu pet." : "Comece agora a organizar os cuidados do seu pet."}</p></div>{mode === "register" && <Field label="Nome completo" placeholder="Como podemos chamar você?" required />}<Field label="E-mail" type="email" placeholder="seu@email.com" required />{mode === "register" && <Field label="Telefone" placeholder="(00) 00000-0000" required />}<Field label="Senha" type="password" placeholder="Mínimo de 6 caracteres" required />{mode === "login" && <div className="forgot-row"><label><input type="checkbox" /> Lembrar de mim</label><button type="button">Esqueci minha senha</button></div>}<Button type="submit">{mode === "login" ? "Entrar na minha conta" : "Criar minha conta"} <Icon name="arrow" size={16} /></Button><p className="auth-switch">{mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"} <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setTeamLogin(false); }}>{mode === "login" ? "Cadastre-se" : "Entrar"}</button></p>{mode === "login" && <div className="team-login"><span>ou</span><button type="button" onClick={() => setTeamLogin(!teamLogin)}>{teamLogin ? "Voltar para acesso do cliente" : "Acessar como equipe"}</button>{teamLogin && <small>Você está entrando no painel administrativo.</small>}</div>}</form></div></div>;
}

type ClientPage = "overview" | "myPets" | "myAgenda" | "myProfile";

function ClientPortal({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<ClientPage>("overview");
  const [showPet, setShowPet] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [toast, setToast] = useState("");
  const [bookings, setBookings] = useState([
    { service: "Banho & Tosa", pet: "Bento", pro: "Carla Mendes", date: "18 Jun · 15:00", status: "Confirmado" },
    { service: "Consulta veterinária", pet: "Amora", pro: "Dra. Fernanda", date: "27 Jun · 10:30", status: "Confirmado" },
  ]);
  const links: { id: ClientPage; label: string; icon: IconName }[] = [{ id: "overview", label: "Início", icon: "home" }, { id: "myPets", label: "Meus pets", icon: "paw" }, { id: "myAgenda", label: "Minha agenda", icon: "calendar" }, { id: "myProfile", label: "Meu perfil", icon: "users" }];
  function notify(text: string) { setToast(text); window.setTimeout(() => setToast(""), 2400); }
  function addBooking(e: FormEvent) { e.preventDefault(); setBookings(items => [...items, { service: "Banho completo", pet: "Bento", pro: "João Ribeiro", date: "02 Jul · 13:00", status: "Confirmado" }]); setShowBooking(false); setPage("myAgenda"); notify("Agendamento criado com sucesso."); }
  return <div className="client-shell"><header className="client-header"><button className="public-brand" onClick={() => setPage("overview")}><span className="brand-mark"><Icon name="paw" size={20} /></span><span>Casa do Bicho<small>Área do cliente</small></span></button><nav>{links.map(link => <button key={link.id} className={page === link.id ? "active" : ""} onClick={() => setPage(link.id)}><Icon name={link.icon} size={18} />{link.label}</button>)}</nav><div className="client-user"><div><strong>Marina Costa</strong><small>Minha conta</small></div><span className="avatar">MC</span><button onClick={onLogout} aria-label="Sair"><Icon name="logout" size={18} /></button></div></header><main className="client-main">
    {page === "overview" && <><section className="client-welcome"><div><span className="landing-eyebrow">OLÁ, MARINA</span><h1>Como estão Bento e Amora?</h1><p>Organize os próximos cuidados e acompanhe tudo sobre seus companheiros.</p><Button onClick={() => setShowBooking(true)} icon="plus">Agendar um serviço</Button></div><div className="welcome-pet"><PetAvatar pet={petData[0]} size="xlarge" /><span>Próximo cuidado</span><strong>Banho & Tosa · 18 Jun</strong></div></section><div className="client-summary"><article><span><Icon name="calendar" /></span><div><small>Próximo agendamento</small><strong>18 Jun, às 15:00</strong><p>Bento com Carla Mendes</p></div><button onClick={() => setPage("myAgenda")}><Icon name="chevron" /></button></article><article><span><Icon name="paw" /></span><div><small>Pets cadastrados</small><strong>2 companheiros</strong><p>Bento e Amora</p></div><button onClick={() => setPage("myPets")}><Icon name="chevron" /></button></article><article><span><Icon name="star" /></span><div><small>Cuidados realizados</small><strong>12 atendimentos</strong><p>Desde abril de 2023</p></div><button onClick={() => setPage("myPets")}><Icon name="chevron" /></button></article></div><section className="client-services"><div className="panel-title"><div><h3>Que cuidado vamos agendar?</h3><p>Escolha um serviço para seus companheiros</p></div></div><div>{["Banho completo", "Banho & Tosa", "Consulta veterinária"].map((service, i) => <button key={service} onClick={() => setShowBooking(true)}><span><Icon name={i === 2 ? "paw" : "scissors"} /></span><div><strong>{service}</strong><small>{i === 2 ? "A partir de R$ 120" : "A partir de R$ 55"}</small></div><Icon name="arrow" size={17} /></button>)}</div></section></>}
    {page === "myPets" && <><div className="client-page-heading"><div><span className="landing-eyebrow">MINHA FAMÍLIA</span><h1>Meus pets</h1><p>Perfis, informações e histórico de cuidados.</p></div><Button icon="plus" onClick={() => setShowPet(true)}>Cadastrar pet</Button></div><div className="owned-pets">{[petData[0], { ...petData[1], name: "Amora", tutor: "Marina Costa", initials: "AM", breed: "SRD", age: "1 ano" }].map(pet => <article key={pet.name}><PetAvatar pet={pet} size="large" /><div><span className="species">{pet.type}</span><h2>{pet.name}</h2><p>{pet.breed} · {pet.age}</p></div><div className="owned-data"><span><small>Porte</small><strong>{pet.name === "Bento" ? "Grande" : "Pequeno"}</strong></span><span><small>Último cuidado</small><strong>08 Jun 2025</strong></span></div><Button variant="secondary" onClick={() => notify(`Perfil de ${pet.name} aberto.`)}>Ver perfil e histórico</Button></article>)}</div></>}
    {page === "myAgenda" && <><div className="client-page-heading"><div><span className="landing-eyebrow">MEUS HORÁRIOS</span><h1>Minha agenda</h1><p>Consulte, reagende ou cancele os próximos cuidados.</p></div><Button icon="plus" onClick={() => setShowBooking(true)}>Novo agendamento</Button></div><div className="client-bookings">{bookings.map((booking, i) => <article key={`${booking.pet}-${booking.date}`}><div className="booking-date"><Icon name="calendar" /><span>{booking.date}</span></div><div className="booking-body"><span className="badge confirmed">{booking.status}</span><h3>{booking.service}</h3><p><strong>{booking.pet}</strong> · com {booking.pro}</p></div><div className="booking-actions"><Button variant="ghost" onClick={() => { setShowBooking(true); notify("Escolha o novo horário."); }}>Reagendar</Button><Button variant="danger" onClick={() => { setBookings(items => items.filter((_, index) => index !== i)); notify("Agendamento cancelado."); }}>Cancelar</Button></div></article>)}</div></>}
    {page === "myProfile" && <><div className="client-page-heading"><div><span className="landing-eyebrow">MINHA CONTA</span><h1>Dados do perfil</h1><p>Mantenha suas informações de contato atualizadas.</p></div></div><form className="profile-form" onSubmit={(e) => { e.preventDefault(); notify("Informações atualizadas."); }}><div className="profile-intro"><span className="avatar">MC</span><div><strong>Marina Costa</strong><small>Cliente desde abril de 2023</small></div></div><div className="form-grid"><Field label="Nome completo" defaultValue="Marina Costa" /><Field label="CPF" defaultValue="123.456.789-00" /><Field label="E-mail" type="email" defaultValue="marina.costa@email.com" /><Field label="Telefone" defaultValue="(11) 98765-4321" /><Field label="CEP" defaultValue="05435-020" /><Field label="Endereço" defaultValue="Rua Harmonia, 120" /></div><div className="modal-actions"><Button type="submit">Salvar alterações</Button></div></form></>}
  </main>
  {showBooking && <Modal title="Agendar um cuidado" subtitle="Escolha o serviço, profissional e melhor horário." onClose={() => setShowBooking(false)}><form onSubmit={addBooking}><div className="form-grid"><SelectField label="Pet" options={["Bento", "Amora"]} /><SelectField label="Serviço" options={["Banho completo", "Banho & Tosa", "Consulta veterinária", "Tosa higiênica"]} /><SelectField label="Profissional de preferência" options={["Sem preferência", "Carla Mendes", "João Ribeiro", "Dra. Fernanda Alves"]} /><Field label="Data" type="date" defaultValue="2025-07-02" /><SelectField label="Horário disponível" options={["09:00", "10:30", "13:00", "15:00", "16:30"]} /></div><div className="availability"><Icon name="check" size={18} /><span>Este horário está disponível para o profissional escolhido.</span></div><div className="modal-actions"><Button variant="ghost" onClick={() => setShowBooking(false)}>Voltar</Button><Button type="submit">Confirmar agendamento</Button></div></form></Modal>}
  {showPet && <Modal title="Cadastrar novo pet" subtitle="Conte um pouco sobre seu companheiro." onClose={() => setShowPet(false)}><form onSubmit={(e) => { e.preventDefault(); setShowPet(false); notify("Pet cadastrado com sucesso."); }}><div className="form-grid"><Field label="Nome do pet" placeholder="Ex.: Cacau" required /><SelectField label="Espécie" options={["Cão", "Gato", "Ave", "Outro"]} /><Field label="Raça" placeholder="Ex.: Golden Retriever" /><SelectField label="Porte" options={["Pequeno", "Médio", "Grande"]} /><Field label="Data de nascimento" type="date" /><SelectField label="Sexo" options={["Fêmea", "Macho"]} /></div><div className="modal-actions"><Button variant="ghost" onClick={() => setShowPet(false)}>Cancelar</Button><Button type="submit">Cadastrar pet</Button></div></form></Modal>}
  {toast && <div className="toast"><span><Icon name="check" size={17} /></span>{toast}</div>}</div>;
}

export default function App() {
  const [tutor, setTutor] = useState<Tutor | null>(() => {
    const storedTutor = sessionStorage.getItem("casa-do-bicho-tutor");
    if (!storedTutor) return null;
    try {
      return JSON.parse(storedTutor) as Tutor;
    } catch {
      sessionStorage.removeItem("casa-do-bicho-tutor");
      return null;
    }
  });
  const [view, setView] = useState<"landing" | "auth" | "client">(tutor ? "client" : "landing");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  function openAuth(mode: "login" | "register") { setAuthMode(mode); setView("auth"); window.scrollTo(0, 0); }
  function enterPortal(registeredTutor: Tutor) {
    sessionStorage.setItem("casa-do-bicho-tutor", JSON.stringify(registeredTutor));
    setTutor(registeredTutor);
    setView("client");
  }
  function logout() {
    sessionStorage.removeItem("casa-do-bicho-tutor");
    setTutor(null);
    setView("landing");
  }
  if (view === "auth") return <AccountScreen mode={authMode} onModeChange={setAuthMode} onBack={() => setView("landing")} onRegistered={enterPortal} />;
  if (view === "client" && tutor) return <PetShopPortal tutor={tutor} onTutorChange={enterPortal} onLogout={logout} />;
  return <Landing onLogin={() => openAuth("login")} onRegister={() => openAuth("register")} />;
}
