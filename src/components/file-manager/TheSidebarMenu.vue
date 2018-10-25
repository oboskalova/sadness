<template>
  <nav>
    <ul class="menu">
      <li v-for="link in links" class="menu-item">
        <router-link :to="link.href" class="link menu-link">
          <i class="link-icon link-icon--before icon" :class="'icon-' + link.icon"></i>
          <span>{{ link.text }}</span>
          <i class="link-icon link-icon--after icon">&gt;</i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    name: 'sidebar-menu',
    data () {
      return {
        links: [
          { href: '/templates', text: 'Шаблоны', icon: 'template' },
          { href: '/files', text: 'Файлы', icon: 'folder' },
          { href: '/common-files', text: 'Общие', icon: 'shared-folder' },
          { href: '/devices', text: 'Устройства', icon: 'device' },
          { href: '/users', text: 'Пользователи', icon: 'user' }
        ]
      }
    }
  }
</script>

<style scoped>
    .menu,
  .menu-item {
    width: 100%;
    margin: 0;
    padding: 0;
    display: block;
    list-style-type: none;
  }
  .menu-link {
    width: 100%;
    padding: 1.75em 0;
    padding-left: 4em;
    display: block;
    position: relative;
  }
  .menu-link:hover {
    color: #00b0b7;
    background: #282828;
  }
  .link {
    color: inherit;
    text-decoration: none;
  }
  .link-icon {
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
  }
  .link-icon--before {
    left: 1.25em;
    width: 27px;
    height: 27px;
  }
  .link-icon--after {
    right: .75em;
    color: #ffffff;
    opacity: 0;
  }
  .router-link-active {
    color: #00b0b7;
    background: #282828;
  }
  .router-link-active > .link-icon--after {
    opacity: 1;
  }
  .icon {
    display: block;
  }
  .icon-arrow {
    background: url(../assets/img/icons/arrow.svg) no-repeat;
  }
  .icon-template {
    background: url(../assets/img/icons/template.svg) no-repeat;
  }
  .icon-folder {
    background: url(../assets/img/icons/file.svg) no-repeat;
  }
  .icon-shared-folder {
    background: url(../assets/img/icons/file_open.svg) no-repeat;
  }
  .icon-device {
    background: url(../assets/img/icons/web_app.svg) no-repeat;
  }
  .icon-user {
    background: url(../assets/img/icons/user.svg) no-repeat;
  }
</style>