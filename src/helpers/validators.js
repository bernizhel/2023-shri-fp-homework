/* eslint-disable react-hooks/rules-of-hooks */

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    allPass,
    compose,
    equals,
    filter,
    gte,
    length,
    pipe,
    prop,
    complement,
    values,
    identity,
    countBy,
    converge,
    any,
    omit,
} from "ramda";

// Проверки на цвет
const isWhite = equals("white");
const isRed = equals("red");
const isOrange = equals("orange");
const isGreen = equals("green");
const isBlue = equals("blue");

// Получить цвет формы из объекта
const getStar = prop("star");
const getSquare = prop("square");
const getTriangle = prop("triangle");
const getCircle = prop("circle");

// Конкретные проверки
const isStarRed = compose(isRed, getStar);
const isStarWhite = compose(isWhite, getStar);
const isStarNotRed = complement(isStarRed);
const isStarNotWhite = complement(isStarWhite);
const isSquareGreen = compose(isGreen, getSquare);
const isSquareOrange = compose(isOrange, getSquare);
const isSquareWhite = compose(isWhite, getSquare);
const isSquareNotWhite = complement(isSquareWhite);
const isTriangleWhite = compose(isWhite, getTriangle);
const isTriangleNotWhite = complement(isTriangleWhite);
const isTriangleGreen = compose(isGreen, getTriangle);
const isCircleWhite = compose(isWhite, getCircle);
const isCircleBlue = compose(isBlue, getCircle);

// Проверки на количество
const equalsToZero = equals(0);
const isEqualToOne = equals(1);
const isEqualToTwo = equals(2);
const isGreaterThanOrEqualsToTwo = gte(__, 2);
const isGreaterThanOrEqualsToThree = gte(__, 3);

// Логика преобразования объекта в вид Record<"red" | "blue" | "green" | "white", number>
// и работа с ним
const countEachColor = pipe(values, countBy(identity));
const getRed = prop("red");
const getBlue = prop("blue");
const omitWhite = omit(["white"]);

// Логика работы с зелеными формами (2, 6)
const filterGreenShapes = filter(isGreen);
const countGreenShapes = pipe(values, filterGreenShapes, length);
const hasTwoGreenShapes = compose(isEqualToTwo, countGreenShapes);

// Проверка, что все формы одного цвета (7, 9)
const isNotColor = (color) => complement(equals(color));
const doesAllHaveColor = (color) => pipe(values, filter(isNotColor(color)), length, equalsToZero);

//
// Функции проверки
//

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isTriangleWhite, isCircleWhite, isStarRed, isSquareGreen]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(countGreenShapes, isGreaterThanOrEqualsToTwo);

// 3. Количество красных фигур равно кол-ву синих.
const numberOfRedEqualsToNumberOfBlue = converge(equals, [getRed, getBlue]);
export const validateFieldN3 = pipe(countEachColor, numberOfRedEqualsToNumberOfBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isCircleBlue, isStarRed, isSquareOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const isAnyGreaterOrEqualThree = any(isGreaterThanOrEqualsToThree);
export const validateFieldN5 = pipe(countEachColor, omitWhite, values, isAnyGreaterOrEqualThree);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const hasOneRedShape = compose(isEqualToOne, getRed, countEachColor);
export const validateFieldN6 = allPass([isTriangleGreen, hasTwoGreenShapes, hasOneRedShape]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = doesAllHaveColor("orange");

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isStarNotRed, isStarNotWhite]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = doesAllHaveColor("green");

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const isTriangleColorEqualsToSquareColor = converge(equals, [getTriangle, getSquare]);
const isTriangleAndSquareNotWhite = allPass([isTriangleNotWhite, isSquareNotWhite]);
export const validateFieldN10 = allPass([isTriangleAndSquareNotWhite, isTriangleColorEqualsToSquareColor]);
