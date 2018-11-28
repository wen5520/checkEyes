$(function(){
    var n =0;

    var u,end,start,g,g2;

    var w0 = $('.ruler .main').find('li').width();//li width

    var size =  $('.ruler .main').find('li').size()-1; //li length

    var Esize = [{
            value:3.5,
            size:36.44//4.3
        },{
            value:3.6,
            size:28.95
        },{
            value:3.7,
            size:22.99
        },{
            value:3.8,
            size:18.27
        },{
            value:3.9,
            size:14.51
        },{
            value:4.0,//72.72
            size:11.53//4.8
        },{
            value:4.1,//57.76
            size:9.15
        },{
            value:4.2,//45.88
            size:7.27
        },{
            value:4.3,//36.45
            size:5.78
        },{
            value:4.4,//28.95
            size:4.59
        },{
            value:4.5,//22.99
            size:3.64
        },{
            value:4.6,//18.27
            size:2.90
        },{
            value:4.7,//14.51
            size:2.30//5.5
        },{
            value:4.8,//11.53
            size:1.83
        },{
            value:4.9,//9.16
            size:1.45
        },{
            value:5.0,//7.27
            size:1.15
        },{
            value:5.1,//5.78
            size:1.01
        },{
            value:5.2,//4.59
            size:0.78
        },{
            value:5.3,//3.64
            size:0.67//6.1
        }]
    var eArr =  ['','images/eTop.png','images/eRight.png','images/eBottom.png','images/eLeft.png'];//E 上下左右图

    var direction = '';//方向，0=>看不清，1=>上，2=>右，3=>下，4=>左

    var errorArr = [];//错误累积，累积总数最大为5,1=>错误，0=>正确，错误数不超过3个，无论是否连续
    
    var ageVal = $('input[name="number"]').attr("initial-value"); //游标尺最初始数值位置，设置的默认4.4是第9个li

    /*
        * sign为游标尺最初始数值，默认为4.4
        * 每次滑动游标尺，则sign修改为游标尺滑动结果，记为开始值
        * 比sign大的值，即E 的大小缩小，测试正确时，继续缩小，缩小值不大于5.3，测试错误时，出结果
        * 比sign小的值，即E 的大小放大，测试正确时，出结果，测试错误时，继续放大，放大值不小于3.5
     */
    var sign = Number($('input[name="number"]').val());

    var DPI = (function(){
        let arrDPI = new Array();//获取设备DPI
        if (window.screen.deviceXDPI != undefined) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        }else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);    
        }
        return arrDPI;
    })();
    
    $('body').on('touchcancel,touchend,touchmove,touchstart',function(e){

        e.preventDefault();
    })

    $('.ruler .main').css({

        '-webkit-transform':'translateX(-'+Math.ceil(parseInt(ageVal*w0))+'px)'

    }).attr('value',Math.ceil(ageVal*w0));

    setDirection();//设置初始随机值


    $('.ruler ul').on("touchstart",function(e){

        var  initial = $(this).attr('data-initial');

        e.stopPropagation();

        v = parseInt($(this).parent(".main").attr('value'));

        start = 0;

        end = -Number(size*w0);

        g = 50;

        if(initial == 'true'){

            startX = e.originalEvent.changedTouches[0].pageX+v;

            $(this).attr('data-initial','false');

        }else{

            startX = e.originalEvent.changedTouches[0].pageX-v;

        }

    });


    $('.ruler ul').on("touchmove",function(e){


        moveX = e.originalEvent.changedTouches[0].pageX;

        X = moveX - startX;

        if(X>0){
            var vv = $(this).parent(".main").attr('value');

            if(vv >=start){

                start = X>start ? start : X;

                $(this).parent(".main").css({
                    '-webkit-transform':'translateX('+start+'px)'
                }).attr('value',start);

            }else{

                $(this).parent(".main").css({
                    '-webkit-transform':'translateX('+X+'px)'
                }).attr('value',X);

            }
            
        }else{
            var vv = $(this).parent(".main").attr('value');

            if($(this).parent(".main").attr('value') <=end){

                end = X< end ? end : X;

                $(this).parent(".main").css({
                    '-webkit-transform':'translateX('+end+'px)'
                }).attr('value',end);

            }else{

                $(this).parent(".main").css({
                    '-webkit-transform':'translateX('+X+'px)'
                }).attr('value',X);

            }
        }

        e.preventDefault();
    });


    $('.ruler ul').on("touchend",function(e){

        e.stopPropagation();

        errorArr = [];//滑动结束，清空errorArr

        $('.record').empty();//清空标记点

        var arr = new Array();

        var value=  Math.abs($(this).parent(".main").attr("value"));

        if(value<Math.abs(end)){

            var value2 = Math.round(Math.abs(value)/100)*100;

        }else{

            var value2 = Math.abs(end);

        }

        if(value > value2){

            value2+=w0;

        }
       
        $(".main").css({

            '-webkit-transform':'translateX(-'+value2+'px)'

        }).attr('value','-'+value2);

        var number = Number($('input[name="number"]').attr('record-value'));//默认初始值，为固定值，不受滑动改变

        let val = (value2/w0-Number(ageVal))/10+number;

        sign=val.toFixed(1);//滑动结束，设置sign新的初始值

        $('input[name="number"]').val(val.toFixed(1));

        setDirection();//设置方向
    });


    // 设置随机方向，追加是否正确
    function setDirection(){
        let random = Math.ceil(Math.random()*100);

        direction = random%4+1;

        $('.Eimg').attr('src',eArr[direction]);

        setESize();
    }

    // 设置数值、尺子位置
    function setNumber(boo){
        let nowNum = Number($('input[name="number"]').val());

        let left = Math.abs($(".ruler .main").attr('value'));

        let text = '';

        if(sign == nowNum && sign!=3.5 && sign!=5.3){
            if(boo){
                text = Number(nowNum+0.1).toFixed(1);
                left = Number(left+w0);
            }else{
                text = Number(nowNum-0.1).toFixed(1);
                left = Number(left-w0);
            }
        }else if(sign < nowNum || sign ==3.5){//比默认标准显示小，可以看清默认标准
            if(boo){
                if(nowNum<5.3){
                    text = Number(nowNum+0.1).toFixed(1);
                    left = Number(left+w0);
                }else{
                    console.log('出结果了',nowNum);
                    window.location='result.html?result='+nowNum;
                }
                
            }else{
                console.log('出结果了',nowNum);
                window.location='result.html?result='+nowNum;
            }
            
        }else{//比默认标准显示大，看不清默认标准
            if(boo){
                 console.log('出结果了',nowNum);
                window.location='result.html?result='+nowNum;
               
            }else{
                if(nowNum>3.5){
                    text = Number(nowNum-0.1).toFixed(1);
                    left = Number(left-w0);
                }else{
                    console.log('出结果了',nowNum);
                    window.location='result.html?result='+nowNum;
                }
                
            }

        }

        $('input[name="number"]').val(text);

        $('.ruler .main').css({

            '-webkit-transform':'translateX(-'+Math.ceil(left)+'px)'

        }).attr('value',Math.ceil(left));

        setESize();
    }

    // 设置E大小
    function setESize(){
        let nowNum = Number($('input[name="number"]').val());

        Esize.forEach(i=>{
            if(i.value==nowNum){
                
                let width = i.size/25.4*DPI[0];

                $('.Eimg').css({"width":width+'px',"height":width+'px'});
            }
        })
    }
    
    // 判断当前错误个数
    function isEnough(){

        var index = [];

        for(let i=0;i<errorArr.length;i++){
            if(errorArr[i] === 1){
                index.push(i);
            }
        }
        /*
            *有3个错，增大0.1,清空errorArr
            *没有，判断length>=5;是，减小0.1,清空errorArr
            *没有，继续
        */
        if(index.length==3){
            setNumber(false);
            errorArr = [];
            $('.record').empty();
            
        }else if(errorArr.length==5){
            setNumber(true);
            errorArr = [];
            $('.record').empty();
        }else{

            // console.log('没有3个错,也不到5个,继续');
        }
    }

    // button点击
    $('.direction .btns').on('click',function(){
        // 选择的方向与当前方向不一样
        if($(this).attr('data-direction')!=direction){

            let li = '<li class="recordLi" style="background:red"></li>';
            $('.record').append(li);
            errorArr.push(1);//追加记录数组
            
        }else{

            let li = '<li class="recordLi" style="background:green"></li>';
            $('.record').append(li);
            errorArr.push(0);////追加记录数组
        }
        setDirection();//新设置方向
        isEnough();
    })

})
    
