-- Add stamp_message localized columns to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS stamp_message_es TEXT DEFAULT NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS stamp_message_en TEXT DEFAULT NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS stamp_message_fr TEXT DEFAULT NULL;
