const startBtn = document.getElementById("startBtn");
        const targetLanguageSelect = document.getElementById("targetLanguage");
        let targetLanguage = 'en';

        targetLanguageSelect.addEventListener("change", () => {
            targetLanguage = targetLanguageSelect.value;
        });

        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'pt-BR';

            recognition.onstart = () => {
                textDisplayPT.textContent = "Escutando...";
            };

            recognition.onresult = async (event) => {
                const result = event.results[0][0].transcript;
                const textDisplayPT = document.getElementById("textDisplayPT");
                const textDisplayTranslated = document.getElementById("textDisplayTranslated");

                // Atualize o texto em português //
                textDisplayPT.textContent = `Texto em Português: ${result}`;

                // ***Traduza e atualize o texto traduzido ***//
                const translatedText = await translateText(result, targetLanguage);
                textDisplayTranslated.textContent = `Texto Traduzido (${targetLanguage}): ${translatedText}`;
            };

            recognition.onend = () => {
                textDisplayPT.textContent += " (Fim do Texto)";
            };

            recognition.onerror = (event) => {
                textDisplayPT.textContent = "Erro de reconhecimento: " + event.error;
            };

            async function translateText(text, targetLanguage) {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`;
                const response = await fetch(url);
                const data = await response.json();
                return data[0][0][0];
            }

            startBtn.addEventListener("click", () => {
                recognition.start();
            });
        } else {
            const textDisplayPT = document.getElementById("textDisplayPT");
            textDisplayPT.textContent = "API de Reconhecimento de Fala não suportada neste navegador.";
        }