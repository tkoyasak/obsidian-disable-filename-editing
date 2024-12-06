import { type App, normalizePath, Notice } from 'obsidian'
import { ulid } from 'ulid'
import { v7 as uuid } from 'uuid'
import { Settings } from '../settings.ts'

export class NewNotes {
  constructor(
    private readonly app: App,
    private readonly settings: Settings,
  ) {}

  /**
   * Create a new note with a unique id.
   */
  public async createNewNote(): Promise<void> {
    const id = UID_CATALOG[this.settings.uidType as UIDType]()
    const folder = this.app.fileManager.getNewFileParent('').path
    const path = normalizePath(`${folder}/${id}.md`)

    if (this.app.vault.getFileByPath(path)) {
      new Notice('Error: Generated id collision. Please try again.')
      return
    }

    const file = await this.app.vault.create(path, entry(id))
    const leaf = this.app.workspace.getLeaf()
    await leaf.openFile(file)
  }
}

export const UID_CATALOG = {
  ulid,
  uuid,
} as const

type UIDType = keyof typeof UID_CATALOG

function entry(id: string): string {
  return `---
id: ${id}
created_at:
modified_at:
title: Untitled
tags: []
---

`
}
