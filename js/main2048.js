var board = new Array();  //储存游戏的数字
var score = 0;            
var hasConflicted = new Array();// 用来判断每个格子是否已经相加，从而避免一次移位多次相加
$(document).ready(function(e){
    newgame();
});                 

function newgame(){
    //初始化棋盘格
    init();
    //调用两次，在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    //有数字的小方块
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            //css()方法设置小方格定位
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
            //getPosTop(),getPos()放在support.js文件
        }
    }
    //初始化board数组
    for(var i = 0; i<4;i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0;j<4;j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    
    updateBoardView();//通知前端对board二位数组进行更新。
    score = 0;
    updateScore(score); 
}

function updateBoardView(){
    //如果有number-cell先删除
    $(".number-cell").remove();
    //遍历格子改变样式
    for(var i = 0;i<4;i++){
        for ( var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('hegiht','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                //NumberCell覆盖,返回前景色
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//返回背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));//返回前景色
                theNumberCell.text(board[i][j]);
            }
        hasConflicted[i][j] = false;
        }
    }
}

//在格子上随机生成数字
function generateOneNumber(){
    //先判断有无空格子
    if (nospace(board))
        return false;
    
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if (board[randx][randy] == 0) 
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    //随机生成2或4
    var randNumber = Math.random()<0.5 ?2 : 4;
    //在随机位置显示随机数字（2或4）
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

//事件响应循环
$(document).keydown(function(event){
    switch (event.keyCode) {
    case 37://left
        if(moveLeft()){
            generateOneNumber();
            isgameover();//每次新增一个数字就可能出现游戏结束
        }
        break;
    case 38://up
        if(moveUp()){
            generateOneNumber();
            isgameover();
        }
        break;
    case 39://right
        if(moveRight()){
            generateOneNumber();
            isgameover();
        }
        break;
    case 40://down
        if(moveDown()){
            generateOneNumber();
            isgameover();
        }
        break;

    }
});
function  updateScore(score){  
    $('#score').text(score);  
}

// 判断当前格子是否有数字 即判断是不是一个“非空（nospace）”的格子  
function nospace(board) {  
    for ( var i = 0; i < 4; i++ )  
        for ( var j = 0; j < 4; j++ )  
            if ( board[i][j] == 0 ) // 如果没有数字，返回false  
                return false;  
    // 如果有数字，返回true  
    return true;  
}

//判断格子全部填满
function nomove( board ){  
    if( canMoveLeft( board ) ||  
        canMoveRight( board ) ||  
        canMoveUp( board ) ||  
        canMoveDown( board ) )  
        return false;  
  
    return true;  
} 

function isgameover(){
    if(nospace(board)&&nomove(board))
        setTimeout("gameover()",200);
}

function gameover(){
    // alert("游戏结束！您的得分为：" + score);
    if(confirm("游戏结束！您的得分为：" + score)){
        newgame();
    }
}

function moveLeft(){//更多地细节信息
    //判断格子是否能够向左移动
    if( !canMoveLeft(board))
        return false;
    
    //真正的moveLeft函数//标准
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){//第一列的数字不可能向左移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 0;k<j;k++){
                    //判断数字是否相等 && 中间没有障碍物
                    if(board[i][k] == board[i][j] && noBlockHorizontal(i , k, j, board)&& !hasConflicted[i][k]){
                        //移动
                        showMoveAnimation(i, j,i,k);
                        //相加
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //分数相加
                        score += board[i][k];  
                        updateScore(score); 

                        hasConflicted[i][k] = true;  
                        continue;
                    }
                    //判断落脚位置的是否为空 && 中间没有障碍物
                    else if(board[i][k] == 0 && noBlockHorizontal(i , k, j, board)){
                        //移动
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;                   
                        continue;
                    }
                }
            }
        }
     // 为显示动画效果，设置该函数的等待时间200毫秒
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    //判断格子是否能够向右移动
    if( !canMoveRight(board))
        return false;
    
    //真正的moveRight函数
    for(var i = 0;i<4;i++)
        for(var j = 2;j>=0;j--){//第四列的数字不可能向右移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 3;k>j;k--){
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    if(board[i][k] == board[i][j] && noBlockHorizontal(i , j, k, board)&& !hasConflicted[i][k]){
                        //移动
                        showMoveAnimation(i, j,i,k);
                        //相加
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //分数叠加 
                        score += board[i][k];  
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                    //落脚位置的是否为空 && 中间没有障碍物
                    else if(board[i][k] == 0 && noBlockHorizontal(i , j, k, board)){
                        //移动
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    //判断格子是否能够向下移动
    if( !canMoveDown(board))
        return false;
    
    //真正的moveDown函数
    for(var j = 0;j<4;j++)
        for(var i = 2;i>=0;i--){//第四行的数字不可能向下移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 3;k>i;k--){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[k][j] == board[i][j] && noBlockVertical(j , i, k, board)&& !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score  
                        score += board[k][j];  
                        updateScore(score); 
                        hasConflicted[k][j] = true; 
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[k][j] == 0 && noBlockVertical(j , i, k, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
  
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){//更多地细节
    //判断格子是否能够向上移动
    if( !canMoveUp(board))
        return false;
    
    //真正的moveup函数//标准
    for(var j = 0;j<4;j++)
        for(var i = 1;i<4;i++){//第一行的数字不可能向上移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 0;k < i;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[k][j] == board[i][j] && noBlockVertical(j , k, i, board) && !hasConflicted[k][j]){
                        //移动
                        showMoveAnimation(i, j,k,j);
                        //相加
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //分数叠加 
                        score += board[k][j];  
                        updateScore(score); 
                        hasConflicted[k][j] = true;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 
                    else if(board[k][j] == 0 && noBlockVertical(j , k, i, board)){
                        //移动
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                       
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
