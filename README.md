# Proyecto 2 - Introducción al desarrollo web
Segundo proyecto de la materia introducción al desarrollo web.
Integrantes del equipo:
1. Diego Federico Romero Miravete
2. Diego Azahed Adabache Gutiérrez
3. Samuel Rodrigo Orduña Ferreira
4. Johan Santiago Sánchez Rosales

## Fake Times

Nuestro producto se podría describir como un administrador un 
periódico digital titulado Fake Times. Ofrecemos herramientas 
que son útiles y relevantes para la correcta administración de 
la página. Se basa en la administración de las publicaciones hechas,
es decir, de las noticias, dando los espacios necesarios para hacer,
eliminar, editar y buscar publicaciones de manera eficiente.

Nuestro producto requiere que el usuario se identifique antes de 
poder hacer cualquier modificación, ya que una limitación por
diseño es que los autores solo puedan trabajar en sus propias 
creaciones.

Como se mencionó, se ofrecen herramientas de publicación, edición
y eliminación para los autores que deseen utilizarlas. Nuestro 
producto se encarga de guardar las modificaciones hechas para 
mantener el trabajo realizado.

### Instrucciones para levantar el front-end

Para levantar el front-end se usan las herramientas proporcionadas 
por React y Vite.
Si se desea levantar el front-end tiene que seguir estos pasos:

**Paso 1.** Inicializar la terminal en VisualCode Studio

**Paso 2.** Ingresar a la carpeta frontend con el siguiente comando:
```bash
    cd frontend
```

**Paso 3.** Correr el comando para generar el link a la página web: 
```bash
    npm run dev
```

**Paso 4.** Ingresar el link generado (en este caso http://localhost:5173/)
    en su navegador de preferencia.

### Instrucciones para levantar el backend
Si es la primera vez que abre el proyecto:

**Paso 1.** Abrir terminal en Visual Studio Code

**Paso 2.** Crear ambiente virtual de python con el comando:
```bash
python -m venv myenv
```
**Paso 3.** Activar el ambiente virtual con el comando:
* Windows:
    ```bash
    myenv\Scripts\activate
    ```
* macOS:
    ```bash
    source myenv/bin/activate
    ```
**Paso 4.** Cambiarse a la carpeta de backend con el comando:
```bash
cd backend
```
**Paso 5.** Instalar el requirements.txt con el comando:
```bash
pip install -r requirements.txt
```
**Paso 6.** Para terminar se levanta el backend con el comando:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Si no es la primera vez que corre el proyecto
puede ahorrarse el paso número 5
=======
