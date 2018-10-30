<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
        <div class="sysgover">
            <search
                @result-click="resultClick"
                :results="results"
                v-model="serveInput"
                @on-change="getResult"
                @on-focus="onFocus"
                @on-cancel="onCancel"
                @on-submit="onSubmit"
                ref="search"
                placeholder="请输入服务名称"
                style="margin-top: 48px;">
            </search>
            <div :class="{'openservice':openservice}">
                <group v-for="(item,index) in items" :key="index">
                    <cell
                      :title="item.serviceName"
                      is-link
                      :border-intent="false"
                      :arrow-direction="item.show ? 'down' : 'right'"
                      @click.native="unfold(item, index)">
                    </cell>
                    <template v-if="item.show" v-for="(list ,index) in lists">
                        <template v-if="list.interName=='消息推送'">
                            <cell-box :border-intent="false" class="sub-item" is-link @click.native="topicDetails(list, index)">
                            {{list.interName}}
                            </cell-box>
                        </template>
                        <template v-else>
                            <cell-box :border-intent="false" class="sub-item" is-link @click.native="details(list, index)">
                            {{list.interName}}
                            </cell-box>
                        </template>
                    </template>
                </group>
            </div>
        </div>
        <load-more :show-loading="showLoad" :tip="loadText"></load-more>
    </div>
</template>

<script>
import VHeader from '../../common/Header'
import { Search, Group, Cell, CellBox, XHeader, Actionsheet, TransferDom, Tab, TabItem, Sticky, LoadMore} from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
        VHeader,
        Group,
        Cell,
        CellBox,
        XHeader,
        Actionsheet,
        Tab,
        TabItem,
        Sticky,
        Search,
        LoadMore
    },
    data () {
        return {
            showMenus: false,
            loadText: "",//加载指示字体
            showLoad: true,//加载指示符是否显示
            timer:null,//定时器
            results: [],
            serveInput: '',//搜索框内容
            headObj:{
                title:"开放服务",
                isBack:false,
            },
            rightObj:{
                // title:'完成',
                icon: '&#xe6b9;',
            },
            openservice:false,
            items:[],//服务名列表
            //消息推送服务固定栏
            inforItems: {
                mId: 177,
                id: 888,
                interName:'消息推送'
            },
            lists:[],//接口列表
            selServer:'',
        }
    },
    mounted () {
        let self = this;
        self.askList();
        
    },
    methods: {
        unfold(item, index){//折叠
            let self = this;
            console.log(item,index)
            self.items.forEach(function(key, val){
                if(key.id == item.id){
                    item.show = !item.show;
                }else{
                    key.show = false;
                }
            })
            self.lists= [];
            console.log('=',item.id);
            self.selServer=item.id;
            self.getPort();
        },
        askList(){//获取数据列表
            let self = this;
            self.$axios({
                url: self.BP_HOST+'/module/sel?serviceName='+self.serveInput,
                method: 'get',
                responseType: 'json',
                data:{
                    'serviceName' : self.serveInput
                }
            })
            .then(function(response){
                console.log(response);
                let askData=response.data.data;
                console.log('askData',askData)
                if (askData.length == 0) {
                    self.loadText="暂无数据";
                }else{
                    self.loadText="数据加载完毕"
                }
                self.showLoad=false;
                self.items = [];
                askData.forEach(function(item,index){
                    item.show = false;
                    self.items.push(item);
                })
            })
            .catch(function(response){
                console.log("error");
            })
        },
        getPort(){//请求接口
            let self = this;
            let data={
                'mId' : self.selServer,
                'interName':self.serveInput
            }
            console.log('=',data)
            self.$axios({
                url: self.BP_HOST+'/inter/sel?mId='+self.selServer+'&interName='+self.serveInput,
                method: 'get',
                responseType: 'json',
                data: data
            })
            .then(function(response){
                let portData=response.data.data;
                if (self.selServer == '177') {
                    portData.unshift(self.inforItems)
                }   
                console.log('portData',portData)
                self.lists= [];
                portData.forEach(function(list,index){
                    self.lists.push(list);
                })
                console.log(self.lists)
            })
            .catch(function(response){
                console.log("error")
            })
        },
        topicDetails(){
            let self = this;
            console.log('跳转消息推送页面')
            self.$router.go('/MessageConfig');
        },
        getResult(val){//搜索框
            let self = this;
            self.serveInput = val;
            self.loadText="正在加载";
            self.showLoad=true;
            self.items=[];
            if (self.timer == null) {
                self.timer = setTimeout(()=>{
                    clearTimeout(self.timer);
                    self.timer = null;
                    self.askList();
                },1000)
            }
        },
        details(list,index){//详情
            let self = this;
            let obj = {
                path: '/OpenService'
            }
            console.log(list,index);
            localStorage.setItem('serveList',JSON.stringify(list));
            localStorage.setItem('jumpRoutePath',JSON.stringify(obj));
            self.$router.go('/ServeDetails');
        },
        goes(){
            let self = this;
        },
        finish(data){
            console.log(data)
        },
        backWay(data){
            let self = this;
            self.$router.back('/home');
            console.log(data)
        },
        resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
        onSubmit () {
            let self = this;
            self.$refs.search.setBlur()
            self.$vux.toast.show({
                type: 'text',
                position: 'top',
                text: 'on submit'
            })
        },
        onFocus () {//输入框获取到焦点时触发
            console.log('on focus')
            this.openservice = true;
        },
        onCancel () {//点击取消按钮时触发
            console.log('on cancel')
            this.openservice = false;
        }
    }
}
</script>

<style lang="less" scoped>
    .sub-item {
        color: #888;
    }
</style>
<style>
    .openservice{
        margin-top: 92px;
    }
    .first_blond .weui-cells{
        margin-top:0px;
    }
</style>