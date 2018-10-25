<template>
  <div>
    <div class="content row no-gutters">
      <main class="main col">
        <div class="rep-manager container"> 
          <button
            class="btn btn-md btn-secondary"
            title="Добавить файл"
            v-b-modal.add>
            <i class="mi mi-add"></i>
            Добавить файл
          </button>         
          <table class="table">
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">name</th>
                <th scope="col">filename</th>
                <th scope="col">Изменен</th>
                <th scope="col">Удалить</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rep in reps"
                :key="rep.id">
                <th scope="row">{{ rep.id }}</th>
                <td>{{ rep.name }}</td>
                <td>{{ rep.file_url }}</td>
                <td>{{ rep.updated_at }}</td>
                <td><button class="deleter" @click="select(rep.id)" v-b-modal.delete-rep><i class="mi mi-delete"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
    <b-modal centered
      id="add"
      ref="add"
      title="Загрузить файл" 
      cancel-title="Отмена"
      :hide-footer="isChanging"
      @ok="upload">
      <b-form-input
        ref="name"
        type="text"
        id="name"
        v-model="file.name" />
      <input
        id="upload-file"
        type="file"
        ref="file"
        @change="getFileAndUpload">
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
    <b-modal centered
      id="delete-rep"
      ref="delete-rep"
      title="Подтверждение удаления" 
      cancel-title="Отмена"
      :hide-footer="isChanging"
      @ok="deleteRep">
      Вы действительно хотите удалить файл?
      <img
        v-if="isChanging"
        src="/static/img/spinner.gif"
        class="loader">
    </b-modal>
  </div>
</template>

<script>
  import {
    getReps,
    createRep,
    deleteReps
  } from '../../api/player'

  export default {
    name: 'rep-manager',
    created () {
      this.fetchData()
    },
    methods: {
      select (id) {
        this.selected = id
      },
      upload () {
        this.isLoading = true
        return createRep(this.file).then(response => {
          const data = response.data
          if (!data) return
          this.reps.push(data)
          this.isLoading = false
          document.getElementById('upload-file').value = ''
          this.file = {
            name: '',
            attachment: null
          }
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      getFileAndUpload () {
        this.file.attachment = this.$refs.file.files[0]
        console.log(this.file.attachment)
      },
      deleteRep () {
        if (!this.selected) {
          return
        }
        return deleteReps(this.selected).then(response => {
          const data = response.data
          if (!data) return
          this.isLoading = false
          this.fetchData()
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      },
      fetchData () {
        this.isLoading = true
        return getReps().then(response => {
          const data = response.data
          if (!data) return
          this.reps = data
          this.isLoading = false
        }).catch(error => {
          console.log(error)
          this.isLoading = false
        })
      }
    },
    data () {
      return {
        selected: 0,
        file: {
          name: '',
          attachment: null
        },
        reps: '',
        isLoading: false,
        isChanging: false
      }
    }
  }
</script>

<style scoped>

</style>