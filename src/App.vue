<template>
  <div id="app">
    <Title @handleList="show=true" @saveData="saveData" @handleAdd="handleAdd" @exportText="exportText"></Title>
    <van-popup v-model="show" position="left" :style="{ height: '100%',width:'30%' }">
      <list :id="id" @click="handleClick" @removeNote="removeNote" ref="list" />
    </van-popup>
    <div>
      <editor
        ref="editor"
        @onEditorFocus="showClass=false"
        @onEditorChange="onEditorChange"
        @onEditorSave="saveData"
        :msg="msg"
        :title="title"
        :id="id"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import editor from './components/editor.vue'
import Title from './components/title.vue'
import list from './components/list.vue'

export default {
  name: 'App',
  components: {
    editor,
    Title,
    list
  },
  data() {
    return {
      id: '',
      rev: '',
      msg: '',
      index: 1,
      showClass: false,
      show: false,
      editData: {}
    }
  },
  mounted() {
    if (this.msg === '') {
        const res = this.$api.getLastDocApi()
        if(res && res.id){
          this.title = res.title
          this.msg = res.content
          this.id = res.id
        } 
    }

    //设置搜索
    this.utools.setSubInput(({ text }) => {
      this.utools.findInPage(text)
      //console.log(text)
    }, '搜索')
  },
  methods: {
    open(url) {
      window.openExternal(url)
    },
    handleAdd() {
      this.index++
      this.id = ''
      this.rev = ''
      this.msg = ''
      this.title=''
      this.editData = {};
      if(this.$refs['editor'] && this.$refs['editor'].newNote) this.$refs['editor'].newNote()
    },
    handleClick(item) {
      this.index++
      this.msg = item.content
      this.title = item.title
      this.showClass = false
      this.id = item['_id']
      this.rev = item['_rev']
      this.show = false
    },
    saveData(data = this.editData, state = true) {
      console.log("app_save_data", data, this.editData)
      if(!data.title && !data.content) {
          data.title = "未命名笔记"
          data.time = new Date().getTime()
          this.title = data.title
      }
      if(!data.title && data.content) {
          const txtContent = data.content.replace(/\s+/g, "")
          if(txtContent.length >= 15) {
            data.title = txtContent.substring(0, 15)
            data.time = new Date().getTime()
            this.title = data.title
            if(this.$refs['editor'] && this.$refs['editor'].updateTitle) this.$refs['editor'].updateTitle(data.title)
          }
      }
      console.log('app_save_data2', data)
      data['_id'] = data.id || this.id
      if (data['_id']) {
        this.$api.getApi(data['_id']).then(res => {
          data['_rev'] = res['_rev']
          this.submit(data, state)
        })
      } else {
        this.submit(data, state)
      }
    },
    submit(data, state) {
      this.$api.putApi(data).then(res => {
        state && this.utools.showNotification('保存成功')
        if (res.ok) {
          this.id = res.id
        }
        if(this.$refs['list'] && this.$refs['list'].getData) this.$refs['list'].getData()
      })
    },
    onEditorChange(data) {
      console.log('changed');
      if(!data.title && !data.content) {
          return
      }
      this.editData = data
      this.$api.setLastDocApi(data)
      this.saveData(data, false)
    },
    removeNote(item){
      this.$api.removeApi(item['_id']).then(() => {
        //this.utools.showNotification('删除成功')
        if(this.$refs['list'] && this.$refs['list'].getData) this.$refs['list'].getData()
        if(this.$refs['editor'] && this.$refs['editor'].delNote) this.$refs['editor'].delNote(item['_id'])
        const _this = this;
        setTimeout(() => {
          _this.show = true;
          _this.id = ""
        });
        //更新最近的浏览
        const lastData = this.$api.getLastDocApi()
        if(lastData.id == item['_id']){
          this.$api.setLastDocApi({})
        }
      })
    },
    exportText() {
        console.log(111, this.msg, this.title);
        const path = this.utools.showSaveDialog({ 
          title: '保存位置',
           filters: [
            {name: '文件格式', extensions: ['md','txt']},
          ],
          defaultPath: window.path.join(this.utools.getPath('desktop'), this.title + '.md'),
          buttonLabel: '保存'
        })
        //console.log('export', path);
        if(path){
            window.writeFile(path + (path.indexOf(".md") === -1 ? path + ".md" : ""), this.msg)
        }
        //this.downFile(this.msg, this.title)
    },
    downFile(content, filename) {
        var ele = document.createElement('a');// 创建下载链接
        ele.download = filename + ".md";//设置下载的名称
        ele.style.display = 'none';// 隐藏的可下载链接
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        ele.href = URL.createObjectURL(blob);
        // 绑定点击时间
        document.body.appendChild(ele);
        ele.click();
        // 然后移除
        document.body.removeChild(ele);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
