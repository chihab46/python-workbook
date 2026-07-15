import type { LocalizedText } from "./types";

export const questionConcepts: Record<string, LocalizedText> = {
  "variables-01": {
    en: "A variable gives a value a name, so the program can remember and reuse it.",
    fr: "Une variable donne un nom à une valeur pour que le programme puisse la mémoriser et la réutiliser.",
  },
  "variables-02": {
    en: "Assigning a new value to a variable replaces the value it stored before.",
    fr: "Affecter une nouvelle valeur à une variable remplace la valeur qu'elle contenait auparavant.",
  },
  "variables-03": {
    en: "An expression can combine stored values to calculate and save a new value.",
    fr: "Une expression peut combiner des valeurs mémorisées pour calculer et stocker une nouvelle valeur.",
  },
  "variables-04": {
    en: "Variables and arithmetic operators can be used together to store the result of a calculation.",
    fr: "Les variables et les opérateurs de calcul peuvent être utilisés ensemble pour stocker un résultat.",
  },
  "variables-05": {
    en: "Python variable names follow rules: they cannot contain spaces or start with a number.",
    fr: "Les noms de variables Python suivent des règles : ils ne peuvent pas contenir d'espace ni commencer par un chiffre.",
  },
  "variables-06": {
    en: "Python reads instructions from top to bottom, and each update uses the variable's current value.",
    fr: "Python lit les instructions de haut en bas et chaque modification utilise la valeur actuelle de la variable.",
  },
  "variables-07": {
    en: "Copying one variable into another copies its current value; it does not link the two variables forever.",
    fr: "Copier une variable dans une autre copie sa valeur actuelle ; les deux variables ne restent pas liées.",
  },
  "variables-08": {
    en: "After a calculation, each variable keeps its own value until another instruction changes it.",
    fr: "Après un calcul, chaque variable garde sa propre valeur jusqu'à ce qu'une autre instruction la modifie.",
  },
  "types-01": {
    en: "Python uses different types for whole numbers, decimal numbers, text, and true-or-false values.",
    fr: "Python utilise différents types pour les entiers, les nombres décimaux, le texte et les valeurs vrai ou faux.",
  },
  "types-02": {
    en: "Type conversion changes a value from one type to another, such as number-like text into a number.",
    fr: "La conversion change le type d'une valeur, par exemple un texte numérique en nombre.",
  },
  "types-03": {
    en: "Numeric text must be converted before Python can use it as a whole number.",
    fr: "Un texte numérique doit être converti avant que Python puisse l'utiliser comme nombre entier.",
  },
  "types-04": {
    en: "A value that looks like a number can still be text; converting it allows numerical calculations.",
    fr: "Une valeur qui ressemble à un nombre peut être du texte ; la convertir permet de faire des calculs.",
  },
  "types-05": {
    en: "Quotation marks create text, while boolean values represent `True` or `False` directly.",
    fr: "Les guillemets créent du texte, tandis que les booléens représentent directement `True` ou `False`.",
  },
  "types-06": {
    en: "Operators can behave differently with text than they do with numbers.",
    fr: "Les opérateurs peuvent agir différemment sur du texte et sur des nombres.",
  },
  "types-07": {
    en: "Decimal text must be converted to a decimal-number type before it can be used in calculations.",
    fr: "Un texte décimal doit être converti en nombre décimal avant de pouvoir être utilisé dans des calculs.",
  },
  "types-08": {
    en: "The operator used in a calculation can affect the type of the result.",
    fr: "L'opérateur utilisé dans un calcul peut changer le type du résultat.",
  },
  "conditions-01": {
    en: "An `if` / `elif` / `else` chain lets a program choose between several possible paths.",
    fr: "Une chaîne `if` / `elif` / `else` permet au programme de choisir entre plusieurs chemins.",
  },
  "conditions-02": {
    en: "A comparison becomes `True` or `False`, and the program runs the matching branch.",
    fr: "Une comparaison devient `True` ou `False`, puis le programme exécute le bloc correspondant.",
  },
  "conditions-03": {
    en: "Logical operators combine comparisons when a decision depends on more than one rule.",
    fr: "Les opérateurs logiques combinent des comparaisons lorsqu'une décision dépend de plusieurs règles.",
  },
  "conditions-04": {
    en: "Several condition branches can sort a value into one of three or more cases.",
    fr: "Plusieurs branches conditionnelles peuvent classer une valeur dans trois cas ou plus.",
  },
  "conditions-05": {
    en: "A comparison chooses which indented block of code will run.",
    fr: "Une comparaison choisit quel bloc de code indenté sera exécuté.",
  },
  "conditions-06": {
    en: "Checking a value inside a range requires testing both its lower and upper limits.",
    fr: "Vérifier qu'une valeur est dans un intervalle demande de tester sa limite basse et sa limite haute.",
  },
  "conditions-07": {
    en: "A nested condition is an `if` inside another branch, so a second test happens only after the first one passes.",
    fr: "Une condition imbriquée est un `if` dans un autre bloc : le second test arrive seulement après le premier.",
  },
  "conditions-08": {
    en: "Python checks condition branches from top to bottom and stops at the first one that is true.",
    fr: "Python vérifie les conditions de haut en bas et s'arrête à la première qui est vraie.",
  },
  "loops-01": {
    en: "A `for` loop repeats code once for every value produced by `range`.",
    fr: "Une boucle `for` répète du code une fois pour chaque valeur produite par `range`.",
  },
  "loops-02": {
    en: "`range(start, stop, step)` creates a sequence using a start, an excluded stop, and a step.",
    fr: "`range(début, fin, pas)` crée une suite avec un début, une fin exclue et un pas.",
  },
  "loops-03": {
    en: "A counter variable can keep track of how many list items match a condition.",
    fr: "Une variable compteur peut mémoriser combien d'éléments d'une liste respectent une condition.",
  },
  "loops-04": {
    en: "A loop can filter items with a condition and add the matching values to a running total.",
    fr: "Une boucle peut filtrer des éléments avec une condition et ajouter les valeurs choisies à un total.",
  },
  "loops-05": {
    en: "A `for` loop visits the items of a list one at a time, in order.",
    fr: "Une boucle `for` parcourt les éléments d'une liste un par un, dans l'ordre.",
  },
  "loops-06": {
    en: "An accumulator starts with a value and is updated during every turn of a loop.",
    fr: "Un accumulateur commence avec une valeur puis est modifié à chaque tour de boucle.",
  },
  "loops-07": {
    en: "A two-number `range` starts at the first number and stops just before the second.",
    fr: "Un `range` à deux nombres commence au premier et s'arrête juste avant le second.",
  },
  "loops-08": {
    en: "A `while` loop repeats while its condition is true, so a changing variable must eventually stop it.",
    fr: "Une boucle `while` se répète tant que sa condition est vraie ; une variable doit changer pour l'arrêter.",
  },
  "lists-01": {
    en: "List indexes start at 0, so each position number is one less than its place when counting normally.",
    fr: "Les indices d'une liste commencent à 0 : chaque indice vaut un de moins que sa place habituelle.",
  },
  "lists-02": {
    en: "Lists have methods that can add a new item without replacing the existing items.",
    fr: "Les listes ont des méthodes qui peuvent ajouter un nouvel élément sans remplacer les éléments existants.",
  },
  "lists-03": {
    en: "A slice selects several list items from a start index up to, but not including, a stop index.",
    fr: "Une tranche sélectionne plusieurs éléments depuis un indice de départ jusqu'à un indice de fin exclu.",
  },
  "lists-04": {
    en: "A new list can be built step by step by looping through values and adding each new result.",
    fr: "Une nouvelle liste peut être construite étape par étape en parcourant des valeurs et en ajoutant chaque résultat.",
  },
  "lists-05": {
    en: "Python numbers list positions from 0 rather than from 1.",
    fr: "Python numérote les positions d'une liste à partir de 0 et non de 1.",
  },
  "lists-06": {
    en: "Adding an item to a list changes the list while keeping its existing items in order.",
    fr: "Ajouter un élément à une liste modifie la liste tout en gardant les éléments existants dans l'ordre.",
  },
  "lists-07": {
    en: "List slicing uses two indexes to select a section, and the stop index is not included.",
    fr: "Le découpage d'une liste utilise deux indices pour choisir une partie ; l'indice de fin est exclu.",
  },
  "lists-08": {
    en: "A list can be changed by replacing an item at an index and by adding another item.",
    fr: "Une liste peut être modifiée en remplaçant un élément à un indice puis en ajoutant un autre élément.",
  },
};
