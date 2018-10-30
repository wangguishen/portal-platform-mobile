<template>
	<div>
		<swipeout-item transition-mode="follow">
			<div slot="right-menu">
	          	<swipeout-button @click.native="onButtonClick()" background-color="#D23934">删除</swipeout-button>
			</div>
			<div slot="content" class="vux-1px-b">
				<cell
					:class="LeftDist"
					:title="first.dept_name" 
					:border-intent="false"
					:arrow-direction="first.firstShow ? 'down' : 'right'"
					@click.native="firstClass(first, firstList)"
					:is-link="first.children ? true : false">
				</cell>
			</div>
		</swipeout-item>
	</div>
</template>
<script>
import { SwipeoutItem, SwipeoutButton, Cell } from 'vux'
export default{
	components: {
        SwipeoutItem, SwipeoutButton, Cell
    },
    props:{
        first: Object,
        firstList: Array,
        LeftDist: String,
    },
	data(){
		return{

		}
	},
	mounted(){
		let self = this;
		console.log(self.first)
	},
	methods:{
		onButtonClick(){//删除
			let self = this;
			console.log("删除")
		},
		firstClass(first, list){
			let self = this;
			console.log("展开关闭")
			self.$emit('firstClass',first,list)
		},
	}
}
</script>
<style lang="less" scoped>
	
</style>