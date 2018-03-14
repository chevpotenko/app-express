$(function (){
    $('.delete-article').on('click', function (e){       
        const id = $(e.target).attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success :function () {
                window.location.href = '/';
            },
            error: function (err){
                console.log(err);
            }
        });
    });
});