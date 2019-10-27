# Práctica de fundamentos de React

## Funcionalidades:

Esta práctica consta de una aplicación web en la que, a través de un formulario inicial, se accede a anuncios según el tag seleccionado en el registro.
En la home de los anuncios filtrados por tag hay un buscador, el cual permite buscar por los campos que la api nos facilita para tal efecto, pudiéndose buscar por nombre, precio*, si es un artículo que se vende o no y, por tag. Cuando se emite una búsqueda, el resultado que se ofrece es de todos los anuncios que cumplan los criterios de búsqueda.

En la home, también se dispone de un botón para crear más anuncios. El cual nos llevará a un formulario para su creación.

En cada anuncio, hay un botón `read more..` que nos llevará a la ficha del anuncio.
En dicha ficha hay un botón que nos permite editar y actualizar el anuncio.
Cuando se accede a la sección de editar y actualizar, se cargan los valores de cada campo que se quieran cambiar.

*En cuanto a la búsqueda por precio, los valores que se admiten son: 
- -Valor
> Este formato busca los precios inferiores o iguales a Valor
- Valor-
> Este formato busca los precios superiores o iguales a Valor
- Valor-Valor
> Este formato busca los precios entre el rago de valores.

## Especificaciones:

Esta aplicación dispone de un controlador de contexto, el cual permite que, si no se ha accedido previamente al registro, no premitirá navegar por las diferentes rutas de la aplicación.

También está implementado el control de errores `Error Boundary`, mediante el cual se puede controlar los errores propios de la aplicación. Los errores de conexión a la API no son controlables a través del `Error Boundary`.


## Modo de arrancar la aplicación:

En el directorio del proyecto, se puede:

### `npm start`

Se arrancará en modo de desarrollo<br />
Abrir [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recarga automáticamente cuando se edita y se guarda el código.
