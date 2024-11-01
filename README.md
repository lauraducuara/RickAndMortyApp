🛸 **Rick and Morty App**
🌟 Descripción
Esta es una aplicación React que utiliza la API de Rick and Morty para mostrar detalles sobre episodios, locaciones y personajes de la serie. Los usuarios pueden ver información detallada sobre cada entidad, seleccionar sus favoritos y guardar estas selecciones en una base de datos Firestore de Firebase.

🚀 *Funcionalidades*
Visualización de datos: Muestra episodios, locaciones y personajes con sus respectivas imágenes y datos relevantes.
Favoritos: Permite a los usuarios añadir a favoritos por medio de Redux
Persistencia de datos: Persiste los favoritos.
*🏗️ Estructura del Proyecto*
La aplicación está estructurada en varios componentes y utiliza Redux para la gestión del estado. A continuación se describen las partes principales:
**🚀 Funcionalidades**
*❤️ Favoritos*
Esta funcionalidad permite a los usuarios seleccionar sus locaciones y personajes favoritos de la serie "Rick and Morty". La interfaz ofrece un botón en forma de corazón junto a cada locación y personaje. Al hacer clic en este botón, el elemento se añade a la lista de favoritos del usuario. Esto se logra mediante el uso de Redux, que gestiona el estado de la aplicación de manera eficiente.

¿Cómo Funciona?
Selección de Favoritos:

Cuando el usuario hace clic en el botón del like, se envía una acción a Redux para actualizar el estado de los favoritos.
El estado de los favoritos se almacena en la tienda de Redux, permitiendo que cualquier componente de la aplicación acceda a esta información en tiempo real.

Si el usuario decide quitar un favorito, simplemente puede volver a hacer clic en el botón del like, lo que actualizará el estado en Redux y eliminará el elemento de la lista de favoritos.
*💾 Persistencia de Datos*
Para asegurar que los favoritos del usuario se mantengan incluso después de recargar la página, se usa Firestore, que es la base de datos en tiempo real de Firebase. Firestore permite almacenar datos de forma persistente, lo que significa que los favoritos de cada usuario se guardan y pueden ser recuperados en futuras sesiones.

¿Cómo Funciona:?
Configuración de Firestore:

Al iniciar la aplicación, se establece una conexión con Firestore utilizando las credenciales de Firebase.
Se crean colecciones específicas dentro de Firestore para almacenar los datos de los favoritos, asociándolos a la cuenta del usuario si es necesario.
Guardar Favoritos:

Cuando un usuario añade o quita un favorito por medio del boton "corazón", la acción también actualiza Firestore. Se usan funciones específicas para agregar o eliminar elementos en la colección de favoritos de Firestore.
Esta operación se realiza de manera asíncrona para que la interfaz de usuario no se congele mientras se guardan los datos.
Recuperar Favoritos:

Al cargar la aplicación, se hace una consulta a Firestore para recuperar los favoritos previamente guardados. Esto permite que los usuarios vean sus selecciones inmediatamente al iniciar sesión en la aplicación.
*🛠️ Uso de Redux y Firestore*
Redux: Se utiliza para gestionar el estado de la aplicación de manera centralizada. Esto permite que diferentes componentes accedan y actualicen el estado de los favoritos sin necesidad de pasar props manualmente a través de múltiples niveles de componentes. Las acciones y reducers de Redux se encargan de manejar la lógica de selección y deselección de favoritos.

Firestore: Proporciona la funcionalidad de persistencia de datos. Almacena los favoritos en la base de datos, asegurando que los usuarios no pierdan su selección entre sesiones. Firestore es especialmente útil para aplicaciones que requieren actualizaciones en tiempo real y permite que múltiples usuarios accedan y modifiquen los datos simultáneamente.

*🖥️ Componentes Principales*
Episodios: Muestra una lista de episodios con información básica.
Locaciones: Presenta las locaciones disponibles en la serie.
Personajes: Muestra los personajes con sus imágenes y detalles.
Detalles de Episodio/Personajes/Locaciones: Al hacer clic en un episodio, personaje o locación, se redirige a una página de detalles donde se pueden ver más información.
*🛠️ Botones*
**❤️ Corazón (Guardar Favorito)**
Descripción: Permite a los usuarios marcar una locación, personaje o episodio como favorito.
Funcionamiento:
Al hacer clic en el botón del corazón, se guarda el elemento (locación, personaje o episodio) en la base de datos Firestore.
Si el elemento ya está en la lista de favoritos, el botón se activará para eliminarlo, eliminando así el favorito de la base de datos y del estado de Redux.
**👍 Like (Me Gusta)**
Descripción: Indica que al usuario le gusta la locación, personaje o episodio.
Funcionamiento:
Al hacer clic en el botón "like", se actualiza el estado en Redux para reflejar si al usuario le gusta o no el elemento.
Si el elemento ya tiene un "like", este se quita; si no lo tiene, se añade a la lista de "me gusta". Cabe aclarar que el like se "elimina" una vez se renderice la página.
##------------------------------------------------------------------------##
##⚙️Configuración del Proyecto
Para ejecutar el proyecto, siga los siguientes pasos:

1. Clonar el Repositorio
   ```bash
   git clone https://github.com/lauraducuara/RickAndMortyApp.git
   cd RickAndMortyApp

2. Configurar Firebase
Crear un proyecto en Firebase: Dirijase a Firebase Console y cree un nuevo proyecto.

Habilitar Firestore: En la sección de Firestore, cree una base de datos.

Obtener la configuración de Firebase: Dirijase a la configuración del proyecto y copie las credenciales necesarias.

Configure el Archivo .env: En la raíz del proyecto, con el siguiente contenido proveniente de su Firebase:


REACT_APP_API_KEY=tu_api_key
REACT_APP_AUTH_DOMAIN=tu_auth_domain
REACT_APP_PROJECT_ID=tu_project_id
REACT_APP_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=tu_messaging_sender_id
REACT_APP_APP_ID=tu_app_id

3. Instalar dependencias
Asegúrese de tener Node.js y npm instalados. Luego, ejecute:

npm install

4. Ejecutar la Aplicación
Para iniciar la aplicación, use el siguiente comando:

npm start
Esto abrirá la aplicación en el navegador en http://localhost:3000.