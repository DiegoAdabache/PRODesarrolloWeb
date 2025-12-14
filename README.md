# Proyecto 2 - Introducción al desarrollo web
Segundo proyecto de la materia introducción al desarrollo web.
Integrantes del equipo:
1. Diego Federico Romero Miravete
2. Diego Azahed Adabache Gutiérrez
3. Samuel Rodrigo Orduña Ferreira

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