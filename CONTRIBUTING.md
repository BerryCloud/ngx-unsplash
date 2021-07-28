## Releasing a new version

```bash
git checkout -b release-x.x.x
git push --set-upstream origin release-x.x.x
```

Note: x.x.x should be the next version not the current version.

```bash
cd projects/ngx-unsplash
npm version x
```

Note: x should be replaced with either major, minor or patch.

The tag be will automatically pushed.

Github actions will build and deploy the tag.

A pull request should then be created for the release branch.
