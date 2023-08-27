export enum RoomStatus {
  KEEPING = 'KEEPING',
  CLEANING = 'CLEANING',
  AVAILABLE = 'AVAILABLE',
  NEEDS_CLEANING = 'NEEDS CLEANING',
  NEEDS_MAINTAINANCE = 'NEEDS MAINTAINANCE',
  MAINTAINANCE_IN_PROGRESS = 'MAINTAINANCE IN PROGRESS',
}

export enum RoomType {
  DELUXE = 'deluxe',
  TRIPLE = 'triple',
  SINGLE = 'single',
  TWIN = 'twin',
  FAMILY = 'family',
  DOUBLE = 'double',
}

export enum CleanType {
  GENERAL_CLEANING = 'GENERAL_CLEANING',
}

export enum RoomSortBy {
  new_created = 'new_created',
  old_created = 'old_created',
}
