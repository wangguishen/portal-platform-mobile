<template>
	<div>
		<group>
			<x-input class="ipt" title="功能名称" text-align="right" placeholder="请输入功能名称" v-model="operateList.name"></x-input>
			<x-input class="ipt" title="功能编码" text-align="right" placeholder="请输入功能编码" v-model="operateList.code"></x-input>
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
        operateList: Object,
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