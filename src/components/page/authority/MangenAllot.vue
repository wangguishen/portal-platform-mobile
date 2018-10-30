<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
		<div class="container_top sysgover">
            <div v-for="rout in routers">
                <group>
                    <cell :title="rout.name" @click.native="jumpMangen(rout)" is-link></cell>
                </group>
            </div>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, CellBox, Group } from 'vux'
export default{
	components: {
        VHeader, Cell, Group, CellBox
    },
	data(){
		return{
			currentFrim: {},
			headObj: {
                title: '',
                isBack: true,
            },
            rightObj: {
            	isMore: false,
            },
            routers: [],
		}
	},
	mounted(){
		let self = this;
		self.currentFrim = JSON.parse(localStorage.getItem('currentFrim'));
		self.headObj.title = self.currentFrim.comp_name;
        let uams = JSON.parse(localStorage.getItem('uams'));
        if(uams == self.PLAT_ADMIN){
            self.routers = [
                {
                    route: '/sysgover',
                    name: '系统管理',
                    type: 'xt'
                }, {
                    route: '/sysgover',
                    name: '功能管理',
                    type: 'cz'
                }, {
                    route: '/resource',
                    name: '资源管理',
                    type: 'zy'
                }, {
                    route: '/rolegover',
                    name: '角色管理',
                    type: 'js'
                }, {
                    route: '/userrole',
                    name: '用户角色管理',
                    type: 'yhjs'
                }, {
                    route: '/empower',
                    name: '授权管理',
                    type: 'sq'
                }
            ]
        }else if(uams == self.ENTERPRISE_ADMIN){
            self.routers = [
                {
                    route: '/resource',
                    name: '资源管理',
                    type: 'zy'
                }, {
                    route: '/rolegover',
                    name: '角色管理',
                    type: 'js'
                }, {
                    route: '/userrole',
                    name: '用户角色管理',
                    type: 'yhjs'
                }, {
                    route: '/empower',
                    name: '授权管理',
                    type: 'sq'
                }
            ]
        }
	},
	methods:{
		backWay(data){//返回页面
			let self = this;
            // self.$router.back('/jurisdiction')
			self.$router.back(self.currentFrim.path_page)
		},
		jumpMangen(rou){
			let self = this;
            localStorage.setItem("GoverAllot", JSON.stringify(rou));
            self.$router.go(rou.route)
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>