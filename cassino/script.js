// =========================
// CONFIGURAÇÕES
// =========================

const SYMBOLS = [
    "💰",
    "💲",
    "🔝",
    "🎲",
    "💣",
    "🔞",
    "💸"
];

const SPIN_COST = 10;
const JACKPOT_REWARD = 100;
const DOUBLE_REWARD = 30;


// =========================
// ELEMENTOS
// =========================

const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("gameScreen");

const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");

const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const userName = document.getElementById("userName");
const creditsElement = document.getElementById("credits");
const creditsGame = document.getElementById("creditsGame");

const logoutButton = document.getElementById("logoutButton");

const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");

const statusElement = document.getElementById("status");
const spinButton = document.getElementById("spinButton");

const toast = document.getElementById("toast");


// =========================
// ESTADO
// =========================

let currentUser = null;
let credits = 100;
let isSpinning = false;


// =========================
// ESTATÍSTICAS
// =========================

let stats = JSON.parse(
    localStorage.getItem("pontoPlayStats")
) || {
    users: 0,
    accesses: 0,
    games: 0,
    jackpots: 0,
    collected: 0
};


let users = JSON.parse(
    localStorage.getItem("pontoPlayUsers")
) || [];


// =========================
// ATUALIZAR CRÉDITOS
// =========================

function updateCredits() {

    if (creditsElement) {
        creditsElement.textContent = credits;
    }

    if (creditsGame) {
        creditsGame.textContent = credits;
    }
}


// =========================
// SALVAR DADOS
// =========================

function saveStats() {

    localStorage.setItem(
        "pontoPlayStats",
        JSON.stringify(stats)
    );
}


function saveUsers() {

    localStorage.setItem(
        "pontoPlayUsers",
        JSON.stringify(users)
    );
}


// =========================
// TOAST
// =========================

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


// =========================
// LOGIN
// =========================

loginButton.addEventListener("click", function () {

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const email = emailInput.value.trim();


    if (!nome || !telefone || !email) {

        loginMessage.textContent =
            "⚠️ Preencha todos os campos.";

        loginMessage.style.color = "#ff5268";

        return;
    }


    if (!email.includes("@")) {

        loginMessage.textContent =
            "⚠️ Digite um e-mail válido.";

        loginMessage.style.color = "#ff5268";

        return;
    }


    currentUser = {
        nome: nome,
        telefone: telefone,
        email: email
    };


    const userExists = users.some(
        user => user.email === email
    );


    if (!userExists) {

        users.push(currentUser);

        stats.users++;

        saveUsers();

    }


    stats.accesses++;

    saveStats();


    userName.textContent = nome;

    credits = 100;

    updateCredits();


    loginScreen.style.display = "none";
    gameScreen.style.display = "block";


    loginMessage.textContent = "";

    showToast(
        `🎉 Bem-vinda, ${nome}! Você recebeu 100 créditos virtuais.`
    );

});


// =========================
// LOGOUT
// =========================

logoutButton.addEventListener("click", function () {

    currentUser = null;

    credits = 100;

    gameScreen.style.display = "none";
    loginScreen.style.display = "flex";

    nomeInput.value = "";
    telefoneInput.value = "";
    emailInput.value = "";

    loginMessage.textContent = "";


    // Reinicia qualquer rodada de 21 em andamento

    blackjackInProgress = false;

    dealerCards = [];
    playerCards = [];

    if (dealerHandElement) dealerHandElement.innerHTML = "";
    if (playerHandElement) playerHandElement.innerHTML = "";
    if (dealerScoreElement) dealerScoreElement.textContent = "";
    if (playerScoreElement) playerScoreElement.textContent = "";

    if (blackjackResult) {
        blackjackResult.textContent =
            "🃏 Clique em \"APOSTAR\" para começar!";
    }

    if (dealButton) dealButton.disabled = false;
    if (hitButton) hitButton.disabled = true;
    if (standButton) standButton.disabled = true;


    // Reinicia o vídeo pôquer

    pokerPhase = "idle";
    pokerHandCards = [];
    pokerHeld = [];

    if (pokerHandElement) pokerHandElement.innerHTML = "";

    if (pokerResult) {
        pokerResult.textContent =
            "🃏 Clique em \"APOSTAR\" para começar!";
    }

    if (pokerDealButton) pokerDealButton.disabled = false;
    if (pokerDrawButton) pokerDrawButton.disabled = true;

});


