const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".content button"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");

let charIndex = mistakes = isTyping = 0;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const paragraph = paragraphs[ranIndex];
    typingText.innerHTML = "";
    paragraph.text.split(" ").forEach(word => {
        let span = `<span class="word" data-translation="${paragraph.translations[word] || word}">${word} </span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1) {
        if(!isTyping) {
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText.trim() == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes)  / 5) * (60 / (new Date().getTime() - startTime) * 1000));
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        inpField.value = "";
    }   
}

function resetGame() {
    loadParagraph();
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);

document.addEventListener("mouseover", function(e) {
    if(e.target.classList.contains("word")) {
        const translation = e.target.getAttribute("data-translation");
        const translationSpan = document.createElement("span");
        translationSpan.className = "translation";
        translationSpan.innerText = translation;
        e.target.appendChild(translationSpan);
    }
});

document.addEventListener("mouseout", function(e) {
    if(e.target.classList.contains("word")) {
        const translationSpan = e.target.querySelector(".translation");
        if(translationSpan) {
            translationSpan.remove();
        }
    }
});
