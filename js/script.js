//hamburger
const openBtn = document.querySelector(".hamburger");
const menu = document.querySelector(".fullscreen-menu");
const closeMenu = document.querySelector(".fullscreen-menu__close");

openBtn.addEventListener("click", e => {
    menu.classList.add("active");
});

closeMenu.addEventListener("click", e => {
    menu.classList.remove("active");
})

menu.addEventListener("click", e => {
    if(e.target === menu) {
        closeMenu.click();
    } 
})

//team
/* 
const teamList = document.querySelector('.team__list');

function openItem(button) {
    const contentWrap = button.nextElementSibling;
    const content =  contentWrap.firstElementChild;

    const currentHeight = content.offsetHeight;
    contentWrap.style.height = currentHeight + 'px';
    button.classList.add('team__name--active')
}

function closeItem(button) {
    if(!button) return;
    const contentWrap = button.nextElementSibling;
    contentWrap.style.height = 0;
    button.classList.remove('team__name--active')
}

teamList.addEventListener('click', function(e) {
    e.preventDefault();
    const target = e.target;
    const activeItem = document.querySelector('.team__name--active');

    if (target.classList.contains('team__name')) {
        if(target.classList.contains('team__name--active')) {
            closeItem(target);
        } else {
            closeItem(activeItem);
            openItem(target);
        }
    }
}); */



const openItem = item => {
    const container = item.closest(".team__item");
    const contentBlock = container.find(".team__content");
    const textBlock = contentBlock.find(".team__content--block");
    const reqHeight = textBlock.height();
    const arrow = container.find(".team__title");

    arrow.addClass("team__title--active")
    container.addClass("active");
    contentBlock.height(reqHeight + 6);
    
}

const closeEveryItem = container => {
    const items = container.find('.team__content');
    const itemContainer = container.find(".team__item");
    const arrow = container.find(".team__title");

    arrow.removeClass("team__title--active")
    itemContainer.removeClass("active")
    items.height(0) ;
}

$('.team__title').click(e => {
    const $this = $(e.currentTarget);
    const container = $this.closest('.team__list');
    const elemContainer = $this.closest(".team__item");

    if (elemContainer.hasClass("active")) {
        closeEveryItem(container);
    } else {
        closeEveryItem(container);
        openItem($this);
    }
})

/* let slides = document.querySelectorAll('.reviews__switcher .reviews__switcher-item');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide,2000);

function nextSlide() {
    slides[currentSlide].className = 'team__item';
    currentSlide = (currentSlide+1)%slides.length;
    slides[currentSlide].className = 'interactive-avatar--active';
} */



//tabs

const findBlockByAlias = alias => {
    return $(".reviews__display-inner").filter((ndx, item) => {
        return $(item).attr("data-linked-with") === alias;
    });
};
$(".interactive-avatar__link").click((e) => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr("data-open");
    const itemToShow = findBlockByAlias(target);
    const curItem = $this.closest(".reviews__switcher-item");


    itemToShow.addClass("reviews__display-inner--active").siblings().removeClass("reviews__display-inner--active");
    curItem.addClass("interactive-avatar--active").siblings().removeClass("interactive-avatar--active");
});

//slider


$(document).ready(function(){
    const slider = $('.products').bxSlider({
        pager: false,
        controls: false
    });
    $('.product-slider__arrows--prev').click((e) => {
        e.preventDefault();
    
        slider.goToPrevSlide();
    })
    $('.product-slider__arrows--next').click((e) => {
        e.preventDefault();
    
        slider.goToNextSlide();
    })
  });


//form

const validateFields = (form, fieldArray) => {
    fieldArray.forEach(field => {
        field.removeClass("input-error");
        if(field.val().trim() === "") {
            field.addClass("input-error");
        }
    });

    const errorField = form.find(".input-error")

    return errorField.length === 0;
}

$('.form').submit((e) => {
    e.preventDefault();

    const form = $(e.currentTarget);
    const name = form.find("[name='name']");
    const phone = form.find("[name='phone']");
    const comment = form.find("[name='comment']");
    const to = form.find("[name='to']");

    const modal = $("#modal");
    const content = modal.find(".modal__content");

    modal.removeClass("error-modal");

    const isValid = validateFields(form, [name, phone, comment, to])
    
    if(isValid) {
        const request = $.ajax({
            url: "https://webdev-api.loftschool.com/sendmail",
            method: "post",
            data: {
                name: name.val(),
                phone: phone.val(),
                comment: comment.val(),
                to: to.val()
            },
            error: data => {
                
            }
        });

        request.done(data => {
            content.text(data.message)
        });

        request.fail(data => {
            const message = data.responseJSON.message;
            content.text(message);
             modal.addClass("error-modal");
                
        });

        request.always(() => {
            $.fancybox.open({
                src: "#modal",
                type: "inline"
            });
        })
    }
    
})

$(".app-close-modal").click((e) => {
    e.preventDefault();

    $.fancybox.close();
})

//map

let myMap;

const init = () => {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12,
        controls: []
    });

    const coords = [
        [55.752004, 37.576133],
        [55.760686, 37.676911],
        [55.722314, 37.639396],
        [55.813083, 37.592057]
    ];

    const myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: "./img/icons/marker.svg",
        iconImageSize: [48, 63],
        iconImageOffset: [-3, -42]
    });

    coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord))
    })

    myMap.geoObjects.add(myCollection);

    myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);


//player 

let player;
const playerContainer = $('.player');


let eventsInit = () => {
    $(".player__start").click((e) => {
        e.preventDefault();

        if (playerContainer.hasClass('paused')) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
    });

    $('.player__playback').click((e) => {
        const bar = $(e.currentTarget);
        const clickedPosition = e.originalEvent.layerX;
        const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
        const newPlaybackPositionSec = (player.getDuration() / 100) * newButtonPositionPercent;

        $(".player__playback-button").css({
            left: `${newButtonPositionPercent}%`
        });

        player.seekTo(newPlaybackPositionSec);
    })
    $(".player__splash").click((e) => {
        player.playVideo();
    })
}

const formatTime = timeSec => {
    const roundTime = Math.round(timeSec);

    const minutes = addZero(Math.floor(roundTime / 60));
    const seconds = addZero(roundTime - minutes * 60);

    function addZero(num) {
        return num < 10 ? `0${num}` : num;
    }
    
    return `${minutes} : ${seconds}`;
}

const onPlayerReady = () => {
    let interval;
    const durationSec = player.getDuration();
    
    $(".player__duration-estimate").text(formatTime(durationSec));

    if (typeof interval !== 'undefined') {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        const completedSec = player.getCurrentTime();
        const completedPercent = (completedSec / durationSec) * 100;

        $(".player__playback-button").css({
            left: `${completedPercent}%`
        })
        $(".player__duration-completed").text(formatTime(completedSec))
    }, 1000);
};

const onPlayerStateChange = event => {
    /* 
    -1 (воспроизведение видео не начато)
    0 (воспроизведение видео завершено)
    1 (воспроизведение)
    2 (пауза)
    3 (буферизация)
    5 (видео подают реплики) 
    */
    switch (event.data) {
        case 1:
            playerContainer.addClass("active");
            playerContainer.addClass("paused");
            break;

        case 2:
            playerContainer.removeClass("active");
            playerContainer.removeClass("paused");
            break;
    }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '391',
    width: '660',
    videoId: '_gZNClklSEY',
    events: { 
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange 
    },
    playerVars: {
        controls: 0,
        disablekb: 0,
        showinfo: 0,
        rel: 0,
        autoplay: 0,
        modestbranding: 0
    }
  });
}

eventsInit();