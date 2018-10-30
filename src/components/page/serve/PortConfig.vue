<template>
	<div id="page_box" class="portConfig">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div>
			<search
	            @result-click="resultClick"
	            :results="results"
	            v-model="serveInput"
	            @on-change="getResult"
	            @on-focus="onFocus"
	            @on-cancel="onCancel"
	            @on-submit="onSubmit"
	            ref="search"
	            style="margin-top: 48px;">
	        </search>
	        <div :class="{'tab':tab}">
	        	<div class="sysgover" v-for="(item,index) in items">
			    	<group class="first_blond">
			        	<cell
				        	:title="item.serviceName"
				        	is-link
			                :border-intent="false"
			                :arrow-direction="item.show ? 'down' : 'right'"
			                @click.native="unfold(item, index)">
			        	</cell>
			        	<template class="erjibox" v-if="item.show">
			        		<swipeout>
						    	<swipeout-item transition-mode="follow" underlay-color="#ccc" v-for="(list,index) in lists" :key="index">
						    		<div slot="right-menu">
								        <swipeout-button @click.native="onButtonDelete(list, index)" type="warn">删除</swipeout-button>
									</div>
						        	<div slot="content" class="demo-content vux-1px-tb">
						        		<cell-box :border-intent="false" class="sub-item" is-link @click.native="details(list, index)">{{list.interName}}
						        		</cell-box>
						        	</div>
					        	</swipeout-item>
				        	</swipeout>
			        	</template>
			        </group>
			    </div>
	        </div>
	        <load-more :show-loading="showLoad" :tip="loadText"></load-more>
	    </div>
	</div>
</template>

