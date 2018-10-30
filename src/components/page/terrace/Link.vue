<template>
	<div id="page_box">
		<v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj" v-on:listFinish="finish"></v-header>
		<div class="container_top pickerList">
		  <!-- picker -->
		    <group-title>
		        <span>选择企业</span>
                <span style="margin-left: 88px;">请选择空间</span>
		        <span style="float: right">选择用户类型</span>
		    </group-title>
		    <picker :data='years1' v-model='year4' @on-change='change'></picker>
			<!-- checkList -->	
	        <!-- <checklist title="" label-position="left" :check-disabled="false" :options="commonList" v-model="checklist002" @on-change="checkChange">
	        </checklist> -->
            <group title="可选列表" class="checkList">
                <checklist :options="commonList" label-position="left" v-model="checklist"  @on-change="checkChange"></checklist>
                <x-button plain @click.native="selectAll">全选</x-button>
            </group>
		</div>
	</div>
</template>
<script>
import VHeader from '../../common/Header'
import { Cell, Group, Picker, GroupTitle, XButton, Checklist, Divider} from 'vux'

let years = []

let cityOption = []

let spaceList = [
    {
        name:'海',
        value:'1'
    },
    {
        name:'宝',
        value:'2'
    },
    {
        name:'娃',
        value:'3'
    }
]

let uTypeList = []

