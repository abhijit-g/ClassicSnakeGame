/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name constant.gameConstants
 *
 *
 *  @description
 *  This service will help to store game constants
 */
angular.module("snake")
    .constant("gameConstants", {
        speed: 5,
        snakeSize: 20,
        brickSize: 20,
        eggSize: 20,
        eggPerLevel: 35,
        finalLevel: 5
    });