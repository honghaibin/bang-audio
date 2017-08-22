(function($,fn,obj){
        window.BANG_audio= window.BANG_audio || fn($,obj);
    })(jQuery,function($,obj){
        var app = function(){};
        app.pt = app.prototype;

        var currentlyDragged= null;
        var draggableClasses = ['bang-pin'];

        app.pt.init= function(container,options){
            if(Object.prototype.toString.call(options) === '[object Array]'){
                container.empty();
                for(var i=0;i<options.length;i++){
                    var option= options[i];
                    var url= option.url;
                    var source='';
                    for(var j=0;j<url.length;j++){
                        source+= '<source src="'+url[j]+'"></source>'
                    }
                    container.append(BANG_audio.renderUrl(obj.temp,{
                        source:source,
                        downloadName:'',
                        downloadUrl: url[0]
                    }));
                    if(option.download=== false){
                        container.find('.bang-download:last').remove();
                    }
                    if(option.rate=== false){
                        container.find('.bang-rate:last').remove();
                    }
                    if(option.listen=== false){
                        container.children().each(function(){
                            if(!$(this).hasClass('bang-download')){
                                $(this).remove();
                            }
                        })
                    }
                }
            }
            else if(Object.prototype.toString.call(options) === '[object Object]'){
                var url= options.url;
                var source='';
                for(var i=0;i<url.length;i++){
                    source+= '<source src="'+url[i]+'"></source>'
                }
                container.html(BANG_audio.renderUrl(obj.temp,{
                    source:source,
                    downloadName:'',
                    downloadUrl: url[0]
                }));
                if(options.download=== false){
                    container.find('.bang-download').remove();
                }
                if(options.rate=== false){
                    container.find('.bang-rate').remove();
                }
                if(options.listen=== false){
                    container.find('.audio.bang-audio-player').children().each(function(){
                        if(!$(this).hasClass('bang-download')){
                            $(this).remove();
                        }
                    })
                }
            }
            
        }

        app.pt.renderUrl= function( tpl, data ){

            var re = /{{([^}]+)?}}/;
            var match = '';
            data = data || {};

            while(match = re.exec(tpl)){
                tpl = tpl.replace(match[0],data[match[1]]);
            }

            return tpl;
        },

        app.pt.changeRate= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var player= src.find('audio')[0];
            var text= $(target).text();
            if(text==='x1.0'){
                player.playbackRate=1.5;
                $(target).text('x1.5');
            }
            else if(text==='x1.5'){
                player.playbackRate=2;
                $(target).text('x2.0');
            }
            else if(text==='x2.0'){
                player.playbackRate=1;
                $(target).text('x1.0');
            }
        }

        app.pt.openVolumeControls= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var volumeBtn= src.find('.bang-volume-btn')[0];
            var volumeControls= src.find('.bang-volume-controls')[0];
            volumeBtn.classList.toggle('open');
            volumeControls.classList.toggle('hidden');
        }

        app.pt.togglePlay= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var player= src.find('audio')[0];
            var playPause= src.find('[data-role="playPause"]')[0];
            if(player.paused){
                playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
                player.play();
            }else {
                playPause.attributes.d.value = "M18 12L0 24V0";
                player.pause();
            }
        }

        app.pt.ended= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var playPause= src.find('[data-role="playPause"]')[0];
            var player= src.find('audio')[0];
            playPause.attributes.d.value = "M18 12L0 24V0";
            player.currentTime = 0;
        }

        app.pt.formatTime= function(time){
            var min = Math.floor(time / 60);
            var sec = Math.floor(time % 60);
            return min + ':' + (sec < 10 ? '0' + sec : sec);
        }

        app.pt.showTotalTime= function (e) {
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var totalTime= src.find('.bang-total-time');
            var player= src.find('audio')[0];
            totalTime.text( BANG_audio.formatTime(player.duration) );
        }

        app.pt.updateVolume= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var volumeControls= src.find('.bang-volume-controls')
            var volumeProgress= volumeControls.find('.bang-slider .bang-progress')[0];
            var player= src.find('audio')[0];
            var speaker= src.find('[data-role="speaker"]')[0];
            volumeProgress.style.height = player.volume * 100 + '%';
            if(player.volume >= 0.5 ){
                speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
            } else if ( player.volume < 0.5 && player.volume > 0.05 ){
                speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
            } else if ( player.volume <= 0.05 ){
                speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
            }
        }

        app.pt.changeVolume= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var player= src.find('audio')[0];
            if (BANG_audio.inRange(e)) {
                player.volume = BANG_audio.getCoefficient(e);
            }
        }

        app.pt.makePlay= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var playpauseBtn= src.find('.bang-play-pause-btn');
            var loading= src.find('.bang-loading');
            playpauseBtn.show();
            loading.hide();
        }

        app.pt.updateProgress= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var player= src.find('audio')[0];
            var progress= src.find('.bang-progress')[0];
            var currentTime= src.find('.bang-current-time');
            var current = player.currentTime;
            var percent = current / player.duration * 100;
            progress.style.width = percent + '%';
            currentTime.text( BANG_audio.formatTime(current) );
        }

        app.pt.rewind= function(e){
            var target= e.target|| e;
            var src= $(target).parents('.audio.bang-audio-player');

            var player= src.find('audio')[0];
            if( BANG_audio.inRange(e) ){
                player.currentTime= player.duration * BANG_audio.getCoefficient(e);;
            }
        }

        app.pt.inRange= function(e){
            var rangeBox = BANG_audio.getRangeBox(e);
            var rect = rangeBox.getBoundingClientRect();
            var direction = rangeBox.dataset.direction;
            if (direction == 'horizontal') {
                var min = BANG_audio.getLeft(rangeBox);
                var max = min + rangeBox.offsetWidth;
                var minH = rect.top;
                var maxH = minH + rangeBox.offsetHeight;
                if (e.clientX < min || e.clientX > max || e.clientY < minH || e.clientY > maxH) return false;
            } else {
                var min = rect.top;
                var max = min + rangeBox.offsetHeight;
                var minX = rect.left;
                var maxX = minX + rangeBox.offsetWidth;
                if (e.clientX < minX || e.clientX > maxX ||e.clientY < min || e.clientY > max) return false;
            }
            return true;
        }

        app.pt.getTop= function(el){
            var offset=el.offsetTop;
            if(el.offsetParent!=null) offset+=BANG_audio.getTop(el.offsetParent);
            return offset;
        }

        app.pt.getLeft= function(el){
            var offset=el.offsetLeft;
            if(el.offsetParent!=null) offset+=BANG_audio.getLeft(el.offsetParent);
            return offset;
        }

        app.pt.getRangeBox= function(e){
            var rangeBox = e.target;
            var el = currentlyDragged;
            if (e.type == 'click' && BANG_audio.isDraggable(e.target)) {
                rangeBox = e.target.parentElement.parentElement;
            }
            if (e.type == 'mousemove') {
                rangeBox = el.parentElement.parentElement;
            }
            return rangeBox;
        }

        //获取volume系数
        app.pt.getCoefficient= function(e){
            var slider = BANG_audio.getRangeBox(e);
            var rect = slider.getBoundingClientRect();
            var K = 0;
            if (slider.dataset.direction == 'horizontal') {
                var offsetX = e.clientX - BANG_audio.getLeft(slider);
                var width = slider.clientWidth;
                K = offsetX / width;
            } else if (slider.dataset.direction == 'vertical') {

                var height = slider.clientHeight;
                var offsetY = event.clientY - rect.top;
                K = 1 - offsetY / height;
            }
            return K;
        }

        app.pt.isDraggable= function(el){
            var canDrag = false;
            for(var i=0;i<draggableClasses.length;i++){
                if ($(el).hasClass(draggableClasses[i])) canDrag = true;
            }
            return canDrag;
        }

        app.pt.stopOtherAudio= function(e){
            $('.audio.bang-audio-player').each(function(){
                var player= $(this).find('audio')[0];
                if(!player.paused && player!= e.target){
                    $(this).find('.bang-play-pause-btn').trigger('click');
                }
            })
        }

        window.addEventListener('mousedown', function (event) {

            if (!BANG_audio.isDraggable(event.target)) return false;

            currentlyDragged = event.target;
            var handleMethod = currentlyDragged.dataset.method;

            this.addEventListener('mousemove', BANG_audio[handleMethod], false);

            window.addEventListener('mouseup', function () {
                currentlyDragged =false; 
                window.removeEventListener('mousemove', BANG_audio[handleMethod], false);
            }, false);
        });

        return new app();
    },
    {temp:'<div class="audio bang-audio-player">'
        +'<div class="bang-loading">'
            +'<div class="bang-spinner"></div>'
        +'</div>'
        +'<div class="bang-play-pause-btn" onclick="BANG_audio.togglePlay(event)">  '
            +'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">'
                +'<path fill="#566574" fill-rule="evenodd" d="M18 12L0 24V0" class="bang-play-pause-icon" data-role="playPause">'
            +'</svg>'
        +'</div>'
        +'<div class="bang-controls">'
            +'<span class="bang-current-time">0:00</span>'
            +'<div class="bang-slider" data-direction="horizontal" onclick="BANG_audio.rewind(event)">'
                +'<div class="bang-progress">'
                    +'<div class="bang-pin" id="progress-pin" data-method="rewind"></div>'
                +'</div>'
            +'</div>'
            +'<span class="bang-total-time">0:00</span>'
        +'</div>'
        +'<div class="bang-volume">'
            +'<div class="bang-volume-btn" onclick="BANG_audio.openVolumeControls(event)">'
                +'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">'
                    +'<path fill="#566574" fill-rule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" data-role="speaker">'
                +'</svg>'
            +'</div>'
            +'<div class="bang-volume-controls hidden">'
                +'<div class="bang-slider" data-direction="vertical" onclick="BANG_audio.changeVolume(event)">'
                    +'<div class="bang-progress">'
                        +'<div class="bang-pin" id="volume-pin" data-method="changeVolume"></div>'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>'
        +'<div class="bang-download">'
            +'<a href="{{downloadUrl}}" download="{{downloadName}}" target="_blank" class="download-btn">'
                +'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="24px" height="24px" viewBox="0 0 1000 1000" >'
                    +'<g xmlns="http://www.w3.org/2000/svg">'
                        +'<path fill="#566574" fill-rule="evenodd" d="M935.288,834.613H64.712c-18.192,0-32.939,14.747-32.939,32.939v73.652c0,18.192,14.747,32.939,32.939,32.939h870.576   c18.192,0,32.939-14.747,32.939-32.939v-73.652C968.227,849.36,953.48,834.613,935.288,834.613z"/>'
                        +'<path fill="#566574" fill-rule="evenodd" d="M694.023,24.143H303.699c-22.649,0-41.009,18.361-41.009,41.009V457.19h-79.647c-16.901,0-25,20.755-12.567,32.202   l298.379,274.728c17.602,16.206,44.689,16.206,62.291,0l298.379-274.728c12.433-11.448,4.333-32.202-12.567-32.202H737.31V67.43   C737.31,43.523,717.93,24.143,694.023,24.143z"/>'
                    +'</g>'
                +'</svg>'
            +'</a>'
        +'</div>'
        +'<div class="bang-rate">'
            +'<div class="bang-rate-btn" onclick="BANG_audio.changeRate(event)">x1.0</div>'
        +'</div>'
        +'<audio '
        +'crossorigin '
        +'ontimeupdate="BANG_audio.updateProgress(event)" '
        +'onvolumechange="BANG_audio.updateVolume(event)" '
        +'onloadedmetadata="BANG_audio.showTotalTime(event)"'
        +'oncanplay="BANG_audio.makePlay(event)"'
        +'onended="BANG_audio.ended(event)"'
        +'onplay="BANG_audio.stopOtherAudio(event)">'
            +'{{source}}'
        +'</audio>'
    +'</div>'}
    )