// =========================
// SLOT MACHINE
// =========================

function randomSymbol() {

    const index = Math.floor(
        Math.random() * SYMBOLS.length
    );

    return SYMBOLS[index];
}


function animateSlot(slot, duration) {

    return new Promise(resolve => {

        const interval = setInterval(() => {

            slot.textContent = randomSymbol();

        }, 100);


        setTimeout(() => {

            clearInterval(interval);

            resolve();

        }, duration);

    });

}


// =========================
// GIRAR SLOT
// =========================

async function spin() {

    if (isSpinning) return;


    if (!currentUser) {

        showToast(
            "⚠️ Faça login primeiro."
        );

        return;
    }


    if (credits < SPIN_COST) {

        statusElement.textContent =
            "❌ Você não possui créditos suficientes.";

        showToast(
            "❌ Créditos insuficientes."
        );

        return;
    }


    isSpinning = true;

    spinButton.disabled = true;


    credits -= SPIN_COST;

    stats.games++;
    stats.collected += SPIN_COST;

    saveStats();

    updateCredits();


    statusElement.textContent =
        "🎰 Girando...";


    const result1 = randomSymbol();
    const result2 = randomSymbol();
    const result3 = randomSymbol();


    await Promise.all([

        animateSlot(slot1, 1500),
        animateSlot(slot2, 2000),
        animateSlot(slot3, 2500)

    ]);


    slot1.textContent = result1;
    slot2.textContent = result2;
    slot3.textContent = result3;


    let message;


    // =========================
    // 3 IGUAIS
    // =========================

    if (
        result1 === result2 &&
        result2 === result3
    ) {

        credits += JACKPOT_REWARD;

        stats.jackpots++;

        saveStats();

        message =
            `🎉 JACKPOT! +${JACKPOT_REWARD} créditos virtuais!`;

    }


    // =========================
    // 2 IGUAIS
    // =========================

    else if (
        result1 === result2 ||
        result1 === result3 ||
        result2 === result3
    ) {

        credits += DOUBLE_REWARD;

        message =
            `⭐ Você acertou 2 símbolos! +${DOUBLE_REWARD} créditos virtuais!`;

    }


    // =========================
    // NENHUM IGUAL
    // =========================

    else {

        message =
            "😢 Nenhum símbolo igual. Você perdeu 10 créditos.";

    }


    updateCredits();


    statusElement.textContent = message;

    showToast(message);


    isSpinning = false;

    spinButton.disabled = false;

}


// =========================
// EVENTO DO BOTÃO
// =========================

spinButton.addEventListener(
    "click",
    spin
);


// =========================
// RODA DA SORTE
// =========================

const fortuneWheel =
    document.getElementById("fortuneWheel");

const wheelButton =
    document.getElementById("wheelButton");

const wheelResult =
    document.getElementById("wheelResult");


let wheelRotation = 0;

let wheelSpinning = false;


// =========================
// RESULTADOS DA RODA
// =========================

const wheelResults = [

    {
        texto: "🎉 +50 créditos virtuais!",
        valor: 50
    },

    {
        texto: "⭐ +20 créditos virtuais!",
        valor: 20
    },

    {
        texto: "🎁 +30 créditos virtuais!",
        valor: 30
    },

    {
        texto: "😄 +10 créditos virtuais!",
        valor: 10
    },

    {
        texto: "✨ +40 créditos virtuais!",
        valor: 40
    },

    {
        texto: "🔥 +20 créditos virtuais!",
        valor: 20
    },

    {
        texto: "💎 +50 créditos virtuais!",
        valor: 50
    },

    {
        texto: "🌟 +10 créditos virtuais!",
        valor: 10
    }

];


// =========================
// GIRAR RODA
// =========================

