CREATE TABLE audit_log (

    id BIGSERIAL PRIMARY KEY,

    action VARCHAR(50) NOT NULL,              -- CREATE / UPDATE / DELETE

    entity_name VARCHAR(100) NOT NULL,        -- RegulatoryDeadline, AppUser, etc.
    entity_id BIGINT,                         -- matches Long in Java

    performed_by VARCHAR(150),                -- user email
    role VARCHAR(50),                         -- USER / ADMIN

    status VARCHAR(20) NOT NULL,              -- SUCCESS / FAILED
    message TEXT,                             -- error or info

    old_value JSONB,                          -- before update
    new_value JSONB,                          -- after update

    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 🔍 INDEXES (IMPORTANT)
CREATE INDEX idx_audit_entity ON audit_log(entity_name, entity_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_user ON audit_log(performed_by);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);