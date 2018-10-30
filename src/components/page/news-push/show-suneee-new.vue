<template>
    <div class="g-container">
        <div class="g-bg-color">
            <div class="box m-title"><span>象翌集团用户登录使用情况</span></div>
            <div class="m-date">
                <div style="overflow:hidden;">
                    <span class="iconfont" @click="loadPreData()">&#xea5e;</span>
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
            <div class="grid m-data" style="margin-bottom:0;">
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
            <div class="grid m-data" style="margin-bottom:0;">
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{everyDaySum.meetCount}} 条</b></div>
                    <div class="box u-span">会议巢消息数</div>
                </div>
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{everyDaySum.orgCount}} 条</b></div>
                    <div class="box u-span">组织巢消息数</div>
                </div>
                <div class="grid-cell u-16b">
                    <div class="box"><b>{{everyDaySum.workCount}} 条</b></div>
                    <div class="box u-span">工作巢消息数</div>
                </div>
            </div>
            <div class="grid m-data" style="margin-bottom:0;">
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{mediaDataObj.voiceNum}} 条</b></div>
                    <div class="box u-span">音频总数</div>
                </div>
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{mediaDataObj.videoNum}} 条</b></div>
                    <div class="box u-span">视频总数</div>
                </div>
                <div class="grid-cell u-16b">
                    <div class="box"><b>{{uploadDataObj.all}} 条</b></div>
                    <div class="box u-span">上传文件总数</div>
                </div>
            </div>
            <div class="grid m-data">
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{uploadDataObj.meetList}} 条</b></div>
                    <div class="box u-span">会议巢上传文件总数</div>
                </div>
                <div class="grid-cell u-16b u-bor">
                    <div class="box"><b>{{uploadDataObj.orgList}} 条</b></div>
                    <div class="box u-span">组织巢上传文件总数</div>
                </div>
                <div class="grid-cell u-16b">
                    <div class="box"><b>{{uploadDataObj.workList}} 条</b></div>
                    <div class="box u-span">工作巢上传文件总数</div>
                </div>
            </div>
            <div id="chart1" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart2" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart3" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart4" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart5" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart6" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart7" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
            <div id="chart8" style="margin:0 auto;margin-bottom:2rem;width:90%;" :style="{height:(availHeight*0.8)+'px'}"></div>
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
            everydayUrl: '/vr-push/countNestByDay',
            alldayUrl: '/vr-push/countNestByHour',
            voiceUrl: '/vr-push/query_meeting_count',
            uploadUrl: '/vr-push/countFiles',
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
            loading3:false,
            loading4:false,
            loading5:false,//音频
            loading6:false,//视频
            loading7:false,//上传
            hours:[],//小时数
            hoursLength:[],//时长
            hours1:[],//小时数
            hoursLength1:[],//时长
            hours2:[],//小时数
            hoursLength2:[],//时长
            hours3:[],//小时数
            hoursLength3:[],//时长
            hours4:[],//音频小时数
            hoursLength4:[],//音频时长
            hours5:[],//视频小时数
            hoursLength5:[],//视频时长
            hours6:[],//上传
            hoursLength6:[],//上传

            availHeight:0,
            availWidth:0,
            orientation:0,

            startTimeShow: '',
            endTimeShow: '',
            compCode: 'SUNEEE',

            everyDaySum:{},//每天消息总数
            versions: 'new',

            mediaDataObj:{//媒体对象
                voiceNum:0,//音频
                videoNum:0,//视频
            },

            uploadDataObj:{//上传当天总数
                all:0,
                meetList:0,
                orgList:0,
                workList:0,
            }
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
            self.getEveryData()//每天的消息总数
            self.getAllDayData()//24小时的消息总数
            self.getVoiceData()//获取音频数据
            self.getVideoData()//获取视频数据
            self.getUploadData()//获取上传数据
            self.loadingShow = true;
            self.loading1 = false
            self.loading2 = false
            self.loading3 = false
            self.loading4 = false
            self.loading5 = false
            self.loading6 = false
            self.loading7 = false
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
        initChart3() {
            let self = this;
            var chart3 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart3',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '会议巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours1,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'会议巢消息数量'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#3c91cb'
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
                        name:'会议巢消息数量',
                        data: self.hoursLength1
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#3c91cb']
            });
        },
        initChart4() {
            let self = this;
            var chart4 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart4',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '组织巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours2,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'组织巢消息数量'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#d58364'
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
                        name:'组织巢消息数量',
                        data: self.hoursLength2
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#d58364']
            });
        },
        initChart5() {
            let self = this;
            var chart5 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart5',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '工作巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours3,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'工作巢消息数量'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#2e4454'
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
                        name:'工作巢消息数量',
                        data: self.hoursLength3
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#2e4454']
            });
        },
        initChart6() {
            let self = this;
            var chart6 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart6',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '24小时音频次数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours4,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'音频次数'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#de9325'
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
                        name:'音频次数',
                        data: self.hoursLength4
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#de9325']
            });
        },
        initChart7() {
            let self = this;
            var chart7 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart7',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '24小时视频次数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours5,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'视频次数'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#749f83'
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
                        name:'视频次数',
                        data: self.hoursLength5
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#749f83']
            });
        },
        initChart8() {
            let self = this;
            var chart8 = new Highcharts.Chart({
                    chart: {//图标配置
                    renderTo: 'chart8',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1
                },
                title: {//标题
                    text: '24小时上传文件数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    categories: self.hours6,
                },
                yAxis:{//y坐标轴
                    min: 0,
                    minRange: 1,
                    title:{
                        text:'上传文件数'
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#bda29a'
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
                        name:'上传文件数',
                        data: self.hoursLength6
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: ['#bda29a']
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
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
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
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getEveryData() { //获取每天的消息总数
            let self = this
            self.$axios({
                url: self.everydayUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow +'&type=' +self.versions,
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("每天的消息数",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('每天的消息数网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data
                    self.everyDaySum = list
                }
                self.$nextTick(() => {
                    self.loading3 = true;
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getAllDayData() { //获取每天的消息总数
            let self = this
            self.$axios({
                url: self.alldayUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow +'&type=' +self.versions,
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("每天的消息总数",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('每天的消息总数网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data
                    self.hours1 = []
                    self.hoursLength1 = []
                    self.hours2 = []
                    self.hoursLength2 = []
                    self.hours3 = []
                    self.hoursLength4 = []
                    let meetList = list.meetList.reverse()
                    let orgList = list.orgList.reverse()
                    let workList = list.workList.reverse()
                    // let meetList = list.meetList
                    // let orgList = list.orgList
                    // let workList = list.workList
                    meetList.forEach(function(item, index) {//会议
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours1.push(str)
                        self.hoursLength1.push(item.msg)
                    })
                    orgList.forEach(function(item, index) {//组织
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours2.push(str)
                        self.hoursLength2.push(item.msg)
                    })
                    workList.forEach(function(item, index) {//工作
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours3.push(str)
                        self.hoursLength3.push(item.msg)
                    })
                }
                self.$nextTick(() => {
                    self.initChart3()
                    self.initChart4()
                    self.initChart5()
                    self.loading4 = true;
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getVoiceData() {//获取音频数据
            let self = this;
            self.$axios({
                url: self.voiceUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow +'&type=1',
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("音频数据",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('音频网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data.list
                    self.mediaDataObj.voiceNum = res.data.data.count
                    self.hours4 = []
                    self.hoursLength4 = []
                    list.forEach(function(item, index){
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours4.push(str)
                        self.hoursLength4.push(item.count)
                    })
                }
                self.$nextTick(() => {
                    self.initChart6()
                    self.loading5 = true;
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getVideoData() {//获取视频数据
            let self = this;
            self.$axios({
                url: self.voiceUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow +'&type=2',
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("视频数据",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('视频网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data.list
                    self.mediaDataObj.videoNum = res.data.data.count
                    self.hours5 = []
                    self.hoursLength5 = []
                    list.forEach(function(item, index){
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours5.push(str)
                        self.hoursLength5.push(item.count)
                    })
                }
                self.$nextTick(() => {
                    self.initChart7()
                    self.loading6 = true;
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
                        self.loadingShow = false;
                    }
                })
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        getUploadData(){//获取上传数据
            let self = this;
            self.$axios({
                url: self.uploadUrl+ '?compCode=' + self.compCode + '&date=' + self.endTimeShow,
                method: 'get',
                responseType: 'json',
            })
            .then(function(res) {
                console.log("上传数据",res)
                if(res.data.status != 200){
                    self.$vux.toast.text('上传数据网络异常','middle');
                    self.loadingShow = false;
                    return
                }
                if(res.data.status == 200) {
                    let list = res.data.data
                    self.uploadDataObj.all = list.all
                    self.uploadDataObj.meetList = list.meetList
                    self.uploadDataObj.orgList = list.orgList
                    self.uploadDataObj.workList = list.workList
                    self.hours6 = []
                    self.hoursLength6 = []
                    list.uploads24.forEach(function(item, index){
                        let str = '';
                        if(item.hour < 10){
                            str = '0'+item.hour+':00'
                        }else{
                            str = item.hour+':00'
                        }
                        self.hours6.push(str)
                        self.hoursLength6.push(item.upload)
                    })
                }
                self.$nextTick(() => {
                    self.initChart8()
                    self.loading7 = true;
                    if(self.loading1 && self.loading2 && self.loading3 && self.loading4 && self.loading5 && self.loading6 && self.loading7){
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
            self.clearData()
            self.endTimeShow = self.getPreDay(self.endTimeShow)
            self.startTimeShow = self.getPreDay(self.startTimeShow)
            let end = self.endTimeShow.replace(/\-/g, "/")
            self.titleDate = self.formatDate1(end)
            self.getUserData(self.startTimeShow, self.endTimeShow)
            self.getMessageData()
            self.getEveryData()//每天的消息总数
            self.getAllDayData()//24小时的消息总数
            self.getVoiceData()//获取音频数据
            self.getVideoData()//获取视频数据
            self.getUploadData()//获取上传数据
        },
        loadNextData() { //点击向后数据
            let self = this
            let nowDate = new Date()
            self.loadingShow = true;
            self.clearData()
            if(self.compareDate(self.getNextDay(self.endTimeShow), self.formatDate(nowDate)) == true) {
                self.$vux.toast.text('无数据显示','middle');
                self.loading1 = true
                self.loading2 = true
                self.loading3 = true
                self.loading4 = true
                self.loading5 = true
                self.loading6 = true
                self.loading7 = true
                self.loadingShow = false;
                return
            }
            self.endTimeShow = self.getNextDay(self.endTimeShow)
            self.startTimeShow = self.getNextDay(self.startTimeShow)
            let end = self.endTimeShow.replace(/\-/g, "/")
            self.titleDate = self.formatDate1(end)
            self.getUserData(self.startTimeShow, self.endTimeShow)
            self.getMessageData()
            self.getEveryData()//每天的消息总数
            self.getAllDayData()//24小时的消息总数
            self.getVoiceData()//获取音频数据
            self.getVideoData()//获取视频数据
            self.getUploadData()//获取上传数据
        },
        formatDate1(d) { //年月日
            d = new Date(d);
            return d.getFullYear()+" 年 "+(d.getMonth()+1)+" 月 "+d.getDate() + "日";
            /*return nowDate.getFullYear() + " 年 " + (nowDate.getMonth()+1) + ' 月 ' + nowDate.getDate() + '日'*/
        },
        compareDate(d1, d2) { //比较日期大小
            let self = this
            return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
        },
        clearData(){//清除
            let self = this;
            self.loading1 = false
            self.loading2 = false
            self.loading3 = false
            self.loading4 = false
            self.loading5 = false
            self.loading6 = false
            self.loading7 = false
            self.hours = []
            self.hours1 = []
            self.hours2 = []
            self.hours3 = []
            self.hours4 = []
            self.hours5 = []
            self.hours6 = []
            self.hoursLength = []
            self.hoursLength1 = []
            self.hoursLength2 = []
            self.hoursLength3 = []
            self.hoursLength4 = []
            self.hoursLength5 = []
            self.hoursLength6 = []
        },
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
    font-size: 11px;
    color: #a8a8a9;
    padding-top: 2px;
  }
  .iconfont {
    float:left;
    width:15%;
    color: #a8a8a9;
  }
</style>