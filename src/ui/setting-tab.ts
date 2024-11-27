import { type App, PluginSettingTab, Setting } from 'obsidian'
import { UID_CATALOG } from '../features/new-notes'
import type ObsidianPlugin from '../main'

export class SettingTab extends PluginSettingTab {
  constructor(
    public readonly app: App,
    private readonly plugin: ObsidianPlugin,
  ) {
    super(app, plugin)
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    containerEl.createEl('h2', { text: 'Settings' })

    new Setting(containerEl)
      .setName('Unique identifier type')
      .setDesc('Create new notes with this unique identifier type.')
      .addDropdown((c) => {
        c.addOptions(
          Object.keys(UID_CATALOG).reduce(
            (acc, key) => {
              acc[key] = key
              return acc
            },
            {} as Record<string, string>,
          ),
        )
          .setValue(this.plugin.settings.uidType)
          .onChange(async (v) => {
            this.plugin.settings.uidType = v
            await this.plugin.saveSettings()
          })
      })

    new Setting(containerEl)
      .setName('Override folder to create new notes in')
      .setDesc(
        'Use a different folder to create new notes in than the default one.',
      )
      .addSearch((c) => {
        // TODO: folder path suggestion
        const { path } = this.app.fileManager.getNewFileParent('')
        c.setPlaceholder(`Default: ${path}`)
          .setValue(this.plugin.settings.newNoteFolder)
          .onChange((v) => {
            this.plugin.settings.newNoteFolder = v
            this.plugin.saveSettings()
          })
      })
  }
}
