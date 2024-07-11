# Servidor central

Este repositorio contiene el código relacionado al servidor central del proyecto Cloud Gaming Rental Service descrito en el siguiente [informe](https://docs.google.com/document/d/1Tr2zDrDpN2i8lYJDqmhYYlrNpdic8qFr8d-Lg0Pwezk/edit).

## Dependencias

### Node.js y NPM

Este proyecto requiere Node.js y NPM. Puedes descargarlos e instalarlos desde [aquí](https://nodejs.org/).

Para instalar todas las dependencias necesarias, ejecuta el siguiente comando:

```bash
npm install
```

## Ejecución

Para iniciar el servidor, ejecuta el siguiente comando:

```bash
npm start
```

## Ejecución de Tests

Para ejecutar los tests utilizar el siguiente comando:

```bash
npm test
```

## Consideraciones

El servidor debe estar disponible y en funcionamiento previo a la ejecución del nodo de procesamiento e interfaz grafica. Este servidor maneja la señalización y la autenticación, así como la interacción con la base de datos PostgreSQL y Firebase para almacenamiento y autenticación. Para más detalles sobre los mensajes soportados, la configuración del servidor y la base de datos, refiérase a la sección Protocolos dentro del anexo del informe.
