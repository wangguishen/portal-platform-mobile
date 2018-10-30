<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
	    <div class="logsDetail" style="margin-top: 46px;">
	    	<group>
			    <cell title="主题" :value="paraDetail.topic"></cell>
			    <cell title="客户端编码" :value="paraDetail.clientCode"></cell>
			    <x-textarea title="信息日志" :autosize="true" :value="paraDetail.message" :readonly="true"></x-textarea>
			    <cell title="操作" :value="paraDetail.operation"></cell>
			    <cell title="最后更新时间" :value="paraDetail.lastUpdateDate"></cell>
			</group>
	    </div>
	</div>
</template>

<script>
import VHeader from '../../common/Header'
import {Search,LoadMore, Toast,Group,XTextarea,Cell}from 'vux'
export default {
	components: {
		VHeader,Search,LoadMore, Toast,Group,XTextarea,Cell
	},
	data() {
		return {
			headObj: {
                title: '日志展示详情',
                isBack: true,
            },
            rightObj: {
            	isMore: true,
            	// title: "完成",
            	// icon:'&#xe6b9;'
            },
            paraDetail:{},
            options:[
	        	{label:'更新',value:'update'},
	        	{label:'新增',value:'add'},
	        	{label:'删除',value:'delete'},
	        	{label:'插入',value:'insert'}
	        ],
		}
	},
	mounted() {
		let self = this;
		let detailsJson = JSON.parse(localStorage.getItem('logShowDetails'))
		console.log('detailsJson',detailsJson)
		self.options.forEach(function(item,index){
			if (item.value == detailsJson.operation) {
				detailsJson.operation = item.label;
			}
		})
		detailsJson.lastUpdateDate = self.changeTime(detailsJson.lastUpdateDate)
		self.paraDetail = detailsJson;
	},
	methods: {
		backWay(){//返回上个页面
			let self = this;
			self.$router.back('/LogShow');
		},
		finish(){
			let self = this;
		},
		changeTime(time) {
		    let self = this;
		    let newTime = new Date(time);
		    let obj = {
		        month: '',
		        day: ''
		    };
		    let times = '';
		    if (newTime.getMonth() + 1 > 0 && newTime.getMonth() + 1 < 10) {
		        obj.month = '0' + (newTime.getMonth() + 1);
		    } else {
		        obj.month = newTime.getMonth() + 1;
		    }
		    if (newTime.getDate() > 0 && newTime.getDate() < 10) {
		        obj.day = '0' + newTime.getDate();
		    } else {
		        obj.day = newTime.getDate();
		    }
		    times = newTime.getFullYear() + "-" + obj.month + "-" + obj.day;
		    return times;
		},	
	}
}
</script>

<style lang="less" scoped>
	.logsDetail .vux-x-textarea {
		box-sizing: border-box;
		word-wrap: break-word;
		font-weight: 700;
		color: #4d4d4d;
	}
	/*.logsDetail .weui-cell .weui-cell__bd .weui-textarea{
		color: #999;
	}*/
	.logsDetail .weui-cell {
		padding: 0 15px;
	}
</style>