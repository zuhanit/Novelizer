mod routes;

use axum::{Router, routing::post};
use config::ServerConfig;

#[tokio::main]
async fn main() {
    let config = ServerConfig {
        host: "0.0.0.0".to_string(),
        port: 3000,
    };

    let pool = db::connect("sqlite:./novelizer.db?mode=rwc").await.unwrap();
    db::migrate(&pool).await.unwrap();

    let addr = format!("{}:{}", config.host, config.port);
    let app = Router::new()
        .route("/vcs/init", post(routes::vcs::init))
        .route("/vcs/commit", post(routes::vcs::commit));

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
