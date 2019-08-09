var WPTB_TableStateSaving = function() {
    
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // выбираем элемент
    let target = document.querySelector('.wptb-preview-table');

    // создаем экземпляр наблюдателя
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
//            if( mutation.type === 'attributes' ) {
//                
//            } else if( mutation.type === 'childList' ) {
//                console.log( mutations );
//            } else {
//                console.log(mutation.type);
//                console.log(mutations);
//            }
            
        });    
    });

    // настраиваем наблюдатель
    let config = { attributes: true, childList: true, characterData: true, subtree: true }

    // передаем элемент и настройки в наблюдатель
    observer.observe(target, config);

    // позже можно остановить наблюдение
    //observer.disconnect();
    
}