/**
 * Created by hebao on 2017/7/19.
 */
'use strict';
let tryStack = [];
let trySudoBackup = [];

function checkValid(sudo, row, col) {
    let _rowArr = [].concat(sudo[row]);
    let _colArr = [];
    for (let i = 0; i < 9; i++) {
        _colArr.push(sudo[i][col]);
    }
    let _subSodu = [];
    for (let _row = row - row % 3; _row < row - row % 3 + 3; _row++) {
        for (let _col = col - col % 3; _col < col - col % 3 + 3; _col++) {
            _subSodu.push(sudo[_row][_col]);
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 9; j++) {
            let _currRow = _rowArr[i], _currCol = _colArr[i], _currSubSodu = _subSodu[i];
            if ((_currRow !== 0 && _currRow === _rowArr[j]) ||
                (_currCol !== 0 && _currCol === _colArr[j]) ||
                (_currSubSodu !== 0 && _currSubSodu === _subSodu[j])) {
                return [];//如果此时已经判断出此处无论填什么数字都是错误的，则返回个空数组，用于标记此处需要回退栈
            }
        }
    }
    return [_rowArr, _colArr, _subSodu];
}

function findUnique(sudo, row, col) {
    //判断当前行，列，宫的数独是否正确
    let _validArr = checkValid(sudo, row, col);
    if (_validArr.length === 0) return [];//此处可填写的数组为空，也即此处不能填写任何数字，推断出错，回退栈重新填写
    //若正确，算出sudo当前所在行列可填的数字
    let _compare = [1, 2, 3, 4, 5, 6, 7, 8, 9], _final = [];
    let _result = _validArr[0].concat(_validArr[1].concat(_validArr[2])).sort((a, b) => a - b).join('').replace(/0*(1)*(2)*(3)*(4)*(5)*(6)*(7)*(8)*(9)*/g, '$1$2$3$4$5$6$7$8$9').trim().split('');
    for (let i = 0, j = _compare.length; i < j; i++) {
        if (_compare[i] != _result[i]) {
            _final.push(_compare[i]);
            _result.push(_compare[i]);
            _result.sort((a, b) => a - b);
        }
    }
    return _final;//返回此处可填数字
}

function checkUnique(sudo) {
    let _awaitToFill = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudo[i][j] === 0) {
                let _unique = findUnique(sudo, i, j);
                _awaitToFill.push({
                    row: i,
                    col: j,
                    fill: _unique,
                    count: _unique.length
                });
            }
        }
    }
    return _awaitToFill.sort((a, b) => a.count - b.count);
}

function stepBackTryStack() {
    if (++(tryStack[tryStack.length - 1].tryIndex) >= tryStack[tryStack.length - 1].count) {//当前存储栈中待填数字没有填完，则继续尝试该栈中的其他待填数字
        tryStack.pop();//回退一个栈
        trySudoBackup.pop();//恢复到上一个栈的状态
        stepBackTryStack();
    }
}

function fillUnique(sudo) {
    let _checkUnique = checkUnique(sudo);
    let _emptyFill = _checkUnique.filter((s, i) => s.count === 0);
    if (_emptyFill.length > 0) {
        //回退栈，重新填写，开始新一轮尝试
        if (tryStack.length > 0) {
            stepBackTryStack();
            sudo = trySudoBackup[trySudoBackup.length - 1];
            sudo[tryStack[tryStack.length - 1].row][tryStack[tryStack.length - 1].col] = tryStack[tryStack.length - 1].fill[tryStack[tryStack.length - 1].tryIndex];
            return fillUnique(sudo);//继续递归计算
        }
        else {
            return false;//无解
        }
    }
    else {
        let _fillArr = _checkUnique.filter((s, i) => s.count === 1);
        for (let i = 0, j = _fillArr.length; i < j; i++) {
            sudo[_fillArr[i].row][_fillArr[i].col] = _fillArr[i].fill[0];
        }
        if (_fillArr.length > 0) {
            return fillUnique(sudo);
        }
        else {
            if (_checkUnique.length > 0) {
                //此时不存在唯一数单元格，则开始尝试填写待填数字
                tryStack.push(_checkUnique[0]);//存储当前待填项
                tryStack[tryStack.length - 1].tryIndex = 0;//标记回退栈中，当前尝试的候选数字的索引
                trySudoBackup.push(JSON.parse(JSON.stringify(sudo)));//存储当前sudo状态，用于回退数独状态
                //填写数字解数独
                sudo[tryStack[tryStack.length - 1].row][tryStack[tryStack.length - 1].col] = tryStack[tryStack.length - 1].fill[tryStack[tryStack.length - 1].tryIndex];
                return fillUnique(sudo);//继续递归计算
            }
            else {
                //不存在待填数字，完成计算
                return sudo;
            }
        }
    }
}

