# ⏱️ Cronômetro de Estudo — Foco

> Cronômetro de produtividade com sessões automáticas, pausas inteligentes e controle de ciclos de estudo.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Sobre o Projeto

O **Cronômetro de Estudo** é uma aplicação web focada em produtividade, inspirada na técnica Pomodoro. Ele divide seu tempo de estudo em blocos de 30 minutos com pausas automáticas, registra suas sessões e ciclos concluídos, e força um descanso obrigatório ao atingir os limites diários — tudo com uma interface dark moderna e animada.

---

## ✨ Funcionalidades

- ⏳ **Temporizador por tempo real** — usa timestamps do sistema para máxima precisão, sem drift por `setInterval`
- 🔄 **Pausas automáticas inteligentes:**
  - Pausa de **7 minutos** a cada 30 min de foco
  - Pausa de **5 minutos** se restar menos de 30 min
  - **Encerra automaticamente** se restar menos de 14 min
- 🎯 **Entrada flexível de tempo:**
  - `25` → 25 minutos
  - `1:30` → 1 hora e 30 minutos
  - `1;2;3` → sessões separadas somadas
  - Seletor de unidade: **Minutos** ou **Horas**
- 📊 **Rastreamento de sessões e ciclos** com marcadores visuais (dots)
- 🔔 **Alertas sonoros** no início, fim e pausas (via Google Sounds)
- 💤 **Descanso obrigatório:** após 6 sessões completas (≥30 min), a aplicação bloqueia por **2 horas**, com contagem regressiva visível
- 🎉 **Finalização automática** ao atingir 30 ciclos
- 💾 **Persistência via `localStorage`** — o descanso obrigatório é mantido mesmo ao fechar o navegador
- 📱 **Totalmente responsivo** — funciona em desktop, tablet e mobile (até 360px)

---

## 🎨 Design

- Dark theme com paleta `#21213a` / `#111118`
- Anel de progresso SVG animado
- Gradiente glow e grid de fundo ambiente
- Fontes modernas: **Syne** (display) + **DM Mono** (dados)
- Indicador dot pulsante (verde → ciano → cinza por estado)
- Animações de entrada do card e transições de estado suaves
- Corner accents decorativos com `::before` e `::after`

---

## 🗂️ Estrutura do Projeto

```
Cronometrador/
├── index.html       # Estrutura da interface
├── styleCrono.css   # Estilos e design system
├── scripts.js       # Lógica do temporizador e sessões
└── README.md        # Documentação
```

---

## 🚀 Como Usar

### ▶️ Rodando no Navegador (sem instalação)

1. **Baixe ou clone** este repositório:
   ```bash
   git clone https://github.com/seu-usuario/cronometrador.git
   ```
2. Abra a pasta `Cronometrador/`
3. Dê **dois cliques** em `index.html`  
   → O arquivo abrirá diretamente no seu navegador padrão

> **Nenhuma instalação ou dependência necessária.** O projeto usa apenas HTML, CSS e JavaScript puro.

---

### 💻 Instalando no PC (acesso rápido)

Para acessar o cronômetro como se fosse um aplicativo instalado no Windows:

1. Abra o arquivo `index.html` no **Google Chrome** ou **Microsoft Edge**
2. Clique nos **três pontos** (menu do navegador) → **Mais ferramentas** → **Criar atalho...**
3. Marque a opção **"Abrir como janela"** e clique em **Criar**

O cronômetro aparecerá no seu Desktop e na barra de tarefas como um app nativo, sem barra de endereços!

> Também é possível fixar o atalho no menu **Iniciar** clicando com o botão direito sobre ele.

---

## 🕹️ Como Funciona

| Ação | Resultado |
|------|-----------|
| Digite o tempo e clique **Iniciar** | Começa a sessão de foco |
| A cada 30 min de estudo | Pausa automática de 7 min |
| Clique **Pausar** | Congela o timer e libera Reset |
| Clique **Retomar** | Continua de onde parou |
| Clique **Resetar** | Zera tudo (bloqueado durante descanso obrigatório) |
| 6 sessões completas (≥30 min cada) | Descanso obrigatório de 2 horas |
| 30 ciclos concluídos | Encerramento da jornada de estudo |

---

## 🔊 Sons

| Evento | Som |
|--------|-----|
| Início / Retomada | Beep curto |
| Fim de sessão | Despertador |
| Pausa / Descanso | Sino suave |

> Os sons são carregados via URL do Google Actions Sounds. É necessária conexão com a internet para que funcionem.

---

## 📱 Compatibilidade

| Plataforma | Suporte |
|------------|---------|
| Desktop (Chrome, Edge, Firefox) | ✅ Total |
| Tablet | ✅ Total |
| Mobile (≥ 360px) | ✅ Total |
| Modo offline | ✅ (exceto sons) |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Design system, animações, responsividade |
| JavaScript (ES6+) | Lógica de timer, DOM, localStorage |
| SVG | Anel de progresso circular animado |
| Google Fonts | Tipografia (Syne + DM Mono) |
| localStorage API | Persistência do descanso obrigatório |

---

## 👩‍💻 Autora

Desenvolvido por **Alisson** como parte da jornada **Rumo a Fullstack** — Abril/2026.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.
