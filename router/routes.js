import Home from '../src/components/Home'
import Auth from '../src/components/Auth'
import AuthEnter from '../src/components/auth/AuthEnter'
import AuthSignUp from '../src/components/auth/AuthSignUp'
import AuthForget from '../src/components/auth/AuthForget'
import AuthReset from '../src/components/auth/AuthReset'
import UserTicket from '../src/components/users/UserTicket'
import UserSettings from '../src/components/users/UserSettings'
import Player from '../src/components/Player'
import FileManager from '../src/components/FileManager'
import TemplateEditor from '../src/components/TemplateEditor'
import TemplateEditorSingle from '../src/components/template-editor/EditorSingle'
import Displays from '../src/components/Displays'
import Display from '../src/components/displays/Display'
import Schedules from '../src/components/Schedules'
import Reps from '../src/components/Reps'
import Schedule from '../src/components/schedules/Schedule'
import Statistics from '../src/components/statistics/Index'
import TheHeaderFilesLeftTools from '../src/components/file-manager/TheHeaderFilesLeftTools'
import TheHeaderFilesRightTools from '../src/components/file-manager/TheHeaderFilesRightTools'
import TheHeaderEditorRightTools from '../src/components/template-editor/TheHeaderEditorRightTools'
import TheHeaderTemplateLeftTools from '../src/components/template-editor/TheHeaderTemplateLeftTools'
import TheHeaderTemplateRightTools from '../src/components/template-editor/TheHeaderTemplateRightTools'
import TheHeaderPlayerScaleTool from '../src/components/player/TheHeaderPlayerScaleTool'
import TheHeaderUserRightTools from '../src/components/users/TheHeaderUserRightTools'
import TheHeaderDisplaysLeftTools from '../src/components/displays/TheHeaderDisplaysLeftTools'
import TheHeaderDisplaysRightTools from '../src/components/displays/TheHeaderDisplaysRightTools'
import TheHeaderSchedulesLeftTools from '../src/components/schedules/TheHeaderSchedulesLeftTools'
import TheHeaderSchedulesRightTools from '../src/components/schedules/TheHeaderSchedulesRightTools'
import TheHeaderScheduleLeftTools from '../src/components/schedules/TheHeaderScheduleLeftTools'
import TheHeaderScheduleRightTools from '../src/components/schedules/TheHeaderScheduleRightTools'
import TheHeaderManageRightTools from '../src/components/managment/TheHeaderManageRightTools'
import TheHeaderFontsRightTools from '../src/components/fonts/TheHeaderFontsRightTools'
import InstaToken from '../src/components/modals/widgets/helpers/InstaToken'
import Manual from '../src/components/manual/Index'
import Managment from '../src/components/managment/Index'
import Agreements from '../src/components/auth/Agreements'
import Applications from '../src/components/Applications'
import FontsPage from '../src/components/fonts/FontsPage'

export default {
  routes: [{
    path: '/',
    name: 'Главная',
    components: {
      'default': Home,
      'header-right-side-tools': UserTicket
    }
  }, {
    path: '/auth',
    component: Auth,
    children: [{
      path: '/',
      component: AuthEnter
    }, {
      path: 'signup/:email?',
      component: AuthSignUp
    }, {
      path: 'forget',
      component: AuthForget
    }, {
      path: 'reset/:token',
      component: AuthReset
    }]
  }, {
    path: '/files/',
    name: 'Файловый менеджер',
    components: {
      'default': FileManager,
      'header-left-side-tools': TheHeaderFilesLeftTools,
      'header-right-side-tools': TheHeaderFilesRightTools
    }
  }, {
    path: '/files/:id',
    name: 'Файловый менеджер',
    components: {
      'default': FileManager,
      'header-left-side-tools': TheHeaderFilesLeftTools,
      'header-right-side-tools': TheHeaderFilesRightTools
    }
  }, {
    path: '/editor/',
    name: 'Редактор шаблонов',
    components: {
      'default': TemplateEditor,
      'header-right-side-tools': TheHeaderEditorRightTools
    }
  }, {
    path: '/editor/:id',
    components: {
      'default': TemplateEditorSingle,
      'header-left-side-tools': TheHeaderTemplateLeftTools,
      'header-right-side-tools': TheHeaderTemplateRightTools
    }
  }, {
    path: '/player/:id',
    components: {
      'default': Player,
      'header-right-side-tools': TheHeaderPlayerScaleTool
    }
  }, {
    path: '/players/',
    name: 'Плееры',
    components: {
      'default': Displays,
      'header-left-side-tools': TheHeaderDisplaysLeftTools,
      'header-right-side-tools': TheHeaderDisplaysRightTools
    }
  }, {
    path: '/players/:id',
    components: {
      'default': Display
    }
  }, {
    path: '/schedules/',
    name: 'Расписания',
    components: {
      'default': Schedules,
      'header-left-side-tools': TheHeaderSchedulesLeftTools,
      'header-right-side-tools': TheHeaderSchedulesRightTools
    }
  }, {
    path: '/schedules/:id',
    components: {
      'default': Schedule,
      'header-left-side-tools': TheHeaderScheduleLeftTools,
      'header-right-side-tools': TheHeaderScheduleRightTools
    }
  }, {
    path: '/reps/',
    components: {
      'default': Reps
    }
  }, {
    path: '/statistics',
    name: 'Статистика',
    components: {
      'default': Statistics
    }
  }, {
    path: '/manual',
    name: 'Руководство',
    components: {
      'default': Manual
    }
  }, {
    path: '/managment',
    name: 'Пользователи',
    components: {
      'default': Managment,
      'header-right-side-tools': TheHeaderManageRightTools
    }
  }, {
    path: '/settings',
    name: 'Настройки',
    components: {
      'default': UserSettings
    }
  }, {
    path: '/agreements',
    component: Agreements
  }, {
    path: '/agreements/:name',
    component: Agreements
  }, {
    path: '/apps',
    components: {
      'default': Applications
    }
  }, {
    path: '/fonts',
    name: 'Загрузка шрифтов',
    components: {
      'default': FontsPage,
      'header-right-side-tools': TheHeaderFontsRightTools
    }
  }, {
    path: '/:instaAccess',
    components: {
      'default': InstaToken
    }
  }
]
}
