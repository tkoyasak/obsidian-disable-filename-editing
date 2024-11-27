import { type App, Notice, moment, normalizePath } from 'obsidian'
import { ulid } from 'ulid'
import { v7 as uuid } from 'uuid'
import type ObsidianPlugin from '../main'

export class NewNotes {
  constructor(
    private readonly app: App,
    private readonly plugin: ObsidianPlugin,
  ) {}

  public async registerCommands(): Promise<void> {
    this.plugin.addCommand({
      id: 'create-new-note',
      name: 'Create new note',
      callback: async () => {
        await this.createNewNote()
      },
    })
  }

  public unregisterCommands(): void {
    this.plugin.removeCommand('create-new-note')
  }

  private async createNewNote(): Promise<void> {
    const { uidType, newNoteFolder } = this.plugin.settings
    const normalizedPath = normalizePath(newNoteFolder)

    if (!this.app.vault.getFileByPath(normalizedPath)) {
      new Notice("Error: Folder doesn't exist. Please check the settings.")
      return
    }

    const uid = generateUID(uidType)
    const newNotePath = `${normalizedPath}/${uid}.md`

    if (this.app.vault.getFileByPath(newNotePath)) {
      new Notice('Error: Generated id collision. Please try again.')
      return
    }

    const file = await this.app.vault.create(newNotePath, '')
    const date = moment.unix(file.stat.ctime).format('YYYY-MM-DD')

    await this.app.vault.modify(
      file,
      `---
id: ${uid}
created_at: ${date}
modified_at: ${date}
title: Untitled
tags: []
---

`,
    )

    await this.app.workspace.getLeaf().openFile(file)
  }
}

export const UID_CATALOG = {
  ulid,
  uuid,
} as const

type UIDType = keyof typeof UID_CATALOG

export function generateUID(type: string): string {
  return UID_CATALOG[type as UIDType]()
}
