<template>
	<div>
		<group>
			<x-input class="ipt" title="系统名称" text-align="right" placeholder="请输入系统名称" v-model="groupList.name"></x-input>
			<x-input class="ipt" title="系统编码" text-align="right" placeholder="请输入系统编码" v-model="groupList.code"></x-input>
			<cell class="dem" title="系统模型" :value="groupList.type" @click.native="typeShow = !typeShow" is-link></cell>
		</group>
		<div v-transfer-dom>
      		<popup v-model="typeShow" height="170px" is-transparent>
        		<div style="width: 95%;background-color:#fff;height:150px;margin:0 auto;border-radius:5px;padding-top:10px;">
		         	<div style="padding:20px 15px 0;" v-for="type in types">
		          		<x-button :type="type.typeText" @click.native="selectType(type)">{{ type.name }}</x-button>
		         	</div>
    			</div>
      		</popup>
    	</div>
	</div>
</template>
<script>
import { Group, Cell, XInput, Popup, TransferDom, XButton } from 'vux'
export default{
	directives: {
    	TransferDom
  	},
	components: {
        Group, Cell, XInput, Popup, XButton
    },
    props:{
        groupList: Object,
    },
	data(){
		return {
			typeShow: false,//模型选择
			types: [
				{
					typeText: 'default',//选种颜色
					name: '通用权限模型',
					state: 0,
				}, {
					typeText: 'default',
					name: 'RBAC权限模型',
					state: 0,
				}
			],
		}
	},
	mounted (){
        let self = this;
     //    if(self.groupList.type == ''){
     //    	self.groupList.type = "请选择权限模型";
     //    }else{
     //    	self.types.forEach(function(item, index){
     //    		if(item.name == self.groupList.type){
     //    			item.state = 1;
					// item.typeText = 'primary';
     //    		}
     //    	})
     //    }
    },
	watch: {
		'groupList': {
			handler: function(val, old){
				// console.log(val)
				let self = this;
				if(val.type == ''){
		        	val.type = "请选择权限模型";
		        }else{
		        	self.types.forEach(function(item, index){
		        		if(item.name == val.type){
		        			item.state = 1;
							item.typeText = 'primary';
		        		}
		        	})
		        }
			},
			deep: true
		}
	},
	methods: {
		selectType(type){
			let self = this;
			self.types.forEach(function(item, index){
				item.state = 0;
				item.typeText = 'default';
			});
			type.state = 1;
			type.typeText = 'primary';
			self.typeShow = false;
			self.groupList.type = type.name;
		},
	}
}
</script>
<style lang="less" scoped>
	.dem.weui-cell{//改变cell的样式
		padding:0 10px;
	}
	.ipt.weui-cell{
		padding-right:20px;
	}
</style>