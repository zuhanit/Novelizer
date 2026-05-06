mod schema;

use sqlx::SqlitePool;

pub async fn connect(db_path: &str) -> Result<SqlitePool, sqlx::Error> {
    SqlitePool::connect(db_path).await
}

pub async fn migrate(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(schema::CREATE_TABLES).execute(pool).await?;
    Ok(())
}
