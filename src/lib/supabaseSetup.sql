-- ============================================================
-- LEGADO INCA — Supabase Schema Setup
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. GPS Locations (sincronización entre dispositivos)
CREATE TABLE IF NOT EXISTS gps_locations (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  notas TEXT DEFAULT '',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  created_at BIGINT NOT NULL,
  device_info TEXT DEFAULT '',
  created_by TEXT DEFAULT 'admin'
);

ALTER TABLE gps_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gps_locations_all" ON gps_locations
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- 2. Admin Notifications (notificaciones en tiempo real al admin)
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  origen TEXT NOT NULL,
  leida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_notifications_all" ON admin_notifications
  FOR ALL TO anon USING (true) WITH CHECK (true);
