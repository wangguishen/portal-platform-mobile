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
                                        :title="item.name"
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
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellFormPreview, Search, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default{
    components: {
        VHeader, Group, Cell, CellFormPreview, Search, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton
    },
    data(){
        return{
            dataJson:{},
            goverAllot:{},
            items: [],
            headObj: {
                title: '新增管理员',
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
            self.$router.back('/jurisdiction');
        },
        finish(data){
            let self = this
            let item = {}
            item = {
              title: '新增管理员',
              path: '/newadmin'
            }
            localStorage.setItem("addPage", JSON.stringify(item));
            self.$router.go('/adduseradmin')
        },
        queryManager(compCode, currentPage) {//查询管理员
            let self = this;
            console.log(self.pageSize)
            console.log(self.currentPage)
            self.$axios({
                url: '/UAMS/adminReq/queryAdminManager?pageSize=' + self.pageSize + "&currentPage=" + self.currentPage,
                method: 'post',
                data: {
                    "compCode": compCode ? compCode : '',
                }
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success) {
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
            clearTimeout(self.timer)
            self.timer = null;
            self.showLoad = true
            self.loadText = "正在加载"
            self.items = []; 
            self.currentPage = 1;
            self.pageSize = 20;
            self.timer = setTimeout(() => {
                clearTimeout(self.timer)
                self.timer = null;
                self.queryManager(val)
            }, 1000)
        },
        onFocus () {
            console.log('on focus')
        },
        onCancel () {
            console.log('on cancel')
        },
        deleteData(item, index) { //删除管理员
            let self = this
            self.$vux.confirm.show({
                title: '删除管理员',
                content: '您确定要删除此管理员吗？',
                onCancel () {
                    self.$refs.swipe[index].close();
                },
                onConfirm () {
                    self.$axios({
                        url: '/UAMS/adminReq/deleteAdminManager',
                        method: 'post',
                        responseType: 'json',
                        data: {
                            id: item.id
                        }
                    })
                    .then(function(res) {
                        console.log(res)
                        if(res.data.success) {
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
            item.pathPage = "/newadmin";
            localStorage.setItem("DetailsInfoMation", JSON.stringify(item))
            self.$router.go('/editAdmin')
        },
    },
}
</script>
<style lang="less" scoped>
    
</style>