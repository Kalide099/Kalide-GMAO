-- v7: Add admin_phone to registration requests
ALTER TABLE registration_requests
ADD COLUMN admin_phone VARCHAR(50) NULL AFTER admin_email;
