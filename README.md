# Yahoo Finance

Uma aplicação para buscar e exibir dados de ações usando a API do Yahoo Finance.

## Funcionalidades

- Busca de cotações históricas por ticker (ex: `AAPL`, `PETR4.SA`, etc)
- Seleção de períodos personalizados (1 mês, 6 meses, 1 ano e 5 anos)
- Exibição de gráficos interativos (Highcharts)
- Modo claro e escuro (Dark mode)
- Visualização de informações da empresa (setor, indústria, site, etc)
- Mensagens de erro amigáveis para tickers inválidos

## Como usar

### Instalação

```bash
git clone https://github.com/seu-usuario/yahoo-finance.git
cd yahoo-finance
npm install
```

### Rodando localmente

```bash
npm run dev
```
Ou, se for só backend:
```bash
npm start
```
Acesse em: [http://localhost:3000](http://localhost:3000)

### Exemplos de uso

- Pesquise por um ticker na barra de busca.
- Selecione o período desejado (1 Month, 1 Year...).
- Veja os gráficos e informações detalhadas da empresa.

## Endpoints API

Se você fornece uma API, documente os endpoints principais:

```
GET /api/stock?symbol=AAPL&period=1mo
GET /api/stock?symbol=AAPL&period=5y
```

**Parâmetros:**
- `symbol`: código da ação (ex: AAPL, PETR4.SA)
- `period`: período do histórico (`1mo`, `3mo`, `6mo`, `1y`, `5y`)

## Tecnologias usadas

- ReactJS
- Highcharts / highcharts-react-official
- dayjs
- TailwindCSS (ou outra)
- [Opcional: backend em Node.js/Express/Yahoo Finance API wrapper]

## Limitações

- Os dados são obtidos do Yahoo Finance e podem não ser 100% precisos ou atualizados em tempo real.
- Alguns tickers podem não estar disponíveis ou ter histórico limitado.

## Licença

[MIT](LICENSE)

---

Feito com 💙 por [renangf4](https://github.com/renangf4)