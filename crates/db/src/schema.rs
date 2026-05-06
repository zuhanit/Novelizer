pub const CREATE_TABLES: &str = "
CREATE TABLE IF NOT EXISTS repositories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    path        TEXT NOT NULL,
    owner       TEXT NOT NULL,
    created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
    id          TEXT PRIMARY KEY,
    repo_id     TEXT NOT NULL REFERENCES repositories(id),
    name        TEXT NOT NULL,
    path        TEXT NOT NULL
);
";
