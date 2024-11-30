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

    const file = await this.app.vault.create(
      path,
      this.plugin.settings.uidType !== 'diary'
        ? uniqueEntry(id)
        : diaryEntry(id),
    )

    await this.app.workspace.getLeaf().openFile(file)
  }
}

export const UID_CATALOG = {
  ulid,
  uuid,
  diary: () => moment().format('YYYYMM'),
} as const

type UIDType = keyof typeof UID_CATALOG

function generateUID(type: string): string {
  return UID_CATALOG[type as UIDType]()
}

function uniqueEntry(id: string): string {
  return `---
id: ${id}
created_at:
modified_at:
title: Untitled
tags: []
---

`
}

const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

function diaryEntry(id: string): string {
  let content = `---
id: ${id}
created_at:
modified_at:
---
`
  const m = moment(id, 'YYYYMM')
  const n = m.daysInMonth()
  let w = Number.parseInt(m.format('d'), 10)
  for (let i = 1; i <= n; i++) {
    const dd = i.toString().padStart(2, '0')
    const ddd = DOW[w]
    content += `
###### ${id}${dd}${ddd}


`
    w = (w + 1) % 7
  }
  return content
}
