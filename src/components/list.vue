<template>
  <div>
    <ul class="mdui-list">
      <van-cell-group v-for="(item,i) in list" :key="i+1">
        <li
          @mouseover="hoverIndex = i"
          @mouseout="hoverIndex = -1"
          @click.prevent.stop="handleClick(item)"
          style="position: relative;height: 38px;overflow: hidden;"
        >
          <van-cell>
            <template #title>
              <span
                @click.prevent.stop="handleClick(item)"
                class="custom-title"
                :title="$api.toLocaleString(item.time)"
              >{{item.title || '未命名笔记'}}</span>
            </template>
            <template #right-icon>
              <van-icon
                @click.prevent.stop="del(item)"
                color="red"
                title="删除笔记"
                v-show="hoverIndex===i"
                name="delete"
                style="line-height: inherit;cursor: pointer;"
              />
            </template>
          </van-cell>
        </li>
      </van-cell-group>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: ['id'],
  data() {
    return {
      hoverIndex: -1,
      list: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api.allDocsApi().then(res => {
        if (!res.error) {
          this.list = res.reverse()
          this.list = this.list.filter((item)=>{
            console.log(item, 99999)
            return item.content || item.title
          });
          // if (this.list.length) {
          //   console.log('🐛:: getData -> list', this.list['0'])
          //   !this.id && this.$emit('click', this.list['0'])
          // }
        }
      })
    },
    handleClick(item) {
      this.$emit('click', item)
    },
    del(item) {
      this.$emit('removeNote', item)
    }
  }
}
</script>

<style scoped>
.custom-title {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  word-wrap: break-word;
  cursor: pointer;
}
</style>