<script>
	import VHeader from '../../common/Header'
	import { Search, Group, Cell, CellBox, XHeader, Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton, Swiper, SwiperItem, Confirm, PopupHeader, Popup, Radio, LoadMore, Toast} from 'vux'
	export default {
		components:{
	        VHeader,
	        Group,
	        Cell,
	        CellBox,
	        Confirm,
	        Search,
	        Tab,
	        TabItem,
	        Swiper,
	        SwiperItem,
	        Swipeout,
	       	SwipeoutItem,
	      	SwipeoutButton,
	      	PopupHeader,
	      	Popup,
	      	Radio,
	      	LoadMore,
	      	Toast
		},
		data () {
			return{
				index: 0,
				showMenus: false,
				show:false,
				delshow:false,
				options1:[],//服务列表
				title:"接口配置",
	            results: [],
	            serveInput: '',//搜索框内容
	            headObj:{
	                title:"接口配置",
	                isBack:true
            	},
	            rightObj:{
	            	isMore:true,
	                // title:'完成',
	                icon: '&#xe6b9;',
	            },
	            tab:false,
	            service:'',
	            items:[],
	            lists:[],
	            pageSize:10,
	            currentPage:1,
	            selServer:'',//选中的服务
	            selListIndex:0,
	            selPortIndex:'',//选中的接口id
	            loadText: "",//加载指示字体
            	showLoad: true,//加载指示符是否显示
            	timer:null,//定时器
			}
		},
		mounted(){
			let self = this;
			self.askServe();
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
	            self.selServer = item.id;//服务id
	            console.log(item.id)
	            console.log('=',item.serviceName)
	            localStorage.setItem('serveName',JSON.stringify(item));
	            self.getPort();
	        },
	        getResult(val){//搜索框
	            let self = this;
	            self.serveInput = val;
	            self.items=[];
	            self.loadText="正在加载";
	            self.showLoad=true;
	            if (self.timer == null) {
	            	self.timer = setTimeout(()=>{
	            		clearTimeout(self.timer);
	            		self.timer=null;
	            		self.askServe();
	            	},1000)
	            }
	        },
			askServe(){//请求服务
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
	                self.items = [];
	                if (askData.length == 0) {
	                	self.loadText="暂无数据";
	                }else{
	                	self.loadText="数据加载完毕"
	                }
	                self.showLoad=false;
	                askData.forEach(function(item,index){
	                    item.show = false;
	                    self.items.push(item);
	                })
	                console.log('itmes',self.items)
	                self.lists= [];
	                localStorage.setItem('serviceData',JSON.stringify(askData));
	                self.getPort();
	            })
	            .catch(function(response){
	                console.log("error");
	            })
			},
			getPort(){//请求接口
				let self = this;
				let data={
					'mId' : parseInt(self.selServer),
    				'interName':self.serveInput
				}
				self.$axios({
	      			url: self.BP_HOST+'/inter/sel?pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&mId='+self.selServer+'&interName='+self.serveInput,
	      			method: 'get',
		    		responseType: 'json',
		    		data: data
	    		})
				.then(function(response){
					let portData=response.data.data;
					console.log(portData)
					portData.forEach(function(list,index){
						self.lists.push(list);
					})
					console.log(self.lists)
					localStorage.setItem('portConfigData',JSON.stringify(portData));//当前点击行所有接口
				})
				.catch(function(response){
					console.log("error")
				})
			},
			details(list,index){//详情
				let self = this;
				console.log(list,index)
				let portId = list.id;//当前接口id
				console.log(portId);
				console.log('=',self.selServer);//当前服务mId
				localStorage.setItem('portList',JSON.stringify(list));//当前接口所有信息
				self.$router.go('/EditParameters');
			},
			goes(){
	            let self = this;
	        },
	        finish(data){//右上角添加接口
	        	let self = this;
	        	self.$router.go('/AddPort')
	            console.log(data);
	        },
	        backWay(data){//左上角返回
	        	let self = this;
	        	self.$router.back('/DataConfig');
	            console.log(data)
	        },
	        onButtonClick () {//编辑
      			const _this = this
      			this.show = true;
      			this.title="服务配置"
    		},
    		onButtonEdit(){//编辑接口所属服务
    			let self = this;
    			self.showTransfer = true;
    		},
    		onButtonDelete(list, index){//删除
    			let self = this;
    			// self.delshow=true;
    			console.log(list, index)
    			self.selListIndex=index;
    			self.selPortIndex = list.id;
    			self.$vux.confirm.show({
    				title:'操作提示',
    				content:'确定删除吗?',
    				onCancel(){
    					self.$vux.toast.text('已取消删除!','middle');
    				},
    				onConfirm(){
    					self.ondelConfirm();
    				}
    			},1500)
    			console.log(self.selPortIndex);
    		},
    		ondelConfirm(){//删除确认
    			let self = this;
				let data = {
					'id' : self.selPortIndex
				}
				self.$axios({
					url: self.BP_HOST+'/inter/del',
	      			method: 'delete',
		    		responseType: 'json',
		    		data: data
				})
				.then(function(respose){
					console.log(respose);
					if (respose.status == 200) {
						self.$vux.toast.text('删除接口成功!','middle')
						self.lists.splice(self.selListIndex,1);
						// self.getPort();
					}else{
						self.$vux.toast.text('删除接口失败!','middle')
					}
				})
				.catch(function(respose){
					console.log("error");
				})
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
	        onFocus () {//搜索框获取焦点
	            console.log('on focus')	
	            this.tab = true;
	        },
	        onCancel () {//搜索框取消
	            console.log('on cancel')
	            this.tab = false;
	        },
	        onShow () {//弹框打开
	          	console.log('promt show')
	        },
	        onHide () {//弹框关闭
	          	console.log('prompt hide')
	        },
	        onCancel1 () {//弹框取消
	          	console.log('prompt cancel')
	        }
	    }
	}
	
</script>

<style lang="less" scoped>
	/*.demo-content {
  		padding: 10px 10px;
	}*/
	.tab-swiper {
  		background-color: #fff;
  		height: 60px;
  		text-align: center;
	}
</style>
<style>
	.tab{
		margin-top: 92px;
	}
	.erjibox .vux-1px-tb{
		padding: 0 10px;
	}
</style>