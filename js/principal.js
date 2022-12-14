document.onload = inicializar
window.onload = inicializar

const materiales = {
    base: [
        { i: 0, t: 'Poliestireno Alto Impacto 2mm sin marcos', costo:.725 },
        { i: 1, t: 'Fibrofacil 3 mm sin marcos', costo:.34 },
        { i: 2, t: 'Encuadrado (Consultar, dependera del tipo de marco a usar)', costo:3 }
    ],
    leds:[
        { i:0, t: 'Rojo',   c:'F00', ct:'000', costo:12},
        { i:1, t: 'Verde',  c:'0F0', ct:'000', costo:12},
        { i:2, t: 'Azul',   c:'00F', ct:'FFF', costo:12},
        { i:3, t: 'Blanco', c:'FFF', ct:'000', costo:12},
        { i:4, t: 'Borrar', c:'222222', ct:'FFF', costo:0}
    ],
    fuentes:[
        { a: 1.1, costo: 480 },
        { a: 1.9, costo: 770 },
        { a: 2.8, costo: 991 },
        { a: 3.5, costo: 1300 },
        { a: 4.5, costo: 1500 },
        { a: 5.8, costo: 2200 },
        { a: 6.8, costo: 3600 },
        { a: 7.8, costo: 4380 },
        { a: 8.8, costo: 5200 }
    ],
    tam_led: .5
}

let selector_ancho = null
let selector_alto = null
let selector_material = null
let led_cont = null
let pixel_cont = null
let btn_descargar = null
let btn_reset = null

let configuracion = {
    ancho: 0,
    alto: 0,
    material: {},
    led_elegido: materiales.leds[0],
    zoom: .5,
    data_:[]
}

function inicializar(){
    led_cont = document.getElementsByClassName("lc")[0]
    selector_ancho = document.getElementById("ancho")
    selector_alto = document.getElementById("alto")
    selector_material = document.getElementById("material")
    pixel_cont = document.getElementsByClassName("pc")[0]
    btn_descargar = document.getElementById("btn_descargar")
    btn_reset = document.getElementById("reset_btn")

    selector_material.innerHTML = '<option value="'+materiales.base[0].i+'" selected>'+materiales.base[0].t+'</option>'
    for (let i=1; i<materiales.base.length;i++){
        selector_material.innerHTML += '<option value="'+materiales.base[i].i+'">'+materiales.base[i].t+'</option>'
    }
    
    led_cont.innerHTML = ''
    for(let i=0; i< materiales.leds.length;i++){
        led_cont.innerHTML += '<div class="led" id="l'+i+'" style="background:#'+materiales.leds[i].c+';color:#'+materiales.leds[i].ct+'">'+materiales.leds[i].t+'</div>'
    }
    let led_b = document.getElementsByClassName("led")
    for (let i=0;i<led_b.length;i++){
        led_b[i].addEventListener("click", ()=>{ led_click(materiales.leds[i]) })
    }

    selector_alto.addEventListener("change", ()=>{  actualiza_lienzo() })
    selector_ancho.addEventListener("change", ()=>{ actualiza_lienzo() })
    selector_material.addEventListener("change", ()=>{ actualiza_presupuesto() })
    btn_reset.addEventListener("click", ()=>{ reset() })
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


let mouse_down = false
function pixel_click( evnt ){
    if (!mouse_down) return false
    
    if (configuracion.led_elegido == undefined){
        alert('Debe seleccionar un color de led')
        return false
    }

    let elemn = evnt.target

    if (elemn.getAttribute('data-x') == null) elemn = elemn.parentNode

    if (configuracion.led_elegido.c == '222222'){
        elemn.innerHTML = ''
        configuracion.data_[elemn.getAttribute('data-x')][elemn.getAttribute('data-y')] = undefined
    } else {
        elemn.innerHTML = '<i style="background: #'+configuracion.led_elegido.c+'; box-shadow: 0px 0px .25rem .25rem #'+configuracion.led_elegido.c+';"></i>'
        configuracion.data_[elemn.getAttribute('data-x')][elemn.getAttribute('data-y')] = configuracion.led_elegido 
    }
}

function actualiza_lienzo( muestra = undefined){
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
        pixels[i].addEventListener("mousedown", (e)=> {mouse_down = true; pixel_click(e); actualiza_presupuesto()} )
        pixels[i].addEventListener("mouseup", ()=> {mouse_down = false; actualiza_presupuesto()}  )
        pixels[i].addEventListener("mousemove", pixel_click )
    }
    actualiza_presupuesto()
}

