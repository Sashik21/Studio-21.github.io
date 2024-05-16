    /*global TweenMax, TimelineMax, Power1, Power2, Power0, TweenLite*/

    var Utils = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (Utils.Android() || Utils.BlackBerry() || Utils.iOS() || Utils.Opera() || Utils.Windows());
        },
        randomInRange: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var wrapperRombo = document.getElementById('wrapper'),
        nRombo = 46,
        timer = 0.8;

    function setObj() {
        if (Utils.iOS()) {
            var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
            var heightIOs = window.innerHeight * zoomLevel;
            if (heightIOs > window.innerWidth) {
                document.querySelector('.Main').style.height = heightIOs + 'px';
                document.querySelector('.Main').style.minHeight = heightIOs + 'px';
            }
        }
    }

    function romboInit() {
        for (var i = 0; i < nRombo; i++) {
            var gridItem = document.createElement('div');
            var romboDiv = document.createElement('div');
            gridItem.className = "box";
            wrapperRombo.appendChild(gridItem);
            romboDiv.className = "rombo";
            gridItem.appendChild(romboDiv);
            TweenMax.set(romboDiv, {
                transformStyle: "preserve-3d",
                backgroundColor: '#000',
                top: Utils.randomInRange(-180, 180),
                left: Utils.randomInRange(-180, 180),
                y: -100,
                scale: 0,
                opacity: 0,
                transformOrigin: '50% 50%',
                filter: 'blur(4px)' // Apply blur effect
            });
        }
    }

    function romboAnimation() {
        var rombos = document.querySelectorAll('.rombo');
        var tl = new TimelineMax({
            onComplete: function() {
                rombos.forEach(romboFloat);
            }
        });
        tl.staggerTo(rombos, 0.6, { // reduced duration for quicker animation
            y: 0,
            scale: 1,
            opacity: 1,
            rotationY: 0,
            rotation: 0,
            force3D: true,
            ease: Power2.easeOut
        }, 0.04); // reduced stagger time for quicker animation
        return tl;
    }

    function romboFloat(rombo) {
        TweenMax.to(rombo, 4, {
            y: '+=20',
            x: '+=10',
            ease: Power1.easeInOut,
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 0.5
        });
    }

    function init() {
        setObj();
        romboInit();
        var master = new TimelineMax({
            delay: 0.4
        });
        master.add(romboAnimation(), "scene1");
        master.timeScale(timer);

        // Show the logo with puff-in-center animation after 0.3s
        setTimeout(() => {
            const logo = document.getElementById('logo');
            logo.classList.remove('hidden');
            document.getElementById('announcement').classList.remove('hidden');

            // Add shadow-pulse animation to the logo
            logo.style.animation = 'puff-in-center 0.6s ease-out forwards, shadow-pulse 2s infinite';
        }, 300);

        // Apply puff-in-center effect to announcement text
        setTimeout(() => {
            const announcementText = document.querySelectorAll('#announcement p');
            announcementText.forEach((text, index) => {
                text.style.animation = `puff-in-center 0.6s ease-out forwards ${index * 0.3}s`;
            });
        }, 600);
    }

    function animateQuote() {
        const words = document.getElementsByTagName('span');
        const cite = document.getElementsByTagName('cite');
        const blockquote = document.querySelector('blockquote');
        const background = document.querySelector('.background');
        let maxDelay = 0;
        let maxDuration = 0;

        // Animate each word with a blur effect
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const duration = parseFloat(word.dataset.duration);
            const delay = parseFloat(word.dataset.delay);
            const blur = parseFloat(word.dataset.blur);

            maxDelay = Math.max(maxDelay, delay);
            maxDuration = Math.max(maxDuration, duration);

            TweenLite.set(word, {
                'webkitFilter': `blur(${blur}px)`
            });
            TweenLite.set(word, {
                className:"+=animate",
                transition: `all ${duration}s ease-in ${delay}s`
            });
        }

        TweenLite.set(cite, {
            className:"+=animate",
            transition: `all ${maxDuration}s ease-in ${maxDelay}s`
        });

        TweenLite.delayedCall((maxDuration + maxDelay), () => {
            const baseDelay = 4;
            TweenLite.set(words, { className:"-=animate", delay: baseDelay });
            TweenLite.set(cite, { className:"-=animate", delay: (baseDelay) });

            // After the quote has disappeared, remove the blockquote and transition the background
            TweenLite.delayedCall((baseDelay + (maxDuration * 2)), () => {
                blockquote.remove();
                background.classList.remove('background-black');
                background.classList.add('background-frosted');
                init();
            });
        });
    }

    // Start the quote animation sequence
    animateQuote();