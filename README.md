# 🚀 Essenciar

Projeto React Native criado com [`rn-new`](https://github.com/marcoskc/rn-new), utilizando o **Expo** e uma stack moderna, escalável e pronta para produção, com suporte a testes automatizados via **Jest**.

---

## 📦 Comando de criação

```bash
npx rn-new@latest Essenciar --expo-router --tabs --nativewind --zustand --supabase --eas
🧰 Tecnologias e Dependências Utilizadas
⚛️ React Native + Expo
Expo facilita o desenvolvimento, build e deploy de apps nativos.

Suporte a atualizações OTA (eas update) e builds na nuvem com eas build.

📁 Expo Router
Sistema de rotas baseado em arquivos, similar ao Next.js.

Rotas organizadas dentro da pasta app/.

🧭 Navegação com Tabs
Estrutura pronta com navegação por abas (Bottom Tabs).

Boa base para apps com múltiplas seções.

🎨 NativeWind
Tailwind CSS adaptado para React Native.

Permite criar interfaces modernas e responsivas com classes utilitárias.

🧠 Zustand
Gerenciador de estado leve e direto.

Ideal para projetos que precisam de controle de estado sem a complexidade do Redux.

🔐 Supabase
Backend completo (Auth, DB, Storage e Realtime).

Ótimo para autenticação e gerenciamento de dados em tempo real.

🧪 Jest + Testing Library
Estrutura de testes já pronta com Jest e @testing-library/react-native.

Permite escrever testes de unidade e testes de UI simulando a interação do usuário.

☁️ EAS (Expo Application Services)
Plataforma da Expo para:

eas build: builds para produção ou testes

eas submit: envio para App Store / Play Store

eas update: atualizações OTA

📁 Estrutura de Pastas Inicial
Essenciar/
├── src/
│   ├── app/                # Rotas (expo-router)
│   │   └── (tabs)/         # Abas principais
│   ├── components/         # Componentes reutilizáveis
│   ├── lib/                # Supabase, hooks, serviços etc.
│   ├── store/              # Estados globais (Zustand)
│   ├── styles/             # Estilizações com NativeWind
│   ├── assents/            # Imagens, ícones etc.
│   ├── constants/          #Valores constantes e reutilizaveis
│   ├── screens/            # Telas customizadas
│   ├── .husky/             # Configuração do husky
│   └── __tests__/          # Testes
├── .expo/                  # Cache do Expo
├── .huskyrc/               # Configuração do husky
├── .git/                   # Repositório Git
├── .env                    # Variáveis de ambiente (ex: Supabase URL e key)
├── app.config.ts           # Configuração do Expo
├── eas.json                # Perfis de build (dev, preview, production)
├── jest.config.js          # Configuração do Jest
├── package.json            # Dependências do projeto
└── README.md               # Este documento

Adicionais:

// O projeto já vem configurado com:
prettier: formatação de código.
eslint: análise estática de código.
Jest: framework de testes.
husky: hooks git.
lint-staged: executa comandos antes de commit.
eslint-plugin-prettier: integração entre eslint e prettier.

@testing-library/react-native: para testes de componentes simulando uso real.

@testing-library/jest-native: matchers extras para React Native.
```
