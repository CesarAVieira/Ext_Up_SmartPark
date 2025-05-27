// Funções de seleção
var select = function(s) {
    return document.querySelector(s);
};

var selectAll = function(s) {
    return document.querySelectorAll(s);
};

// Variáveis globais
let currentRating = 0;
let anim;

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = select('#loading-screen');
    const videoContainer = select('.video-container');
    const youtubeIframe = select('#youtube-iframe');
    const stars = selectAll('.stars i');
    const ratingFeedback = select('#rating-feedback');
    const animationWindow = select('#animationWindow');

    // 1. Inicializa a animação Lottie
    function initAnimation() {
        const animData = {
            wrapper: animationWindow,
            animType: 'svg',
            loop: true,
            prerender: true,
            autoplay: true,
            path: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/play_fill_loader.json',
            rendererSettings: {
                progressiveLoad: true,
                hideOnTransparent: true
            }   
        };

        anim = lottie.loadAnimation(animData);
        anim.setSpeed(1);

        anim.addEventListener('DOMLoaded', function() {
            console.log('Animação Lottie carregada');
        });
    }

    // Inicia a animação
    initAnimation();

    // 2. Controle do iframe do YouTube
    youtubeIframe.onload = function() {
        // Esconde a tela de carregamento após um delay
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            
            // Para a animação antes de esconder
            anim.stop();
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                videoContainer.style.display = 'block';
            }, 500);
        }, 5500); // Delay para garantir carregamento completo
    };

    // 3. Fallback caso o iframe não carregue
    setTimeout(() => {
        if (!youtubeIframe.contentWindow) {
            loadingScreen.innerHTML = '<p>Erro ao carregar o vídeo. Recarregue a página.</p>';
            anim.stop();
        }
    }, 10000); // Timeout de 10 segundos

    // 4. Sistema de avaliação por estrelas (mantido igual)
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            const feedbacks = [
                "Péssimo",
                "Ruim",
                "Regular",
                "Bom",
                "Excelente!"
            ];
            
            ratingFeedback.textContent = `Você avaliou: ${feedbacks[rating - 1]}`;
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffcc00';
                } else {
                    s.style.color = '#ccc';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.style.color = '#ffcc00';
                } else {
                    s.style.color = '#ccc';
                }
            });
        });
    });

    // 5. Função para controle manual da timeline (opcional)
    window.ScrubBodymovinTimeline = function(animation) {
        // Implementação opcional para controlar a animação
        // Exemplo: conectar a scroll ou interação do usuário
        console.log('Função ScrubBodymovinTimeline disponível');
    };
});