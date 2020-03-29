 <template>
  <div>
    <el-row class="box">
      <el-col :span="7" class="user-list">
        <div :class="['user', {myself: item.status}]" v-for="(item, index) in local_users" :key="index">
          <div class="user-img">
            <img :src="item.url" alt="">
          </div>
          <div class="user-name">{{item.name}}</div>
        </div>
      </el-col>
      <el-col :span="17" class="chat-content">
        <div class="num">在线{{local_users.length}}人</div>
        <div class="content-area" ref="area">
          <div :class="['info', {myself: item.status}]" v-for="(item, index) in message_list" :key="index">
            <template v-if="!item.status">
              <div class="avatar">
                <img :src="item.url" alt="">
              </div>
              <div class="message">
                <div class="nick-name">{{item.name}}</div>
                <div class="text">{{item.message}}</div>
              </div>
            </template>
            <template v-if="item.status">
              <div class="message">
                <div class="nick-name">{{item.name}}</div>
                <div class="text-right">{{item.message}}</div>
              </div>
              <div class="avatar">
                <img :src="item.url" alt="">
              </div>
            </template>
          </div>
        </div>
        <div class="input-area">
          <el-input class="input" v-model="input_text" @keyup.enter.native="sendMessage" placeholder="请输入内容"></el-input>
          <el-button class="send-btn" type="primary" @click="sendMessage">发送</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="请输入昵称"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      >
      <el-input v-model="nick_name" placeholder="请输入昵称"  maxlength="10"
        show-word-limit></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitName">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import socketio from 'socket.io-client'
export default {
  name: 'socket',
  data () {
    return {
      socket: '',
      socket_id: '',
      local_users: [

      ], // 本地用户
      message_list: [],
      dialogVisible: true,
      nick_name: '',
      mysel_url: '',
      input_text: '',
      is_first: true,
      user_avatar: [
        {url: require('../assets/avatar1.jpg')},
        {url: require('../assets/avatar2.jpg')},
        {url: require('../assets/avatar3.jpg')},
        {url: require('../assets/avatar4.jpg')},
        {url: require('../assets/avatar5.jpg')},
        {url: require('../assets/avatar6.jpg')},
        {url: require('../assets/avatar7.jpg')},
        {url: require('../assets/avatar8.jpg')},
        {url: require('../assets/avatar9.jpg')},
        {url: require('../assets/avatar10.jpg')}
      ]
    }
  },
  methods: {
    // 提交昵称
    submitName () {
      if (!this.nick_name && !this.nick_name.trim()) {
        this.$message({
          showClose: true,
          message: '请填写昵称',
          type: 'error'
        })
      } else {
        this.dialogVisible = false
        this.connectSocket()
      }
    },
    // 添加成员
    addUser (name, id, url, status) {
      this.local_users.push({
        name,
        id,
        url,
        status
      })
    },
    // 发送文字
    sendMessage () {
      this.socket.emit('send-message', {name: this.nick_name, message: this.input_text, url: this.mysel_url})
      this.input_text = ''
    },
    // socket一些事件
    connectSocket () {
      let self = this
      let url = this.user_avatar[Math.floor(Math.random() * 9)].url
      // 发送添加用户
      this.socket.emit('adduser', {
        name: self.nick_name,
        url,
        socket_id: this.socket.id
      })
      this.socket_id = this.socket.id
      this.mysel_url = url
      // 监听接收所有用户广播
      this.socket.on('adduser-todom', (users) => {
        users.forEach(item => {
          if (!self.local_users.find(e => e.id === item.id)) {
            item.status = item.name === self.nick_name ? 1 : 0
            self.local_users.push(item)
            if (!self.is_first) {
              self.$notify.success({
                title: '提示',
                message: `${item.name}加入聊天啦^_^`,
                showClose: false,
                duration: 2000
              })
            }
          }
        })
        self.is_first = false
      })
      // 监听接收消息广播
      this.socket.on('send-message-todom', (data) => {
        data.status = data.name === self.nick_name ? 1 : 0
        self.message_list.push(data)
        this.$nextTick(() => {
          this.$refs.area.scrollTop = this.$refs.area.scrollHeight
        })
      })
      // 监听用户断开连接更新用户
      this.socket.on('user-disconnect', (user) => {
        self.local_users.forEach(item => {
          if (!user.find(e => e.id === item.id)) {
            self.$notify.error({
              title: '提示',
              message: `${item.name}离开了聊天o(╥﹏╥)o`,
              showClose: false,
              duration: 2000
            })
          }
        })
        this.local_users = user.map(item => {
          return {
            name: item.name,
            id: item.id,
            url: item.url,
            status: item.name === self.nick_name ? 1 : 0
          }
        })
      })
    }
  },
  mounted () {
  },
  created () {
    this.socket = socketio('ws://www.yeshen1.cn:5000/')
  }
}
</script>
<style scoped>
.box{
  width: 80%;
  background-color: #fff;
  box-shadow: 1px 1px 1px rgba(0,0,0,.1);
  border-radius: 4px;
  margin: 0 auto;
  height: 300px;
}
.user-list{
  border-right: 1px solid #ebedee;
  overflow: auto;
  height: 100%;
}
.user{
  height: 64px;
  border-bottom: 1px solid #ebedee;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 24px;
  cursor: pointer;
  border-top-left-radius: 4px;
  color: #333;

}
.user .user-img{
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}
.user-img img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.chat-content{
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.content-area{
  width: 100%;
  height: 260px;
  flex: 1 1 auto;
  overflow: auto;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chat-content .num{
  position: absolute;
  right: 25px;
  top: -25px;
  color: #80D640;
  font-size: 13px;
  font-weight: bold;
}
.input-area{
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ebedee;
}
.send-btn{
  margin-left: 50px;
}
/deep/.input input{
  border: none;
}
/deep/.send-btn{
  border-radius: 0;
}
.info{
  text-align: right;
  width: 80%;
  margin: 8px 20px;
  display: flex;
}
.info.myself{
  align-self: flex-end;
  justify-content: flex-end;
}
.avatar{
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.avatar img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.myself .message{
  margin-right: 6px;
}
.message{
  margin-left: 6px;
  position: relative;
}
.myself .nick-name{
  text-align: right;
}
.nick-name{
  text-align: left;
  font-size: 12px;
  color: #999;
}
.text{
  background: #80D640;
  color: white;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  position: relative;
  margin-top: 8px;
}
.text:before{
  position: absolute;
  content: "";
  left: -4px;
  top: 10px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 5px solid #80D640;
  border-bottom: 5px solid transparent;
}
.text-right{
  background: #80D640;
  color: white;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  position: relative;
  margin-top: 8px;
}
.text-right:before{
  position: absolute;
  content: "";
  right: -4px;
  top: 10px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 5px solid #80D640;
  border-bottom: 5px solid transparent;
}
</style>
