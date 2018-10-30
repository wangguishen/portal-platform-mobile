<template>
	<div>
		<group>
			<x-input class="ipt" title="服务器名称" text-align="right" placeholder="请输入服务器名称" v-model="serverList.name"></x-input>
			<x-input class="ipt" title="服务器地址" text-align="right" placeholder="请输入服务器地址" v-model="serverList.address"></x-input>
		</group>
	</div>
</template>
<script>
import { Group, Cell, XInput } from 'vux'
export default{
	components: {
		Group, Cell, XInput
    },
    props:{
        serverList: Object,
    },
	data(){
		return{

		}
	},
	mounted(){

	},
	methods:{

	},
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