wheelButton.addEventListener(
    "click",
    function () {

        if (wheelSpinning) return;


        if (!currentUser) {

            showToast(
                "⚠️ Faça login primeiro."
            );

            return;
        }


        if (credits < 10) {

            wheelResult.textContent =
                "❌ Você não possui créditos suficientes.";

            showToast(
                "❌ Créditos insuficientes."
            );

            return;
        }


        wheelSpinning = true;

        wheelButton.disabled = true;


        // Custa 10 créditos virtuais

        credits -= 10;

        stats.games++;
        stats.collected += 10;

        saveStats();

        updateCredits();


        wheelResult.textContent =
            "🎡 Girando...";


        // Escolhe o resultado

        const resultIndex =
            Math.floor(
                Math.random() *
                wheelResults.length
            );


        const result =
            wheelResults[resultIndex];


        // Cada parte da roda possui 45 graus

        const segmentAngle = 45;


        const targetAngle =
            360 -
            (resultIndex * segmentAngle) -
            (segmentAngle / 2);


        // Faz a roda dar várias voltas

        const extraRotations =
            5 * 360;


        wheelRotation +=
            extraRotations +
            targetAngle;


        fortuneWheel.style.transform =
            `rotate(${wheelRotation}deg)`;


        // =========================
        // FINAL DA RODADA
        // =========================

        setTimeout(function () {

            credits += result.valor;

            updateCredits();


            wheelResult.textContent =
                result.texto;


            statusElement.textContent =
                result.texto;


            showToast(
                result.texto
            );


            wheelSpinning = false;

            wheelButton.disabled = false;


        }, 4200);

    }
);


// =========================
// 21 (BLACKJACK)
// =========================

const BLACKJACK_COST = 20;

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
    "A", "2", "3", "4", "5",
    "6", "7", "8", "9", "10",
    "J", "Q", "K"
];


const dealerHandElement =
    document.getElementById("dealerHand");

const playerHandElement =
    document.getElementById("playerHand");

const dealerScoreElement =
    document.getElementById("dealerScore");

const playerScoreElement =
    document.getElementById("playerScore");

const blackjackResult =
    document.getElementById("blackjackResult");

const dealButton =
    document.getElementById("dealButton");

const hitButton =
    document.getElementById("hitButton");

const standButton =
    document.getElementById("standButton");


let deck = [];
let dealerCards = [];
let playerCards = [];
let blackjackInProgress = false;


// =========================
// CRIAR E EMBARALHAR BARALHO
// =========================

function createDeck() {

    const newDeck = [];

    for (const suit of SUITS) {

        for (const rank of RANKS) {

            newDeck.push({ rank, suit });

        }

    }

    return newDeck;
}


function shuffleDeck(cards) {

    for (let i = cards.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [cards[i], cards[j]] =
            [cards[j], cards[i]];

    }

    return cards;
}


function drawCard() {

    if (deck.length === 0) {

        deck = shuffleDeck(createDeck());

    }

    return deck.pop();
}


// =========================
// PONTUAÇÃO DA MÃO
// =========================

function cardValue(card) {

    if (card.rank === "A") return 11;

    if (
        card.rank === "J" ||
        card.rank === "Q" ||
        card.rank === "K"
    ) {
        return 10;
    }

    return parseInt(card.rank, 10);
}


function handScore(cards) {

    let score = 0;
    let aces = 0;

    cards.forEach(card => {

        score += cardValue(card);

        if (card.rank === "A") {
            aces++;
        }

    });


    while (score > 21 && aces > 0) {

        score -= 10;

        aces--;

    }

    return score;
}


// =========================
// VÍDEO PÔQUER
// =========================

const POKER_BET = 15;

const POKER_PAYOUTS = {
    "Royal Flush": 500,
    "Straight Flush": 150,
    "Quadra": 75,
    "Full House": 40,
    "Flush": 30,
    "Sequência": 25,
    "Trinca": 15,
    "Dois Pares": 10,
    "Valetes ou Melhor": 5,
    "Nada": 0
};


const pokerHandElement =
    document.getElementById("pokerHand");

const pokerResult =
    document.getElementById("pokerResult");

const pokerDealButton =
    document.getElementById("pokerDealButton");

const pokerDrawButton =
    document.getElementById("pokerDrawButton");


