<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top jurisdiction">
			<div v-for="obj in companyList">
				<group>
	                <cell
	                    :title="obj.comp_name"
	                    :arrow-direction="obj.showBusiness ? 'down' : 'right'"
	                    is-link
	                    @click.native="subbusiness(obj)">
	                </cell>
	                <template v-if="obj.showBusiness">
	                    <template v-for="item in obj.children">
	                        <cell
	                            class="jurisdictions"
	                            :title="item.comp_name"
	                            :arrow-direction="item.showBusiness ? 'down' : 'right'"
	                            :border-intent="false"
	                            is-link
	                            @click.native="subsidiary(item)">
	                        </cell>
	                        <template v-if="item.showBusiness">
	                            <template v-for="child in item.children">
	                                <cell-box :border-intent="false" is-link class="sub-item" @click.native="jumpPage(child)">{{ child.comp_name }}</cell-box>
	                            </template>
	                        </template>
	                    </template>
	                </template>
	            </group>
	        </div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellBox } from 'vux'
export default{
	components: {
        VHeader, Group, Cell, CellBox
    },
	data(){
		return{
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            	title: "完成",
            },
            jsonData: {},//当前用户信息
            parentObj: {},//父企业信息
            companyList: [],//所有二级子企业信息
            companyLister: [],//所有二级子企业信息备份

		}
	},
	mounted(){
		let self = this;
        self.jsonData = JSON.parse(localStorage.getItem('jsonData'));
        let obj = JSON.parse(localStorage.getItem('PreviousPageData'));
        self.$set(obj, 'backup_name', obj.comp_name)
        obj.comp_name = obj.comp_short_name
        self.parentObj = JSON.parse(localStorage.getItem('PreviousPageData'));
        self.companyLister = JSON.parse(localStorage.getItem('secondSonFirm'));
        self.headObj.title = self.parentObj.items.comp_name
        self.$set(self.parentObj.items, 'children', [])
        self.$set(self.parentObj.items, 'showBusiness', true)
        self.parentObj.items.children.push(obj.items)
        self.companyList.push(self.parentObj.items)
        self.companyLister.forEach(function(item, index){
        	self.$set(item, 'showBusiness', false)
        	self.companyList[0].children.push(item)
        })
        // for(let x=0;x<self.companyList.length;x++){
        // 	for(let y=0;y<self.companyLister.length;y++){
        // 		if(self.companyList[x].id == self.companyLister[y].comp_parent_code){
        // 			self.$set(self.companyLister[y], 'showBusiness', false)
        // 			self.companyList[x].children.push(self.companyLister[y])
        // 		}
        // 	}
        // }
	},
	methods: {
		backWay(data){//返回页面
			let self = this;
			self.$router.back(self.parentObj.path)
		},
		subbusiness(data){
			let self = this;
			data.showBusiness = !data.showBusiness;
    //         if(data.children.length != 0){
    //         	data.showBusiness = !data.showBusiness;
    //         }else{
    //         	data.path_page = '/secondjurisdiction'
				// localStorage.setItem("currentFrim", JSON.stringify(data));
    //         	self.$router.go('/mangenallot')
    //         }
		},
		subsidiary(data){
			let self = this;
			data.path_page = '/secondjurisdiction'
			localStorage.setItem("currentFrim", JSON.stringify(data));
        	self.$router.go('/mangenallot')
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>