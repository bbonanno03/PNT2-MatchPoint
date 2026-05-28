# PNT2-BiblioTech
Programacion de Nuevas Tecnologias Trabajo Final

BiblioTech - Sistema de Gestión de Biblioteca
Descripción del Proyecto

BiblioTech es una plataforma web diseñada para gestionar de manera eficiente las operaciones de una biblioteca, facilitando el control de prestamos, inventario y acceso a la informacion tanto para lectores como para administradores.
Problemas que Resuelve

    Trazabilidad de prestamos: Seguimiento completo del historial de prestamos por usuario y libro
    Control de inventario: Gestion de disponibilidad y unidades de libros
    Acceso a informacion: Portal centralizado para consultar catalogo y reglas de la biblioteca
    Recomendaciones inteligentes: Sugerencias de lectura basadas en IA

Perfiles de Usuario
Lector

    Consultar catalogo de libros disponibles
    Solicitar prestamos (segun reglas establecidas)
    Ver historial personal de prestamos
    Recibir recomendaciones de libros mediante IA
    Consultar reglas de la biblioteca

Administrador

    Todas las funcionalidades del lector
    CRUD completo de libros (crear, editar, eliminar)
    Gestionar reglas de la biblioteca (dias de prestamo, limite de libros)
    Ver metricas y estadisticas (total de prestamos, por usuario, historial general)
    Gestionar prestamos de todos los usuarios

Reglas de Negocio
Gestion de Unidades

    Un libro puede tener multiples unidades fisicas
    unidades_disponibles se actualiza con cada prestamo/devolucion
    No permitir prestamos si unidades_disponibles === 0

Reglas de Prestamo

    Un lector no puede prestar mas libros que el max_libros_simultaneos (configurable, por defecto 3)
    La fecha_devolucion_esperada se calcula automaticamente: fecha_prestamo + dias_prestamo (configurable, por defecto 14 dias)
    Los prestamos vencidos deben marcarse automaticamente cuando pasa la fecha de devolucion esperada

Estados de Prestamo

    activo: El libro esta prestado y dentro del plazo
    vencido: El libro esta prestado y paso la fecha de devolucion esperada
    devuelto: El libro fue devuelto exitosamente

Guia de Funcionalidades
1. Autenticacion

Login:

    Email: admin@bibliotech.com (administrador)
    Email: lector@bibliotech.com (lector)
    Contrasena: cualquier valor funciona en modo demo

Registro:

    Nuevo usuario se crea con rol "lector" por defecto

2. Catalogo de Libros

    Ver todos los libros disponibles en grid
    Filtrar por:
        Busqueda (titulo o autor)
        Genero
        Disponibilidad (disponibles/sin stock)
    Click en libro para ver detalles
    En detalles:
        Ver informacion completa
        Obtener recomendaciones IA
        Solicitar prestamo (si hay disponibilidad)

3. Mis Prestamos

    Ver prestamos activos y vencidos
    Ver historial de libros devueltos
    Devolver libro (actualiza disponibilidad)

4. Reglas de Biblioteca (Admin)

    Ver reglas actuales (dias de prestamo, maximo de libros)
    Editar reglas (solo administrador)

5. Gestion de Libros (Admin)

    Ver lista de todos los libros
    Crear nuevo libro
    Editar libro existente
    Eliminar libro (con confirmacion)

6. Metricas (Admin)

    Ver total de prestamos
    Ver prestamos activos
    Ver prestamos vencidos
    Ver libros devueltos
    Ver prestamos por usuario
    Ver historial completo de prestamos

7. Chat IA

    Boton flotante en esquina inferior derecha
    Preguntas sobre libros, generos o recomendaciones
    Respuestas generadas por Google Gemini AI
