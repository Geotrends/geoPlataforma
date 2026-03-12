document.querySelector('.blog-search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var q = this.querySelector('.blog-search-input').value.trim();
    if (q) { /* aquí podría filtrar o redirigir */ }
});
