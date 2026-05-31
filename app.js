// Cache Management
const CACHE_KEY = 'truthOrDarePlayers';

// Spieler Array
let players = [];
let currentPlayerIndex = 0;

// Verwendete Fragen tracken
let usedTruthQuestions = [];
let usedDareQuestions = [];

// Fragen
const questions = {
    truth: [
        "Was war dein peinlichstes Erlebnis?",
        "Wen findest du in dieser Runde am attraktivsten?",
        "Was ist das Verrückteste, das du je gemacht hast?",
        "Hast du jemals etwas gestohlen?",
        "Was ist deine größte Angst?",
        "Wann hast du das letzte Mal gelogen?",
        "Was ist dein peinlichstes Geheimnis?",
        "In wen warst du das erste Mal verliebt?",
        "Was würdest du mit einer Million Euro machen?",
        "Was ist die dümmste Sache, die du je getan hast?",
        "Hast du schon mal jemandem etwas Wichtiges verschwiegen?",
        "Was war dein schlechtester Kuss?",
        "Was ist deine peinlichste Gewohnheit?",
        "Hast du schon mal bei einem Test geschummelt?",
        "Was ist das Mutigste, was du je getan hast?",
        "Hattest du schon mal Anal Sex",
        "wie oft masturbierst du in der Woche",
        "Hast du Fantasien mit jemanden aus der Gruppe",
        "Wenn du dir für den Rest deines Lebens nur noch eine Sex Stellung raussuchen dürftest, welche wäre es",
        "Gamechanger Glück gehabt, Amelie und Leo treibens heute noch im Pool",
        "Mit wem aus der Runde würdest du heute noch zu zweit in die Dusche steigen",
        "Wer aus der Gruppe ist objektiv am attraktivsten",
        "Hast du schon mal jemanden aus dieser Gruppe attraktiv gefunden",
        "Schon mal Schanz gelutscht?",
        
    ],
    dare: [
        "Mache 20 Liegestütze",
        "Rufe jemanden an und singe ein Lied",
        "Tanze 1 Minute lang ohne Musik",
        "Rede 2 Minuten lang nur in Reimen",
        "Poste ein peinliches Selfie",
        "Lass jemand anderen deine nächste Nachricht schreiben",
        "Mache einen Handstand",
        "Sprich mit einem ausländischen Akzent für die nächsten 3 Runden",
        "Zeige die peinlichsten Fotos auf deinem Handy",
        "Ruf deine Eltern an und sag ihnen, dass du sie liebst",
        "Mache 5 Minuten lang alles, was dir gesagt wird",
        "Gib jemandem in der Runde eine Massage",
        "Iss etwas ohne die Hände zu benutzen",
        "Tausche dein Oberteil mit jemandem",
        "Mache ein TikTok Video und poste es",
        "Zeig uns deine Brüste",
        "Eine Runde Nackt Baden mit Person anderen Geschlechts",
        "Du darfst zu einem random Moment deine Nase unauffällig berühren, der der es als letztes checkt und als letztes die eigene Nase berührt, muss ein Kleidungsstück ausziehen",
        "Gib der Person (anderen Geschlechts Rechts von dir) einen Kuss auf die Backe",
        "Einmal U-Boot bei der Person rechts von dir (anderes Geschlecht)",
        "Einen Bodyshot bei der Person links von dir (anderes Geschlecht)",
        "Rummachen mit der nächste Person des anderen Geschlechts rechts von dir",
        "Du und die Person rechts von dir (anderes Geschlecht) haben 2 Minuten zu zweit in einem Zimmer eurer Wahl",
        "Knutschi Time, mache mit der Person links von dir rum (anderes Geschlecht)",
        "Mache einen Melody Bar private Dance",
        "Imitiere eine Sex Pose bei der Person rechts von dir (anderes Geschlecht)",
        "Alkohol Runde, jeder nimmt 2 Schlücke seines alk. Getränks",
        "Sophia time to shine, knutsch mit der Wand",
        "Lass dir eine Titten Massage geben von der Person rechts von dir (anderes geschlecht)"
    ]
};

// Lade Spieler aus Cache
function loadPlayers() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        players = JSON.parse(cached);
        updatePlayerList();
        if (players.length > 0) {
            document.getElementById('startBtn').style.display = 'block';
        }
    }
}

// Speichere Spieler im Cache
function savePlayers() {
    localStorage.setItem(CACHE_KEY, JSON.stringify(players));
}

// Spieler hinzufügen
function addPlayer() {
    const input = document.getElementById('playerName');
    const name = input.value.trim();
    
    if (name === '') {
        alert('Bitte gib einen Namen ein!');
        return;
    }
    
    if (players.includes(name)) {
        alert('Dieser Spieler existiert bereits!');
        return;
    }
    
    players.push(name);
    savePlayers();
    updatePlayerList();
    input.value = '';
    
    if (players.length > 0) {
        document.getElementById('startBtn').style.display = 'block';
    }
}

// Spielerliste aktualisieren
function updatePlayerList() {
    const list = document.getElementById('playerList');
    list.innerHTML = '';
    
    players.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.innerHTML = `
            <span>${player}</span>
            <button onclick="removePlayer(${index})">Entfernen</button>
        `;
        list.appendChild(div);
    });
}

// Spieler entfernen
function removePlayer(index) {
    players.splice(index, 1);
    savePlayers();
    updatePlayerList();
    
    if (players.length === 0) {
        document.getElementById('startBtn').style.display = 'none';
    }
}

// Spiel starten
function startGame() {
    if (players.length < 2) {
        alert('Du brauchst mindestens 2 Spieler!');
        return;
    }
    
    currentPlayerIndex = 0;
    showScreen('gameScreen');
    updateCurrentPlayer();
}

// Frage abrufen
function getQuestion(type) {
    const questionsArray = questions[type];
    const usedQuestions = type === 'truth' ? usedTruthQuestions : usedDareQuestions;
    
    // Wenn alle Fragen verwendet wurden, Reset
    if (usedQuestions.length >= questionsArray.length) {
        if (type === 'truth') {
            usedTruthQuestions = [];
        } else {
            usedDareQuestions = [];
        }
        alert('Alle Fragen wurden verwendet! Fragen werden zurückgesetzt.');
    }
    
    // Verfügbare Fragen filtern
    const availableQuestions = questionsArray.filter((q, index) => !usedQuestions.includes(index));
    
    // Zufällige Frage aus verfügbaren auswählen
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Original-Index finden und als verwendet markieren
    const originalIndex = questionsArray.indexOf(selectedQuestion);
    if (type === 'truth') {
        usedTruthQuestions.push(originalIndex);
    } else {
        usedDareQuestions.push(originalIndex);
    }
    
    document.getElementById('questionPlayer').textContent = players[currentPlayerIndex];
    document.getElementById('questionText').textContent = selectedQuestion;
    
    showScreen('questionScreen');
}

// Nächster Spieler
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateCurrentPlayer();
    showScreen('gameScreen');
}

// Aktuellen Spieler aktualisieren
function updateCurrentPlayer() {
    document.getElementById('currentPlayer').textContent = `${players[currentPlayerIndex]}, du bist dran!`;
}

// Zurück zum Menü
function backToHome() {
    currentPlayerIndex = 0;
    // Reset verwendete Fragen beim Zurück zum Menü
    usedTruthQuestions = [];
    usedDareQuestions = [];
    showScreen('setupScreen');
}

// Screen wechseln
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Enter-Taste für Spieler hinzufügen
document.getElementById('playerName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

// Beim Laden der Seite
loadPlayers();
