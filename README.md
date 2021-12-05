# SISPLAG

Gestão de instituições pelo Conselho Municipal de Educação

## Uso

**Requisitos:**

- Docker ([link](https://docs.docker.com/get-docker/))

**Execução:**

1. Verifique se o Docker está instalado por meio do comando

```shell
docker-compose --version
```

2. Clone este repositório e mude o diretório de execução para a pasta criada:

  ```shell
  git clone git@github.com:enzo-santos-ufpa/cme-gestao.git
  cd cme-gestao
  ```

3. Execute o projeto por meio do comando

  ```shell
  docker-compose up
  ```

  Esse comando irá construir as dependências necessárias para executar o projeto.
  Existem três containers que o Docker executará: o do banco de dados, chamado `postgres`,
  o do cliente, chamado `cme-client`, e o do servidor, chamado `cme-server`. Após as 
  dependências serem instaladas, os containeres serão carregados para que o projeto possa
  ser executado. O website estará pronto para ser visualizado quando cada container for
  inicializado, fornecendo as seguintes linhas no console:
  
  ```lang-none
  postgres      | ...
  postgres      | YYYY-MM-DD hh:mm:ss.mmm TZ [1] LOG:  database system is ready to accept connections
  ...
  cme-server    | ...
  cme-server    | backend: Executando em 172.20.0.4:3030
  cme-server    | backend: Conexão feita ao banco
  cme-server    | backend: Tabelas inicializadas
  ...
  cme-client    | ...
  cme-client    | Compiled successfully!
  cme-client    | You can now view cme-gestao in the browser.
  ```

4. O comando ainda estará em execução. Sem fechar o terminal utilizado para executar o comando,
   acesse o link `http://localhost:3000/` para visualizar o projeto.
   
Para encerrar a execução do projeto, basta apertar CTRL + C no terminal com o comando em execução
ou fechar o terminal.
