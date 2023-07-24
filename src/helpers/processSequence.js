/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
    __,
    allPass,
    andThen,
    assoc,
    compose,
    concat,
    gt,
    ifElse,
    includes,
    lt,
    mathMod,
    otherwise,
    partial,
    partialRight,
    prop,
    tap,
    test,
    complement,
    call,
    lensProp,
    view,
    converge,
    over,
    pipe,
    always,
} from "ramda";
import Api from "../tools/api";

// Утилитарные функции
const isGreaterThanTwo = gt(__, 2);
const isLessThanTen = lt(__, 10);
const getLength = prop("length");
const getResult = prop("result");
const convertToNumber = compose(Math.round, Number);
const convertToString = String;
const square = partialRight(Math.pow, [2]);
const modThree = mathMod(__, 3);

// Валидация
const isBetweenTwoAndTen = allPass([isGreaterThanTwo, isLessThanTen]);
const isLengthBetweenTwoAndTen = compose(isBetweenTwoAndTen, getLength);
const isPositiveNumber = complement(includes("-"));
const isNumber = test(/^[0-9]+(\.[0-9]+)?$/gi);
const validate = allPass([isPositiveNumber, isLengthBetweenTwoAndTen, isNumber]);

// Использование API
const api = new Api();
const thenGetResult = andThen(getResult);
const thenGetLength = andThen(getLength);
const thenSquare = andThen(square);
const thenModThree = andThen(modThree);
const thenConvertToString = andThen(convertToString);
const binaryRepresentationOptions = assoc("number", __, { from: 10, to: 2 });
const getBinaryRepresentation = converge(api.get("https://api.tech/numbers/base"), binaryRepresentationOptions);
const buildURIToAnimalAPI = concat("https://animals.tech/");
const thenBuildURIToAnimalAPI = andThen(buildURIToAnimalAPI);
const getAnimal = api.get(__, {});
const thenGetAnimal = andThen(getAnimal);

// Логика модуля
const lensValue = lensProp("value");
const lensWriteLog = lensProp("writeLog");
const lensHandleSuccess = lensProp("handleSuccess");
const lensHandleError = lensProp("handleError");
const value = view(lensValue);
const writeLog = converge(call, [view(lensWriteLog), value]);
const handleSuccess = view(lensHandleSuccess);
const handleError = view(lensHandleError);
const tappedWriteLog = tap(writeLog);
const validateValue = pipe(value, validate);
const thenTappedWriteLog = andThen(tappedWriteLog);
const thenHandleSuccess = converge(andThen, [handleSuccess]);
const otherwiseHandleError = converge(otherwise, [handleError]);
const handleErrorValidation = converge(call, [handleError, always("ValidationError")]);
const convertValueToNumber = over(lensValue, convertToNumber);
const getBinaryRepresentationOfValue = tap(converge(getBinaryRepresentation));
const thenChangeValue = andThen(over(lensValue, __));

const mainLogic = compose(
    // otherwiseHandleError,
    // thenHandleSuccess,
    // thenGetResult,
    // thenGetAnimal,
    // thenBuildURIToAnimalAPI,
    // thenConvertToString,
    // thenTappedWriteLog,
    // thenModThree,
    // thenTappedWriteLog,
    // thenSquare,
    // thenTappedWriteLog,
    // thenGetLength,
    // thenTappedWriteLog,
    // thenGetResult,
    // thenTappedWriteLog,
    // thenChangeValue,
    // getBinaryRepresentation,
    tappedWriteLog,
    convertValueToNumber
);
const validationLogic = ifElse(validateValue, mainLogic, handleErrorValidation);
const processSequence = compose(validationLogic, tappedWriteLog);

export default processSequence;
