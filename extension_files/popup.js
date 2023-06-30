```javascript
let comments = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveButton').addEventListener('click', saveComment);
    loadComments();
});

function saveComment() {
    let commentInput = document.getElementById('commentInput');
    let comment = commentInput.value.trim();
    if (comment) {
        let commentObj = {
            id: new Date().getTime(),
            url: window.location.href,
            comment: comment,
            timestamp: new Date()
        };
        comments.push(commentObj);
        chrome.storage.sync.set({ 'comments': comments }, function() {
            commentInput.value = '';
            renderComments();
        });
    }
}

function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    chrome.storage.sync.set({ 'comments': comments }, function() {
        renderComments();
    });
}

function loadComments() {
    chrome.storage.sync.get('comments', function(data) {
        if (data.comments) {
            comments = data.comments;
            renderComments();
        }
    });
}

function renderComments() {
    let commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    comments.forEach(comment => {
        let listItem = document.createElement('li');
        listItem.textContent = comment.comment;
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteComment(comment.id);
        });
        listItem.appendChild(deleteButton);
        commentList.appendChild(listItem);
    });
}
```