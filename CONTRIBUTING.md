## Publishing a new version

### Creating a release branch
```bash
git checkout -b release-x.x.x
git push --set-upstream origin release-x.x.x
```

Note: x.x.x should be the next version not the current version.

### Setting the version

```bash
cd projects/ngx-unsplash
npm version x
```

Note: x should be replaced with either major, minor or patch. The `npm version` command will create and push a tag for the version.

### Creating a GitHub Release

Next, create a [GitHub release](https://github.com/BerryCloud/ngx-unsplash/releases) for the newly created version tag.

Once the GitHub release has been created, GitHub actions will build publish the new version.

### Merging the release branch into main

A pull request should then be created for the release branch to merge the changes back into main.

Note: Inorder to see the tag on the main branch, the changes should be merged back into main rather than squashed.
