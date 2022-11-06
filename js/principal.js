document.onload = inicializar
window.onload = inicializar

const materiales = {
    base: [
        { i: 0, t: 'Plastico sin marcos', costo:1 },
        { i: 1, t: 'Fibrofacil sin marcos', costo:1.5 },
        { i: 2, t: 'Encuadrado', costo:3 }
    ],
    leds:[
        { i:0, t: 'Rojo',   c:'F00'},
        { i:1, t: 'Verde',  c:'0F0'},
        { i:2, t: 'Azul',   c:'00F'},
        { i:3, t: 'Blanco', c:'FFF'}
    ],
    tam_led: .5
}

let selector_ancho = null
let selector_alto = null
let selector_material = null
let led_cont = null
let pixel_cont = null

let configuracion = {
    ancho: 0,
    alto: 0,
    material: {},
    led_elegido: {},
    zoom: .5,
    data_:[]
}

function inicializar(){
    led_cont = document.getElementsByClassName("lc")[0]
    selector_ancho = document.getElementById("ancho")
    selector_alto = document.getElementById("alto")
    selector_material = document.getElementById("material")
    pixel_cont = document.getElementsByClassName("pc")[0]

    selector_material.innerHTML = '<option value="'+materiales.base[0].i+'" selected>'+materiales.base[0].t+'</option>'
    for (let i=1; i<materiales.base.length;i++){
        selector_material.innerHTML += '<option value="'+materiales.base[i].i+'">'+materiales.base[i].t+'</option>'
    }
    
    led_cont.innerHTML = ''
    for(let i=0; i< materiales.leds.length;i++){
        led_cont.innerHTML += '<i class="led" id="l'+i+'" style="background:#'+materiales.leds[i].c+';"></i>'
    }
    let led_b = document.getElementsByClassName("led")
    for (let i=0;i<led_b.length;i++){
        led_b[i].addEventListener("click", ()=>{ led_click(materiales.leds[i]) })
    }

    selector_alto.addEventListener("change", ()=>{  actualiza_lienzo() })
    selector_ancho.addEventListener("change", ()=>{ actualiza_lienzo() })

    actualiza_lienzo()
}

function led_click( params = undefined ){
    if (params == undefined) return false
    configuracion.led_elegido = params

    let leds = document.getElementsByClassName("led")
    for (let i=0; i<leds.length; i++){
        leds[i].style.border = '2px solid #000'
    }
    let led = document.getElementById("l"+params.i)
    led.style.border = '3px solid #ff6000'
}

function pixel_click( evnt ){
    let elemn = evnt.target
    console.log(elemn)
    configuracion.data_[elemn.getAttribute('data-x')][elemn.getAttribute('data-y')] = configuracion.led_elegido
    
    elemn.style.background = '#'+configuracion.led_elegido.c
    actualiza_presupuesto()
}

function actualiza_lienzo(){
    configuracion.alto = selector_alto.value;
    configuracion.ancho = selector_ancho.value;
    if (configuracion.alto < 0)  { selector_alto.value = 10; configuracion.alto = 10 }
    if (configuracion.alto > 100){ selector_alto.value = 100; configuracion.alto = 100}
    if (configuracion.ancho < 0) { selector_ancho.value = 10; configuracion.ancho = 10 }
    if (configuracion.ancho > 200){selector_ancho.value = 200; configuracion.ancho = 200 }
    
    let cant_led_x = Math.floor(configuracion.ancho/materiales.tam_led)
    let cant_led_y = Math.floor(configuracion.alto/materiales.tam_led)
    
    configuracion.data_ = []
    for (let x=0; x<cant_led_x;x++){
        configuracion.data_.push([])
        for(let y=0; y < cant_led_y; y++){
            configuracion.data_[x].push(undefined)
        }
    }

    pixel_cont.innerHTML = ''
    let html = '<table class="tmled" style="width:'+cant_led_x*configuracion.zoom+'rem; height:'+cant_led_y.zoom+'rem;">'
    for(let y=0; y < cant_led_y; y++){
        html += '<tr>'
        for (let x=0; x<cant_led_x;x++){
            html += '<td class="pix" data-x="'+x+'" data-y="'+y+'" style="width:'+configuracion.zoom+'rem;height:'+configuracion.zoom+'rem;"></td>'
        }
        html += '</tr>'
    }
    html+='</table>'
    pixel_cont.innerHTML = html

    let pixels = document.getElementsByClassName("pix")
    for (let i=0; i < pixels.length; i++){
        pixels[i].addEventListener("click", pixel_click )
    }
    actualiza_presupuesto()
}

let presupuesto = []

function actualiza_presupuesto(){

}
  