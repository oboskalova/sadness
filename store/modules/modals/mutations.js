export default {
    TOGGLE_CONTAINER_CLICK_SETTINGS(state, value) {
        state.containerClickSettings = !!value
    },
    TOGGLE_VIEW_MEDIA_FILES(state, value) {
        state.viewMediaFiles = !!value
    },
    TOGGLE_CREATE_ASSIGNMENT(state, value) {
        state.createAssignment = !!value
    },
    TOGGLE_INVITE_USER(state, value) {
        state.inviteUser = !!value
    },
    TOGGLE_SELECT_MEDIA(state, value) {
        state.selectMedia = !!value
    },
    TOGGLE_SELECT_WIDGET(state, value) {
        state.selectWidget = !!value
    },
    TOGGLE_TEMPLATE_SETTINGS(state, value) {
        if (Object.prototype.toString.call(value) === '[object Object]') {
            const { active, type } = value
            state.templateSettings = !!active
            state.templateSettingsType = type
        } else {
            state.templateSettings = !!value
        }
    },
    LOAD_USERS_LIST(state, value) {
        state.usersModalList = value
    },
    TOGGLE_TIMELINE_SETTINGS(state, value) {
        state.timelineSettings = !!value
    },
    TOGGLE_RENAME(state, value) {
        state.renameItem = !!value
    },
    TOGGLE_INTERACTIVE_SETTINGS(state, value) {
        state.interactiveSettings = !!value
    },
    TOGGLE_CREATE_PLAYLIST_ITEM(state, value) {
        state.createPlaylistItem = value
    },
    SELECT_TIMELINE(state, value) {
        state.timelineSelection = value
    },
    TOGGLE_CONFIRM_LEAVING(state, value) {
        state.confirmLeaving = !!value
    },
    SET_MODAL_WIDGET_TYPE(state, value) {
        state.modalWidgetType = value
    },
    SET_MODAL_WIDGET_CONTENT(state, value) {
        state.modalWidgetContent = value
    },
    TOGGLE_DELETE_CONTAINER(state, value) {
        state.deleteContainer = value
    },
    TOGGLE_SELECT_STAT_MEDIA(state, value) {
        state.selectStatMedia = value
    },
    TOGGLE_STAT_SEARCH(state, value) {
        state.statSearch = value
    },
    SET_MODAL_IS_OPEN(state, value) {
        state.isModalOpen = value
    },
    TOGGLE_PDF_SELECTING(state, val) {
        state.isPdfSelecting = val
    },
    SET_PDF_MODAL_DATA(state, data) {
        state.pdfModalData = data
    },
    TOGGLE_EDIT_ORG(state, data) {
        state.editOrg = !!data
    },
    TOGGLE_EDIT_MODE_ORG(state, data) {
        state.editOrgMode = !!data
    },
    TOGGLE_ADMIN_ORG(state, data) {
        state.editAdmin = !!data
    },
    TOGGLE_EDIT_GROUP(state, data) {
        state.editGroup = !!data
    },
    TOGGLE_EDIT_MODE_GROUP(state, data) {
        state.editGroupMode = !!data
    },
    TOGGLE_EDIT_USER(state, data) {
        state.editUser = !!data
    },
    TOGGLE_EDIT_MODE_USER(state, data) {
        state.editUserMode = !!data
    },
    TOGGLE_CUSTOM_RULES(state, data) {
        console.log('ss rules', data)
        state.customRules = !!data
    }
}