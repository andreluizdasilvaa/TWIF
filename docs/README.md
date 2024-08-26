# Rede Social IFSP

Bem-vindo à Rede Social IFSP, uma plataforma exclusiva para alunos matriculados nas instituições do Instituto Federal de São Paulo (IFSP). Este projeto permite que os alunos compartilhem postagens, curtam e comentem nos conteúdos de outros usuários, tudo isso em um ambiente seguro e colaborativo.

## Funcionalidades

- **Cadastro e Login**: Sistema de autenticação usando nome, matrícula e data de nascimento.
- **Postagens**: Criação e visualização de postagens com suporte a texto e imagens.
- **Curtidas e Comentários**: Interação com postagens através de curtidas e comentários.
- **Feed Dinâmico**: As postagens com mais curtidas são exibidas no topo do feed.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Prisma
- **Banco de Dados**: MySQL
- **Frontend**: HTML, CSS, JavaScript

## Estrutura do Projeto

- /backend
- │   ├── /src
- │   │   ├── /controllers
- │   │   ├── /middlewares
- │   │   ├── /routes
- │   │   ├── /services
- │   │   ├── /prisma
- │   │   ├── app.js
- │   └── /tests
- │
- /frontend
- │   ├── /html
- │   ├── /css
- │   ├── /js
- │   ├── /assets
- └── /docs

- # Backend

- **/src**: Contém todo o código-fonte do backend da aplicação.
- **/controllers**: Armazena os controladores, que são responsáveis por gerenciar a lógica de negócios associada a cada rota. Eles recebem as requisições, processam os dados, e retornam as respostas apropriadas.
- **/middlewares**: Contém os middlewares, que são funções que interceptam as requisições HTTP antes que elas alcancem os controladores. Eles são usados para tarefas como autenticação, validação de dados, ou manipulação de erros.
- **/routes**: Define as rotas da API, associando cada endpoint a um controlador correspondente.
- **/services**: Contém a lógica de negócio mais complexa que não se encaixa diretamente nos controladores. Os serviços são responsáveis por interações com o banco de dados via Prisma, processamento de dados, e outras operações de backend que suportam as funcionalidades da aplicação.
- **/prisma**: Esta nova pasta seria usada para armazenar o arquivo de esquema do Prisma (schema.prisma), bem como arquivos de migração e outros relacionados ao Prisma. O schema.prisma define o modelo de dados e as relações entre as tabelas no banco de dados.

# Frontend

- **/html**: Armazena os arquivos HTML estáticos que formam a estrutura das páginas da aplicação.
- **/css**: Contém os arquivos de estilo (CSS) que definem a aparência das páginas.
- **/js**: Contém os arquivos JavaScript responsáveis por adicionar interatividade às páginas HTML.
- **/assets**: Armazena recursos estáticos adicionais, como imagens, fontes e outros arquivos que serão utilizados pelo frontend.

# Docs

- **/docs**: Contém a documentação do projeto, como guias de instalação, manuais de uso, diagramas de arquitetura e quaisquer outras documentações relevantes para desenvolvedores e usuários.
