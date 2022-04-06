# Sub-packages of `hatsushimo`

Folders here and under `plugins` are sub-packages of `hatsushimo`, and created via `git-subtree` command.

All changes to these sub-packages would be push to `hatsushimo` repository, so there are some extra steps to be done when you want to push to sub-packages individually.

## `git-subtree` commands

### `git-subtree add`

> `git subtree add --prefix=<folder-path> <git-repo> <branch> [--squash]`

    * `--prefix=<folder-path>`: The path of the sub-package.
    * `<git-repo>`: The git repository of the sub-package.
    * `<branch>`: The branch of the sub-package.
    * `--squash`: Squash the changes of the sub-package into the main package.

This command is used to add a sub-package to the main workspace.

It is recommanded to use `git remote add <name> <git-repo>` to add a short name to the git repository of the sub-package.

### `git-subtree pull`

> `git subtree pull --prefix=<folder-path> <name> <branch> [--squash]`

    * `--prefix=<folder-path>`: The path of the sub-package.
    * `<name>`: The short name of the git repository of the sub-package.
    * `<branch>`: The branch of the sub-package.
    * `--squash`: Squash the changes of the sub-package into the main package.

This command would pull the changes of the sub-package into the main workspace, just like `git pull`.

### `git-subtree push`

> `git subtree push --prefix=<folder-path> <name> <branch>`

    * `--prefix=<folder-path>`: The path of the sub-package.
    * `<name>`: The short name of the git repository of the sub-package.
    * `<branch>`: The branch of the sub-package.

This command would push the changes of the sub-package into the git repository of the sub-package, just like `git push`.
