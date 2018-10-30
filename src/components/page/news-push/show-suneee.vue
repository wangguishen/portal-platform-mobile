<template>
    <div class="g-container">
        <div class="g-bg-color">
            <div class="box m-title"><span>象翌集团用户登录使用情况</span></div>
            <div class="m-date">
                <div style="overflow:hidden;">
                    <span class="iconfont" @click="loadPreData()">&#xea5e;</span>
                    <!-- <span class="m-da-span">{{startTimeShow}} 至 {{endTimeShow}}</span> -->
                    <span class="m-da-span">{{titleDate}}</span>
                    <span class="iconfont" @click="loadNextData()">&#xe600;</span>
                </div>
            </div>
            <div class="grid m-data" style="margin-bottom:0;">
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{userTotal}} 个</b></div>
                    <div class="box u-span">总用户</div>
                </div>
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{userCount}} 个</b></div>
                    <div class="box u-span">活跃用户</div>
                </div>
                <div class="grid-cell u-16b">
                    <div class="box"><b>{{messageTotal}} 条</b></div>
                    <div class="box u-span">消息总数</div>
                </div>
            </div>
            <div class="grid m-data">
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{averageMessage}} 条</b></div>
                    <div class="box u-span">人均消息数</div>
                </div>
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{averageTime}} 分钟</b></div>
                    <div class="box u-span">平均在线时长</div>
                </div>
                <div class="grid-cell u-16b">
                    <div class="box"><b>{{mobileAverage}}</b></div>
                    <div class="box u-span">手机登录占比</div>
                </div>
            </div>
            <!-- <div class="box">
                <h4>威宁集团 / {{titleDate}}/ 用户登录使用情况</h4>
                <div>
                    <div style="display:inline-block;margin-right:1rem;">
                        <div class="g-icon-name">总用户: <b>{{userTotal}}</b> 个</div>
                        <div class="g-icon-name">活跃用户: <b>{{userCount}}</b> 个</div>
                        <div class="g-icon-name">消息总数: <b>{{messageTotal}}</b> 条</div>
                    </div>
                    <div style="display:inline-block;">
                        <div class="g-icon-name">人均消息数: <b>{{averageMessage}}</b> 条</div>
                        <div class="g-icon-name">平均在线时长: <b>{{averageTime}}</b> 分钟</div>
                        <div class="g-icon-name">手机登录占比: <b>{{mobileAverage}}</b></div>
                    </div>
                </div>
            </div> -->
            <div id="chart1" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart2" style="margin:0 auto;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
        </div>
        <div v-transfer-dom>
            <loading :show="loadingShow" class="p-load-show"></loading>
        </div>
    </div>
</template>

