CREATE TABLE regulatory_deadlines (

    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,
    regulatory_body VARCHAR(120) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    category VARCHAR(80) NOT NULL,

    description VARCHAR(2000) NOT NULL,

    deadline_date DATE NOT NULL,
    reminder_date DATE,

    status VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',

    responsible_team VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    owner_email VARCHAR(150) NOT NULL,

    reference_url VARCHAR(500),
    ai_description VARCHAR(4000),
    ai_recommendations VARCHAR(4000),

    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 🔍 INDEXES
CREATE INDEX idx_deadline_date ON regulatory_deadlines(deadline_date);
CREATE INDEX idx_status ON regulatory_deadlines(status);
CREATE INDEX idx_priority ON regulatory_deadlines(priority);
CREATE INDEX idx_active ON regulatory_deadlines(active);
CREATE INDEX idx_owner_email ON regulatory_deadlines(owner_email);