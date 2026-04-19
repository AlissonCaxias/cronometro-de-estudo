let timer = null;
let totalSegundos = 60 *30 ;
let segundosRestantes = totalSegundos;
let sessoes = 5;
let ciclos = 5;
const MAX_CICLOS = 30; // exemplo: 30 ciclos = 15 horas de estudo com pausas
const elCiclos = document.createElement('div');
elCiclos.className = 'sessions-count';
document.querySelector('.sessions').appendChild(elCiclos);
elCiclos.textContent = `Ciclos: 0 / ${MAX_CICLOS}`;
let MAX_SESSOES = 30;

const elContador = document.getElementById('contador');
const elStatus = document.getElementById('status');
const elDot = document.getElementById('dot');
const elRing = document.getElementById('progressRing');
const elBtnIniciar = document.getElementById('btnIniciar');
const elBtnReset = document.getElementById('btnReset');
const elCount = document.getElementById('sessionsCount');
const elDots = document.getElementById('sessionDots');

const somInicio = document.getElementById('somInicio');
const somFim = document.getElementById('somFim');
const somDescanso = document.getElementById('somDescanso');

const CIRCUNF = 2 * Math.PI * 70;

let emPausa = false;
let pausaRestante = 0;
let tempoEstudoDecorrido = 0;

function formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    const textoHora = h > 0 ? (h === 1 ? "1 hora" : `${h} horas`) : "";
    const textoMin = m > 0 ? (m === 1 ? "1 minuto" : `${m} minutos`) : "";
    const textoSeg = s > 0 ? (s === 1 ? "1 segundo" : `${s} segundos`) : "";

    return [textoHora, textoMin, textoSeg].filter(Boolean).join(" e ");
}

function atualizarRing(restante, total) {
    const progresso = total > 0 ? (total - restante) / total : 0;
    const offset = CIRCUNF * (1 - progresso);
    elRing.style.strokeDashoffset = offset;
}

function setEstado(estado) {
    elContador.className = 'time-value ' + estado;
    elStatus.className = 'status-bar ' + estado;
    elRing.className = 'progress-fill ' + (estado === 'done' ? 'done' : '');
    elDot.className = 'dot ' + estado;
}
function formatarDuracao(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;

    if (h > 0 && m > 0) {
        const textoHora = h === 1 ? "1 hora" : `${h} horas`;
        const textoMin = m === 1 ? "1 minuto" : `${m} minutos`;
        return `${textoHora} e ${textoMin}`;
    }

    if (h > 0) {
        return h === 1 ? "1 hora" : `${h} horas`;
    }

    if (m > 0) {
        return m === 1 ? "1 minuto" : `${m} minutos`;
    }

    return "Definir tempo";
}

function iniciar() {
    ultimoDescanso = parseInt(localStorage.getItem("ultimoDescanso")) || null;

    if (ultimoDescanso && Date.now() - ultimoDescanso < 2 * 60 * 60 * 1000) {
        const restante = 2 * 60 * 60 * 1000 - (Date.now() - ultimoDescanso);
        const horas = Math.floor(restante / 3600000);
        const minutos = Math.floor((restante % 3600000) / 60000);
        elStatus.textContent = `⚠ Descanso obrigatório: faltam ${horas}h ${minutos}min`;
        mostrarDescanso(restante);

        elBtnIniciar.disabled = true;
        elBtnReset.disabled = true;
        return;
    }
    const valor = document.getElementById('tempo').value.trim();
    const unidade = document.querySelector('input[name="unidade"]:checked').value;

    if (!valor) {
        elStatus.textContent = '⚠ informe um tempo válido';
        return;
    }

    if (timer) { clearInterval(timer); }

    let totalMinutos = 0;

    // Caso seja lista separada por ";"
    if (valor.includes(";")) {
        const partes = valor.split(";");
        partes.forEach(p => {
            const num = parseInt(p);
            if (!isNaN(num)) {
                totalMinutos += (unidade === "hora") ? num * 60 : num;
            }
        });
    }
    // Caso seja formato H:MM
    else if (valor.includes(":")) {
        const partes = valor.split(":");
        const horas = parseInt(partes[0]) || 0;
        const minutos = parseInt(partes[1]) || 0;
        totalMinutos = (horas * 60) + minutos;
    }
    // Caso seja número simples
    else {
        const num = parseInt(valor);
        totalMinutos = (unidade === "hora") ? num * 60 : num;
    }

    totalSegundos = totalMinutos * 60;
    segundosRestantes = totalSegundos;
    tempoEstudoDecorrido = 0;
    emPausa = false;
    pausaRestante = 0;
    document.querySelector(".descanso-timer").style.display = "none";

    somInicio.play().catch(() => { });
    setEstado('running');
    elStatus.textContent = `sessão de ${formatarTempo(totalSegundos)} iniciada`;
    elContador.textContent = formatarTempo(segundosRestantes);
    elBtnIniciar.textContent = 'Pausar';
    elBtnIniciar.onclick = pausar;
    elBtnReset.disabled = true;
    atualizarRing(segundosRestantes, totalSegundos);

    timer = setInterval(atualizar, 1000);

}

