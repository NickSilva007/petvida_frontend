# Pet Vida Frontend

Frontend em React, TypeScript e Vite para o sistema de agendamentos do pet shop.

## Requisitos

- Node.js 22 ou superior
- pnpm 10 ou superior
- API PetShop em `http://localhost:5080`

## Executar localmente

```powershell
corepack pnpm install
corepack pnpm dev
```

O Vite inicia, por padrão, em `http://localhost:8443`.

Para usar outra URL da API, defina `VITE_API_BASE_URL` antes de iniciar o Vite. Por padrão, o frontend usa `http://localhost:5080`.

## Build e verificações

```powershell
corepack pnpm build
corepack pnpm exec tsc --noEmit
```

## Integração

O frontend usa os endpoints de cadastro e atualização de tutores, cadastro e consulta de pets, serviços, horários disponíveis e agendamentos da API PetShop. Para a configuração da API e do PostgreSQL via Docker Compose, consulte o README do projeto da API.

A API ainda não oferece autenticação; por isso, o cadastro abre uma sessão local no navegador. Login real e acesso de funcionários ainda não fazem parte deste fluxo.
