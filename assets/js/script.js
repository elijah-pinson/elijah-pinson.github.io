var texts = ['software engineer', 'hackathon hacker', 'might be sleeping', 'fighting illini', 'sigmusic chair', 'late nighter'];
            setInterval(function() {
              // do some change that will happen every 3 seconds
              $('#background').text(texts[Math.floor(Math.random()*texts.length)]);
            }, 2000); // <- 2 seconds