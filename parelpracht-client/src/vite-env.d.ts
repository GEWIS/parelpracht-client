/// <reference types="vite/client" />

declare interface CommitInfo {
  hash: string;
  shortHash: string;
  date: string;
  lastTag: string;
  lastCommitTags: string[];
}

declare const __LAST_COMMIT_INFO: CommitInfo;
