<template>
	<div class="box">
		<div class="first" @click="gover()">
			<span>{{ dataObj.comp_name }}</span>
			<i class="iconfont" v-html="goverIcon"></i>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			goverIcon: "&#xe600",
		}
	},
	props:{
        dataList: Array,
        dataObj: Object,
    },
	methods:{
		gover(){
			let self = this;
			self.goverIcon = "&#xe620";
		},
	}
}
</script>
<style lang="less" scoped>
.box{
	.first{
		width:100%;
		box-sizing: border-box;
		padding:1rem;
		// height:2rem;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
	}
}
.iconfont{
	float:right;
	font-size: 1.2rem;
	color: #ccc;
}
</style>