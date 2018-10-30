<template>
	<div id="page_box">
		<v-header :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top jurisdiction">
            <div v-for="obj in objItems">
                <group>
                    <cell
                        :title="obj.name"
                        :arrow-direction="obj.showBusiness ? 'down' : 'right'"
                        is-link
                        @click.native="subbusiness(obj)">
                    </cell>
                    <template v-if="obj.showBusiness">
                        <template v-for="item in obj.children">
                            <cell
                                class="jurisdictions"
                                :title="item.comp_name"
                                :arrow-direction="item.showBusiness ? 'down' : 'right'"
                                :border-intent="false"
                                is-link
                                @click.native="subsidiary(item)">
                            </cell>
                            <template v-if="item.showBusiness">
                                <template v-for="child in item.children">
                                    <cell-box :border-intent="false" is-link class="sub-item" @click.native="jumpPage(child)">{{ child.comp_name }}</cell-box>
                                </template>
                            </template>
                        </template>
                    </template>
                </group>
            </div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellBox, LoadMore } from 'vux'
export default {
    components: {
        VHeader, Group, Cell, LoadMore, CellBox
    },
    data(){
        return {
            headObj:{
                title: '权限管理',
                isBack: false,
            },
            rightObj:{
            	isMore: false,
            },
            jsonData: {},//当前用户信息
            uams: '',//当前平台
            compCode: '',//企业编码
            items: [],
            objItems: [
                {
                    id: 1001,
                    name: "新增管理员",
                    route: '/newadmin',
                    showBusiness: false
                },
                {
                    id: 1002,
                    name: "更换企业LOGO",
                    route: '/addcomplogo',
                    showBusiness: false
                },
                {
                    id: 999,
                    name: "用户类型控制",
                    showBusiness: false,
                    children: [
                        {
                            showBusiness: false,
                            route: '/link',
                            comp_name: '页面访问控制'
                        },
                        {
                            showBusiness: false,
                            route: '/SpaceSetting',
                            comp_name: '空间资源配置'
                        },
                        {
                            showBusiness: false,
                            route: '/userTypeChange',
                            comp_name: '用户类型变更'
                        },
                        {
                            showBusiness: false,
                            route: '/enterpriseUserImport',
                            comp_name: '企业用户导入'
                        }
                    ]
                },
                {
                    id: 1000,
                    name: "角色类型控制",
                    showBusiness: false,
                    children: [],
                }
            ],
            bottomCount: 20,
            boxHeight:500,
            pathWay:'',
        }
    },
    mounted(){
    	let self = this;
        self.jsonData = JSON.parse(localStorage.getItem('jsonData'));
        self.compCode = JSON.parse(localStorage.getItem('compCode'));
        console.log(self.jsonData)
    	self.uams = JSON.parse(localStorage.getItem('uams'));
    	self.$nextTick(() => {
    		self.boxHeight = document.body.clientHeight - 46;
      		// this.$refs.scrollerBottom.reset({top: 0})
    	})
        if(self.uams == self.PLAT_ADMIN){
            self.askGroup();
        }else if(self.uams == self.ENTERPRISE_ADMIN){
            self.compQuery();
        }
    	
    },
    destroyed(){
        let self = this;
        if(self.pathWay == '/addcomplogo'){
            // self.createdCss('./static/MultiPicker.css')
            self.createdJs('./static/MultiPicker.js')
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
        askGroup(){//查询所有集团
        	let self = this;
        	self.$axios({
                url: '/UAMS/company/do_comp_query?pageSize=10000&currentPage=1',
                method: 'post',
                responseType: 'json',
                data: {
                    "compName":""
                }
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                	let list = res.data.data.list;
                	list.forEach(function(item, index){
                		if(item.comp_parent_code == 0){
                			item.showBusiness = false;
                			item.children = [];
                			self.objItems[3].children.push(item)
                            self.items.push(item);
                		}
                	})
                	console.log(self.items)
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        compQuery() { /*非admin登录*/
            let self = this;
            console.log(self.jsonData)
            self.$axios({
                url: '/UAMS/Auth/queryCompany',
                method: 'post',
                responseType: 'json',
                data: {
                    compCode: self.compCode
                }
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success) {
                    let list = res.data.data.company;
                    list.showBusiness = false;
                    list.children = [];
                    self.objItems[3].children.push(list)
                    self.items.push(list);
                }else{
                    self.$vux.toast.text('请求角色类型错误','middle')
                }
            })
            .catch(function(res) {
                console.log("compQuery error", res)
            })
        },
        subbusiness(item){
            let self = this;
            if(item.route){
                localStorage.setItem("GoverAllot", JSON.stringify(item));
                self.pathWay = item.route;
                self.createdJs('./static/MultiPicker.js')
                self.$nextTick(()=>{
                    self.$router.go(item.route)
                })
            }else{
                self.objItems.forEach(function(value, key){
                    if(item.id == value.id){
                        item.showBusiness = !item.showBusiness;
                    }else{
                        value.showBusiness = false;
                    }
                })
            }
                
        },
        subsidiary(item){//显示子企业
        	let self = this;
            if(item.route){
                let obj = {
                    route: item.route,
                    name: item.comp_name
                }
                localStorage.setItem("GoverAllot", JSON.stringify(obj));
                self.$router.go(obj.route)
            }else{
                self.objItems[3].children.forEach(function(value, key){
                    if(item.id == value.id){
                        item.showBusiness = !item.showBusiness;
                    }else{
                        value.showBusiness = false;
                    }
                })
                self.sonEnter(item)
            }
        },
        sonEnter(item){//查询子企业
        	let self = this;
        	let data = {
                "compCode": item.comp_code
            };
        	self.$axios({
                url: '/UAMS/Auth/queryCompany',
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                console.log(item)
                if(res.data.success){
                	item.children = [];
                	let company = res.data.data.company;
                    self.$set(company, 'backup_name', company.comp_name)
                    company.comp_name = company.comp_short_name
                	let companyChildren = res.data.data.companyChildren;
                	item.children.push(company)
                	if(companyChildren){
                		companyChildren.forEach(function(value, key){
	                		item.children.push(value)
	                	});
                	}
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        jumpPage(item){//跳转子企业
        	let self = this;
            console.log('item',item)
            // if(item.comp_parent_code == 0){
            //     localStorage.setItem("currentFrim", JSON.stringify(item));
            //     self.$router.go('/mangenallot')
            // }else{
                self.$axios({
                    url: '/UAMS/company/do_compcode_children_query',
                    method: 'post',
                    responseType: 'json',
                    data: {
                        "compCode":item.comp_code
                    }
                })
                .then(function(res) {
                    console.log("res",res)
                    if(!res.data.success){
                        self.$vux.toast.text(res.data.msg,'middle')
                        return
                    }
                    let list = res.data.data;
                    let gather = {
                        path: '/jurisdiction',
                        items: item
                    }
                    localStorage.setItem("PreviousPageData", JSON.stringify(gather));
                    if(list.length != 0){
                        localStorage.setItem("secondSonFirm", JSON.stringify(list));
                        self.pathWay = '/secondjurisdiction';
                        self.$router.go('/secondjurisdiction')
                    }else{
                        item.path_page = '/jurisdiction'
                        localStorage.setItem("currentFrim", JSON.stringify(item));
                        self.pathWay = '/mangenallot';
                        self.$router.go('/mangenallot')
                    }
                })
                .catch(function(res) {
                    console.log("error", res)
                })
            // }  
        },
    },
}
</script>
<style lang="less" scoped>
	.box2-wrap {
  		height: 300px;
  		overflow: hidden;
	}
	.sub-item{
		color:#666;
	}
</style>