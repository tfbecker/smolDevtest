```javascript
let comments = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'LOAD_COMMENTS') {
        loadComments(request.url);
    } else if (request.message === 'SAVE_COMMENT') {
        saveComment(request.comment);
    } else if (request.message === 'DELETE_COMMENT') {
        deleteComment(request.id);
    }
});

function loadComments(url) {
    chrome.storage.sync.get(url, (result) => {
        if (result[url]) {
            comments = result[url];
            chrome.runtime.sendMessage({message: 'COMMENTS_LOADED', comments: comments});
        }
    });
}

function saveComment(comment) {
    comments.push(comment);
    chrome.storage.sync.set({[comment.url]: comments}, () => {
        chrome.runtime.sendMessage({message: 'COMMENT_SAVED', comment: comment});
    });
}

function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    chrome.storage.sync.set({[comments[0].url]: comments}, () => {
        chrome.runtime.sendMessage({message: 'COMMENT_DELETED', id: id});
    });
}
```