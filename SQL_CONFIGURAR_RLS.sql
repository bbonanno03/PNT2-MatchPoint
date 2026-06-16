-- ============================================
-- CONFIGURACIÓN FINAL DE SUPABASE (ACTUALIZADO PARA DESARROLLO)
-- Ejecuta este SQL en el SQL Editor de Supabase
-- ============================================

-- 0. Insertar las canchas disponibles
INSERT INTO courts (id, name, sport, club, location, price, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Cancha Pádel 1', 'Pádel', 'MatchPoint Club', 'Villa Sarmiento', 12000, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Cancha Tenis 1', 'Tenis', 'MatchPoint Club', 'Villa Sarmiento', 15000, true)
ON CONFLICT (id) DO UPDATE SET active = true;

-- 1. Insertar políticas por defecto
INSERT INTO policies (max_active_reservations, cancellation_hours, opening_time, closing_time)
VALUES (5, 24, '08:00'::time, '23:00'::time)
ON CONFLICT DO NOTHING;

-- 2. Habilitar RLS en las tablas
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE RLS PARA COURTS (MODIFICADO CRUD COMPLETO)
-- ============================================

-- Limpieza preventiva de políticas previas para evitar conflictos al re-ejecutar
DROP POLICY IF EXISTS "anyone_can_view_active_courts" ON courts;
DROP POLICY IF EXISTS "only_authenticated_can_insert_courts" ON courts;
DROP POLICY IF EXISTS "anyone_can_view_courts" ON courts;
DROP POLICY IF EXISTS "anyone_can_insert_courts" ON courts;
DROP POLICY IF EXISTS "anyone_can_update_courts" ON courts;
DROP POLICY IF EXISTS "anyone_can_delete_courts" ON courts;

-- Todos pueden ver las canchas
CREATE POLICY "anyone_can_view_courts" 
  ON courts FOR SELECT 
  USING (true);

-- Permitir agregar canchas desde el panel de Admin de la app
CREATE POLICY "anyone_can_insert_courts" 
  ON courts FOR INSERT 
  WITH CHECK (true);

-- Permitir modificar canchas (cambios de estado, precios o nombres)
CREATE POLICY "anyone_can_update_courts" 
  ON courts FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

-- Permitir eliminar canchas físicamente de la base de datos (Arregla el bug del F5)
CREATE POLICY "anyone_can_delete_courts" 
  ON courts FOR DELETE 
  USING (true);

-- ============================================
-- POLÍTICAS DE RLS PARA RESERVATIONS
-- ============================================

-- Los usuarios pueden ver solo sus propias reservas
CREATE POLICY "users_view_own_reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propias reservas
CREATE POLICY "users_create_own_reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden cancelar solo sus propias reservas
CREATE POLICY "users_update_own_reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE RLS PARA POLICIES
-- ============================================

-- Solo se puede leer (no modificar desde la app)
CREATE POLICY "anyone_can_view_policies"
  ON policies FOR SELECT
  USING (true);

-- Nadie puede insertar/actualizar desde la app
CREATE POLICY "nobody_can_modify_policies"
  ON policies FOR INSERT
  WITH CHECK (false);

CREATE POLICY "nobody_can_update_policies"
  ON policies FOR UPDATE
  WITH CHECK (false);

-- ============================================
-- CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_court_id ON reservations(court_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_courts_active ON courts(active);

-- ============================================
-- VERIFICAR QUE TODO ESTÁ LISTO
-- ============================================

-- Ver si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courts', 'reservations', 'policies');

-- Ver si hay datos en policies
SELECT * FROM policies;

-- Listo ✅
