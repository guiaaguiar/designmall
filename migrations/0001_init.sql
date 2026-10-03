-- Design Mall — estrutura inicial do conteúdo da landing.
-- Aplicar: npm run db:migrate:local  |  npm run db:migrate:remote

-- Configurações globais (JSON). Chave principal: 'site'.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seções modulares da página. `data` é JSON validado pelo schema do `type`.
CREATE TABLE IF NOT EXISTS sections (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL,
  anchor     TEXT,
  position   INTEGER NOT NULL DEFAULT 0,
  enabled    INTEGER NOT NULL DEFAULT 1,
  data       TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections (enabled, position);

CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  slug     TEXT NOT NULL UNIQUE,
  name     TEXT NOT NULL,
  tone     TEXT NOT NULL DEFAULT 'pink',
  icon     TEXT NOT NULL DEFAULT 'bag',
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stores (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  category_id       TEXT REFERENCES categories (id) ON DELETE SET NULL,
  floor             TEXT,
  unit              TEXT,
  short_description TEXT,
  description       TEXT,
  logo_url          TEXT,
  cover_url         TEXT,
  phone             TEXT,
  whatsapp          TEXT,
  instagram         TEXT,
  website           TEXT,
  hours             TEXT,
  tags              TEXT NOT NULL DEFAULT '[]',
  featured          INTEGER NOT NULL DEFAULT 0,
  position          INTEGER NOT NULL DEFAULT 0,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores (category_id);
CREATE INDEX IF NOT EXISTS idx_stores_listing ON stores (active, featured, position);

CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  tag         TEXT,
  description TEXT,
  image_url   TEXT,
  starts_at   TEXT,
  ends_at     TEXT,
  cta_label   TEXT,
  cta_url     TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_listing ON events (active, position);
