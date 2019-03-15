/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name service.gameEngineService
 *
 *  @requires gameService
 *  @requires snakeService
 *  @requires boardService
 *  @requires gameConstants
 *
 *  @description
 *  This service will call draw and update methods from other service and also take care of reset of game
 */
angular.module("snake")
    .factory("gameEngineService", ["gameService", "snakeService", "boardService", "gameConstants",
        function(gameService, snakeService, boardService, gameConstants) {
        "use strict";

            return {

                /**
                 * @ngdoc method
                 * @name service.gameEngineService#draw
                 * @methodOf service.gameEngineService
                 *
                 * @description
                 * Method is consolidated place to call other service draw method
                 */
                draw: function() {
                    gameService.blankScreen();
                    boardService.draw();
                    snakeService.draw();
                },

                /**
                 * @ngdoc method
                 * @name service.gameEngineService#update
                 * @methodOf service.gameEngineService
                 *
                 * @description
                 * Method is consolidated place to call other service update method
                 */
                update: function(animation) {
                    if(animation === 0){
                        snakeService.checkCreateSnake();
                    }

                    snakeService.update(animation);
                },

                /**
                 * @ngdoc method
                 * @name service.gameEngineService#keyPress
                 * @methodOf service.gameEngineService
                 *
                 * @description
                 * Method wil handle reset and resume of game
                 */
                keyPress: function() {
                    // will go in when snake collides with wall or itself and user hit space bar to cont.
                    if(snakeService.isCollided()){
                        snakeService.destroy();
                        //will go in when is game over
                        if(snakeService.getLives().length === 1){
                            boardService.resetLevel();
                        }
                        snakeService.reset();
                    }
                    // will go in while level up
                    if(boardService.isPaused()){
                        //when user finish last level, reset everything
                        if(boardService.getLevel() - 1 === gameConstants.finalLevel){
                            snakeService.destroy();
                            boardService.resetLevel();
                            snakeService.resetLives();
                            snakeService.reset();
                        }
                        //just cont. with next level when user hit space bar
                        boardService.cont();
                    }
                },
            }
        }]);