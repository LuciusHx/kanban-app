# Kanban de Atividades (Angular)
Desafio Frontend: Desenvolvimento de uma aplicação inspirada no Trello para gerenciamento de atividades, focada em organização de código, gerenciamento de estado moderno e deploy em nuvem.

## Visão Geral
Este projeto consiste em um quadro Kanban desenvolvido em Angular. O objetivo principal é demonstrar competências avançadas em:

- Gerenciamento de estado reativo utilizando Angular Signals.
- Implementação de um CRUD completo no frontend.
- Manipulação de Drag and Drop (arrastar e soltar).
- Arquitetura limpa e separação de responsabilidades.
- Deploy de aplicação estática em infraestrutura AWS (S3 + CloudFront).

## Estrutura do Kanban
O quadro possui 4 colunas fixas onde as atividades podem ser movidas livremente:

- Backlog 
- Em andamento 
- Em revisão 
- Concluído 

As atividades podem ser reordenadas dentro da mesma coluna ou movidas entre colunas diferentes, preservando a integridade da ordem.

## Funcionalidades (CRUD & UX)

- Criar Atividade: Adição de novas tarefas através de um modal dedicado.
- Visualizar Detalhes: Exibição completa das informações da tarefa.
- Editar: Atualização de título, descrição, prioridade e status.
- Remover: Exclusão de tarefas do quadro.
- Drag and Drop: Uso do Angular CDK para mover e reordenar itens.
- Feedback Visual: Modais para ações, toasts para erros e loading global.
- Pipes: Tratamento visual de datas.

## Gerenciamento de Estado (Signals)

A aplicação abandona o uso de variáveis globais dispersas em favor de uma arquitetura centralizada baseada em Services como Store:
- Signals: Toda a reatividade da UI é impulsionada pelos novos Signals do Angular, garantindo performance e clareza no fluxo de dados.
- Isolamento: A lógica de negócio está separada da camada de apresentação (Componentes).

## Modelo de Dados
A estrutura de uma atividade segue o contrato abaixo:


  ```ts
  {
    id: string;
    title: string;
    description: string;
    status: 'Backlog' | 'Em andamento' | 'Em revisão' | 'Concluído';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    order: number;
    createdAt: string;
    updatedAt: string;
  }
```
## Persistência e Limitações Conhecidas
O projeto carrega dados iniciais de um arquivo JSON localizados em assets. As operações de CRUD ocorrem em memória durante a execução.

Nota sobre LocalStorage: Houve uma tentativa de implementação de persistência via localStorage. No entanto, a requisição GET do JSON inicial sobrescrevia o Signal de tarefas, descartando as alterações salvas localmente.

Status atual: A persistência mista (API + LocalStorage) está desativada/incompleta e mapeada como melhoria futura.

## Deploy e Infraestrutura
A aplicação foi compilada como estática e hospedada na AWS para garantir performance e escalabilidade:

- AWS S3: Hospedagem do bucket estático.
- AWS CloudFront: CDN para distribuição global e cache.

## Organização do Projeto
A estrutura de pastas segue uma divisão por domínio e responsabilidade:

```
src/app
├── components/   # Componentes de UI (Cards, Colunas, Modais)
├── services/     # Gerenciamento de Estado e Lógica de Negócio (Store)
├── models/       # Interfaces e Tipos
├── pipes/        # Formatação de dados (Datas, etc.)
└── ...
```
## Tecnologias Utilizadas

- Core: Angular (versão recente), TypeScript.
- Interatividade: Angular CDK (Drag and Drop).
- Estado: Angular Signals.
- Estilização: CSS/SCSS (foco em layout responsivo).
- Cloud: Amazon Web Services (S3 e CloudFront).

## Melhorias Futuras

- Resolver conflito de mesclagem entre JSON inicial e localStorage.
- Implementar persistência real via API (Backend).
- Adicionar paginação e filtros avançados (ex: filtrar por prioridade).
- Implementar testes unitários (Jasmine/Jest).
- Melhorar indicadores visuais nos cards (tags coloridas, avatares).

### Como acessar a aplicação
```
https://d38ceo6h3ef5nr.cloudfront.net/
```

### Como rodar localmente
Clone o repositório:


```Bash
git clone https://github.com/seu-usuario/seu-repo-kanban.git
```
Instale as dependências:
```Bash
npm install
```
Execute o servidor de desenvolvimento:

```Bash
ng serve
```
Acesse 
```
http://localhost:4200.
```
<br/>
Desenvolvido por Lucius Hebert como parte de um desafio técnico de Frontend.
