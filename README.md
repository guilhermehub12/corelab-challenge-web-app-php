# CoreTasks (CoreLab Frontend) - Documentação

## Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos](#requisitos)
3. [Instalação](#instalação)
4. [Arquitetura](#arquitetura)
5. [Como Usar](#como-usar)
6. [Solução de Problemas](#solução-de-problemas)
7. [Melhorias Futuras](#melhorias-futuras)

## Visão Geral

CoreTasks é uma aplicação web moderna para gerenciamento de tarefas, permitindo que usuários organizem suas atividades com recursos de categorização por cores e favoritos. O sistema foi desenvolvido usando Next.js (React) com TypeScript, oferecendo uma interface responsiva e intuitiva.

**Principais Funcionalidades:**
- Criar, editar e excluir tarefas
- Organizar tarefas com sistema de cores
- Marcar tarefas como favoritas
- Pesquisar e filtrar tarefas
- Autenticação de usuários
- Interface adaptável para dispositivos móveis e desktop

## Requisitos

Para instalar e executar o CoreTasks, você precisará:

- **Node.js** (versão 20.x ou superior)
- **npm** (versão 8.x ou superior) ou **yarn** (versão 1.22.x ou superior)
- **Conexão com internet** (para instalar dependências)
- **API CoreTasks** funcionando (backend)

## Instalação

Siga este passo a passo para instalar e executar o CoreTasks Frontend:

### 1. Clonar o Repositório

Abra o terminal ou prompt de comando e execute:

```bash
git clone https://github.com/guilhermehub12/corelab-challenge-web-app-php.git
cd corelab-challenge-web-app-php
```

### 2. Instalar Dependências

```bash
npm install
# OU, se preferir usar yarn
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TOKEN=seu_token_api_aqui
```

> **Nota:** Substitua `seu_token_api_aqui` pelo token fornecido na configuração do backend.

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# OU
yarn dev
```

### 5. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## Arquitetura

O CoreTasks segue uma arquitetura moderna e organizada:

### Estrutura de Pastas

```
corelab-challenge-web-app-php/
├── public/           # Arquivos estáticos
├── src/              # Código fonte
│   ├── app/          # Páginas do Next.js (App Router)
│   ├── components/   # Componentes React reutilizáveis
│   ├── context/      # Gerenciamento de estado global
│   ├── hooks/        # Hooks personalizados
│   ├── lib/          # Bibliotecas e configurações
│   ├── services/     # Comunicação com a API
│   ├── styles/       # Estilos (SCSS)
│   ├── types/        # Tipos TypeScript
│   └── utils/        # Funções utilitárias
└── ...               # Arquivos de configuração
```

### Tecnologias Principais

- **Next.js**: Framework React para renderização do lado do servidor (SSR)
- **TypeScript**: Tipagem estática para JavaScript
- **SCSS Modules**: Estilos com escopo local
- **Axios**: Cliente HTTP para comunicação com a API
- **Context API**: Gerenciamento de estado global

## Como Usar

### 1. Autenticação

- Ao acessar o sistema, você será redirecionado para a tela de login
- Para criar uma conta, clique em "Não tem uma conta? Registre-se"
- Preencha o formulário de registro com seus dados
- Após login/registro bem-sucedido, você será redirecionado para a página principal

### 2. Gerenciamento de Tarefas

#### Criar uma Nova Tarefa
1. Clique no botão "Nova Tarefa"
2. Preencha o título e o conteúdo
3. Selecione uma cor (opcional)
4. Clique em "Criar"

#### Editar uma Tarefa
1. Clique no botão de menu (três pontos) da tarefa
2. Selecione "Editar"
3. Modifique os campos desejados
4. Clique em "Atualizar"

#### Excluir uma Tarefa
1. Clique no botão de menu (três pontos) da tarefa
2. Selecione "Excluir"
3. Confirme a exclusão

#### Marcar como Favorito
- Clique no ícone de estrela na tarefa para marcar/desmarcar como favorito

### 3. Filtros e Busca

- Use a barra de pesquisa no topo para encontrar tarefas específicas
- Acesse "Favoritas" no menu lateral para ver apenas tarefas favoritas
- Use o filtro de cores para visualizar tarefas por categoria de cor

## Melhorias Futuras

O CoreTasks está em constante evolução. Algumas melhorias planejadas incluem:

3. **Notificações**: Alertas para tarefas com prazo próximo
4. **Calendário Integrado**: Visualização de tarefas em formato de calendário
5. **Tags Customizáveis**: Adicionar sistema de etiquetas para melhor organização
6. **Compartilhamento de Tarefas**: Colaboração em tempo real

---

## Suporte

Para relatar problemas ou sugerir melhorias:
- Abra um issue no GitHub: [github.com/guilhermehub12/corelab-challenge-web-app-php/issues](https://github.com/guilhermehub12/corelab-challenge-web-app-php/issues)

---

Feita com 💓 por [Guilherme Delmiro](https://github.com/guilhermehub12) © CoreTasks