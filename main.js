let $cells, freeCellsLeft, round, currentPlayer
let cells = []
let symboles = ["x", "circle"]

const $board = document.querySelector("#board")
const $winningMessage = document.querySelector("#winningMessage")
const $winningMessageText = document.querySelector("#winningMessageText")
const $restartButton = document.querySelector("#restartButton")

// Ecoute du bouton
$restartButton.addEventListener('click', () => newGame())

// Ecoute de chaque cellule. Cliquable qu'une seul fois
const addListenerToCells = () => {
    $cells = document.querySelectorAll(".cell")
    $cells.forEach(cell => {
        cell.addEventListener('click', (e) => playerPlay(e.target), {once:true})
    });
}

// Quand un joueur clique sur une case
const playerPlay = (cellTarget) => {
    // Empeche le double execution de cette fonction (bug que j'ai eu)
    if (cellTarget.classList.contains("x") || cellTarget.classList.contains("circle")) return
    
    cellTarget.classList.toggle(symbole()) // On attribue la class à la case
    freeCellsLeft-- // On enlève 1 au reste des cases
    constructCellsArray() // Construction Array des symboles
    verifyWin() // Vérification si partie gagnée
    nextRound() // Passage au round suivant
}

// On construit l'array des symboles
const constructCellsArray = () => {
    cells = [] // On vide le tableau

    // On ajoute chaque symbole dans l'array en fonction des classes
    $cells.forEach(cell => {
        if (cell.classList.contains("x")) cells.push("x")
        else if (cell.classList.contains("circle")) cells.push("circle")
        else cells.push("")
    })
}

// Passage au round suivant
const nextRound = () => {
    round++ // Nouveau round    
    currentPlayer = (currentPlayer === 1) ? 2 : 1 // Changement de joueur
    setSymboleHover() // Changement du symboles en hover
}

// Changement du symboles en hover
const setSymboleHover = () => {
    if (symbole() === symboles[0]) {
        $board.classList.add(symboles[0])
        $board.classList.remove(symboles[1])
    }
    else {
        $board.classList.remove(symboles[0])
        $board.classList.add(symboles[1])
    }
}

// Vérification si partie gagnée
const verifyWin = () => {
    // Si match nul, on affiche endGame et on stop la vérification de win
    if (freeCellsLeft === 0) {
        endGame("nul")
        return
    }
    // On vérifie chaque axe. Si l'un est gagnant => endGame
    // HORIZONTAL
    if (cells[0] === symbole() && cells[1] === symbole() && cells[2] === symbole()) endGame("win")
    if (cells[3] === symbole() && cells[4] === symbole() && cells[5] === symbole()) endGame("win")
    if (cells[6] === symbole() && cells[7] === symbole() && cells[8] === symbole()) endGame("win")
    // VERTICAL
    if (cells[0] === symbole() && cells[3] === symbole() && cells[6] === symbole()) endGame("win")
    if (cells[1] === symbole() && cells[4] === symbole() && cells[7] === symbole()) endGame("win")
    if (cells[2] === symbole() && cells[5] === symbole() && cells[8] === symbole()) endGame("win")
    // OBLIQUE
    if (cells[0] === symbole() && cells[4] === symbole() && cells[8] === symbole()) endGame("win")
    if (cells[2] === symbole() && cells[4] === symbole() && cells[6] === symbole()) endGame("win")
}

// Ecran de fin de partie
const endGame = (t) => {
    let text = (t === "win") ? `Joueur "${symbole()}" gagne !` : `Match nul !`
    $winningMessage.classList.toggle("show")
    $winningMessageText.innerHTML = text
}

// Lorsqu'on recommence une partie
const newGame = () => {
    // Reset des class
    $cells.forEach(cell => {
        cell.classList.remove("x")
        cell.classList.remove("circle")
    })

    // Masque l'ecran de fin de partie
    $winningMessage.classList.remove("show")

    // Initiation de la partie
    init()
}

// Retourne le symbole du joueur actuel
const symbole = () => symboles[currentPlayer-1]

// Premiere fonction executée
const init = () => {
    addListenerToCells() // On écoute les cellules pour les rendre cliquables
    constructCellsArray() // Construction de l'array des symboles
    freeCellsLeft = 9 // Cellules libres  restantes
    round = 0    
    currentPlayer = rand(1, 2) // Tirage du premier joueur (random)

    nextRound()
}

// Tire au sort un nombre entre min et max
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min

init()