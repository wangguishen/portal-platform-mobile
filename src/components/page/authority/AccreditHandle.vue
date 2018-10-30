<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top orgcha accredit">
			<group>
				<template v-if="sysList.length != 0">
					<template v-for="(sys,index) in sysList">
						<cell
							class="my_cell"
							:title="sys.system_name"
							:border-intent="false"
							:arrow-direction="sys.systemShow ? 'down' : 'right'"
							@click.native="lookClassify(sys, sysList)"
							:is-link="sys.children ? true : false">
						</cell>
						<template v-if="sys.systemShow">
							<template v-if="sys.children.length != 0">
								<template v-for="(first,a) in sys.children">
									<cell
										class="first_cell"
										:title="first.module_name"
										:border-intent="false">
										<div class="val_box">
											<icon v-show="first.hollowShow" @click.native="check('0',first)" type="circle"></icon>
											<icon v-show="first.pigeonShow" @click.native="check('1',first)" type="success-circle"></icon>
											<icon v-show="first.checkedShow" @click.native="check('2',first)" type="success"></icon>
										</div>
									</cell>
									<template v-if="first.children.length != 0">
										<checklist class="double_cells" label-position="left" :options="first.children" v-model="listArr" :check-disabled="false" @on-change="changeHandle(first)"></checklist>
									</template>
									<template v-else>
										<div class="prompt_text prompt_ts">
											{{first.module_name}}模块没有功能点，请关联功能点
										</div>
									</template>
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
			</group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, Radio, Checklist, Swipeout, SwipeoutItem, SwipeoutButton, Icon } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton, Radio, Checklist, Icon
    },
	data(){
		return{
			currentFrim: {},//集团
			accreditHandle:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	title: "授权",
            },
            sysList: [],//系统的数组集合
            listArr: [],//提交的操作集合
            backupArr: [],//备份的已有操作集合
            listObj: [],//一开始已经有的功能点
            listStr: [],
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.accreditHandle = JSON.parse(localStorage.getItem('accreditHandle'));
		self.headObj.title = self.accreditHandle.title;
		// 先请求系统
		self.askSys();
		// 在请求已经有的功能点
		// self.askHaveHandle();
	},
	watch:{
		'listArr':{
			handler: function(val, old){
				let self = this;
				let boole = self.equal(val,self.backupArr);
				if(boole){
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
			},
			deep: true
		}
	},
	methods:{
		backWay(data){
			let self = this;
			self.$router.back('/empower')
		},
		finish(data){
			let self = this;
			let arr = self.listArr.slice(0);
			let arr2 = self.backupArr.slice(0);
			for(let k=0;k<arr.length;k++){
				for(let j=0;j<self.backupArr.length;j++){
					if(self.backupArr[j] == arr[k]){
						arr.splice(k,1)
					}
				}
			}
			for(let j=0;j<arr2.length;j++){
				for(let k=0;k<self.listArr.length;k++){
					if(arr2[j] == self.listArr[k]){
						arr2.splice(j,1)
					}
				}
			}
			self.referAccredit(arr,arr2)
		},
		referAccredit(arr1, arr2){//授权
			let self = this;
			let data = [];
			let url = '/UAMS/Authorization/ajax/do_authorization_update';
			arr1.forEach(function(item, index){
				let obj = {};
				obj.roleId = self.accreditHandle.id;
				obj.resourceId = item.split('-')[0];
				obj.type = 1;
				data.push(obj)
			})
			arr2.forEach(function(item, index){
				let obj = {};
				obj.roleId = self.accreditHandle.id;
				obj.resourceId = item.split('-')[0];
				obj.type = 0;
				data.push(obj)
			})
			self.$axios({
                url: url,
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                if(res.data.success) {
                	self.$vux.toast.text('授权成功', 'middle');
                	self.askHaveHandle();
                }else{
                    self.$vux.toast.text('授权失败', 'middle')
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		askSys(){//请求系统
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
                if(res.data.success){
                    let list = res.data.data.list;
                    list.forEach(function(item, index){
                    	self.$set(item,'systemShow',true)
                    	self.$set(item,'children',[])
                    	self.sysList.push(item)
                    })
                    self.askLcm();//请求所有模块
                }else{
                    console.log("后台返回错误")
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
		},
		askLcm(){//请求所有模块
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
                if(res.data.success){
                	let list = JSON.parse(res.data.data);
                	list.forEach(function(item, index){
                		self.$set(item,'hollowShow',true);//是否显示空心圆
                		self.$set(item,'pigeonShow',false);//是否显示对号圆
                		self.$set(item,'checkedShow',false);//是否显示满圆--全选
                		self.$set(item,'children',[])
                		self.askHandle(item)
                	})
                	self.$nextTick(()=>{
	                	let hash = {};
	                	for(let i = 0;i<list.length;i++){
			        		hash[list[i].id] = list[i];
			        	}
			        	for(let i = 0;i<self.sysList.length;i++){
			        		hash[self.sysList[i].id] = self.sysList[i];
			        	}
			        	for(let j = 0;j<list.length;j++){
			        		let cur = list[j],hashVP = hash[list[j].parent_id];
			        		self.$set(list[j],'firstShow',true)
			        		if (hashVP) {
			        			!hashVP['children'] && (self.$set(hashVP,'children',[]));
				 			 	hashVP['children'].push(cur);
			        		}else{
			        			self.sysList.push(cur)
			        		}
			        	}
			        	self.askHaveHandle()
			        })
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
        },
        askHandle(val){//请求当前模块下已经有的功能点
			let self = this;
			self.$axios({
                url: "/UAMS/Authorization/ajax/do_find_dept_role_module_action_for_authorization",
                method: 'post',
                responseType: 'json',
                data: {
                    'moduleId': val.id,
                }
            })
            .then(function(res) {
                if(res.data.success){
                	let list = res.data.data;
                	if(!val.hasOwnProperty('children')){
            			self.$set(val,'children',[])
            		}
                	if(list.length != 0){
                		list.forEach(function(item, index){
                			self.$set(item,'module_name',item.action_name)
                			self.$set(item,'moduleShow',true)
                			self.$set(item,'key',(item.resource_id+'-'+item.module_id))
                			self.$set(item,'value',item.action_name)
                			val.children.push(item)
	                	})
                	}else{
                		val.hollowShow = false;
						val.pigeonShow = false;
						val.checkedShow = false;
                		// self.$vux.toast.text('目前没有关联功能，请先关联功能', 'middle')
                	}
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
		},
		askHaveHandle(){//请求当前已经有的模块
			let self = this;
			self.$axios({
                url: "/UAMS/Authorization/ajax/do_find_role_action_for_authorization",
                method: 'post',
                responseType: 'json',
                data: {
                    'roleId': self.accreditHandle.id,
                }
            })
            .then(function(res) {
                if(res.data.success){
                	if(res.data.data){
                		let list = res.data.data;
                		self.listArr = [];
                		self.backupArr = [];
                		list.forEach(function(item, index){
                			let num = item.id+'-'+item.module_id;
                			self.listArr.push(num)
                			self.backupArr.push(num)
                		})
                		self.listArr.sort()
    					self.backupArr.sort()
                	}
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
		},
		changeHandle(value){//单选控制多选
			let self = this;
			let child = value.children;
			self.listObj = [];
			self.listStr = [];
			for(let k=0;k<child.length;k++){
				self.listObj.push(child[k].key)
			}
			// if(){}
			let bool = self.isContained(self.listArr, self.listObj)
			value.hollowShow = false;
			value.pigeonShow = false;
			value.checkedShow = false;
			if(self.listStr.length == 0){
				value.hollowShow = true;
			}else{
				if(bool){
					value.checkedShow = true;
				}else{
					value.pigeonShow = true;
				}
			}
			self.listArr.sort()
			self.backupArr.sort()
		},
		check(index, item){
			let self = this;
			item.hollowShow = false;
			item.pigeonShow = false;
			item.checkedShow = false;
			if(index == 0){
				item.checkedShow = true;
				for(let i=0;i<item.children.length;i++){
					self.listArr.push(item.children[i].key)
				}
			}else if(index == 1){
				item.checkedShow = true;
				for(let i=0;i<item.children.length;i++){
					for(let k=0;k<self.listArr.length;k++){
						if(item.children[i].key == self.listArr[k]){
							self.listArr.splice(k,1);
						}
					}
				}
				for(let i=0;i<item.children.length;i++){
					self.listArr.push(item.children[i].key)
				}
			}else if(index == 2){
				item.hollowShow = true;
				for(let i=0;i<item.children.length;i++){
					for(let k=0;k<self.listArr.length;k++){
						if(item.children[i].key == self.listArr[k]){
							self.listArr.splice(k,1);
						}
					}
				}
			}
			self.listArr.sort()
			self.backupArr.sort()
		},
		equal(objA, objB){
	    	let self = this;
    		if (typeof arguments[0] != typeof arguments[1]){
        		return false;
    		}
			//数组
    		if (arguments[0] instanceof Array){
        		if (arguments[0].length != arguments[1].length){
            		return false;
        		}
        		let allElementsEqual = true;
        		for (let i = 0; i < arguments[0].length; ++i){
		            if (typeof arguments[0][i] != typeof arguments[1][i]){
		                return false;
		            }
		            if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number'){
		                allElementsEqual = (arguments[0][i] == arguments[1][i]);
		            }else{
		                // allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等     
		                allElementsEqual = self.equal(arguments[0][i], arguments[1][i])
		            }
		        }
        		return allElementsEqual;
    		}
    		return arguments[0] == arguments[1];
		},
		isContained(a, b){
			let self = this;
    		if(!(a instanceof Array) || !(b instanceof Array)) return false;
    		// if(a.length < b.length) return false;
    		var aStr = a.toString();
    		for(var i = 0, len = b.length; i < len; i++){
		       	if(aStr.indexOf(b[i]) != -1){
		       		self.listStr.push(b[i])
		       	}
		    }
    		for(var i = 0, len = b.length; i < len; i++){
		       	if(aStr.indexOf(b[i]) == -1){
		       		return false;
		       	}
		    }
		    return true;
		}
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
.prompt_ts{
	font-size: 0.8rem;
}
.my_cell{
	border-bottom: 1px solid #efefef;
}
.val_box{
    padding-right: 0.35em;
}
</style>