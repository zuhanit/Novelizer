use std::path::Path;
use thiserror::Error;

pub async fn init(path: &Path) -> Result<(), gix::init::Error> {
    let kind = gix::create::Kind::WithWorktree;
    let options = gix::create::Options {
        destination_must_be_empty: false,
        fs_capabilities: None,
    };

    gix::ThreadSafeRepository::init(path, kind, options)?;
    Ok(())
}

#[derive(Error, Debug)]
pub enum CommitError {
    #[error("commit failed: {0}")]
    Failed(#[from] git2::Error),
}

pub async fn commit(path: &Path, message: &str) -> Result<(), CommitError> {
    let repo = git2::Repository::open(path)?;

    let mut index = repo.index()?;
    index.add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)?;
    index.write()?;

    let tree_oid = index.write_tree()?;
    let tree = repo.find_tree(tree_oid)?;

    let parent = repo.head().ok().and_then(|h| h.peel_to_commit().ok());
    let parents: Vec<&git2::Commit> = parent.iter().collect();

    let sig = git2::Signature::now("test name", "test email")?;

    repo.commit(Some("HEAD"), &sig, &sig, message, &tree, &parents)?;

    Ok(())
}
