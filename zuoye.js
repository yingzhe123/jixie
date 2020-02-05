(function(){
    //获取数据并进行计算
 var calculate={
     //获取相应的数据
getdata:function(){
    var _this=this;
    document.getElementById("submit").addEventListener("click", function(){
   _this.z1=Number(document.getElementById("chishu").value); //获取小齿轮齿数
   _this.Kt=Number(document.getElementById("zaihe").value); //获取载荷系数
   _this.d=Number(document.getElementById("chikuan").value); //获取齿宽系数
   _this.b=Number(document.getElementById("luoxuan").value); //获取螺旋角
   _this.p1=Number(document.getElementById("chuandong").value)*1000; //获取传递功率
   _this.n1=Number(document.getElementById("zhuanshu").value); //获取主动轮转速
   _this.i=Number(document.getElementById("chuandongbi").value); //获取传动比
   _this.year=Number(document.getElementById("nianxian").value); //获取工作年限
   _this.day=Number(document.getElementById("tianshu").value); //获取工作天数 
   _this.hour=Number(document.getElementById("shishu").value); //获取每班工作时数
   _this.times=Number(document.getElementById("cishu").value); //获取每天有几班
   _this.state=Number(document.getElementById("load_state").value); //获取载荷状态
   _this.kind=Number(document.getElementById("yuan_kind").value); //获取原动机种类
   _this.z2=_this.z1*_this.i; //计算大齿轮的齿数
   _this.pilaoqiangdu();
   _this.jiaohe();
});
},
   //计算疲劳强度
   pilaoqiangdu:function(){
        var data=data_a;
        var arr1=data[0].slice(1);
        var arr2=data[1].slice(1);
        var arr3=data[2].slice(1);
        var cosb=Math.cos(this.b*Math.PI/180); //计算螺旋角的cos值
        this.T1=9550*this.p1/this.n1; //计算小齿轮的名义转矩
        this.Ea=(1.88-3.2*(1/this.z1+1/this.z2))*cosb; //计算端面重合度
        this.Eb=0.318*this.d*this.z1*Math.tan(this.b*Math.PI/180); //计算纵向重合度
        var Ye=0.25+0.75/this.Ea;
        var Yb=1-this.Eb*this.b/120; 
        this.Yeb=Ye*Yb; //确定重合度及螺旋角系数
        Yeb=Number(this.Yeb.toFixed(2));
        this.Zv1=this.z1/Math.pow(cosb,3);
        this.Zv2=this.z2/Math.pow(cosb,3); //计算当量齿数
        this.YFa1=this.chazhi(arr1,arr2,this.Zv1);
        this.YFa2=this.chazhi(arr1,arr2,this.Zv2); //通过插值得到齿形系数
        this.YSa1=this.chazhi(arr1,arr3,this.Zv1);
        this.YSa2=this.chazhi(arr1,arr3,this.Zv2); //通过插值得到应力修正系数
        var qFlim1=740;
        var qFlim2=712; //齿轮的弯曲疲劳极限
        this.qHlim1=1175;
        this.qHlim2=1126; //齿轮的接触疲劳极限
        this.N1=60*this.n1*1*this.times*this.year*this.day*this.hour; 
        this.N2=this.N1/this.i; //应力循环次数
        if((this.N1>(3*Math.pow(10,6)))&&(this.N2>(3*Math.pow(10,6)))){
            var YN1=1;
            var YN2=1; //弯曲强度寿命系数
        }  
        else{
            layer.alert('错误', {icon: 5});
            return ;
        }
        var SF=1.4; //弯曲强度最小安全系数,一般情况取1.4
        var qF1=Math.floor(qFlim1/SF*10)/10; 
        var qF2=Math.floor(qFlim2/SF*10)/10; //计算许用应力
        var big=((this.YFa1*this.YSa1/qF1)>(this.YFa2*this.YSa2/qF2))?(this.YFa1*this.YSa1/qF1):(this.YFa2*this.YSa2/qF2);
        var Mn=Math.pow(2*this.Kt*this.T1*this.Yeb*Math.pow(cosb,2)*big/(this.d*Math.pow(this.z1,2)),1/3); //试算齿轮的法向模数
        Mn=Number(Mn.toFixed(3));
        this.vt=Math.PI*Mn*this.z1*this.n1/(60*1000*cosb); //计算圆周速度
        var d1t=Mn*this.z1/cosb; //确定小齿轮直径
        var bt=d1t*this.d; //确定小齿轮齿宽
        this.ka=data_b[this.state+2][this.kind+1]; //确定使用系数
        if((this.ka*2*this.T1/(d1t*bt))>=100){
        var kFa=1.399; //确定齿间载荷分配系数
        }
        else{
            layer.alert('错误', {icon: 5});
            return ;
        }
        var kbS=this.chazhi(data_c[0].slice(1),data_c[1].slice(1),this.d);
        var kbM=this.chazhi(data_d[0].slice(1),data_d[1].slice(1),bt)*1.5;
        var kFb=kbS+kbM; //计算齿向载荷分布系数
        var k1=34.79;
        var k2=0.0087;
        var kv=1+(k1/(this.ka*(this.ka*2*this.T1/(d1t*bt)))+k2)*this.z1*this.vt/100*Math.sqrt(Math.pow(this.i,2)/(Math.pow(this.i,2)+1)); //计算动载荷系数
        this.k=this.ka*kv*kFa*kFb; //确定载荷系数
        this.mn=Mn*Math.pow(this.k/this.Kt,1/3); //修正法向模数计算值
        var arr4=[];
        arr4=arr4.concat(data_e[0].slice(1,19),data_e[1].slice(1,20));
        arr4.sort(function(a,b){return a-b});
        for(var i=0;i<arr4.length;i++){
            if(arr4[i]>this.mn){
                this.mn=arr4[i];
                break;
            }
        }
        this.jihecanshu();
   },
   //确定齿轮主要几何参数和尺寸
   jihecanshu:function(){
        var cosb=Math.cos(this.b*Math.PI/180);
        this.a=Math.floor(this.mn*(this.z1+this.z2)/(2*cosb)); //计算中心距
        this.angle=Math.acos(this.mn*(this.z1+this.z2)/(2*this.a));
        this.angle=Number(this.angle.toFixed(3));
        this.input_angle=this.angle/(Math.PI/180);
        this.d1=this.mn*this.z1/Math.cos(this.angle);
        this.d2=this.mn*this.z2/Math.cos(this.angle);
        this._b=this.d*this.d1;
        if((this._b%10)>5)  //进行圆整
        {
           this.b2=Math.floor(this._b/10)*10+10;
        }
        else if((this._b%10)<5){
            this.b2=Math.floor(this._b/10)*10+5;
        }
        this.b1=this.b2+5;
        var load=layer.load(0);
        var _this=this;
        setTimeout(function(){
            layer.close(load);
            layer.alert('计算已完成，请点击继续查看计算结果',{
                btn: ['继续'],
                yes: function(index, layero){
                  window.scrollTo(0,950);
                  layer.close(index);
                }
            }, {icon: 1});
            _this.inputdata();
          }, 2000);
   },
   //输出参数
   inputdata:function(){
          var input_div=document.getElementById("input_id"); //获取输出参数的节点
          var input_str="";
          input_str+="<div>"+"小齿轮的齿数z<sub>1</sub>="+this.z1+"</div>";
          input_str+="<div>"+"大齿轮的齿数z<sub>2</sub>="+this.z2+"</div>";
          input_str+="<div>"+"小齿轮名义转矩T1="+this.T1+"</div>";
          input_str+="<div>"+"重合度&epsilon;<sub>&alpha;</sub>="+this.Ea+"</div>";
          input_str+="<div>"+"重合度&epsilon;<sub>&beta;</sub>="+this.Eb+"</div>";
          input_str+="<div>"+"螺旋角系数Y<sub>&epsilon;&beta;</sub>="+this.Yeb+"</div>";
          input_str+="<div>"+"小齿轮的当量齿数z<sub>v1</sub>="+this.Zv1+"</div>";
          input_str+="<div>"+"大齿轮的当量齿数z<sub>v2</sub>="+this.Zv2+"</div>";
          input_str+="<div>"+"齿形系数Y<sub>Fa1</sub>"+this.YFa1+"</div>";
          input_str+="<div>"+"齿形系数Y<sub>Fa2</sub>="+this.YFa2+"</div>";
          input_str+="<div>"+"应力修正系数Y<sub>Sa1</sub>="+this.YSa1+"</div>";
          input_str+="<div>"+"应力修正系数Y<sub>Sa2</sub>="+this.YSa2+"</div>";
          input_str+="<div>"+"应力循环次数N<sub>1</sub>="+this.N1+"</div>";
          input_str+="<div>"+"应力循环次数N<sub>2</sub>="+this.N2+"</div>";
          input_str+="<div>"+"圆周速度v<sub>t</sub>="+this.vt+"</div>";
          input_str+="<div>"+"使用系数k<sub>A</sub>="+this.ka+"</div>";
          input_str+="<div>"+"载荷系数k="+this.k+"</div>";
          input_str+="<div>"+"法向模数m<sub>n</sub>="+this.mn+"</div>";
          input_str+="<div>"+"中心距a="+this.a+"</div>";
          input_str+="<div>"+"修正后的螺旋角&beta;="+this.input_angle+"</div>";
          input_str+="<div>"+"小齿轮分度圆直径d<sub>1</sub>="+this.d1+"</div>";
          input_str+="<div>"+"大齿轮分度圆直径d<sub>2</sub>="+this.d2+"</div>";
          input_str+="<div>"+"小齿轮齿宽b<sub>1</sub>="+this.b1+"</div>";
          input_str+="<div>"+"大齿轮齿宽bY<sub>2</sub>="+this.b2+"</div>";
          input_div.innerHTML=input_str;     
   },
   //校核齿面接触疲劳强度
   jiaohe:function(){
       var _this=this;
       document.getElementById("jiaohe_id").addEventListener("click", function(){
       var cosb=Math.cos(_this.angle);
       var sinat=Math.tan(20*Math.PI/180)/Math.sqrt(Math.pow(cosb,2)+Math.pow(Math.tan(20*Math.PI/180),2));
       var ZH=Math.sqrt(2*cosb*Math.cos(20*Math.PI/180)/(sinat*(1-Math.pow(sinat,2)))); 
       var ZE=188; //弹性系数
       var Ze=Math.sqrt((4-_this.Ea)/3*(1-_this.Eb)+_this.Eb/_this.Ea);
       var Zb=Math.sqrt(cosb);
       var Zeb=Ze*Zb; //确定重合度及螺旋角系数
       var ZN1=1;
       var ZN2=1; //接触强度寿命系数
       var SH=1; //接触强度最小安全系数
       var qH1=_this.qHlim1/SH;  
       var qH2=_this.qHlim2/SH; //计算许用应力
       var qH=ZH*ZE*Zeb*Math.sqrt(2*_this.k*_this.T1*(_this.i+1)/(_this.b2*Math.pow(_this.d1,2)*_this.i));
       if(qH<=qH2){
        layer.alert("满足接触疲劳强度要求", {icon: 1});
       }
       else{
        layer.alert("不满足接触疲劳强度要求", {icon: 5});
       }
    })
   },
   //插值函数
 chazhi:function(arr1,arr2,num) {
    var pos1 = 0,
        pos2 = 1;
    if (arr1[0]>num) {
        pos1 = 0;
        pos2 = 1;
    } else if (arr1[arr1.length-1]<num) {
        pos1 = arr1.length - 1;
        pos2 = arr1.length - 2;
    } else {
        for (var i = arr1.length - 1; i > 0; i--) {
            if (arr1[i - 1] < num) {
                pos1 = i - 1;
                pos2 = i;
                break;
            }
        }
    }
    var x1 = arr1[pos1],
        x2 = arr1[pos2],
        y1 = arr2[pos1],
        y2 = arr2[pos2];
    var ka = y1 + (y2 - y1) / (x2 - x1) * (num - x1);
        return ka;
},
model_start:function(){
    var _this=this;
    document.getElementById("model").onclick=function(){
        var load=layer.load(0);
        setTimeout(function(){
            layer.close(load);
            jianmofun(_this.a,_this.z1,_this.z2,_this.input_angle,_this.b1,_this.b2,_this.d1,_this.d2,_this.mn);
            window.scrollTo(0,1870);
        },1500);
}
}
};
    //表格构造器
    var Table=function(arr,width,id){
        this.row=arr.length;
        this.line=arr[0].length;
        this.width=width;
        this.id=id;
        this.andcol=function(row_number,cols,table_id){
            var rows=document.getElementById(table_id).childNodes[0].childNodes;
            var target_row=rows[row_number];
            for(var i=0;i<cols.length;i++){
               if(i==(cols.length-1))
               {
                target_row.childNodes[cols[0]].setAttribute("colspan",cols.length+"");
               }
               else{
                target_row.removeChild(target_row.childNodes[cols[0]]);
            }
            }
        }
        this.androw=function(col_number,rows,table_id){
            var rows1=document.getElementById(table_id).childNodes[0].childNodes;
            for(var i=0;i<rows.length;i++){
               if(i==0)
               {
                rows1[rows[i]].childNodes[col_number].setAttribute("rowspan",rows.length+"");
               }
               else{
                rows1[rows[i]].removeChild(rows1[rows[i]].childNodes[col_number]);
            }
            }
        }
        this.draw=function(){
            var a='';
            var b=document.createElement("table");
            b.id=this.id;
            b.style.width=width;
            b.className="table table-hover table-bordered table-responsive";
            for(var j=0;j<this.row;j++){
                a+="<tr>"
        for(var i=0;i<this.line;i++){
        a+="<td>"+arr[j][i]+"</td>";
        }
        a+="</tr>"
            }
            a+="</table>"
            document.getElementById("table").appendChild(b);
            b.innerHTML=a;
        }
    };
    //绑定事件
    function bindevent(){
        var table1=new Table(data_a,"1202px","table1");
        var table2=new Table(data_b,"600px","table2");
        var table3=new Table(data_c,"372px","table3");
        var table4=new Table(data_d,"427px","table4");
        var table5=new Table(data_e,"1000px","table5");
        var div_table=document.getElementById("table");
        document.getElementById("YFa_YSa").addEventListener("click", function () {
                if(div_table.hasChildNodes()) 
                {   
                    div_table.removeChild(div_table.childNodes[0]);  
                } 
                table1.draw();
        })
        document.getElementById("Ka").addEventListener("click", function () {
                if(div_table.hasChildNodes()) 
                {   
                    div_table.removeChild(div_table.childNodes[0]);  
                }  
                table2.draw();
                table2.andcol(0,[1,2,3],table2.id);
                table2.androw(0,[0,1],table2.id);
        })
        document.getElementById("KbS").addEventListener("click", function () {
                if(div_table.hasChildNodes()) 
                {   
                    div_table.removeChild(div_table.childNodes[0]);  
                } 
                table3.draw();
        })
        document.getElementById("KbM").addEventListener("click", function () {
                if(div_table.hasChildNodes()) 
                {   
                    div_table.removeChild(div_table.childNodes[0]);  
                } 
                table4.draw();
        })
        document.getElementById("mn").addEventListener("click", function () {
            if(div_table.hasChildNodes()) 
            {   
                div_table.removeChild(div_table.childNodes[0]);  
            } 
            table5.draw();
    })
}
    //程序开始入口
    function start(){
    bindevent();
    calculate.getdata();
    calculate.model_start();
    }
    start();
})();