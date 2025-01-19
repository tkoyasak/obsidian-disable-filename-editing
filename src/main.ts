import { FileView, Plugin, type WorkspaceLeaf } from 'obsidian'
import { DEFAULT_SETTINGS, type Settings } from './settings.ts'
import { SettingTab } from './ui/setting-tab.ts'

export default class ObsidianPlugin extends Plugin {
  settings!: Settings

  public override async onload(): Promise<void> {
    await this.loadSettings()

    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.iterateRootLeaves((leaf) => {
        if (!(leaf.view instanceof FileView) || !leaf.view.file) return
        this.setContentEditableFalse(leaf)
      })
    })

    this.registerEvent(
      this.app.workspace.on('file-open', (file) => {
        if (!file) return
        this.app.workspace.iterateRootLeaves((leaf) => {
          if (!(leaf.view instanceof FileView) || !leaf.view.file) return
          if (leaf.view.file.path !== file.path) return
          this.setContentEditableFalse(leaf)
        })
      }),
    )

    this.addSettingTab(new SettingTab(this, this.settings))
  }

  public override onunload(): void {
    /**
     * No need to clean up resources that are guaranteed to be removed when your plugin unloads. Use methods like `addCommand` or `registerEvent`.
     * @see {@link https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Clean+up+resources+when+plugin+unloads}
     */
  }

  public async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }

  private setContentEditableFalse(leaf: WorkspaceLeaf): void {
    const el = leaf.view.containerEl
    const elements = [
      ...Array.from(el.querySelectorAll('.inline-title')),
      ...Array.from(el.querySelectorAll('.view-header-title')),
    ]
    for (const el of elements) {
      el.setAttribute('contenteditable', 'false')
    }
  }
}
