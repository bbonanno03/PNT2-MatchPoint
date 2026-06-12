import { supabase } from './supabase'

/**
 * Servicio de Reservas con Supabase
 * Maneja la persistencia de datos en la base de datos
 */

/**
 * Sprint 3: Crear una reserva en Supabase
 * @param {Object} params
 * @param {string} params.userId - ID del usuario autenticado
 * @param {string} params.courtId - ID de la cancha (UUID)
 * @param {string} params.reservationDate - Fecha en formato YYYY-MM-DD
 * @param {string} params.startTime - Hora de inicio en formato HH:mm
 * @param {string} params.endTime - Hora de fin en formato HH:mm
 * @returns {Promise<Object>} La reserva creada o null en caso de error
 */
export async function createReservation({
  userId,
  courtId,
  reservationDate,
  startTime,
  endTime
}) {
  try {
    if (!userId) {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error('No se encontró un usuario autenticado para crear la reserva.')
      }

      userId = user.id
    }

    // Validar contra policies antes de crear
    const policies = await getPolicies()
    
    if (policies) {
      // Validar horarios
      if (!isWithinBusinessHours(startTime, endTime, policies)) {
        throw new Error(
          `Las reservas deben estar entre ${policies.opening_time} y ${policies.closing_time}`
        )
      }

      // Validar máximo de reservas activas
      const activeCount = await getActiveReservationCount(userId)
      if (activeCount >= policies.max_active_reservations) {
        throw new Error(
          `No podés tener más de ${policies.max_active_reservations} reservas activas`
        )
      }
    }

    // Crear la reserva
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          court_id: courtId,
          reservation_date: reservationDate,
          start_time: startTime,
          end_time: endTime,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al crear reserva:', error)
    throw error
  }
}

/**
 * Sprint 3: Obtener las reservas del usuario autenticado
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de reservas del usuario
 */
export async function getUserReservations(userId) {
  try {
    if (!userId) {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error('No se encontró un usuario autenticado para obtener las reservas.')
      }

      userId = user.id
    }

    const { data, error } = await supabase
      .from('reservations')
      .select(
        `
        id,
        user_id,
        court_id,
        reservation_date,
        start_time,
        end_time,
        status,
        created_at,
        courts(name, club, location, price, image_url)
        `
      )
      .eq('user_id', userId)
      .order('reservation_date', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    throw error
  }
}

/**
 * Sprint 3: Obtener reservas activas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de reservas activas
 */
export async function getActiveReservations(userId) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(
        `
        id,
        user_id,
        court_id,
        reservation_date,
        start_time,
        end_time,
        status,
        created_at,
        courts(name, club, location, price, image_url)
        `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('reservation_date', new Date().toISOString().split('T')[0])
      .order('reservation_date', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error al obtener reservas activas:', error)
    throw error
  }
}

/**
 * Sprint 3: Cancelar una reserva
 * Respeta la política de cancelación (horas mínimas antes del evento)
 * @param {string} reservationId - ID de la reserva
 * @param {string} reservationDate - Fecha de la reserva (YYYY-MM-DD)
 * @param {string} startTime - Hora de inicio (HH:mm)
 * @returns {Promise<Object>} La reserva actualizada
 */
export async function cancelReservation(
  reservationId,
  reservationDate,
  startTime
) {
  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('No se encontró un usuario autenticado para cancelar la reserva.')
    }

    // Validar horas de cancelación contra policies
    const policies = await getPolicies()

    if (policies) {
      const hoursUntilReservation = getHoursUntilReservation(
        reservationDate,
        startTime
      )

      if (hoursUntilReservation < policies.cancellation_hours) {
        throw new Error(
          `Solo podés cancelar con ${policies.cancellation_hours} horas de anticipación`
        )
      }
    }

    // Actualizar el status a cancelled
    const { data, error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al cancelar reserva:', error)
    throw error
  }
}

/**
 * Sprint 3: Obtener las políticas de reservación
 * @returns {Promise<Object|null>} Objeto con políticas o null
 */
export async function getPolicies() {
  try {
    const { data, error } = await supabase
      .from('policies')
      .select(
        'id, max_active_reservations, cancellation_hours, opening_time, closing_time, updated_at'
      )
      .limit(1)
      .single()

    if (error) {
      // La tabla está vacía o no existe, retornar null
      return null
    }

    return data
  } catch (error) {
    console.error('Error al obtener políticas:', error)
    return null
  }
}

/**
 * Sprint 3: Contar las reservas activas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} Cantidad de reservas activas
 */
export async function getActiveReservationCount(userId) {
  try {
    const { data, error, count } = await supabase
      .from('reservations')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Error al contar reservas activas:', error)
    return 0
  }
}

/**
 * Validar que el horario esté dentro de las horas de negocio
 * @private
 */
function isWithinBusinessHours(startTime, endTime, policies) {
  if (!policies) return true

  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const opening = timeToMinutes(policies.opening_time)
  const closing = timeToMinutes(policies.closing_time)

  return start >= opening && end <= closing
}

/**
 * Calcular horas hasta la reserva
 * @private
 */
function getHoursUntilReservation(reservationDate, startTime) {
  const now = new Date()
  const [year, month, day] = reservationDate.split('-')
  const [hours, minutes] = startTime.split(':')

  const reservationDateTime = new Date(year, month - 1, day, hours, minutes, 0)
  const diffMs = reservationDateTime - now
  const diffHours = diffMs / (1000 * 60 * 60)

  return Math.floor(diffHours)
}

/**
 * Convertir tiempo HH:mm a minutos
 * @private
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}
