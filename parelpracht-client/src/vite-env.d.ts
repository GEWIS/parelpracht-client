/// <reference types="vite/client" />

declare interface CommitInfo {
  hash: string;
  shortHash: string;
  date: string;
  tags: string[];
}

declare interface CommitHistory {
  lastCommit: CommitInfo;
  lastRelease: CommitInfo;
}

declare const __LAST_COMMIT_INFO: CommitHistory;