let presupuesto = []

function obtener_leds(){
    let leds = { cant: 0, costo: 0 }
    for(let x=0; x < configuracion.data_.length; x++ ){
        for(let y=0; y < configuracion.data_[x].length; y++){
            if (configuracion.data_[x][y] != undefined){
                leds.cant ++
                leds.costo += configuracion.data_[x][y].costo
            }
        }
    }
    return leds
}

function presupuesto_base(){
    let mat = materiales.base[selector_material.value]
    let valor = mat.costo * selector_ancho.value * selector_alto.value
    return { t: "Material de base: "+mat.t, v: valor }
}

function presupuesto_comp_elec(leds){
    return { t: "Com. Elec. Varios (resistencias, etc):", v: leds.cant/3*6 }
}

function presupuesto_cables(leds){
    return { t: "Cables", v: 150 + leds.cant }
}

function presupuesto_fuente(leds){
    let consumo_amperes = (leds.cant/3*0.012)
    let fuente = null
    for (let i=0; i < materiales.fuentes.length; i++){
        if (consumo_amperes < materiales.fuentes[i].a){
            fuente = materiales.fuentes[i]
            break;
        }
    }
    if (fuente == null){
        alert('No se encontro una fuente de alimentaci??n adecuada, por favor consulte.')
        return { t: "No se encontro una fuente de alimentaci??n adecuada, por favor consulte", v: null }
    }
    return { t: "Fuente alimentaci??n 12v", v: fuente.costo }
}

function presupuesto_mano_obra(leds){
    return { t: "Mano de obra", v: 500 + leds.cant }
}

function presupuesto_impuestos(){
    return { t: "Pago monotributo (prorrateado)", v: 200 }
}

function presupuesto_leds(leds){
    return { t: leds.cant + " Led's", v: leds.costo }
}

function actualiza_presupuesto(){
    let leds = obtener_leds()
    let consumo_amperes = (leds.cant/3*0.012)

    presupuesto = []
    presupuesto.push(presupuesto_base())
    presupuesto.push(presupuesto_leds(leds))
    presupuesto.push(presupuesto_comp_elec(leds))
    presupuesto.push(presupuesto_cables(leds))
    presupuesto.push(presupuesto_fuente(leds))
    presupuesto.push(presupuesto_mano_obra(leds))
    presupuesto.push(presupuesto_impuestos())

    let presup_cont = document.getElementById("presup_cont")
    let html = '<li class="list-group-item active"><b>Presupuesto</b></li>'
    let sumatoria = 0
    for(let i=0; i < presupuesto.length; i++){
        html += '<li class="list-group-item d-flex justify-content-between align-items-center">'+presupuesto[i].t+'<span class="badge bg-primary rounded-pill">$ '+presupuesto[i].v+'</span></li>'
        sumatoria += presupuesto[i].v
    }
    html += '<li class="list-group-item active">Total: $'+sumatoria+'</li>'
    presup_cont.innerHTML = html

    //calculo de consumo
    let caracteristicas = document.getElementById("caracteristicas")
    html = "<li class='list-group-item active'><b>Caracteristicas Generales</b></li><li class='list-group-item'> Led's de Alta luminosidad y Bajo consumo, como los utilizados en los sem??foros.</li><li class='list-group-item'> Trabajo local, armado de forma artesanal.</li>"
    html += "<li class='list-group-item'> Consumo Total a 12v: "+Number(consumo_amperes).toFixed(2)+"A = "+ Number(consumo_amperes * 12).toFixed(2) +"W</li>"
    caracteristicas.innerHTML = html
    console.log(configuracion.data_)
}

function descargar_presupuesto(){
    
}



function reset(){
    let muestra = []

    selector_alto.value = 25
    selector_ancho.value = 50
    selector_material.value = 1
    actualiza_lienzo(muestra)
}
  