<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top orgcha">
			<group>
				<swipeout>
      				<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe1">
      					<div slot="right-menu">
				          	<swipeout-button @click.native="onButtonClick('xz',currentFrim,'1',0)" :width="60" background-color="#38ce58" class='iconfont'>&#xe6b9;</swipeout-button>
						</div>
						<div slot="content" class="vux-1px-b">
							<cell
								:title="currentFrim.comp_name"
								:arrow-direction="goverShow ? 'down' : 'right'"
								:border-intent="false"
								@click.native="lookClassify()"
								is-link>
							</cell>
						</div>
					</swipeout-item>
					<template v-if="goverShow">
						<template v-for="(first,index) in firstList">
		      				<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe2">
		      					<div slot="right-menu">
		      						<swipeout-button @click.native="onButtonClick('xz',first,'2',index,firstList)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
		      						<swipeout-button @click.native="onButtonClick('bj',first,'2',index,firstList)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
						          	<swipeout-button @click.native="onButtonClick('sc',first,'2',index,firstList)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
								</div>
								<div slot="content" class="vux-1px-b">
									<cell
										class="first_cell"
										:title="first.dept_name" 
										:border-intent="false"
										:arrow-direction="first.firstShow ? 'down' : 'right'"
										@click.native="firstClass(first, firstList)"
										:is-link="first.children ? true : false">
									</cell>
								</div>
							</swipeout-item>
							<template v-if="first.firstShow">
								<template v-for="(double,a) in first.children">
									<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe3">
				      					<div slot="right-menu">
								          	<swipeout-button @click.native="onButtonClick('xz',double,'3',a,first.children)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
				      						<swipeout-button @click.native="onButtonClick('bj',double,'3',a,first.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
								          	<swipeout-button @click.native="onButtonClick('sc',double,'3',a,first.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
										</div>
										<div slot="content" class="vux-1px-b">
											<cell
												class="double_cell"
												:title="double.dept_name" 
												:border-intent="false"
												:arrow-direction="double.firstShow ? 'down' : 'right'"
												@click.native="firstClass(double, first.children)"
												:is-link="double.children ? true : false">
											</cell>
										</div>
									</swipeout-item>
									<template v-if="double.firstShow">
										<template v-for="(triple,b) in double.children">
											<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe4">
						      					<div slot="right-menu">
						      						<swipeout-button @click.native="onButtonClick('xz',triple,'4',b,double.children)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
				      								<swipeout-button @click.native="onButtonClick('bj',triple,'4',b,double.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
										          	<swipeout-button @click.native="onButtonClick('sc',triple,'4',b,double.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
												</div>
												<div slot="content" class="vux-1px-b">
													<cell
														class="triple_cell"
														:title="triple.dept_name"
														:border-intent="false"
														:arrow-direction="triple.firstShow ? 'down' : 'right'"
														@click.native="firstClass(triple, double.children)"
														:is-link="triple.children ? true : false">
													</cell>
												</div>
											</swipeout-item>
											<template v-if="triple.firstShow">
												<template v-for="(ultra,c) in triple.children">
													<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe5">
								      					<div slot="right-menu">
								      						<swipeout-button @click.native="onButtonClick('xz',ultra,'5',c,triple.children)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
				      										<swipeout-button @click.native="onButtonClick('bj',ultra,'5',c,triple.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
												          	<swipeout-button @click.native="onButtonClick('sc',ultra,'5',c,triple.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
														</div>
														<div slot="content" class="vux-1px-b">
															<cell
																class="ultra_cell"
																:title="ultra.dept_name"
																:border-intent="false"
																:arrow-direction="ultra.firstShow ? 'down' : 'right'"
																@click.native="firstClass(ultra, triple.children)"
																:is-link="ultra.children ? true : false">
															</cell>
														</div>
													</swipeout-item>
													<template v-if="ultra.firstShow">
														<template v-for="(penta,d) in ultra.children">
															<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe6">
										      					<div slot="right-menu">
										      						<swipeout-button @click.native="onButtonClick('xz',penta,'6',d,ultra.children)" background-color="#38ce58" class="iconfont" :width="60">&#xe6b9;</swipeout-button>
				      												<swipeout-button @click.native="onButtonClick('bj',penta,'6',d,ultra.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
														          	<swipeout-button @click.native="onButtonClick('sc',penta,'6',d,ultra.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
																</div>
																<div slot="content" class="vux-1px-b">
																	<cell
																		class="penta_cell"
																		:title="penta.dept_name"
																		:border-intent="false"
																		:arrow-direction="penta.firstShow ? 'down' : 'right'"
																		@click.native="firstClass(penta, ultra.children)"
																		:is-link="penta.children ? true : false">
																	</cell>
																</div>
															</swipeout-item>
															<template v-if="penta.firstShow">
																<template v-for="(hexa,e) in penta.children">
																	<swipeout-item :auto-close-on-button-click="false" transition-mode="follow" ref="swipe7">
												      					<div slot="right-menu">
				      														<swipeout-button @click.native="onButtonClick('bj',hexa,'7',e,penta.children)" background-color="#38a9ce" class="iconfont" :width="60">&#xe648;</swipeout-button>
																          	<swipeout-button @click.native="onButtonClick('sc',hexa,'7',e,penta.children)" background-color="#D23934" class="iconfont" :width="60">&#xe627;</swipeout-button>
																		</div>
																		<div slot="content" class="vux-1px-b">
																			<cell
																				class="hexa_cell"
																				:title="hexa.dept_name"
																				:border-intent="false"
																				:arrow-direction="hexa.firstShow ? 'down' : 'right'"
																				@click.native="firstClass(hexa, penta.children)"
																				:is-link="hexa.children ? true : false">
																			</cell>
																		</div>
																	</swipeout-item>
																</template>
															</template>
														</template>
													</template>
												</template>
											</template>
										</template>
									</template>
								</template>
							</template>
						</template>
	      			</template>
	      		</swipeout>
			</group>
			<div class="prompt_text">
				此架构最高层级为7级
			</div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, CellBox, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, CellBox, Swipeout, SwipeoutItem, SwipeoutButton
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
            goverShow: false,//集团图标显示
            firstList:[],
            confirmShow: true,
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.gover = JSON.parse(localStorage.getItem('GoverAllot'));
		self.headObj.title = self.gover.name;
	},
	watch:{
	},
	methods:{
		backWay(data){
			let self = this;
			self.$router.back('/mangenallot')
		},
		lookClassify(){//点击集团查看分类
			let self = this;
			self.goverShow = !self.goverShow;
			if(self.goverShow){
				let url = "/UAMS/department/query_dep_list";
				let data = {
					"compCode": self.currentFrim.comp_code,
				}
				self.askClassify(url, data)
			}
		},
		firstClass(first, list){//展开分组样式
			let self = this;
			list.forEach(function(item, index){
				if(item.id == first.id){
					item.firstShow = !item.firstShow
				}else{
					item.firstShow = false;
				}
			})
		},
		askClassify(url, data){//公共请求
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
                	let list = res.data.data;
                	self.firstList = [];
		        	let hash = {};
		        	for(let i = 0;i<list.length;i++){
		        		hash[list[i].id] = list[i];
		        	}
		        	for(let j = 0;j<list.length;j++){
		        		let cur = list[j],hashVP = hash[list[j].parent_id];
		        		self.$set(list[j],'firstShow',false)
		        		if (hashVP) {
		        			!hashVP['children'] && (self.$set(hashVP,'children',[]));
			 			 	hashVP['children'].push(cur);
		        		}else{
		        			self.firstList.push(cur)
		        		}
		        	}
                }else{
                	console.log("后台500")
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		onButtonClick(type, obj, num, index, list){//新增、编辑、删除等操作
			let self = this;
			let data = {};
      		let urls = "";
			if(type == 'xz'){//新增
				self.$vux.confirm.prompt('', {
    				title: '新增部门',
    				closeOnConfirm: false,
    				onCancel () {
			          	self.numClose(num, index);
			        },
			        onConfirm (msg) {
			          	if(msg == ""){
			          		self.$vux.toast.show({
			          			text: "请输入新增部门名称",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else{
			          		urls = "/UAMS/department/addDep";
			      			data = {
				    			'compCode':self.currentFrim.comp_code,
				    			'sysCode':obj.system_id || obj.comp_code,
					    		'deptName':msg,
								'deptCode':self.getRandomString(10),
								'deptParentCode':obj.id,
					    	}
					    	if(num >= 7){
					    		self.$vux.toast.show({
				          			text: "此架构最高层级为7级",
				          			position: "middle",
				          			time: 1500,
				          			type: 'text',
				          			width: '11rem',
				          		})
				          		self.$vux.confirm.hide();//弹框隐藏
	          					self.numClose(num, index);
					    	}else{
					    		self.askChangeData(urls, data, type, obj, num, index, list);
					    	}
			          	}
			        }
    			})
			}else if(type == "bj"){//编辑
				self.$vux.confirm.prompt(obj.dept_name, {
    				title: '修改部门',
    				closeOnConfirm: false,
    				onCancel () {
			          	self.numClose(num, index);
			        },
			        onConfirm (msg) {
			          	if(msg == ""){
			          		self.$vux.toast.show({
			          			text: "请输入修改部门名称",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '11rem',
			          		})
			          	}else if(msg == obj.dept_name){
			          		self.$vux.toast.show({
			          			text: "您修改的部门名称与原来一致",
			          			position: "middle",
			          			time: 1500,
			          			type: 'text',
			          			width: '15rem',
			          		})
			          	}else{
			          		urls = "/UAMS/department/updateDep";
			      			data = {
			      				'compCode': self.currentFrim.comp_code,
				    			'sysCode': obj.system_id,
					    		'oldDeptCode': obj.dept_code,
					    		'id': obj.id,
					    		'newDeptName': msg,
					    		'newDeptCode': self.getRandomString(10),
								'newParentCode': obj.parent_id,
			      			}
			          	}
			          	self.askChangeData(urls, data, type, obj, num, index, list);
			        }
    			})
			}else if(type == 'sc'){//删除
				self.$vux.confirm.show({
					title: '删除部门',
					content: '您确定要删除此部门吗？',
					onCancel () {
						self.numClose(num, index);
					},
					onConfirm () {
						urls = "/UAMS/department/deleteDep";
		      			data = {
		      				'compCode':self.currentFrim.comp_code,
			    			'sysCode': obj.system_id,
			    			'id': obj.id,
				    		'deptCode': obj.dept_code,
		      			}
		      			self.askChangeData(urls, data, type, obj, num, index, list);
					}
				})
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
	    	.then(function(response) {
	    		console.log(response)
	    		if('comp_parent_code' in obj){
	    			if(response.data.success){
	    				let str = response.data.data;
	    				self.firstList.push(str)
		    			self.$vux.confirm.hide();//弹框隐藏
	          			self.numClose(num, index);
	          		}else{
	          			self.$vux.toast.text(response.data.msg, 'middle')
	          		}
	    		}else{
	    			if(response.data.success){
	    				let str = response.data.data;
	    				if(type == 'xz'){
	    					if("children" in obj){
								obj.children.push(str);
	    					}else{
	    						self.$set(obj,'children',[])
	    						obj.children.push(str);
	    					}
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	    				}else if(type == 'bj'){
	    					obj.dept_name = data.newDeptName;
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	    				}else if(type == 'sc'){
	    					list.splice(index,1)
	    					self.$vux.confirm.hide();//弹框隐藏
	          				self.numClose(num, index);
	    				}
	    			}else{
	          			self.$vux.toast.text(response.data.msg, 'middle')
	          			self.numClose(num, index);
	          		}
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
		},
		numClose(num, index){//关闭右侧滑动
			let self = this;
			if(num == 1){
				self.$refs.swipe1.close();
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
	font-size: 0.8rem;
	color:#aaa;
}
</style>