let pokerDeck = [];
let pokerHandCards = [];
let pokerHeld = [];
let pokerPhase = "idle"; // "idle" | "holding"


function pokerDrawCard() {

    if (pokerDeck.length === 0) {

        pokerDeck = shuffleDeck(createDeck());

    }

    return pokerDeck.pop();
}


// =========================
// RENDERIZAR MÃO DO PÔQUER
// =========================

function renderPokerHand(clickable) {

    pokerHandElement.innerHTML = "";

    pokerHandCards.forEach((card, index) => {

        const cardElement = renderCard(card, false);

        cardElement.classList.add("poker-card");

        if (clickable) {
            cardElement.classList.add("selectable");
        }

        if (pokerHeld[index]) {
            cardElement.classList.add("held");
        }

        if (clickable) {

            cardElement.addEventListener("click", function () {

                if (pokerPhase !== "holding") return;

                pokerHeld[index] = !pokerHeld[index];

                renderPokerHand(true);

            });

        }

        pokerHandElement.appendChild(cardElement);

    });

}


// =========================
// AVALIAR MÃO DO PÔQUER
// =========================

function rankValue(rank) {

    if (rank === "A") return 14;
    if (rank === "K") return 13;
    if (rank === "Q") return 12;
    if (rank === "J") return 11;

    return parseInt(rank, 10);
}


function evaluatePokerHand(cards) {

    const values = cards
        .map(card => rankValue(card.rank))
        .sort((a, b) => a - b);

    const suits = cards.map(card => card.suit);

    const isFlush =
        suits.every(suit => suit === suits[0]);


    const uniqueValues = [...new Set(values)];

    let isStraight = false;

    if (uniqueValues.length === 5) {

        const isSequential =
            values[4] - values[0] === 4;

        // Sequência baixa: A,2,3,4,5
        const isLowAceStraight =
            JSON.stringify(values) ===
            JSON.stringify([2, 3, 4, 5, 14]);

        isStraight = isSequential || isLowAceStraight;

    }


    const counts = {};

    values.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });

    const countValues =
        Object.values(counts).sort((a, b) => b - a);


    if (isStraight && isFlush && values[4] === 14 && values[0] === 10) {
        return "Royal Flush";
    }

    if (isStraight && isFlush) {
        return "Straight Flush";
    }

    if (countValues[0] === 4) {
        return "Quadra";
    }

    if (countValues[0] === 3 && countValues[1] === 2) {
        return "Full House";
    }

    if (isFlush) {
        return "Flush";
    }

    if (isStraight) {
        return "Sequência";
    }

    if (countValues[0] === 3) {
        return "Trinca";
    }

    if (countValues[0] === 2 && countValues[1] === 2) {
        return "Dois Pares";
    }

    if (countValues[0] === 2) {

        const pairValue = Number(
            Object.keys(counts).find(
                key => counts[key] === 2
            )
        );

        if (pairValue >= 11) {
            return "Valetes ou Melhor";
        }

    }

    return "Nada";
}


// =========================
// APOSTAR (DISTRIBUIR MÃO)
// =========================

pokerDealButton.addEventListener(
    "click",
    function () {

        if (pokerPhase === "holding") return;


        if (!currentUser) {

            showToast(
                "⚠️ Faça login primeiro."
            );

            return;
        }


        if (credits < POKER_BET) {

            pokerResult.textContent =
                "❌ Você não possui créditos suficientes.";

            showToast(
                "❌ Créditos insuficientes."
            );

            return;
        }


        credits -= POKER_BET;

        stats.games++;
        stats.collected += POKER_BET;

        saveStats();

        updateCredits();


        pokerDeck = shuffleDeck(createDeck());

        pokerHandCards = [
            pokerDrawCard(),
            pokerDrawCard(),
            pokerDrawCard(),
            pokerDrawCard(),
            pokerDrawCard()
        ];

        pokerHeld = [false, false, false, false, false];

        pokerPhase = "holding";

        pokerDealButton.disabled = true;
        pokerDrawButton.disabled = false;


        renderPokerHand(true);


        pokerResult.textContent =
            "🃏 Selecione as cartas para SEGURAR e clique em TROCAR CARTAS.";

    }
);