<script>
import { Loading, TransferDomDirective as TransferDom } from 'vux'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
export default {
    directives: {
      TransferDom
    },
    components: {
      Loading,
    },
    data() {
        return {
            titleDate: '', //当天日期
            userTotal: '', //总用户
            userCount: '', //活跃用户
            averageTime: '', //平均在线时长
            messageTotal: '', //消息总数,
            averageMessage: '', //人均消息数
            mobileAverage: '', //手机登录占比

            userUrl: '/account_auth_admin/user-api.loginStatistics', //24小时登录用户接口
            numberUrl: '/vr-push/countMessageByHour',
            account: 'admin',
            encryptCode: '123456',
            password: 'e10adc3949ba59abbe56e057f20f883e',
            appCode: 'XIANGPU',
            clientIp: '127.0.0.1',
            userTimes: [], //时间
            userCounts: [], //用户量
            countNums: [], //总数
            successNums: [], //成功数
            failNums: [], //失败数
            colors: ['#730000','#c16712', '#001f4d', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#8085e8', '#8d4653', '#91e8e1'],
            userColors: ['#c33430','#963463','#ffffcb'],
            messageColors: ['#6ab1b9'],

            messageUrl: '',  //24小时消息数接口
            messageNumbers: [], //消息数
            loadingShow: false,
            loading1:false,
            loading2:false,
            hours:[],//小时数
            hoursLength:[],//时长

            availHeight:0,
            availWidth:0,
            orientation:0,

            startTimeShow: '',
            endTimeShow: '',
            compCode: 'SUNEEE',

            versions: 'old',
        }
    },
    mounted() {
        let self = this
        let nowDate = new Date()
        self.titleDate = self.formatDate1(nowDate)
        let test = 115
        self.orientation = window.orientation;
        if(self.orientation == 0){
            self.availHeight = document.body.clientWidth*0.9;
        }else{
            self.availHeight = document.body.clientHeight*0.9;
        }
        self.startTimeShow = self.formatPreDate(nowDate)
        self.endTimeShow = self.formatDate(nowDate)
        self.$nextTick(()=>{
            self.getUserData(self.startTimeShow, self.endTimeShow)
            self.getMessageData()
            self.loadingShow = true;
            self.loading1 = false
            self.loading2 = false
            window.addEventListener("orientationchange", function() {
                self.orientation = window.orientation;
            }, false);
        })
    },
    watch:{
        'orientation':{
            handler: function(val, old){
                // let self = this;
                // if(val == 0){
                //     self.availHeight = document.body.clientWidth*0.9;
                // }else{
                //     self.availHeight = document.body.scrollWidth*0.8;
                // }
                // alert(document.body.scrollWidth)
                // self.initChart1()
                // self.initChart2()
            },
            deep:true
        }
    },
    methods: {
        initChart1() {
            let self = this
            var chart1 = new Highcharts.Chart({
                chart: {//图标配置
                    renderTo: 'chart1',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                legend:{//图例
                    enabled: true,
                    itemWidth: 80
                },
                title: {//标题
                    text: '24小时登录用户'
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.userTimes,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'用户数量'
                    },
                    gridLineWidth: 2,
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0.05,
                        borderWidth: 0
                    },
                    series: {
                        events: {
                            legendItemClick: function(e) {
                                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {//IOS
                                    if(e.browserEvent.type == 'click'){
                                        e.preventDefault()
                                        return
                                    }
                                } else if (/(Android)/i.test(navigator.userAgent)) {//Android
                                    // if(e.browserEvent.type == 'click'){
                                    //     e.preventDefault()
                                    //     return
                                    // }
                                }
                                
                            }
                        }
                    }
                },
                series: [//数据列
                    {
                        name:'用户量',
                        data: self.userCounts
                    }
                    // ,{
                    //     name:'成功数',
                    //     data: self.successNums
                    // },{
                    //     name:'失败数',
                    //     data: self.failNums
                    // }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.userColors
            });
        },
        initChart2() {
            let self = this;
            var chart2 = new Highcharts.Chart({
                chart: {//图标配置
                renderTo: 'chart2',
                type: 'column',
                plotBackgroundColor : "#ebeef0",
                plotBorderWidth: 1
            },
            title: {//标题
                text: '24小时消息数'
            },
            subtitle: {//副标题
                text: ''
            },
            xAxis:{//x坐标轴
                title:{
                    text:''
                },
                categories: self.hours,
            },
            yAxis:{//y坐标轴
                min: 0,
                minRange: 1,
                title:{
                    text:'消息数量'
                },
                gridLineWidth: 2
            },
            plotOptions: {
                column: {
                    dataLabels:{
                        enabled:true, // dataLabels设为true
                        style:{
                            color:'#87898a'
                        }
                    },
                    depth: 25,
                    pointPadding: 0.05,
                    borderWidth: 0
                },
                series: {
                    events: {
                        legendItemClick: function(e) {
                            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {//IOS
                                if(e.browserEvent.type == 'click'){
                                    e.preventDefault()
                                    return
                                }
                            } else if (/(Android)/i.test(navigator.userAgent)) {//Android
                                // if(e.browserEvent.type == 'click'){
                                //     e.preventDefault()
                                //     return
                                // }
                            }
                            
                        }
                    }
                    }
            },
            series: [//数据列
                {
                    name:'消息数量',
                    data: self.hoursLength
                }
            ],
            credits:{//右下角版权信息
                enabled: false,
            },
            colors: self.messageColors
          });
        },
        getUserData(startTime, endTime) { //获取24小时登录用户数据
            let self = this
            self.$axios({
                url: self.userUrl,
                method: 'post',
                responseType: 'json',
                data: {
                    account: self.account,
                    encryptCode: self.encryptCode,
                    password: self.password,
                    appCode: self.appCode,
                    clientIp: self.clientIp,
                    startTime: startTime,
                    endTime: endTime,
                    enterpriseCode: self.compCode,
                    type: self.versions
                }
            })
            .then(function(res) {
                console.log("24小时登录用户",res)
                if(res.data.status != 1){
                    self.$vux.toast.text('24小时登录用户网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 1) {
                    self.userTimes = []
                    self.userCounts = []
                    self.successNums = []
                    self.failNums = []
                    let list = res.data.data.timeList
                    list.forEach(function(item, index) {
                        let times = item.time.split('--')[0].split(' ')[1]
                        let arr = times.split(':')
                        if(arr[0] < 10){
                            item.time = "0"+arr[0]+':00'
                        }else{
                            item.time = arr[0]+':00'
                        }
                        self.userTimes.push(item.time)
                        self.userCounts.push(item.countNum)
                        self.successNums.push(item.successNum)
                        self.failNums.push(item.failNum)
                    })
                    let list1 = res.data.data.averageTime
                    self.userTotal = list1.userTotal
                    self.userCount = list1.userCount
                    self.averageTime = Math.round(list1.averageTime)
                    self.mobileAverage = self.toPercent(list1.mobileAverage)
                    self.mobileAverage = self.mobileAverage === undefined ? '--' : self.mobileAverage
                    self.messageTotal = list1.messageTotal
                    let f = parseFloat(list1.averageMessage)
                    f = Math.round(list1.averageMessage*100)/100;
                    let s = f.toString(); 
                    let rs = s.indexOf('.'); 
                    if (rs < 0) { 
                        rs = s.length; 
                        s += '.'; 
                    } 
                    while (s.length <= rs + 2) { 
                        s += '0'; 
                    }
                    self.averageMessage = s
                }
                self.$nextTick(() => {
                    self.initChart1()
                    self.loading1 = true;
                    self.loadingShow = false;
                    if(self.loading1 && self.loading2){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getMessageData() { //获取用户数据
            let self = this
            self.$axios({
                url: self.numberUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow +'&type=' +self.versions,
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("用户数据",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('用户数据网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data
                    self.hours = []
                    self.hoursLength = []
                    list.forEach(function(item, index) {
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours.push(str)
                        self.hoursLength.push(item.count)
                    })
                }
                self.$nextTick(() => {
                    self.initChart2()
                    self.loading2 = true;
                    if(self.loading1 && self.loading2){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        toPercent(number) {
            if(!number) return
            if(number == 0) return 0
            return (Math.round(number * 10000)/100).toFixed(2) + '%'
        },
        formatDate(nowDate) {  //当天的
            return nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + '-' + nowDate.getDate()
        },
        formatPreDate(nowDate) {  //前一天
            var preDate = new Date(nowDate.getTime() - 24*60*60*1000); //前一天
            return preDate.getFullYear() + "-" + (preDate.getMonth()+1) + '-' + preDate.getDate()
        },
        formatNextDate(nowDate) { //后一天
            var nextDate = new Date(nowDate.getTime() + 24*60*60*1000); //后一天
            return nextDate.getFullYear() + "-" + (nextDate.getMonth()+1) + '-' + nextDate.getDate()
        },
        getNextDay(d) { //获取后一天-- 
            let f = d.replace(/\-/g, "/")
            d = new Date(f);
            d = +d + 1000*60*60*24;
            d = new Date(d);
            return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        },
        getPreDay(d) { //获取前一天--
            let f = d.replace(/\-/g, "/")
            d = new Date(f);
            d = +d - 1000*60*60*24;
            d = new Date(d);
            return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        },
        loadPreData() { //点击向前数据
            let self = this
            self.loadingShow = true;
            self.loading1 = false
            self.loading2 = false
            self.endTimeShow = self.getPreDay(self.endTimeShow)
            self.startTimeShow = self.getPreDay(self.startTimeShow)
            let end = self.endTimeShow.replace(/\-/g, "/")
            self.titleDate = self.formatDate1(end)

            self.getUserData(self.startTimeShow, self.endTimeShow)
            self.getMessageData()
        },
        loadNextData() { //点击向后数据
            let self = this
            let nowDate = new Date()
            self.loadingShow = true;
            self.loading1 = false
            self.loading2 = false
            if(self.compareDate(self.getNextDay(self.endTimeShow), self.formatDate(nowDate)) == true) {
              self.$vux.toast.text('无数据显示','middle');
              self.loading1 = true
              self.loading2 = true
              self.loadingShow = false;
              return
            }
            self.endTimeShow = self.getNextDay(self.endTimeShow)
            self.startTimeShow = self.getNextDay(self.startTimeShow)
            let end = self.endTimeShow.replace(/\-/g, "/")
            self.titleDate = self.formatDate1(end)

            self.getUserData(self.startTimeShow, self.endTimeShow)
            self.getMessageData()
        },
        formatDate1(d) { //年月日
            d = new Date(d);
            return d.getFullYear()+" 年 "+(d.getMonth()+1)+" 月 "+d.getDate() + "日";
            /*return nowDate.getFullYear() + " 年 " + (nowDate.getMonth()+1) + ' 月 ' + nowDate.getDate() + '日'*/
          },
        compareDate(d1, d2) { //比较日期大小
            let self = this
            return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
        }
    }
}
</script>

<style scoped>
    .grid {
    display: flex;
    display-webkit: flex;
  }
  .box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .box1 {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .g-container {
    height: 100%;
    overflow-y: scroll;
    background: #ebeef0;
  }  
  .m-title {
    height: 50px;
    line-height: 50px; 
    border: none;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: linear-gradient(0, #eaeaea, #eaeaea 50%, transparent 50%);
    background-image: -webkit-linear-gradient(90deg, #eaeaea, #eaeaea 50%, transparent 50%);
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
  }
  .m-title span {
    /*font-size: 26px;*/
  }
  .m-date {
    width: 100%;
    height: 3.5rem;
    line-height: 3.5rem;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    position: relative;
  }
  .m-date div {
    width: 60%;
    margin: 0 auto;
  }
  .m-date .m-da-span{
    float:left;
    width:69%;
    text-align: center;
  }
  .m-data {
    height: 4.2rem;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 20px;
    padding: .8rem 0;
    box-sizing: border-box;
  }
  .u-chart1, .u-chart2 {
    width: 100%;
    background: #ffffff;
  }
  .u-chart1 {
    margin-bottom: 20px;
  }
  .grid-cell.u-16b {
    flex: 0 0 33.33%;
  }
  .grid-cell.u-18b {
    flex: 0 0 50%;
  }
  .grid-cell.u-bor{
    box-sizing: border-box;
    border-right: 1px solid #ebebeb;
  }
  .u-span {
    font-size: 13px;
    color: #a8a8a9;
    padding-top: 2px;
  }
  .iconfont {
    float:left;
    width:15%;
    color: #a8a8a9;
  }
</style>