export type Settings = {
  uidType: string
}

export const DEFAULT_SETTINGS: Settings = {
  uidType: 'ulid',
} as const
