

const g_srcDataArr = 
[
	{
		"name": "Rostov-on-Don, Admiral",
		"description": "Only a small part of the work performed by our company is presented on the site. For 14 years on in the construction market we have made happy more than 1000 families",
		"city": "Rostov-on-Don\nLCD admiral",
		"area": "81 m2",
		"repair time": "3.5 months",
		"repair cost": "Upon request",
		"imageUrl": "images/slide 1.png"
	},
	{
		"name": "Sochi Thieves",
		"description": "Only a small part of the work performed by our company is presented on the site. For 14 years on in the construction market we have made happy more than 1000 families",
		"city": "Sochi\nThieves",
		"area": "105 m2",
		"repair time": "4 months",
		"repair cost": "Upon request",
		"imageUrl": "images/slide 2.png"
	},
	{
		"name": "Rostov-on-Don Patriotic",
		"description": "Only a small part of the work performed by our company is presented on the site. For 14 years on in the construction market we have made happy more than 1000 families",
		"city": "Rostov-on-Don\nPatriotic",
		"area": "93 m2",
		"repair time": "3 months",
		"repair cost": "Upon request",
		"imageUrl": "images/slide 3.png"
	}
];



let g_bTransitionRunning = false;

QuerySelector(document,".info-block .ctrl__arrow_left").onclick = OnCtrlArrowLeftClick;
QuerySelector(document,".info-block .ctrl__arrow_right").onclick = OnCtrlArrowRightClick;

PrepareLayout(g_srcDataArr, 0);




function PrepareLayout(dataArr, startPage)
{
	PrepareInfoPagesLayout(dataArr);
	PrepareCtrlDotsLayout(dataArr);
	PrepareDemoLinksLayout(dataArr);
	PrepareDemoImagesLayout(dataArr, startPage);
	SelectPage(startPage);
}

function PrepareInfoPagesLayout(dataArr)
{
	let originalPage = QuerySelector(document,".info-block .info-page");

	for(let i = 1; i < dataArr.length; ++i)
	{
		let copyPage = originalPage.parentElement.appendChild( originalPage.cloneNode(true) );
		copyPage.classList.add("hidden");
	}

	let pages = QuerySelectorAll(document,".info-block .info-page");
	pages.forEach((p,i) =>
		{
			QuerySelector(p,".info-block .info-page__desc").innerHTML = dataArr[i].description;
			QuerySelector(p,".info-block .detail-body_city").innerHTML = dataArr[i].city.replace("\n","<br>");
			QuerySelector(p,".info-block .detail-body_area").innerHTML = dataArr[i].area;
			QuerySelector(p,".info-block .detail-body_repair-time").innerHTML = dataArr[i]["repair time"];
			QuerySelector(p,".info-block .detail-body_repair-cost").innerHTML = dataArr[i]["repair cost"];
		});
}

function PrepareCtrlDotsLayout(dataArr)
{
	let dots = QuerySelector(document,".info-block .ctrl__dots");
	dataArr.forEach((_,i) =>
		{
			let dot = dots.appendChild( document.createElement("div") );
			dot.classList.add("ctrl__dot");
			dot.dataset.index = i;
			dot.onclick = e => OnPageSelect( parseInt(e.target.dataset.index) );
		});
}

function PrepareDemoLinksLayout(dataArr)
{
	let links = QuerySelector(document,".demo-block .demo-block__links");
	dataArr.forEach((d,i) =>
		{
			let link = links.appendChild( document.createElement("div") );
			link.classList.add("demo-block__link");
			link.textContent = dataArr[i].name;
			link.dataset.index = i;
			link.onclick = e => OnPageSelect( parseInt(e.target.dataset.index) );

			let underline = link.appendChild( document.createElement("div") );
			underline.classList.add("link-underline", "hidden");
		});
}

function PrepareDemoImagesLayout(dataArr, imgIndex)
{
	let slider = QuerySelector(document,".demo-block .demo-block__slider");

	let childLeft = slider.appendChild( document.createElement("img") );
	childLeft.classList.add("demo-block__slider-img", "img-location_left", "hidden");

	let childCenter = slider.appendChild( document.createElement("img") );
	childCenter.classList.add("demo-block__slider-img");
	childCenter.src = dataArr[imgIndex].imageUrl;
	childCenter.alt = dataArr[imgIndex].name;

	let childRight = slider.appendChild( document.createElement("img") );
	childRight.classList.add("demo-block__slider-img", "img-location_right", "hidden");
}



