let cellulesRestantes // Nombre de cellules restantes (pour vérifier si match nul)
let currentPlayer // Joueur actuel. Utilisé pour connaitre son nom, symbole et score
let cellsPlayed = [] // Utilisé pour tester les conditions de victoires ["x", "circle", "", "", ...]
// Noms, symboles et socres des joueurs
let players = [
    {nom: "", symbole: "x", score: 0},
    {nom: "", symbole: "circle", score: 0},
]

// ---------
// SELECTORS
// ---------
const $cells = document.querySelectorAll(".cell")
const $board = document.querySelector("#board")
const $winningMessage = document.querySelector("#winningMessage")
const $winningMessageText = document.querySelector("#winningMessageText")
const $restartButton = document.querySelector("#restartButton")
const $formPopup = document.querySelector(".form_popup")
const $formPseudo = document.querySelector("#formPseudo")
const $textZone = document.querySelector("#textZone")

// ---------
// LISTENERS
// ---------
// Ecoute du formulaire. A la soumisson, on récupère les pseudos et on lance la partie
$formPseudo.addEventListener('submit', e => {
    // On désactive le comportement par defaut
    e.preventDefault() 

    // Si pseudo vide, on remplace par "Anonymous"
    players[0].nom = (e.target[0].value === "") ? "Anonymous" : e.target[0].value
    players[1].nom = (e.target[1].value === "") ? "Anonymous" : e.target[1].value

    // On masque le formulaire
    $formPopup.classList.remove("show")

    // On lance la partie
    nouvellePartie()
})
// Ecoute des cellules. Au clique, on execute la fonction playerClick
$cells.forEach(c => c.addEventListener('click', e => playerClick(e.target), {once:true}))
// Ecoute du bouton 'nouvelle partie'
$restartButton.addEventListener('click', () => nouvellePartie())

// (1) Lancement d'une partie. Executée après l'envoi du formulaire ou quand une partie est terminée.
const nouvellePartie = () => {
    cellulesRestantes = 9 // Cellules libres restantes
    currentPlayer = rand(1, 2) // Tirage du premier joueur (random)

    // Reset des class des cellules
    $cells.forEach(c => {
        c.classList.remove("x")
        c.classList.remove("circle")
    })

    // On ré-écoute les cellules (a chaque nouvelle partie pour réinitialiser le "once:true")
    $cells.forEach(c => c.addEventListener('click', (e) => playerClick(e.target), {once:true}))

    // Masque l'ecran de fin de partie
    $winningMessage.classList.remove("show")

    nextRound() // On passe au round 1
}

// (2) Quand un joueur clique sur une case
const playerClick = (cellTarget) => {
    // Empeche le double execution de cette fonction (bug que j'ai eu)
    if (cellTarget.classList.contains("x") || cellTarget.classList.contains("circle")) return
    
    // On attribue la class à la cellule
    cellTarget.classList.toggle(players[currentPlayer-1].symbole)

    // On enlève 1 aux cellules retantes
    cellulesRestantes-- 
    
    // On génère un array de chaque symbole joué
    // Cet array sert aux tests des conditions de victoire
    cellsPlayed = []
    $cells.forEach(cell => {
        if (cell.classList.contains("x")) cellsPlayed.push("x")
        else if (cell.classList.contains("circle")) cellsPlayed.push("circle")
        else cellsPlayed.push("")
    })

    verifyWin() // Vérification si partie gagnée
    nextRound() // Passage au round suivant
}

// (3a) Vérification si partie gagnée
const verifyWin = () => {
    // On vérifie chaque axe. Si l'un est gagnant => ecran de fin
    // HORIZONTAL
    if (cellsPlayed[0] === getCurrentSymbole() && cellsPlayed[1] === getCurrentSymbole() && cellsPlayed[2] === getCurrentSymbole()) screenEndGame("win")
    else if (cellsPlayed[3] === getCurrentSymbole() && cellsPlayed[4] === getCurrentSymbole() && cellsPlayed[5] === getCurrentSymbole()) screenEndGame("win")
    else if (cellsPlayed[6] === getCurrentSymbole() && cellsPlayed[7] === getCurrentSymbole() && cellsPlayed[8] === getCurrentSymbole()) screenEndGame("win")
    // VERTICAL
    else if (cellsPlayed[0] === getCurrentSymbole() && cellsPlayed[3] === getCurrentSymbole() && cellsPlayed[6] === getCurrentSymbole()) screenEndGame("win")
    else if (cellsPlayed[1] === getCurrentSymbole() && cellsPlayed[4] === getCurrentSymbole() && cellsPlayed[7] === getCurrentSymbole()) screenEndGame("win")
    else if (cellsPlayed[2] === getCurrentSymbole() && cellsPlayed[5] === getCurrentSymbole() && cellsPlayed[8] === getCurrentSymbole()) screenEndGame("win")
    // OBLIQUE
    else if (cellsPlayed[0] === getCurrentSymbole() && cellsPlayed[4] === getCurrentSymbole() && cellsPlayed[8] === getCurrentSymbole()) screenEndGame("win")
    else if (cellsPlayed[2] === getCurrentSymbole() && cellsPlayed[4] === getCurrentSymbole() && cellsPlayed[6] === getCurrentSymbole()) screenEndGame("win")
    // Si match nul et que la partie n'est pas terminée
    else if (cellulesRestantes === 0) {
        screenEndGame("nul")
    }
    else {}
}

// (3b) Ecran de fin de partie si partie terminée
// 'typeEcran' changera le comportement de la fonction
const screenEndGame = (typeEcran) => {
    let text = (typeEcran === "win") ? `${players[currentPlayer-1].nom} gagne !` : `Match nul !`
    $winningMessage.classList.toggle("show")
    $winningMessageText.innerHTML = text

    // On ajoute 1 point au joueur gagnant
    if (typeEcran === "win") players[currentPlayer-1].score++
}

// (4) Passage au round suivant
const nextRound = () => {
    // Changement du joueur
    currentPlayer = (currentPlayer === 1) ? 2 : 1

    // Génération du texte dans l'HTML (joueurs actuel, score)
    $textZone.innerHTML = `
        Au tour de <strong>${players[currentPlayer-1].nom}</strong><br>
        ${players[0].nom} : ${players[0].score} point(s)<br>
        ${players[1].nom} : ${players[1].score} point(s)`
    
    // Changement du symbole HOVER
    if (getCurrentSymbole() === "x") {
        $board.classList.add("x")
        $board.classList.remove("circle")
    }
    else {
        $board.classList.remove("x")
        $board.classList.add("circle")
    }
}

// Retourne le symbole du joueur actuel
const getCurrentSymbole = () => players[currentPlayer-1].symbole

// Tire au sort un nombre entre min et max
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min