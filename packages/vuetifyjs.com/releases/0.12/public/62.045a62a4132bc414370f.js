webpackJsonp([62],{343:function(e,r,t){var a=t(0)(t(526),t(672),null,null,null);e.exports=a.exports},526:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a=t(1);t.n(a).a.component("fade",{functional:!0,render:function(e,r){var t=r.data||{};return t.props={name:"fade"},e("transition",t,r.children)}}),r.default={data:function(){return{doc:{title:"Carousel",component:"carousel",edit:"CarouselView",desc:"The <code>v-carousel</code> component is used to display large numbers of visual content on a rotating timer.",examples:[{header:"Default",file:"carousel/1",desc:"A carousel by default has a slide transition."},{header:"Custom transition",file:"carousel/2",desc:"You can also apply your own custom transition."},{header:"Custom delimiter",file:"carousel/3",desc:"You can also change the icon for the carousel delimiter."}],props:{"v-carousel":{params:[["cycle","Boolean","True","Determines if carousel should cycle through images"],["icon","String","fiber_manual_record","Sets icon for carousel delimiter"],["interval","Number","6000","The duration between image cycles"]]},"v-carousel-item":{params:[["src","String","Required","The image src"],["transition","String","v-tab-transition","Sets the normal transition"],["reverse-transition","String","v-tab-reverse-transition","Sets the reverse transition"]]}},slots:{"v-carousel":{shared:["default"]},"v-carousel-item":{shared:["default"]}}}}}}},672:function(e,r){e.exports={render:function(){var e=this,r=e.$createElement;return(e._self._c||r)("component-view",{attrs:{doc:e.doc}})},staticRenderFns:[]}}});