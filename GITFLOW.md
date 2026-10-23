# Gitflow de la actividad

Repositorio: https://github.com/Nickzeer/Actividad-2-HTML-y-CSS

## Ramas

- main: punto de partida del repositorio, con su README inicial.
- develop: creada desde main para integrar la actividad.
- feature/maquetacion-html: creada desde develop para construir las tres interfaces, el complemento CSS y su evidencia.

## Integración

El código se entrega por medio de un pull request desde feature/maquetacion-html hacia develop, usando un commit de merge para conservar la historia de la rama. La rama feature se conserva como evidencia.

- [Ver develop](https://github.com/Nickzeer/Actividad-2-HTML-y-CSS/tree/develop).
- [Ver feature/maquetacion-html](https://github.com/Nickzeer/Actividad-2-HTML-y-CSS/tree/feature/maquetacion-html).
- [Ver pull requests](https://github.com/Nickzeer/Actividad-2-HTML-y-CSS/pulls?q=is%3Apr).

Para consultar el flujo desde Git:

    git clone https://github.com/Nickzeer/Actividad-2-HTML-y-CSS.git
    cd Actividad-2-HTML-y-CSS
    git switch develop
    git log --graph --oneline --all

La entrega principal está en los tres HTML de la raíz. La carpeta version-css contiene el complemento visual solicitado en la parte final de la consigna.
