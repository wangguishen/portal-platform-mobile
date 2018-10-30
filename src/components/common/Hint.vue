<template>
	<div class="hint" v-show="state.isShow">
		<div class="hint_box" ref="hint_box" :style="{marginLeft: Wit + 'px',marginTop: Hei + 'px'}">
			{{ state.name }}
		</div>
	</div>
</template>
<script>
export default{
	props:{
        state: Object,
    },
	data(){
		return {
			Wit: 0,//获得margin-left的负值
			Hei: 0,//获得margin-top的负值
			hintShow: true,
		}
	},
	watch:{
		'state':{
			handler:function(val,old){
				let self = this;
				if(val.isShow){
					setTimeout(() => {
			            val.isShow = false;
			   		}, val.time || 1500)
				}
				self.$nextTick(() => {
					let width = self.$refs.hint_box.offsetWidth;
					self.Wit = -self.$refs.hint_box.offsetWidth/2;
					self.Hei = -self.$refs.hint_box.offsetHeight/2;
				})	
			},
			deep: true
		}
	},
	mounted(){
		let self = this;
	},
}
</script>
<style lang="less" scoped>
.hint{
	position: fixed;
	top:0;
	left:0;
	z-index:10000;
	height:100%;
	width:100%;
	.hint_box{
		position: fixed;
		top:50%;
		left:50%;
		padding: 1rem;
		max-width: 50%;
		box-sizing: border-box;
		word-wrap:break-word;
		word-break:break-all;
		// width: 8rem;
		// height: 6rem;
		// line-height: 6rem;
		// text-align: center;
		// margin-left: -3rem;
		// margin-top: -4rem;
		border-radius: .5rem;
		background: rgba(0,0,0,0.5);
		color: #fff;
	}
}
</style>