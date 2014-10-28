$(function(){
	$('.ban').on('click', function(event){
		var id = $(this).parent().find('.id').text();
		$.post('/block', {image: id}, function(res){
			if (res === 'success') {
				alert('Image Permantely Blocked!');
				location.reload();
			}else{
				alert('Error Could Not Block!');
			}
		});
	});
});