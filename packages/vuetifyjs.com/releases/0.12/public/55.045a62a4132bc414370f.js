webpackJsonp([55],{363:function(e,n,t){var a=t(0)(t(545),t(870),null,null,null);e.exports=a.exports},545:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={name:"pagination-view",data:function(){return{doc:{component:"pagination",edit:"PaginationView",title:"Pagination",desc:"The <code>v-pagination</code> component is used to separate long sets of data so that it is easier for a user to consume information. Depending on the length provided, the pagination component will automatically scale. To maintain the current page, simply supply a v-model attribute.",examples:[{header:"Short",file:"pagination/1",desc:"Pagination does not truncate pages when the length is 6 or less."},{header:"Long",file:"pagination/2",desc:"When the number of pages exceeds 6, the component will truncate the list of pages."},{header:"Round",file:"pagination/3",desc:"The alternate style for pagination is circle pages."},{header:"Disabled",file:"pagination/4",desc:"Pagination items can be manually deactivated."}],props:{"v-pagination":{params:[["circle","Boolean","False","Shape pagination elements as circles"],["disabled","Boolean","False","Disables component"],["length","Number","0","The length of the paginator"]],model:{type:"Number",description:"Current selected page"}}},events:{"v-pagination":{params:[["input","Number","Current page"]]}}}}}}},870:function(e,n){e.exports={render:function(){var e=this,n=e.$createElement;return(e._self._c||n)("component-view",{attrs:{doc:e.doc}})},staticRenderFns:[]}}});