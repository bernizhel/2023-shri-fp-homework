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
} from "ramda";
import Api from "../tools/api";

// Утилитарные функции
const isGreaterThanTwo = gt(__, 2);
const isLessThanTen = lt(__, 10);
const getLength = prop("length");
const getResult = prop("result");

// Валидация
const isBetweenTwoAndTen = allPass([isGreaterThanTwo, isLessThanTen]);
const isLengthBetweenTwoAndTen = compose(isBetweenTwoAndTen, getLength);
const isPositiveNumber = complement(includes("-"));
const isNumber = test(/^[0-9]+(\.[0-9]+)?$/gi);
const validate = allPass([isPositiveNumber, isLengthBetweenTwoAndTen, isNumber]);

// Конвертация в число и в строку
const convertToNumber = compose(Math.round, Number);
const convertToString = String;

// Квадрат числа
const square = partialRight(Math.pow, [2]);

// Остаток от деления на 3
const modThree = mathMod(__, 3);

// Использование API
const api = new Api();
const thenGetResult = andThen(getResult);
const thenGetLength = andThen(getLength);
const thenSquare = andThen(square);
const thenModThree = andThen(modThree);
const thenConvertToString = andThen(convertToString);
const binaryRepresentationOptions = assoc("number", __, { from: 10, to: 2 });
const getBinaryRepresentation = compose(api.get("https://api.tech/numbers/base"), binaryRepresentationOptions);
const buildURIToAnimalAPI = concat("https://animals.tech/");
const thenBuildURIToAnimalAPI = andThen(buildURIToAnimalAPI);
const getAnimal = api.get(__, {});
const thenGetAnimal = andThen(getAnimal);

// Логика приложения
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const tappedWriteLog = tap(writeLog);
    const thenTappedWriteLog = andThen(tappedWriteLog);
    const thenHandleSuccess = andThen(handleSuccess);
    const otherwiseHandleError = otherwise(handleError);
    const handleErrorValidation = partial(handleError, ["ValidationError"]);

    const mainLogic = compose(
        otherwiseHandleError,
        thenHandleSuccess,
        thenGetResult,
        thenGetAnimal,
        thenBuildURIToAnimalAPI,
        thenConvertToString,
        thenTappedWriteLog,
        thenModThree,
        thenTappedWriteLog,
        thenSquare,
        thenTappedWriteLog,
        thenGetLength,
        thenTappedWriteLog,
        thenGetResult,
        getBinaryRepresentation,
        tappedWriteLog,
        convertToNumber
    );
    const validationLogic = ifElse(validate, mainLogic, handleErrorValidation);
    const bootstrapLogic = compose(validationLogic, tappedWriteLog);
    bootstrapLogic(value);

    //     validateValue(value) || handleError("ValidationError");

    //     const convertedValue = convertToNumber(value);
    //     writeLog(convertedValue);

    //     api.get("https://api.tech/numbers/base", { from: 10, to: 2, number: value })
    //         .then(({ result }) => {
    //             writeLog(result);
    //             writeLog(result.length);
    //             writeLog(square(result.length));
    //             const remainder = modThree(square(result.length));
    //             writeLog(remainder);
    //             return remainder;
    //         })
    //         .then((remainder) => {
    //             api.get("https://animals.tech/" + String(remainder), {}).then((data) => handleSuccess(data.result));
    //         });
};

export default processSequence;