// =========================
// TROCAR CARTAS
// =========================

pokerDrawButton.addEventListener(
    "click",
    function () {

        if (pokerPhase !== "holding") return;


        pokerHandCards = pokerHandCards.map(
            (card, index) =>
                pokerHeld[index] ? card : pokerDrawCard()
        );


        renderPokerHand(false);


        const handName =
            evaluatePokerHand(pokerHandCards);

        const reward =
            POKER_PAYOUTS[handName] || 0;


        if (reward > 0) {

            credits += reward;

            updateCredits();

            if (handName === "Quadra" || handName === "Straight Flush" || handName === "Royal Flush") {
                stats.jackpots++;
                saveStats();
            }

        }


        const message =
            reward > 0
                ? `🎉 ${handName}! +${reward} créditos virtuais!`
                : "😢 Nada feito. Você perdeu a aposta.";


        pokerResult.textContent = message;

        statusElement.textContent = message;

        showToast(message);


        pokerPhase = "idle";

        pokerDealButton.disabled = false;
        pokerDrawButton.disabled = true;

    }
);


// =========================
// RENDERIZAR CARTAS
// =========================

function renderCard(card, hidden) {

    const cardElement =
        document.createElement("div");

    cardElement.classList.add("card");


    if (hidden) {

        cardElement.classList.add("card-back");

        cardElement.textContent = "🂠";

        return cardElement;
    }


    const isRed =
        card.suit === "♥" ||
        card.suit === "♦";

    cardElement.classList.add(
        isRed ? "card-red" : "card-black"
    );

    cardElement.textContent =
        `${card.rank}${card.suit}`;

    return cardElement;
}


function renderHands(revealDealer) {

    dealerHandElement.innerHTML = "";
    playerHandElement.innerHTML = "";


    dealerCards.forEach((card, index) => {

        const hidden =
            !revealDealer && index === 1;

        dealerHandElement.appendChild(
            renderCard(card, hidden)
        );

    });


    playerCards.forEach(card => {

        playerHandElement.appendChild(
            renderCard(card, false)
        );

    });


    playerScoreElement.textContent =
        `(${handScore(playerCards)})`;

    dealerScoreElement.textContent =
        revealDealer
            ? `(${handScore(dealerCards)})`
            : `(${cardValue(dealerCards[0])} + ?)`;
}


// =========================
// FIM DE RODADA
// =========================

function endBlackjackRound(message, payout) {

    if (payout > 0) {

        credits += payout;

        updateCredits();

    }


    renderHands(true);


    blackjackResult.textContent = message;

    statusElement.textContent = message;

    showToast(message);


    blackjackInProgress = false;

    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
}


function isBlackjack(cards) {

    return (
        cards.length === 2 &&
        handScore(cards) === 21
    );
}


// =========================
// APOSTAR / DISTRIBUIR CARTAS
// =========================

dealButton.addEventListener(
    "click",
    function () {

        if (blackjackInProgress) return;


        if (!currentUser) {

            showToast(
                "⚠️ Faça login primeiro."
            );

            return;
        }


        if (credits < BLACKJACK_COST) {

            blackjackResult.textContent =
                "❌ Você não possui créditos suficientes.";

            showToast(
                "❌ Créditos insuficientes."
            );

            return;
        }


        credits -= BLACKJACK_COST;

        stats.games++;
        stats.collected += BLACKJACK_COST;

        saveStats();

        updateCredits();


        deck = shuffleDeck(createDeck());

        dealerCards = [drawCard(), drawCard()];
        playerCards = [drawCard(), drawCard()];


        blackjackInProgress = true;

        dealButton.disabled = true;
        hitButton.disabled = false;
        standButton.disabled = false;


        renderHands(false);


        if (isBlackjack(playerCards)) {

            // Blackjack natural paga 2,5x a aposta
            const reward =
                Math.round(BLACKJACK_COST * 2.5);

            endBlackjackRound(
                `🎉 BLACKJACK! +${reward} créditos virtuais!`,
                reward
            );

            return;
        }


        blackjackResult.textContent =
            "🃏 Sua vez: peça carta ou pare.";

    }
);


