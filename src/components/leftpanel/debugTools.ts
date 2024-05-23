import { action } from 'mobx'
import { logError } from '../../misc/utils.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'

export const dumpFileTreeStructure = action(() => {
  navigator.clipboard.writeText(JSON.stringify(fileTreeStore.fileTreeData))
    .catch(logError)
})