function OnCtrlArrowLeftClick()
{
	if(!g_bTransitionRunning)
	{
		const curPage = GetCurrentPageIndex() - 1;
		const page = (curPage < 0 ? g_srcDataArr.length-1 : curPage);		
		ShiftSlideRightToPage(page);	
		SelectPage(page);
	}
};
function OnPageSelect(index)
{
	if(!g_bTransitionRunning)
	{
		const curPage = GetCurrentPageIndex();
		if(index != curPage)
		{
			if(index > curPage)
				ShiftSlideLeftToPage(index);
			if(index < curPage)
				ShiftSlideRightToPage(index);

			SelectPage(index);
		}
	}
}
function OnCtrlArrowRightClick()
{
	if(!g_bTransitionRunning)
	{
		const curPage = GetCurrentPageIndex() + 1;
		const page = (curPage == g_srcDataArr.length ? 0 : curPage);
		ShiftSlideLeftToPage(page);
		SelectPage(page);
	}
};



function ShiftSlideLeftToPage(index)
{
	let leftElem = GetLeftSliderImgElement();
	let curElem = GetCurrentSliderImgElement();
	let rightElem = GetRightSliderImgElement();
	assert(leftElem && curElem && rightElem);

	leftElem.className = "demo-block__slider-img  img-location_right  hidden";
	leftElem.removeAttribute("src");

	curElem.className = "demo-block__slider-img  img-location_left";
	curElem.removeAttribute("alt");
	curElem.ontransitionend = undefined;

	rightElem.className = "demo-block__slider-img";
	rightElem.setAttribute("src", g_srcDataArr[index].imageUrl);
	rightElem.setAttribute("alt", g_srcDataArr[index].name);
	rightElem.ontransitionend = () => g_bTransitionRunning = false;
	g_bTransitionRunning = true;
}

function ShiftSlideRightToPage(index)
{
	let leftElem = GetLeftSliderImgElement();
	let curElem = GetCurrentSliderImgElement();
	let rightElem = GetRightSliderImgElement();
	assert(leftElem && curElem && rightElem);

	leftElem.className = "demo-block__slider-img";
	leftElem.setAttribute("src", g_srcDataArr[index].imageUrl);
	leftElem.setAttribute("alt", g_srcDataArr[index].name);
	leftElem.ontransitionend = () => g_bTransitionRunning = false;
	g_bTransitionRunning = true;

	curElem.className = "demo-block__slider-img  img-location_right";
	curElem.removeAttribute("alt");
	curElem.ontransitionend = undefined;

	rightElem.className = "demo-block__slider-img  img-location_left  hidden";
	rightElem.removeAttribute("src");
}



function GetLeftSliderImgElement()
{
	let slider = QuerySelector(document,".demo-block .demo-block__slider");
	return Array.from(slider.children).find(c => 
		c.classList.contains("img-location_left"));
}
function GetCurrentSliderImgElement()
{
	let slider = QuerySelector(document,".demo-block .demo-block__slider");
	return Array.from(slider.children).find(c => 
		!c.classList.contains("img-location_left") && !c.classList.contains("img-location_right"));
}
function GetRightSliderImgElement()
{
	let slider = QuerySelector(document,".demo-block .demo-block__slider");
	return Array.from(slider.children).find(c => 
		c.classList.contains("img-location_right"));
}

function GetCurrentPageIndex()
{
	let activeDot = QuerySelector(document,".info-block .ctrl__dots .ctrl__dot-active");
	return parseInt(activeDot.dataset.index);
}



function SelectPage(index)
{
	SelectInfo(index);
	SelectDot(index);
	SelectDemoLink(index);
}
function SelectInfo(index)
{
	let infoPages = QuerySelectorAll(document,".info-block .info-pages .info-page");
	infoPages.forEach(e => e.classList.add("hidden"));
	infoPages[index].classList.remove("hidden");
}
function SelectDot(index)
{
	let dots = QuerySelectorAll(document,".info-block .ctrl__dots .ctrl__dot");
	dots.forEach(e => e.classList.remove("ctrl__dot-active"));
	dots[index].classList.add("ctrl__dot-active");
}
function SelectDemoLink(index)
{
	let links = QuerySelectorAll(document,".demo-block .demo-block__link .link-underline");
	links.forEach(e => e.classList.add("hidden"));
	links[index].classList.remove("hidden");
}



function QuerySelector(parentElement, selector)
{
	let elem = parentElement.querySelector(selector);
	assert(elem);
	return elem;
}
function QuerySelectorAll(parentElement, selector)
{
	let elems = parentElement.querySelectorAll(selector);
	assert(elems.length);
	return elems;
}

function assert(condition, message)
{
	if(!condition)
		throw new Error(message || "Assertion failed");
}

