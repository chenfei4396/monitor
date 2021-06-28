
export function injectJsError() {
    //监听全局未捕获的错误
    window.addEventListener('error', function (event) {//错误事件对象
        let lastEvent = getLastEvent();//最后一个交互事件
        //这是一个脚本加载错误
        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability',//监控指标的大类
                type: 'error',//小类型 这是一个错误
                errorType: 'resourceError',//js或css资源加载错误
                filename: event.target.src || event.target.href,//哪个文件报错了
                tagName: event.target.tagName,//SCRIPT
                //body div#container div.content input
                selector: getSelector(event.target) //代表最后一个操作的元素
            });
        } else {
            tracker.send({
                kind: 'stability',//监控指标的大类
                type: 'error',//小类型 这是一个错误
                errorType: 'jsError',//JS执行错误
                message: event.message,//报错信息
                filename: event.filename,//哪个文件报错了
                position: `${event.lineno}:${event.colno}`,
                stack: getLines(event.error.stack),
                //body div#container div.content input
                selector: lastEvent ? getSelector(lastEvent.path) : '' //代表最后一个操作的元素
            });
        }
    }, true);
}