function encerrarCronometro() {
    clearInterval(timer);
    timer = null;
    somFim.play().catch(() => { });
    setEstado('done');
    elRing.style.strokeDashoffset = 0;
    elContador.textContent = '00:00';
    elStatus.textContent = '✓ Sessão concluída!';
    elBtnIniciar.textContent = 'Iniciar';
    elBtnIniciar.onclick = iniciar;
    document.querySelector(".descanso-timer").style.display = "none";

    // só incrementa se a sessão teve pelo menos 30 min
    if (totalSegundos >= 30 * 60) {
        sessoes = Math.min(sessoes + 1, MAX_SESSOES);
        ciclos = Math.min(ciclos + 1, MAX_CICLOS);
        atualizarSessoes();
        atualizarCiclos();
    }

    // descanso obrigatório a cada 6 sessões
    if (sessoes % 6 === 0 && sessoes > 0) {
        ultimoDescanso = Date.now();
        localStorage.setItem("ultimoDescanso", ultimoDescanso);
        mostrarDescanso(2 * 60 * 60 * 1000);
        elStatus.textContent = "⏳ Descanso obrigatório de 2 horas!";
        elBtnIniciar.disabled = true;
        elBtnReset.disabled = true;
    }

    if (ciclos >= MAX_CICLOS) {
        finalizarEstudo();
    }
}

function atualizar() {
    // O tempo principal continua diminuindo independentemente se é pausa ou estudo
    segundosRestantes--;
    elContador.textContent = formatarTempo(segundosRestantes);
    atualizarRing(segundosRestantes, totalSegundos);

    if (segundosRestantes <= 0) {
        encerrarCronometro();
        return;
    }

    if (emPausa) {
        pausaRestante--;
        atualizarDisplayPausa(pausaRestante);

        if (pausaRestante <= 0) {
            emPausa = false;
            tempoEstudoDecorrido = 0; // Zera para o próximo bloco de estudo
            document.querySelector(".descanso-timer").style.display = "none";
            somFim.play().catch(() => { });
            
            setEstado('running');
            if (segundosRestantes <= 30 * 60) {
                elStatus.textContent = "Última sessão para finalizar seu estudo de hoje!";
            } else {
                elStatus.textContent = "Sessão de foco retomada";
            }
            
            ciclos++;
            atualizarCiclos();
            if (ciclos >= MAX_CICLOS) {
                finalizarEstudo();
            }
        }
    } else {
        tempoEstudoDecorrido++;

        // Inicia a pausa após 30 minutos (1800 segundos) de estudo
        if (tempoEstudoDecorrido > 0 && tempoEstudoDecorrido % (30 * 60) === 0) {
            if (segundosRestantes <= 14 * 60) {
                encerrarCronometro();
            } else if (segundosRestantes < 30 * 60) {
                iniciarPausa(5 * 60);
            } else {
                iniciarPausa(7 * 60);
            }
        }
    }
}

function iniciarPausa(duracaoSegundos) {
    emPausa = true;
    pausaRestante = duracaoSegundos;
    setEstado('pause');
    const m = Math.floor(duracaoSegundos / 60);
    elStatus.textContent = `Pausa de ${m} minutos...`;
    somInicio.play().catch(() => { });
    
    document.querySelector(".descanso-timer").style.display = "flex";
    atualizarDisplayPausa(pausaRestante);
}

function atualizarDisplayPausa(segundos) {
    const elDescanso = document.querySelector(".descanso-timer");
    const m = String(Math.floor(segundos / 60)).padStart(2, '0');
    const s = String(segundos % 60).padStart(2, '0');
    elDescanso.textContent = `⏳ Pausa: ${m}:${s}`;
}

function pausar() {
    clearInterval(timer);
    timer = null;
    setEstado('inactive');
    setEstado('pause');
    elStatus.textContent = '— sessão pausada —';
    elBtnIniciar.textContent = 'Retomar';
    elBtnIniciar.onclick = retomar;
    elBtnReset.disabled = false;
}

function atualizarCiclos() {
    elCiclos.textContent = `Ciclos: ${ciclos} / ${MAX_CICLOS}`;
}

