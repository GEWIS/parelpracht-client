import  { releaseConfig } from '@gewis/release-config';

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main", "feat/update-changelog-on-release"],
  ...releaseConfig,
  plugins: [
    ...releaseConfig.plugins,
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "parelpracht-client/src/changelog.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["parelpracht-client/src/changelog.md"]
      }
    ]
  ]
};
