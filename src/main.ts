import { FileView, Plugin } from 'obsidian'
import { defaultSettings } from './constants.ts'
import type { Settings } from './types.ts'
import { SettingTab } from './ui/setting-tab.ts'

export default class ObsidianPlugin extends Plugin {
  settings!: Settings

  public override async onload(): Promise<void> {
    await this.loadSettings()

    this.addSettingTab(new SettingTab(this, this.settings))

    this.registerEvent(
      this.app.workspace.on('file-open', () => {
        const view = this.app.workspace.getActiveViewOfType(FileView)
        if (!view) return
        this.setContentEditableFalse(view)
      }),
    )

    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.iterateRootLeaves((leaf) => {
        const view = leaf.view
        if (!(view instanceof FileView)) return
        this.setContentEditableFalse(view)
      })
    })
  }

  public override onunload(): void {
    /**
     * No need to clean up resources that are guaranteed to be removed when your plugin unloads. Use methods like `addCommand` or `registerEvent`.
     * @see {@link https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Clean+up+resources+when+plugin+unloads}
     */
  }

  public async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, defaultSettings, await this.loadData())
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }

  private setContentEditableFalse(view: FileView): void {
    const children = view.containerEl.children
    const elements = [
      // children[0] is view-header, children[1] is view-content
      children[0].find('.view-header-title'),
      children[1].find('.inline-title'),
    ]
    for (const el of elements) {
      if (!el) continue
      el.setAttribute('contenteditable', 'false')
    }
  }
}
