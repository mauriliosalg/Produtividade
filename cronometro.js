var settings = {
    foco: 25,
    shortBreak: 5,
    longBreak: 15,
    periodo: 4,
    ciclo: 0
}

const dsettings = [25,5,15,4,0]

var tempo = 1000; //quantos milésimos valem 1 segundo
var cron;
// valor inicial do cronômetro
var mm = settings.foco;
var ss = 0;

// seletor de modos
const modeButtons = document.querySelector('#modes');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  changeMode(mode);
}

function modeAtual() {
    let el = document.querySelector(".active")
    if(el == undefined) {
        alert('undefined')
    }
    let mode = el.dataset.mode
    return mode
}


// muda para o modo passado como parâmetro e atualiza mensagem e relógio
function changeMode(mode) {
    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    atualizaMsg()
    atualizaRelogio(mode)
    escrever()
}

function atualizaMsg() {
    document.getElementById('msg').innerText = document.querySelector(".active").dataset.txt
}

function atualizaRelogio(mode) {
    mm = settings[mode]
    document.body.style.background = `var(--${mode})`
    document.getElementById('power').style.background = `var(--${mode})`
    ss = 0
}

// menu de configurações
function abreMenu() {
    let menu = document.querySelector(".config")
    menu.style.visibility = "visible"
}


function finalizar() {
    let menu = document.querySelector(".config")
    settings.foco=parseInt(document.getElementById('configPomodoro').value)
    settings.shortBreak=parseInt(document.getElementById('configShort').value)
    settings.longBreak=parseInt(document.getElementById('configLong').value)
    settings.periodo=parseInt(document.getElementById('configPeriodo').value)
    mm=settings.foco
    ss=0
    escrever()
    menu.style.visibility = "hidden"
}
function voltaPadrao() {
    let menu = document.querySelector(".config")
    settings.foco=dsettings[0]
    settings.shortBreak=dsettings[1]
    settings.longBreak=dsettings[2]
    settings.periodo=dsettings[3]
    mm=settings.foco
    ss=0
    escrever()
    menu.style.visibility = "hidden"
}


function power () {
    let status = document.getElementById("power")
    let mode=modeAtual()
    if (status.value == 'INICIAR') {
        status.value = "PAUSAR"
        status.style.background = 'var(--pause_color)'
        document.body.style.background = `var(--${mode})`
        cron = setInterval(() => { timer();}, tempo )
    } else if (status.value == 'PAUSAR') {
        status.value = "INICIAR"
        status.style.background = `var(--${mode})`
        document.body.style.background = 'var(--pause_color)'
        clearInterval(cron)
    }

}

function zerar() {
    document.body.style.background = 'var(--foco)'
    let status = document.getElementById("power")
    status.value = "INICIAR"
    status.style.background = 'var(--foco)'
    mm = settings.foco
    ss = 0
    clearInterval(cron)
    escrever()
}

function escrever () {
    let format = (mm < 10 ? '0'+mm : mm) + ':' + (ss < 10 ? '0'+ss : ss)
    document.getElementById("relogio").innerText = format
}



function timer() { 
    ss--

    if(ss < 0) {
        ss = 59
        mm--

        if (mm < 0) {
            document.getElementById("alarme").play()
            let mode = modeAtual()
            clearInterval(cron)
            if ( mode == 'foco' ) {
                settings.ciclo++
                if (settings.ciclo%settings.periodo === 0) {
                    changeMode('longBreak')
                } else {
                    changeMode('shortBreak')
                }
            } else {
                changeMode('foco')
            }
        cron = setInterval(() => { timer();}, tempo )
        }
    }
    escrever()
}