function sudoku(sudo) {
    console.log(fillUnique(sudo));
}

let puzzle = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],
    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0]];

// let puzzle = [
//     [9, 2, 0, 8, 0, 0, 0, 0, 0],
//     [7, 0, 0, 1, 0, 0, 0, 2, 6],
//     [0, 1, 0, 0, 0, 2, 0, 0, 9],
//     [0, 0, 0, 0, 6, 0, 0, 0, 0],
//     [0, 0, 0, 3, 0, 0, 4, 0, 8],
//     [0, 3, 7, 0, 0, 1, 0, 0, 0],
//     [0, 0, 4, 9, 0, 0, 5, 0, 0],
//     [0, 0, 0, 0, 0, 7, 2, 8, 0],
//     [1, 0, 8, 0, 0, 3, 0, 9, 0]];

// let puzzle = [
//     [0, 4, 0, 0, 0, 0, 0, 0, 7],
//     [7, 0, 0, 3, 0, 0, 0, 4, 0],
//     [0, 0, 2, 7, 0, 9, 6, 0, 0],
//     [4, 0, 5, 0, 0, 8, 0, 0, 9],
//     [0, 0, 7, 0, 0, 0, 8, 0, 0],
//     [8, 0, 6, 0, 0, 3, 2, 0, 4],
//     [0, 0, 8, 0, 1, 6, 4, 0, 0],
//     [5, 0, 0, 0, 0, 0, 0, 9, 0],
//     [0, 2, 0, 0, 9, 0, 0, 0, 6]];

// let puzzle = [
//     [0, 0, 5, 3, 0, 0, 0, 0, 0],
//     [8, 0, 0, 0, 0, 0, 0, 2, 0],
//     [0, 7, 0, 0, 1, 0, 5, 0, 0],
//     [4, 0, 0, 0, 0, 5, 3, 0, 0],
//     [0, 1, 0, 0, 7, 0, 0, 0, 6],
//     [0, 0, 3, 2, 0, 0, 0, 8, 0],
//     [0, 6, 0, 5, 0, 0, 0, 0, 9],
//     [0, 0, 4, 0, 0, 0, 0, 3, 0],
//     [0, 0, 0, 0, 0, 9, 7, 0, 0]];

// let puzzle = [
//     [5, 3, 0, 0, 7, 0, 0, 0, 0],
//     [6, 0, 0, 1, 9, 5, 0, 0, 0],
//     [0, 9, 8, 0, 0, 0, 0, 6, 0],
//     [8, 0, 0, 0, 6, 0, 0, 0, 3],
//     [4, 0, 0, 8, 0, 3, 0, 0, 1],
//     [7, 0, 0, 0, 2, 0, 0, 0, 6],
//     [0, 6, 0, 0, 0, 0, 2, 8, 0],
//     [0, 0, 0, 4, 1, 9, 0, 0, 5],
//     [0, 0, 0, 0, 8, 0, 0, 7, 9]];

sudoku(puzzle);