<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
        <search
            @result-click="resultClick"
            @on-change="getResult"
            v-model="sysInput"
            top="46px"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            ref="search"
            class="search_box">
        </search>
        <div class="container_top orgcha" style="margin-top: 90px;" :style="{height: boxHeight+'px'}" ref="scrollerBottomBox">
            <div ref="scrol">
                <swipeout class="vux-1px-tb">
                    <template v-for="(item,index) in items">
                        <swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe">
                            <div slot="right-menu">
                                <swipeout-button @click.native="deleteData(item,index)" background-color="#D23934">删除</swipeout-button>
                            </div>
                            <div slot="content" :class="{'vux-1px-b': index !== 20, 'vux-1px-t': index === 1}">
                                <group>
                                    <cell
                                        :title="item.comp_name"
                                        :value="item.isGroup == 'Y' && item.comp_parent_code === 0 ? '集团' : item.comp_parent_code === 1 ? '生态企业' : '企业'"
                                        is-link
                                        @click.native="detailInfo(item)">
                                    </cell>
                                </group>
                            </div>
                        </swipeout-item>
                    </template>
                </swipeout>
                <load-more :show-loading="showLoad" :tip="loadText"></load-more>
            </div>
            <actionsheet v-model="addCompanyShow" :menus="menus" @on-click-menu="addJump">
            </actionsheet>
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellFormPreview, Search, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton, Actionsheet } from 'vux'
export default{
    components: {
        VHeader, Group, Cell, CellFormPreview, Search, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton, Actionsheet
    },
    data(){
        return{
            dataJson:{},
            goverAllot:{},
            items: [],
            headObj: {
                title: '平台企业管理',
                isBack: true,
            },
            rightObj: {
                isMore: true,
                icon: '&#xe6b9;',
            },
            sysInput:'',//搜索框的值
            //无限加载
            boxHeight: 200,//高度
            contentHei:0,
            scrolled: false,
            //请求参数
            currentPage: 1,//当前页数
            pageSize: 20,//一页几条信息
            //加载
            loadText: "正在加载",//加载指示字体
            showLoad: true,//加载指示符是否显示
            timer: null,
            //添加企业选择
            addCompanyShow: false,
            menus: {
                menu1: '企业注册',
                menu2: '生态企业注册',
            }
        }
    },
    mounted(){
        let self = this
        self.dataJson = JSON.parse(localStorage.getItem('jsonData'))
        self.goverAllot = JSON.parse(localStorage.getItem('GoverAllot'))
        self.queryManager()
        self.$nextTick(() => {
            self.boxHeight = document.body.clientHeight - 90;
            self.$refs.scrollerBottomBox.addEventListener('scroll', ()=>{
                let totalHei = self.$refs.scrol.offsetHeight - document.body.clientHeight;
                let scroll_top = self.$refs.scrollerBottomBox.scrollTop-90;
                if(totalHei == scroll_top || totalHei < scroll_top){
                    if(self.timer == null){
                        self.timer = setTimeout(() => {
                            if(self.currentPage == 1){
                                self.currentPage+=2;
                            }else{
                                self.currentPage++;
                            }
                            self.queryManager();
                        },1500)
                    }
                }
            })
        })
    },
    methods:{
        backWay(data){
            let self = this;
            self.$router.back('/dataconfig');
        },
        finish(data){
            let self = this
            self.addCompanyShow = !self.addCompanyShow;
        },
        addJump(key, val){
            let self = this;
            if(key == "menu1"){
                let item = {}
                item = {
                  title: '企业注册',
                  path: '/flatcompany',
                  state: '1'
                }
                localStorage.setItem("addPage", JSON.stringify(item));
                self.$router.go('/addflatcompany')
            }else if(key == "menu2"){
                let item = {}
                item = {
                  title: '生态企业注册',
                  path: '/flatcompany',
                  type: 'add',
                  state: '2'
                }
                localStorage.setItem("addZoology", JSON.stringify(item));
                self.$router.go('/addzoologycompany')
            }
        },
        queryManager(compName, currentPage) {//查询企业
            let self = this;
            console.log(self.currentPage)
            self.$axios({
                url: "/UAMS/company/do_comp_query?pageSize=" + self.pageSize + "&currentPage=" + self.currentPage,
                method: 'post',
                data: {
                    "compName": compName ? compName : '',
                }
            })
            .then(function(res) {
                if(res.status === 200) {
                    let list = res.data.data.list;
                    self.pageSize = 10;
                    if(list.length == 0 || list.length < self.pageSize){
                        if(self.currentPage == 1 && list.length == 0){
                            self.loadText = "暂无数据";
                        }else{
                            self.loadText = "数据加载完毕";
                        }
                        self.showLoad = false;
                    }
                    list.forEach(function(item, index){
                        self.items.push(item)
                    })
                    self.$nextTick( () => {
                        clearTimeout(self.timer)
                        self.timer = null;
                    })
                }
            })
            .catch(function(res) {
                console.log("queryManager error", res)
            })
        },
        resultClick(item) {
            console.log("resultClick", item)
        },
        getResult(val) {
            let self = this
            self.showLoad = true
            self.loadText = "正在加载"
            self.items = []; 
            self.currentPage = 1;
            self.pageSize = 20;
            setTimeout(() => {
                self.queryManager(val)
            }, 1000)
        },
        onFocus () {
            console.log('on focus')
        },
        onCancel () {
            console.log('on cancel')
        },
        deleteData(item, index) { //删除企业
            let self = this
            // self.enterpriseCode = item.comp_code
            self.$vux.confirm.show({
                title: '删除企业',
                content: '您确定要删除此企业吗？',
                onCancel () {
                    self.$refs.swipe[index].close();
                },
                onConfirm () {
                    self.$axios({
                        url: '/basic-platform/deleteComp',
                        method: 'post',
                        responseType: 'json',
                        data: {
                            sessionId: self.dataJson.sessionId,
                            enterpriseCode: item.comp_code
                        }
                    })
                    .then(function(res) {
                        console.log(res)
                        if(res.data.status == 200) {
                            self.$vux.toast.text("删除成功", 'middle')
                            self.$refs.swipe[index].close();
                            self.items.splice(index,1)
                        }
                   })  
                }
            })
        },
        detailInfo(item) {// 详情
            let self = this;
            console.log(item)
            let items = {}
            if(item.isGroup == 'Y' && item.comp_parent_code === 0){
                items = {
                  title: '集团详情',
                  path: '/flatcompany',
                  state: '0'
                }
                item.pathPage = "/flatcompany";
                localStorage.setItem("DetailsInfoMation", JSON.stringify(item))
                localStorage.setItem("addPage", JSON.stringify(items));
                self.$router.go('/addflatcompany')
            }else if(item.comp_parent_code === 1){
                items = {
                  title: '生态企业详情',
                  path: '/flatcompany',
                  type: 'details',
                  state: '3'
                }
                item.pathPage = "/flatcompany";
                localStorage.setItem("DetailsInfoMation", JSON.stringify(item))
                localStorage.setItem("addZoology", JSON.stringify(items));
                self.$router.go('/addzoologycompany')
            }else{
                items = {
                  title: '企业详情',
                  path: '/flatcompany',
                  state: '0'
                }
                item.pathPage = "/flatcompany";
                localStorage.setItem("DetailsInfoMation", JSON.stringify(item))
                localStorage.setItem("addPage", JSON.stringify(items));
                self.$router.go('/addflatcompany')
            }  
        },
    },
}
</script>
<style lang="less" scoped>
    
</style>