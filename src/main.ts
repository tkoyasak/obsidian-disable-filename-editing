import { Plugin } from 'obsidian'
import { NewNotes } from './features/new-notes.ts'
import { DEFAULT_SETTINGS, type Settings } from './settings.ts'
import { SettingTab } from './ui/setting-tab.ts'

export default class ObsidianPlugin extends Plugin {
  settings!: Settings
  newNotes!: NewNotes

  public override async onload(): Promise<void> {
    this.settings = await this.loadSettings()

    this.newNotes = new NewNotes(this, this.app)
    this.newNotes.registerCommands()

    this.addSettingTab(new SettingTab(this, this.settings))
  }

  public override onunload(): void {
    this.newNotes.unregisterCommands()
  }

  public async loadSettings(): Promise<Settings> {
    return Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }
}