// =========================
// PEDIR CARTA
// =========================

hitButton.addEventListener(
    "click",
    function () {

        if (!blackjackInProgress) return;


        playerCards.push(drawCard());

        const score = handScore(playerCards);

        renderHands(false);


        if (score > 21) {

            endBlackjackRound(
                "😢 Você estourou! Perdeu a aposta.",
                0
            );

            return;
        }


        if (score === 21) {

            standButton.click();

        }

    }
);


// =========================
// PARAR (VEZ DO DEALER)
// =========================

standButton.addEventListener(
    "click",
    function () {

        if (!blackjackInProgress) return;


        hitButton.disabled = true;
        standButton.disabled = true;


        while (handScore(dealerCards) < 17) {

            dealerCards.push(drawCard());

        }


        const playerScore = handScore(playerCards);
        const dealerScore = handScore(dealerCards);


        renderHands(true);


        if (
            dealerScore > 21 ||
            playerScore > dealerScore
        ) {

            // Vitória normal paga 2x a aposta
            const reward = BLACKJACK_COST * 2;

            endBlackjackRound(
                `🎉 Você venceu! +${reward} créditos virtuais!`,
                reward
            );

        }

        else if (playerScore === dealerScore) {

            endBlackjackRound(
                "🤝 Empate! Sua aposta foi devolvida.",
                BLACKJACK_COST
            );

        }

        else {

            endBlackjackRound(
                "😢 O dealer venceu. Você perdeu a aposta.",
                0
            );

        }

    }
);


// =========================
// TECLA ESPAÇO
// =========================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space" &&
            gameScreen.style.display !== "none"
        ) {

            event.preventDefault();

            if (!isSpinning) {

                spin();

            }

        }

    }
);


// =========================
// PAINEL ADMINISTRATIVO
// =========================

const adminModal =
    document.getElementById("adminModal");

const closeAdmin =
    document.getElementById("closeAdmin");

const totalUsers =
    document.getElementById("totalUsers");

const totalAccess =
    document.getElementById("totalAccess");

const totalGames =
    document.getElementById("totalGames");

const totalJackpots =
    document.getElementById("totalJackpots");

const totalCollected =
    document.getElementById("totalCollected");

const exportUsers =
    document.getElementById("exportUsers");


// =========================
// ATUALIZAR ADMIN
// =========================

function updateAdminStats() {

    if (totalUsers) {
        totalUsers.textContent =
            stats.users;
    }

    if (totalAccess) {
        totalAccess.textContent =
            stats.accesses;
    }

    if (totalGames) {
        totalGames.textContent =
            stats.games;
    }

    if (totalJackpots) {
        totalJackpots.textContent =
            stats.jackpots;
    }

    if (totalCollected) {
        totalCollected.textContent =
            stats.collected;
    }

}


// =========================
// ABRIR ADMIN
// =========================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "a"
        ) {

            updateAdminStats();

            adminModal.style.display =
                "flex";

        }

    }
);


// =========================
// FECHAR ADMIN
// =========================

closeAdmin.addEventListener(
    "click",
    function () {

        adminModal.style.display =
            "none";

    }
);


adminModal.addEventListener(
    "click",
    function (event) {

        if (event.target === adminModal) {

            adminModal.style.display =
                "none";

        }

    }
);


// =========================
// EXPORTAR USUÁRIOS
// =========================

exportUsers.addEventListener(
    "click",
    function () {

        if (users.length === 0) {

            showToast(
                "⚠️ Nenhum usuário cadastrado."
            );

            return;
        }


        const data =
            JSON.stringify(
                users,
                null,
                2
            );


        const blob =
            new Blob(
                [data],
                {
                    type: "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "usuarios-pontoplay.json";


        link.click();


        URL.revokeObjectURL(url);


        showToast(
            "📥 Usuários exportados!"
        );

    }
);


// =========================
// INICIALIZAÇÃO
// =========================

updateCredits();

updateAdminStats();


// Garante que a tela de jogo
// comece escondida

gameScreen.style.display = "none";

loginScreen.style.display = "flex";