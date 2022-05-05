export enum EmailType {
  SMTP = 'SMTP',
  EWS = 'EWS',
}

export enum Role {
  ADMIN = 'ADMINISTRATOR',
  USER = 'USER',
}

export enum LogType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHANGE_PASSWORD = 'CHANGEPASSWORD',
  INFOMATION = 'INFOMATION',
  ERROR = 'ERROR',
  RESET_PASSWORD = 'RESETPASSWORD',
  REVERSE_USER = 'REVERSEUSER',
  EMAIL = 'EMAIL',
}

export enum PermissionAPI {
  UPDATE_USER = 'UPDATEUSER',
  DELETE_USER = 'DELETEUSER',
  INSERT_USER = 'INSERTUSER',
  VIEW_USER_MANAGER = 'VIEWUSERMANAGER',
  VIEW_SYSTEM_MANAGER = 'VIEWSYSTEMMANAGER',
  VIEW_STATISTICS = 'VIEWSTATISTICS',
  VIEW_SETTINGS_MANAGER = 'VIEWSETTINGSMANAGER',
  VIEW_NOTIFICATION_MANAGER = 'VIEWNOTIFICATIONMANAGER',
  VIEW_USER_BEHAVIORLOG = 'VIEWUSERBEHAVIORLOG',
  VIEW_LOG = 'VIEWLOG',
  VIEW_DASHBOARD = 'VIEWDASHBOARD',
  VIEW_SYSTEMLOG = 'VIEWSYSTEMLOG',
  VIEW_EMAIL_CONFIGURATION = 'VIEWEMAILCONFIGURATION',
  INSERT_EMAIL_CONFIGURATION = 'INSERTEMAILCONFIGURATION',
  DELETE_EMAIL_CONFIGURATION = 'DELETEEMAILCONFIGURATION',
  UPDATE_EMAIL_CONFIGURATION = 'UPDATEEMAILCONFIGURATION',
  VIEW_PERMISSION_MANAGER = 'VIEWPERMISSIONMANAGER',
  UPDATE_PERMISSION = 'UPDATEPERMISSION',
  UPDATE_NOTIFICATION_MANAGER = 'UPDATENOTIFICATIONMANAGER',
}

export enum ServiceLog {
  SERVICEDB = 'serviceDB',
  SAMSERVICE = 'SAMService',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum OptionTime {
  OTHER = 'OTHER',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum ConditionAlert {
  ABOVE_OR_EQUAL = 'ABOVEOREQUAL',
  ABOVE = 'ABOVE',
  BELOW_OR_EQUAL = 'BELOWOREQUAL',
  BELOW = 'BELOW',
  EQUAL = 'EQUAL',
}

export enum SendTypeEmail {
  ONCE = 'ONCE',
  FREQUENTLY = 'FREQUENTLY',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum TypeAlert {
  CPU = 'CPU',
  RAM = 'RAM',
  STORAGE = 'STORAGE',
}
