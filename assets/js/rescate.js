'use strict';
/* Prototipo académico: datos locales, sin servidor ni dependencias. */
(() => {
  const CLAVE = 'huella-segura-rescates-v1';
  const EJEMPLOS = [
  {
    "id": "R-2026-003",
    "nombre": "Luna",
    "categoria": "Gatos",
    "urgencia": "Alta",
    "fecha": "2026-10-23",
    "ubicacion": "Portoviejo, sector El Florón",
    "descripcion": "Gata encontrada sola, con dificultad para caminar y signos de deshidratación. Caso de ejemplo para practicar el registro.",
    "estado": "En atención"
  },
  {
    "id": "R-2026-002",
    "nombre": "Toby",
    "categoria": "Perros",
    "urgencia": "Media",
    "fecha": "2026-10-22",
    "ubicacion": "Manta, barrio Los Esteros",
    "descripcion": "Perro encontrado desorientado cerca del mercado. Se encuentra bajo observación y a la espera de identificar a su familia.",
    "estado": "En observación"
  },
  {
    "id": "R-2026-001",
    "nombre": "Alba",
    "categoria": "Fauna Silvestre",
    "urgencia": "Baja",
    "fecha": "2026-10-21",
    "ubicacion": "Montecristi, zona rural",
    "descripcion": "Ave encontrada fuera de su hábitat. Se registró el caso para coordinar su valoración con personal autorizado.",
    "estado": "Derivado"
  }
];
  const categorias = ['Perros', 'Gatos', 'Fauna Silvestre'];
  const urgencias = ['Alta', 'Media', 'Baja'];
  let lecturaFallida = false;
  function leer() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      if (!Array.isArray(datos)) throw new Error('Formato inválido');
      return datos.filter(c => c && ['id','nombre','categoria','urgencia','fecha','ubicacion','descripcion','estado'].every(k => typeof c[k] === 'string') && categorias.includes(c.categoria) && urgencias.includes(c.urgencia) && /^R-\d{4}-\d{3,}$/.test(c.id) && /^\d{4}-\d{2}-\d{2}$/.test(c.fecha) && !EJEMPLOS.some(e => e.id === c.id));
    } catch (error) { lecturaFallida = true; return []; }
  }
  let propios = leer();
  const todos = () => [...propios].reverse().concat(EJEMPLOS);
  const uno = s => document.querySelector(s);
  const texto = (selector, valor) => { const e = uno(selector); if (e) e.textContent = valor; };
  const fechaLocal = () => new Intl.DateTimeFormat('sv-SE').format(new Date());
  const fechaVisible = f => f.split('-').reverse().join('/');
  const normalizar = s => s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function nodo(etiqueta, contenido, clase) {
    const e = document.createElement(etiqueta);
    if (contenido !== undefined) e.textContent = contenido;
    if (clase) e.className = clase;
    return e;
  }
  function indicador(c) { return nodo('span', c.urgencia, 'etiqueta ' + c.urgencia.toLowerCase()); }
  if (document.body.dataset.pagina === 'index') {
    texto('[data-total]', todos().length);
    texto('[data-activos]', todos().filter(c => c.estado === 'En atención' || c.estado === 'En observación').length);
    texto('[data-urgentes]', todos().filter(c => c.urgencia === 'Alta' && c.estado !== 'Derivado').length);
    const recientes = uno('[data-recientes]');
    if (recientes) {
      recientes.replaceChildren(...todos().slice(0,3).map(c => {
        const a = nodo('article'); a.append(nodo('p', c.id + ' · ' + c.categoria, 'ceja'), nodo('h3', c.nombre));
        const prioridad = nodo('p'); prioridad.append(indicador(c), document.createTextNode(' '), nodo('span', c.estado, 'estado'));
        const enlace = nodo('a', 'Ver ficha →'); enlace.href = 'rescates.html?caso=' + encodeURIComponent(c.id);
        a.append(prioridad,nodo('p',c.ubicacion),enlace); return a;
      }));
    }
  }
  const formulario = uno('#formulario-rescate');
  if (formulario) {
    const fecha = uno('#fecha'); fecha.value = fechaLocal(); fecha.max = fechaLocal();
    const mensaje = uno('#mensaje-formulario'); const confirmacion = uno('#enlace-confirmacion');
    ['nombre','ubicacion','descripcion'].forEach(id => uno('#'+id).addEventListener('input', e => e.target.setCustomValidity('')));
    formulario.addEventListener('submit', event => {
      event.preventDefault(); confirmacion.hidden = true;
      for (const [id,min] of [['nombre',3],['ubicacion',3],['descripcion',20]]) {
        const campo = uno('#'+id); campo.value = campo.value.trim();
        campo.setCustomValidity(campo.value.length < min ? 'Escribe al menos ' + min + ' caracteres, sin contar espacios al inicio o al final.' : '');
      }
      if (!formulario.reportValidity()) return;
      const campos = new FormData(formulario);
      if (!categorias.includes(campos.get('categoria')) || !urgencias.includes(campos.get('urgencia'))) return;
      if (lecturaFallida) { mensaje.textContent = 'No se pudo leer el almacenamiento local. Habilítalo o revisa sus datos antes de registrar un caso.'; return; }
      const existentes = leer();
      if (lecturaFallida) { mensaje.textContent = 'No se pudo acceder a los registros. Tus campos se conservan; intenta nuevamente.'; return; }
      const anio = campos.get('fecha').slice(0,4);
      const secuencia = Math.max(0,...existentes.concat(EJEMPLOS).filter(c => c.id.startsWith('R-'+anio+'-')).map(c => Number(c.id.split('-')[2]))) + 1;
      const caso = {id:'R-'+anio+'-'+String(secuencia).padStart(3,'0'), nombre:campos.get('nombre'), categoria:campos.get('categoria'), urgencia:campos.get('urgencia'), fecha:campos.get('fecha'), ubicacion:campos.get('ubicacion'), descripcion:campos.get('descripcion'), estado:'En atención'};
      try { localStorage.setItem(CLAVE, JSON.stringify([...existentes,caso])); propios = [...existentes,caso]; }
      catch(error) { mensaje.textContent = 'No se pudo guardar. Revisa el permiso o espacio del almacenamiento del navegador. Tus campos se conservan.'; return; }
      formulario.reset(); fecha.value = fechaLocal();
      mensaje.textContent = 'Rescate registrado: ' + caso.id + ' · ' + caso.nombre + '. Se guardó en este navegador.';
      confirmacion.hidden = false; confirmacion.querySelector('a').href = 'rescates.html?caso=' + encodeURIComponent(caso.id);
    });
    formulario.addEventListener('reset', () => {
      mensaje.textContent = ''; confirmacion.hidden = true;
      ['nombre','ubicacion','descripcion'].forEach(id => uno('#'+id).setCustomValidity(''));
      setTimeout(() => { fecha.value = fechaLocal(); },0);
    });
  }
  const filtros = uno('#filtros');
  if (filtros) {
    if (lecturaFallida) { const aviso = uno('#aviso-almacenamiento'); aviso.hidden = false; aviso.textContent = 'No se pudieron leer tus registros locales. Se muestran los casos de ejemplo.'; }
    const cuerpo = uno('#cuerpo-casos'); const dialogo = uno('#ficha-caso');
    function abrir(id) {
      const c = todos().find(caso => caso.id === id); if (!c) return;
      texto('#codigo-ficha',c.id + ' · ' + c.categoria); texto('#titulo-ficha',c.nombre); texto('#descripcion-ficha',c.descripcion);
      uno('#datos-ficha').replaceChildren(...[['Urgencia',c.urgencia],['Estado',c.estado],['Fecha del rescate',fechaVisible(c.fecha)],['Ubicación',c.ubicacion]].flatMap(([k,v]) => [nodo('dt',k),nodo('dd',v)]));
      dialogo.showModal();
    }
    function pintar() {
      const busqueda = normalizar(uno('#buscar').value.trim());
      const categoria = uno('#filtro-categoria').value; const urgencia = uno('#filtro-urgencia').value;
      const casos = todos().filter(c => (!categoria || c.categoria === categoria) && (!urgencia || c.urgencia === urgencia) && normalizar(c.nombre+' '+c.id+' '+c.ubicacion).includes(busqueda));
      cuerpo.replaceChildren(...casos.map(c => {
        const fila = nodo('tr'); const codigo = nodo('th',c.id); codigo.scope = 'row';
        const nombre = nodo('td'); nombre.append(nodo('strong',c.nombre));
        const prioridad = nodo('td'); prioridad.append(indicador(c));
        const fecha = nodo('td'); const tiempo = nodo('time',fechaVisible(c.fecha)); tiempo.dateTime = c.fecha; fecha.append(tiempo);
        const accion = nodo('td'); const boton = nodo('button','Ver ficha','boton-ficha'); boton.type='button'; boton.dataset.caso=c.id; boton.setAttribute('aria-label','Ver ficha de '+c.nombre); accion.append(boton);
        fila.append(codigo,nombre,nodo('td',c.categoria),prioridad,fecha,nodo('td',c.estado),accion); return fila;
      }));
      if (!casos.length) { const fila=nodo('tr'); const celda=nodo('td','No se encontraron casos. Prueba con otro nombre o restablece los filtros.'); celda.colSpan=7; fila.append(celda); cuerpo.append(fila); }
      texto('#cantidad-casos',casos.length + (casos.length===1?' caso encontrado':' casos encontrados') + ' de ' + todos().length + ' registrados');
    }
    filtros.addEventListener('submit', e => {e.preventDefault(); pintar();});
    filtros.addEventListener('input',pintar); filtros.addEventListener('change',pintar);
    filtros.addEventListener('reset',() => setTimeout(pintar,0));
    cuerpo.addEventListener('click',e => {const boton=e.target.closest('button[data-caso]'); if(boton) abrir(boton.dataset.caso);});
    pintar(); const id = new URLSearchParams(location.search).get('caso'); if(id) abrir(id);
  }
})();
