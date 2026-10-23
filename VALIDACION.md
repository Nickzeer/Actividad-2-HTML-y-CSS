# Validación y pruebas

Fecha: 23 de octubre de 2026.

## Validación HTML con W3C

Se enviaron los seis archivos HTML al [Nu HTML Checker del W3C](https://validator.w3.org/nu/) mediante POST a https://validator.w3.org/nu/?out=json, con Content-Type text/html; charset=utf-8. El servicio respondió HTTP 200, versión 26.10.18, con messages vacío en cada archivo.

| Archivo | Errores | Advertencias |
| --- | ---: | ---: |
| index.html | 0 | 0 |
| reportar.html | 0 | 0 |
| rescates.html | 0 | 0 |
| version-css/index.html | 0 | 0 |
| version-css/reportar.html | 0 | 0 |
| version-css/rescates.html | 0 | 0 |

Las respuestas originales están en [evidencias/validacion-w3c.json](evidencias/validacion-w3c.json). Los enlaces, recursos, anclas y huellas SHA-256 de los HTML se verificaron localmente; véase [evidencias/comprobacion-enlaces.json](evidencias/comprobacion-enlaces.json).

Para repetir manualmente: abra el validador, elija el ingreso por archivo o texto, cargue cada HTML y ejecute Check.

## Pruebas funcionales en navegador

- Carga de Inicio, Reportar rescate y Rescates.
- El envío vacío detecta los campos obligatorios.
- Se registró Nube · prueba de registro como Perros, urgencia Baja, con ubicación y descripción válidas.
- El sistema generó R-2026-004, mostró confirmación y permitió abrir su ficha.
- El registro persistió después de recargar.
- La búsqueda Nube devolvió un caso; una búsqueda inexistente mostró el mensaje de lista vacía.
- El filtro Gatos devolvió únicamente el caso Luna; Restablecer recuperó todos los casos.
- El dashboard pasó de 3 a 4 rescates y de 2 a 3 animales en cuidado, manteniendo 1 caso de prioridad alta.
- Se revisó visualmente la versión CSS a 600 px y 1280 px; el formulario de escritorio no presentó desbordamiento horizontal.

Los registros de prueba están en el almacenamiento del navegador de pruebas, no en los archivos publicados. Una instalación nueva parte de los tres ejemplos iniciales.

## Evidencia visual

- [Inicio con CSS](evidencias/01-inicio-css.jpg): resumen actualizado tras el registro de prueba.
- [Formulario con confirmación](evidencias/02-reportar-css.jpg).
- [Listado con el nuevo caso](evidencias/03-rescates-css.jpg).
- [Ficha del caso registrado](evidencias/04-ficha-registrada.jpg).
- [Inicio sin CSS](evidencias/05-inicio-sin-css.jpg).

El CSS se revisó visualmente. La validación automática W3C documentada corresponde al HTML.
