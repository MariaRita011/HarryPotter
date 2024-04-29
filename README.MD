# API de Hogwarts

## Introdução

Este é um projeto simples de API em Node.js utilizando o framework Express e o banco de dados PostgreSQL. A API gerencia informações sobre bruxos e varinhas do universo de Harry Potter.

## Funcionalidades

A API possui as seguintes funcionalidades para os bruxos:

* Listar todos os bruxos cadastrados
* Adicionar um novo bruxo
* Atualizar um bruxo existente
* Excluir um bruxo
* Buscar um bruxo pelo seu ID
* Buscar um bruxo pelo seu nome (busca com filtro)

Além disso, a API possui funcionalidades para as varinhas:

* Listar todas as varinhas cadastradas
* Adicionar uma nova varinha
* Atualizar uma varinha existente
* Excluir uma varinha
* Buscar uma varinha pelo seu ID

## Tecnologias Utilizadas

* Node.js
* Express
* PostgreSQL

## Instalações

### 1. Clonar o repositório

```bash
git clone https://github.com/MariaRita011/HarryPotter.git
```

### 2. Instalar as dependências

```terminal
npm install
```

### 3. Configure as variáveis de ambiente

```javascript
  user: "nomedeusuario",
  host: "localdoservidor",
  database: "nomedodatabase",
  password: "senhadobanco",
  port: "portadoservidor",
  
```

## Como usar
### 1. Iniciar o servidor

```terminal
npm run dev
```

Faça as requisições via Insomnia ou pelo próprio banco de dados e aproveite! :)