export default{
	components: {VHeader,Picker,GroupTitle,XButton, Cell,Group,Checklist,Divider},
	data(){
		return {
			headObj: {
                title: '页面访问控制',
                isBack: true,
            },
            rightObj: {
            	    isMore: false,
              	    title: "授权",
            },
            years: [years],
            years1: [
                years,
                spaceList, 
	            uTypeList
            ],
            year4: ['0', '0','0'],
            commonList: [],
            checklist:[],//选中
            initList: [],    //初始化值
            checklists:[],
            initLists:[],
            checkedList: [], //改变后的值
            tempArr: [], //临时值
            compValue: '', //存储企业id
            spaceValue:'',//储存空间id
            userValue: '', //存储用户id
            selectAllShow:false,//全选按钮
            compCode: '',
            tempId:'',
            adminSessionId:'',//用户中心admin帐号的sessionId
		}
	},
	mounted(){
		let self = this
        self.adminSessionId = localStorage.getItem('adminSessionId')
        self.compCode = localStorage.getItem('compCode')
        let uams = JSON.parse(localStorage.getItem('uams'))
        // years=[];
        console.log(uams,self.PLAT_ADMIN,self.compCode)

        if (self.compCode) {
            self.compCode = self.compCode.replace("\"","").replace("\"","")
        }
        // 平台管理员登录
        if (uams == self.PLAT_ADMIN) {
            
            self.queryComp();
        }else{
            // years=[];
            self.queryCompByCompCode();
        }
        self.queryAllType();
	},
    destroyed(){
        years=[];
        cityOption = []
    },
    watch:{
        'checklist':{
            handler:function(val,old){
                let self = this;
                // console.log('self.initList',self.initList);
                // console.log('self.checklist',self.checklist);
                // console.log('val',val)
                val = self.unique(val)
                let boolean = self.equal(val,self.initList);
                // console.log('boolean',boolean)
                if (boolean) {
                    self.rightObj.isMore = false;
                }else {
                    self.rightObj.isMore = true;
                }
            },
            deep:true
        }
    },
	methods: {
        queryAllType(){//请求所有类型
            let self = this;
            self.$axios({
                url: '/account_auth_admin/user-api.findAllType',
                method: 'post',
                responseType: 'json',
                data: {
                    'sessionId': self.adminSessionId
                }
            })
            .then(function(res){
                console.log('queryAllType',res)
                let typeList = res.data.data;
                if (res.data.status == 1) {
                    typeList.forEach(function(item,index){
                        item.value = item.typeCode;
                        item.name = item.typeName;
                        uTypeList.push(item);
                    })
                    console.log('uTypeList',uTypeList)
                }else{
                    self.$vux.toast.text(res.data.message,'middle');
                }
            })
            .catch(function(res){
                console.log('queryAllType error',res)
            })
        },
        selectAll(){//全选
            let self = this;
            self.selectAllShow = !self.selectAllShow;
            if (self.selectAllShow) {
                self.commonList.forEach(function(item,index){
                    self.checklist.push(item.key);
                })
            }else {
                self.checklist = [];
            }
            self.checklist.sort()
        },
		queryComp(compName) {  //查询所有企业
    	   	let self = this
    	   	self.$axios({
    	   	   url: '/UAMS/company/do_comp_query',
       	        method: 'post',
       	        data: {
    	           "compName": compName ? compName : ''
    	        }  
    	   	})
    	   	.then(function(res) {
     	        if(res.status === 200) {
           	  	    function DefaultCompStory(name, value) {
                        this.name = name
                        this.value = value
        	        }
             	  	let resData = res.data.data.list
             	  	for (let index in resData) {
           	  	        years.push({
           	  	    	    name: resData[index].comp_name,
           	  	    	    value: resData[index].comp_code
           	  	        })
             	  	}
           	    }
    	   	})
    	   	.catch(function(res) {
    	        console.log("queryComp error", res)
    	   	})
	    },
        queryCompByCompCode(){//根据企业编码查询
            let self = this;
            self.$axios({
                url: '/UAMS/Auth/queryCompany',
                method: 'post',
                data: {
                    "compCode": self.compCode ? self.compCode : ''
                }   
            })
            .then(function(res){
                console.log('queryCompByCompCode',res);
                if(res.status === 200) {
                    function DefaultCompStory(name, value) {
                        this.name = name
                        this.value = value
                    }
                    let resData = res.data.data
                    if(resData.company) {
                        years.push({
                            name: resData.company.comp_name,
                            value: resData.company.comp_code
                        })
                    }
                    if (resData.companyChildren.length != 0){
                        resData.companyChildren.forEach(function(item,index){
                            item.name = item.comp_name;
                            item.value = item.comp_code;
                            years.push(item);
                        })
                    }
                    console.log(years)
                }
            })
            .catch(function(res){
                console.log('queryCompByCompCodeError',res);
            })
        },
        change(val) {
            let self = this
            self.compValue = val[0]
            self.spaceValue = val[1]
            self.userValue = val[2]
            console.log('change methods',val[0],val[1],val[2])
            self.queryUrl(val[1]);
            self.queryUrlByComp(val[0],val[2])
        },
    	queryUrl(spaceType) { /*查询所有空间下的数据*/
            let self = this
            self.$axios({
                url: '/UAMS/url/query_all_url',
                method: 'post',
                data: {
                    type: spaceType
                }

            })
            .then(function(res) {
                console.log('所有企业',res)
                if(res.data.success) {
                	let resData = res.data.data
                    self.commonList = [];
                    resData.forEach(function(item,index){
                        item.key = item.id.toString();
                        item.value = item.url_name;
                        self.commonList.push(item);
                    })
                }
                console.log("commonList", self.commonList)
            })
            .catch(function(res) {
                console.log("queryUrl error", res)
            })
        },
        queryUrlByComp(compCode,userType) { /*查询企业下链接*/
        	let self = this
        	self.initList = []
        	self.tempArr = []
        	self.$axios({
    	        url: '/UAMS/url/query_url_company',
      	        method: 'post',
      	        data: {
      	            compCode: compCode,
    	  	        userType: userType
      	        }
        	})
        	.then(function(res) {
                console.log('queryUrlByComp',res)
        		if(res.status == 200) {
    	    		let resData = res.data.data
                    self.checklist = [];
                    self.initList = [];
                    self.tempArr = [];

    	    		for(let index in resData) {
    	    			self.checklist.push(resData[index].url_id)
    	    			self.initList.push(resData[index].url_id)
    	    			self.tempArr.push({
    	    				id: resData[index].id,
    	    				urlId: resData[index].url_id
    	    			})
    	    		}
                    self.checklist = self.unique(self.checklist)
                    self.initList = self.unique(self.initList)
                    self.tempArr = self.unique(self.tempArr)

                    self.checklist = self.systemSort(self.checklist)
                    self.initList = self.systemSort(self.initList)
                    self.tempArr = self.systemSort(self.tempArr)
        		}
        		// console.log("self.checklist", self.checklist)
        	})
        	.catch(function(res) {
        		console.log("error", res)
        	})
        }, 	
		backWay(data){
		    let self = this;
			self.$router.back("/jurisdiction")
		},
		finish(data){
			let self = this;
			console.log("go finish methods", self.initList, self.checkedList, self.compValue, self.userValue)

			let delArr= self.compare(self.initList, self.checkedList)
            let addArr= self.compare(self.checkedList, self.initList)
            console.log("delArr", delArr, "addArr", addArr)
            console.log( "tempArr", self.tempArr)

            if(delArr.length === 0 && addArr.length === 0) {
                self.$vux.toast.text('您还没进行任何修改','middle'); 
              	return
            }
            let linkDatas = new Array();
            for(let i in delArr){
                for(let j in self.tempArr){
                    if (delArr[i] == self.tempArr[j].urlId) {
                        self.tempId = self.tempArr[j].id;
                    }
                }
            }
            for(let index in delArr){
                console.log('delArr[index]',delArr[index])
                let obj = {
                    compCode: self.compValue,
                    userType: self.userValue,
                    urlId: delArr[index],
                    type: '0',
                    id: self.tempId
                }
                linkDatas.push(obj)
            }
            for(let index in addArr){
                console.log('addArr[index]',addArr[index])
                let obj = {
                    compCode: self.compValue,
                    userType: self.userValue,
                    urlId: addArr[index],
                    type: '1'
                }
                linkDatas.push(obj)
            }
            console.log('linkDatas',linkDatas)

            self.$axios({
                url: '/UAMS/url/update_url_company',
                method: 'post',
                responseType: 'json',
                data: linkDatas
            })
            .then(function(res) {
                console.log("success", res)
                if(res.data.success) {
                    self.$vux.toast.text('授权成功!','middle');
                }
            })
            .catch(function(res) {
                console.log("update_url_company error", res)
            })
		},
		checkChange(val, lab) {
			let self = this
            // console.log('checkChangeVal',val)
			self.checkedList = self.unique(val)
            // console.log('checklist',self.checkedList)
            self.checklist = self.systemSort(self.checklist)
            self.initList = self.systemSort(self.initList)
		},
		compare(arr1, arr2) {//比较两个数组
  	        var result = []
        	for(let i = 0; i < arr1.length; i++) {
        		var obj = arr1[i];
        		var isExist = false;
        		for(let j = 0; j < arr2.length; j++) {
        			var aj = arr2[j]
        			if(obj == aj) {
        				isExist = true;
        				break;
        			}
        		}
        		if(!isExist) {
        		    result.push(obj)
        		}
        	}
        	return result;
        },
        equal(objA, objB){//判断数组是否相等
            let self = this;
            if (typeof arguments[0] != typeof arguments[1]){
                return false;
            }
            //数组
            if (arguments[0] instanceof Array){
                if (arguments[0].length != arguments[1].length){
                    return false;
                }
                let allElementsEqual = true;
                for (let i = 0; i < arguments[0].length; ++i){
                    if (typeof arguments[0][i] != typeof arguments[1][i]){
                        return false;
                    }
                    if (arguments[0][i] != arguments[1][i]) {
                        return false;
                    }
                    if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number'){
                        allElementsEqual = (arguments[0][i] == arguments[1][i]);
                    }else{
                        // allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等     
                        allElementsEqual = self.equal(arguments[0][i], arguments[1][i])
                    }
                }
                return allElementsEqual;
            }
            return arguments[0] == arguments[1];
        },
        systemSort(array){ //数组排序
            return array.sort((a, b)=>{ 
                return a - b; 
            }); 
        },
        sortArr (obj1, obj2) {//排序
            // let val1 = obj1.id;
            // let val2 = obj2.id;
            if (obj1 < obj2) {
                return -1;
            } else if (obj1 > obj2) {
                return 1;
            } else {
                return 0;
            }            
        },
        unique(arr){//数组去重
        　　var res = [arr[0]];
        　　for(var i=1;i<arr.length;i++){
        　　　　var repeat = false;
        　　　　for(var j=0;j<res.length;j++){
        　　　　　　if(arr[i] == res[j]){
        　　　　　　　　repeat = true;
        　　　　　　　　break;
        　　　　　　}
        　　　　}
        　　　　if(!repeat){
        　　　　　　res.push(arr[i]);
        　　　　}
        　　}
        　　return res;
        },
	}
}
</script>
<style lang="less" scoped>
	/* .checkList .weui-cells_checkbox.weui-check_label{
        height: 38px;
    } */
    
</style>
<style>
    .pickerList .scroller-content .scroller-item {
        white-space: nowrap;
        font-size: 13px;
    }
    .checkList .vux-checklist-label-left{
        height: 38px;
    }
</style>