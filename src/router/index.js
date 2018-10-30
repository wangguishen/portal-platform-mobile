import Vue from 'vue'
import Router from 'vue-router'

Router.prototype.go = function (link, param) {
	let store = this.app.$store;
	store.commit('SET_TRANSITION_NAME','slide');
    this.push(link)
}
Router.prototype.back = function (link, param) {
	let store = this.app.$store;
	store.commit('SET_TRANSITION_NAME','back');
    this.push(link)
}
Vue.use(Router)
const router = new Router({
  	routes: [
      	{
  	        path: '/',
            component: resolve => require(['@/components/page/Login.vue'], resolve),
            meta: {
                requireAuth: true
            }
  	    },
        {
            path: '*',
            component: resolve => require(['@/components/page/404.vue'], resolve)
        }, 
        {
        	path: '/home',/*首页*/
            component: resolve => require(['@/components/page/Home.vue'], resolve)
      	},
        {
            path: '/showdown',/*首页*/
            component: resolve => require(['@/components/page/monitoring/showdown.vue'], resolve)
        }, 
        {
      		path: '/login',/*登录页*/
            component: resolve => require(['@/components/page/Login.vue'], resolve)
      	}, 
        {
	      	path: '/openservice',/*开放服务*/
            component: resolve => require(['@/components/page/serve/OpenService.vue'], resolve)
	    },
        {
            path: '/messageConfig',/*消息推送*/
            component: resolve => require(['@/components/page/serve/MessageConfig.vue'], resolve)
        },
        {
            path: '/logShow',/*日志展示*/
            component: resolve => require(['@/components/page/serve/LogShow.vue'], resolve)
        },
        {
            path: '/logShowDetails',/*日志展示详情*/
            component: resolve => require(['@/components/page/serve/LogShowDetails.vue'], resolve)
        },
        {
            path: '/servedetails',/*服务详情*/
            component: resolve => require(['@/components/page/serve/ServeDetails.vue'], resolve)
        },
        {
            path: '/serveparadetails',/*服务参数详情*/
            component: resolve => require(['@/components/page/serve/ServeParaDetails.vue'], resolve)
        },
        {
            path: '/generateqrcode',/*生成二维码*/
            component: resolve => require(['@/components/page/serve/GenerateQRcode.vue'], resolve)
        }, 
        {
	    	path: '/serviceconfig',/*服务配置*/
            component: resolve => require(['@/components/page/serve/ServiceConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
	    },
        {
	    	path: '/portconfig',/*接口配置*/
            component: resolve => require(['@/components/page/serve/PortConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
	    },
        {
            path: '/topicPushConfig',/*消息推送配置*/
            component: resolve => require(['@/components/page/serve/TopicPushConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/topicPushConfigAdd',/*消息推送配置添加*/
            component: resolve => require(['@/components/page/serve/TopicPushConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/topicPushConfigEdit',/*消息推送配置编辑*/
            component: resolve => require(['@/components/page/serve/TopicPushConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/topicPushConfigAssociate',/*消息推送配置关联*/
            component: resolve => require(['@/components/page/serve/TopicPushConfigAssociate.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
	    	path: '/commondetails',/*收藏夹服务*/
            component: resolve => require(['@/components/page/serve/CommonDetails.vue'], resolve),
            meta: {
                requireAuth: true
            }
	    }, 
        {
	    	path: '/parameters',/*参数管理*/
            component: resolve => require(['@/components/page/serve/Parameters.vue'], resolve),
            meta: {
                requireAuth: true
            }
	    },
        {
            path: '/parasDetails',/*参数详情页*/
            component: resolve => require(['@/components/page/serve/ParasDetails.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/addparameters',/*新增参数*/
            component: resolve => require(['@/components/page/serve/AddParameters.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/editparasmanage',/*编辑参数*/
            component: resolve => require(['@/components/page/serve/EditParasManage.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
	    	path: '/dataconfig',/*数据配置*/
            component: resolve => require(['@/components/page/terrace/DataConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
	    },
        {
            path: '/addport',/*新增接口*/
            component: resolve => require(['@/components/page/serve/Addport.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/editParameters',/*编辑接口参数*/
            component: resolve => require(['@/components/page/serve/EditParameters.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
      		path: '/newadmin', /*新增管理员*/
            component: resolve => require(['@/components/page/terrace/NewAdmin.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
            path: '/addCompanyLogo', /*更换企业LOGO*/
            component: resolve => require(['@/components/page/authority/addCompanyLogo.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/addCompLogo', /*更换企业LOGO*/
            component: resolve => require(['@/components/page/authority/addcomplogo.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/editAdmin', /*编辑管理员*/
            component: resolve => require(['@/components/page/terrace/EditAdmin.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/flatcompany', /*平台企业管理*/
            component: resolve => require(['@/components/page/terrace/Flatcompany.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/ServiceControl', /*配置服务器监控*/
            component: resolve => require(['@/components/page/terrace/ServiceControl.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/spacesetting',/*空间资源配置*/
            component: resolve => require(['@/components/page/terrace/SpaceSetting.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/spacesettingadd',/*空间资源配置添加*/
            component: resolve => require(['@/components/page/terrace/SpaceSettingAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/spacesettingedit',/*空间资源配置编辑*/
            component: resolve => require(['@/components/page/terrace/SpaceSettingEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/userTypeChange',/*用户类型变更*/
            component: resolve => require(['@/components/page/terrace/userTypeChange.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/enterpriseUserImport',/*企业用户导入*/
            component: resolve => require(['@/components/page/terrace/enterpriseUserImport.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/link',/*空间资源配置*/
            component: resolve => require(['@/components/page/terrace/Link.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monenconfig',/*监控企业配置*/
            component:resolve => require(['@/components/page/terrace/MonEnConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monenconfigedit',/*监控企业配置编辑*/
            component:resolve => require(['@/components/page/terrace/MonEnConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monenconfigadd',/*监控企业配置新增*/
            component:resolve => require(['@/components/page/terrace/MonEnConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monlabconfig',/*监控实验室配置*/
            component:resolve => require(['@/components/page/terrace/MonLabConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monlabconfigadd',/*监控实验室配置新增*/
            component:resolve => require(['@/components/page/terrace/MonLabConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            },
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monlabconfigedit',/*监控实验室配置编辑*/
            component:resolve => require(['@/components/page/terrace/MonLabConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monsysconfig',/*监控系统配置*/
            component:resolve => require(['@/components/page/terrace/MonSysConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monsysconfigadd',/*监控系统配置新增*/
            component:resolve => require(['@/components/page/terrace/MonSysConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monsysconfigedit',/*监控系统配置编辑*/
            component:resolve => require(['@/components/page/terrace/MonSysConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/associatedusers',/*监控系统配置关联用户*/
            component:resolve => require(['@/components/page/terrace/AssociatedUsers.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monurlconfig',/*监控链接配置*/
            component:resolve => require(['@/components/page/terrace/MonUrlConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monurlconfigedit',/*监控链接配置编辑页面*/
            component:resolve => require(['@/components/page/terrace/MonUrlConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/monurlconfigadd',/*监控链接配置新增页面*/
            component:resolve => require(['@/components/page/terrace/MonUrlConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/parameterdetails',/*监控链接配置参数页面*/
            component:resolve => require(['@/components/page/terrace/ParameterDetails.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/parameterdetailsadd',/*监控链接配置参数页面新增*/
            component:resolve => require(['@/components/page/terrace/ParameterDetailsAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/parameterdetailsedit',/*监控链接配置参数页面编辑*/
            component:resolve => require(['@/components/page/terrace/ParameterDetailsEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/userlevelconfig',/*用户级别配置*/
            component:resolve => require(['@/components/page/terrace/UserLevelConfig.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/userlevelconfigadd',/*用户级别配置新增*/
            component:resolve => require(['@/components/page/terrace/UserLevelConfigAdd.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/userlevelconfigedit',/*用户级别配置新增*/
            component:resolve => require(['@/components/page/terrace/UserLevelConfigEdit.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
      		path: '/jurisdiction', /*权限管理页面*/
            component: resolve => require(['@/components/page/authority/Jurisdiction.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/mangenallot', /*管理分类*/
            component: resolve => require(['@/components/page/authority/MangenAllot.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/sysgover', /*系统管理*/
            component: resolve => require(['@/components/page/authority/Sysgover.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/operategover', /*操作管理*/
            component: resolve => require(['@/components/page/authority/OperateGover.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/orgchagover', /*组织架构管理*/
            component: resolve => require(['@/components/page/authority/OrgchaGover.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/rolegover', /*角色管理*/
            component: resolve => require(['@/components/page/authority/RoleGover.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/resource', /*资源管理*/
            component: resolve => require(['@/components/page/authority/Resource.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
            path: '/relevance', /*关联模块页面*/
            component: resolve => require(['@/components/page/authority/Relevance.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
      		path: '/empower', /*授权管理*/
            component: resolve => require(['@/components/page/authority/Empower.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	},
        {
            path: '/accredithandle', /*授权管理*/
            component: resolve => require(['@/components/page/authority/AccreditHandle.vue'], resolve),
            meta: {
                requireAuth: true
            }
        }, 
        {
      		path: '/userrole', /*用户角色管理*/
            component: resolve => require(['@/components/page/authority/Userrole.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
      		path: '/addpage', /*新增系统*/
            component: resolve => require(['@/components/page/authority/AddPage.vue'], resolve),
            meta: {
                requireAuth: true
            }
      	}, 
        {
            path: '/lookdetail', /*查看详情*/
            component: resolve => require(['@/components/page/authority/lookDetail.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/operationgover', /*运维服务首页*/
            component: resolve => require(['@/components/page/operation/OperationGover.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/servermonitoring', /*运维服务-硬件信息监控页面*/
            component: resolve => require(['@/components/page/operation/ServerMonitoring.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/urllink', /*运维服务-url链接监控页面*/
            component: resolve => require(['@/components/page/operation/UrlLink.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/userhome', /*个人信息首页*/
            component: resolve => require(['@/components/page/userMessage/userhome.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/usermessage', /*个人信息--账户信息页面*/
            component: resolve => require(['@/components/page/userMessage/usermessage.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/userpassword', /*个人信息--修改密码页面*/
            component: resolve => require(['@/components/page/userMessage/userpassword.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/adduseradmin', /*添加企业--用户信息*/
            component: resolve => require(['@/components/page/terrace/AddUserAdmin.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/addzoologycompany', /*添加生态企业页面*/
            component: resolve => require(['@/components/page/terrace/AddZoologyCompany.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/addflatcompany', /*添加生态企业页面*/
            component: resolve => require(['@/components/page/terrace/AddFlatcompany.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/secondjurisdiction', /*二级子企业分支页面*/
            component: resolve => require(['@/components/page/authority/SecondJurisdiction.vue'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/show', //消息推送页面
            component: resolve => require(['@/components/page/news-push/show.vue'], resolve),
        },
        {
            path: '/show-suneee', //消息推送页面
            component: resolve => require(['@/components/page/news-push/show-suneee.vue'], resolve),
        },
        {
            path: '/show-suneee-new', //消息推送页面
            component: resolve => require(['@/components/page/news-push/show-suneee-new.vue'], resolve),
        }
  	]
})

var localStorage = window.localStorage

router.beforeEach((to, from, next) => {
    var storage = JSON.parse(localStorage.getItem('jsonData'))
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (storage) {  // 通过storage判断是否登录
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})
export default router