function retomar() {
    // recupera do localStorage
    ultimoDescanso = parseInt(localStorage.getItem("ultimoDescanso")) || null;

    // verifica se ainda está dentro do descanso obrigatório
    if (ultimoDescanso && Date.now() - ultimoDescanso < 2 * 60 * 60 * 1000) {
        const restante = 2 * 60 * 60 * 1000 - (Date.now() - ultimoDescanso);
        const horas = Math.floor(restante / 3600000);
        const minutos = Math.floor((restante % 3600000) / 60000);
        elStatus.textContent = `⚠ Descanso obrigatório: faltam ${horas}h ${minutos}min para retomar`;
        mostrarDescanso(restante);
        elBtnIniciar.disabled = true;
        elBtnReset.disabled = true;
        return;
    }

    // se contador já está zerado, volta para estado inicial
    if (segundosRestantes <= 0 || totalSegundos <= 0) {
        clearInterval(timer);
        timer = null;
        setEstado('inactive');
        elContador.textContent = '00:00';
        elStatus.textContent = '— Aguardando início —';
        elBtnIniciar.textContent = 'Iniciar';
        elBtnIniciar.onclick = iniciar;
        elBtnIniciar.disabled = false;
        elBtnReset.disabled = true;

        // limpa input
        document.getElementById('tempo').value = "";
        return;
    }

    // se não estiver em descanso e ainda há tempo, retoma normalmente
    setEstado(emPausa ? 'pause' : 'running');
    elStatus.textContent = emPausa ? "Pausa retomada" : `sessão de ${formatarTempo(totalSegundos)} retomada`;
    elBtnIniciar.textContent = 'Pausar';
    elBtnIniciar.onclick = pausar;
    timer = setInterval(atualizar, 1000);
}

function resetar() {
    // se ainda estiver dentro das 2h de descanso, bloqueia
    if (ultimoFim && Date.now() - ultimoFim < 2 * 60 * 60 * 1000) {
        elStatus.textContent = '⚠ Reset bloqueado: Para Descanso Obrigatório';
        elBtnReset.disabled = true;
        return;
    }

    clearInterval(timer);
    timer = null;
    totalSegundos = 0;
    segundosRestantes = 0;
    tempoEstudoDecorrido = 0;
    sessoes = 0;
    ciclos = 0;
    emPausa = false;
    pausaRestante = 0;
    document.querySelector(".descanso-timer").style.display = "none";

    atualizarSessoes();
    atualizarCiclos();

    //setEstado('done');
    elContador.textContent = '00:00';
    elStatus.textContent = '— Aguardando início —';
    elBtnIniciar.textContent = 'Iniciar';
    elBtnIniciar.onclick = iniciar;
    setEstado('inactive');         // volta para estado inicial
    elBtnIniciar.disabled = false; // garante que o botão volta ativo
    document.getElementById('tempo').value = "";
    elRing.style.strokeDashoffset = CIRCUNF;
    elBtnReset.disabled = true;
    
}

function atualizarSessoes() {
    const dots = elDots.querySelectorAll('.session-dot');
    dots.forEach((d, i) => {
        d.classList.toggle('done', i < sessoes);
    });
    elCount.textContent = `${sessoes} / ${MAX_SESSOES}`;
}

let ultimoFim = null;

function finalizarEstudo() {
    clearInterval(timer);
    timer = null;

    // calcula total de horas estudadas (cada ciclo = 30 min = 0.5h)
    const horasEstudadas = (ciclos * 30) / 60;

    setEstado('done');
    elContador.textContent = '00:00';
    elStatus.textContent = `🎉 Estudo finalizado: ${sessoes} sessões / ${ciclos} ciclos = ${horasEstudadas}h. Vá descansar!`;

    elBtnIniciar.textContent = 'Iniciar';
    elBtnIniciar.onclick = iniciar;
    elBtnReset.disabled = true;

    // zera para próxima rodada
    sessoes = 0;
    ciclos = 0;
    atualizarSessoes();
    atualizarCiclos();

    // salva timestamp para descanso obrigatório
    ultimoFim = Date.now();
    localStorage.setItem("ultimoFim", ultimoFim);
}

function mostrarDescanso(restanteMs) {
    const elDescanso = document.querySelector(".descanso-timer");
    elDescanso.style.display = "flex";

    function atualizarTimer() {
        const horas = String(Math.floor(restanteMs / 3600000)).padStart(2, '0');
        const minutos = String(Math.floor((restanteMs % 3600000) / 60000)).padStart(2, '0');
        const segundos = String(Math.floor((restanteMs % 60000) / 1000)).padStart(2, '0');

        elDescanso.textContent = `⏳ Descanso obrigatório: ${horas}:${minutos}:${segundos}`;
        somDescanso.play().catch(() => { });
        if (restanteMs <= 0) {
            elDescanso.style.display = "none";
            elBtnIniciar.disabled = false;
            elBtnReset.disabled = false;
            clearInterval(intervaloDescanso);
        }
        restanteMs -= 1000; // atualiza a cada segundo
    }

    atualizarTimer();
    const intervaloDescanso = setInterval(atualizarTimer, 1000);
}



// Init ring
elRing.style.strokeDasharray = CIRCUNF;
elRing.style.strokeDashoffset = CIRCUNF;