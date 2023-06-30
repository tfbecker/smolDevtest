```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
        case 'SAVE_COMMENT':
            saveComment(request.comment);
            break;
        case 'DELETE_COMMENT':
            deleteComment(request.id);
            break;
        case 'LOAD_COMMENTS':
            loadComments(request.url);
            break;
    }
});

function saveComment(comment) {
    comments.push(comment);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment saved');
    });
}

function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    chrome.storage.sync.set({comments: comments}, function() {
        console.log('Comment deleted');
    });
}

function loadComments(url) {
    chrome.storage.sync.get(['comments'], function(result) {
        comments = result.comments.filter(comment => comment.url === url);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'LOAD_COMMENTS', comments: comments});
        });
    });
}
```