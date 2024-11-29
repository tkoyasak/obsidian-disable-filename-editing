import { PluginSettingTab, Setting } from 'obsidian'
import { UID_CATALOG } from '../features/new-notes'
import type ObsidianPlugin from '../main'
import type { Settings } from '../settings'

export class SettingTab extends PluginSettingTab {
  constructor(
    private readonly plugin: ObsidianPlugin,
    private readonly settings: Settings,
  ) {
    super(plugin.app, plugin)
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    containerEl.createEl('h2', { text: 'Settings' })

    new Setting(containerEl)
      .setName('Folder to create new notes in')
      .setDesc(
        'New notes placed in this folder. Check it in `Files and links` tab.',
      )
      .addDropdown((c) => {
        const { path } = this.app.fileManager.getNewFileParent('')
        c.setDisabled(true).addOption('default', path)
      })

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
          .setValue(this.settings.uidType)
          .onChange(async (v) => {
            this.settings.uidType = v
            await this.plugin.saveSettings()
          })
      })
  }
}
