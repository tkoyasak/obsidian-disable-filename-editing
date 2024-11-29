import { type App, Notice, moment, normalizePath } from 'obsidian'
import { ulid } from 'ulid'
import { v7 as uuid } from 'uuid'
import type ObsidianPlugin from '../main'

export class NewNotes {
  constructor(
    private readonly plugin: ObsidianPlugin,
    private readonly app: App,
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

  /**
   * Create a new note with a unique id.
   */
  private async createNewNote(): Promise<void> {
    const id = generateUID(this.plugin.settings.uidType)
    const folder = this.app.fileManager.getNewFileParent('').path
    const path = normalizePath(`${folder}/${id}.md`)

    if (this.app.vault.getFileByPath(path)) {
      new Notice('Error: Generated id collision. Please try again.')
      return
    }

    const file = await this.app.vault.create(path, '')
    const date = moment.unix(file.stat.ctime).format('YYYY-MM-DD')

    await this.app.vault.modify(
      file,
      `---
id: ${id}
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
