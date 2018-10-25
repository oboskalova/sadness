import moduleFileManager from './modules/file-manager'
import moduleTemplateEditor from './modules/template-editor'
import modulePlayer from './modules/player'
import moduleModals from './modules/modals'
import moduleUsers from './modules/users'
import moduleDisplays from './modules/displays'
import moduleSchedules from './modules/schedules'
import moduleStatistics from './modules/statistics'
import moduleManage from './modules/manage'

export default {
  modules: {
    fileManager: moduleFileManager,
    templateEditor: moduleTemplateEditor,
    player: modulePlayer,
    modals: moduleModals,
    users: moduleUsers,
    displays: moduleDisplays,
    schedules: moduleSchedules,
    statistics: moduleStatistics,
    manage: moduleManage
  }
}
