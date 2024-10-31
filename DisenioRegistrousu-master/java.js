// Obtiene el elemento de entrada y el botón del DOM
const input = document.getElementById('borrarV');
const button = document.getElementById('boton');

// Añade un evento al campo de entrada para habilitar o deshabilitar el botón
input.addEventListener('input', function() {
    // Si el valor de entrada termina con '/borrar', habilita el botón, de lo contrario, deshabilítalo
    if (input.value.trim().endsWith('/borrar')) {
        button.disabled = false; 
    } else {
        button.disabled = true;
    }
});

// Función para borrar un club
function Borrar() {
    // Obtiene el texto de entrada y elimina '/borrar'
    const inputText = input.value.trim();
    const nombreClub = inputText.replace('/borrar', '').trim();

    // Valida que se haya ingresado un nombre de club
    if (!nombreClub) {
        alert('Por favor, ingresa un nombre de club válido.');
        return;
    }

    // Busca el club por nombre en la base de datos
    fetch(`http://localhost:3000/clubs?usuario=${nombreClub}`)
        .then(response => response.json())
        .then(data => {
            // Si no se encuentra ningún club, muestra un mensaje de alerta
            if (data.length === 0) {
                alert('Club no encontrado.');
                return;
            }

            // Obtiene el ID del club encontrado
            const clubId = data[0].id;

            // Si se encuentra el club, envía la solicitud de eliminación
            fetch(`http://localhost:3000/clubs/${clubId}`, {
                method: 'DELETE',
            })
            .then(response => {
                // Verifica si la respuesta es correcta
                if (response.ok) {
                    alert(`Club ${nombreClub} eliminado correctamente.`);
                    input.value = ''; // Limpia el campo de entrada
                    button.disabled = true; // Deshabilita el botón
                } else {
                    alert('Error al eliminar el club.');
                }
            })
            .catch(error => {
                // Manejo de errores en la solicitud de eliminación
                console.error('Error en la solicitud de eliminación:', error);
                alert('Error de conexión al servidor.');
            });
        })
        .catch(error => {
            // Manejo de errores en la solicitud de búsqueda
            console.error('Error en la solicitud de búsqueda:', error);
            alert('Error de conexión al servidor.');
        });
}

// Función para validar la coincidencia de contraseñas
function validarC() {
    const contraseña = document.getElementById("contraseña2").value;
    const repetirContraseña = document.getElementById("repetir-contraseña").value;

    // Verifica que ambos campos estén completos
    if (!contraseña || !repetirContraseña) {
        alert("Por favor, completa todos los campos.");
        return false;
    }

    // Comprueba si las contraseñas coinciden
    if (contraseña !== repetirContraseña) {
        alert("Las contraseñas no coinciden.");
        document.getElementById("repetir-contraseña").focus(); // Enfoca el campo de repetir contraseña
        return false;
    }

    return true; // Retorna true si todo es válido
}

// Función para registrar un nuevo club
function registrarUsuario() {
    if (!validarC()) return; // Valida los campos antes de continuar

    // Crea un objeto nuevoClub con los datos del formulario
    const nuevoClub = {
        usuario: $('#usuario-registro').val(),
        contraseña: $('#contraseña2').val(),
        correo: $('#correo').val()
    };

    // Realiza una solicitud POST para agregar el nuevo club
    $.ajax({
        url: 'http://localhost:3000/clubs', // URL de la API para registrar el club
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevoClub), // Convierte el objeto a formato JSON
        success: function(response) {
            alert('Usuario registrado correctamente.'); // Mensaje de éxito
            console.log('Usuario añadido:', response); // Registro en consola
        },
        error: function(xhr, status, error) {
            // Manejo de errores en la solicitud de registro
            console.error('Error al registrar el usuario:', xhr.responseText);
            alert('Hubo un error al registrar el usuario: ' + xhr.responseText);
        }
    });
}

// Función para iniciar sesión
function iniciarSesion() {
    const usuario = $('#usuario').val(); // Obtiene el usuario
    const contraseña = $('#contraseña').val(); // Obtiene la contraseña

    // Verifica que se hayan ingresado los datos
    if (!usuario || !contraseña) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Realiza una consulta para verificar el usuario
    $.ajax({
        url: 'http://localhost:3000/clubs?usuario=' + usuario, // Filtra por usuario
        method: 'GET',
        contentType: 'application/json',
        success: function(respuesta) {
            // Comprueba si se encontró el usuario
            if (respuesta.length === 0) {
                alert("Usuario no encontrado.");
            } else {
                const clubEncontrado = respuesta[0]; // Obtiene el primer resultado
                // Verifica si la contraseña es correcta
                if (clubEncontrado.contraseña === contraseña) {
                    window.location.href = 'index.html'; // Redirige a la página principal
                } else {
                    alert("Contraseña incorrecta."); // Mensaje de error
                }
            }
        },
        error: function(xhr, status, error) {
            // Manejo de errores en la solicitud de inicio de sesión
            console.error('Error al iniciar sesión:', xhr.responseText);
            alert('Hubo un error al intentar iniciar sesión: ' + xhr.responseText);
        }
    });
}
