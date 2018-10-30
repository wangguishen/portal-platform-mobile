<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top orgcha relevance">
			<checklist label-position="left" :options="relevanArr" v-model="selectArr" @on-change="select_change"></checklist>
			<div v-show="hintShow" class="nohint">
				此企业还没有功能，请添加功能
			</div>
			<div class="check_box">
				<x-button class="check_all" v-show="checkAll" type="primary" @click.native="checkAllWay('1')">全选</x-button>
				<x-button class="check_all" v-show="halfCheckAll" plain type="primary" @click.native="checkAllWay('2')">全选</x-button>
				<x-button class="check_all" v-show="noCheckAll" plain @click.native="checkAllWay('3')">全选</x-button>
			</div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Checklist, XButton } from 'vux'
export default{
	components: {
        VHeader, Checklist, XButton
    },
	data(){
		return{
			resourceObj:{},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "关联",
            },
            relevan: [],
            relevanArr: [],//渲染的列表
            hintShow: false,
            selectArr:[],//选中的数组
            backupArr:[],//备份
            backSelect:[],//提交的数组
            backHasArr: [],//已经有的备份

            noCheckAll: false,//未全选
            halfCheckAll: false,//半全选
            checkAll: false,//全选
		}
	},
	mounted(){
		let self = this;
		self.resourceObj = JSON.parse(localStorage.getItem('relevanceObj'));
		self.headObj.title = self.resourceObj.module_name;
		self.moduleHandle();
	},
	watch:{
		'selectArr':{
			handler:function(val, old){
				let self = this;
				let boole = self.equal(val,self.backupArr);
				if(boole){
					self.rightObj.isMore = false;
				}else{
					self.rightObj.isMore = true;
				}
				self.noCheckAll = false;
				self.halfCheckAll = false;
				self.checkAll = false;
				if(self.relevanArr.length == val.length){
					self.checkAll = true;
				}else{
					if(val.length == 0){
						self.noCheckAll = true;
					}else{
						self.halfCheckAll = true;
					}
				}
			},
			deep:true,
		}
	},
	methods:{
		backWay(data){//返回按钮
			let self = this;
			self.$router.back('/resource')
		},
		finish(data){//完成按钮
			let self = this;
			// console.log(self.selectArr)//现在选中的
			// console.log(self.relevanArr)//全部的
			// console.log(self.backHasArr)//以前已经有的
			let arr1 = self.selectArr.slice(0);//最后为新增的数组
			let arr2 = self.backupArr.slice(0);//最后为删除的数组
			let date = [];
			for(let k=0;k<arr1.length;k++){
				for(let j=0;j<self.backupArr.length;j++){
					if(self.backupArr[j] == arr1[k]){
						arr1.splice(k,1)
					}
				}
			}
			for(let j=0;j<arr2.length;j++){
				for(let k=0;k<self.selectArr.length;k++){
					if(arr2[j] == self.selectArr[k]){
						arr2.splice(j,1)
					}
				}
			}
			self.$nextTick(()=>{
				let arr = arr1.concat(arr2)
				for(let j=0;j<arr1.length;j++){
					for(let k=0;k<self.relevanArr.length;k++){
						if(arr1[j] == self.relevanArr[k].id){
							let obj = {
								moduleId: self.resourceObj.id,
			                    systemId: self.resourceObj.system_id,
			                    compCode: self.relevanArr[k].comp_code,
			                    type: 1,//0或者1  取消或保存
			                    actionId: self.relevanArr[k].id,
			                    actionName: self.relevanArr[k].action_name,
							}
							date.push(obj)
						}
					}
				}
				for(let j=0;j<arr2.length;j++){
					for(let k=0;k<self.relevanArr.length;k++){
						if(arr2[j] == self.relevanArr[k].id){
							let obj = {
								moduleId: self.resourceObj.id,
			                    systemId: self.resourceObj.system_id,
			                    compCode: self.relevanArr[k].comp_code,
			                    type: 0,//0或者1  取消或保存
			                    actionId: self.relevanArr[k].id,
			                    actionName: self.relevanArr[k].action_name,
							}
							date.push(obj)
						}
					}
				}
				self.finishHandle(date)
			})
		},
		finishHandle(data){//完成提交
			let self = this;
			let url = "/UAMS/permission/ajax/do_action_is_save_module_for_permission";
			self.$axios({
                url: url,
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                	self.$vux.toast.text(res.data.msg, 'middle')
          			self.$router.back('/resource')
	        	}
            })
            .catch(function(res) {
                console.log("报错了")
            })
		},
		haveHandle(){//已经存在的
			let self = this;
			let url = "/UAMS/Authorization/ajax/do_find_dept_role_module_action_for_authorization";
			let data = {
				'moduleId': self.resourceObj.id,
			}
			let method = 'post';
			let type = "cx";
			self.askHandle(url, data, method, type)
		},
		moduleHandle(){//请求所有的
			let self = this;
			let url = "/UAMS/action/ajax/do_query_action?pageSize=10000";
			let data = {
				"compCode": self.resourceObj.comp_code,
                "actionName": '',
                "pageSize":10000,
                "currentPage":1
			};
			let method = 'post';
			let type = "sy";
			self.askHandle(url, data, method, type)
		},
		askHandle(url, data, method, type){//请求所有的操作
			let self = this;
			self.$axios({
                url: url,
                method: method,
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                if(res.data.success){
                	if(type == 'sy'){
                		let list = res.data.data.list;
                		if(list.length == 0){
		                	self.hintShow = true;
		                }else{
		                	list.forEach(function(item, index){
		                		self.$set(item,'key',item.id)
		                		self.$set(item,'value',item.action_name)
			                	self.relevanArr.push(item);
			                })
			                self.haveHandle();
		                }
                	}else if(type == 'cx'){
                		let list = res.data.data
                		// self.backHasArr = list;
                		for(let x=0;x<self.relevanArr.length;x++){
                			for(let y=0;y<list.length;y++){
                				if(self.relevanArr[x].id == list[y].id){
                					self.selectArr.push(self.relevanArr[x].id)
                					self.backupArr.push(self.relevanArr[x].id)
                				}
                			}
                		}
                		self.selectArr.sort(self.sortArr)
                		self.backupArr.sort(self.sortArr)
                	}
            	}
            })
            .catch(function(res) {
                console.log("报错了")
            })
		},
		select_change(val){
		},
		checkAllWay(num){
			let self = this;
			if(num == 1){//全选
				self.selectArr = []
			}else if(num == 2){//半全选
				self.selectArr = [];
				self.relevanArr.forEach(function(item, index){
					self.selectArr.push(item.id)
				})
			}else if(num == 3){//未全选
				self.relevanArr.forEach(function(item, index){
					self.selectArr.push(item.id)
				})
			}
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
		sortArr (obj1, obj2) {//排序
		    let val1 = obj1.id;
		    let val2 = obj2.id;
		    if (val1 < val2) {
		        return -1;
		    } else if (val1 > val2) {
		        return 1;
		    } else {
		        return 0;
		    }            
		},
	},
}
</script>
<style lang="less" scoped>
.selsect_icon{
	height:2.5rem;
	line-height: 2.5rem;
	padding-left: .5rem;
}
.icon_style{
	width:100%;
}
.nohint{
	text-align: center;
	font-size: 0.8rem;
	color:#666;
}
.check_box{
	width:90%;
	margin: 0 5%;
	position: fixed;
	bottom:.5rem;
	left:0;
}
</style>