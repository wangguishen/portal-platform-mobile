<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
        <search
            @on-change="getResult"
            v-model="searchValue"
            position="fixed"
            placeholder="请选择用户"
            auto-scroll-to-top
            @on-focus="onFocus"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            ref="useSearch"
            class="user_search">
            <div v-show="userSearchShow" :style="{'minHeight':maxHeight+'px'}">
                <div v-if="companyCode == ''">
                    <div class="prompt_text">
                        请先选择企业，再选择用户
                    </div>
                </div>
                <div v-else>
                    <div class="user_deta" v-for="item in results">
                        <div @click="selectName(item)">
                            {{item.real_name}}
                        </div>
                    </div>
                    <load-more v-show="loading" class="loadCla" :show-loading="showLoad" :tip="loadText"></load-more>
                </div>
            </div>
        </search>
        <div class="container_top s-company-box" :class="{'user_text':contTop}">
            <div class="g-company-logo">
                <div class="g-label-ipt">
                    <span>企业名称</span>
                    <input id="targetInput" v-model="company" class="g-logo-ipt" type="text" readonly/>
                    <span class="iconfont s-icon">&#xe61d;</span>
                </div>
                <div id="targetContainer" v-show="targetContainerShow"></div>
            </div>
            <!-- <group>
                <popup-picker
                    title="企业" 
                    :data="screenArr" 
                    placeholder='请先选择企业' 
                    v-model="currentVal"
                    :show.sync="showPopupPicker"
                     :show-cell="true"
                    @on-change="shadowChange"
                    @on-hide="onHide">
                </popup-picker>
            </group> -->
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, XInput, Popup, XButton, PopupPicker, Search, LoadMore } from 'vux'
export default{
    components: {
        VHeader, Group, Cell, XInput, Popup, XButton, PopupPicker, Search, LoadMore
    },
    data(){
        return {
            a:this.createdCss('./static/MultiPicker.css'),
            b:this.createdJs('./static/MultiPicker.js'),
            addObj:{},
            jsonData:{},//企业对象
            accountCompCode: '',//企业管理员code

            headObj: {
                title: '新增管理员',
                isBack: true,
            },
            rightObj: {
                isMore: true,
                title: '添加',
            },
            screenArr: [],//企业集合
            backupsArr: [],//企业集合备份
            currentVal: [],//企业选中的值
            enterprise: {},//当前选中的企业
            showPopupPicker: false,

            // 输入框
            results: [],//展示用户信息集合
            searchValue: '',//输入框的内容
            userSearchShow: false,//是否显示模态框
            contTop: false,//内容的高度显示
            selectObj:{},//选中的对象
            maxHeight:0,//搜索模态显示框的最大高度
            pageSize:20,//每页条数
            currentPage:1,//当前第几页
            //加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            loading:false,
            timer:null,
            state:1,
            isScrollShow:false,

            targetContainerShow:true,
            company: '请选择企业',
            companyId: '',//企业id
            companyCode: '',//企业编码
            counterpart: [],//复本
            business: [],
        }
    },
    mounted (){
        let self = this;
        self.addObj = JSON.parse(localStorage.getItem('addPage'));
        self.jsonData = JSON.parse(localStorage.getItem('jsonData'))
        self.accountCompCode = localStorage.getItem('compCode')
        let uams = JSON.parse(localStorage.getItem('uams'))
        self.headObj.title = self.addObj.title;
        if(self.accountCompCode){
            self.accountCompCode = self.accountCompCode.replace("\"","").replace("\"","")
        }
        if(uams == self.PLAT_ADMIN){
            self.referCode()
        }else{
            self.queryData()
        }
        self.maxHeight = document.body.clientHeight - 90;
        self.$refs.useSearch.$el.lastElementChild.style.maxHeight = self.maxHeight+'px';//模态框设置最大高度
        self.$nextTick(() => {
            self.$refs.useSearch.$el.lastElementChild.addEventListener('scroll', ()=>{
                let obj = self.$refs.useSearch.$el.lastElementChild;
                let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
                let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
                let modBoxHei = self.$refs.useSearch.$el.lastElementChild.offsetHeight;//模块盒子的高度
                let modBoxTop = self.$refs.useSearch.$el.lastElementChild.scrollTop;//模块盒子的scrollTop
                if(sumHeight >= modBoxHei){
                    if((sumHeight - modBoxHei) <= modBoxTop){
                        if(self.timer == null){
                            if(self.isScrollShow){
                                self.state++;
                                self.resultload('2',self.searchValue)
                            }
                        }
                    }
                }
            })
        })
    },
    watch:{
        'business':{
            handler:function(val,old){
                let self = this;
                new MultiPicker({
                    input: 'targetInput',
                    container: 'targetContainer',
                    jsonData:val,
                    success:function(arr){
                        console.log(arr)
                        if(arr[arr.length-1].id == 'xz'){
                            self.company = arr[arr.length-2].value
                            self.companyId = arr[arr.length-2].id
                        }else{
                            self.company = arr[arr.length-1].value
                            self.companyId = arr[arr.length-1].id
                        }
                        self.counterpart.forEach(function(item, index){
                            if(self.companyId == item.id){
                                self.companyCode = item.comp_code
                            }
                        })
                        self.$nextTick(()=>{
                            console.log(self.companyCode)
                            // self.searchLogo();
                        })
                    }
                });
            },
            deep:true
        }
    },
    methods: {
        createdCss(path){
            let head = document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1];
            let link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        createdJs(path){
            let head = document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1];
            let script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        },
        removejscssfile(filename, filetype){ 
            //判断文件类型 
            let targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; 
            //判断文件名 
            let targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; 
            let allsuspects=document.getElementsByTagName(targetelement); 
            //遍历元素， 并删除匹配的元素 
            for (let i=allsuspects.length; i>=0; i--){ 
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) 
            allsuspects[i].parentNode.removeChild(allsuspects[i]); 
            } 
        },
        backWay(data){
            let self = this;
            self.targetContainerShow = false;
            self.removejscssfile('MultiPicker.css','css')
            self.$nextTick(()=>{
                self.$router.back(self.addObj.path);
            })
        },
        finish(data){
            let self = this;
            let proInfo = '';
            if(self.companyCode == ''){
                self.$vux.toast.text('请选择企业', 'middle')
            }else if(self.searchValue == ''){
                self.$vux.toast.text('请选择用户', 'middle')
            }else if(!self.selectObj){
                self.$vux.toast.text('请选择有效的用户', 'middle')
            }else{
                if(!self.selectObj.account) {
                    proInfo = 'account不能为空'
                }else if(!self.selectObj.password) {
                    proInfo = '密码不能为空'
                }else if(!self.accountCompCode) {
                    proInfo = '企业编码不能为空'
                }else if(!self.selectObj.mobile) {
                    proInfo = '手机号不能为空'
                }else if(!self.selectObj.email) {
                    proInfo = '邮箱不能为空'
                } else if(!self.selectObj.real_name && self.selectObj.username) {
                    proInfo = '用户名不能为空'
                }
                let data = {
                    account: self.selectObj.account,
                    password: self.selectObj.password,
                    compCode: self.accountCompCode,
                    mobile: self.selectObj.mobile,
                    email: self.selectObj.email,
                    adminName: self.selectObj.real_name || self.selectObj.username
                }
                self.$axios({
                    url: '/UAMS/Auth/addAdmin',
                    method: 'post',
                    data: data
                })
                .then(function(res) {
                    console.log('2',res)
                    if(res.data.success){
                        self.$vux.toast.text('添加成功', 'middle')
                        self.targetContainerShow = false;
                        self.removejscssfile('MultiPicker.css','css')
                        self.$nextTick(()=>{
                            self.$router.back(self.addObj.path);
                        })
                    }else{
                        let msg = '添加失败,' + proInfo
                        self.$vux.toast.text(msg, 'middle')
                    }
                })
                .catch(function(res) {
                    console.log("queryManager error", res)
                })
            }
        },
        referCode(){//admin状态下请求集团与企业
            let self = this;
           /* self.$axios({
                url: '/UAMS/company/do_comp_query?pageSize=100000',
                method: 'post',
                data: {
                    "compName":""
                }
            })
            .then(function(res) {
                console.log('1',res)
                if(res.data.success){
                    let list = res.data.data.list;
                    self.backupsArr = [];
                    self.screenArr = [];
                    let arr = [];
                    list.forEach(function(item, index){
                        self.backupsArr.push(item)
                        arr.push(item.comp_name)
                    })
                    self.$nextTick(()=>{
                        self.screenArr.push(arr)
                    })
                }else{
                    self.$vux.toast.text(res.data.msg, 'middle')
                }
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })*/
            self.$axios({
                url: '/UAMS/company/do_comp_single_query_bycompanycode',
                method: 'post',
                responseType: 'json',
                data: {
                    compCode: self.jsonData.compCode,
                    type:"0"
                }
            })
            .then(function(res) {
                console.log('queryAllType',res);
                if(!res.data.success){
                    self.$vux.toast.text('请求集团报错', 'middle');
                    return
                }
                if(res.data.success){
                    let list = res.data.data;
                    self.counterpart = [];
                    self.business = list
                    self.circulation(self.business, 1)
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        circulation(arr, num){//公共循环方法
            let self = this;
            let obj = {
                id: "xz",
                comp_name: '请选择',
                enterprises:[]
            }
            if(num != 1){
                arr.unshift(obj)
            }
            arr.forEach(function(item, index){
                item.id = item.id.toString();
                self.$set(item, 'value', item.comp_name)
                self.$set(item, 'child', item.enterprises)
                self.counterpart.push(item)
                if(item.child.length == 0){

                }else{
                    self.circulation(item.child, 2)
                }
            })
        },
        queryData(){//企业状态下请求企业-------未做
            let self = this;
            self.$axios({
                url: '/UAMS/Auth/queryCompany',
                method: 'post',
                data: {
                    "compCode": self.accountCompCode ? self.accountCompCode : ''
                }
            })
            .then(function(res) {
                console.log('2',res)
                if(res.data.success){
                    let list = res.data.data.companyChildren;
                    let arr = [];
                    self.backupsArr = [];
                    self.screenArr = [];
                    list.forEach(function(item, index){
                        self.backupsArr.push(item)
                        arr.push(item.comp_name)
                    })
                    self.$nextTick(()=>{
                        self.screenArr.push(arr)
                    })
                }else{
                    self.$vux.toast.text(res.data.msg, 'middle')
                }
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })
        },
        onHide(type){//非完成关闭
            let self = this;
            console.log(type)
            console.log(self.showPopupPicker)
        },
        shadowChange(val){//切换企业执行的方法
            let self = this;
            console.log(val)
            self.backupsArr.forEach(function(item, index){
                if(val[0] == item.comp_name){
                    self.enterprise = item;
                }
            })
        },
        askSearch(val, type){
            let self = this;
            self.$axios({
                url: '/UAMS/user/list?pageSize='+self.pageSize+'&currentPage='+self.currentPage,
                method: 'post',
                data: {
                    compCode: self.companyCode,
                    username: val
                }
            })
            .then(function(res) {
                console.log('3',res)
                if(res.data.success){
                    let list = res.data.data.data;
                    if(list.length <= self.pageSize && list.length != 0){
                        self.loading = false;
                        if(self.currentPage == 1){
                            self.results = [];
                        }
                        if(list.length != 0 && type == 1){//输入字
                            self.$refs.useSearch.$el.lastElementChild.scrollTop = 0;
                        }
                        if(self.searchValue == val){
                            list.forEach(function(item, index){
                                self.results.push(item)
                            })
                        }
                        self.$nextTick(()=>{
                            if(self.results.length != 0){
                                if(list.length < self.pageSize){
                                    console.log(88888888)
                                    self.showLoad = false;
                                    self.loadText = '数据加载完毕';
                                    self.loading = true;
                                }else{
                                    let offheight = document.getElementsByClassName('user_deta')[0].offsetHeight;//单个高度
                                    let sumHeight = offheight*self.pageSize*self.currentPage;//总高度
                                    let modBoxHei = self.$refs.useSearch.$el.lastElementChild.offsetHeight;//模块盒子的高度
                                    let page = res.data.data.page
                                    if(page.currentPage == 1 && page.pageSize == 20){
                                        self.pageSize = 10;
                                        self.currentPage = 2;
                                    }
                                    if(sumHeight<=modBoxHei){
                                        self.state++;
                                        self.resultload('3',val)
                                    }
                                }   
                            }
                        })
                    }else{
                        self.showLoad = false;
                        if(self.currentPage == 1){
                            self.results = [];
                            self.loadText = '暂无数据'
                        }else{
                            self.loadText = '数据加载完毕'
                        }
                        self.loading = true;
                        self.timer = null;
                    }
                }else{
                    self.$vux.toast.text(res.data.msg, 'middle')
                }
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })
        },
        getResult (val) {//输入框值变化的时候
            let self = this;
            if(self.companyCode != ''){
                self.results = [];
                self.currentPage = 1;
                self.pageSize = 20;
                clearTimeout(self.timer)
                self.state++;
                self.timer = null;
                self.resultload('1', val)
            }
        },
        onFocus () {//触及input搜索框
            let self = this;
            self.userSearchShow = true;
            self.isScrollShow = true;
            // console.log('currentVal',self.currentVal)
            if(self.companyCode != ''){
                self.state++;
                self.currentPage = 1;
                self.pageSize = 20;
                self.$refs.useSearch.setFocus()
                if(self.timer == null){
                    self.resultload('0', self.searchValue)
                }
            }
        },
        onCancel () {//输入框取消按钮
            let self = this;
            // console.log('currentVal',self.currentVal)
            if(self.companyCode != ''){
                self.contTop = false;
                self.currentPage = 1;
                self.pageSize = 20;
                self.state = 0;
                self.timer = null;
                self.results = []
            }
        },
        onSubmit () {//移动端输入框的搜索按钮或者pc端的enter按钮
            let self = this;
            self.$refs.useSearch.setBlur()
        },
        selectName(item){//点击当前人物姓名
            let self = this;
            console.log(item)
            self.searchValue = item.real_name;
            self.userSearchShow = false;
            self.contTop = true;
            self.selectObj = item;
            self.isScrollShow = false;
            self.results = [];
        },
        resultload(type, val){//加载符号的公共样式
            let self = this;
            if(type == 0){//触及input搜索框
                self.currentPage = 1;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 1){//输入
                self.currentPage = 1;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 2){//无限加载
                self.currentPage++;
                self.loading = true;
                self.showLoad = true;
                self.loadText = '正在加载';
            }else if(type == 3){//数据撑不满框
                self.loading = true;
                self.currentPage++;
                self.showLoad = true;
                self.loadText = '正在加载';
            }
            if(self.state != 0){
                if(self.timer == null){
                    self.timer = setTimeout(() => {
                        // self.timer = null;
                        clearTimeout(self.timer)
                        self.timer = null;
                        if(self.isScrollShow){
                            self.askSearch(val,type);
                        }
                    },1000)
                }
            }   
        },
    }
}
</script>
<style lang="less" scoped>
.weui-loadmore{
    margin:10.5px auto;
}
.weui-loadmore.weui-loadmore_line{
    margin-top: 20px;
}
.user_deta{
    padding:.8rem;
    border-bottom:1px solid #D9D9D9;
}
.user_search{
    margin-top: 46px;
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 100;
}
#page_box{
    .container_top{
        margin:0;
        margin-top: 90px;
    }
    .user_text{
        margin-top: 90px;
    }
    .prompt_text{
        width:100%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        font-size: 0.8rem;
        color:#aaa;
    }
}
.g-label-ipt{
    display: block;
    width:100%;
    height:3.2rem;
    line-height: 3.2rem;
    border:none;
    box-sizing: border-box;
    padding: 0 1rem 0  1.2rem;
    font-size: 1.2rem;
    position: relative;
}
.g-logo-ipt{
    position: absolute;
    width:100%;
    height:3.2rem;
    line-height: 3.2rem;
    border:none;
    top:0;
    left:0;
    z-index:99;
    background: transparent;
    padding-left: 30%;
    padding-right: 8%;
    text-align: right;
    box-sizing: border-box;
    color:#999999;
}
.s-icon{
    float:right;
    font-size:0.8rem;
    color:#C8C8CD;
}
.s-company-box{
    border-bottom: 1px solid #D9D9D9;
}
</style>