(function() {
	const slider = document.querySelector('.slider')
	const slides = slider.querySelectorAll('img')
	const image = document.createElement('img')
	const paths = []
	const wait = 3000
	var index = 0
	
	slider.appendChild(image)
	
	Array.prototype.forEach.call(slides, function(slide) {
		paths.push(slide.src)
		slide.style.display = 'none'
	})
	
	function changeImage() {
		image.src = paths[index]
		index = index == paths.length - 1 ? 0 : index + 1
	}
	
	setInterval(changeImage, wait)
	changeImage()
})()