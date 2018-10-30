<template>
	<div class="g-show-dowm">
    <group>
      <template v-for="obj in timeObj">
        <popup-picker
          :title="obj.title" 
          :data="timeList"
          v-model="obj.value">
        </popup-picker>
      </template>
    </group>
    <x-button type="primary" class="g-move-btn">查询</x-button>
    <group class="g-show-time">
      <template v-for="data in tableData">
        <cell
          title="时间段"
          :value="data.time"
          :border-intent="false"
          :arrow-direction="data.boxShow ? 'down' : 'right'"
          @click.native="selectbox(data)"
          is-link></cell>
        <template v-if="data.boxShow">
          <cell-form-preview :border-intent="false" :list="data.children"></cell-form-preview>
        </template>
      </template>
    </group>
	</div>
</template>
<script>
import { Cell, Group, PopupPicker, XButton, CellFormPreview } from 'vux'
export default {
  components: {
    Cell, Group, PopupPicker, XButton, CellFormPreview
  },
  data(){
    return {
      url: '/account_auth_admin/user-api.loginStatistics',
      account: 'admin',
      encryptCode: '123456',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      appCode: 'XIANGPU',
      clientIp: '127.0.0.1',
      tableData:[],//储存数据
      commonTime: '',
      commonAvgTime: '',
      commonMaxTime: '',
      commonMiniTime: '',
      label1: '',
      moveUpStart:'',
      moveUpEnd:'',
      timeObj:[
        {
          title: '开始时间',
          isShow: false,
          value:[],
          present:0,
        },{
          title: '结束时间',
          isShow: false,
          value:[],
          present:0
        }
      ],
      timeList:[['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']]
    }
  },
  mounted() {
    let self = this;
    self.getData('','')
  },
  methods: {
    getData(startTime, endTime) {
      let self = this
      self.tableData = []
      self.$axios({
        url: self.url,
        method: 'post',
        responseType: 'json',
        data: {
          account: self.account,
          encryptCode: self.encryptCode,
          password: self.password,
          appCode: self.appCode,
          clientIp: self.clientIp,
          startTime: startTime,
          endTime: endTime
        }
      })
      .then(function(res) {
        console.log(res)
        if(res.data.status == 1) {
          let list = res.data.data.timeList
          let common = res.data.data.averageTime
          self.commonTime = common.time 
          self.commonAvgTime = common.averageTime.toString()
          if(self.commonAvgTime.length > 5) {
            self.commonAvgTime = self.commonAvgTime.substring(0, 5)
          }
          self.commonMiniTime = common.miniTime == 0 ? 1 : common.miniTime
          self.commonMaxTime = common.maxTime
          self.label1 = "当天时间段：" + self.commonTime + "、平均时长：" + self.commonAvgTime + "分钟 " +  "、最小时长：" + self.commonMiniTime + "分钟" +"、最大时长：" + self.commonMaxTime + "分钟"
          self.moveUpStart = self.commonTime.split('00-')[0]+'00'
          self.moveUpEnd = self.commonTime.split('00-')[1]
          let arr = []
          list.forEach(function(item,index){
            arr = item.time.split('00-')
            self.$set(item,'startTime',(arr[0]+'00'))
            self.$set(item,'endTime',arr[1])
            self.$set(item,'boxShow',false)
            let arr = [
              {
                label: '开始时间',
                value: item.startTime
              },{
                label: '结束时间',
                value: item.endTime
              },{
                label: '用户量',
                value: item.userCount
              },{
                label: '总数',
                value: item.countNum
              },{
                label: '成功数',
                value: item.successNum
              },{
                label: '失败数',
                value: item.failNum
              }
            ]
            self.$set(item,'children',arr)
            self.tableData.push(item)
          })
          console.log(self.tableData)
        }
      })
      .catch(function(res) {

      })
    },
  	selectbox(obj){//选择框弹出
      let self = this;
      obj.boxShow = !obj.boxShow;
    },
  },
}
</script>
<style lang="less" scoped>
  .g-move-btn{
    width:80%;
    margin:1rem auto;
  }
  .g-show-dowm .weui-cell_access .weui-cell__ft{
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>