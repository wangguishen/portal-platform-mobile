<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top orgcha">
			<group>
				<swipeout>
					<template v-if="sysList.length != 0">
						<template v-for="(sys,index) in sysList">
							<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe1">
								<div slot="right-menu">
		      						<swipeout-button @click.native="onButtonClick('xz',sys,'1',index,sysList)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
								</div>
								<div slot="content" class="vux-1px-b">
									<cell
										class="my_cell"
										:class="{'user_styl':sys.moduleWeight}"
										:title="sys.system_name"
										:border-intent="false"
										:arrow-direction="sys.systemShow ? 'down' : 'right'"
										@click.native="lookClassify(sys, sysList, index)"
										:is-link="sys.children ? true : false">
									</cell>
								</div>
							</swipeout-item>
							<template v-if="sys.systemShow">
								<template v-if="sys.children.length != 0">
									<template v-for="(first,a) in sys.children">
										<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe2">
											<div slot="right-menu">
					      						<swipeout-button @click.native="onButtonClick('gl',first,'2',a,sys.children)" background-color="#dedc25" class="iconfont" :width="60">&#xe61e;</swipeout-button>
					      						<swipeout-button @click.native="onButtonClick('xz',first,'2',a,sys.children)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
					      						<swipeout-button @click.native="onButtonClick('bj',first,'2',a,sys.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
					      						<swipeout-button @click.native="onButtonClick('sc',first,'2',a,sys.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
											</div>
											<div slot="content" class="vux-1px-b">
												<cell
													class="first_cell"
													:class="{'user_styl':first.moduleWeight}"
													:title="first.module_name"
													:border-intent="false">
												</cell>
											</div>
										</swipeout-item>
									</template>
								</template>
								<template v-else>
									<div class="prompt_text">
										目前没有模块，请添加模块
									</div>
								</template>
							</template>
						</template>
					</template>
					<template v-else>
						<div class="prompt_text">
							目前没有系统，请添加系统
						</div>
					</template>
				</swipeout>
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton
    },
	data(){
		return{
			currentFrim: {},//集团
			gover:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            sysList: [],//系统的数组集合
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.gover = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.gover.name;
		self.askSystem();
	},
	methods:{
		backWay(data){
			let self = this;
			self.$router.back('/mangenallot')
		},
		askSystem(){//查询系统
			let self = this;
			self.$axios({
                url: "/UAMS/system/do_system_query?pageSize=10000&currentPage=1",//一次请求1w条
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.currentFrim.comp_code
                }
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                    let list = res.data.data.list;
                    list.forEach(function(item, index){
                    	self.$set(item,'systemShow',false)
                    	self.$set(item,'children',[])
                    	self.sysList.push(item)
                    })
                    self.askLcm();
                }else{
                    console.log("后台返回错误")
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		askLcm(){//请求模块
			let self = this;
			self.$axios({
                url: "/UAMS/permission/ajax/do_find_module_by_comp",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.currentFrim.comp_code,
                }
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                	let list = JSON.parse(res.data.data);
                	self.$nextTick(()=>{
	                	let hash = {};
	                	for(let i = 0;i<list.length;i++){
			        		hash[list[i].id] = list[i];
			        		self.$set(list[i],'moduleWeight',true)
			        	}
			        	for(let i = 0;i<self.sysList.length;i++){
			        		hash[self.sysList[i].id] = self.sysList[i];
			        	}
			        	for(let j = 0;j<list.length;j++){
			        		let cur = list[j],hashVP = hash[list[j].parent_id];
			        		self.$set(list[j],'firstShow',false)
			        		if (hashVP) {
			        			!hashVP['children'] && (self.$set(hashVP,'children',[]));
				 			 	hashVP['children'].push(cur);
			        		}else{
			        			self.sysList.push(cur)
			        		}
			        	}
			        })
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
		},
		lookClassify(obj, list, index){//点击系统
			let self = this;
			list.forEach(function(item, index){
				if(item.id == obj.id){
					if(item.parent_id){
						item.firstShow = !item.firstShow;
					}else{
						item.systemShow = !item.systemShow;
					}
				}else{
					if(item.parent_id){
						item.firstShow = false;
					}else{
						item.systemShow = false;	
					}
				}
			})
			self.$refs.swipe1.forEach(function(val,index){
				val.close();
			})
		},
		onButtonClick(type, obj, num, index, list){//新增、编辑、删除等操作
			let self = this;
			let data = {};
      		let url = "";
			if(type == 'xz'){
				self.$vux.confirm.prompt('', {
    				title: '新增模块',
    				closeOnConfirm: false,
    				onCancel () {
			          	self.numClose(num, index);
			        },
			        onConfirm (msg) {
			          	if(msg == ""){
			          		self.$vux.toast.show({
			          			text: "请输入新增模块名称",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else{
			          		url = "/UAMS/materiel/ajax/do_add_module_for_system_app";
			          		data = [{
			                    'id': -1,
			                    'compCode': self.currentFrim.comp_code,
			                    'moduleCode': self.getRandomString(10),
			                    'moduleName': msg,
			                    'parentId': obj.id,
			                    'systemId': obj.system_id || obj.id
			                }]
			                if(num >= 6){
					    		self.$vux.toast.show({
				          			text: "此资源管理最高层级为6级",
				          			position: "middle",
				          			time: 1500,
				          			type: 'text',
				          			width: '13rem',
				          		})
				          		self.$vux.confirm.hide();//弹框隐藏
	          					self.numClose(num, index);
					    	}else{
					    		self.askChangeData(url, data, type, obj, num, index, list);
					    	}
			          	}
			        }
    			})
			}else if(type == 'bj'){
				self.$vux.confirm.prompt(obj.module_name, {
    				title: '编辑模块',
    				content: obj.module_name,
    				closeOnConfirm: false,
    				onCancel () {
			          	self.numClose(num, index);
			        },
			        onConfirm (msg) {
			          	if(msg == ""){
			          		self.$vux.toast.show({
			          			text: "模块名称不能为空",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else{
			          		url = "/UAMS/materiel/ajax/do_add_module_for_system_app";
			          		data = [{
			          			'id': obj.id,
			                    'compCode': self.currentFrim.comp_code,
			                    'moduleCode': obj.module_code,
			                    'moduleName': msg,
			                    'parentId': obj.parent_id,
			                    'systemId': obj.system_id
			                }]
					    	self.askChangeData(url, data, type, obj, num, index, list);
			          	}
			        }
    			})
			}else if(type == 'sc'){
				self.$vux.confirm.show({
					title: '删除模块',
					content: '您确定要删除此模块吗？',
					onCancel () {
						self.numClose(num, index);
					},
					onConfirm () {
						url = "/UAMS/materiel/ajax/do_del_module_for_system_app";
		      			data = [{
		      				'compCode':self.currentFrim.comp_code,
		                    'systemId': obj.system_id,
		                    'id': obj.id,
		      			}]
		      			self.askChangeData(url, data, type, obj, num, index, list);
					}
				})
			}else if(type == 'gl'){
				localStorage.setItem("relevanceObj", JSON.stringify(obj));
				self.$router.go('/relevance')
			}
		},
		askChangeData(url, data, type, obj, num, index, list){
			let self = this;
			self.$axios({
	    		url: url,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.success){
    				self.$nextTick(()=>{
    					if(type == 'xz'){
    						let str = res.data.data;
    						self.$set(str,'firstShow',false);
    						if("children" in obj){
								obj.children.push(str);
	    					}else{
	    						self.$set(obj,'children',[])
	    						obj.children.push(str);
	    					}
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	          				self.$vux.toast.text('新增模块成功', 'middle')
	    				}else if(type == 'bj'){
	    					obj.module_name = data[0].moduleName;
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	          				self.$vux.toast.text('修改模块成功', 'middle')
	    				}else if(type == 'sc'){
	    					list.splice(index,1)
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	          				self.$vux.toast.text('删除模块成功', 'middle')
	    				}
    				})	
	    		}else{
          			self.$vux.toast.text(res.data.msg, 'middle')
          			self.numClose(num, index);
          		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
		},
		numClose(num, index){//关闭右侧滑动
			let self = this;
			if(num == 1){
				self.$refs.swipe1[index].close();
			}else if(num == 2){
				self.$refs.swipe2[index].close();
			}else if(num == 3){
				self.$refs.swipe3[index].close();
			}else if(num == 4){
				self.$refs.swipe4[index].close();
			}else if(num == 5){
				self.$refs.swipe5[index].close();
			}else if(num == 6){
				self.$refs.swipe6[index].close();
			}else if(num == 7){
				self.$refs.swipe7[index].close();
			}
		},
		getRandomString(len) {//随机数
	        len = len || 32;
	        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	        let maxPos = chars.length;
	        let pwd = '';
	        for (let i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	        }
	        return pwd;
	    },
	},
}
</script>
<style lang="less" scoped>
.prompt_text{
	width:100%;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
	font-size: 1rem;
	color:#aaa;
}
.my_cell{
	border-bottom: 1px solid #efefef;
}		
</style>