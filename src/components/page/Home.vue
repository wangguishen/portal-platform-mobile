<template>
	<div class="home_page">
        <v-header :headObj="headObj" :rightObj="rightObj" style="position: fixed"></v-header>
        <div class="content_box">
            <div class="logo_box">
                <img src="../../../static/images/phoneLOGO.png" alt="象翌logo" class="tab_logo">
                <div class="tab_text">
                    欢迎使用象翌公共服务平台
                </div>
            </div>
            <div class="cont_box home">
                <div class="introduce">
                    象翌公共服务平台可以对集团企业信息进行控制，以及本集团企业的数据控制和接口控制。共分为开放服务、权限管理、配置管理、运维服务等功能。可以添加开放服务、二维码生成、集团企业系统管理、操作管理、组织架构管理、角色管理、资源管理、授权管理等
                </div>
            </div>
        </div>
	</div>
</template>
<script>
import VHeader from '../common/Header'
export default {
    components: {
        VHeader,
    },
    data(){
        return {
            headObj:{
                title: '首页',
                isBack: false,
            },
            rightObj:{
                isMore: false,
                // title: '完成',
                // icon: '&#xe60e;',
            },
        }
    },
    methods: {
    	goes(){
    		let self = this;
    	},
    },
}
</script>
<style lang="less" scoped>
    .home_page{
        height:100%;
        .content_box{
            height:100%;
            background: #35495e;
            .logo_box{
                margin: 5rem 0;
                .tab_logo{
                    display: block;
                    width:50%;
                    margin:0 auto;
                }
                .tab_text{
                    margin-top: 2rem;
                    text-align: center;
                    color:#fff;
                    font-size: 1.5rem;
                }
            }
            .cont_box{
                color:#fff;
                .introduce{
                    margin: 0 1rem;
                    line-height: 2rem;
                    text-indent: 2em; 
                }
            }  
        }
    } 
</style>