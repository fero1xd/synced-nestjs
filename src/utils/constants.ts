export enum Services {
  AUTH_SERVICE = 'AUTH_SERVICE',
  HASHING_SERVICE = 'HASHING_SERVICE',
  USERS_SERVICE = 'USERS_SERVICE',
  JOBS_SERVICE = 'JOBS_SERVICE',
  FILE_MANAGER_SERVICE = 'FILE_MANAGER_SERVICE',
  GATEWAY_SESSION_MANAGER_SERVICE = 'GATEWAY_SESSION_MANAGER_SERVICE',
  PROJECTS_SERVICE = 'PROJECTS_SERVICE',
  RUNNER = 'RUNNER',
}

export enum Routes {
  AUTH = 'auth',
  JOBS = 'jobs',
  PROJECTS = 'projects',
  USERS = 'users',
}

export enum Queues {
  JOBS = 'jobs',
}

export enum Events {
  OnJobDone = 'onJobDone',
  OnJobCreate = 'onJobCreate',
  OnProjectUpdate = 'onProjectUpdate',
  OnCollaboratorRemove = 'onCollaboratorRemove',
}
