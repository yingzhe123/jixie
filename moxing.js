function jianmofun(a,z1,z2,angle,b1,b2,d1,d2,mn){
    if(document.getElementById("three_id").hasChildNodes()){
        return ;
    }
    else{
    var scene=new THREE.Scene();
    var renderer=new THREE.WebGLRenderer();

    var s=Math.PI*mn/2; //计算分度圆齿厚
    var da1=d1+2*mn; //计算齿顶圆直径
    var da2=d2+2*mn; 
    var df1=d1-2.5*mn; //计算齿根圆直径
    var df2=d2-2.5*mn;

    console.log(s,da1,da2,df1,df2);

      renderer.setClearColor(0x000000);
        renderer.setSize(1700,700);
            
           var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            var material = new THREE.MeshNormalMaterial();
             camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 100;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        var shape=new THREE.Shape();
        shape.moveTo(0,0);
        shape.absarc(0,0,df1/2,0,Math.PI*2);
          var hole1=new THREE.Path();
        hole1.absarc(0,0,df1/6,0,Math.PI*2);
        shape.holes.push(hole1);

        var shape3=new THREE.Shape();
        shape3.moveTo(0,0);
        shape3.absarc(0,0,df2/2,0,Math.PI*2);
          var hole1=new THREE.Path();
        hole1.absarc(0,0,df2/6,0,Math.PI*2);
        shape3.holes.push(hole1);

            var geometry = new THREE.ExtrudeGeometry(//拉伸造型
        shape,//二维轮廓
        //拉伸参数
        {
            amount:b1,//拉伸长度
            bevelEnabled:false//无倒角
        }
        );
        var geometry3 = new THREE.ExtrudeGeometry(//拉伸造型
            shape3,//二维轮廓
            //拉伸参数
            {
                amount:b2,//拉伸长度
                bevelEnabled:false//无倒角
            }
            );
          var mesh1=new THREE.Mesh(geometry,material);
          var mesh3=new THREE.Mesh(geometry3,material);
        scene.add(mesh1);
        scene.add(mesh3);
        mesh3.position.set(a,0,0);


        var shape2=new THREE.Shape();
        
          shape2.moveTo(-(da1-df1)/4,s/4);
          shape2.lineTo((da1-df1)/4,s);//第2点
    shape2.lineTo((da1-df1)/4,-s);//第3点
    shape2.lineTo(-(da1-df1)/4,-s/4);//第4点
    shape2.lineTo(-(da1-df1)/4,s/4);//第5点

    var shape4=new THREE.Shape();
    
      shape4.moveTo(-(da2-df2)/4,s/4);
      shape4.lineTo((da2-df2)/4,s);//第2点
shape4.lineTo((da2-df2)/4,-s);//第3点
shape4.lineTo(-(da2-df2)/4,-s/4);//第4点
shape4.lineTo(-(da2-df2)/4,s/4);//第5点
    
    var curve =new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,df1/2,0),
        new THREE.Vector3(b1*Math.tan(angle*Math.PI/180),df1/2,b1)
    ]);
    var geometry1 = new THREE.ExtrudeGeometry(//拉伸造型
        shape2,//二维轮廓
        //拉伸参数
        {
            bevelEnabled:false,//无倒角
            extrudePath:curve,//选择扫描轨迹
        }
    );
    
           for(var x = 0;x<z1;x++){//10表示立方体数量
        var mesh2=new THREE.Mesh(geometry1,material);//网格模型对象
         mesh2.rotation.z += 2*Math.PI/z1*x;
        scene.add(mesh2);//网格模型添加到场景中
    }

    var curve1 =new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,df2/2,0),
        new THREE.Vector3(-b2*Math.tan(angle*Math.PI/180),df2/2,b2)
    ]);
    var geometry2 = new THREE.ExtrudeGeometry(//拉伸造型
        shape4,//二维轮廓
        //拉伸参数
        {
            bevelEnabled:false,//无倒角
            extrudePath:curve1,//选择扫描轨迹
        }
    );

    for(var x = 0;x<z2;x++){//10表示立方体数量
        var mesh2=new THREE.Mesh(geometry2,material);//网格模型对象
         mesh2.rotation.z += 2*Math.PI/z2*x;
        mesh2.position.set(a,0,0);
        scene.add(mesh2);//网格模型添加到场景中
    }

           var direction = new THREE.AmbientLight(0xffffff);
    scene.add(direction);

 document.getElementById("three_id").appendChild(renderer.domElement);
 function render() {
        renderer.render(scene,camera);//执行渲染操作
    }
    render();
    var controls = new THREE.OrbitControls(camera);//创建控件对象
controls.addEventListener('change', render);//监听鼠标、键盘事件
}
}